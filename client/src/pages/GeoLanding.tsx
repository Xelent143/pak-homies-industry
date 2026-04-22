import { Link, useParams } from "wouter";
import PageHeader from "@/components/PageHeader";
import NotFound from "./NotFound";

const CITIES: Record<string, { name: string; tag: string; copy: string; angle: string[] }> = {
  atlanta: {
    name: "Atlanta",
    tag: "Where ATL creators source",
    copy: "Atlanta's streetwear scene runs on speed and authenticity. We deliver both — 7-day samples, certified production, direct relationship with the founder.",
    angle: [
      "Direct DHL Express to ATL — 4 days from Sialkot",
      "Reference brands sourced by Atlanta founders",
      "Eastern Time WhatsApp coverage",
      "Trade show samples for AmericasMart",
    ],
  },
  houston: {
    name: "Houston",
    tag: "Made for Houston's rap culture",
    copy: "Houston's hip-hop and chopped-and-screwed culture has always set the streetwear bar. Pak Homies makes the merch that holds up.",
    angle: ["Heavyweight tees and hoodies", "Custom chrome and screen print", "Texas-route DHL", "CT/PT support"],
  },
  "los-angeles": {
    name: "Los Angeles",
    tag: "Compete with domestic at 1/3 the cost",
    copy: "LA brands face the highest production costs in the country. We give you LA-quality, ethically made, at Sialkot prices.",
    angle: ["LA-port freight options", "Streetwear-grade fabrics", "Sustainable certifications", "PT timezone WhatsApp"],
  },
  "new-york": {
    name: "New York",
    tag: "NYC's fastest turnaround factory",
    copy: "NYC moves on its own clock. 7-day samples means you can iterate weekly without burning cash.",
    angle: ["JFK air freight", "Fashion week sample sprints", "Custom denim", "ET timezone coverage"],
  },
  detroit: {
    name: "Detroit",
    tag: "Empowering Detroit creators",
    copy: "Detroit's hustle deserves a factory partner that respects the grind. MOQ 50 means you can launch with what you have.",
    angle: ["Affordable MOQ for new brands", "Workwear and heritage fits", "Direct WhatsApp to Shehraz", "ET timezone coverage"],
  },
  chicago: {
    name: "Chicago",
    tag: "Chicago's trusted manufacturing partner",
    copy: "From the West Side to River North, Chicago brands need manufacturing they can trust. Triple-certified, transparent, accountable.",
    angle: ["O'Hare air freight", "Cold-weather puffer specialty", "Custom labels and patches", "CT timezone coverage"],
  },
};

export default function GeoLanding() {
  const params = useParams<{ region: string }>();
  const city = params.region ? CITIES[params.region] : undefined;
  if (!city) return <NotFound />;

  return (
    <>
      <PageHeader eyebrow={`Cities · ${city.name}`} title={city.tag} subtitle={city.copy} />

      <section className="container-page py-20 grid lg:grid-cols-[1.4fr_1fr] gap-12">
        <div>
          <div className="ribbon-text text-[#3E41B6]">Local angle</div>
          <h2 className="font-display text-3xl mt-3">Built for {city.name} brands</h2>
          <ul className="mt-6 space-y-3">
            {city.angle.map((a) => (
              <li key={a} className="p-5 border border-[#E0E0E0] rounded">{a}</li>
            ))}
          </ul>
        </div>

        <div className="p-10 bg-[#3E41B6] text-white rounded">
          <h2 className="font-display text-3xl">Ready to ship to {city.name}?</h2>
          <p className="text-white/80 mt-3">Submit a tech pack. Quote within 4 hours. Samples in your hands in ~10 days.</p>
          <Link href="/inquire" className="mt-6 inline-block px-6 py-3 bg-white text-[#3E41B6] font-semibold rounded">
            Get a Free Sample Quote
          </Link>
        </div>
      </section>
    </>
  );
}
