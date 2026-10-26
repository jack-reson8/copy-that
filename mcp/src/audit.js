// Static skill audit: the same checks as skill-skill's skill_audit.py, in Node so no Python is needed.
// Works on a local skill folder or a GitHub link (repo, folder or SKILL.md). Audited files are data:
// they are only read and pattern-matched, never executed.
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const ENTRY = /\.(py|sh|js|ts|mjs|cjs|swift)$/;
const TEXT = /\.(md|py|sh|js|ts|mjs|cjs|swift)$/;

// ---- sources: a skill is { dir, files: { relPath: text } } ----
function walk(root, rel = "", out = {}) {
  for (const e of fs.readdirSync(path.join(root, rel), { withFileTypes: true })) {
    if (e.name.startsWith(".") || e.name === "node_modules") continue;
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) walk(root, r, out);
    else if (TEXT.test(e.name) || e.name === "SKILL.md") { try { out[r] = fs.readFileSync(path.join(root, r), "utf8"); } catch {} }
    else out[r] = null; // non-text file: present, not read
  }
  return out;
}

function localSkills(p) {
  p = path.resolve(p.replace(/^~(?=$|\/)/, process.env.HOME || "~"));
  if (fs.statSync(p).isFile()) p = path.dirname(p);
  if (fs.existsSync(path.join(p, "SKILL.md"))) return [{ dir: p, name: path.basename(p), files: walk(p) }];
  const found = [];
  const scan = (d, depth) => { if (depth > 5) return; for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    if (!e.isDirectory() || e.name.startsWith(".") || e.name === "node_modules") continue;
    const s = path.join(d, e.name); if (fs.existsSync(path.join(s, "SKILL.md"))) found.push({ dir: s, name: e.name, files: walk(s) }); else scan(s, depth + 1); } };
  scan(p, 0);
  return found;
}

const GH = /github\.com\/([^/\s]+)\/([^/\s#?]+)(?:\/(?:tree|blob)\/([^/\s]+)(?:\/([^\s#?]*))?)?/;
async function gh(url) {
  const r = await fetch(url, { headers: { "user-agent": "copy-that-mcp", accept: "application/vnd.github+json", ...(process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}) } });
  if (!r.ok) throw new Error(`GitHub ${r.status} for ${url}${r.status === 403 ? " (rate limit: set GITHUB_TOKEN)" : ""}`);
  return r;
}
async function githubSkills(link) {
  const m = link.match(GH); if (!m) throw new Error("not a GitHub link");
  let [, owner, repo, ref, sub = ""] = m; repo = repo.replace(/\.git$/, "");
  if (!ref) ref = (await (await gh(`https://api.github.com/repos/${owner}/${repo}`)).json()).default_branch;
  sub = sub.replace(/\/?SKILL\.md$/, "").replace(/\/$/, "");
  const tree = (await (await gh(`https://api.github.com/repos/${owner}/${repo}/git/trees/${ref}?recursive=1`)).json()).tree.filter((t) => t.type === "blob");
  const dirs = tree.map((t) => t.path).filter((p) => p.endsWith("SKILL.md") && (!sub || p === `${sub}/SKILL.md` || p.startsWith(sub + "/"))).map((p) => p.slice(0, -"SKILL.md".length).replace(/\/$/, ""));
  if (!dirs.length) throw new Error(`no SKILL.md under ${owner}/${repo}${sub ? "/" + sub : ""}`);
  const out = [];
  for (const d of dirs.slice(0, 12)) {
    const files = {};
    const mine = tree.filter((t) => d ? t.path.startsWith(d + "/") : true).filter((t) => !dirs.some((o) => o !== d && o.startsWith(d ? d + "/" : "") && o.length > d.length && t.path.startsWith(o + "/")));
    await Promise.all(mine.map(async (t) => { const rel = d ? t.path.slice(d.length + 1) : t.path;
      if (!(TEXT.test(rel) || rel.endsWith("SKILL.md")) || t.size > 400000) { files[rel] = null; return; }
      const r = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${t.path}`); files[rel] = r.ok ? await r.text() : null; }));
    out.push({ dir: `${owner}/${repo}/${d}`, name: d ? d.split("/").pop() : repo, files });
  }
  out.total = dirs.length;
  return out;
}

// ---- checks ----
function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!m) return { error: "missing YAML frontmatter", body: text };
  try { const d = yaml.load(m[1]); if (!d || typeof d !== "object") return { error: "YAML frontmatter must be a mapping", body: text.slice(m[0].length) }; return { meta: d, body: text.slice(m[0].length) }; }
  catch (e) { return { error: `invalid YAML frontmatter (strict parsers such as Codex and PyYAML reject it): ${e.reason || e.message}`, body: text.slice(m[0].length) }; }
}

export function auditSkill({ name: folder, files }) {
  const issues = [], notes = [];
  const text = files["SKILL.md"];
  if (text == null) return { issues: ["no SKILL.md"], notes };
  const { meta, body, error } = frontmatter(text);
  if (error) return { issues: [error], notes };
  const name = meta.name, desc = meta.description;
  if (typeof name !== "string") issues.push("frontmatter name must be a string");
  if (typeof desc !== "string") issues.push("frontmatter description must be a string");
  if (issues.length) return { issues, notes };
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) issues.push(`name "${name}" must be lowercase-hyphen`);
  if (folder && name !== folder) issues.push(`name "${name}" ≠ folder "${folder}"`);
  if (!desc) issues.push("empty description");
  if (desc.length > 1024) issues.push(`description ${desc.length} chars > 1024`);
  if (desc && !/(\bwhen\b|whenever|\btrigger|使用|触发|时用)/i.test(desc)) notes.push('warn: description has no "Use when…" trigger clause (skills under-trigger)');
  // orphans: reference docs and entry scripts nothing points to never get read
  const corpus = Object.entries(files).filter(([r, t]) => t && r !== "SKILL.md" && TEXT.test(r)).map(([, t]) => t).join("\n") + text;
  const orphans = Object.keys(files).filter((r) => /^references\/[^/]+\.md$/.test(r) || (/^scripts\/[^/]+$/.test(r) && ENTRY.test(r))).filter((r) => {
    const b = r.split("/").pop(), stem = b.replace(/\.[^.]+$/, ""), rest = corpus.replace(files[r] || "", "");
    return b !== "__init__.py" && !rest.includes(b) && !new RegExp(`\\b${stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(rest); });
  if (orphans.length) issues.push(`${orphans.length} orphan file(s) nothing points to: ${orphans.slice(0, 5).join(", ")}${orphans.length > 5 ? " …" : ""}`);
  // dangling paths in prose (code fences and example lines are illustrations)
  const prose = text.replace(/```[\s\S]*?```/g, "").split("\n").filter((l) => !/e\.g\.|example|such as|for instance|例如|比如/i.test(l)).join("\n");
  const dangling = [...new Set([...prose.matchAll(/`((?:references|scripts|assets)\/[\w./-]+)`/g)].map((m) => m[1]))].filter((r) => !(r in files) && !Object.keys(files).some((f) => f.startsWith(r.replace(/\/$/, "") + "/"))).sort();
  if (dangling.length) issues.push(`${dangling.length} dangling path(s): ${dangling.slice(0, 5).join(", ")}${dangling.length > 5 ? " …" : ""}`);
  const lines = body.split("\n").length, sections = (body.match(/^##+ .*$/gm) || []).length;
  const produce = (body.match(/\b(write|save|output|produce|render|run|check)\b|→|写|输出|生成|检查|运行|保存|改写/gi) || []).length;
  notes.push(`${lines} body lines, ${sections} sections, ${produce} action/artifact words`);
  const shout = (body.match(/\b(MUST|NEVER|ALWAYS)\b/g) || []).length;
  if (!produce) notes.push("warn: no step produces an artifact or runs a check — the skill may not change output");
  if (shout > 3) notes.push(`warn: ${shout} ALL-CAPS commands — explain the why instead`);
  if (lines > 500) notes.push("warn: SKILL.md body > 500 lines — move detail into references with pointers");
  for (const [r, t] of Object.entries(files)) if (/^references\/[^/]+\.md$/.test(r) && t && t.split("\n").length > 300 && !t.slice(0, 800).includes("## ")) notes.push(`warn: ${r}: ${t.split("\n").length} lines, add a table of contents`);
  return { name, issues, notes };
}

export const score = ({ issues, notes }) => Math.max(0, 100 - 15 * issues.length - 5 * notes.filter((n) => n.startsWith("warn")).length);

export async function audit(target) {
  const skills = GH.test(target) ? await githubSkills(target) : localSkills(target);
  if (!skills.length) throw new Error(`no SKILL.md found in ${target}`);
  const rows = skills.map((s) => { const r = auditSkill(s); return { ...r, folder: s.name, dir: s.dir, score: score(r) }; });
  const md = rows.map((r) => {
    const color = r.score >= 90 ? "brightgreen" : r.score >= 70 ? "yellow" : "red";
    return [`## ${r.folder} — ${r.score}/100`, ...r.issues.map((i) => `- ✗ ${i}`), ...r.notes.map((n) => `- ${n.startsWith("warn") ? "⚠" : "·"} ${n.replace(/^warn: /, "")}`), ...(r.issues.length ? [] : ["- ✓ no blocking issues"]),
      `\nBadge: \`![skill health](https://img.shields.io/badge/skill%20health-${r.score}%2F100-${color})\``].join("\n");
  });
  if (skills.total > skills.length) md.push(`\n(Audited the first ${skills.length} of ${skills.total} skills; pass a folder link to audit others.)`);
  if (rows.length > 1) md.push(`\nAverage: ${Math.round(rows.reduce((a, r) => a + r.score, 0) / rows.length)}/100 across ${rows.length} skills`);
  return { rows, markdown: `# Skill audit: ${target}\n\n${md.join("\n\n")}\n\nScoring: −15 per blocking issue, −5 per warning. Fix ✗ first: they stop a skill from loading or from being read.` };
}
