# Lessons (bugs and process mistakes already paid for)

## Rendering
- **ffmpeg `-shortest` with a slow image pipe truncated the MP3 audio at ~13 s** (v2). Render frames to JPEGs first, then mux in one pass with `-map 0:v -map 1:a -t <dur>`; never `-shortest`. `render-fast.js` does this. Always check the audio duration of the output.
- Single-tab serial rendering + `-preset slow` took ~5 min per 25 s. Parallel tabs (6) + `-preset veryfast -crf 19` takes ~30 s for 20 s @60 fps.
- Parallel tabs mean `render(t)` must be deterministic: `Math.random()` in a noise texture made every worker different → flicker. Use a seeded generator.
- Puppeteer's bundled Chrome download can hang; install with `PUPPETEER_SKIP_DOWNLOAD=1` and point at the system Chrome. Killing an in-progress `npm i` rolls back node_modules.
- `ffmpeg-static` binary may land without the exec bit: `chmod +x`.
- Canvas `getImageData` on images needs http, not file:// — the renderers serve the folder over a local http server.

## Geometry & drawing
- Vision face boxes are normalized (0–1, top-left origin after flipping). Passing them into a pixel-space helper put the orbit ring and CCTV box off-screen. Convert explicitly.
- A rect + arc path clipped with `evenodd` drew a thin diagonal seam (implicit connecting line). `moveTo(cx + r, cy)` before `arc`, close the path.
- Text placed along an ellipse reads backwards on the near half unless the angle runs the other way; the far half being mirrored is physically correct.
- Spread ring text with `step = 2π / chars.length` or a gap rotates through the front.
- A full-bleed close-up leaves no room for clones / echoes; pull back to a graphic layout first.
- Fonts must be awaited (`document.fonts.load`) for every family used, including handwriting fonts, before the first frame.

## Design process
- Designing from memory produced templates. Pulling real frames (contact sheets) of references fixed taste fast.
- Stills-only checks missed motion/sync problems and the audio bug; always check audio length and a frame sheet of the final file.
- Code-drawn mascots and dated stock photos made everything look cheap ("素材丑 → 成片一定丑").
- Content swapping in a fixed frame = PPT, even with a continuous camera.
- Labels as lower-third templates, chips and boxes were rejected; text must be animated into the scene.
- Multiple languages in one block looked messy; master + per-language cuts was accepted.
- The user doesn't want repeated verification rounds; do one competent check pass, fix, deliver.

## Style (from a stylized brand film)
- The brief said "strongly stylized", not "pop art"; I collapsed four rich references (Persona 5, Promare, Mind Game, P5 anime) into the most obvious one (Lichtenstein pop art) because it was the first association and the easiest to draw in code. The output was good but generic relative to the references.
- Fix: technique sheets per reference + 3 divergent style frames for the user to choose before building (SKILL.md §2b). Name the techniques you are borrowing; if a direction can be summarised as one familiar label ("pop art", "flat", "Y2K"), it is probably not new enough.
- Techniques that were seen but not used, and were the distinctive part: Promare's flat polygon light and neon fields with zero gradients; Mind Game's mid-shot switches between drawing styles and photo collage; P5 anime's repeated framing (same train window, changing passengers); P5's silhouette crowds and graphic city maps.

## Music (audio-first, from a launch where the track was made from scratch)
- Starting the picture before the track was locked wasted rounds; the user calls audio first "the most important". Plan the music as a campaign asset first (`references/audio-first.md`).
- Prompts listing many electronic genre tags came back as generic EDM; prompts naming concrete acoustic instruments over a live-player foundation came back tasteful.
- Generators ignore precise seconds and default to slow intros; state "starts at full energy, no intro" and "biggest peak at the end for the logo", then fix timing in post.
- AI crowd vocals sound fake unless the recording situation is described; whispers and stuttered brand names were rejected; the brand name works best shouted by a group at a few key moments.
- Random / generative concepts without a marketing mechanism were called "boring"; every concept needs a reason to be shared.

## "Style" means a visual style, not a concept (Tutti 果味 round, 2026-10-24)
- Asked for "one Apple-ish + three stylized options", I delivered three narrative concepts (spec sheet, washing line, line field) and called them styles. Jack: a style is something you recognise at a glance — anime OP, hand-drawn animation, 3D modelled, Clash-Royale-like, pop, fast-cut MG. Concepts are content that can sit inside any style.
- Fix: present options on two axes — **visual style** (rendering language, palette, frame rate, cut tempo) × **narrative play** (which product feature performs). Each option names its style family and a reference work in that style.
- Code can't fake every style: posterizing a photo into "anime cel" looked like a cheap filter. Use the style's real device instead (e.g. Spy x Family OP4 mono-tint tonal silhouettes); for drawn characters, generate them.
- Same-person-in-every-frame reads as repetitive; get a varied subject set early (generated models are fine for this).

## Rhythm = follow the onset density, not a hand-picked list of hits (2026-10-24, Tutti 果味 / 日漫 OP)
Rejected: "节奏太慢，配合音乐的节奏变化不够". The cut count was fine (30 hard cuts), but the picture held still exactly where the track was busiest (9 onsets after the drop, 14 in the bridge tail), and nothing reacted to kicks or hats.
Fix that worked: export onsets / low_hits / high_hits from analysis.json into `beats.js`; build every scene's changes from `within(ON, a, b)` instead of hand-typed times; wrap every scene in a beat camera (zoom punch + tilt on lows, micro jitter on hats). Before the first render, print onsets per section next to the shot map and check that each section changes at least as often as its onsets do.

## Stylized ≠ filter over the user's photos; a brand film needs a story (2026-10-24, Tutti 日漫)
Rejected: an anime-OP cut that was mostly the user's demo photos turned into tonal silhouettes. "太依赖真人素材，没讲好叙事，也没讲好产品在干嘛". 
What to do instead: draw the world in code — props, sets, a protagonist object (here an old polaroid dated 2023.08.14), with people only as small silhouettes inside it. Hang a story on the brand line (ONE MORE TAKE: a camera-roll apartment block asleep at night → slate TAKE 2 → hanger crane → transformation → recipe paper-plane relay across cities → whole building lights up = tutti). Write 6 story axes first; the user's example (desk-objects film) is at most one axis.

## Surprise is the ad; effects need names (2026-10-24, from the Tutti films)
- The user: the unexpected thing (a TV sliding out of a bus-stop frame, a mascot that dies, a reply that names you) *is* the essence of advertising. A beautiful film with no mechanism around it is not enough → `campaign.md` is now required before the audio plan.
- Beat helpers (`within`, `pulse`, `beatCam`, `lastIdx`) now live in `motion-lib.js`; a project's `beats.js` should only hold the ON / LOW / HIGH arrays, or `const` redeclarations will break the page.
- Effects are chosen by name from `vfx-techniques.md` with a source behind them, not invented per film; check a new effect in `fx-demo.html` stills before using it in a shot.

## Style frames must BE the style, in motion, without real people (2026-10-24, Tutti 日漫 redo, rejected again)
Rejected: "那根本就不是代码动画，放那么多真人上去和日漫没什么关系…没有真的掌握日漫的风格化". After 139-item research I still delivered three static posters of real (AI) photos with halftone/speed-lines behind them. The research named the devices (cel two-tone shading, line boil, limited animation on twos, smear frames, Shaft cards) but the frames used none of them on the subject.
Rule: a stylized style frame is a short code-animated loop (2–3 s, on twos) where the *drawn* world and characters carry the style; photos may appear only as products inside that world (a print, a screen), never as the protagonist. Re-read this file before any style frame. Stickers/cut-out sticker play was the one part he liked.

## Skipping real-frame research again = "都好丑" (2026-10-24, Copy That style frames)
Rejected all 7 directions at once: "都好丑 你没好好找参考吧". I built them from the style library's text entries plus code-drawn props (a fake walkie-talkie, a fake receipt) without pulling a single reference frame, and without the product's real outputs.
Rule: step 3 is not optional even when a style library exists — library text names a style, it doesn't show its craft. Pull contact sheets first, put every style frame beside its reference with "where it falls short", and build launch films from the product's real outputs, not drawn stand-ins.

## Real objects as the interface language, in the film too (2026-10-24, Tutti hanger)
The user kept the one piece of UI that is a real object (a cord with today's photos pegged on it) and asked for the approach everywhere; the same night he rejected a tab bar stacked under that cord as clutter. For films: when the product's UI is built from real objects (cord, pegs, prints, rubber stamp, film canister), the film's props and transitions should be those same objects doing what they really do (a print is pegged up and swings, a stamp comes down, a strip is pulled), not generic motion-graphics devices. One object per job, ≤3 kinds per shot, drawn in the brand's line, never 3D skeuomorphic. The product's object table lives in its design notes (Tutti: `docs/design-notes/real-object-metaphors-2026-10-24.md`); read it before the shot map.

## Websites are films that wait for a finger (2026-10-24, tutti.pics hero)
Three site heroes built as page layouts (paper margins, small photo, captions, two buttons) and only then compared with Lapse / TE / Shopify were called "完全不是一个事情, web 感太重". The accepted direction used this skill's own film method: one key visual as a layer sandwich (saturated ground → giant warped slogan as material → real cutout subject → flash → grain), the product's action (flash) as the transition, subjects rotating per state. For any web hero, run steps 3–4 (real frames → technique sheet → style frame) first; pro-launch `06c-web-craft.md` has the web tool table and the `phase_gate.py web` order check.
Accepted the same night (2026-10-25): "非常好了，非常完美了……这回真的很好", deployed. What made the difference, in order: the user named the liked reference → its layers were dumped → technique sheet committed before code → the product's own action (flash) became the transition → the visitor's own photo became the subject → verified with phone recordings, not self-scores. Encoded as `references/web-craft.md` + `scripts/web_gate.py`; two fresh-agent effect tests (pro-motion and pro-launch) both listed refs → layer dump → technique sheet → gate before any site code.

## Matching a reference one-to-one = copying (2026-10-25, Copy That style frames round 2)
Rejected: "b 直接变成抄了 配色都不改 没有创意结合的部分". Each direction had been built from exactly one reference, palette included (Spotify's violet + mint), so the frame read as a copy, however faithful.
Rule: copying is allowed only inside the technique sheet. A direction fuses **≥ 2 references** (take a device from each), and the palette, the core idea and the use of real material must be your own, tied to the brand. The comparison page has three columns per reference: what was taken · how it was changed · where it still falls short. Accepted next: "On Air" (tally red / bone / ink), row weight = the track's level meter, layer sandwich from the tutti.pics hero.

## Fonts must be local before a parallel render (2026-10-25, Copy That film)
Stills rendered fine, but the full parallel render died twice with "Navigation timeout of 30000 ms": every tab fetched Google Fonts over a slow network. Download the faces into the project (`fonts.css` + files; for CJK use an installed variable font or a `&text=` subset) and link them locally before `render-fast.js`.

- 2026-10-26 p5-mood-art：云画成一个模糊椭圆、柳条画成一条直线摆、牡丹用几层同形贝塞尔，被评"20 年前动画的感觉，完全不行"（颜色本身被认可）。自然物（云、雾、水、绸、花瓣）不要用 Canvas 2D 基本图形拼，直接上全屏片元着色器：域扭曲 fbm 做云，沿光线偏移取样做背光金边，绸缎用斜向褶皱 + pow 高光 + 边缘透光 + 高频丝线噪声，远景用失焦光斑。验收看"细节密度"：放大到一半屏幕还有纹理才算过。

## 讲解片的「果味」= 一屏一句话 + 一个主体，不是 iOS 配色的信息图（2026-10-26，港乐 0243 EP.01）
Rejected:「不知道是字体配色还是排版，看起来不高级」。那一版用了 iOS 系统色和 SF 字体，但每屏堆了标题、图表、图例、标注、脚注、出处和字幕；四个满饱和色平涂圆角块，看起来像儿童教具；内容左对齐，层级很平。
Fix that worked: compare frame by frame with the accepted Tutti Apple cut. Each screen gets one centred line plus one hero filling 60–80% of the frame; colour goes only on the hero, as a gradient that reads as light; numbers are huge gradient type; the legend appears once; subtitles are small and grey. For data explainers the hero is the subject itself (here, the giant lyric character riding its pitch, with a glowing melody line behind it).

## 果味 ≠ 平涂浅灰 + 渐变字；暗场材质才不像网页（2026-10-26，港乐 0243）
Rejected:「颜色还是有点太丑，不要 web 感」「字渐变没必要，用多了油腻，少用才惊艳」。#F5F5F7 平台 + iOS 系统色 + 渐变大字 = 苹果官网截图，不是片子。
Fix that worked: a full-screen material shader behind everything (React Bits Silk, rewritten as an offscreen WebGL2 layer drawn into the canvas each frame), tinted by the meaning colour (here the tone level), with solid warm-white type. Use a muted pigment palette (indigo, jade, gamboge, vermilion), not iOS system colours. One accent colour only on the numbers that are the point; one gradient in the whole film (the end card). Rive-style damped springs with squash for the hero, and React Bits BlurText for lines.

## 一个真实小场景 + 一个有来源的光 + 自己变过去 = 「特别好」（2026-10-26，日历 → 落叶）
Jack：「我去 你这些怎么做的 怎么做得这么好」「日历这个特别好」。没被否掉、第一版就过的原因，按分量排：
1. 用的是作文本那支的方法加代码，子代理开工前先读 `digital-art-short.md`，没有从零开始。所以每个项目接受了什么、否掉了什么，都要写进 skill。
2. 搭了一个以厘米为单位的真实小场景，光从左边窗户来，墙上有窗框影和树影，空气里有光柱，飞的纸在墙上和地上投影。
3. 纸变成叶子是同一张网格的参数在变：纤维变叶脉，撕口变叶边，颜色从日期字往外晕。不是换一张贴图。
4. 内容是真的：日期从七月初一一直撕到霜降，落在发布当天。红字页变枫叶，黑字页变银杏。
5. 收尾不停：风把叶堆卷向镜头，近处的叶子带运动模糊。
这些已经写进 `aesthetic-checklist.md` 的「Set, light & finish」，加上 `vfx-techniques.md` 第 7 节。

## 写实光追加一只手 =「假」；人和人造物的题材先定风格（2026-10-26，地铁拉环 → 秋千 v2）
Jack：「开始的手有点假 转化不太自然 这个的动画不能过 不够风格化」。日历能用写实小场景，是因为纸、墙、叶这些材料写实起来好看。人（手、乘客）放进写实光追里就掉进恐怖谷。吊环变秋千又是靠一团白雾溶过去，这是在换贴图，不是变形。
Rule: 题材里有人或身体，先选一种风格化语言（动画赛璐璐加手绘光、线稿上色、剪纸），人可以简化成剪影或色块，不写实。两种场景之间的变形用「动作匹配」：同一个摆动的角度、同一个屏幕位置，在一次甩镜或一道光里接过去，不用溶解。风格本身也可以带意思，比如大人的世界是灰线稿，童年的世界是水彩。

## 写在 SKILL 里的门槛 ≠ 门槛：讲解片六轮被否，因为没有东西挡渲染（2026-10-26，港乐 0243 EP.01）
Rejected six rounds（C→D2→E→E2→夜缎→稿纸）:「一看就是 ai 做的丑东西」「这个风格又是哪里来的」「像那种商务片」. The session had this SKILL.md in context the whole time (re-injected after every compaction), Jack said「看看 promotion 教学」, and it still: let a Sonnet subagent write technique entries headed「未抽帧，待核」from memory (refs_gate only checked the heading, and was never run); picked the final style with「我补」as its only reference; rendered the film with no `shotmap.md`, no `music/events.json`, no BGM; switched the whole style every round; used 6 of ~110 motion-lib functions. Its reasons: it was "an explainer, not a promo", Jack said「直接出成片吧」, and the 总指挥 brief said to hand the render loop to Sonnet.
Fix that is now in place: `refs_gate.py` rejects unverified entries anywhere in the entry and needs a real `<name>_sheet.jpg` per entry; `film_gate.py` must pass before a film render; `~/.claude/bin/promo-guard.py` (PreToolUse) blocks `render-fast.js` → .mp4 until it does. Rule: an explainer is a film; "直接出成片" means make the missing artifacts fast; reading references is not reading SKILL.md; after two rejections deepen what was accepted instead of switching style.

- 2026-10-26 秋千：配乐要有「炸点」。Summer 开头匀速钢琴，画面的转变没有落点，Jack:「你这个音乐没选好」。改用《人生的旋转木马》里静默后全团炸开的一秒，对在出隧道那一帧。不用流行歌，用国内人人听过的原声配乐。
- 2026-10-26 秋千 B：宫崎骏水彩段被夸「很好」，前面灰线稿通勤人群被批「太丑」「太机械」。Jack：「如果人你建不好就不要用人了」。做不到好看的人就不出现人，用物件、影子、重量感暗示人群；冷色的现实段也要做到日历片的材质水平，不能因为是「对比的前半段」就做简陋。配乐要贴情绪：怀旧题材用《那个夏天》这类温柔涌起的曲子，管弦乐全团炸开会被听成「胜利的辉煌」。
