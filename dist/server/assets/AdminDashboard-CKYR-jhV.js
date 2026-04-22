import { jsx, jsxs } from "react/jsx-runtime";
import { A as AdminLayout } from "./AdminLayout-D0S_T65I.js";
import { Link } from "wouter";
import { B as Badge } from "./badge-BLnXf9IA.js";
import { t as trpc, B as Button } from "../entry-server.js";
import { DollarSign, ShoppingBag, Package, TrendingUp, MessageSquare, Plus, ExternalLink, Clock, ArrowUpRight, Truck, Eye } from "lucide-react";
import "react";
import "@trpc/client";
import "./SEOHead-oEJRQGbs.js";
import "react-helmet-async";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@trpc/react-query";
import "@tanstack/react-query";
import "react-dom/server";
import "superjson";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "clsx";
import "tailwind-merge";
const STATUS_COLORS = {
  pending: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  paid: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  processing: "bg-violet-500/15 text-violet-500 border-violet-500/30",
  shipped: "bg-cyan-500/15 text-cyan-500 border-cyan-500/30",
  delivered: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
  cancelled: "bg-red-500/15 text-red-500 border-red-500/30",
  refunded: "bg-orange-500/15 text-orange-500 border-orange-500/30"
};
function AdminDashboard() {
  const { data: stats, isLoading } = trpc.order.adminStats.useQuery();
  const kpis = [
    {
      label: "Total Revenue",
      value: `$${stats?.totalRevenue ?? "0.00"}`,
      sub: `${stats?.paidOrderCount ?? 0} paid orders`,
      icon: DollarSign,
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-500",
      accent: "from-emerald-500/20 to-transparent"
    },
    {
      label: "Total Orders",
      value: stats?.orderCount ?? 0,
      sub: `${stats?.pendingCount ?? 0} pending • ${stats?.processingCount ?? 0} processing`,
      icon: ShoppingBag,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
      accent: "from-blue-500/20 to-transparent"
    },
    {
      label: "Products",
      value: stats?.productCount ?? 0,
      sub: `${stats?.activeProductCount ?? 0} active in catalog`,
      icon: Package,
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-500",
      accent: "from-violet-500/20 to-transparent"
    },
    {
      label: "Avg. Order Value",
      value: stats?.orderCount ? `$${(parseFloat(stats.totalRevenue) / (stats.paidOrderCount || 1)).toFixed(2)}` : "$0.00",
      sub: "Per paid order",
      icon: TrendingUp,
      iconBg: "bg-gold/10",
      iconColor: "text-gold",
      accent: "from-gold/20 to-transparent"
    },
    {
      label: "Inquiries",
      value: stats?.inquiryCount ?? 0,
      sub: `${stats?.newInquiryCount ?? 0} new inquiries`,
      icon: MessageSquare,
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-500",
      accent: "from-cyan-500/20 to-transparent"
    }
  ];
  const recentOrders = stats?.recentOrders ?? [];
  const recentInquiries = stats?.recentInquiries ?? [];
  return /* @__PURE__ */ jsx(AdminLayout, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:79", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:80", className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:82", className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:83", children: [
        /* @__PURE__ */ jsx("h1", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:84", className: "font-condensed text-3xl font-extrabold tracking-tight text-foreground uppercase", children: "Dashboard" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:87", className: "text-sm text-muted-foreground mt-1", children: "Welcome back. Here's what's happening with your store." })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:91", className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:92", href: "/admin-saad/product/new", children: /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:93", className: "bg-gold hover:bg-gold/90 text-black font-condensed font-bold uppercase tracking-wider text-xs h-9 px-4", children: [
          /* @__PURE__ */ jsx(Plus, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:94", className: "w-4 h-4 mr-1.5" }),
          " New Product"
        ] }) }),
        /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:97", href: "/", children: /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:98", variant: "outline", size: "sm", className: "text-xs font-medium gap-1.5", children: [
          /* @__PURE__ */ jsx(ExternalLink, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:99", className: "w-3.5 h-3.5" }),
          " View Store"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:106", className: "grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4", children: kpis.map((kpi) => /* @__PURE__ */ jsxs(
      "div",
      {
        "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:108",
        className: "relative overflow-hidden bg-card border border-border rounded-2xl p-5 group hover:border-border/80 transition-all duration-300 hover:shadow-lg hover:shadow-black/5",
        children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:113", className: `absolute inset-0 bg-gradient-to-br ${kpi.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none` }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:115", className: "relative flex items-start justify-between", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:116", className: "space-y-3", children: [
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:117", className: "text-xs font-condensed font-bold uppercase tracking-[0.15em] text-muted-foreground", children: kpi.label }),
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:120", className: "text-3xl font-extrabold tracking-tight text-foreground tabular-nums", children: isLoading ? /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:122", className: "inline-block w-20 h-8 bg-secondary/80 rounded animate-pulse" }) : kpi.value }),
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:127", className: "text-xs text-muted-foreground", children: kpi.sub })
            ] }),
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:129", className: `w-11 h-11 rounded-xl ${kpi.iconBg} flex items-center justify-center shrink-0`, children: /* @__PURE__ */ jsx(kpi.icon, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:130", className: `w-5 h-5 ${kpi.iconColor}` }) })
          ] })
        ]
      },
      kpi.label
    )) }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:138", className: "flex flex-wrap gap-3", children: [
      (stats?.pendingCount ?? 0) > 0 && /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:140", href: "/admin-saad/orders", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:141", className: "flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full px-4 py-2 text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition-colors", children: [
        /* @__PURE__ */ jsx(Clock, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:142", className: "w-3.5 h-3.5" }),
        stats?.pendingCount,
        " Pending Orders",
        /* @__PURE__ */ jsx(ArrowUpRight, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:144", className: "w-3 h-3" })
      ] }) }),
      (stats?.processingCount ?? 0) > 0 && /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:149", href: "/admin-saad/orders", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:150", className: "flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-500 rounded-full px-4 py-2 text-xs font-bold cursor-pointer hover:bg-violet-500/20 transition-colors", children: [
        /* @__PURE__ */ jsx(Truck, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:151", className: "w-3.5 h-3.5" }),
        stats?.processingCount,
        " Processing",
        /* @__PURE__ */ jsx(ArrowUpRight, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:153", className: "w-3 h-3" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:160", className: "bg-card border border-border rounded-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:161", className: "flex items-center justify-between px-6 py-4 border-b border-border", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:162", children: [
          /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:163", className: "font-condensed font-bold text-sm uppercase tracking-[0.12em] text-foreground", children: "Recent Orders" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:166", className: "text-xs text-muted-foreground mt-0.5", children: "Latest activity in your store" })
        ] }),
        /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:168", href: "/admin-saad/orders", children: /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:169", variant: "ghost", size: "sm", className: "text-xs text-gold hover:text-gold/80 gap-1", children: [
          "View All ",
          /* @__PURE__ */ jsx(ArrowUpRight, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:170", className: "w-3 h-3" })
        ] }) })
      ] }),
      recentOrders.length === 0 ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:176", className: "text-center py-16 px-4", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:177", className: "w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(ShoppingBag, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:178", className: "w-6 h-6 text-muted-foreground" }) }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:180", className: "text-sm text-muted-foreground", children: "No orders yet. They'll appear here once customers start ordering." })
      ] }) : /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:183", className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:184", className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:185", children: /* @__PURE__ */ jsx("tr", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:186", className: "bg-secondary/30", children: ["Order", "Customer", "Items", "Total", "Status", "Date", ""].map((h) => /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:188", className: "px-6 py-3 text-left text-[10px] font-condensed font-bold uppercase tracking-[0.15em] text-muted-foreground", children: h }, h)) }) }),
        /* @__PURE__ */ jsx("tbody", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:192", className: "divide-y divide-border/50", children: recentOrders.map((order) => {
          let items = [];
          try {
            items = typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];
          } catch {
          }
          const totalQty = items.reduce((s, i) => s + (i.qty || 0), 0);
          return /* @__PURE__ */ jsxs("tr", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:199", className: "group hover:bg-secondary/20 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:200", className: "px-6 py-4", children: /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:201", className: "font-mono text-xs font-bold text-gold", children: order.orderNumber }) }),
            /* @__PURE__ */ jsxs("td", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:203", className: "px-6 py-4", children: [
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:204", className: "font-semibold text-foreground text-sm", children: order.customerName }),
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:205", className: "text-xs text-muted-foreground", children: order.customerEmail })
            ] }),
            /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:207", className: "px-6 py-4", children: /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:208", className: "text-muted-foreground", children: [
              items.length,
              " item",
              items.length !== 1 ? "s" : "",
              " • ",
              totalQty,
              " units"
            ] }) }),
            /* @__PURE__ */ jsxs("td", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:212", className: "px-6 py-4 font-bold text-foreground tabular-nums", children: [
              "$",
              Number(order.totalAmount).toFixed(2)
            ] }),
            /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:213", className: "px-6 py-4", children: /* @__PURE__ */ jsx(Badge, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:214", className: `border text-[10px] font-bold ${STATUS_COLORS[order.status] || ""}`, children: order.status.charAt(0).toUpperCase() + order.status.slice(1) }) }),
            /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:218", className: "px-6 py-4 text-muted-foreground text-xs whitespace-nowrap", children: new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) }),
            /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:221", className: "px-6 py-4", children: /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:222", href: `/admin-saad/orders/${order.id}`, children: /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:223", variant: "ghost", size: "icon", className: "opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8", children: /* @__PURE__ */ jsx(Eye, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:224", className: "w-4 h-4 text-muted-foreground" }) }) }) })
          ] }, order.id);
        }) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:237", className: "bg-card border border-border rounded-2xl overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:238", className: "flex items-center justify-between px-6 py-4 border-b border-border", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:239", children: [
          /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:240", className: "font-condensed font-bold text-sm uppercase tracking-[0.12em] text-foreground", children: "Recent Inquiries" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:243", className: "text-xs text-muted-foreground mt-0.5", children: "Latest quote requests from your website" })
        ] }),
        /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:245", href: "/admin-saad/inquiries", children: /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:246", variant: "ghost", size: "sm", className: "text-xs text-gold hover:text-gold/80 gap-1", children: [
          "View All ",
          /* @__PURE__ */ jsx(ArrowUpRight, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:247", className: "w-3 h-3" })
        ] }) })
      ] }),
      recentInquiries.length === 0 ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:253", className: "text-center py-12 px-4", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:254", className: "w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(MessageSquare, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:255", className: "w-6 h-6 text-muted-foreground" }) }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:257", className: "text-sm text-muted-foreground", children: "No inquiries yet. They'll appear here when customers submit quote requests." })
      ] }) : /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:260", className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:261", className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:262", children: /* @__PURE__ */ jsx("tr", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:263", className: "bg-secondary/30", children: ["Company", "Contact", "Product", "Qty", "Status", "Date"].map((h) => /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:265", className: "px-6 py-3 text-left text-[10px] font-condensed font-bold uppercase tracking-[0.15em] text-muted-foreground", children: h }, h)) }) }),
        /* @__PURE__ */ jsx("tbody", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:269", className: "divide-y divide-border/50", children: recentInquiries.map((inq) => /* @__PURE__ */ jsxs("tr", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:271", className: "group hover:bg-secondary/20 transition-colors cursor-pointer", onClick: () => window.location.href = `/admin-saad/inquiries/${inq.id}`, children: [
          /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:272", className: "px-6 py-4 font-semibold text-foreground", children: inq.companyName }),
          /* @__PURE__ */ jsxs("td", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:273", className: "px-6 py-4", children: [
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:274", className: "text-foreground", children: inq.contactName }),
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:275", className: "text-xs text-muted-foreground", children: inq.email })
          ] }),
          /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:277", className: "px-6 py-4 text-foreground", children: inq.productType }),
          /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:278", className: "px-6 py-4 font-mono text-foreground", children: inq.quantity }),
          /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:279", className: "px-6 py-4", children: /* @__PURE__ */ jsx(Badge, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:280", className: `border text-[10px] font-bold ${STATUS_COLORS[inq.status] || ""}`, children: inq.status.charAt(0).toUpperCase() + inq.status.slice(1) }) }),
          /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:284", className: "px-6 py-4 text-muted-foreground text-xs whitespace-nowrap", children: new Date(inq.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) })
        ] }, inq.id)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:296", className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:297", href: "/admin-saad/product/new", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:298", className: "bg-card border border-border rounded-2xl p-5 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all cursor-pointer group", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:299", className: "w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Plus, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:300", className: "w-5 h-5 text-gold" }) }),
        /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:302", className: "font-condensed font-bold text-sm uppercase tracking-wider text-foreground mb-1", children: "Add Product" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:303", className: "text-xs text-muted-foreground", children: "Create a new product listing" })
      ] }) }),
      /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:306", href: "/admin-saad/orders", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:307", className: "bg-card border border-border rounded-2xl p-5 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer group", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:308", className: "w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(ShoppingBag, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:309", className: "w-5 h-5 text-blue-500" }) }),
        /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:311", className: "font-condensed font-bold text-sm uppercase tracking-wider text-foreground mb-1", children: "Manage Orders" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:312", className: "text-xs text-muted-foreground", children: "View and process customer orders" })
      ] }) }),
      /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:315", href: "/admin-saad/products", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:316", className: "bg-card border border-border rounded-2xl p-5 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 transition-all cursor-pointer group", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:317", className: "w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform", children: /* @__PURE__ */ jsx(Package, { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:318", className: "w-5 h-5 text-violet-500" }) }),
        /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:320", className: "font-condensed font-bold text-sm uppercase tracking-wider text-foreground mb-1", children: "Product Catalog" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminDashboard.tsx:321", className: "text-xs text-muted-foreground", children: "Edit products, images & pricing" })
      ] }) })
    ] })
  ] }) });
}
export {
  AdminDashboard as default
};
