import { jsx, jsxs } from "react/jsx-runtime";
import { RefreshCw, Loader2, ShoppingBag } from "lucide-react";
import { B as Badge } from "./badge-BLnXf9IA.js";
import { t as trpc, B as Button } from "../entry-server.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BlbuqoI-.js";
import { toast } from "sonner";
import { A as AdminLayout } from "./AdminLayout-D0S_T65I.js";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@trpc/react-query";
import "@tanstack/react-query";
import "@trpc/client";
import "react";
import "react-dom/server";
import "react-helmet-async";
import "superjson";
import "wouter";
import "next-themes";
import "@radix-ui/react-tooltip";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-select";
import "./SEOHead-oEJRQGbs.js";
function AdminOrders() {
  const { data: orders, isLoading, refetch } = trpc.order.adminList.useQuery();
  const utils = trpc.useUtils();
  const updateStatus = trpc.order.updateStatus.useMutation({
    onSuccess: () => {
      utils.order.adminList.invalidate();
      toast.success("Status updated");
    }
  });
  const STATUS_COLORS = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    paid: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    processing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    shipped: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    delivered: "bg-green-500/20 text-green-400 border-green-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    refunded: "bg-orange-500/20 text-orange-400 border-orange-500/30"
  };
  return /* @__PURE__ */ jsx(AdminLayout, { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:28", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:29", className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:30", className: "flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:31", children: [
        /* @__PURE__ */ jsx("h1", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:32", className: "font-serif text-2xl font-bold text-foreground", children: "Orders" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:33", className: "text-sm text-muted-foreground mt-1", children: "Manage and update customer orders." })
      ] }),
      /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:35", onClick: () => refetch(), variant: "outline", children: [
        /* @__PURE__ */ jsx(RefreshCw, { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:36", className: "w-4 h-4 mr-2" }),
        " Refresh"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:40", className: "bg-card border border-border rounded-xl shadow-sm overflow-hidden", children: isLoading ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:42", className: "flex items-center justify-center py-12 text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Loader2, { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:43", className: "w-6 h-6 animate-spin mr-2" }),
      " Loading orders..."
    ] }) : (orders ?? []).length === 0 ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:46", className: "text-center py-16 px-4", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:47", className: "bg-secondary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(ShoppingBag, { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:48", className: "w-8 h-8 text-muted-foreground" }) }),
      /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:50", className: "text-lg font-bold text-foreground mb-1", children: "No orders yet" }),
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:51", className: "text-muted-foreground text-sm max-w-sm mx-auto", children: "When customers place orders, they will appear here for you to manage and fulfill." })
    ] }) : /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:54", className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:55", className: "w-full text-sm", children: [
      /* @__PURE__ */ jsx("thead", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:56", className: "bg-secondary/50 border-b border-border", children: /* @__PURE__ */ jsx("tr", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:57", children: ["Order", "Customer", "Destination", "Total", "Status", "Date", "Actions"].map((h) => /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:59", className: "px-6 py-3.5 text-left font-condensed font-bold uppercase tracking-wider text-xs text-muted-foreground", children: h }, h)) }) }),
      /* @__PURE__ */ jsx("tbody", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:63", className: "divide-y divide-border", children: (orders ?? []).map((order) => /* @__PURE__ */ jsxs("tr", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:65", className: "hover:bg-secondary/20 transition-colors cursor-pointer", onClick: () => window.location.href = `/admin-saad/orders/${order.id}`, children: [
        /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:66", className: "px-6 py-4 font-mono text-sm font-bold text-gold", children: order.orderNumber }),
        /* @__PURE__ */ jsxs("td", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:67", className: "px-6 py-4", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:68", className: "font-medium text-foreground", children: order.customerName }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:69", className: "text-muted-foreground text-xs mt-0.5", children: order.customerEmail }),
          order.companyName && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:70", className: "text-muted-foreground text-xs", children: order.companyName })
        ] }),
        /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:72", className: "px-6 py-4 text-muted-foreground", children: order.country }),
        /* @__PURE__ */ jsxs("td", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:73", className: "px-6 py-4 font-condensed font-bold text-foreground", children: [
          "$",
          Number(order.totalAmount).toFixed(2)
        ] }),
        /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:74", className: "px-6 py-4", children: /* @__PURE__ */ jsx(Badge, { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:75", className: `border ${STATUS_COLORS[order.status] ?? ""}`, children: order.status.charAt(0).toUpperCase() + order.status.slice(1) }) }),
        /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:79", className: "px-6 py-4 text-muted-foreground whitespace-nowrap", children: new Date(order.createdAt).toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" }) }),
        /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:82", className: "px-6 py-4", onClick: (e) => e.stopPropagation(), children: /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:83", className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs(
          Select,
          {
            "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:84",
            value: order.status,
            onValueChange: (v) => updateStatus.mutate({ id: order.id, status: v }),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:88", className: "w-[130px] h-8 text-xs bg-background", children: /* @__PURE__ */ jsx(SelectValue, { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:89" }) }),
              /* @__PURE__ */ jsx(SelectContent, { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:91", children: ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"].map((s) => /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\admin\\AdminOrders.tsx:93", value: s, children: s.charAt(0).toUpperCase() + s.slice(1) }, s)) })
            ]
          }
        ) }) })
      ] }, order.id)) })
    ] }) }) })
  ] }) });
}
export {
  AdminOrders as default
};
