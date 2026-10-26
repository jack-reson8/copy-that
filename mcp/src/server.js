// Copy That MCP server (stdio): skill audit, AI-tone check, name check, and the Copy That methods for any MCP client.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { audit } from "./audit.js";
import { checkTone } from "./tone.js";
import { checkNames } from "./names.js";
import { listSkills, readSkill } from "./skills.js";

export const VERSION = "0.1.0";
const ok = (text) => ({ content: [{ type: "text", text }] });
const fail = (e) => ({ isError: true, content: [{ type: "text", text: "Error: " + (e && e.message ? e.message : String(e)) }] });

export async function serve() {
  const server = new McpServer({ name: "copy-that", version: VERSION });
  const skills = listSkills();

  server.registerTool("audit_skill", {
    title: "Audit a Claude skill",
    description: "Static health check for an agent skill (SKILL.md folder): strict YAML frontmatter, name rules, trigger clause in the description, reference files nothing points to, paths that don't exist, size and shouting. Returns a 0–100 score, each problem with the fix, and a README badge. Accepts a local folder (a skill, or a repo containing several) or a GitHub link (repo, folder or SKILL.md).",
    inputSchema: { target: z.string().describe("Local path or GitHub URL, e.g. ~/.claude/skills/my-skill or https://github.com/owner/repo") },
  }, async ({ target }) => { try { return ok((await audit(target)).markdown); } catch (e) { return fail(e); } });

  server.registerTool("ai_tone_check", {
    title: "AI tone check (人话)",
    description: "Find the patterns that make Chinese or English copy read as AI-written: emoji bullets, lists, parallel triplets, slogan endings, stock phrases (不是…而是 / delve / it's worth noting), hype words, colon headings and stock closing questions. Returns a 0–100 score and each hit with its line and how to rewrite it. Use before posting to Xiaohongshu, X, WeChat or a product page.",
    inputSchema: { text: z.string().describe("The draft to check"), lang: z.enum(["auto", "zh", "en"]).optional().describe("Language rules to apply (default auto)") },
  }, async ({ text, lang }) => { try { return ok(checkTone(text, lang || "auto").markdown); } catch (e) { return fail(e); } });

  server.registerTool("name_check", {
    title: "Product name check",
    description: "Check candidate product names: domain registration signals across TLDs plus short brand variants (get-, try-, -app…) on .com, same-name apps in App Store storefronts, and whether the GitHub user/org and npm package name are taken. Use when naming an app, a brand or an open-source project.",
    inputSchema: { names: z.array(z.string()).min(1).max(10).describe("Candidate names, e.g. [\"tutti\", \"fizzpic\"]"), tlds: z.array(z.string()).optional().describe("TLDs to try (default com, app, ai, io, co)"), stores: z.array(z.string()).optional().describe("App Store countries (default [\"us\"]), e.g. us, jp, kr, cn"), variants: z.boolean().optional().describe("Also try get-/try-/-app style .com variants (default true)") },
  }, async ({ names, tlds, stores, variants }) => { try { return ok((await checkNames(names, { tlds, stores, variants: variants !== false })).markdown); } catch (e) { return fail(e); } });

  server.registerTool("skill_method", {
    title: "Copy That method",
    description: `Read a Copy That method, the step-by-step playbook a skill would load: ${skills.map((s) => `${s.name} (${s.description.slice(0, 90)}…)`).join("; ")}. Call with no name to list them, with a name for the full method, and with ref for one of its reference files. Follow the method's steps; they include gates and checks that change the result.`,
    inputSchema: { name: z.string().optional().describe(`One of: ${skills.map((s) => s.name).join(", ")}`), ref: z.string().optional().describe("A reference file listed at the end of the method, e.g. lessons.md") },
  }, async ({ name, ref }) => { try {
    if (!name) return ok(skills.map((s) => `- **${s.name}** — ${s.description}\n  ${s.repo}`).join("\n"));
    return ok(readSkill(name, ref));
  } catch (e) { return fail(e); } });

  for (const s of skills) {
    server.registerPrompt(s.name, { title: `Copy That · ${s.name}`, description: s.description, argsSchema: { task: z.string().optional().describe("What you want done") } },
      ({ task }) => ({ messages: [{ role: "user", content: { type: "text", text: `${readSkill(s.name)}\n\n---\nFollow the method above for this task: ${task || "(ask me what I want to make)"}` } }] }));
    server.registerResource(`${s.name}-method`, `copythat://skills/${s.name}`, { title: `${s.name} method`, description: s.description, mimeType: "text/markdown" },
      async (uri) => ({ contents: [{ uri: uri.href, mimeType: "text/markdown", text: readSkill(s.name) }] }));
  }

  await server.connect(new StdioServerTransport());
}
