import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useParams, Link } from "wouter";
import { P as PageHeader } from "./PageHeader-BUZ8Ld1L.js";
import { N as NotFound } from "../entry-server.js";
import "@trpc/react-query";
import "@tanstack/react-query";
import "@trpc/client";
import "react";
import "react-dom/server";
import "react-helmet-async";
import "superjson";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "@radix-ui/react-slot";
import "class-variance-authority";
const CITIES = {
  atlanta: {
    name: "Atlanta",
    tag: "Where ATL creators source",
    copy: "Atlanta's streetwear scene runs on speed and authenticity. We deliver both — 7-day samples, certified production, direct relationship with the founder.",
    angle: [
      "Direct DHL Express to ATL — 4 days from Sialkot",
      "Reference brands sourced by Atlanta founders",
      "Eastern Time WhatsApp coverage",
      "Trade show samples for AmericasMart"
    ]
  },
  houston: {
    name: "Houston",
    tag: "Made for Houston's rap culture",
    copy: "Houston's hip-hop and chopped-and-screwed culture has always set the streetwear bar. Pak Homies makes the merch that holds up.",
    angle: ["Heavyweight tees and hoodies", "Custom chrome and screen print", "Texas-route DHL", "CT/PT support"]
  },
  "los-angeles": {
    name: "Los Angeles",
    tag: "Compete with domestic at 1/3 the cost",
    copy: "LA brands face the highest production costs in the country. We give you LA-quality, ethically made, at Sialkot prices.",
    angle: ["LA-port freight options", "Streetwear-grade fabrics", "Sustainable certifications", "PT timezone WhatsApp"]
  },
  "new-york": {
    name: "New York",
    tag: "NYC's fastest turnaround factory",
    copy: "NYC moves on its own clock. 7-day samples means you can iterate weekly without burning cash.",
    angle: ["JFK air freight", "Fashion week sample sprints", "Custom denim", "ET timezone coverage"]
  },
  detroit: {
    name: "Detroit",
    tag: "Empowering Detroit creators",
    copy: "Detroit's hustle deserves a factory partner that respects the grind. MOQ 50 means you can launch with what you have.",
    angle: ["Affordable MOQ for new brands", "Workwear and heritage fits", "Direct WhatsApp to Shehraz", "ET timezone coverage"]
  },
  chicago: {
    name: "Chicago",
    tag: "Chicago's trusted manufacturing partner",
    copy: "From the West Side to River North, Chicago brands need manufacturing they can trust. Triple-certified, transparent, accountable.",
    angle: ["O'Hare air freight", "Cold-weather puffer specialty", "Custom labels and patches", "CT timezone coverage"]
  }
};
function GeoLanding() {
  const params = useParams();
  const city = params.region ? CITIES[params.region] : void 0;
  if (!city) return /* @__PURE__ */ jsx(NotFound, { "data-loc": "client\\src\\pages\\GeoLanding.tsx:52" });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(PageHeader, { "data-loc": "client\\src\\pages\\GeoLanding.tsx:56", eyebrow: `Cities · ${city.name}`, title: city.tag, subtitle: city.copy }),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\GeoLanding.tsx:58", className: "container-page py-20 grid lg:grid-cols-[1.4fr_1fr] gap-12", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\GeoLanding.tsx:59", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\GeoLanding.tsx:60", className: "ribbon-text text-[#3E41B6]", children: "Local angle" }),
        /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\GeoLanding.tsx:61", className: "font-display text-3xl mt-3", children: [
          "Built for ",
          city.name,
          " brands"
        ] }),
        /* @__PURE__ */ jsx("ul", { "data-loc": "client\\src\\pages\\GeoLanding.tsx:62", className: "mt-6 space-y-3", children: city.angle.map((a) => /* @__PURE__ */ jsx("li", { "data-loc": "client\\src\\pages\\GeoLanding.tsx:64", className: "p-5 border border-[#E0E0E0] rounded", children: a }, a)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\GeoLanding.tsx:69", className: "p-10 bg-[#3E41B6] text-white rounded", children: [
        /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\GeoLanding.tsx:70", className: "font-display text-3xl", children: [
          "Ready to ship to ",
          city.name,
          "?"
        ] }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\GeoLanding.tsx:71", className: "text-white/80 mt-3", children: "Submit a tech pack. Quote within 4 hours. Samples in your hands in ~10 days." }),
        /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\GeoLanding.tsx:72", href: "/inquire", className: "mt-6 inline-block px-6 py-3 bg-white text-[#3E41B6] font-semibold rounded", children: "Get a Free Sample Quote" })
      ] })
    ] })
  ] });
}
export {
  GeoLanding as default
};
