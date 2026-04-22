import fs from "node:fs";
import path from "node:path";

const KEY = "2b070f97fed53a25eb9f2460f5964936";
const OUT = path.resolve("client/public/images");
fs.mkdirSync(path.join(OUT, "certs"), { recursive: true });

const ITEMS = {
  "streetwear-doodle-pattern": {
    dir: OUT,
    prompt:
      "Seamless repeating doodle pattern, hand-drawn thick black ink sketch on off-white paper background, " +
      "streetwear and garment industry icons: hoodies, t-shirts, bomber jackets, cargo pants, sneakers, baseball caps, " +
      "scissors, sewing needles, thread spools, measuring tapes, safety pins, coat hangers, clothing tags, fabric rolls, " +
      "iron, buttons, zippers, crown symbol, fire flame, lightning bolt, star, heart, arrow, " +
      "monochrome black ink on #F8F8F8 paper, tightly packed tileable seamless pattern, " +
      "hand-drawn illustration style, no color, no text, wallpaper pattern, flat 2D vector look, consistent line weight",
    ratio: "1:1",
  },
  bsci: {
    dir: path.join(OUT, "certs"),
    prompt:
      "Official-looking certification badge logo for BSCI (Business Social Compliance Initiative), " +
      "circular emblem design, bold serif and sans-serif typography reading BSCI at center, " +
      "concentric circle borders with small bullets, laurel wreath or shield motif, " +
      "deep navy blue and white color scheme with subtle gold accents, flat vector style, " +
      "clean premium corporate badge, centered composition on pure white background, no shadows, crisp edges",
    ratio: "1:1",
  },
  "oeko-tex": {
    dir: path.join(OUT, "certs"),
    prompt:
      "Official-looking certification badge logo for OEKO-TEX Standard 100, " +
      "circular green leaf emblem, bold text OEKO-TEX at center with STANDARD 100 below, " +
      "forest green and white color scheme, stylized leaf or plant motif, clean corporate badge, " +
      "flat vector style, centered on pure white background, no shadows, crisp edges, premium feel",
    ratio: "1:1",
  },
  wrap: {
    dir: path.join(OUT, "certs"),
    prompt:
      "Official-looking certification badge logo for WRAP (Worldwide Responsible Accredited Production), " +
      "circular shield emblem, bold text WRAP at center, globe or hands motif, " +
      "deep red and gold color scheme with white, ribbon banner, clean corporate certification badge, " +
      "flat vector style, centered on pure white background, no shadows, crisp edges, premium authoritative feel",
    ratio: "1:1",
  },
};

async function post(url, body) {
  const r = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return r.json();
}
async function get(url) {
  const r = await fetch(url, { headers: { Authorization: `Bearer ${KEY}` } });
  return r.json();
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function gen(name, { dir, prompt, ratio }) {
  console.log(`=== ${name} ===`);
  const create = await post("https://api.kie.ai/api/v1/jobs/createTask", {
    model: "nano-banana-2",
    input: { prompt, aspect_ratio: ratio, resolution: "2K", output_format: "png" },
  });
  const taskId = create?.data?.taskId;
  if (!taskId) return console.log("  FAIL create", JSON.stringify(create));
  console.log(`  taskId=${taskId}`);
  for (let i = 1; i <= 60; i++) {
    await sleep(4000);
    const info = await get(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`);
    const state = info?.data?.state;
    process.stdout.write(`  ${name} poll ${i} state=${state}\n`);
    if (state === "success") {
      const rj = info.data.resultJson;
      const parsed = typeof rj === "string" ? JSON.parse(rj) : rj;
      const url = parsed?.resultUrls?.[0];
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      const dest = path.join(dir, `${name}.png`);
      fs.writeFileSync(dest, buf);
      console.log(`  saved ${dest} (${(buf.length/1024).toFixed(0)} KB)`);
      return;
    }
    if (state === "fail" || state === "failed") return console.log("  FAIL", JSON.stringify(info));
  }
  console.log("  timeout");
}

await Promise.all(Object.entries(ITEMS).map(([n, c]) => gen(n, c)));
console.log("all done");
