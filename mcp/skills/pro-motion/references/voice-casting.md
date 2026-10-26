# Voice casting: who speaks, and why that voice is the idea

Narration is the second instrument. For a non-standard, stylized or meme film, **the voice choice is often the campaign mechanism itself**: a kids' show narrator explaining something to adults, a 带货 host selling a free tool, a documentary voice over a toy car. Pick the voice at step 1b, together with the music, before any picture exists.

Engine: Fish Audio `s2.1-pro-free` (free, no hard character cap, fair use, no SLA; dates of the free period change, check the blog). Key in `~/.config/tts-keys.env` as `FISH_API_KEY`. Accepted settings ("C"): `prosody.speed 0.95, temperature 0.5, top_p 0.6, normalize true, latency normal`. Drama 3 needs separate API credit (HTTP 402 otherwise).

## Writing for the voice
- The model performs the text: write the way that voice would talk. A calm share uses 其实 / 后来我就 / 你会发现, many commas, no exclamation marks; a 带货 line uses 家人们 and exclamation marks.
- Generate sentence by sentence, two takes each, keep the take with fewer ASR errors, join with 0.25–0.4 s gaps. Don't add a "humanize" post chain on good voices; it makes them worse.
- Re-time the music to the final voiceover length, not the other way round.

## Audition fast (one minute for a whole wall)
`~/Desktop/vibecoding/explainer/tts-online/`:
- `wall.py <dir> [title] [note]`: reads `<dir>/list.txt` (`M|F name voice_id` per line), generates, trims silence, loudness −16 LUFS, writes one `voices.html` with embedded audio. `TEXT=...` env swaps the script.
- `multiwall.py <dir> <title>`: reads `cats.txt` (`# type|script` headers, then `name voice_id` lines), one script per type.
- Use the `heavy.sh lite-…` fast lane; publish the page as one artifact instead of sending files one by one.
- Find voices by script, not by ear: `GET https://api.fish.audio/model?language=zh&sort_by=task_count&title=<keyword>` and read the descriptions.

## Cast list (Jack's picks, 2026-10-25)
| Role | Voice | id | Use it for |
|---|---|---|---|
| Default narrator | 男生新学霸-南山 | b220d28a2f8742dfb809dda9c144ae8c | Jack's own voice: 20-something, gentle, calm, everyday sharing. Default for explainers |
| Whisper hook | 耳语轻声 | b46a0a7e3a4b47518ad771d345d56a86 | Growth: intimate, non-standard, stops the scroll |
| Mock 带货 | 苏建诚带货·台湾腔 | 839f21c977b0400cb1aa3c080992f0e3 | Stereotyped live-commerce parody, with fake 带货 UI on screen |
| Mock 带货 | 带货女 | 15fce4ee7c2241e199d086faaf615bb3 | Same, female |
| Mock 营销号 | 营销号 | 5653cea4ac83480aaf2bf45406556185 / 3b0564702a264ce58f6d13e0b8f2bd74 | 震惊体 parody, meme cuts |
| Kids-show-for-adults | 仔仔熊 | a70777dbccd044f5afe0fcff32096077 | Talk to the audience as if they were children; adults find it absurd and funny (整活) |
| Kids-show-for-adults | 布鲁伊 | e98e3279c6bc422f8b67d42f3d43bca5 | Same |
| Fake documentary | 李易纪录频道款 | 10f2f5c8cf8f4b158dc8bc61cc58c112 | Mock documentary / channel narration over trivial subjects |
| Fake promo film | 宣传片磁性男 | 5515551e5f38435c8d1931e10a78b5fb | Over-serious promo-film style |
| Comedy | 港剧磁性男生 | 2786a9e90ebd4bd3983707102f19ad39 | Exaggerated, comedic |
| Character | DIO | 5a8e46f1b94c4351aebb8a66b113cec5 | Meme villain moments |
| Character | 懒羊羊 | 131c6b3a889543139680d8b3aa26b98d | Cartoon persona |
| Character | 刘德华款 / 邓紫琪款 | cb03a4a3ff6a4784b319cde85a07e31c / 3b55b3d84d2f453a98d8ca9bb24182d6 | Star-feel lines |
| Character | 外国人 | d56c21b11c184ff1ba4d0fc02ec59871 | Foreigner speaking Chinese |
| Character | 东北猛女 | 8ff60fcbaa8748429da6ae4708d40e61 | Loud dialect comedy |
| Female lead | 嘉岚3.0 | fbe02f8306fc4d3d915e9871722a39d5 | Best female voice for everyday content |
| Female real | 福建甜妹 | 5671e9d40d7a48e1b81e78ff58359903 | Very real, fun |
| Formal | 赵阳 | 3f43595927244394858adeefd39293d1 | Serious announcements only, not lifestyle |
| Also liked | 曼波 0f08cacd3e354471a4b94dd00b4cc4a3 · 卢本伟款 24d524b57c5948f598e9b74c4dacc7ab · 影视飓风Tim款 91648d8a8d9841c5a1c54fb18e54ab04 · 爱丽丝中配 e488ebeadd83496b97a3cd472dcd04ab · 派蒙 eacc56f8ab48443fa84421c547d3b60e · 娱乐 db54b7adb3c343509bb648f14462f8ab | | Trend / character flavours |

## How to pick one for a stylized idea
1. Write the mechanism in one line (e.g. "an adult tool explained like a kids' show").
2. The voice should create the contrast: a genre voice over an off-genre subject (documentary × toy car, 带货 × free tool, kids' host × developers).
3. Put the matching on-screen grammar beside it: fake 带货 UI for 带货 voices, documentary lower-thirds for the documentary voice, a bright kids' palette for the kids' voices.
4. Celebrity- or character-named voices are fine for memes and private tests. Before a growth post, flag that platforms may limit AI imitations of real people, and that the caption must not imply it is the real person.
