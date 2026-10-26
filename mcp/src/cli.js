#!/usr/bin/env node
// copy-that-mcp            → run the MCP server on stdio (what agents launch)
// copy-that-mcp setup      → install the skills + MCP server into the agents on this machine (asks first)
// copy-that-mcp audit <path|github-url> · tone <file|-> · names <name…> · plan [dir] → the same tools from the terminal
import fs from "node:fs";
const [cmd, ...rest] = process.argv.slice(2);
const flag = (f) => rest.includes(f);
const args = rest.filter((a) => !a.startsWith("--"));

try {
  if (!cmd) { const { serve } = await import("./server.js"); await serve(); }
  else if (cmd === "setup") { const { setup } = await import("./setup.js"); await setup({ yes: flag("--yes"), dryRun: flag("--dry-run") }); }
  else if (cmd === "audit") { const { audit } = await import("./audit.js"); const r = await audit(args[0] || "."); console.log(r.markdown); process.exitCode = r.rows.some((x) => x.issues.length) ? 1 : 0; }
  else if (cmd === "tone") { const { checkTone } = await import("./tone.js"); const text = !args[0] || args[0] === "-" ? fs.readFileSync(0, "utf8") : fs.readFileSync(args[0], "utf8"); console.log(checkTone(text).markdown); }
  else if (cmd === "names") { const { checkNames } = await import("./names.js"); console.log((await checkNames(args)).markdown); }
  else if (cmd === "plan") { const { launchPlan } = await import("./launch.js"); console.log(launchPlan({ project_dir: args[0] }).markdown); }
  else if (cmd === "--version" || cmd === "-v") { const { VERSION } = await import("./server.js"); console.log(VERSION); }
  else console.log("Usage: copy-that-mcp [setup [--dry-run] [--yes] | audit <path|github-url> | tone <file|-> | names <name…> | plan [project-dir]]\nWith no command it runs the MCP server on stdio.");
} catch (e) { console.error("Error:", e.message); process.exitCode = 1; }
