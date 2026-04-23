import { jsx, jsxs } from "react/jsx-runtime";
import { useRoute, Link } from "wouter";
import { t as trpc, B as Button } from "../entry-server.js";
import { toast } from "sonner";
import { A as AdminLayout } from "./AdminLayout-D0S_T65I.js";
import { B as Badge } from "./badge-BLnXf9IA.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BlbuqoI-.js";
import { S as Separator } from "./separator-DGjjQRwf.js";
import { Loader2, ArrowLeft, Calendar, Download, User, Mail, Phone, MapPin, CreditCard, Package, Truck, FileText } from "lucide-react";
import "@trpc/react-query";
import "@tanstack/react-query";
import "@trpc/client";
import "react";
import "react-dom/server";
import "react-helmet-async";
import "superjson";
import "next-themes";
import "@radix-ui/react-tooltip";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "./SEOHead-oEJRQGbs.js";
import "@radix-ui/react-select";
import "@radix-ui/react-separator";
const STATUS_COLORS = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  paid: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  processing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  shipped: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  delivered: "bg-green-500/20 text-green-400 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  refunded: "bg-orange-500/20 text-orange-400 border-orange-500/30"
};
async function generateInvoicePDF(order) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF("p", "mm", "a4");
  const W = 210;
  const margin = 20;
  const contentW = W - margin * 2;
  let y = 20;
  const gold = [183, 150, 90];
  const dark = [20, 20, 20];
  const mid = [100, 100, 100];
  const lightBg = [248, 248, 245];
  doc.setFillColor(...dark);
  doc.rect(0, 0, W, 48, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Pak Homies Industry", margin, 22);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  doc.text("Custom Apparel Manufacturing | Sialkot, Pakistan", margin, 30);
  doc.text("info@pakhomiesind.com  |  +92 302 292 2242", margin, 36);
  doc.setTextColor(...gold);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text("INVOICE", W - margin, 25, { align: "right" });
  doc.setFontSize(10);
  doc.setTextColor(200, 200, 200);
  doc.text(`#${order.orderNumber}`, W - margin, 34, { align: "right" });
  y = 58;
  doc.setFillColor(...lightBg);
  doc.rect(margin, y, contentW, 22, "F");
  doc.setTextColor(...mid);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("DATE", margin + 5, y + 6);
  doc.text("STATUS", margin + 55, y + 6);
  doc.text("PAYMENT METHOD", margin + 105, y + 6);
  doc.setTextColor(...dark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  doc.text(dateStr, margin + 5, y + 16);
  doc.text(order.status?.toUpperCase() || "PENDING", margin + 55, y + 16);
  doc.text((order.paymentMethod || "invoice").toUpperCase(), margin + 105, y + 16);
  y += 32;
  doc.setTextColor(...gold);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("BILL TO", margin, y);
  y += 6;
  doc.setTextColor(...dark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(order.customerName, margin, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...mid);
  if (order.companyName) {
    doc.text(order.companyName, margin, y);
    y += 4.5;
  }
  doc.text(order.customerEmail, margin, y);
  y += 4.5;
  if (order.customerPhone) {
    doc.text(order.customerPhone, margin, y);
    y += 4.5;
  }
  doc.text(order.addressLine1, margin, y);
  y += 4.5;
  if (order.addressLine2) {
    doc.text(order.addressLine2, margin, y);
    y += 4.5;
  }
  doc.text(`${order.city}${order.state ? `, ${order.state}` : ""} ${order.postalCode || ""}`, margin, y);
  y += 4.5;
  doc.text(order.country, margin, y);
  y += 12;
  const colItem = margin + 4;
  const colSize = margin + 72;
  const colColor = margin + 88;
  const colQty = margin + 108;
  const colPrice = margin + 124;
  const colTotal = W - margin - 4;
  doc.setFillColor(...dark);
  doc.rect(margin, y, contentW, 9, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("ITEM", colItem, y + 6);
  doc.text("SIZE", colSize, y + 6);
  doc.text("COLOR", colColor, y + 6);
  doc.text("QTY", colQty, y + 6);
  doc.text("PRICE", colPrice, y + 6);
  doc.text("TOTAL", colTotal, y + 6, { align: "right" });
  y += 9;
  let items = [];
  try {
    items = typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];
  } catch {
  }
  items.forEach((item, i) => {
    const rowH = 10;
    if (i % 2 === 0) {
      doc.setFillColor(252, 252, 250);
      doc.rect(margin, y, contentW, rowH, "F");
    }
    doc.setTextColor(...dark);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const title = item.title?.length > 30 ? item.title.substring(0, 30) + "..." : item.title;
    doc.text(title || "Product", colItem, y + 7);
    doc.text(item.size || "—", colSize, y + 7);
    const colorText = (item.color || "—").length > 10 ? item.color.substring(0, 10) + ".." : item.color || "—";
    doc.text(colorText, colColor, y + 7);
    doc.text(String(item.qty), colQty, y + 7);
    doc.text(`$${Number(item.unitPrice).toFixed(2)}`, colPrice, y + 7);
    const lineTotal = (item.qty * item.unitPrice).toFixed(2);
    doc.setFont("helvetica", "bold");
    doc.text(`$${lineTotal}`, colTotal, y + 7, { align: "right" });
    y += rowH;
  });
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, W - margin, y);
  y += 6;
  const totalsX = margin + 110;
  const totalsValX = W - margin - 4;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...mid);
  doc.text("Subtotal", totalsX, y);
  doc.setTextColor(...dark);
  doc.text(`$${Number(order.subtotal).toFixed(2)}`, totalsValX, y, { align: "right" });
  y += 6;
  doc.setTextColor(...mid);
  doc.text("Shipping", totalsX, y);
  doc.setTextColor(...dark);
  doc.text(`$${Number(order.shippingCost).toFixed(2)}`, totalsValX, y, { align: "right" });
  y += 8;
  doc.setFillColor(...gold);
  doc.rect(totalsX - 4, y - 4, W - margin - totalsX + 8, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("TOTAL", totalsX, y + 4);
  doc.text(`$${Number(order.totalAmount).toFixed(2)}`, totalsValX, y + 4, { align: "right" });
  y += 24;
  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, W - margin, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...mid);
  doc.text("PAYMENT TERMS", margin, y);
  y += 4;
  doc.text("Payment is due upon receipt. For bank transfer orders, payment must be received within 7 days.", margin, y);
  y += 8;
  doc.text("BANK DETAILS", margin, y);
  y += 4;
  doc.text("Bank: [Your Bank Name]  |  Account: [Your Account Number]  |  SWIFT: [Your SWIFT Code]", margin, y);
  y += 8;
  doc.setTextColor(...gold);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("Thank you for your business!", margin, y);
  doc.setFillColor(...dark);
  doc.rect(0, 287, W, 10, "F");
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Pak Homies Industry  •  Sialkot Industrial Estate, Sialkot 51310, Punjab, Pakistan  •  www.pakhomiesind.com", W / 2, 293, { align: "center" });
  doc.save(`Invoice-${order.orderNumber}.pdf`);
  return true;
}
function AdminOrderDetail() {
  const [, params] = useRoute("/admin-saad/orders/:id");
  const orderId = parseInt(params?.id || "0", 10);
  const { data: order, isLoading } = trpc.order.getById.useQuery(
    { id: orderId },
    { enabled: orderId > 0 }
  );
  const utils = trpc.useUtils();
  const updateStatus = trpc.order.updateStatus.useMutation({
    onSuccess: () => {
      utils.order.getById.invalidate({ id: orderId });
      toast.success("Status updated");
    }
  });
  if (isLoading) {
    return /* @__PURE__ */ jsx(AdminLayout, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:257", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:258", className: "flex items-center justify-center py-24 text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Loader2, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:259", className: "w-6 h-6 animate-spin mr-2" }),
      " Loading order..."
    ] }) });
  }
  if (!order) {
    return /* @__PURE__ */ jsx(AdminLayout, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:267", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:268", className: "text-center py-24", children: [
      /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:269", className: "text-xl font-bold text-foreground mb-2", children: "Order not found" }),
      /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:270", href: "/admin-saad/orders", children: /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:271", variant: "outline", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:271", className: "w-4 h-4 mr-2" }),
        " Back to Orders"
      ] }) })
    ] }) });
  }
  let items = [];
  try {
    items = typeof order.items === "string" ? JSON.parse(order.items) : order.items || [];
  } catch {
  }
  return /* @__PURE__ */ jsx(AdminLayout, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:282", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:283", className: "max-w-5xl mx-auto space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:285", className: "flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:286", className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:287", href: "/admin-saad/orders", children: /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:288", variant: "ghost", size: "icon", className: "shrink-0", children: /* @__PURE__ */ jsx(ArrowLeft, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:289", className: "w-5 h-5" }) }) }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:292", children: [
          /* @__PURE__ */ jsxs("h1", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:293", className: "font-serif text-2xl font-bold text-foreground flex items-center gap-3", children: [
            "Order ",
            order.orderNumber,
            /* @__PURE__ */ jsx(Badge, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:295", className: `border text-xs ${STATUS_COLORS[order.status] ?? ""}`, children: order.status.charAt(0).toUpperCase() + order.status.slice(1) })
          ] }),
          /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:299", className: "text-sm text-muted-foreground mt-1 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Calendar, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:300", className: "w-3.5 h-3.5" }),
            new Date(order.createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
            " at ",
            new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:308", className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:309",
            variant: "outline",
            onClick: async () => {
              await generateInvoicePDF(order);
              toast.success("Invoice downloaded!");
            },
            children: [
              /* @__PURE__ */ jsx(Download, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:316", className: "w-4 h-4 mr-2" }),
              " Download Invoice"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Select,
          {
            "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:318",
            value: order.status,
            onValueChange: (v) => updateStatus.mutate({ id: order.id, status: v }),
            children: [
              /* @__PURE__ */ jsx(SelectTrigger, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:322", className: "w-[150px]", children: /* @__PURE__ */ jsx(SelectValue, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:322" }) }),
              /* @__PURE__ */ jsx(SelectContent, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:323", children: ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"].map((s) => /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:325", value: s, children: s.charAt(0).toUpperCase() + s.slice(1) }, s)) })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:333", className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:336", className: "lg:col-span-1 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:338", className: "bg-card border border-border rounded-xl p-6", children: [
          /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:339", className: "font-condensed font-bold uppercase tracking-wider text-sm text-muted-foreground mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(User, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:340", className: "w-4 h-4 text-gold" }),
            " Customer Information"
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:342", className: "space-y-3 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:343", className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx(User, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:344", className: "w-4 h-4 text-muted-foreground mt-0.5 shrink-0" }),
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:345", children: [
                /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:346", className: "font-semibold text-foreground", children: order.customerName }),
                order.companyName && /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:347", className: "text-muted-foreground text-xs", children: order.companyName })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:350", className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(Mail, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:351", className: "w-4 h-4 text-muted-foreground shrink-0" }),
              /* @__PURE__ */ jsx("a", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:352", href: `mailto:${order.customerEmail}`, className: "text-gold hover:underline", children: order.customerEmail })
            ] }),
            order.customerPhone && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:355", className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx(Phone, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:356", className: "w-4 h-4 text-muted-foreground shrink-0" }),
              /* @__PURE__ */ jsx("a", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:357", href: `tel:${order.customerPhone}`, className: "hover:underline", children: order.customerPhone })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:364", className: "bg-card border border-border rounded-xl p-6", children: [
          /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:365", className: "font-condensed font-bold uppercase tracking-wider text-sm text-muted-foreground mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(MapPin, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:366", className: "w-4 h-4 text-gold" }),
            " Shipping Address"
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:368", className: "text-sm space-y-1 text-foreground", children: [
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:369", children: order.addressLine1 }),
            order.addressLine2 && /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:370", children: order.addressLine2 }),
            /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:371", children: [
              order.city,
              order.state ? `, ${order.state}` : "",
              " ",
              order.postalCode
            ] }),
            /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:372", className: "font-semibold", children: [
              order.country,
              " (",
              order.countryCode,
              ")"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:377", className: "bg-card border border-border rounded-xl p-6", children: [
          /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:378", className: "font-condensed font-bold uppercase tracking-wider text-sm text-muted-foreground mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(CreditCard, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:379", className: "w-4 h-4 text-gold" }),
            " Payment"
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:381", className: "text-sm space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:382", className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:383", className: "text-muted-foreground", children: "Method" }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:384", className: "font-semibold text-foreground capitalize", children: order.paymentMethod || "Invoice" })
            ] }),
            order.stripeSessionId && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:387", className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:388", className: "text-muted-foreground", children: "Stripe Session" }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:389", className: "font-mono text-xs text-muted-foreground truncate max-w-[140px]", children: order.stripeSessionId })
            ] }),
            order.stripePaymentIntentId && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:393", className: "flex justify-between", children: [
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:394", className: "text-muted-foreground", children: "Payment Intent" }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:395", className: "font-mono text-xs text-muted-foreground truncate max-w-[140px]", children: order.stripePaymentIntentId })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:403", className: "lg:col-span-2 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:405", className: "bg-card border border-border rounded-xl overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:406", className: "px-6 py-4 border-b border-border", children: /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:407", className: "font-condensed font-bold uppercase tracking-wider text-sm text-muted-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Package, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:408", className: "w-4 h-4 text-gold" }),
            " Order Items (",
            items.length,
            ")"
          ] }) }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:411", className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:412", className: "w-full text-sm", children: [
            /* @__PURE__ */ jsx("thead", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:413", className: "bg-secondary/50 border-b border-border", children: /* @__PURE__ */ jsx("tr", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:414", children: ["Product", "Size", "Color", "Qty", "Unit Price", "Line Total"].map((h) => /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:416", className: "px-6 py-3 text-left font-condensed font-bold uppercase tracking-wider text-xs text-muted-foreground", children: h }, h)) }) }),
            /* @__PURE__ */ jsx("tbody", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:420", className: "divide-y divide-border", children: items.map((item, i) => /* @__PURE__ */ jsxs("tr", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:422", className: "hover:bg-secondary/20 transition-colors", children: [
              /* @__PURE__ */ jsxs("td", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:423", className: "px-6 py-4", children: [
                /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:424", className: "font-medium text-foreground", children: item.title }),
                /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:425", className: "text-xs text-muted-foreground mt-0.5", children: [
                  "Product #",
                  item.productId
                ] })
              ] }),
              /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:427", className: "px-6 py-4 text-foreground", children: item.size || "—" }),
              /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:428", className: "px-6 py-4 text-foreground", children: item.color || "—" }),
              /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:429", className: "px-6 py-4 font-semibold text-foreground", children: item.qty }),
              /* @__PURE__ */ jsxs("td", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:430", className: "px-6 py-4 font-mono text-foreground", children: [
                "$",
                Number(item.unitPrice).toFixed(2)
              ] }),
              /* @__PURE__ */ jsxs("td", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:431", className: "px-6 py-4 font-mono font-bold text-gold", children: [
                "$",
                (item.qty * item.unitPrice).toFixed(2)
              ] })
            ] }, i)) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:439", className: "border-t border-border px-6 py-5", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:440", className: "flex flex-col items-end gap-2 text-sm", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:441", className: "flex items-center gap-8", children: [
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:442", className: "text-muted-foreground", children: "Subtotal" }),
              /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:443", className: "font-mono w-24 text-right text-foreground", children: [
                "$",
                Number(order.subtotal).toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:445", className: "flex items-center gap-8", children: [
              /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:446", className: "text-muted-foreground flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Truck, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:446", className: "w-3.5 h-3.5" }),
                " Shipping"
              ] }),
              /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:447", className: "font-mono w-24 text-right text-foreground", children: [
                "$",
                Number(order.shippingCost).toFixed(2)
              ] })
            ] }),
            /* @__PURE__ */ jsx(Separator, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:449", className: "w-40 my-1" }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:450", className: "flex items-center gap-8", children: [
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:451", className: "font-condensed font-bold uppercase tracking-wider text-foreground", children: "Total" }),
              /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:452", className: "font-mono font-bold text-xl text-gold w-24 text-right", children: [
                "$",
                Number(order.totalAmount).toFixed(2)
              ] })
            ] })
          ] }) })
        ] }),
        order.notes && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:460", className: "bg-card border border-border rounded-xl p-6", children: [
          /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:461", className: "font-condensed font-bold uppercase tracking-wider text-sm text-muted-foreground mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(FileText, { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:462", className: "w-4 h-4 text-gold" }),
            " Notes"
          ] }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminOrderDetail.tsx:464", className: "text-sm text-foreground whitespace-pre-wrap", children: order.notes })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  AdminOrderDetail as default
};
