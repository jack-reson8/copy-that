// AI-tone check for Chinese and English copy: the renhua (人话) checklist as a linter.
// Flags the patterns readers use to spot machine-written posts; each hit carries the rule and how to fix it.
const ZH = [
  ["emoji", "emoji", /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2705}\u{274C}]/u, "删掉 emoji。真人发帖很少用，堆 emoji 是最明显的 AI 味。"],
  ["list", "清单罗列", /^\s*(?:[✅❌✔︎•·▪️\-*]|\d+[.、)）])\s*\S/, "别用 ✅/1. 2. 3. 罗列。要说三件事，用“一个是……还有一个……”串成话。"],
  ["slogan", "金句升华", /(上了一课|难的是|这就是.{0,12}的意义|与其.{1,20}不如|才是真正的|本质上是|说到底|归根结底)/, "删掉工整的总结金句，换成具体发生了什么。"],
  ["stock", "AI 高频句式", /(不是.{1,24}而是|值得一提的是|最大的(感受|收获|体会)|总的来说|总而言之|首先.{0,40}其次|让我们|一起见证|答案是|不得不说|毋庸置疑|在这个.{0,8}的时代)/, "换成你平时说话的说法，或者直接删掉这句。"],
  ["colon", "冒号小标题", /^.{1,12}[：:]\s*$|^(今天的|本周|Day ?\d+|关于).{0,10}[：:]/, "别用“今天的反思：”这种小标题式冒号，直接说。"],
  ["hype", "假装的情绪", /(太震撼了|绝了|破防了|yyds|天花板|封神|炸裂|颠覆|赋能|打造极致|全面升级)/i, "换成具体的感受或数字，比如“好卡啊”“两天就上线了”。"],
  ["ending", "万能结尾提问", /(你怎么看|评论区(告诉|聊聊|见)|欢迎留言|你们觉得呢|点赞收藏|关注我)/, "要问就问一个具体的、你自己也想知道的问题，或者不问。"],
];
const EN = [
  ["emoji", "emoji bullets", /^\s*[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2705}\u{274C}]/u, "Drop emoji bullets; write the point as a sentence."],
  ["stock", "stock AI phrase", /\b(delve|tapestry|testament to|it'?s worth noting|in today'?s (fast-paced|digital)|navigate the (complexities|landscape)|unlock (the|your) (power|potential)|game[- ]changer|elevate your|seamless(ly)?|leverage|harness the power|in the realm of|embark on|a myriad of|robust and scalable)\b/i, "Say the plain, specific thing instead."],
  ["notxbuty", "“not X, but Y” framing", /\b(it'?s not (just )?(about )?\w[^.]{0,40}[,;—-]\s*(it'?s|but)\b|not only\b[^.]{0,60}\bbut also\b)/i, "State what it is; skip the contrast set-up."],
  ["opener", "throat-clearing opener", /^(let'?s (dive|explore|take a look)|in this (post|article|thread)|have you ever wondered|imagine a world)/i, "Start with the point or the most concrete detail."],
  ["closer", "stock closing question", /(what do you think\??|let me know in the comments|drop a comment|share your thoughts|thoughts\?$)/i, "End on a specific question you actually want answered, or just end."],
  ["hype", "hype word", /\b(revolutionary|groundbreaking|cutting-edge|next-level|mind-blowing|supercharge|10x)\b/i, "Replace with a number or a concrete result."],
  ["dash", "em-dash aside", /\s—\s.+\s—\s/, "Em-dash asides read as generated; use a full stop or commas."],
];

function triplets(lines) { // three or more consecutive lines with the same opening and similar length = parallelism
  const hits = [];
  for (let i = 0; i + 2 < lines.length; i++) {
    const a = lines.slice(i, i + 3).map((l) => l.trim());
    if (a.some((l) => l.length < 4)) continue;
    const head = (l) => l.slice(0, 2), lens = a.map((l) => l.length);
    if (head(a[0]) === head(a[1]) && head(a[1]) === head(a[2]) && Math.max(...lens) - Math.min(...lens) <= Math.max(4, Math.min(...lens) * 0.3)) { hits.push(i); i += 2; }
  }
  return hits;
}

export function checkTone(text, lang = "auto") {
  const zh = lang === "zh" || (lang === "auto" && /[一-鿿]/.test(text));
  const rules = zh ? ZH : EN, lines = text.split(/\r?\n/), hits = [];
  lines.forEach((line, i) => { if (!line.trim()) return; for (const [id, label, re, fix] of rules) { const m = line.match(re); if (m) hits.push({ line: i + 1, rule: id, label, match: m[0].trim().slice(0, 40), text: line.trim().slice(0, 80), fix }); } });
  for (const i of triplets(lines)) hits.push({ line: i + 1, rule: "parallel", label: zh ? "排比" : "parallel triplet", match: lines[i].trim().slice(0, 20) + "…", text: lines.slice(i, i + 3).map((l) => l.trim()).join(" / ").slice(0, 80), fix: zh ? "三句结构一样的排比改成一句话说完。" : "Three lines built the same way read as generated; merge them into one sentence." });
  hits.sort((a, b) => a.line - b.line);
  const words = zh ? text.replace(/\s/g, "").length : text.split(/\s+/).filter(Boolean).length;
  const density = hits.length / Math.max(1, words / (zh ? 100 : 60));
  const score = Math.max(0, Math.round(100 - 22 * density));
  const verdict = score >= 85 ? (zh ? "像人写的" : "reads human") : score >= 60 ? (zh ? "有些 AI 味" : "some AI tells") : (zh ? "AI 味很重" : "reads machine-written");
  const md = [`# ${zh ? "AI 味检查" : "AI tone check"}: ${score}/100 · ${verdict}`, "",
    hits.length ? hits.map((h) => `- L${h.line} **${h.label}** “${h.match}” — ${h.fix}`).join("\n") : (zh ? "没发现常见 AI 味。" : "No common AI tells found."),
    "", zh ? "改法：先像跟朋友发语音一样说一遍，再删掉 20% 的字，删最多的应该是形容词、总结句和过渡句。" : "Fix: say it out loud to a friend first, then cut 20% of the words, mostly adjectives, summary lines and transitions."].join("\n");
  return { score, verdict, lang: zh ? "zh" : "en", hits, markdown: md };
}
