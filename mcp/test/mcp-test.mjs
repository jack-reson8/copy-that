// End-to-end: launch the server over stdio like an agent does, list everything, call each offline tool.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import assert from "node:assert/strict";
import path from "node:path";

const here = path.dirname(new URL(import.meta.url).pathname);
const client = new Client({ name: "test", version: "0" });
await client.connect(new StdioClientTransport({ command: process.execPath, args: [path.join(here, "../src/cli.js")] }));
const text = (r) => r.content[0].text;

const tools = (await client.listTools()).tools.map((t) => t.name).sort();
assert.deepEqual(tools, ["ai_tone_check", "audit_skill", "name_check", "skill_method"]);
const prompts = (await client.listPrompts()).prompts.map((p) => p.name).sort();
assert.deepEqual(prompts, ["post", "pro-launch", "pro-motion", "renhua", "skill-skill"]);
assert.equal((await client.listResources()).resources.length, 5);

const bad = text(await client.callTool({ name: "audit_skill", arguments: { target: path.join(here, "fixtures/loose-skill") } }));
assert.match(bad, /55\/100/); assert.match(bad, /orphan/); assert.match(bad, /dangling/);
const yamlBad = text(await client.callTool({ name: "audit_skill", arguments: { target: path.join(here, "fixtures/bad-skill") } }));
assert.match(yamlBad, /invalid YAML/);

assert.match(text(await client.callTool({ name: "ai_tone_check", arguments: { text: "✅ 上线 3 个工具\n被一个 AI 上了一课。你怎么看？" } })), /emoji/);
assert.match(text(await client.callTool({ name: "ai_tone_check", arguments: { text: "两天上线了三个 一个人都没来" } })), /100\/100/);
assert.match(text(await client.callTool({ name: "ai_tone_check", arguments: { text: "Let's dive in. It's worth noting this is a game-changer." } })), /stock AI phrase/);

assert.match(text(await client.callTool({ name: "skill_method", arguments: {} })), /pro-motion/);
assert.match(text(await client.callTool({ name: "skill_method", arguments: { name: "renhua" } })), /AI 味/);
assert.match(text(await client.callTool({ name: "skill_method", arguments: { name: "pro-motion", ref: "lessons" } })), /\S/);
assert.ok((await client.callTool({ name: "skill_method", arguments: { name: "nope" } })).isError);
const p = await client.getPrompt({ name: "post", arguments: { task: "launch carousel" } });
assert.match(p.messages[0].content.text, /launch carousel/);

await client.close();
console.log("ok: 4 tools, 5 prompts, 5 resources, offline calls pass");
