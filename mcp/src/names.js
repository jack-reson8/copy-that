// Name check: domain registration signals (RDAP) plus App Store, GitHub and npm same-name collisions.
// Signals, not verdicts: a "free?" domain can still be premium-priced; confirm on the registrar checkout page.
import { promises as dns } from "node:dns";

const PREFIXES = ["hi", "get", "my", "use", "the", "go", "try"], SUFFIXES = ["app", "hq", "studio"];
const UA = { "user-agent": "copy-that-mcp" };
const timed = (url, opt = {}) => fetch(url, { ...opt, signal: AbortSignal.timeout(15000) });

async function rdap(domain) {
  const tld = domain.split(".").pop();
  const url = tld === "com" || tld === "net" ? `https://rdap.verisign.com/${tld}/v1/domain/${domain}` : `https://rdap.org/domain/${domain}`;
  let st; try { const r = await timed(url, { headers: UA, redirect: "follow" }); st = r.status === 200 ? "taken" : r.status === 404 ? "free?" : `?${r.status}`; } catch { st = "?net"; }
  if (st === "taken") return st;
  // Some registries (.io, .co…) have no RDAP and rdap.org answers 404 even for taken names: a live NS record settles it.
  try { await dns.resolveNs(domain); return "taken"; } catch (e) { return e.code === "ENOTFOUND" || e.code === "ENODATA" ? (st === "free?" || st.startsWith("?") ? "free?" : st) : st; }
}
async function appstore(name, country) {
  try { const r = await (await timed(`https://itunes.apple.com/search?${new URLSearchParams({ term: name, entity: "software", limit: "10", country })}`)).json();
    const n = r.results.map((x) => x.trackName).filter((t) => t.toLowerCase().replace(/\s/g, "").startsWith(name.toLowerCase())); return n.length ? `${n.length} (${n[0].slice(0, 28)})` : "0"; } catch { return "?"; }
}
async function exists(url) { try { const r = await timed(url, { headers: UA }); return r.status === 200 ? "taken" : r.status === 404 ? "free" : `?${r.status}`; } catch { return "?"; } }

export async function checkNames(names, { tlds = ["com", "app", "ai", "io", "co"], stores = ["us"], variants = true, maxlen = 10 } = {}) {
  const out = [];
  for (const raw of names.slice(0, 10)) {
    const name = raw.toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!name) continue;
    let cands = tlds.map((t) => `${name}.${t.replace(/^\./, "")}`);
    if (variants) cands.push(...[...PREFIXES.map((p) => p + name), ...SUFFIXES.map((s) => name + s)].filter((l) => l.length <= maxlen).map((l) => `${l}.com`));
    cands = [...new Set(cands)];
    const doms = [];
    for (let i = 0; i < cands.length; i += 8) doms.push(...await Promise.all(cands.slice(i, i + 8).map(async (d) => [d, await rdap(d)])));
    const [stor, ghu, npm] = await Promise.all([Promise.all(stores.map(async (c) => [c, await appstore(name, c)])), exists(`https://api.github.com/users/${name}`), exists(`https://registry.npmjs.org/${name}`)]);
    out.push({ name, domains: doms, appstore: stor, github: ghu, npm });
  }
  const md = out.map((r) => {
    const free = r.domains.filter(([, s]) => s === "free?").map(([d]) => d).sort((a, b) => a.length - b.length);
    return [`## ${r.name}`, free.length ? `Free? (shortest first): ${free.slice(0, 8).join(", ")}` : "No free domain among the candidates.", "",
      "| domain | status |", "|---|---|", ...r.domains.map(([d, s]) => `| ${d} | ${s} |`), "",
      `App Store same-name: ${r.appstore.map(([c, n]) => `${c} ${n}`).join(" · ")}`, `GitHub user/org: ${r.github} · npm package: ${r.npm}`].join("\n");
  }).join("\n\n");
  return { results: out, markdown: `# Name check\n\n${md}\n\n"free?" = no RDAP record. Premium or reserved names also show as free: confirm the price on a registrar's checkout page before telling anyone.` };
}
