import fs from "node:fs";
import path from "node:path";

const KEY = "2b070f97fed53a25eb9f2460f5964936";
const OUT = path.resolve("client/public/images");
fs.mkdirSync(OUT, { recursive: true });

const prompt =
  "BRAND LOCK — Pak Homies Industry: editorial streetwear mood, cinematic, ultra-realistic photography, no text, no watermarks. " +
  "Dramatic wide moody interior photograph of a dimly lit garment factory floor in Sialkot Pakistan at night — " +
  "rows of industrial sewing machines with fabric mid-stitch, heavy hoodies and bomber jackets hanging on garment racks in the background, " +
  "shafts of warm tungsten light cutting through cotton dust in the air, deep shadows, moody blue-black atmosphere, " +
  "low contrast 35mm film grain, ultra wide cinematic 16:9 composition, no people visible, Wong Kar-wai lighting mood, " +
  "editorial magazine photography style, rich blacks, subtle red accent light, shallow depth of field.";

async function post(url, body) {
  const r = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return r.json();
}
async function get(url) {
  const r = await fetch(url, { headers: { Authorization: `Bearer ${KEY}` } });
  return r.json();
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

console.log("creating task...");
const create = await post("https://api.kie.ai/api/v1/jobs/createTask", {
  model: "nano-banana-2",
  input: { prompt, aspect_ratio: "16:9", resolution: "2K", output_format: "png" },
});
const taskId = create?.data?.taskId;
console.log("taskId=", taskId);
if (!taskId) { console.log("FAIL", JSON.stringify(create)); process.exit(1); }

for (let i = 1; i <= 60; i++) {
  await sleep(4000);
  const info = await get(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`);
  const state = info?.data?.state;
  console.log(`poll ${i} state=${state}`);
  if (state === "success") {
    const rj = info.data.resultJson;
    const parsed = typeof rj === "string" ? JSON.parse(rj) : rj;
    const url = parsed?.resultUrls?.[0];
    const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
    const dest = path.join(OUT, "testimonial_bg.png");
    fs.writeFileSync(dest, buf);
    console.log("saved", dest, (buf.length/1024).toFixed(0), "KB");
    process.exit(0);
  }
  if (state === "fail" || state === "failed") { console.log("FAIL", JSON.stringify(info)); process.exit(1); }
}
console.log("timeout");
