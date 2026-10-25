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

## 早上给 Jack
- [ ] 新 skill 定名（推荐 Over & Out）：https://claude.ai/code/artifact/5a5eea84-ea19-4e4a-b286-c0a16dc2b73a
- [x] 发布片风格：Jack 选 B+C 融合、要求不照搬。已出 On Air 融合版 https://claude.ai/code/artifact/5980a206-f10d-43fc-a04b-96f83eae235e （源 ~/code/.work/copy-that-film/frames3/），等 Jack 看；旧四选一：https://claude.ai/code/artifact/31362578-831f-4d13-9402-66a161bcd4e5 ；源文件 ~/code/.work/copy-that-film/frames2/
- [ ] glama.ai 登记 toolkb-mcp（punkpeye PR 要求）
- [ ] 内置浏览器登录 GitHub，好上传社交预览图
- [ ] 发 r/ClaudeAI 的 899 体检帖（稿在 ~/code/.work/launch/）
- [ ] 音乐插件会话：和声钢琴第一版已能实时弹，等你试听定音色和名字

## 夜间优化（2026-10-24 夜）
- 体检网页支持直接贴仓库链接（以前只认文件夹链接，最常见的贴法会报错）；多个 skill 的仓库给选择列表。已上线验证。
- copy-that README 中英文加体检网页入口。
- 隔离环境验证一行命令装全套：5 个插件都装上，版本是最新（pro-motion 1.2.1、skill-skill 1.2.0）。本机 5 个 skill 都是仓库软链，无漂移。
- 音乐插件会话上下文 55 万已停，交接在 ~/code/harmony-piano/docs/coordination/current-work.md；新会话是否已开未确认。
- 新 skill（~/code/baton）补齐中英 README、Claude/Codex 清单、LICENSE 等；体检 100、publish_check READY、本地装通。只差定名和建远程（推送前问 Jack）。
- skill-skill 1.3.0（adec7a8）：新增 mine_corrections.py，按"在多少个会话里反复出现"给用户的纠正排序。跑近 10 天：第一名是"没好好找参考"（21 个会话），其次"不是我要的"（15）、"丑/廉价"（14）。参考这条 pro-motion/pro-launch 都写了却还在反复，说明还只是建议，下一步要改成硬门槛（没有参考联系表就不许出风格帧）。
- buildwithclaude#539 今晚已重钉过一次，1.3.0 先不再钉，攒到下批一起，免得刷维护者。
- pro-motion 1.3.0（5d50045）：新增 refs_gate.py 硬门槛，refs/ 里不到 6 张参考联系表、6 条手法拆解就不许出风格帧；风格帧必须和参考并排写差距。对应"没好好找参考"这条最常见的纠正。copy-that 发布片项目已过门槛（26 张联系表、14 条）。buildwithclaude#538 下批再重钉。
- pro-launch 不用另加参考门槛：phase_gate.py frames 已经要求技法表和 -vs-ref 对比图；而且仓库里有另一个会话未提交的改动（06c-web-craft、phase_gate web），没动它，等那个会话自己提交。
- 夜间能做的已做完，剩下的主线都卡在 Jack 拍板：新 skill 名字、发布片风格方向。没有新的可做项就不再空转。

- pro-motion 2224280：风格帧至少融合 2 个参考，配色和核心点子必须自己的（Jack："b 直接变成抄了"）。
- 发布片 v1 出了：~/code/.work/copy-that-film/out/copy-that-onair-v1.mp4（竖版 16.76 s，音乐是 Jack 选的第 4 版）。分镜 film/shotmap.md，代码 film/film.html。喊声 3.24/3.48/3.80 逐音节砸出 COPY/THAT. 字标，3.96 乐队进；最终高潮 14.38 全部字行收进字标，15.96 roger beep 红灯闪两下收尾。等 Jack 看，之后出 16:9 和 1:1。

## 2026-10-25 PR 邮件治理（side session）
- 现状：没有 watch 任何仓库（/user/subscriptions 为空），邮件全来自"自己是作者/被@/参与"的线程，共 82 个线程（PR 25、CI 54、其它 3）。已把通知全部标为已读。
- 卡点：gh 的 token 缺 `notifications` scope，PUT /notifications/threads/{id}/subscription 返回 200 但没生效（ignored 仍 false）。需 Jack 跑一次 `gh auth refresh -h github.com -s notifications`（浏览器授权），之后我批量设 ignored。
- 账号级开关只能 Jack 在 github.com/settings/notifications 改（清单见会话回复）。
- 巡检：`~/code/.work/growth/pr_watch.py`（调用 pr_triage，对比 pr-snapshot.json，只报变化，刷新 pr-status.md）；已并进定时任务 copy-that-daily-growth 的第 3 步。
- 固定入口：`docs/coordination/pr-status.md`（每日刷新）+ 每天 9:30 短报。
- Gmail 过滤规则：只给了方案，未创建，等 Jack 确认。
- 发布片 v1 被否（节奏没卡细、素材丑、不流畅、没叙事，只有 COPY THAT 主视觉好）。v2：~/code/.work/copy-that-film/out/copy-that-onair-v2.mp4，代码 film/film2.html，分镜 film/shotmap-v2.md，音乐按频段拆的事件在 music/events.json。素材换成 tutti.pics 首页实拍截图和 v2 分享图。
- PR 邮件减负和自动巡检交给分会话 pr-watch（local_6ba63e34）。
- 定时任务手动跑过一次（session local_b1980734…）：短报 = 「今天总星数 0、7 天真人浏览 15 … PR 无变化（YOU 1 · ACTION 0 · WAIT 34 · 已合并 21 · 已关闭 3）… 需 Jack：glama.ai 登记 toolkb-mcp」。

## 下一步（2026-10-25，Jack 对 v2 的反馈，压缩/换班后从这里接）
1. 发布片 v2："变好了但不够好，有点看不懂是在做啥了，而且不利于 branding"。下一版要：一眼看懂"一句话 → 收到 → 成品"这条线；品牌（COPY THAT 字标、On Air 红、tally 红灯、摩斯/roger beep）要更集中、反复出现；少放杂成品，每个镜头讲清在做什么。代码 film/film2.html，事件 music/events.json。
2. 音频解析：Codex 用 FFmpeg + librosa + CLAP 解析了四首（报告 /Users/jack/Documents/Codex/2026-10-25/https-suno-com-s-tsqyrhdqyjfzlpiy-https/outputs/四首音频解析.md，skill 在同目录 audio-reference-analyzer/SKILL.md，已装进共用 skill 目录）。Jack 要：把它的方法有选择地整合进 pro-motion 的音频部分（audio-first.md / analyze_music.py），我这边更好的做法（按频段拆起音、1 kHz 提示音识别、段落新颖度）也合进去，或反过来帮它优化。注意它用的是 Suno 公开视频音轨，不是解密音频。
3. PR 巡检：pr-watch 会话等 Jack 跑 `gh auth refresh -h github.com -s notifications`。
- 订阅治理结果：线程级 PUT subscription 对这些线程无效（返回 ignored:false），改用 GraphQL updateSubscription(UNSUBSCRIBED)：34 个 open PR 全部退订，其余 24 个已合并/关闭本就是 UNSUBSCRIBED。token 已有 notifications scope。

## 2026-10-25 增长方向调整（Jack 授权"把优化做好"）
- 停止新提收录 PR；改为：对比演示 → 集中发布。
- 已做：renhua 装前/装后对比图 ~/code/.work/launch/renhua-ba/ba.png（真实子代理跑的，节选）；已放进 ~/code/renhua/docs/before-after.png 并在 README 首屏加了引用（未提交未推送）。
- 已写：launch-posts.md 第二组（X/小红书/V2EX）+ 发布日安排。
- 等 Jack：选发布日；确认推送 renhua README；glama.ai 登记 toolkb-mcp。

## 2026-10-25 全套出图与推广（Jack："都参考 pro-motion 提升审美"）
- 视觉规范：沿用 Jack 昨天满意的“果味”系列（~/code/.work/share-cards/make_v2.py：浅灰底、黑标题+强调色第二行、灰色 before 卡 + 白色 after 卡，6 个强调色）；第一版误用了 On Air 红色风格，已替换。生成脚本 ~/code/.work/launch/cards/build.py（puppeteer 出图）。
- 6 个 skill 各一张横版（README 用，已提交到各仓库 docs/proof.png 并在 README 首屏下引用）+ 竖版（发帖，~/code/.work/launch/posts/）。copy-that README 中英都加了“一眼看差别”。**全部只做了本地 commit，未推送。**
- 内容来源都是实测：renhua/pro-launch 为子代理真跑的前后对比（pro-launch 基线受全局 CLAUDE.md 影响，差别较小，措辞已克制）；skill-skill 为体检真实数字；toolkb-mcp 为维基词条实测字节；post/pro-motion 为真实产出帧。
- 6 个 skill 的静态体检均 100/100，PR 反馈无可修项，所以“优化”主要落在呈现和推广；内容层要等发布后真实反馈再改。
- 发布全套：~/code/.work/launch/PLAYBOOK.md。
- 事故：清理卡住的 headless Chrome 时误用 pkill "Google Chrome"，可能关掉了 Jack 的 Chrome 窗口（可 Cmd+Shift+T 恢复标签）。
- GEO：copy-that 加了 llms.txt 和 FAQ（已推送）。
- 发布片 v3：out/copy-that-onair-v3.mp4（film/film3.html）。同一条链做四遍、越来越快：brief 卡 → COPY THAT. 盖章 → 从章里裂开出真实成品（tutti.pics、组图、人话前后、体检）；铜管段每下一个"你要的东西"+盖章；结尾字标 + "说一句，它就去做。"。pro-motion 58c8140 合并了音频分析方法（music_events.py + audio-reference-analyzer）。
