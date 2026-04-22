import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { P as PageHeader } from "./PageHeader-BUZ8Ld1L.js";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { P as PRODUCTS } from "../entry-server.js";
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
import "@radix-ui/react-slot";
import "class-variance-authority";
function Products() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        "data-loc": "client\\src\\pages\\Products.tsx:9",
        eyebrow: "Garment range",
        title: "Nine garment types. All MOQ 50.",
        subtitle: "Pick one or mix and match. All slab-priced. All certified. Customize colors, fits, hardware, labels — we handle the production."
      }
    ),
    /* @__PURE__ */ jsx("section", { "data-loc": "client\\src\\pages\\Products.tsx:15", className: "container-page py-20", children: /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Products.tsx:16", className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: PRODUCTS.map((p) => /* @__PURE__ */ jsxs(
      Link,
      {
        "data-loc": "client\\src\\pages\\Products.tsx:18",
        href: `/products/${p.slug}`,
        className: "group bg-white border border-[#E0E0E0] rounded overflow-hidden hover:border-[#3E41B6] transition-colors",
        children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Products.tsx:23", className: "aspect-[4/5] overflow-hidden bg-[#F2F2F2]", children: /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\pages\\Products.tsx:24", src: p.img, alt: p.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }) }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Products.tsx:26", className: "p-6", children: [
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Products.tsx:27", className: "font-display text-xl", children: p.name }),
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Products.tsx:28", className: "text-sm text-[#555] mt-2", children: p.tagline }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Products.tsx:29", className: "mt-4 flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Products.tsx:30", className: "text-sm", children: [
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Products.tsx:31", className: "text-[#555]", children: "From " }),
                /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\pages\\Products.tsx:32", className: "font-semibold text-[#3E41B6]", children: [
                  "$",
                  p.basePrice.toFixed(2)
                ] }),
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Products.tsx:33", className: "text-[#555]", children: "/unit" })
              ] }),
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Products.tsx:35", className: "text-xs font-semibold text-[#3E41B6] inline-flex items-center gap-1 group-hover:text-[#FE3136]", children: [
                "Open ",
                /* @__PURE__ */ jsx(ArrowRight, { "data-loc": "client\\src\\pages\\Products.tsx:36", size: 14 })
              ] })
            ] })
          ] })
        ]
      },
      p.slug
    )) }) })
  ] });
}
export {
  Products as default
};
