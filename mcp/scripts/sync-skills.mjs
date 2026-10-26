// Copy each Copy That skill's SKILL.md and references/*.md into ./skills so the MCP server works offline.
// Run before publishing: npm run sync (expects the skill repos as siblings of copy-that, as in jack-reson8's checkout).
import fs from "node:fs";
import path from "node:path";
const here = path.dirname(new URL(import.meta.url).pathname), code = path.resolve(here, "../../..");
const SRC = { "pro-motion": "pro-motion/plugins/pro-motion/skills/pro-motion", "pro-launch": "pro-launch/plugins/pro-launch/skills/pro-launch",
  post: "post-skill/plugins/post/skills/post", renhua: "renhua/plugins/renhua/skills/renhua", "skill-skill": "skill-skill/plugins/skill-skill/skills/skill-skill" };
const out = path.resolve(here, "../skills");
fs.rmSync(out, { recursive: true, force: true });
for (const [name, rel] of Object.entries(SRC)) {
  const src = path.join(code, rel), dst = path.join(out, name);
  fs.mkdirSync(path.join(dst, "references"), { recursive: true });
  fs.copyFileSync(path.join(src, "SKILL.md"), path.join(dst, "SKILL.md"));
  const refs = fs.existsSync(path.join(src, "references")) ? fs.readdirSync(path.join(src, "references")).filter((f) => f.endsWith(".md")) : [];
  for (const f of refs) fs.copyFileSync(path.join(src, "references", f), path.join(dst, "references", f));
  console.log(`${name}: SKILL.md + ${refs.length} references`);
}
