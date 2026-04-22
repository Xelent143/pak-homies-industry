import fs from "node:fs";
import path from "node:path";

const KEY = "2b070f97fed53a25eb9f2460f5964936";
const OUT = path.resolve("client/public/images/cities");
fs.mkdirSync(OUT, { recursive: true });

const BRAND = "BRAND LOCK — Pak Homies Industry: editorial streetwear mood, cinematic, moody, no text in image, no watermarks, no people, ultra-realistic photography. ";

const CITIES = {
  atlanta: BRAND + "Cinematic editorial photograph of downtown Atlanta Georgia skyline at dusk featuring Bank of America Plaza and the Westin Peachtree Plaza tower, moody blue hour lighting, dramatic clouds, low contrast film grain, wide architectural shot.",
  houston: BRAND + "Cinematic editorial photograph of downtown Houston Texas skyline at dusk featuring JPMorgan Chase Tower and Williams Tower, dramatic blue hour sky, low contrast film grain, wide architectural shot.",
  "los-angeles": BRAND + "Cinematic editorial photograph of Los Angeles California with the iconic Hollywood Sign on the hills and downtown LA skyline in the distance at golden hour, hazy warm light, low contrast film grain.",
  "new-york": BRAND + "Cinematic editorial photograph of New York City Manhattan skyline featuring the Empire State Building at dusk, moody blue hour lighting, dramatic clouds, low contrast film grain, wide architectural shot.",
  detroit: BRAND + "Cinematic editorial photograph of downtown Detroit Michigan riverfront featuring the Renaissance Center GM headquarters towers at dusk, moody blue hour light reflecting on the Detroit River, low contrast film grain.",
  chicago: BRAND + "Cinematic editorial photograph of downtown Chicago Illinois skyline featuring Willis Tower and the Chicago River at dusk, dramatic blue hour sky, low contrast film grain, wide architectural shot.",
};

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

async function genCity(name, prompt) {
  console.log(`=== ${name} ===`);
  const create = await post("https://api.kie.ai/api/v1/jobs/createTask", {
    model: "nano-banana-2",
    input: { prompt, aspect_ratio: "1:1", resolution: "2K", output_format: "png" },
  });
  const taskId = create?.data?.taskId;
  if (!taskId) {
    console.log("  FAIL create:", JSON.stringify(create));
    return;
  }
  console.log(`  taskId=${taskId}`);
  for (let i = 1; i <= 40; i++) {
    await sleep(4000);
    const info = await get(`https://api.kie.ai/api/v1/jobs/recordInfo?taskId=${taskId}`);
    const state = info?.data?.state;
    process.stdout.write(`  poll ${i} state=${state}\n`);
    if (state === "success") {
      const rj = info.data.resultJson;
      const parsed = typeof rj === "string" ? JSON.parse(rj) : rj;
      const url = parsed?.resultUrls?.[0];
      if (!url) {
        console.log("  no url");
        return;
      }
      const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
      const dest = path.join(OUT, `${name}.png`);
      fs.writeFileSync(dest, buf);
      console.log(`  saved ${dest} (${(buf.length / 1024).toFixed(0)} KB)`);
      return;
    }
    if (state === "fail" || state === "failed") {
      console.log("  FAIL:", JSON.stringify(info));
      return;
    }
  }
  console.log("  timeout");
}

// Run in parallel
await Promise.all(Object.entries(CITIES).map(([n, p]) => genCity(n, p)));
console.log("all done");
