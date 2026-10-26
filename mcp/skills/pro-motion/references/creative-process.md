# How the ideas were found (process, not cases)

Read at step 1 (campaign brain) and at web-craft W0 step 3, before any style frame. Output: `docs/idea-trail.md` in the project with the eight moves below filled in. Cases and modules show *what* worked; this file is *how to get there next time*, for a different product. Every move came from the tutti.pics site (2026-10-24/25), where round 1 was "web 感太重" and round 2 was "非常好了，这回真的很好".

## The eight moves (write each one down; a blank move means the idea isn't ready)
1. **Purpose in one line, in the viewer's terms.** Not "showcase features" but "in 3 seconds she sees an ordinary photo become a great one and thinks 我去还能这样". Every later choice is checked against this line.
2. **Find the product's verb.** What does the product physically *do* in one gesture? Tutti: flash → poster; punch holes; hand over a 6-character code. The verb becomes the page's transition, the film's cut, the share card's reason to exist. A page that describes the product instead of letting the verb happen is a brochure.
3. **Axes before answers.** ≥6 different idea axes; the user's own example fills at most one. Tutti v3: scroll story (user's), effect-as-transition, the code as protagonist, page-is-a-camera, clothesline, visitor-as-protagonist, one-switch-flips-all. Write one representative per axis, then pick.
4. **Steal a mechanism from outside the category, a look from inside the user's taste.** The look came from the reference the user loved (Lapse: layer sandwich). The mechanism came from somewhere unrelated (Shopify's Boring/Not boring switch → one flash flips the whole poster; Kelvin's colour-block cuts → one slab per feature). Never take both from the same source.
5. **Turn every product noun into a page mechanism.** Make a table: noun → what the page lets you *do* with it. Tutti: share code → code page that never 404s + code-only poster (media hijack); template → poster state; failure → fake-broken 404; "new every day" → today's opening look; export → save = share card with the code; waitlist → visible rank, +5 per friend. Nouns with no row are features you are only describing.
6. **Beat the reference on the axis it can't move.** The reference is static art (Lapse = PNGs). Ask: what can a live page do that the reference can't? Finger pushes the type; the product's own action is the transition; the visitor's own photo becomes the subject. That gap is the "我去还能这样".
7. **Fuse to ≤3 interlocking mechanisms**, and say how they lock: v2 = live type wall × flash-to-flip × your photo; each one makes the other two better (your photo is worth flipping through; the flip shows the wall is alive). Everything else becomes a local detail of one section, or is cut.
8. **Derive before you build.** For each kept mechanism write 3 variants by changing one parameter (trigger: tap / scroll / tilt; medium: page / poster / sticker / avatar; who acts: visitor / friend / stranger). The code-only poster came from "code" × "medium = printed poster". Keep the variants list: it is next month's campaign.

## Tests before showing anything
- Remove the logo: is it still recognisably *this* product doing *its* verb?
- Count sentences that describe the product. Each one is a missed demonstration.
- Can a 15-year-old say what to do in 3 seconds without reading? (Jack: "让用户感到容易理解并且有趣"; novelty is allowed, puzzles are not.)
- Is anything drawn in code that a designer would have drawn? Replace with real output or cut.
- Kill list: write what you dropped and why (round 1: paper margins, code-drawn shutter, broken-image glyph); the next session reads it before ideating.

## Where the process lives in the files
`docs/idea-trail.md` (moves 1–8 + kill list) → `technique-sheets.md` (refs decoded) → `style-frames.md` (Register, frames, Core gap, Picked) → code. `web_gate.py --ship` checks the last three; this file is checked by reading `idea-trail.md` at the review.

## Association chain: how an object becomes a feeling (accepted 2026-10-26, 作文本 / 日历 / 正在输入)
Use this for every art short, and for brand films whose protagonist is an object. It is the way of thinking behind the accepted ideas. Write the chain as a table in `docs/idea-trail.md` before any picture; a row with an empty cell is not an idea.

| Step | Question | 作文本 | 日历 | 地铁拉环（Jack 选） |
|---|---|---|---|---|
| 0 Statement | What line would the viewer say out loud after watching? A pretty match with no statement fails (Jack 2026-10-26 on TV static → snow:「没有主旨…我想有点表达」). | 梦想被撕走了 | 再撕几页就冬天了 | 小时候真好啊 / 如果能回到小时候 |
| 1 Feeling | What does everyone feel and rarely say? | the dream I wrote as a kid | the year slipped by | adult life is being shaken around |
| 2 Holder | Which everyday object everyone has touched holds that feeling? | composition book | tear-off calendar | the swaying subway hand strap |
| 3 Own verb / material | What does that object physically do, or what is it made of? | grid cells, torn page | a page is torn off and drops | it swings with the train |
| 4 Bridge | What thing in the world shares that verb or shape **and** carries the feeling? | birds lift off (cells → wings) | leaves fall (paper → leaf) | the childhood swing (strap → swing seat) |
| 5 Double-match test | Say "X 和 Y 都会 <动词>，而且都意味着 <情绪>". Both halves must be true. | both lift off; both mean leaving | both fall; both mean time passing | both swing; one is pushed by the commute, one by a parent |
| 6 Data and truth | Which real data of the object picks the variants, and which true detail ends it? | the characters 梦想 lead the flock | red page → maple, black page → ginkgo; ends on the real date 霜降 | the real morning-rush crowd and the station name |
| 7 Now | Why does this land this week? | back-to-school memory | 霜降 is the release day | any workday morning |

Rules that came from the rejections:
- **A double match is necessary but not sufficient**: it needs a statement (step 0). Also rejected: tangled earphone wire → song waveform; the typing dots → rain looked worse than its idea, so a match also has to promise a strong picture.
- **Shape match only means it is decoration.** It looks alike but means nothing ("看不出含义").
- **Meaning only means the meaning is told, not shown.** The meaning is carried by text or voice ("还是普").
- **No holder object means the piece is abstract.** Squares and grids read as "modern art".
- **Generate wide, then filter.** Write ≥6 rows on different life axes (school, work, family, city, phone, seasons) before judging any of them, and pick by the double-match test.
- **Vary the transformation across a series.** Use a different verb each time: scatter, fall, condense, split, unravel, drain. That way the account never repeats itself; birds and then more birds would.
- **For brand films, the holder is the product's own object.** A shutter, a share code, a stamp. Steps 4–5 find what it becomes; this is move 2 (the product's verb) pushed one step further, into a feeling.
