# copy-that-mcp

Copy That as an MCP server. The skills teach the method; these tools do the checking. Works in Claude Code, Codex, Cursor, Gemini CLI, Claude Desktop and any other MCP client.

```bash
npx copy-that-mcp setup
```

Setup finds the agents on your machine, shows every change it will make, and applies them after you say yes. Claude Code and Codex also get the five Copy That skills through their plugin marketplaces. JSON configs are backed up before they are edited.

## Tools

| Tool | What it does |
|---|---|
| `audit_skill` | Health check for an agent skill: strict YAML frontmatter (the kind Codex rejects), name rules, a trigger clause in the description, reference files nothing points to, paths that don't exist. Scores 0–100, gives the fix for each problem and a README badge. Takes a local folder or a GitHub link. |
| `ai_tone_check` | Finds what makes Chinese or English copy read as AI-written: emoji bullets, lists, parallel triplets, slogan endings, 不是…而是 / "it's worth noting", hype words, stock closing questions. Each hit comes with the line and how to rewrite it. |
| `name_check` | Domain signals across TLDs and short .com variants (get-, try-, -app), same-name apps in App Store storefronts, and whether the GitHub and npm names are taken. Checks DNS too, because .io and .co have no RDAP. |
| `launch_plan` | pro-launch and pro-motion as one order of work, from positioning and naming through references, style bible, UI, campaign mechanism, music, shot map, launch film, official site, launch copy and shipping. The aha moment picks the campaign; one reference set and style bible feed the UI, film and site; every claim in the film maps to a real feature. Give it a project folder and it shows which stages already have real files and what to do next. Also a `launch` prompt. |
| `skill_method` | The full Copy That methods for clients that don't load skills: pro-motion (launch films), pro-launch (0→1 product), post (share-post images), renhua (人话, human Chinese copy), skill-skill (writing skills). Also exposed as MCP prompts and `copythat://skills/<name>` resources. |

Try asking your agent:

- "Audit the skill at https://github.com/anthropics/skills"
- "Check this Xiaohongshu draft for AI tone, then rewrite the flagged lines"
- "Make a launch plan for ~/code/my-app and start the next stage"
- "Check the names tutti, fizzpic and chupy for domains and App Store clashes in us, jp and kr"

## Terminal

```bash
npx copy-that-mcp audit ~/.claude/skills/my-skill      # exit code 1 when there are blocking issues (CI-friendly)
npx copy-that-mcp tone draft.md
npx copy-that-mcp names tutti fizzpic
npx copy-that-mcp plan ~/code/my-app                   # launch stages done / next
```

## Manual config

```json
{ "mcpServers": { "copy-that": { "command": "npx", "args": ["-y", "copy-that-mcp"] } } }
```

## 中文

一行命令把 Copy That 装进你电脑上所有的 AI 编程工具：`npx copy-that-mcp setup`，改动前会全部列出来，你确认后才执行。五个工具：给 skill 体检打分、查中英文 AI 味、起名查域名和 App Store 重名、`launch_plan` 把 pro-launch 和 pro-motion 合成一条从定位到发布片、官网、上线的流程（给项目文件夹就告诉你做到哪一步、下一步做什么）、把五套方法（发布片、产品 0→1、组图、人话、写 skill）提供给 Cursor、Gemini 这些不支持 skill 的客户端。

Nothing is sent anywhere except the lookups you ask for (GitHub for audits of GitHub links, RDAP/DNS/App Store/npm for name checks). MIT licensed.
