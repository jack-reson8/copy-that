// The Copy That methods, bundled as text (synced from the skill repos by scripts/sync-skills.mjs).
// Clients without skill support (Cursor, Gemini CLI, ChatGPT…) get them as MCP prompts, resources and a tool.
import fs from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../skills");
const REPO = { "pro-motion": "pro-motion", "pro-launch": "pro-launch", post: "post-skill", renhua: "renhua", "skill-skill": "skill-skill" };

export function listSkills() {
  if (!fs.existsSync(ROOT)) return [];
  return fs.readdirSync(ROOT).filter((n) => fs.existsSync(path.join(ROOT, n, "SKILL.md"))).map((n) => {
    const text = fs.readFileSync(path.join(ROOT, n, "SKILL.md"), "utf8");
    const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/), meta = m ? yaml.load(m[1]) : {};
    const refs = fs.existsSync(path.join(ROOT, n, "references")) ? fs.readdirSync(path.join(ROOT, n, "references")).filter((f) => f.endsWith(".md")).sort() : [];
    return { name: n, description: String(meta.description || "").split(/ Triggers?:/)[0], refs, repo: `https://github.com/jack-reson8/${REPO[n] || n}` };
  });
}

export function readSkill(name, ref) {
  const s = listSkills().find((x) => x.name === name);
  if (!s) throw new Error(`unknown skill "${name}". Available: ${listSkills().map((x) => x.name).join(", ")}`);
  if (ref) {
    const f = s.refs.find((r) => r === ref || r === `${ref}.md` || r.replace(/\.md$/, "") === ref.replace(/^references\//, "").replace(/\.md$/, ""));
    if (!f) throw new Error(`no reference "${ref}" in ${name}. Available: ${s.refs.join(", ")}`);
    return fs.readFileSync(path.join(ROOT, name, "references", f), "utf8");
  }
  const body = fs.readFileSync(path.join(ROOT, name, "SKILL.md"), "utf8").replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  return `${body}\n\n---\nReference files for this method (read them with skill_method name="${name}" ref="<file>"): ${s.refs.join(", ") || "none"}.\n` +
    `Scripts mentioned above live in the full skill: install it from ${s.repo} (or run \`npx copy-that-mcp setup\`) to run them.`;
}
