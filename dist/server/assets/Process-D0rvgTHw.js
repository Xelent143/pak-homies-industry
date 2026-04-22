import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { P as PageHeader } from "./PageHeader-BUZ8Ld1L.js";
import { Link } from "wouter";
const STEPS = [
  { day: "Day 1", title: "Submit your tech pack", body: "Upload sketches, references or use our free Tech Pack Generator. Shehraz reviews within 4 hours and confirms feasibility." },
  { day: "Day 2–6", title: "Sample production", body: "Our cutting and sewing teams build your sample to spec. Daily WhatsApp updates with photos." },
  { day: "Day 7", title: "Sample arrives", body: "DHL Express to your door. Inspect fit, color, stitching, fabric hand. Approve or request revisions." },
  { day: "Week 2–3", title: "Approve / iterate", body: "Most customers approve on the first sample. Revisions are 3–5 days each." },
  { day: "Week 4", title: "Place bulk order", body: "MOQ 50+. Slab pricing locked at quote. We start production immediately." },
  { day: "Week 4–6", title: "Bulk production", body: "15-day production cycle. Daily progress photos. QA at every stage. 0% defect SLA, ±1% tolerance." },
  { day: "Week 6–7", title: "QA + ship", body: "Final inspection. Packed with care labels and your branding. Air or sea freight to USA. Tracking shared." }
];
function Process() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        "data-loc": "client\\src\\pages\\Process.tsx:17",
        eyebrow: "The process",
        title: "From sketch to shelf in 6 weeks.",
        subtitle: "Most competitors quote 2–4 weeks just for samples. We deliver finished bulk in the same window."
      }
    ),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Process.tsx:23", className: "container-page py-20", children: [
      /* @__PURE__ */ jsx("ol", { "data-loc": "client\\src\\pages\\Process.tsx:24", className: "space-y-4", children: STEPS.map((s, i) => /* @__PURE__ */ jsxs("li", { "data-loc": "client\\src\\pages\\Process.tsx:26", className: "grid md:grid-cols-[160px_1fr] gap-6 p-6 border border-[#E0E0E0] rounded hover:border-[#3E41B6] transition-colors", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Process.tsx:27", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Process.tsx:28", className: "font-display text-5xl text-[#3E41B6]/30", children: String(i + 1).padStart(2, "0") }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Process.tsx:29", className: "ribbon-text text-[#3E41B6] mt-2", children: s.day })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Process.tsx:31", children: [
          /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\pages\\Process.tsx:32", className: "font-display text-2xl", children: s.title }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Process.tsx:33", className: "text-[#555] mt-2 leading-relaxed", children: s.body })
        ] })
      ] }, s.day)) }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Process.tsx:39", className: "mt-16 p-10 bg-[#3E41B6] text-white rounded", children: [
        /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\Process.tsx:40", className: "font-display text-3xl md:text-4xl", children: "Skip the consultant. Use our free tools." }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Process.tsx:41", className: "text-white/80 mt-3 max-w-xl", children: "Build your tech pack, design custom labels, and configure a 3D garment — all in your browser, all free." }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Process.tsx:42", className: "mt-6 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\Process.tsx:43", href: "/capabilities/techpack", className: "px-5 py-3 bg-white text-[#3E41B6] font-semibold rounded", children: "Tech Pack Generator" }),
          /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\Process.tsx:44", href: "/capabilities/label-studio", className: "px-5 py-3 border border-white/30 hover:bg-white hover:text-[#3E41B6] font-semibold rounded", children: "Label Studio" }),
          /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\Process.tsx:45", href: "/customize", className: "px-5 py-3 border border-white/30 hover:bg-white hover:text-[#3E41B6] font-semibold rounded", children: "3D Customizer" })
        ] })
      ] })
    ] })
  ] });
}
export {
  Process as default
};
