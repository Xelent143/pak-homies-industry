import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { P as PageHeader } from "./PageHeader-BUZ8Ld1L.js";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
const TOOLS = [
  {
    n: "01",
    title: "3D Customizer",
    href: "/customize",
    body: "Configure colors, fabrics, decals and logos on a live 3D garment. Capture front/back/side views and submit them as part of your inquiry.",
    chips: ["WebGL · Three.js", "Real-time preview", "Logo + decal upload"]
  },
  {
    n: "02",
    title: "2D Label Studio",
    href: "/capabilities/label-studio",
    body: "Design woven, printed and embroidered labels in your browser. Drag fonts, ISO care symbols, sizing tables and brand marks. Export print-ready SVG/PNG.",
    chips: ["Fabric.js editor", "ISO care symbols", "Print-ready export"]
  },
  {
    n: "03",
    title: "Tech Pack Generator",
    href: "/capabilities/techpack",
    body: "Build a production-ready tech pack in minutes via a 5-step wizard: brand info, design, fabric, embellishments, sizing. Download a PDF or send it straight to us.",
    chips: ["5-step wizard", "PDF export", "Submit-to-factory"]
  },
  {
    n: "04",
    title: "Cut, Make, Trim (CMT)",
    href: "/contact",
    body: "Pattern grading, cutting, sewing, labeling and quality control — under one roof. Bring your designs, we handle the production end-to-end.",
    chips: ["Pattern grading", "QA at every stage", "0% defect SLA"]
  }
];
function Capabilities() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        "data-loc": "client\\src\\pages\\Capabilities.tsx:39",
        eyebrow: "Capabilities",
        title: "Three free tools. One factory floor.",
        subtitle: "Use the tools to design your brand, then send the spec straight to us. No signup. No middleman."
      }
    ),
    /* @__PURE__ */ jsx("section", { "data-loc": "client\\src\\pages\\Capabilities.tsx:45", className: "container-page py-20 grid md:grid-cols-2 gap-6", children: TOOLS.map((t) => /* @__PURE__ */ jsxs(Link, { "data-loc": "client\\src\\pages\\Capabilities.tsx:47", href: t.href, className: "group p-10 border border-[#E0E0E0] rounded hover:border-[#3E41B6] hover:shadow-xl transition-all bg-white", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Capabilities.tsx:48", className: "font-display text-6xl text-[#3E41B6]/20 group-hover:text-[#3E41B6]/40 transition-colors", children: t.n }),
      /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\Capabilities.tsx:49", className: "font-display text-3xl mt-6", children: t.title }),
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Capabilities.tsx:50", className: "text-[#555] mt-3 leading-relaxed", children: t.body }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Capabilities.tsx:51", className: "mt-5 flex flex-wrap gap-2", children: t.chips.map((c) => /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Capabilities.tsx:53", className: "px-2.5 py-1 bg-[#F8F8F8] border border-[#E0E0E0] text-xs", children: c }, c)) }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Capabilities.tsx:56", className: "mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-[#3E41B6] group-hover:text-[#FE3136]", children: [
        "Open ",
        /* @__PURE__ */ jsx(ArrowRight, { "data-loc": "client\\src\\pages\\Capabilities.tsx:57", size: 16 })
      ] })
    ] }, t.href)) })
  ] });
}
export {
  Capabilities as default
};
