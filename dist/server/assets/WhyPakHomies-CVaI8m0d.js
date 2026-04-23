import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { P as PageHeader } from "./PageHeader-BUZ8Ld1L.js";
import { Check, X } from "lucide-react";
import { Link } from "wouter";
const ROWS = [
  ["Published MOQ", "Vague — 'call for quote'", "50–100 pieces", "50 pieces, published"],
  ["Sample lead time", "2–4 weeks", "2 weeks", "7 days, guaranteed"],
  ["Bulk lead time", "4–8 weeks", "3–4 weeks", "15 days"],
  ["BSCI certified", false, "Some", true],
  ["OEKO-TEX certified", false, "Some", true],
  ["WRAP certified", false, "Some", true],
  ["Direct founder access", false, false, true],
  ["Slab pricing published", false, "Sometimes", true],
  ["Per-unit cost (50pc denim jacket)", "$14–22", "$28–40", "$18.50"]
];
function Cell({ v }) {
  if (v === true) return /* @__PURE__ */ jsx(Check, { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:18", size: 18, className: "text-[#3E41B6]" });
  if (v === false) return /* @__PURE__ */ jsx(X, { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:19", size: 18, className: "text-[#FE3136]/60" });
  return /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:20", className: "text-sm text-[#555]", children: v });
}
function WhyPakHomies() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:26",
        eyebrow: "Why Pak Homies",
        title: "The only factory that's certified, fast and affordable — at the same time.",
        subtitle: "We compared ourselves to the two alternatives most founders end up considering. Here's what we found."
      }
    ),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:32", className: "container-page py-20", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:33", className: "overflow-x-auto border border-[#E0E0E0] rounded", children: /* @__PURE__ */ jsxs("table", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:34", className: "w-full text-left", children: [
        /* @__PURE__ */ jsx("thead", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:35", children: /* @__PURE__ */ jsxs("tr", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:36", className: "border-b border-[#E0E0E0] bg-[#F8F8F8]", children: [
          /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:37", className: "p-4 text-xs uppercase tracking-widest text-[#555]", children: "Factor" }),
          /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:38", className: "p-4 text-xs uppercase tracking-widest text-[#555]", children: "PK Competitor" }),
          /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:39", className: "p-4 text-xs uppercase tracking-widest text-[#555]", children: "USA Competitor" }),
          /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:40", className: "p-4 text-xs uppercase tracking-widest text-white bg-[#3E41B6]", children: "Pak Homies" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:43", children: ROWS.map(([label, a, b, c], i) => /* @__PURE__ */ jsxs("tr", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:45", className: "border-b border-[#E0E0E0] last:border-0", children: [
          /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:46", className: "p-4 font-semibold text-sm", children: label }),
          /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:47", className: "p-4", children: /* @__PURE__ */ jsx(Cell, { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:47", v: a }) }),
          /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:48", className: "p-4", children: /* @__PURE__ */ jsx(Cell, { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:48", v: b }) }),
          /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:49", className: "p-4 bg-[#3E41B6]/5", children: /* @__PURE__ */ jsx(Cell, { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:49", v: c }) })
        ] }, i)) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:56", className: "mt-12 grid md:grid-cols-2 gap-6", children: [
        { h: "Your IP is safe", body: "Confidentiality agreement on every order. We don't produce competing designs. We don't share your designs. Direct relationship = no leaks." },
        { h: "Direct access", body: "WhatsApp. Video calls. No middleman. Shehraz responds within 4 hours. Your questions are his priority." },
        { h: "Start small, scale big", body: "50 pieces to 500+ without switching factories. Same quality. No setup fees. Price drops at each slab tier." },
        { h: "Ethical proof", body: "BSCI, OEKO-TEX, WRAP — visible. Factory transparent. Worker safety verified. Your brand's integrity is protected." }
      ].map((c) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:63", className: "p-7 border border-[#E0E0E0] rounded hover:border-[#3E41B6] transition-colors", children: [
        /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:64", className: "font-display text-2xl", children: c.h }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:65", className: "text-[#555] mt-3 leading-relaxed", children: c.body })
      ] }, c.h)) }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:70", className: "mt-16 p-10 bg-[#1A1A1A] text-white rounded", children: [
        /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:71", className: "font-display text-3xl md:text-4xl", children: "Ready to compare for yourself?" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:72", className: "text-white/70 mt-3 max-w-xl", children: "Submit your tech pack. Shehraz will quote you within 4 hours." }),
        /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\WhyPakHomies.tsx:73", href: "/inquire", className: "mt-6 inline-block px-6 py-3 bg-[#3E41B6] hover:bg-[#5A5DCB] font-semibold rounded", children: "Get a Free Sample Quote" })
      ] })
    ] })
  ] });
}
export {
  WhyPakHomies as default
};
