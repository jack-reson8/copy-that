# Aesthetic checklist (run before coding and on every review frame)

Each line came from a real rejection or acceptance (launch films, web heroes, 小红书 art shorts). The "Set, light & finish" block is what separated the accepted calendar short (2026-10-26, 「特别好」) from the earlier "20 年前动画" rounds — it applies to every kind of film and to web heroes.

## Story & continuity
- [ ] There is one protagonist (object / shape / mascot) visible or implied in every scene, and it ends inside the logo.
- [ ] No scene is "a frame whose content swaps on the beat" — that reads as PPT even inside one continuous camera.
- [ ] Every transition is listed in the shot map with its mechanism (match cut, morph, wipe, push, convergence, slam).
- [ ] The ending is born from the previous scene, not a separate end card.
- [ ] Every transformation is **one object changing its own parameters**, not a cut to a new asset: list in the shot map which properties carry over (calendar page → leaf: same mesh curls, paper fibre direction field rotates into radial veins, the torn deckle edge becomes the leaf's wavy margin, colour bleeds out from the printed numeral). If nothing carries over, it reads as a swap.
- [ ] Variation comes from the subject's own data, never from random: red Sunday / holiday pages become maple, black weekday pages ginkgo; a product film's variants come from real features, real colours, real UI states.

## Motion
- [ ] Each feature is shown *performing* (punch = impact, dots = rhythm, outline = draw-on, sticker = peel), never as a static after-image.
- [ ] Big moves land on analysed onsets; secondary moves on 8ths / 16ths; held sections breathe (slow drift, hang time).
- [ ] Animation principles: anticipation before hits, squash & stretch on landings, overshoot / spring settles, staggered follow-through, motion trails on fast objects.
- [ ] Two frame rates: hand-drawn lines boil at 12 fps, camera and objects stay at 60 fps.
- [ ] Easing has character: expo-out for UI and type, springs only for characters and stickers.
- [ ] Each moving thing has its own readable physics with character, from its id hash: leaves swing + tumble (quaternion slerp, not Euler spin) + gust; drops stick → slide → stick; flocks share one low-frequency noise so they feel like one body.
- [ ] The finale keeps moving (scatter, gust, flow); "动态永远比静态好看".

## Type
- [ ] Text is part of the animation (written by the protagonist, rides a path, echoes an effect) — never a floating caption over it.
- [ ] No decorative / "art" fonts, no label chips, no lower-third templates, no boxes behind text.
- [ ] Handwriting fonts per language when the brand is doodle / indie (OFL: Patrick Hand EN/VI, ZCOOL KuaiLe ZH, Yomogi JA, Gaegu KO); one clean sans (SF Pro / PingFang) otherwise.
- [ ] Words are few; the picture carries the meaning.
- [ ] Nothing important is covered by particles / dots — clear a soft lane for the text, then let it dissolve back.

## Material
- [ ] Assets look current (flash / film / candid, Gen-Z subjects) or are pure graphic; no dated stock, no code-drawn "ugly" mascots.
- [ ] Prefer half-body subjects, pets, objects; big close-up faces get covered by effects.
- [ ] Brand colours used as full-screen blocks at key hits; the base is a **material** (paper, wall, glass, silk shader), not a flat light-grey or soft gradient field — flat pale bases read as web screenshots.
- [ ] The product's real design language (UI, icon, mascot) appears, but UI is a moment, not the whole film.

## Set, light & finish (every film and web hero)
- [ ] Build a tiny real set, not a flat composition: world units (cm), a wall, a floor, a camera with depth. Flat canvas layouts look like slides even when animated.
- [ ] **One motivated light source** with a position (a window at x = −170 cm), and everything obeys it: raking light on the wall, window-frame shadow with moving tree shadow, light shafts in the air, backlit translucency and bright rims on thin things (paper, leaves, petals, glass).
- [ ] Moving objects cast shadows on the nearest wall / floor; without contact shadows they float like stickers.
- [ ] Detail density: crop any frame to half the screen and there is still texture (fibre, terrazzo, condensation). Surfaces are computed per pixel in a shader.
- [ ] Depth layers: 2–4 hero objects pass close to the camera with motion blur and shallow depth of field; that frame is also the cover.
- [ ] Content is **true and specific**: real dates with lunar day and solar term (stops on 「23 霜降」, the actual day of release), real UI, real place names. One true detail carries more emotion than any effect.
- [ ] Finish pass on every frame: bloom on highlights, vignette, film grain. Never deliver the raw render.
- [ ] Write the weakest point yourself before showing ("撕页像折页"); fix it or say it.

## Languages
- [ ] One master cut (EN) + local cuts that swap only key lines; decorative multilingual text kept in all cuts.
- [ ] Never stack 5 languages in one block of text.
- [ ] Translations flagged for native-speaker review.

## Objects (when the product's UI is built from real things)
- [ ] Props and transitions are the product's own real objects doing what they really do (pegged print swings, stamp comes down, film strip pulls); no generic MG device where an object would do.
- [ ] ≤3 kinds of object per shot; one object per job; drawn in the brand's line, not 3D skeuomorphic.

## Delivery
- [ ] `scripts/ship_check.py` prints ✓ (no frozen frames, audio full length, loudness and per-section balance).
- [ ] Self-check with a contact sheet or 1–2 frames at 600 px for bugs (off-screen, backwards text, seams, overlaps); the user is shown the video itself, not the sheet, when a short video already shows everything.
- [ ] File opened for the user + clickable links; side-by-side page for multiple cuts.
