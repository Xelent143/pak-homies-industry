import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { Link } from "wouter";
import { useState } from "react";
import { ArrowRight, Scissors, Printer, Layers, Sparkles, Package, Gem, Check, Clock, ShieldCheck, Factory } from "lucide-react";
const SERVICES = [
  {
    slug: "pattern-making",
    title: "Pattern Making & Sampling",
    short: "Tech-pack to first sample in 7 days flat.",
    long: "Hand-cut and CAD-graded patterns from your tech pack, sketch, or reference garment. Our pattern masters have 20+ years on streetwear blocks — boxy, oversized, cropped, drop-shoulder, you name it. Every pattern is sampled, fit-tested, and graded across the full size run before bulk.",
    image: "/images/generated/service-pattern-making.webp",
    icon: Scissors,
    capabilities: [
      "Tech-pack to pattern translation",
      "Reference garment reverse-engineering",
      "Digital CAD pattern grading (XS–4XL)",
      "Fit samples + 3 free revisions",
      "Marker making & fabric optimization"
    ],
    specs: [
      { label: "Lead time", value: "7 days" },
      { label: "Sample fee", value: "$80–$150" },
      { label: "Revisions", value: "3 free" }
    ],
    accent: "#FE3136"
  },
  {
    slug: "sublimation",
    title: "Sublimation Printing",
    short: "Edge-to-edge full-color graphics that never crack.",
    long: "Industrial sublimation transfer printing for polyester and poly-blend garments. All-over prints, panel prints, and photo-realistic graphics with zero hand-feel. Colors are dye-bonded into the fibers — they outlast the garment itself.",
    image: "/images/generated/service-sublimation.webp",
    icon: Printer,
    capabilities: [
      "All-over print (AOP) on cut panels",
      "Photo-realistic graphics",
      "Color matching to Pantone",
      'Up to 64" print width',
      "Sample-to-bulk color consistency guarantee"
    ],
    specs: [
      { label: "Substrate", value: "Polyester / blends" },
      { label: "Max width", value: "64 inches" },
      { label: "Color match", value: "Pantone TPX" }
    ],
    accent: "#3E41B6"
  },
  {
    slug: "screen-printing",
    title: "Screen Printing",
    short: "Plastisol, water-based, discharge, puff and high-density.",
    long: "Manual and automatic screen printing on cotton, fleece, and canvas. We run plastisol, water-based, discharge, puff, high-density, glow, reflective, and metallic inks. Up to 12 colors per print, registered to ±0.5mm.",
    image: "/images/generated/service-screen-printing.webp",
    icon: Layers,
    capabilities: [
      "Plastisol & water-based inks",
      "Discharge & high-density",
      "Puff, foil, glow, reflective",
      "Up to 12 colors per design",
      "Soft-hand finishes for premium feel"
    ],
    specs: [
      { label: "Max colors", value: "12" },
      { label: "Registration", value: "±0.5 mm" },
      { label: "Ink types", value: "8 in stock" }
    ],
    accent: "#FE3136"
  },
  {
    slug: "embroidery",
    title: "Embroidery & Patches",
    short: "12-head Tajima machines, woven & PVC patches in-house.",
    long: "Direct embroidery, applique, 3D puff, chenille, and chain-stitch on heavyweight 12-head Tajima machines. We also produce woven, PVC, leather, and rubber patches in-house — no outsourcing, no delays.",
    image: "/images/generated/service-embroidery.webp",
    icon: Sparkles,
    capabilities: [
      "Direct embroidery (flat, 3D puff, chenille)",
      "Woven, PVC, leather, rubber patches",
      "Chain-stitch & sashiko",
      "Up to 15 thread colors per design",
      "Custom backing (iron-on, sew-on, velcro)"
    ],
    specs: [
      { label: "Max stitches", value: "100k" },
      { label: "Heads", value: "12 per machine" },
      { label: "Thread", value: "Madeira / Gunold" }
    ],
    accent: "#3E41B6"
  },
  {
    slug: "material-sourcing",
    title: "Material Sourcing",
    short: "Vetted mills, certified fabrics, transparent pricing.",
    long: "We've been buying from the same mills for 15 years — selvedge denim from Karachi, heavyweight fleece from Faisalabad, ripstop nylon from Sialkot. Every roll is inspected, every certificate verified. You get the swatch, the cert, and the price — no markup games.",
    image: "/images/generated/service-material-sourcing.webp",
    icon: Package,
    capabilities: [
      "Cotton (240–320gsm), fleece (350–500gsm)",
      "Selvedge denim (12–16oz)",
      "Ripstop nylon, taslan, canvas",
      "OEKO-TEX & GOTS certified options",
      "Custom dye-to-match runs"
    ],
    specs: [
      { label: "Mills", value: "40+ vetted" },
      { label: "Lead time", value: "5–10 days" },
      { label: "Certificates", value: "OEKO / GOTS" }
    ],
    accent: "#FE3136"
  },
  {
    slug: "rhinestones-studs",
    title: "Rhinestones & Studs Embellishment",
    short: "Hot-fix crystals, metal studs, pearls, sequins, foil.",
    long: "Hand and machine application of hot-fix rhinestones, metal pyramid/cone/dome studs, pearls, sequins, and foil. We work with Korean, Czech, and Preciosa crystals — full-piece embellishment or accent placements.",
    image: "/images/generated/service-rhinestone-studs.webp",
    icon: Gem,
    capabilities: [
      "Hot-fix rhinestones (Korean, Czech, Preciosa)",
      "Metal studs (pyramid, cone, dome, spike)",
      "Pearls, sequins, foil",
      "Hand-set or machine-set",
      "Wash-tested adhesion"
    ],
    specs: [
      { label: "Crystal sizes", value: "SS6–SS40" },
      { label: "Stud styles", value: "20+ shapes" },
      { label: "Wash test", value: "30 cycles" }
    ],
    accent: "#3E41B6"
  }
];
function Services() {
  const [activeTab, setActiveTab] = useState(0);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Services.tsx:170", className: "bg-[#0A0A0E] text-white relative overflow-hidden pt-24 pb-20", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Services.tsx:171", className: "absolute inset-0 paper-grain opacity-[0.04] pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Services.tsx:172", className: "container-page relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Services.tsx:173", className: "max-w-4xl", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Services.tsx:174", className: "ribbon-text text-[#FE3136]", children: "Our Services" }),
          /* @__PURE__ */ jsxs("h1", { "data-loc": "client\\src\\pages\\Services.tsx:175", className: "font-display text-5xl md:text-7xl lg:text-8xl mt-4 leading-[0.95]", children: [
            "Six rooms.",
            /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\pages\\Services.tsx:176" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Services.tsx:177", className: "outline-text", style: { WebkitTextStroke: "2px #fff" }, children: "One floor." }),
            " ",
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Services.tsx:178", className: "text-[#FE3136]", children: "Zero outsourcing." })
          ] }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Services.tsx:180", className: "mt-8 text-xl text-white/70 max-w-2xl leading-relaxed", children: "Pattern making, printing, embroidery, sourcing, embellishment — every step of your streetwear order happens under one roof in Sialkot. No middlemen, no surprises, no broken telephone." }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Services.tsx:184", className: "mt-10 flex flex-wrap gap-4", children: [
            /* @__PURE__ */ jsxs(Link, { "data-loc": "client\\src\\pages\\Services.tsx:185", href: "/inquire", className: "px-7 py-4 bg-[#FE3136] hover:bg-[#FF4A4F] font-display text-lg rounded inline-flex items-center gap-2 animate-glow-pulse", children: [
              "Get a Quote ",
              /* @__PURE__ */ jsx(ArrowRight, { "data-loc": "client\\src\\pages\\Services.tsx:186", size: 18 })
            ] }),
            /* @__PURE__ */ jsx("a", { "data-loc": "client\\src\\pages\\Services.tsx:188", href: "#services-grid", className: "px-7 py-4 border-2 border-white/30 hover:bg-white hover:text-[#1A1A1A] font-display text-lg rounded inline-flex items-center gap-2", children: "Explore Services" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Services.tsx:195", className: "mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3", children: SERVICES.map((s, i) => {
          const Icon = s.icon;
          return /* @__PURE__ */ jsxs(
            "a",
            {
              "data-loc": "client\\src\\pages\\Services.tsx:199",
              href: `#service-${s.slug}`,
              onClick: () => setActiveTab(i),
              className: "group bg-[#14141A] border border-white/10 rounded-lg p-4 hover:border-[#FE3136] transition",
              children: [
                /* @__PURE__ */ jsx(Icon, { "data-loc": "client\\src\\pages\\Services.tsx:205", size: 22, className: "text-[#5A5DCB] group-hover:text-[#FE3136] transition" }),
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Services.tsx:206", className: "ribbon-text text-[10px] text-white/50 mt-3", children: [
                  "0",
                  i + 1
                ] }),
                /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Services.tsx:207", className: "font-display text-sm mt-1 leading-tight", children: s.title })
              ]
            },
            s.slug
          );
        }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Services.tsx:216", className: "bg-[#FE3136] text-white py-3 overflow-hidden border-y border-[#FE3136]", children: /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Services.tsx:217", className: "flex animate-marquee whitespace-nowrap ribbon-text text-xs", children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Services.tsx:219", className: "mx-8 inline-flex items-center gap-2", children: "★ ALL UNDER ONE ROOF ★ NO SUBCONTRACTORS ★ BSCI · OEKO-TEX · WRAP CERTIFIED ★ 1.2M UNITS SHIPPED ★" }, i)) }) }),
    /* @__PURE__ */ jsx("section", { "data-loc": "client\\src\\pages\\Services.tsx:227", id: "services-grid", className: "bg-[#F8F8F8]", children: SERVICES.map((service, i) => {
      const Icon = service.icon;
      const reverse = i % 2 === 1;
      const isDark = i % 2 === 1;
      return /* @__PURE__ */ jsx(
        "div",
        {
          "data-loc": "client\\src\\pages\\Services.tsx:233",
          id: `service-${service.slug}`,
          className: `py-20 ${isDark ? "bg-[#1A1A1A] text-white" : "bg-[#F8F8F8] text-[#1A1A1A]"}`,
          children: /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Services.tsx:238", className: "container-page", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Services.tsx:239", className: `grid lg:grid-cols-12 gap-12 items-center ${reverse ? "lg:[direction:rtl]" : ""}`, children: [
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Services.tsx:241", className: "lg:col-span-7 lg:[direction:ltr]", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Services.tsx:242", className: "relative aspect-[4/3] overflow-hidden rounded-lg border border-black/10 group", children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  "data-loc": "client\\src\\pages\\Services.tsx:243",
                  src: service.image,
                  alt: service.title,
                  className: "w-full h-full object-cover animate-ken-burns",
                  onError: (e) => {
                    e.currentTarget.src = "/images/generated/factory-floor-workspace.webp";
                  }
                }
              ),
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Services.tsx:251", className: "absolute top-5 left-5 bg-white text-[#1A1A1A] px-3 py-1.5 ribbon-text text-[10px] rounded inline-flex items-center gap-2", children: [
                /* @__PURE__ */ jsx(Icon, { "data-loc": "client\\src\\pages\\Services.tsx:252", size: 14, style: { color: service.accent } }),
                " SERVICE 0",
                i + 1
              ] }),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  "data-loc": "client\\src\\pages\\Services.tsx:254",
                  className: "absolute bottom-5 right-5 w-24 h-24 rounded-full text-white flex flex-col items-center justify-center font-display red-stamp shadow-2xl",
                  style: { backgroundColor: service.accent },
                  children: [
                    /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Services.tsx:258", className: "text-[9px] ribbon-text leading-none", children: "IN-HOUSE" }),
                    /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Services.tsx:259", className: "text-2xl leading-none mt-1", children: "100%" })
                  ]
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Services.tsx:265", className: "lg:col-span-5 lg:[direction:ltr]", children: [
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Services.tsx:266", className: "ribbon-text", style: { color: service.accent }, children: [
                "0",
                i + 1,
                " / 0",
                SERVICES.length
              ] }),
              /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\Services.tsx:269", className: "font-display text-4xl md:text-5xl mt-3 leading-[1.05]", children: service.title }),
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Services.tsx:270", className: `mt-3 text-xl ${isDark ? "text-white/70" : "text-[#555]"}`, children: service.short }),
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Services.tsx:271", className: `mt-5 text-base leading-relaxed ${isDark ? "text-white/60" : "text-[#444]"}`, children: service.long }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Services.tsx:276", className: "mt-6 grid grid-cols-3 gap-3", children: service.specs.map((s) => /* @__PURE__ */ jsxs(
                "div",
                {
                  "data-loc": "client\\src\\pages\\Services.tsx:278",
                  className: `p-3 rounded border ${isDark ? "border-white/15 bg-white/5" : "border-[#E0E0E0] bg-white"}`,
                  children: [
                    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Services.tsx:282", className: "ribbon-text text-[9px] opacity-60", children: s.label }),
                    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Services.tsx:283", className: "font-display text-base mt-1", style: { color: service.accent }, children: s.value })
                  ]
                },
                s.label
              )) }),
              /* @__PURE__ */ jsx("ul", { "data-loc": "client\\src\\pages\\Services.tsx:291", className: "mt-6 space-y-2", children: service.capabilities.map((c) => /* @__PURE__ */ jsxs("li", { "data-loc": "client\\src\\pages\\Services.tsx:293", className: "flex items-start gap-3 text-sm", children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    "data-loc": "client\\src\\pages\\Services.tsx:294",
                    className: "w-5 h-5 rounded-full text-white flex items-center justify-center shrink-0 mt-0.5",
                    style: { backgroundColor: service.accent },
                    children: /* @__PURE__ */ jsx(Check, { "data-loc": "client\\src\\pages\\Services.tsx:298", size: 12 })
                  }
                ),
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Services.tsx:300", className: isDark ? "text-white/85" : "text-[#1A1A1A]", children: c })
              ] }, c)) }),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  "data-loc": "client\\src\\pages\\Services.tsx:305",
                  href: "/inquire",
                  className: "mt-7 inline-flex items-center gap-2 px-6 py-3 font-display rounded text-white",
                  style: { backgroundColor: service.accent },
                  children: [
                    "Quote this service ",
                    /* @__PURE__ */ jsx(ArrowRight, { "data-loc": "client\\src\\pages\\Services.tsx:310", size: 16 })
                  ]
                }
              )
            ] })
          ] }) })
        },
        service.slug
      );
    }) }),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Services.tsx:321", className: "container-page py-24", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Services.tsx:322", className: "text-center max-w-3xl mx-auto", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Services.tsx:323", className: "ribbon-text text-[#FE3136]", children: "Why under one roof matters" }),
        /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\Services.tsx:324", className: "font-display text-4xl md:text-5xl mt-4 leading-[1.05]", children: [
          "Every middleman is a ",
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Services.tsx:325", className: "text-[#3E41B6]", children: "delay, a cost, and a defect" }),
          " waiting to happen."
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Services.tsx:328", className: "mt-14 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto", children: [
        { icon: Clock, title: "Faster", body: "No shipping samples between vendors. We cut, print, embroider and finish in the same building — sample in 7 days, bulk in 15." },
        { icon: ShieldCheck, title: "Cleaner", body: "One QC team owns the whole garment. No finger-pointing. We re-make at our cost if anything fails inspection." },
        { icon: Factory, title: "Cheaper", body: "Six margins collapse into one. You get factory-direct pricing — no agent fees, no broker markup, no surprise extras." }
      ].map((c) => {
        const Icon = c.icon;
        return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Services.tsx:336", className: "p-7 bg-[#F8F8F8] border border-[#E0E0E0] rounded-lg hover:border-[#FE3136] transition", children: [
          /* @__PURE__ */ jsx(Icon, { "data-loc": "client\\src\\pages\\Services.tsx:337", size: 32, className: "text-[#FE3136]" }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Services.tsx:338", className: "font-display text-2xl mt-4", children: c.title }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Services.tsx:339", className: "mt-3 text-[#555] leading-relaxed", children: c.body })
        ] }, c.title);
      }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Services.tsx:347", className: "bg-[#FE3136] text-white py-24 relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Services.tsx:348", className: "absolute inset-0 paper-grain opacity-10" }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Services.tsx:349", className: "container-page text-center relative z-10", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Services.tsx:350", className: "ribbon-text text-white/80", children: "All six services. One quote." }),
        /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\Services.tsx:351", className: "font-display text-5xl md:text-7xl mt-4 leading-[0.95]", children: [
          "Bundle them.",
          /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\pages\\Services.tsx:352" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Services.tsx:353", className: "outline-text", style: { WebkitTextStroke: "2px #fff" }, children: "Save 30%." })
        ] }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Services.tsx:355", className: "mt-6 text-white/90 text-lg max-w-2xl mx-auto", children: "Tell us your garment, your art, your quantity. We'll send a single line-item quote with every service priced — same day, no sales calls." }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Services.tsx:359", className: "mt-10 flex flex-wrap gap-4 justify-center", children: [
          /* @__PURE__ */ jsxs(Link, { "data-loc": "client\\src\\pages\\Services.tsx:360", href: "/inquire", className: "px-8 py-4 bg-white text-[#FE3136] font-display text-lg rounded hover:bg-[#1A1A1A] hover:text-white transition inline-flex items-center gap-2", children: [
            "Get My Quote ",
            /* @__PURE__ */ jsx(ArrowRight, { "data-loc": "client\\src\\pages\\Services.tsx:361", size: 18 })
          ] }),
          /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\Services.tsx:363", href: "/products", className: "px-8 py-4 border-2 border-white text-white font-display text-lg rounded hover:bg-white hover:text-[#FE3136] transition", children: "Browse Garments" })
        ] })
      ] })
    ] })
  ] });
}
export {
  Services as default
};
