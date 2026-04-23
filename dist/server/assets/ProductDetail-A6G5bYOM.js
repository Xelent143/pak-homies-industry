import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useParams, Link } from "wouter";
import { useState } from "react";
import { Truck, ShieldCheck, Factory, Star, ArrowRight, Sparkles, MessageCircle, Clock, Package, Check, ChevronDown, Download } from "lucide-react";
import { g as getProduct, N as NotFound } from "../entry-server.js";
import "@trpc/react-query";
import "@tanstack/react-query";
import "@trpc/client";
import "react-dom/server";
import "react-helmet-async";
import "superjson";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
function ProductDetail() {
  const params = useParams();
  const product = getProduct(params.slug ?? "");
  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSlab, setSelectedSlab] = useState(1);
  const [openFaq, setOpenFaq] = useState(0);
  if (!product) return /* @__PURE__ */ jsx(NotFound, { "data-loc": "client\\src\\pages\\ProductDetail.tsx:30" });
  const gallery = product.gallery.length ? product.gallery : [product.img];
  const currentSlab = product.slabPricing[selectedSlab] ?? product.slabPricing[0];
  const faqs = [
    { q: "What is the minimum order quantity?", a: "Our MOQ is 50 pieces per design / colorway. We can split across sizes within the same design at no extra cost." },
    { q: "How long does production take?", a: "Sample in 7 days. Bulk production in 15 days from approved sample. Sea freight to USA port adds 25–30 days; air freight 5–7 days." },
    { q: "Can I get a sample before bulk?", a: "Yes. Pre-production samples are $80–$150 depending on the garment, fully credited back to your bulk order." },
    { q: "What's included in the price?", a: "Cutting, sewing, finishing, woven main label, hangtag, polybag, and freight to your USA port. No hidden fees." },
    { q: "Do you handle custom labels and packaging?", a: "Yes. Woven labels, neck prints, hangtags, custom polybags, and branded mailers — all in-house." }
  ];
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:46", className: "bg-[#0A0A0E] text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:47", className: "absolute inset-0 paper-grain opacity-[0.04] pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:48", className: "container-page py-10 lg:py-14", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:50", className: "flex items-center gap-2 text-xs ribbon-text text-white/50 mb-8", children: [
          /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\ProductDetail.tsx:51", href: "/", className: "hover:text-[#FE3136]", children: "Home" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:52", children: "/" }),
          /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\ProductDetail.tsx:53", href: "/products", className: "hover:text-[#FE3136]", children: "Products" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:54", children: "/" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:55", className: "text-white/80", children: product.category }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:56", children: "/" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:57", className: "text-[#FE3136]", children: product.name })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:60", className: "grid lg:grid-cols-12 gap-10", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:62", className: "lg:col-span-7", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:63", className: "relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10 bg-[#14141A]", children: [
              /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:64", src: gallery[activeImg], alt: product.name, className: "w-full h-full object-cover animate-ken-burns" }),
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:66", className: "absolute top-5 left-5 flex flex-col gap-2", children: [
                /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:67", className: "bg-[#FE3136] text-white px-3 py-1.5 ribbon-text text-[10px] rounded", children: "★ FACTORY DIRECT" }),
                product.freeShipping && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:69", className: "bg-white text-[#1A1A1A] px-3 py-1.5 ribbon-text text-[10px] rounded inline-flex items-center gap-1", children: [
                  /* @__PURE__ */ jsx(Truck, { "data-loc": "client\\src\\pages\\ProductDetail.tsx:70", size: 12 }),
                  " FREE FREIGHT"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:74", className: "absolute top-5 right-5 w-20 h-20 rounded-full bg-[#FE3136] text-white flex flex-col items-center justify-center font-display text-center red-stamp shadow-2xl", children: [
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:75", className: "text-[10px] ribbon-text leading-none", children: "MOQ" }),
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:76", className: "text-2xl leading-none mt-1", children: "50" }),
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:77", className: "text-[9px] mt-0.5", children: "PIECES" })
              ] })
            ] }),
            gallery.length > 1 && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:83", className: "mt-3 grid grid-cols-5 gap-3", children: gallery.map((g, i) => /* @__PURE__ */ jsx(
              "button",
              {
                "data-loc": "client\\src\\pages\\ProductDetail.tsx:85",
                onClick: () => setActiveImg(i),
                className: `aspect-square overflow-hidden rounded border-2 transition ${activeImg === i ? "border-[#FE3136]" : "border-white/10 hover:border-white/30"}`,
                children: /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:92", src: g, alt: "", className: "w-full h-full object-cover" })
              },
              i
            )) }),
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:99", className: "mt-5 grid grid-cols-4 gap-2 text-center", children: [
              { icon: ShieldCheck, label: "BSCI" },
              { icon: ShieldCheck, label: "OEKO-TEX" },
              { icon: ShieldCheck, label: "WRAP" },
              { icon: Factory, label: "Own Floor" }
            ].map(({ icon: Icon, label }) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:106", className: "border border-white/10 rounded p-2 text-[10px] ribbon-text text-white/70", children: [
              /* @__PURE__ */ jsx(Icon, { "data-loc": "client\\src\\pages\\ProductDetail.tsx:107", size: 14, className: "mx-auto mb-1 text-[#5A5DCB]" }),
              label
            ] }, label)) })
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:115", className: "lg:col-span-5", children: [
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:116", className: "ribbon-text text-[#5A5DCB]", children: product.category }),
            /* @__PURE__ */ jsx("h1", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:117", className: "font-display text-4xl md:text-5xl mt-3 leading-[1.05]", children: product.name }),
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:118", className: "text-white/70 mt-4 text-lg leading-relaxed", children: product.tagline }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:121", className: "mt-4 flex items-center gap-2 text-sm", children: [
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:122", className: "flex text-[#FE3136]", children: [1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsx(Star, { "data-loc": "client\\src\\pages\\ProductDetail.tsx:123", size: 14, fill: "currentColor" }, i)) }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:125", className: "text-white/60", children: "4.9 / 5 · 247 buyers · 1.2M units shipped" })
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:129", className: "mt-6 p-5 bg-gradient-to-br from-[#14141A] to-[#1A1A22] border border-white/10 rounded-lg", children: [
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:130", className: "flex items-baseline justify-between", children: [
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:131", children: [
                  /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:132", className: "ribbon-text text-white/50 text-[10px]", children: "YOUR PRICE" }),
                  /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:133", className: "font-display text-5xl text-white mt-1", children: [
                    "$",
                    currentSlab.price.toFixed(2),
                    /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:135", className: "text-base text-white/50 font-sans font-normal ml-2", children: "/ unit" })
                  ] })
                ] }),
                currentSlab.savings !== "—" && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:139", className: "bg-[#FE3136]/15 border border-[#FE3136]/40 text-[#FE3136] px-3 py-1.5 rounded ribbon-text text-xs", children: [
                  "SAVE ",
                  currentSlab.savings
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:144", className: "mt-2 text-xs text-white/50", children: [
                "at ",
                currentSlab.qty,
                " pieces · all-in landed USA"
              ] }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:147", className: "mt-4 grid grid-cols-4 gap-2", children: product.slabPricing.map((slab, i) => /* @__PURE__ */ jsxs(
                "button",
                {
                  "data-loc": "client\\src\\pages\\ProductDetail.tsx:149",
                  onClick: () => setSelectedSlab(i),
                  className: `px-2 py-2 rounded text-center transition ${selectedSlab === i ? "bg-[#FE3136] text-white border border-[#FE3136]" : "bg-white/5 text-white/70 border border-white/10 hover:border-white/30"}`,
                  children: [
                    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:158", className: "text-[10px] ribbon-text opacity-80", children: slab.qty }),
                    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:159", className: "font-display text-base mt-0.5", children: [
                      "$",
                      slab.price.toFixed(0)
                    ] })
                  ]
                },
                slab.qty
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:166", className: "mt-6", children: [
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:167", className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:168", className: "ribbon-text text-white/50 text-[10px]", children: "SIZE RANGE" }),
                /* @__PURE__ */ jsx("a", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:169", href: "#size-chart", className: "text-[10px] ribbon-text text-[#5A5DCB] hover:text-white", children: "SIZE CHART →" })
              ] }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:171", className: "mt-2 flex flex-wrap gap-2", children: product.availableSizes.map((s) => /* @__PURE__ */ jsx(
                "button",
                {
                  "data-loc": "client\\src\\pages\\ProductDetail.tsx:173",
                  onClick: () => setSelectedSize(s),
                  className: `min-w-[44px] px-3 py-2 rounded border text-sm font-semibold transition ${selectedSize === s ? "bg-white text-[#1A1A1A] border-white" : "bg-transparent text-white border-white/20 hover:border-white/60"}`,
                  children: s
                },
                s
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:189", className: "mt-5", children: [
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:190", className: "ribbon-text text-white/50 text-[10px]", children: [
                "COLORWAY ",
                selectedColor && /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:191", className: "text-white normal-case ml-1 tracking-normal", children: [
                  "— ",
                  selectedColor
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:193", className: "mt-2 flex flex-wrap gap-3", children: product.availableColors.map((c) => /* @__PURE__ */ jsx(
                "button",
                {
                  "data-loc": "client\\src\\pages\\ProductDetail.tsx:195",
                  onClick: () => setSelectedColor(c.name),
                  title: c.name,
                  className: `w-10 h-10 rounded-full border-2 transition ${selectedColor === c.name ? "border-[#FE3136] scale-110" : "border-white/30 hover:border-white/70"}`,
                  style: { backgroundColor: c.hex }
                },
                c.name
              )) })
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:209", className: "mt-7 space-y-3", children: [
              /* @__PURE__ */ jsxs(
                Link,
                {
                  "data-loc": "client\\src\\pages\\ProductDetail.tsx:210",
                  href: "/inquire",
                  className: "w-full px-6 py-4 bg-[#FE3136] hover:bg-[#FF4A4F] font-display text-lg rounded inline-flex items-center justify-center gap-2 animate-glow-pulse",
                  children: [
                    "Get Instant Quote ",
                    /* @__PURE__ */ jsx(ArrowRight, { "data-loc": "client\\src\\pages\\ProductDetail.tsx:214", size: 18 })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:216", className: "grid grid-cols-2 gap-3", children: [
                /* @__PURE__ */ jsxs(Link, { "data-loc": "client\\src\\pages\\ProductDetail.tsx:217", href: "/customize", className: "px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 font-semibold text-sm rounded inline-flex items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsx(Sparkles, { "data-loc": "client\\src\\pages\\ProductDetail.tsx:218", size: 14 }),
                  " Customize 3D"
                ] }),
                /* @__PURE__ */ jsxs("a", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:220", href: "https://wa.me/923000000000", className: "px-4 py-3 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-semibold text-sm rounded inline-flex items-center justify-center gap-2", children: [
                  /* @__PURE__ */ jsx(MessageCircle, { "data-loc": "client\\src\\pages\\ProductDetail.tsx:221", size: 14 }),
                  " WhatsApp"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx("ul", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:227", className: "mt-6 space-y-2 text-sm text-white/80", children: [
              [Clock, "Sample in 7 days · Bulk in 15 days"],
              [Package, "$80 sample fee · credited to bulk"],
              [Truck, "Free freight to USA port included"],
              [ShieldCheck, "100% inspection · re-make guarantee"]
            ].map(([Icon, txt], i) => /* @__PURE__ */ jsxs("li", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:234", className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(Icon, { "data-loc": "client\\src\\pages\\ProductDetail.tsx:235", size: 16, className: "text-[#5A5DCB] shrink-0" }),
              txt
            ] }, i)) })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:246", className: "bg-[#FE3136] text-white py-3 overflow-hidden border-y border-[#FE3136]", children: /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:247", className: "flex animate-marquee whitespace-nowrap ribbon-text text-xs", children: Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:249", className: "mx-8 inline-flex items-center gap-2", children: "FACTORY DIRECT · NO MIDDLEMEN ★ BSCI · OEKO-TEX · WRAP CERTIFIED ★ 1.2M UNITS SHIPPED ★ SAMPLE IN 7 DAYS ★" }, i)) }) }),
    /* @__PURE__ */ jsx("section", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:257", className: "container-page py-20", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:258", className: "grid lg:grid-cols-12 gap-12", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:259", className: "lg:col-span-7", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:260", className: "ribbon-text text-[#FE3136]", children: "The Build" }),
        /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:261", className: "font-display text-4xl md:text-5xl mt-3 leading-[1.05]", children: [
          "Built like our team's ",
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:262", className: "text-[#3E41B6]", children: "own wardrobe." })
        ] }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:264", className: "mt-6 text-lg text-[#333] leading-relaxed", children: product.description })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:267", className: "lg:col-span-5", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:268", className: "bg-[#F8F8F8] border border-[#E0E0E0] rounded-lg p-6", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:269", className: "ribbon-text text-[#3E41B6] mb-4", children: "Customization Options" }),
        /* @__PURE__ */ jsx("ul", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:270", className: "space-y-3", children: product.customizations.map((c) => /* @__PURE__ */ jsxs("li", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:272", className: "flex items-start gap-3 text-sm", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:273", className: "w-5 h-5 rounded-full bg-[#3E41B6] text-white flex items-center justify-center shrink-0 mt-0.5", children: /* @__PURE__ */ jsx(Check, { "data-loc": "client\\src\\pages\\ProductDetail.tsx:274", size: 12 }) }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:276", className: "text-[#1A1A1A]", children: c })
        ] }, c)) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:286", className: "bg-[#0A0A0E] text-white py-20", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:287", className: "container-page", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:288", className: "ribbon-text text-[#FE3136]", children: "Tech Specs" }),
      /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:289", className: "font-display text-4xl mt-3", children: "The receipts" }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:290", className: "mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5", children: [
        { label: "Fabric", value: product.fabric },
        { label: "Weight", value: product.weight },
        { label: "Sizes", value: product.availableSizes.join(" · ") },
        { label: "Colors", value: `${product.availableColors.length} stock + custom` }
      ].map((spec) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:297", className: "bg-[#14141A] border border-white/10 rounded-lg p-5", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:298", className: "ribbon-text text-[#5A5DCB] text-[10px]", children: spec.label }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:299", className: "font-display text-xl mt-2 text-white leading-tight", children: spec.value })
      ] }, spec.label)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:307", id: "size-chart", className: "bg-[#F8F8F8] py-20", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:308", className: "container-page max-w-5xl", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:309", className: "ribbon-text text-[#3E41B6]", children: "Size chart" }),
      /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:310", className: "font-display text-4xl mt-3", children: "Measurements (inches)" }),
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:311", className: "text-sm text-[#555] mt-2", children: 'Tolerance ±0.5". Custom blocks available on orders 200+.' }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:312", className: "mt-8 overflow-x-auto bg-white border border-[#E0E0E0] rounded-lg", children: /* @__PURE__ */ jsxs("table", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:313", className: "w-full text-left", children: [
        /* @__PURE__ */ jsx("thead", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:314", className: "bg-[#1A1A1A] text-white", children: /* @__PURE__ */ jsxs("tr", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:315", children: [
          /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:316", className: "p-4 text-xs uppercase tracking-widest", children: "Size" }),
          /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:317", className: "p-4 text-xs uppercase tracking-widest", children: "Chest" }),
          /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:318", className: "p-4 text-xs uppercase tracking-widest", children: "Length" }),
          /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:319", className: "p-4 text-xs uppercase tracking-widest", children: "Sleeve" }),
          /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:320", className: "p-4 text-xs uppercase tracking-widest", children: "Waist" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:323", children: product.sizeChart.map((r, i) => /* @__PURE__ */ jsxs("tr", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:325", className: i % 2 ? "bg-[#F8F8F8]" : "", children: [
          /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:326", className: "p-4 font-display text-lg text-[#3E41B6]", children: r.size }),
          /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:327", className: "p-4 text-sm", children: r.chest }),
          /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:328", className: "p-4 text-sm", children: r.length }),
          /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:329", className: "p-4 text-sm", children: r.sleeve ?? "—" }),
          /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:330", className: "p-4 text-sm", children: r.waist ?? "—" })
        ] }, r.size)) })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:340", className: "container-page py-20", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:341", className: "text-center max-w-2xl mx-auto", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:342", className: "ribbon-text text-[#FE3136]", children: "Volume = Savings" }),
        /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:343", className: "font-display text-4xl md:text-5xl mt-3", children: [
          "The more you order, ",
          /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:343" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:343", className: "text-[#3E41B6]", children: "the less you pay." })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:345", className: "mt-12 grid md:grid-cols-4 gap-5 max-w-5xl mx-auto", children: product.slabPricing.map((slab, i) => {
        const isPopular = i === 2;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            "data-loc": "client\\src\\pages\\ProductDetail.tsx:349",
            className: `relative p-6 rounded-lg border-2 transition ${isPopular ? "border-[#FE3136] bg-[#FE3136]/5 scale-105 shadow-xl" : "border-[#E0E0E0] bg-white"}`,
            children: [
              isPopular && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:356", className: "absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FE3136] text-white px-3 py-1 ribbon-text text-[10px] rounded", children: "MOST POPULAR" }),
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:360", className: "ribbon-text text-[#555] text-[10px]", children: [
                slab.qty,
                " PIECES"
              ] }),
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:361", className: "font-display text-5xl mt-3 text-[#1A1A1A]", children: [
                "$",
                slab.price.toFixed(2)
              ] }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:362", className: "text-xs text-[#555] mt-1", children: "per unit · landed" }),
              slab.savings !== "—" && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:364", className: "mt-4 inline-block bg-[#3E41B6] text-white px-3 py-1 ribbon-text text-[10px] rounded", children: [
                "SAVE ",
                slab.savings
              ] }),
              /* @__PURE__ */ jsxs(
                Link,
                {
                  "data-loc": "client\\src\\pages\\ProductDetail.tsx:368",
                  href: "/inquire",
                  className: `mt-5 w-full py-3 rounded font-semibold text-sm inline-flex items-center justify-center gap-1 ${isPopular ? "bg-[#FE3136] text-white hover:bg-[#FF4A4F]" : "bg-[#1A1A1A] text-white hover:bg-[#3E41B6]"}`,
                  children: [
                    "Quote this ",
                    /* @__PURE__ */ jsx(ArrowRight, { "data-loc": "client\\src\\pages\\ProductDetail.tsx:374", size: 14 })
                  ]
                }
              )
            ]
          },
          slab.qty
        );
      }) })
    ] }),
    /* @__PURE__ */ jsx("section", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:383", className: "bg-[#1A1A1A] text-white py-20 relative overflow-hidden", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:384", className: "container-page grid lg:grid-cols-2 gap-12 items-center relative z-10", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:385", className: "aspect-[4/3] overflow-hidden rounded-lg border border-white/10", children: /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:386", src: product.manufacturingInfographic, alt: "Manufacturing process", className: "w-full h-full object-cover animate-ken-burns" }) }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:388", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:389", className: "ribbon-text text-[#FE3136]", children: "Made in Sialkot" }),
        /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:390", className: "font-display text-4xl md:text-5xl mt-3 leading-[1.05]", children: [
          "From our floor ",
          /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:390" }),
          "to your label."
        ] }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:391", className: "mt-6 text-lg text-white/75 leading-relaxed", children: product.manufacturingStory }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:392", className: "mt-8 grid grid-cols-3 gap-4", children: [["50+", "Sewing lines"], ["07d", "Sample lead"], ["1.2M", "Units shipped"]].map(([k, v]) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:394", className: "border border-white/15 p-4 rounded", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:395", className: "font-display text-3xl text-[#FE3136]", children: k }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:396", className: "ribbon-text text-white/60 text-[10px] mt-1", children: v })
        ] }, k)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:405", className: "container-page py-20 max-w-4xl", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:406", className: "text-center", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:407", className: "ribbon-text text-[#FE3136]", children: "FAQ" }),
        /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:408", className: "font-display text-4xl mt-3", children: "Questions buyers ask before they pull the trigger." })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:410", className: "mt-12 space-y-3", children: faqs.map((f, i) => /* @__PURE__ */ jsxs(
        "button",
        {
          "data-loc": "client\\src\\pages\\ProductDetail.tsx:412",
          onClick: () => setOpenFaq(openFaq === i ? null : i),
          className: "w-full text-left bg-[#F8F8F8] border border-[#E0E0E0] rounded-lg p-5 hover:border-[#3E41B6] transition",
          children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:417", className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:418", className: "flex items-start gap-4", children: [
                /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:419", className: "w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-display text-sm shrink-0", children: String(i + 1).padStart(2, "0") }),
                /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:422", className: "font-display text-lg text-[#1A1A1A] pt-1", children: f.q })
              ] }),
              /* @__PURE__ */ jsx(
                ChevronDown,
                {
                  "data-loc": "client\\src\\pages\\ProductDetail.tsx:424",
                  size: 20,
                  className: `text-[#3E41B6] shrink-0 transition-transform mt-2 ${openFaq === i ? "rotate-180" : ""}`
                }
              )
            ] }),
            openFaq === i && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:429", className: "mt-4 ml-12 text-[#444] leading-relaxed", children: f.a })
          ]
        },
        i
      )) })
    ] }),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:436", className: "bg-[#FE3136] text-white py-20 relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:437", className: "absolute inset-0 paper-grain opacity-10" }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:438", className: "container-page text-center relative z-10", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:439", className: "ribbon-text text-white/80", children: "Ready when you are" }),
        /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:440", className: "font-display text-5xl md:text-7xl mt-4 leading-[0.95]", children: [
          "Get your ",
          product.name.toLowerCase(),
          " ",
          /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:441" }),
          "quoted in ",
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:441", className: "outline-text", style: { WebkitTextStroke: "2px #fff" }, children: "4 hours." })
        ] }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:443", className: "mt-6 text-white/90 text-lg max-w-2xl mx-auto", children: "Drop your specs, we send back tech pack, lead time, and landed USA pricing — same day, no sales calls." }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:446", className: "mt-8 flex flex-wrap gap-4 justify-center", children: [
          /* @__PURE__ */ jsxs(Link, { "data-loc": "client\\src\\pages\\ProductDetail.tsx:447", href: "/inquire", className: "px-8 py-4 bg-white text-[#FE3136] font-display text-lg rounded hover:bg-[#1A1A1A] hover:text-white transition inline-flex items-center gap-2", children: [
            "Get My Quote ",
            /* @__PURE__ */ jsx(ArrowRight, { "data-loc": "client\\src\\pages\\ProductDetail.tsx:448", size: 18 })
          ] }),
          /* @__PURE__ */ jsxs("a", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:450", href: "/tech-pack-template.pdf", className: "px-8 py-4 border-2 border-white text-white font-display text-lg rounded hover:bg-white hover:text-[#FE3136] transition inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Download, { "data-loc": "client\\src\\pages\\ProductDetail.tsx:451", size: 18 }),
            " Tech Pack Template"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:458", className: "lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0E] border-t border-white/10 p-3 flex items-center gap-3", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:459", className: "flex-1", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:460", className: "text-[10px] ribbon-text text-white/50", children: "FROM" }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:461", className: "font-display text-xl text-white leading-none", children: [
          "$",
          product.slabPricing[product.slabPricing.length - 1].price.toFixed(2),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\ProductDetail.tsx:461", className: "text-xs text-white/50 ml-1", children: "/unit" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Link, { "data-loc": "client\\src\\pages\\ProductDetail.tsx:463", href: "/inquire", className: "px-5 py-3 bg-[#FE3136] text-white font-display rounded inline-flex items-center gap-2", children: [
        "Get Quote ",
        /* @__PURE__ */ jsx(ArrowRight, { "data-loc": "client\\src\\pages\\ProductDetail.tsx:464", size: 16 })
      ] })
    ] })
  ] });
}
export {
  ProductDetail as default
};
