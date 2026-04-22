import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "wouter";
import { A as AdminLayout } from "./AdminLayout-D0S_T65I.js";
import { t as trpc, B as Button } from "../entry-server.js";
import { B as Badge } from "./badge-BLnXf9IA.js";
import { MessageSquare, Search, Loader2, ArrowUpRight, CheckCircle2, FileText, Eye, Clock } from "lucide-react";
import "@trpc/client";
import "./SEOHead-oEJRQGbs.js";
import "react-helmet-async";
import "@trpc/react-query";
import "@tanstack/react-query";
import "react-dom/server";
import "superjson";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
const STATUS_COLORS = {
  new: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  reviewed: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  quoted: "bg-violet-500/15 text-violet-500 border-violet-500/30",
  closed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
};
const STATUS_ICONS = {
  new: /* @__PURE__ */ jsx(Clock, { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:20", className: "w-3 h-3" }),
  reviewed: /* @__PURE__ */ jsx(Eye, { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:21", className: "w-3 h-3" }),
  quoted: /* @__PURE__ */ jsx(FileText, { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:22", className: "w-3 h-3" }),
  closed: /* @__PURE__ */ jsx(CheckCircle2, { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:23", className: "w-3 h-3" })
};
function AdminInquiries() {
  const { data: inquiries, isLoading } = trpc.rfq.adminList.useQuery();
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = (inquiries ?? []).filter((inq) => {
    if (filterStatus !== "all" && inq.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      return inq.companyName.toLowerCase().includes(q) || inq.contactName.toLowerCase().includes(q) || inq.email.toLowerCase().includes(q) || inq.productType.toLowerCase().includes(q);
    }
    return true;
  });
  const statusCounts = {
    all: inquiries?.length ?? 0,
    new: inquiries?.filter((i) => i.status === "new").length ?? 0,
    reviewed: inquiries?.filter((i) => i.status === "reviewed").length ?? 0,
    quoted: inquiries?.filter((i) => i.status === "quoted").length ?? 0,
    closed: inquiries?.filter((i) => i.status === "closed").length ?? 0
  };
  return /* @__PURE__ */ jsx(AdminLayout, { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:56", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:57", className: "space-y-6", children: [
    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:59", className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:60", children: [
      /* @__PURE__ */ jsxs("h1", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:61", className: "font-condensed text-3xl font-extrabold tracking-tight text-foreground uppercase flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(MessageSquare, { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:62", className: "w-7 h-7 text-gold" }),
        "Inquiries"
      ] }),
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:65", className: "text-sm text-muted-foreground mt-1", children: "Manage quotes, proposals, and customer inquiries from your website." })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:72", className: "flex flex-wrap items-center gap-2", children: [
      ["all", "new", "reviewed", "quoted", "closed"].map((status) => /* @__PURE__ */ jsxs(
        "button",
        {
          "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:74",
          onClick: () => setFilterStatus(status),
          className: `
                flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                ${filterStatus === status ? "bg-gold text-black shadow-md" : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"}
              `,
          children: [
            status !== "all" && STATUS_ICONS[status],
            status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:87", className: `ml-1 text-[10px] ${filterStatus === status ? "text-black/60" : "text-muted-foreground/60"}`, children: statusCounts[status] })
          ]
        },
        status
      )),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:94", className: "relative ml-auto", children: [
        /* @__PURE__ */ jsx(Search, { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:95", className: "w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:96",
            type: "text",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "Search inquiries...",
            className: "pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm w-[200px] focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:107", className: "bg-card border border-border rounded-2xl overflow-hidden", children: isLoading ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:109", className: "flex items-center justify-center py-20", children: [
      /* @__PURE__ */ jsx(Loader2, { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:110", className: "w-6 h-6 animate-spin text-muted-foreground mr-2" }),
      " Loading inquiries..."
    ] }) : filtered.length === 0 ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:113", className: "text-center py-20 px-4", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:114", className: "w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(MessageSquare, { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:115", className: "w-6 h-6 text-muted-foreground" }) }),
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:117", className: "text-sm text-muted-foreground", children: search ? "No inquiries match your search." : "No inquiries yet. They'll appear here when customers submit quote requests." })
    ] }) : /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:122", className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:123", className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:124", children: /* @__PURE__ */ jsx("tr", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:125", className: "bg-secondary/30 border-b border-border", children: ["Company", "Contact", "Product", "Quantity", "Status", "Date", ""].map((h) => /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:127", className: "px-6 py-3 text-left text-[10px] font-condensed font-bold uppercase tracking-[0.15em] text-muted-foreground", children: h }, h)) }) }),
      /* @__PURE__ */ jsx("tbody", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:131", className: "divide-y divide-border/50", children: filtered.map((inq) => /* @__PURE__ */ jsxs(
        "tr",
        {
          "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:133",
          className: "group hover:bg-secondary/20 transition-colors cursor-pointer",
          onClick: () => window.location.href = `/admin-saad/inquiries/${inq.id}`,
          children: [
            /* @__PURE__ */ jsxs("td", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:138", className: "px-6 py-4", children: [
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:139", className: "font-semibold text-foreground", children: inq.companyName }),
              inq.country && /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:140", className: "text-xs text-muted-foreground", children: inq.country })
            ] }),
            /* @__PURE__ */ jsxs("td", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:142", className: "px-6 py-4", children: [
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:143", className: "text-foreground", children: inq.contactName }),
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:144", className: "text-xs text-muted-foreground", children: inq.email })
            ] }),
            /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:146", className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:147", className: "text-foreground", children: inq.productType }) }),
            /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:149", className: "px-6 py-4 font-mono text-foreground", children: inq.quantity }),
            /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:150", className: "px-6 py-4", children: /* @__PURE__ */ jsxs(Badge, { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:151", className: `border text-[10px] font-bold gap-1 ${STATUS_COLORS[inq.status]}`, children: [
              STATUS_ICONS[inq.status],
              inq.status.charAt(0).toUpperCase() + inq.status.slice(1)
            ] }) }),
            /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:156", className: "px-6 py-4 text-muted-foreground text-xs whitespace-nowrap", children: new Date(inq.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }),
            /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:159", className: "px-6 py-4", children: /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:160", href: `/admin-saad/inquiries/${inq.id}`, children: /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:161", variant: "ghost", size: "icon", className: "opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8", children: /* @__PURE__ */ jsx(ArrowUpRight, { "data-loc": "client\\src\\pages\\admin\\AdminInquiries.tsx:162", className: "w-4 h-4 text-gold" }) }) }) })
          ]
        },
        inq.id
      )) })
    ] }) }) })
  ] }) });
}
export {
  AdminInquiries as default
};
