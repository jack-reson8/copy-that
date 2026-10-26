# Digital-art shorts (p5.js / generative / 小红书 艺术短片)

Read this when the brief is an art piece, not an ad: a 7–15 s generative or p5.js short for Xiaohongshu / Douyin / IG, "数字艺术", "p5js", "情绪短片", "aha这也是艺术". Steps 1–8 of SKILL.md still apply (audio map, references, style frames, deterministic render); this file changes **what the idea is, how it looks, how it sounds and how it is posted**. Distilled from the p5-mood-art project (2026-10-25/26): about 12 rejected directions, then one accepted and published film.

## A · Before any idea: read the scene, write `docs/scene.md`
Scrape 20–40 posts of the creators the user names, plus the top posts for the genre tags. Use `node tools/xhs.js` if the project has it; otherwise the browser. For each post, log the title, the body, the first 2 s, when the music enters, the cover frame and likes. Then write two lists. **共性** is what all the winners share; you must keep these. **个性** is the angle nobody is doing; your film lives there.
Patterns already found (✓ measured on 4 creators and 164 posts, 2026-10):
- Title: a short emotional or poetic line, or an idiom twisted (放羊 / 走马不观花 / 老师说，梦想要写在纸上). It is never a description of the technique.
- Body: only hashtags. No explanation of how the piece was made.
- Picture: quiet for the first 2–3 s. The music enters at the moment of transformation.
- Topic: a memory everyone shares (school notebook, office badge, phone in bed). That is what makes people save and share. Pure abstraction gets likes but no shares.

## B · The idea: one everyday symbol transforms itself
Gate: write the idea as **"<a symbol everyone has touched> → by its own material, becomes → <what it secretly means>"**. Examples:
- composition-book lines → torn page cells become a flock of birds (梦想 flies away);
- a fingerprint clock-in → contour mountains;
- a falling stock chart → a ski slope.

The change must have a cause the viewer can read in one view. The symbol's own parts (its lines, cells, characters) become the new thing. Do not cut to something new. Propose ≥6 symbols on different axes, pick 3, make 3 style frames (SKILL.md §4).
Rejected, with the user's words, so don't repeat them:
- **Abstract squares / grids / "modern art" looks.** Squares and grids that only read as "modern art" were rejected four times as "看不出含义".
- **Meaning hidden in voice or text.** A meaning carried only by a voice clip or by text was rejected: "看不出含义", "还是普". The meaning must be readable from the picture alone.
- **Flat Canvas-2D primitives** for clouds, willow, silk or flowers: "20 年前动画的感觉".
- **Clip-art endings.** An ending that "grows" something (line-drawn clouds, sprouts) was called ugly. Motion beats a static image: "动态永远比静态好看". End on many things scattering or flying apart, not on a picture that sits still.

## C · Look: material first, motion always
- **Natural material is a full-screen fragment shader, never 2D shapes.** Use paper fibre, domain-warped fbm sky, and backlit rims; pass the camera into the shader as a uniform so the parallax is real. Acceptance test: crop to half the screen and there is still texture. See also `lessons.md` 2026-10-26.
- **Dissolve the symbol into particles.** Each cell, glyph or stroke of the symbol becomes one agent. Draw the symbol into an offscreen canvas and punch `destination-out` holes where agents leave, so the source visibly empties.
- **Agents have readable physics.** Each agent gets a burst, then a rise, a sideways drift, a shared low-frequency noise (the flock feels one) and a depth z that sets size and haze. Launch them in a wave from the cause, for example the tear edge, not all at once.
- **Something must drag the old form along.** For example, a bird pulls its line out of the page. This keeps the transformation causal. Fade the traces out within about 2 s, or they look like grass.
- **Make it big and close.** Add 3–4 hero agents that pass close to the camera, in screen space, with blur and ghost copies. Move the camera too, for example pitching up into the sky. These give the depth and the "wow" frame, which is also the cover.
- **Never hard-cut a leftover.** Fade remnants with alpha over ≥0.5 s. A piece that disappears in one frame reads as a bug ("是不是 bug 了").
- **Engineering rules.** `render(t)` is pure; `window.renderAt(t)` is the recording hook; one HTML file; no `Math.random` (hash per agent id).

## D · Sound: real recordings, the creator's music, measured balance
- **Music.** The user's reference creators' BGM can be used directly; don't refuse and don't synthesise. Numpy music-box plinks were "太难听".
  - Identify the track first: cut a 12 s mp3 and `curl -F file=@clip.mp3 https://api.audd.io/`. ShazamKit CLI fails with error 201.
  - Credit the track in the post, and attach the same track from the platform's music library when publishing.
  - Get the best source. xhs default downloads are HE-AAC 56k. Take the highest-`avgBitrate` stream from `__INITIAL_STATE__…video.media.stream` (h265, 128k audio) and download it with a Referer header.
- **Mastered commercial track = 1:1.** Peaks are already at 0 dBFS, so add no gain and no extra limiting. Fit the SFX around the music. Pushing it was heard as "smaller and worse than the original".
- **SFX are real recordings, synced per event.** Sources:
  - Final Cut Pro library `/Library/Audio/Apple Loops/Apple/Final Cut Pro Sound Effects/`: pencil, room tone, tear, wings, low hit, whoosh, airy. Best first stop.
  - Logic Alchemy `/Library/Application Support/Logic/Alchemy Samples/`.

  Slice the pencil sound per written character. Put a low hit on the transformation frame. Wings follow the bird waves.
- **Hook the silence.** The first second must already make sound: pencil scratch plus room tone plus air. "刚进来没有配乐也没有声音" was a complaint.
- **Mix in code** (`mix.py`: numpy `put(file, t, gain, pan, fade)`, env vars `MUSIC_DB` / `SFX_DB`, `STEMS=1` writes `stem_music.wav` / `stem_sfx.wav`).
  - Balance **per section**, not by integrated LUFS. A sparse intro got buried under the pencil although the total looked fine.
  - The limiter ceiling is 0 dB, `alimiter=limit=1`. Set loudness with the gain before it, aiming for about −10 LUFS integrated. Never crush to get there: limiter gain reduction ≤3–4 dB, crest ≥10 dB per section.

## E · Iterate and ship
- **Audio-only change = remux, never re-render.** Use `-map 0:v -map 1:a -c:v copy`, to a **new filename**. If you kill a recorder, kill its ffmpeg child too: a stray child overwrote a delivered file and froze both picture and sound.
- **Gate before every delivery:**
  `python3 <skill>/scripts/ship_check.py out/film.mp4 --cuts <section seconds> --music stem_music.wav --sfx stem_sfx.wav`
  It must print ✓. It checks frozen frames, audio length, LUFS, true peak, crest per section and music over SFX per section. Don't let the user be the tester.
- **Post kit.** Write it with the `renhua` skill and show 2–3 alternatives with one-line reasons.
  - Title per §A: a short line, no technique words.
  - Body: hashtags only (topic tags + #数字艺术 #vibecoding #aha这也是艺术 …) plus the BGM credit.
  - Cover: the widest, most dynamic frame (hero agents near the camera), **no text on the cover**.

## Worked example
`~/Desktop/vibecoding/p5-mood-art/samples/zuowen/` (published 2026-10-26 as 「老师说，梦想要写在纸上」):
- `index.html`: paper and sky shaders, tear, cells → birds, pulled lines, near birds, camera;
- `mix.py`: creator BGM 1:1, Final Cut SFX per character, stems;
- `shotmap.md`;
- `docs/coordination/current-work.md` in that project has every rejected round.
