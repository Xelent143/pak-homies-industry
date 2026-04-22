import { Link } from "wouter";
import { useState } from "react";
import {
  ArrowRight,
  Scissors,
  Printer,
  Layers,
  Sparkles,
  Package,
  Gem,
  Check,
  Clock,
  ShieldCheck,
  Factory,
} from "lucide-react";

interface Service {
  slug: string;
  title: string;
  short: string;
  long: string;
  image: string;
  icon: typeof Scissors;
  capabilities: string[];
  specs: { label: string; value: string }[];
  accent: string;
}

const SERVICES: Service[] = [
  {
    slug: "pattern-making",
    title: "Pattern Making & Sampling",
    short: "Tech-pack to first sample in 7 days flat.",
    long:
      "Hand-cut and CAD-graded patterns from your tech pack, sketch, or reference garment. Our pattern masters have 20+ years on streetwear blocks — boxy, oversized, cropped, drop-shoulder, you name it. Every pattern is sampled, fit-tested, and graded across the full size run before bulk.",
    image: "/images/generated/service-pattern-making.webp",
    icon: Scissors,
    capabilities: [
      "Tech-pack to pattern translation",
      "Reference garment reverse-engineering",
      "Digital CAD pattern grading (XS–4XL)",
      "Fit samples + 3 free revisions",
      "Marker making & fabric optimization",
    ],
    specs: [
      { label: "Lead time", value: "7 days" },
      { label: "Sample fee", value: "$80–$150" },
      { label: "Revisions", value: "3 free" },
    ],
    accent: "#FE3136",
  },
  {
    slug: "sublimation",
    title: "Sublimation Printing",
    short: "Edge-to-edge full-color graphics that never crack.",
    long:
      "Industrial sublimation transfer printing for polyester and poly-blend garments. All-over prints, panel prints, and photo-realistic graphics with zero hand-feel. Colors are dye-bonded into the fibers — they outlast the garment itself.",
    image: "/images/generated/service-sublimation.webp",
    icon: Printer,
    capabilities: [
      "All-over print (AOP) on cut panels",
      "Photo-realistic graphics",
      "Color matching to Pantone",
      "Up to 64\" print width",
      "Sample-to-bulk color consistency guarantee",
    ],
    specs: [
      { label: "Substrate", value: "Polyester / blends" },
      { label: "Max width", value: "64 inches" },
      { label: "Color match", value: "Pantone TPX" },
    ],
    accent: "#3E41B6",
  },
  {
    slug: "screen-printing",
    title: "Screen Printing",
    short: "Plastisol, water-based, discharge, puff and high-density.",
    long:
      "Manual and automatic screen printing on cotton, fleece, and canvas. We run plastisol, water-based, discharge, puff, high-density, glow, reflective, and metallic inks. Up to 12 colors per print, registered to ±0.5mm.",
    image: "/images/generated/service-screen-printing.webp",
    icon: Layers,
    capabilities: [
      "Plastisol & water-based inks",
      "Discharge & high-density",
      "Puff, foil, glow, reflective",
      "Up to 12 colors per design",
      "Soft-hand finishes for premium feel",
    ],
    specs: [
      { label: "Max colors", value: "12" },
      { label: "Registration", value: "±0.5 mm" },
      { label: "Ink types", value: "8 in stock" },
    ],
    accent: "#FE3136",
  },
  {
    slug: "embroidery",
    title: "Embroidery & Patches",
    short: "12-head Tajima machines, woven & PVC patches in-house.",
    long:
      "Direct embroidery, applique, 3D puff, chenille, and chain-stitch on heavyweight 12-head Tajima machines. We also produce woven, PVC, leather, and rubber patches in-house — no outsourcing, no delays.",
    image: "/images/generated/service-embroidery.webp",
    icon: Sparkles,
    capabilities: [
      "Direct embroidery (flat, 3D puff, chenille)",
      "Woven, PVC, leather, rubber patches",
      "Chain-stitch & sashiko",
      "Up to 15 thread colors per design",
      "Custom backing (iron-on, sew-on, velcro)",
    ],
    specs: [
      { label: "Max stitches", value: "100k" },
      { label: "Heads", value: "12 per machine" },
      { label: "Thread", value: "Madeira / Gunold" },
    ],
    accent: "#3E41B6",
  },
  {
    slug: "material-sourcing",
    title: "Material Sourcing",
    short: "Vetted mills, certified fabrics, transparent pricing.",
    long:
      "We've been buying from the same mills for 15 years — selvedge denim from Karachi, heavyweight fleece from Faisalabad, ripstop nylon from Sialkot. Every roll is inspected, every certificate verified. You get the swatch, the cert, and the price — no markup games.",
    image: "/images/generated/service-material-sourcing.webp",
    icon: Package,
    capabilities: [
      "Cotton (240–320gsm), fleece (350–500gsm)",
      "Selvedge denim (12–16oz)",
      "Ripstop nylon, taslan, canvas",
      "OEKO-TEX & GOTS certified options",
      "Custom dye-to-match runs",
    ],
    specs: [
      { label: "Mills", value: "40+ vetted" },
      { label: "Lead time", value: "5–10 days" },
      { label: "Certificates", value: "OEKO / GOTS" },
    ],
    accent: "#FE3136",
  },
  {
    slug: "rhinestones-studs",
    title: "Rhinestones & Studs Embellishment",
    short: "Hot-fix crystals, metal studs, pearls, sequins, foil.",
    long:
      "Hand and machine application of hot-fix rhinestones, metal pyramid/cone/dome studs, pearls, sequins, and foil. We work with Korean, Czech, and Preciosa crystals — full-piece embellishment or accent placements.",
    image: "/images/generated/service-rhinestone-studs.webp",
    icon: Gem,
    capabilities: [
      "Hot-fix rhinestones (Korean, Czech, Preciosa)",
      "Metal studs (pyramid, cone, dome, spike)",
      "Pearls, sequins, foil",
      "Hand-set or machine-set",
      "Wash-tested adhesion",
    ],
    specs: [
      { label: "Crystal sizes", value: "SS6–SS40" },
      { label: "Stud styles", value: "20+ shapes" },
      { label: "Wash test", value: "30 cycles" },
    ],
    accent: "#3E41B6",
  },
];

export default function Services() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-[#0A0A0E] text-white relative overflow-hidden pt-24 pb-20">
        <div className="absolute inset-0 paper-grain opacity-[0.04] pointer-events-none" />
        <div className="container-page relative z-10">
          <div className="max-w-4xl">
            <div className="ribbon-text text-[#FE3136]">Our Services</div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl mt-4 leading-[0.95]">
              Six rooms.<br />
              <span className="outline-text" style={{ WebkitTextStroke: "2px #fff" }}>One floor.</span>{" "}
              <span className="text-[#FE3136]">Zero outsourcing.</span>
            </h1>
            <p className="mt-8 text-xl text-white/70 max-w-2xl leading-relaxed">
              Pattern making, printing, embroidery, sourcing, embellishment — every step of your streetwear order
              happens under one roof in Sialkot. No middlemen, no surprises, no broken telephone.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/inquire" className="px-7 py-4 bg-[#FE3136] hover:bg-[#FF4A4F] font-display text-lg rounded inline-flex items-center gap-2 animate-glow-pulse">
                Get a Quote <ArrowRight size={18} />
              </Link>
              <a href="#services-grid" className="px-7 py-4 border-2 border-white/30 hover:bg-white hover:text-[#1A1A1A] font-display text-lg rounded inline-flex items-center gap-2">
                Explore Services
              </a>
            </div>
          </div>

          {/* Service nav strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <a
                  key={s.slug}
                  href={`#service-${s.slug}`}
                  onClick={() => setActiveTab(i)}
                  className="group bg-[#14141A] border border-white/10 rounded-lg p-4 hover:border-[#FE3136] transition"
                >
                  <Icon size={22} className="text-[#5A5DCB] group-hover:text-[#FE3136] transition" />
                  <div className="ribbon-text text-[10px] text-white/50 mt-3">0{i + 1}</div>
                  <div className="font-display text-sm mt-1 leading-tight">{s.title}</div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── PROOF RIBBON ── */}
      <div className="bg-[#FE3136] text-white py-3 overflow-hidden border-y border-[#FE3136]">
        <div className="flex animate-marquee whitespace-nowrap ribbon-text text-xs">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-8 inline-flex items-center gap-2">
              ★ ALL UNDER ONE ROOF ★ NO SUBCONTRACTORS ★ BSCI · OEKO-TEX · WRAP CERTIFIED ★ 1.2M UNITS SHIPPED ★
            </span>
          ))}
        </div>
      </div>

      {/* ── SERVICES ALTERNATING ── */}
      <section id="services-grid" className="bg-[#F8F8F8]">
        {SERVICES.map((service, i) => {
          const Icon = service.icon;
          const reverse = i % 2 === 1;
          const isDark = i % 2 === 1;
          return (
            <div
              key={service.slug}
              id={`service-${service.slug}`}
              className={`py-20 ${isDark ? "bg-[#1A1A1A] text-white" : "bg-[#F8F8F8] text-[#1A1A1A]"}`}
            >
              <div className="container-page">
                <div className={`grid lg:grid-cols-12 gap-12 items-center ${reverse ? "lg:[direction:rtl]" : ""}`}>
                  {/* Image */}
                  <div className="lg:col-span-7 lg:[direction:ltr]">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-black/10 group">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover animate-ken-burns"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/images/generated/factory-floor-workspace.webp";
                        }}
                      />
                      <div className="absolute top-5 left-5 bg-white text-[#1A1A1A] px-3 py-1.5 ribbon-text text-[10px] rounded inline-flex items-center gap-2">
                        <Icon size={14} style={{ color: service.accent }} /> SERVICE 0{i + 1}
                      </div>
                      <div
                        className="absolute bottom-5 right-5 w-24 h-24 rounded-full text-white flex flex-col items-center justify-center font-display red-stamp shadow-2xl"
                        style={{ backgroundColor: service.accent }}
                      >
                        <span className="text-[9px] ribbon-text leading-none">IN-HOUSE</span>
                        <span className="text-2xl leading-none mt-1">100%</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="lg:col-span-5 lg:[direction:ltr]">
                    <div className="ribbon-text" style={{ color: service.accent }}>
                      0{i + 1} / 0{SERVICES.length}
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl mt-3 leading-[1.05]">{service.title}</h2>
                    <p className={`mt-3 text-xl ${isDark ? "text-white/70" : "text-[#555]"}`}>{service.short}</p>
                    <p className={`mt-5 text-base leading-relaxed ${isDark ? "text-white/60" : "text-[#444]"}`}>
                      {service.long}
                    </p>

                    {/* Specs */}
                    <div className="mt-6 grid grid-cols-3 gap-3">
                      {service.specs.map((s) => (
                        <div
                          key={s.label}
                          className={`p-3 rounded border ${isDark ? "border-white/15 bg-white/5" : "border-[#E0E0E0] bg-white"}`}
                        >
                          <div className="ribbon-text text-[9px] opacity-60">{s.label}</div>
                          <div className="font-display text-base mt-1" style={{ color: service.accent }}>
                            {s.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Capabilities */}
                    <ul className="mt-6 space-y-2">
                      {service.capabilities.map((c) => (
                        <li key={c} className="flex items-start gap-3 text-sm">
                          <div
                            className="w-5 h-5 rounded-full text-white flex items-center justify-center shrink-0 mt-0.5"
                            style={{ backgroundColor: service.accent }}
                          >
                            <Check size={12} />
                          </div>
                          <span className={isDark ? "text-white/85" : "text-[#1A1A1A]"}>{c}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/inquire"
                      className="mt-7 inline-flex items-center gap-2 px-6 py-3 font-display rounded text-white"
                      style={{ backgroundColor: service.accent }}
                    >
                      Quote this service <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── WHY UNDER-ONE-ROOF ── */}
      <section className="container-page py-24">
        <div className="text-center max-w-3xl mx-auto">
          <div className="ribbon-text text-[#FE3136]">Why under one roof matters</div>
          <h2 className="font-display text-4xl md:text-5xl mt-4 leading-[1.05]">
            Every middleman is a <span className="text-[#3E41B6]">delay, a cost, and a defect</span> waiting to happen.
          </h2>
        </div>
        <div className="mt-14 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            { icon: Clock, title: "Faster", body: "No shipping samples between vendors. We cut, print, embroider and finish in the same building — sample in 7 days, bulk in 15." },
            { icon: ShieldCheck, title: "Cleaner", body: "One QC team owns the whole garment. No finger-pointing. We re-make at our cost if anything fails inspection." },
            { icon: Factory, title: "Cheaper", body: "Six margins collapse into one. You get factory-direct pricing — no agent fees, no broker markup, no surprise extras." },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="p-7 bg-[#F8F8F8] border border-[#E0E0E0] rounded-lg hover:border-[#FE3136] transition">
                <Icon size={32} className="text-[#FE3136]" />
                <div className="font-display text-2xl mt-4">{c.title}</div>
                <p className="mt-3 text-[#555] leading-relaxed">{c.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-[#FE3136] text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 paper-grain opacity-10" />
        <div className="container-page text-center relative z-10">
          <div className="ribbon-text text-white/80">All six services. One quote.</div>
          <h2 className="font-display text-5xl md:text-7xl mt-4 leading-[0.95]">
            Bundle them.<br />
            <span className="outline-text" style={{ WebkitTextStroke: "2px #fff" }}>Save 30%.</span>
          </h2>
          <p className="mt-6 text-white/90 text-lg max-w-2xl mx-auto">
            Tell us your garment, your art, your quantity. We'll send a single line-item quote with every service
            priced — same day, no sales calls.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link href="/inquire" className="px-8 py-4 bg-white text-[#FE3136] font-display text-lg rounded hover:bg-[#1A1A1A] hover:text-white transition inline-flex items-center gap-2">
              Get My Quote <ArrowRight size={18} />
            </Link>
            <Link href="/products" className="px-8 py-4 border-2 border-white text-white font-display text-lg rounded hover:bg-white hover:text-[#FE3136] transition">
              Browse Garments
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
