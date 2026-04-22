import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { P as PageHeader } from "./PageHeader-BUZ8Ld1L.js";
import { Check } from "lucide-react";
import { Link } from "wouter";
const CERTS = [
  {
    name: "BSCI",
    full: "Business Social Compliance Initiative",
    h: "Fair labor + supply chain transparency",
    body: "BSCI audits our labor practices, wages, working hours, freedom of association, health & safety, and environmental impact every year. Every worker earns above minimum wage, with paid leave, maternity benefits, and safe conditions.",
    proves: ["Fair wages (verified)", "Safe working conditions", "No child labor", "Environmental compliance", "Supply chain transparency"]
  },
  {
    name: "OEKO-TEX 100",
    full: "STANDARD 100 by OEKO-TEX",
    h: "Safe, chemical-free fabrics",
    body: "OEKO-TEX verifies all fabrics and finished garments are free from harmful chemicals and meet strict health and safety standards. Critical for Gen Z brands that sell to consumers who care about what touches their skin.",
    proves: ["No harmful dyes", "No banned substances", "Dermatologically safe", "Consumer-safe", "Annual recertification"]
  },
  {
    name: "WRAP",
    full: "Worldwide Responsible Accredited Production",
    h: "Lawful, humane, ethical production",
    body: "WRAP independently verifies that all garments are manufactured under lawful, humane, and ethical conditions. It's the gold standard for ethical apparel manufacturing.",
    proves: ["Lawful labor", "Humane treatment", "Ethical conditions", "No exploitation", "Community engagement"]
  }
];
function Certifications() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        "data-loc": "client\\src\\pages\\Certifications.tsx:32",
        eyebrow: "Certifications",
        title: "Triple-certified. The rarest combination in Sialkot.",
        subtitle: "Fewer than 5% of Pakistani manufacturers hold all three. None of our direct competitors publicly display them."
      }
    ),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Certifications.tsx:38", className: "container-page py-20 space-y-12", children: [
      CERTS.map((c) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Certifications.tsx:40", className: "grid md:grid-cols-[280px_1fr] gap-10 p-10 border border-[#E0E0E0] rounded", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Certifications.tsx:41", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Certifications.tsx:42", className: "inline-block px-4 py-2 bg-[#3E41B6] text-white ribbon-text", children: c.name }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Certifications.tsx:43", className: "text-xs text-[#555] mt-3 uppercase tracking-widest", children: c.full })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Certifications.tsx:45", children: [
          /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\Certifications.tsx:46", className: "font-display text-3xl", children: c.h }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Certifications.tsx:47", className: "text-[#555] mt-4 leading-relaxed", children: c.body }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Certifications.tsx:48", className: "mt-6 grid sm:grid-cols-2 gap-2", children: c.proves.map((p) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Certifications.tsx:50", className: "flex gap-2 text-sm", children: [
            /* @__PURE__ */ jsx(Check, { "data-loc": "client\\src\\pages\\Certifications.tsx:51", size: 16, className: "text-[#3E41B6] mt-1 shrink-0" }),
            " ",
            p
          ] }, p)) })
        ] })
      ] }, c.name)),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Certifications.tsx:59", className: "p-10 bg-[#1A1A1A] text-white rounded text-center", children: [
        /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\Certifications.tsx:60", className: "font-display text-3xl md:text-4xl", children: "Need to see the audit reports?" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Certifications.tsx:61", className: "text-white/70 mt-3", children: "Available on request to qualified buyers. Just ask." }),
        /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\Certifications.tsx:62", href: "/contact", className: "mt-6 inline-block px-7 py-3 bg-[#3E41B6] hover:bg-[#5A5DCB] font-semibold rounded", children: "Request audit reports" })
      ] })
    ] })
  ] });
}
export {
  Certifications as default
};
