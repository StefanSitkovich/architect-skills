#!/usr/bin/env node
/**
 * Doc structure + SPA-safety linter (zero dependencies, Node 18+).
 *
 * Validates that a Markdown doc (a) carries the section structure its skill
 * mandates and (b) won't break the serve-docs SPA: closed/valid Mermaid
 * fences, resolvable relative links, and basic Markdown well-formedness.
 *
 *   Usage:  node lint.mjs <file.md|dir> [more...]
 *   Exit :  non-zero if any ERROR is found (warnings never fail).
 *
 * The SCHEMAS table is the only thing that differs between copies of this
 * script: each doc-producing skill carries the schema(s) for its own docs.
 * This copy (the `draft-plan` skill) carries roadmap.md and user-stories.md;
 * the shared checks below are identical in every copy.
 */
import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { resolve, dirname, basename, join, extname } from 'node:path';

// ---------------------------------------------------------------------------
// Per-doc structural schemas. Keyed by lowercased basename; a `dir:<name>`
// key matches any file whose parent directory has that name (e.g. entities/).
// ---------------------------------------------------------------------------
const SCHEMAS = {
  'roadmap.md': {
    kind: 'entries',
    entries: {
      headingLevel: 2, headingPattern: /^Milestone\s+\d+\b/i, example: '## Milestone 1 — Title',
      requiredFields: ['Goal', 'Scope', 'Depends on'],
    },
  },
  'user-stories.md': {
    kind: 'entries',
    entries: {
      headingLevel: 4, headingPattern: /.+[—–-]\s*\S+/, example: '#### M1-1 — Title',
      requiredFields: ['As a', 'I want', 'so that', 'Acceptance Criteria'],
    },
  },
};

// ---------------------------------------------------------------------------
// Shared parsing + checks (identical across every copy of this script).
// ---------------------------------------------------------------------------
const MERMAID_KW = ['graph', 'flowchart', 'sequencediagram', 'classdiagram',
  'statediagram', 'statediagram-v2', 'erdiagram', 'journey', 'gantt', 'pie',
  'mindmap', 'timeline', 'gitgraph', 'quadrantchart', 'requirementdiagram',
  'c4context', 'c4container', 'c4component', 'c4dynamic', 'c4deployment',
  'sankey-beta', 'xychart-beta', 'block-beta'];

const err = (line, msg) => ({ sev: 'ERROR', line, msg });
const warn = (line, msg) => ({ sev: 'WARN', line, msg });
const norm = (s) => s.toLowerCase().replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
const escapeReg = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function parseDoc(text) {
  const lines = text.split(/\r?\n/);
  const headings = [];
  const fences = [];
  let inFence = false, fStart = -1, fLang = '', fBody = [], fChar = '', fLen = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!inFence) {
      const open = line.match(/^(\s*)(`{3,}|~{3,})(.*)$/);
      if (open) {
        inFence = true; fStart = i; fChar = open[2][0]; fLen = open[2].length;
        fLang = open[3].trim().toLowerCase(); fBody = [];
        continue;
      }
      const h = line.match(/^(#{1,6})\s+(.+?)\s*#*\s*$/);
      if (h) headings.push({ level: h[1].length, text: h[2].trim(), line: i + 1 });
    } else {
      const close = line.match(/^(\s*)(`{3,}|~{3,})\s*$/);
      if (close && close[2][0] === fChar && close[2].length >= fLen) {
        fences.push({ lang: fLang, start: fStart, end: i, body: fBody.join('\n') });
        inFence = false;
        continue;
      }
      fBody.push(line);
    }
  }
  return { lines, headings, fences, unclosedFence: inFence ? fStart : -1 };
}

function checkMermaid(f, problems) {
  const body = f.body.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('%%'));
  if (body.length === 0) { problems.push(err(f.start + 1, 'empty ```mermaid block')); return; }
  const first = body[0].toLowerCase();
  const ok = MERMAID_KW.some((k) => first === k || first.startsWith(k + ' ') || first.startsWith(k));
  if (!ok) problems.push(err(f.start + 1, `mermaid block doesn't start with a known diagram type (got "${body[0].split(/\s+/)[0]}")`));
}

function checkLinks(file, parsed, problems) {
  const dir = dirname(file);
  const fenceLines = new Set();
  for (const f of parsed.fences) for (let i = f.start; i <= f.end; i++) fenceLines.add(i);
  const linkRe = /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  parsed.lines.forEach((line, idx) => {
    if (fenceLines.has(idx)) return;
    const clean = line.replace(/`[^`]*`/g, '');
    let m;
    while ((m = linkRe.exec(clean))) {
      let target = m[1];
      if (/^[a-z][a-z0-9+.-]*:/i.test(target)) continue; // http:, mailto:, etc.
      if (target.startsWith('#') || target.startsWith('//')) continue;
      target = target.split('#')[0].split('?')[0];
      if (!target) continue;
      let decoded; try { decoded = decodeURIComponent(target); } catch { decoded = target; }
      if (!existsSync(resolve(dir, decoded))) problems.push(err(idx + 1, `broken link → ${m[1]} (no file at ${decoded})`));
    }
  });
}

function checkGeneric(file, parsed, problems) {
  const h1 = parsed.headings.filter((h) => h.level === 1);
  if (h1.length === 0) problems.push(warn(null, 'no H1 title (`# Title`) — the SPA would title the page from the filename'));
  else if (h1.length > 1) problems.push(warn(h1[1].line, `multiple H1 headings (${h1.length}); the SPA titles the page from the first`));
  if (parsed.unclosedFence >= 0) problems.push(err(parsed.unclosedFence + 1, 'unclosed code fence (```), would swallow the rest of the page'));
  for (const f of parsed.fences) if (f.lang === 'mermaid') checkMermaid(f, problems);
  checkLinks(file, parsed, problems);
}

function checkSections(schema, parsed, problems) {
  const atLevel = parsed.headings.filter((h) => h.level === schema.level);
  const present = new Set(atLevel.map((h) => norm(h.text)));
  for (const req of schema.required) {
    if (!present.has(norm(req))) problems.push(err(null, `missing required H${schema.level} section "${req}" (scaffold the header; capture an unknown as a TBD rather than omitting it)`));
  }
  const allowed = new Set([...(schema.required || []), ...(schema.optional || [])].map(norm));
  for (const h of atLevel) {
    if (!allowed.has(norm(h.text))) problems.push(warn(h.line, `unexpected H${schema.level} section "${h.text}" (not in this doc's schema)`));
  }
}

function checkEntries(schema, parsed, problems) {
  const e = schema.entries;
  const atLevel = parsed.headings.filter((h) => h.level === e.headingLevel);
  const matching = atLevel.filter((h) => e.headingPattern.test(h.text));
  if (matching.length === 0) {
    problems.push(err(null, `no entries found at H${e.headingLevel} matching the required format (e.g. "${e.example}")`));
    return;
  }
  for (const h of atLevel) {
    if (!e.headingPattern.test(h.text)) problems.push(warn(h.line, `H${e.headingLevel} heading "${h.text}" doesn't match the entry format (e.g. "${e.example}")`));
  }
  for (const entry of matching) {
    let endLine = parsed.lines.length;
    for (const h of parsed.headings) { if (h.line > entry.line && h.level <= e.headingLevel) { endLine = h.line - 1; break; } }
    const body = parsed.lines.slice(entry.line, endLine).join('\n');
    for (const field of e.requiredFields) {
      if (!new RegExp('\\*\\*' + escapeReg(field) + '\\b', 'i').test(body)) {
        problems.push(err(entry.line, `entry "${entry.text}" is missing **${field}**`));
      }
    }
  }
}

function schemaFor(file) {
  const parent = basename(dirname(file)).toLowerCase();
  if (SCHEMAS['dir:' + parent]) return SCHEMAS['dir:' + parent];
  return SCHEMAS[basename(file).toLowerCase()] || null;
}

function walkMd(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walkMd(full));
    else if (extname(name).toLowerCase() === '.md') out.push(full);
  }
  return out;
}

function collectFiles(paths) {
  const out = [];
  for (const p of paths) {
    if (!existsSync(p)) { console.error(`skip (not found): ${p}`); continue; }
    if (statSync(p).isDirectory()) out.push(...walkMd(p));
    else if (extname(p).toLowerCase() === '.md') out.push(p);
  }
  return out;
}

function report(file, schema, problems) {
  const tag = schema ? '' : ' (no schema — generic checks only)';
  if (problems.length === 0) { console.log(`✓ ${file}${tag}`); return; }
  console.log(`\n${file}${tag}`);
  for (const p of problems.sort((a, b) => (a.line || 0) - (b.line || 0))) {
    const loc = p.line ? `:${p.line}` : '';
    console.log(`  ${p.sev === 'ERROR' ? '✗ ERROR' : '! WARN '} ${file}${loc} — ${p.msg}`);
  }
}

function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  if (args.length === 0) { console.error('usage: node lint.mjs <file.md|dir> [...]'); process.exit(2); }
  const files = collectFiles(args);
  let errors = 0, warnings = 0;
  for (const file of files) {
    const parsed = parseDoc(readFileSync(file, 'utf8'));
    const schema = schemaFor(file);
    const problems = [];
    if (schema && schema.kind === 'sections') checkSections(schema, parsed, problems);
    else if (schema && schema.kind === 'entries') checkEntries(schema, parsed, problems);
    checkGeneric(file, parsed, problems);
    report(file, schema, problems);
    errors += problems.filter((p) => p.sev === 'ERROR').length;
    warnings += problems.filter((p) => p.sev === 'WARN').length;
  }
  console.log(`\n${files.length} file(s): ${errors} error(s), ${warnings} warning(s).`);
  process.exit(errors > 0 ? 1 : 0);
}

main();
