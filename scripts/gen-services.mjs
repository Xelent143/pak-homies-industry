import fs from "node:fs";
import path from "node:path";

const KEY = "2b070f97fed53a25eb9f2460f5964936";
const OUT = path.resolve("client/public/images/generated");
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const NEG = " Absolutely no text, no captions, no labels, no overlays, no watermarks, no logos, no writing anywhere, no UI elements, no fake CGI look, no oversaturated colors.";
const STYLE = "Documentary photo of a real working Pakistani garment manufacturing factory in Sialkot, natural daylight from factory windows, photorealistic, original honest industrial photography, no cinematic color grading, no smoke, no dramatic spotlights, just real factory floor lighting, sharp focus, shot on Canon DSLR, ";

const services = [
  { file: "service-pattern-making.webp", prompt: STYLE + "an actual pattern master at a Pakistani garment factory cutting kraft paper patterns by hand on a long wooden table, scissors, ruler, French curves, weights holding paper down, chalk marks, paper pattern pieces stacked beside a sewing machine. Authentic working environment, slightly cluttered, real." + NEG },
  { file: "service-sublimation.webp", prompt: STYLE + "a real Mimaki wide-format sublimation printer in operation inside a Pakistani garment factory, the printer head moving across a roll of polyester transfer paper printing clean graphics, ink cartridges visible on the side, factory floor visible behind. Honest product shot of the actual machine, no smoke effects." + NEG },
  { file: "service-embroidery.webp", prompt: STYLE + "a real Tajima multi-head industrial embroidery machine (12 heads in a row) actively embroidering on hooped denim panels in a Pakistani garment factory, hundreds of thread spools mounted on the rack above, needles in mid-stitch, machine's metal frame and Tajima branding plate visible. Authentic factory floor scene." + NEG },
  { file: "service-material-sourcing.webp", prompt: STYLE + "interior of a real Pakistani fabric warehouse, vertical rolls of denim, fleece, cotton jersey and ripstop neatly stacked floor to ceiling on metal racks, fluorescent ceiling lights, concrete floor, a wooden table at front with folded fabric swatches in different colors. Real working warehouse, not staged." + NEG },
  { file: "service-rhinestone-studs.webp", prompt: STYLE.replace("Documentary photo of a real working Pakistani garment manufacturing factory in Sialkot, natural daylight from factory windows, ", "Clean ecommerce product photography on a plain off-white background, ") + "overhead flat-lay shot of an organized assortment of mixed crystal rhinestones and metal studs — clear and colored rhinestones in various sizes (SS6 to SS40), silver pyramid studs, gold cone studs, round dome studs, black spike studs, all neatly grouped. Sharp macro detail, soft even studio lighting, photorealistic, the kind of image you'd see on a wholesale supplier's product page." + NEG },
];

async function tryFetch(url, opts, attempts = 5) {
  for (let i = 1; i <= attempts; i++) {
    try { return await fetch(url, { ...opts, signal: AbortSignal.timeout(45000) }); }
    catch (e) { console.log("retry", i, "/", attempts, e.message || e); await new Promise(r => setTimeout(r, 3000 * i)); }
  }
  throw new Error("all retries failed");
}
async function post(url, body) { const r = await tryFetch(url, { method: "POST", headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" }, body: JSON.stringify(body) }); return r.json(); }
async function get(url) { const r = await tryFetch(url, { headers: { Authorization: `Bearer ${KEY}` } }); return r.json(); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function gen({ file, prompt }) {
  console.log("→", file);
  const create = await post("https://api.kie.ai/api/v1/jobs/createTask", { model: "nano-banana-2", input: { prompt, aspect_ratio: "4:3", resolution: "2K", output_format: "png" } });
  const taskId = create?.data?.taskId;
  if (!taskId) { console.log("create fail", JSON.stringify(create)); return; }
  for (let i = 1; i <= 60; i++) {
    await sleep(4000);
    const info = await get(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`);
    const s = info?.data?.state;
    if (s === "success") {
      const rj = info.data.resultJson;
      const parsed = typeof rj === "string" ? JSON.parse(rj) : rj;
      const url = parsed?.resultUrls?.[0];
      const buf = Buffer.from(await (await tryFetch(url, {})).arrayBuffer());
      fs.writeFileSync(path.join(OUT, file), buf);
      console.log("✓", file, (buf.length / 1024).toFixed(0), "KB");
      return;
    }
    if (s === "fail" || s === "failed") { console.log("fail", file, JSON.stringify(info)); return; }
  }
}

// Only the two that haven't been regenerated yet
const targets = services.filter(s => ["service-material-sourcing.webp", "service-rhinestone-studs.webp"].includes(s.file));
for (const s of targets) await gen(s);
console.log("done");
