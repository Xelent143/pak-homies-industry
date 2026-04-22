import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "wouter";
import { useMemo, useState } from "react";
import { Filter, X, Search, ArrowUpRight, Truck } from "lucide-react";
import { P as PRODUCTS } from "../entry-server.js";
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
const ALL = "All";
function Shop() {
  const categories = useMemo(() => {
    const counts = {};
    PRODUCTS.forEach((p) => {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    });
    return [{ name: ALL, count: PRODUCTS.length }, ...Object.entries(counts).map(([name, count]) => ({ name, count }))];
  }, []);
  const [active, setActive] = useState(ALL);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [mobileOpen, setMobileOpen] = useState(false);
  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => active === ALL || p.category === active);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (sort === "price-asc") list = [...list].sort((a, b) => a.basePrice - b.basePrice);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.basePrice - a.basePrice);
    return list;
  }, [active, query, sort]);
  return /* @__PURE__ */ jsxs("main", { "data-loc": "client\\src\\pages\\Shop.tsx:32", className: "bg-[#F8F8F8] text-[#1A1A1A] min-h-screen", children: [
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Shop.tsx:34", className: "bg-[#0A0A0E] text-white border-b-2 border-[#1A1A1A] relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Shop.tsx:35", className: "absolute inset-0 paper-grain opacity-[0.04] pointer-events-none" }),
      /* @__PURE__ */ jsx(
        "div",
        {
          "data-loc": "client\\src\\pages\\Shop.tsx:36",
          className: "absolute inset-0 opacity-[0.06] animate-doodle-drift pointer-events-none",
          style: { backgroundImage: "url('/images/streetwear-doodle-pattern.png')", backgroundSize: "600px 600px" }
        }
      ),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Shop.tsx:40", className: "container mx-auto px-6 py-16 relative z-10", children: [
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Shop.tsx:41", className: "text-[#FE3136] text-xs uppercase tracking-[0.2em] font-bold block mb-4", children: "SHOP / CATALOG" }),
        /* @__PURE__ */ jsxs("h1", { "data-loc": "client\\src\\pages\\Shop.tsx:42", className: "text-5xl md:text-7xl font-headline font-black uppercase tracking-tight leading-[0.95]", children: [
          "Browse the floor.",
          /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\pages\\Shop.tsx:43" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Shop.tsx:44", className: "text-[#FE3136]", children: "Order from 50 pieces." })
        ] }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Shop.tsx:46", className: "text-lg text-white/70 mt-6 max-w-2xl", children: "Every garment below is cut, sewn, and finished in our Sialkot factory. Filter by category, search, or just scroll. Click any piece to see fabric specs, slab pricing, and customization options." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Shop.tsx:54", className: "container mx-auto px-6 py-12", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          "data-loc": "client\\src\\pages\\Shop.tsx:56",
          onClick: () => setMobileOpen(true),
          className: "lg:hidden mb-6 inline-flex items-center gap-2 px-5 py-3 border-2 border-[#1A1A1A] bg-white font-bold uppercase tracking-widest text-xs",
          children: [
            /* @__PURE__ */ jsx(Filter, { "data-loc": "client\\src\\pages\\Shop.tsx:60", size: 14 }),
            " Filter & Categories"
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Shop.tsx:63", className: "grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10", children: [
        /* @__PURE__ */ jsxs(
          "aside",
          {
            "data-loc": "client\\src\\pages\\Shop.tsx:65",
            className: `${mobileOpen ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto" : "hidden"} lg:block lg:static lg:p-0 lg:bg-transparent`,
            children: [
              mobileOpen && /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\Shop.tsx:69", onClick: () => setMobileOpen(false), className: "lg:hidden absolute top-4 right-4 p-2", "aria-label": "Close", children: /* @__PURE__ */ jsx(X, { "data-loc": "client\\src\\pages\\Shop.tsx:70", size: 24 }) }),
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Shop.tsx:74", className: "lg:sticky lg:top-24", children: [
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Shop.tsx:76", className: "border-2 border-[#1A1A1A] bg-white flex items-center gap-2 px-4 py-3", children: [
                  /* @__PURE__ */ jsx(Search, { "data-loc": "client\\src\\pages\\Shop.tsx:77", size: 16, className: "text-[#767685]" }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      "data-loc": "client\\src\\pages\\Shop.tsx:78",
                      type: "text",
                      value: query,
                      onChange: (e) => setQuery(e.target.value),
                      placeholder: "Search garments…",
                      className: "bg-transparent outline-none text-sm w-full placeholder:text-[#767685]"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Shop.tsx:88", className: "mt-8", children: [
                  /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\pages\\Shop.tsx:89", className: "text-[10px] uppercase tracking-[0.25em] text-[#FE3136] font-bold mb-4", children: "Categories" }),
                  /* @__PURE__ */ jsx("ul", { "data-loc": "client\\src\\pages\\Shop.tsx:90", className: "space-y-1", children: categories.map((c) => /* @__PURE__ */ jsx("li", { "data-loc": "client\\src\\pages\\Shop.tsx:92", children: /* @__PURE__ */ jsxs(
                    "button",
                    {
                      "data-loc": "client\\src\\pages\\Shop.tsx:93",
                      onClick: () => {
                        setActive(c.name);
                        setMobileOpen(false);
                      },
                      className: `w-full flex items-center justify-between px-4 py-3 border-2 transition-colors ${active === c.name ? "bg-[#1A1A1A] text-white border-[#1A1A1A]" : "bg-white text-[#1A1A1A] border-[#E0E0E0] hover:border-[#1A1A1A]"}`,
                      children: [
                        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Shop.tsx:101", className: "font-headline font-black uppercase text-sm tracking-wide", children: c.name }),
                        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Shop.tsx:102", className: `text-[10px] tracking-widest font-bold ${active === c.name ? "text-white/60" : "text-[#767685]"}`, children: c.count.toString().padStart(2, "0") })
                      ]
                    }
                  ) }, c.name)) })
                ] }),
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Shop.tsx:112", className: "mt-8 p-5 border-2 border-[#1A1A1A] bg-[#3E41B6] text-white", children: [
                  /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Shop.tsx:113", className: "text-[10px] uppercase tracking-[0.2em] font-bold text-white/70", children: "Slab pricing" }),
                  /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Shop.tsx:114", className: "font-headline font-black text-3xl mt-2 leading-none", children: "From $9" }),
                  /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\Shop.tsx:115", className: "text-xs text-white/80 mt-3 leading-relaxed", children: [
                    "All-in landed price drops up to ",
                    /* @__PURE__ */ jsx("strong", { "data-loc": "client\\src\\pages\\Shop.tsx:116", className: "text-[#FE3136]", children: "32%" }),
                    " at 500+ units."
                  ] }),
                  /* @__PURE__ */ jsxs(Link, { "data-loc": "client\\src\\pages\\Shop.tsx:118", href: "/inquire", className: "mt-4 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-white border-b-2 border-white pb-0.5 hover:text-[#FE3136] hover:border-[#FE3136]", children: [
                    "Get quote ",
                    /* @__PURE__ */ jsx(ArrowUpRight, { "data-loc": "client\\src\\pages\\Shop.tsx:119", size: 11 })
                  ] })
                ] }),
                /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Shop.tsx:124", className: "mt-6 grid grid-cols-3 gap-2", children: ["BSCI", "OEKO-TEX", "WRAP"].map((c) => /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Shop.tsx:126", className: "border border-[#E0E0E0] bg-white p-2 text-center text-[9px] uppercase tracking-widest font-bold text-[#3A3A3A]", children: c }, c)) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Shop.tsx:135", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Shop.tsx:137", className: "flex flex-wrap items-end justify-between gap-4 mb-6 pb-4 border-b-2 border-[#1A1A1A]", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Shop.tsx:138", children: [
              /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\Shop.tsx:139", className: "font-headline font-black uppercase text-2xl", children: active }),
              /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\Shop.tsx:140", className: "text-xs uppercase tracking-widest text-[#767685] font-bold mt-1", children: [
                "Showing ",
                filtered.length,
                " ",
                filtered.length === 1 ? "product" : "products"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Shop.tsx:144", className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("label", { "data-loc": "client\\src\\pages\\Shop.tsx:145", className: "text-[10px] uppercase tracking-widest font-bold text-[#767685]", children: "Sort" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  "data-loc": "client\\src\\pages\\Shop.tsx:146",
                  value: sort,
                  onChange: (e) => setSort(e.target.value),
                  className: "border-2 border-[#1A1A1A] bg-white px-3 py-2 text-xs font-bold uppercase tracking-widest outline-none cursor-pointer",
                  children: [
                    /* @__PURE__ */ jsx("option", { "data-loc": "client\\src\\pages\\Shop.tsx:151", value: "featured", children: "Featured" }),
                    /* @__PURE__ */ jsx("option", { "data-loc": "client\\src\\pages\\Shop.tsx:152", value: "price-asc", children: "Price: Low → High" }),
                    /* @__PURE__ */ jsx("option", { "data-loc": "client\\src\\pages\\Shop.tsx:153", value: "price-desc", children: "Price: High → Low" })
                  ]
                }
              )
            ] })
          ] }),
          filtered.length === 0 && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Shop.tsx:160", className: "border-2 border-dashed border-[#1A1A1A] p-16 text-center bg-white", children: [
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Shop.tsx:161", className: "font-headline font-black text-2xl uppercase", children: "No matches" }),
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Shop.tsx:162", className: "text-sm text-[#3A3A3A] mt-2", children: "Try a different category or search term." }),
            /* @__PURE__ */ jsx("button", { "data-loc": "client\\src\\pages\\Shop.tsx:163", onClick: () => {
              setActive(ALL);
              setQuery("");
            }, className: "mt-6 px-6 py-3 bg-[#1A1A1A] text-white font-bold uppercase tracking-widest text-xs", children: "Reset filters" })
          ] }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Shop.tsx:170", className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6", children: filtered.map((p, i) => /* @__PURE__ */ jsxs(
            Link,
            {
              "data-loc": "client\\src\\pages\\Shop.tsx:172",
              href: `/products/${p.slug}`,
              className: "group bg-white border-2 border-[#1A1A1A] hover:border-[#FE3136] transition-colors flex flex-col",
              children: [
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Shop.tsx:177", className: "relative aspect-[4/5] overflow-hidden bg-[#F0F0F0]", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      "data-loc": "client\\src\\pages\\Shop.tsx:178",
                      src: p.img,
                      alt: p.name,
                      className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    }
                  ),
                  /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Shop.tsx:183", className: "absolute top-3 left-3 bg-[#1A1A1A] text-white px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold", children: String(i + 1).padStart(2, "0") }),
                  p.freeShipping && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Shop.tsx:187", className: "absolute top-3 right-3 bg-[#FE3136] text-white px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold inline-flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Truck, { "data-loc": "client\\src\\pages\\Shop.tsx:188", size: 11 }),
                    " FREE"
                  ] }),
                  /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Shop.tsx:191", className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A1A1A] to-transparent p-3 text-white text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity", children: "View product →" })
                ] }),
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Shop.tsx:195", className: "p-5 flex-1 flex flex-col", children: [
                  /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Shop.tsx:196", className: "text-[10px] uppercase tracking-[0.2em] text-[#767685] font-bold", children: p.category }),
                  /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\pages\\Shop.tsx:197", className: "font-headline font-black text-2xl mt-1 leading-tight", children: p.name }),
                  /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Shop.tsx:198", className: "text-xs text-[#3A3A3A] mt-2 line-clamp-2", children: p.tagline }),
                  /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Shop.tsx:199", className: "mt-4 pt-4 border-t border-[#E0E0E0] flex items-stretch justify-between gap-3", children: [
                    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Shop.tsx:200", className: "flex-1 flex flex-col justify-between", children: [
                      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Shop.tsx:201", className: "text-[11px] uppercase tracking-widest text-[#767685] font-bold", children: "From" }),
                      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Shop.tsx:202", className: "font-headline font-black text-3xl text-[#3E41B6] leading-none mt-1", children: [
                        "$",
                        p.basePrice.toFixed(2)
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Shop.tsx:204", className: "flex-1 flex flex-col justify-between text-right", children: [
                      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Shop.tsx:205", className: "text-[11px] uppercase tracking-widest text-[#767685] font-bold", children: "MOQ" }),
                      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Shop.tsx:206", className: "font-headline font-black text-3xl text-[#1A1A1A] leading-none mt-1", children: "50" })
                    ] })
                  ] })
                ] })
              ]
            },
            p.slug
          )) })
        ] })
      ] })
    ] })
  ] });
}
export {
  Shop as default
};
