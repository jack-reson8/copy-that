# Copy That（skill 开源）· current work — 2026-10-25 凌晨

完整交接：~/.claude/coordination/hq/handoff-skills-2026-10-24.md（末尾"新主会话进度"各条）。

## 已完成
- 合集仓库 jack-reson8/copy-that（git-subdir，Claude Code + Codex 实测能装）；6 个 README 首屏有分享图 v2、系列行、体检徽章。
- 网页体检 jack-reson8.github.io/skill-skill/check/；skill_audit YAML 校验 + pr_triage 忽略审查机器人。
- 定时任务 copy-that-daily-growth（每天 9:30 增长短报）。
- 新 PR：GetBindu#306、kodustech#168、acvnace#215、0xWelt#387、Chat2AnyLLM#281、irinabuht12-oss/marketing-skills#3（修复型）。
- 增长计划页 https://claude.ai/code/artifact/c21f7460-ae49-4506-8256-b91dad1a033e ；新 skill 候选 side-session-notes/local_94ea7673…/new-skill-candidates.md（Baton 先做）。

## 进行中 / 下一步（按顺序）
1. Jack 最新要求：看各 PR 反馈 → 优化 5 个 skill；从今天工作总结新 skill。做法：`python3 ~/code/skill-skill/plugins/skill-skill/skills/skill-skill/scripts/pr_triage.py` 看反馈 + 读 new-skill-candidates.md，今天新增的经验见下。
2. 发布片：7 方向被否（没抽参考帧）。参考子代理结果写到 ~/code/.work/copy-that-film/refs/technique-sheets.md 和 refs/picks/；素材在 material/。按参考重做风格帧，每张和参考并排写"哪里不如它"。音乐暂缓（suno-prompt.md 已备）。
3. 下一批 PR（新 fork ≤6）：awesome-copilot 外部插件（issue 表单 + tag/sha）、更多修复型 PR（skill_report.py 扫高星仓库）。

## 今天的新经验（可进 skill）
- scratchpad 在 /tmp 会被清，素材丢了先从旧会话 jsonl 找回（已进记忆）。
- 有风格库也必须先抽参考帧；用真实产出不画假道具（已进 pro-motion lessons）。
- 收录 PR 带来的是机器人克隆，真人浏览≈0；修复型 PR + 网页工具徽章更值。
- JSON 配置类 PR 要保持原文件缩进/转义，否则 diff 爆炸。
- Claude Code 的 YAML 解析宽松，严格解析器（js-yaml/PyYAML）会报错。

## 只有 Jack 能做
- 内置浏览器登录 GitHub（我传社交预览图）；发 r/ClaudeAI 体检帖；Anthropic 官方插件目录表单；OpenAI 插件目录上传。

## 2026-10-24 压缩后这一段
- PR 反馈：除 punkpeye 要 glama 注册（Jack）外没有可修的。13 个已合并。
- pro-motion 1.2.1（9d74577）：ref_frames.sh 修 pipefail 静默退出、优先 H.264、sourcing 加"直链 mp4"；buildwithclaude#538 已重新钉版本并留言。
- skill-skill 1.2.0（d1e1d98）：publishing.md 加"评审驳回/合并"表和"曝光打法"，新增 scripts/json_append.py，删掉 PR 里写 AI 署名的建议；buildwithclaude#539 已重新钉版本。
- 新 skill（接力/额度）写完：~/code/baton（本地 git，未建远程），7 个脚本用本会话真实记录测过。名字待 Jack 选：https://claude.ai/code/artifact/5a5eea84-ea19-4e4a-b286-c0a16dc2b73a （推荐 Over & Out）。选定后：改目录和 name、补 README 中英、manifest、加进 copy-that marketplace，推送前问 Jack。
- 发布片参考已回：refs/technique-sheets.md + refs/picks/ 6 张；下一步按 6 个手法用真实素材重做风格帧。
