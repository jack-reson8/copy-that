// `npx copy-that-mcp setup`: find the agents on this machine, show what will change, and apply it after a yes.
// Claude Code and Codex get the skills (plugin marketplace) and the MCP server through their own CLIs;
// Cursor, Gemini CLI and Claude Desktop get the MCP server in their JSON config, backed up first.
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import readline from "node:readline/promises";
import { spawnSync } from "node:child_process";

const HOME = os.homedir();
// Installed from the GitHub release tarball, so nothing depends on an npm account.
export const PKG = "https://github.com/jack-reson8/copy-that/releases/latest/download/copy-that-mcp.tgz";
const SERVER = { command: "npx", args: ["-y", PKG] };
const PLUGINS = ["pro-motion", "pro-launch", "renhua", "post", "skill-skill"];
const has = (cmd) => spawnSync(process.platform === "win32" ? "where" : "which", [cmd], { stdio: "ignore" }).status === 0;
const desktopConfig = process.platform === "darwin" ? path.join(HOME, "Library/Application Support/Claude/claude_desktop_config.json")
  : process.platform === "win32" ? path.join(process.env.APPDATA || "", "Claude/claude_desktop_config.json") : path.join(HOME, ".config/Claude/claude_desktop_config.json");

function jsonTarget(label, file, dirHint) {
  if (!fs.existsSync(file) && !fs.existsSync(dirHint)) return null;
  let cfg = {}; try { cfg = JSON.parse(fs.readFileSync(file, "utf8")); } catch {}
  if (cfg.mcpServers?.["copy-that"]) return { label, done: true };
  return { label, steps: [`add "copy-that" to mcpServers in ${file.replace(HOME, "~")}`], apply() {
    if (fs.existsSync(file)) fs.copyFileSync(file, `${file}.bak-${Date.now()}`);
    else fs.mkdirSync(path.dirname(file), { recursive: true });
    cfg.mcpServers = { ...(cfg.mcpServers || {}), "copy-that": SERVER };
    fs.writeFileSync(file, JSON.stringify(cfg, null, 2) + "\n");
  } };
}

function cliTarget(label, bin, cmds) {
  if (!has(bin)) return null;
  return { label, steps: cmds.map((c) => [bin, ...c].join(" ")), apply() {
    for (const c of cmds) { const r = spawnSync(bin, c, { stdio: "inherit" }); if (r.status !== 0) console.log(`  (skipped: "${bin} ${c.join(" ")}" exited ${r.status}; it may already be set up)`); }
  } };
}

export function plan() {
  return [
    cliTarget("Claude Code", "claude", [["plugin", "marketplace", "add", "jack-reson8/copy-that"], ...PLUGINS.map((p) => ["plugin", "install", `${p}@copy-that`]), ["mcp", "add", "--scope", "user", "copy-that", "--", ...[SERVER.command, ...SERVER.args]]]),
    cliTarget("Codex", "codex", [["plugin", "marketplace", "add", "https://github.com/jack-reson8/copy-that.git"], ...PLUGINS.map((p) => ["plugin", "add", `${p}@copy-that`]), ["mcp", "add", "copy-that", "--", SERVER.command, ...SERVER.args]]),
    jsonTarget("Cursor", path.join(HOME, ".cursor/mcp.json"), path.join(HOME, ".cursor")),
    jsonTarget("Gemini CLI", path.join(HOME, ".gemini/settings.json"), path.join(HOME, ".gemini")),
    jsonTarget("Claude Desktop", desktopConfig, path.dirname(desktopConfig)),
  ].filter(Boolean);
}

export async function setup({ yes = false, dryRun = false } = {}) {
  const targets = plan();
  if (!targets.length) { console.log(`No supported agent found (Claude Code, Codex, Cursor, Gemini CLI, Claude Desktop).\nManual config: command "npx", args ["-y", "${PKG}"].`); return; }
  console.log("Copy That setup will make these changes:\n");
  for (const t of targets) { console.log(`  ${t.label}${t.done ? " — already set up" : ""}`); for (const s of t.steps || []) console.log(`    · ${s}`); }
  const todo = targets.filter((t) => !t.done);
  if (!todo.length) { console.log("\nNothing to do."); return; }
  if (dryRun) { console.log("\n(dry run: nothing changed)"); return; }
  if (!yes) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const a = (await rl.question("\nApply? JSON configs are backed up first. [y/N] ")).trim().toLowerCase(); rl.close();
    if (a !== "y" && a !== "yes") { console.log("Nothing changed."); return; }
  }
  for (const t of todo) { console.log(`\n→ ${t.label}`); t.apply(); }
  console.log("\nDone. Restart your agents, then try: \"audit the skill at ~/.claude/skills/<name>\" or \"check this post for AI tone\".");
}
