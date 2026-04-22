import fs from "node:fs";
import path from "node:path";

const KEY = "2b070f97fed53a25eb9f2460f5964936";
const OUT = path.resolve("client/public/images/generated");

const prompt =
  "Editorial product photography, single garment hero shot, no people, no text, no watermark, no logos, no writing anywhere. " +
  "Heavyweight quilted puffer jacket in matte black with clean horizontal baffle channels, oversized boxy streetwear fit, " +
  "high collar, zipper front, small red accent tag on sleeve. Jacket hung on a minimal matte black wire hanger against a moody charcoal concrete wall. " +
  "Dramatic side lighting, deep shadows, shallow depth of field, ultra-realistic 8K Hasselblad shot, premium streetwear catalog aesthetic. " +
  "Absolutely no text, no captions, no labels, no overlays, no UI elements.";

async function post(url, body) {
  const r = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  return r.json();
}
async function get(url) { const r = await fetch(url, { headers: { Authorization: `Bearer ${KEY}` } }); return r.json(); }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const create = await post("https://api.kie.ai/api/v1/jobs/createTask", {
  model: "nano-banana-2",
  input: { prompt, aspect_ratio: "4:3", resolution: "2K", output_format: "png" },
});
const taskId = create?.data?.taskId;
console.log("taskId", taskId);
if (!taskId) { console.log(JSON.stringify(create)); process.exit(1); }
for (let i = 1; i <= 60; i++) {
  await sleep(4000);
  const info = await get(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`);
  const state = info?.data?.state;
  console.log("poll", i, state);
  if (state === "success") {
    const rj = info.data.resultJson;
    const parsed = typeof rj === "string" ? JSON.parse(rj) : rj;
    const url = parsed?.resultUrls?.[0];
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    fs.writeFileSync(path.join(OUT, "product-puffer-jacket-hero.webp"), buf);
    console.log("saved", (buf.length/1024).toFixed(0), "KB");
    process.exit(0);
  }
  if (state === "fail" || state === "failed") { console.log(JSON.stringify(info)); process.exit(1); }
}
