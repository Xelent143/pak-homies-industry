#!/bin/bash
# Generate 6 city hero images via Kie.ai Nano Banana 2
set -e
KEY="2b070f97fed53a25eb9f2460f5964936"
OUT="D:/claude agency/Web Agency/Sialkot-AI-Masters/clients/pak-homies-industry/07-build/client/public/images/cities"
mkdir -p "$OUT"

declare -A PROMPTS=(
  [atlanta]="Cinematic editorial photograph of downtown Atlanta Georgia skyline at dusk featuring Bank of America Plaza and the iconic Westin Peachtree Plaza tower, moody blue hour lighting, low contrast film grain, urban streetwear mood, no text, no people, wide architectural shot"
  [houston]="Cinematic editorial photograph of downtown Houston Texas skyline at dusk featuring JPMorgan Chase Tower and Williams Tower, dramatic blue hour sky, low contrast film grain, urban streetwear mood, no text, no people, wide architectural shot"
  [los-angeles]="Cinematic editorial photograph of Los Angeles California with the iconic Hollywood Sign on the hills and downtown LA skyline in the distance at golden hour, hazy warm light, low contrast film grain, urban streetwear mood, no text, no people"
  [new-york]="Cinematic editorial photograph of New York City Manhattan skyline featuring the Empire State Building at dusk, moody blue hour lighting, dramatic clouds, low contrast film grain, urban streetwear mood, no text, no people, wide architectural shot"
  [detroit]="Cinematic editorial photograph of downtown Detroit Michigan riverfront featuring the Renaissance Center GM headquarters towers at dusk, moody blue hour light over the Detroit River, low contrast film grain, urban streetwear mood, no text, no people"
  [chicago]="Cinematic editorial photograph of downtown Chicago Illinois skyline featuring Willis Tower and the Chicago River at dusk, dramatic blue hour sky, low contrast film grain, urban streetwear mood, no text, no people, wide architectural shot"
)

for city in "${!PROMPTS[@]}"; do
  echo "=== $city ==="
  prompt="${PROMPTS[$city]}"
  resp=$(curl -s -X POST "https://api.kie.ai/api/v1/jobs/createTask" \
    -H "Authorization: Bearer $KEY" \
    -H "Content-Type: application/json" \
    -d "$(printf '{"model":"nano-banana-2","input":{"prompt":%s,"aspect_ratio":"1:1","resolution":"2K","output_format":"png"}}' "$(printf '%s' "$prompt" | python -c 'import json,sys;print(json.dumps(sys.stdin.read()))')")")
  taskId=$(echo "$resp" | python -c "import json,sys;d=json.load(sys.stdin);print(d.get('data',{}).get('taskId',''))")
  echo "taskId=$taskId"
  if [ -z "$taskId" ]; then
    echo "FAIL: $resp"
    continue
  fi
  # poll
  for i in $(seq 1 30); do
    sleep 4
    info=$(curl -s -H "Authorization: Bearer $KEY" "https://api.kie.ai/api/v1/jobs/recordInfo?taskId=$taskId")
    state=$(echo "$info" | python -c "import json,sys;d=json.load(sys.stdin);print(d.get('data',{}).get('state',''))")
    echo "  poll $i state=$state"
    if [ "$state" = "success" ]; then
      url=$(echo "$info" | python -c "import json,sys;d=json.load(sys.stdin);r=d.get('data',{}).get('resultJson','');import json as j;rr=j.loads(r) if r else {};print((rr.get('resultUrls') or [''])[0])")
      echo "  url=$url"
      curl -sL "$url" -o "$OUT/$city.png"
      echo "  saved $OUT/$city.png"
      break
    fi
    if [ "$state" = "fail" ]; then
      echo "  FAIL: $info"
      break
    fi
  done
done
echo "done"
