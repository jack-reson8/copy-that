// Launch plan: pro-launch (product 0→1) and pro-motion (campaign, music, film, site) as one pipeline.
// The two methods share their inputs: the aha moment picks the campaign mechanism, the style bible and references
// feed the UI, the film and the site, and every claim in the film must map to a feature that exists.
// With a project folder it reads which artifacts are real (same rule as pro-launch's phase_gate.py) and names the next step.
import fs from "node:fs";
import path from "node:path";

// [id, title, artifacts, method refs ("skill:file"), tool, why it sits here]
const STAGES = [
  ["positioning", "Positioning: who, what job, why now", ["docs/positioning.md"], ["pro-launch:01-idea-positioning.md"], null,
    "Every later stage quotes this one sentence; the film and the site are judged against it."],
  ["naming", "Name, domains, trademark", ["docs/naming.md", "docs/trademark.md"], ["pro-launch:02-naming-brand.md", "pro-launch:13-trademark-ip.md"], "name_check",
    "Run name_check on 5–10 candidates before falling for one."],
  ["refs", "References (GitHub/award first, then App Store)", ["refs/style-refs/INDEX.md", "docs/competitors.md"], ["pro-launch:03-find-references.md", "pro-launch:03b-style-names-and-creative-decode.md"], null,
    "One reference set serves the UI, the film and the site, so collect motion and web references here too."],
  ["style", "Style bible + 审美红线", ["docs/style-bible.md"], ["pro-launch:04-style-bible.md", "pro-motion:brand-system.md"], null,
    "The film's palette, type and motion rules come from here, so product and film look like one brand."],
  ["features", "Feature map + aha moment", ["docs/feature-map.md"], ["pro-launch:05-feature-planning.md"], null,
    "Name the aha moment: the campaign mechanism and the film's climax are built on it."],
  ["frames", "Style frames beside references, then UI", ["docs/technique-sheets.md", "docs/style-frames.md", "docs/ui-log.md"], ["pro-launch:06b-visual-craft.md", "pro-launch:06-ui-build-loop.md"], null,
    "The film shows the product's real UI, so it waits for screens worth filming."],
  ["campaign", "Campaign mechanism", ["campaign.md", "docs/marketing-to-product.md"], ["pro-motion:unconventional-marketing.md", "pro-motion:campaign-cases.md"], null,
    "Six ideas from ≥4 levers; the product must cause the surprise. marketing-to-product.md maps every claim to a shipped feature."],
  ["audio", "Music plan, track, beat map", ["audio-plan.md", "music/analysis.json"], ["pro-motion:audio-first.md"], null,
    "Lock the track before any picture: the edit is cut to its onsets."],
  ["film-plan", "Film references + shot map", ["refs/technique-sheets.md", "shotmap.md", "docs/video-brief.md"], ["pro-motion:sourcing.md", "pro-motion:vfx-techniques.md", "pro-launch:09-launch-video.md"], null,
    "Real frames from ≥6 references, one protagonist, a designed transition for every cut."],
  ["film", "Render the launch film", ["out/*.mp4"], ["pro-motion:aesthetic-checklist.md", "pro-motion:lessons.md"], null,
    "9:16 master first; 1:1 and 16:9 only after it is approved."],
  ["site", "Official site / landing page", ["docs/site/technique-sheets.md", "docs/site/style-frames.md"], ["pro-motion:web-craft.md", "pro-launch:06c-web-craft.md"], null,
    "Decode an awarded site's layers before writing site code; reuse the film's protagonist as the hero."],
  ["gtm", "Launch copy, post images, channels", ["docs/gtm.md", "docs/manual-tasks.md"], ["pro-launch:10-gtm-social.md", "renhua:", "post:"], "ai_tone_check",
    "Run ai_tone_check on every post. manual-tasks.md lists what only the owner can do (logins, payment, posting)."],
  ["ship", "Ship, open source, measure", ["docs/ship-checklist.md", "docs/metrics.md", "docs/lessons.md"], ["pro-launch:12-ship-opensource.md", "pro-launch:11-growth-data.md"], null,
    "Write down what was rejected and accepted so the next launch starts from it."],
];
export const STAGE_IDS = STAGES.map((s) => s[0]);

function real(file) { // phase_gate.py's rule: exists, ≥300 bytes, no TODO or empty "field:" lines
  if (!fs.existsSync(file)) return "missing";
  if (file.endsWith(".json")) return fs.statSync(file).size > 50 ? "ok" : "empty";
  const t = fs.readFileSync(file, "utf8");
  if (t.length < 300) return "too short";
  if (/TODO|:[ \t]*\n/.test(t.replace(/^\|.*$/gm, "").replace(/```[\s\S]*?```/g, ""))) return "unfilled";
  return "ok";
}
function status(root, rel) { // pro-motion projects often live in film/: accept either place
  for (const base of [root, path.join(root, "film")]) {
    if (rel.includes("*")) { const dir = path.join(base, path.dirname(rel)), ext = path.extname(rel);
      if (fs.existsSync(dir) && fs.readdirSync(dir).some((f) => f.endsWith(ext))) return "ok"; continue; }
    const s = real(path.join(base, rel)); if (s !== "missing") return s;
  }
  return "missing";
}
const refLabel = (r) => { const [s, f] = r.split(":"); return f ? `skill_method ${s} ref ${f}` : `skill_method ${s}`; };

export function launchPlan({ product = "", project_dir, from } = {}) {
  const root = project_dir ? path.resolve(project_dir.replace(/^~(?=$|\/)/, process.env.HOME || "~")) : null;
  if (root && !fs.existsSync(root)) throw new Error(`no such folder: ${project_dir}`);
  const start = from ? STAGE_IDS.indexOf(from) : 0;
  if (start < 0) throw new Error(`unknown stage "${from}"; one of ${STAGE_IDS.join(", ")}`);
  const rows = STAGES.slice(start).map(([id, title, files, refs, tool, why]) => {
    const st = root ? files.map((f) => [f, status(root, f)]) : null;
    return { id, title, files, refs, tool, why, status: st, done: st ? st.every(([, s]) => s === "ok") : false };
  });
  const next = root ? rows.find((r) => !r.done) : rows[0];
  const md = [`# Launch plan${product ? `: ${product}` : ""}`, "",
    "pro-launch builds the product, pro-motion makes people care about it; this is both as one order of work. Each stage leaves files in the project folder, and a stage counts as done only when its files are real (≥300 bytes, no TODO, no empty fields).", "",
    ...rows.map((r, i) => [`## ${start + i + 1}. ${r.title}${root ? (r.done ? " ✓" : r === next ? " ← next" : "") : ""}`,
      `Files: ${r.files.map((f) => { const s = r.status?.find(([x]) => x === f)?.[1]; return `\`${f}\`${s && s !== "ok" ? ` (${s})` : s ? " ✓" : ""}`; }).join(", ")}`,
      `Read: ${r.refs.map(refLabel).join(" · ")}${r.tool ? ` · tool: ${r.tool}` : ""}`, r.why, ""].join("\n")),
    next ? `**Next:** ${next.title}. Read ${next.refs.map(refLabel).join(", ")}, then produce ${next.files.map((f) => `\`${f}\``).join(", ")}.${root ? " Run launch_plan again with the same project_dir to confirm." : ""}`
      : "All stages have real files. Re-run the film and site checks before anything goes public; posting, payments and logins stay with the owner.",
  ].join("\n");
  return { stages: rows, next: next?.id || null, markdown: md };
}
