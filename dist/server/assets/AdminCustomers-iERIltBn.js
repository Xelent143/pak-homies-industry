import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "wouter";
import { B as Button } from "../entry-server.js";
import { A as AdminLayout } from "./AdminLayout-D0S_T65I.js";
import { Users, ShoppingBag, MessageSquare, Package } from "lucide-react";
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
import "./SEOHead-oEJRQGbs.js";
function AdminCustomers() {
  return /* @__PURE__ */ jsx(AdminLayout, { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:8", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:9", className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:10", children: [
      /* @__PURE__ */ jsx("h1", { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:11", className: "font-serif text-2xl font-bold text-foreground", children: "Customers" }),
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:12", className: "text-sm text-muted-foreground mt-1", children: "This section is reserved for customer profiles and account history. For now, customer activity lives across orders and inquiries." })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:17", className: "rounded-2xl border border-border bg-card p-8 text-center", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:18", className: "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold", children: /* @__PURE__ */ jsx(Users, { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:19", className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:21", className: "font-condensed text-lg font-bold uppercase tracking-wider text-foreground", children: "Customer Hub Coming Next" }),
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:24", className: "mx-auto mt-3 max-w-2xl text-sm text-muted-foreground", children: "You can already manage real customer activity through recent orders, quote inquiries, and product drafts. This route now stays inside the admin panel instead of dropping into a 404 page." }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:28", className: "mt-6 flex flex-wrap justify-center gap-3", children: [
        /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:29", href: "/admin-saad/orders", children: /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:30", variant: "outline", children: [
          /* @__PURE__ */ jsx(ShoppingBag, { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:31", className: "mr-2 h-4 w-4" }),
          "View Orders"
        ] }) }),
        /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:35", href: "/admin-saad/inquiries", children: /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:36", variant: "outline", children: [
          /* @__PURE__ */ jsx(MessageSquare, { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:37", className: "mr-2 h-4 w-4" }),
          "View Inquiries"
        ] }) }),
        /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:41", href: "/admin-saad/products", children: /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:42", className: "bg-gold text-black hover:bg-gold-light", children: [
          /* @__PURE__ */ jsx(Package, { "data-loc": "client\\src\\pages\\admin\\AdminCustomers.tsx:43", className: "mr-2 h-4 w-4" }),
          "View Products"
        ] }) })
      ] })
    ] })
  ] }) });
}
export {
  AdminCustomers as default
};
