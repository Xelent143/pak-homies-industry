import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-D0S_T65I.js";
import { t as trpc, B as Button } from "../entry-server.js";
import { toast } from "sonner";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, L as Label, I as Input, d as DialogFooter } from "./label-C2k6QFV2.js";
import { B as Badge } from "./badge-BLnXf9IA.js";
import { Plane, Plus, Loader2, Globe, Edit, Trash2 } from "lucide-react";
import "wouter";
import "@trpc/client";
import "./SEOHead-oEJRQGbs.js";
import "react-helmet-async";
import "@trpc/react-query";
import "@tanstack/react-query";
import "react-dom/server";
import "superjson";
import "next-themes";
import "@radix-ui/react-tooltip";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
function AdminSettings() {
  const utils = trpc.useUtils();
  const { data: zones, isLoading } = trpc.shipping.adminZones.useQuery();
  const [editZone, setEditZone] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const deleteMutation = trpc.shipping.deleteZone.useMutation({
    onSuccess: () => {
      utils.shipping.adminZones.invalidate();
      toast.success("Zone deleted");
    }
  });
  const createMutation = trpc.shipping.createZone.useMutation({
    onSuccess: () => {
      utils.shipping.adminZones.invalidate();
      toast.success("Zone created");
      setShowAdd(false);
    },
    onError: (e) => toast.error("Failed", { description: e.message })
  });
  trpc.shipping.updateZone.useMutation({
    onSuccess: () => {
      utils.shipping.adminZones.invalidate();
      toast.success("Zone updated");
      setEditZone(null);
    },
    onError: (e) => toast.error("Failed", { description: e.message })
  });
  const [newZone, setNewZone] = useState({
    zoneName: "",
    countries: "",
    baseRate: "0.00",
    perUnitRate: "0.00",
    perKgRate: "0.00",
    minDays: 7,
    maxDays: 21,
    currency: "USD",
    isActive: true
  });
  return /* @__PURE__ */ jsx(AdminLayout, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:39", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:40", className: "space-y-8", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:41", children: [
      /* @__PURE__ */ jsx("h1", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:42", className: "font-serif text-2xl font-bold text-foreground", children: "Settings" }),
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:43", className: "text-sm text-muted-foreground mt-1", children: "Manage global store configurations and shipping." })
    ] }),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:47", className: "bg-card border border-border rounded-xl shadow-sm overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:48", className: "bg-secondary/40 px-6 py-4 border-b border-border flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("h3", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:49", className: "font-serif text-lg font-bold text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Plane, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:50", className: "w-5 h-5 text-gold" }),
          "Shipping Zones"
        ] }),
        /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:53", size: "sm", onClick: () => setShowAdd(true), children: [
          /* @__PURE__ */ jsx(Plus, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:54", className: "w-4 h-4 mr-1" }),
          " Add Zone"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:58", className: "p-6", children: isLoading ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:60", className: "flex items-center justify-center gap-2 text-muted-foreground py-8", children: [
        /* @__PURE__ */ jsx(Loader2, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:61", className: "w-5 h-5 animate-spin" }),
        " Loading zones..."
      ] }) : (zones ?? []).length === 0 ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:64", className: "text-center py-12 text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Globe, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:65", className: "w-12 h-12 mx-auto mb-4 opacity-20" }),
        "No shipping zones defined. Customers cannot checkout without shipping zones."
      ] }) : /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:69", className: "space-y-3", children: (zones ?? []).map((zone) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:71", className: "flex items-center justify-between bg-background rounded-lg p-4 border border-border hover:border-gold/50 transition-colors", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:72", className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:73", className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:74", className: "font-bold text-foreground", children: zone.zoneName }),
            /* @__PURE__ */ jsx(Badge, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:75", variant: zone.isActive ? "default" : "secondary", children: zone.isActive ? "Active" : "Inactive" })
          ] }),
          /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:79", className: "text-sm text-muted-foreground mt-1", children: [
            "Base: $",
            zone.baseRate,
            " | ",
            zone.minDays,
            "–",
            zone.maxDays,
            " days | ",
            zone.currency
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:83", className: "flex gap-2", children: [
          /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:84", size: "icon", variant: "ghost", onClick: () => setEditZone(zone), children: /* @__PURE__ */ jsx(Edit, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:85", className: "w-4 h-4 text-muted-foreground hover:text-gold" }) }),
          /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:87", size: "icon", variant: "ghost", onClick: () => deleteMutation.mutate({ id: zone.id }), children: /* @__PURE__ */ jsx(Trash2, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:88", className: "w-4 h-4 text-muted-foreground hover:text-destructive" }) })
        ] })
      ] }, zone.id)) }) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:99", open: showAdd, onOpenChange: setShowAdd, children: /* @__PURE__ */ jsxs(DialogContent, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:100", className: "max-w-md", children: [
      /* @__PURE__ */ jsx(DialogHeader, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:101", children: /* @__PURE__ */ jsx(DialogTitle, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:102", children: "Add Shipping Zone" }) }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:104", className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:105", children: [
          /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:106", className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block", children: "Zone Name" }),
          /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:107", value: newZone.zoneName, onChange: (e) => setNewZone((z) => ({ ...z, zoneName: e.target.value })), placeholder: "North America" })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:109", children: [
          /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:110", className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block", children: "Countries (JSON array of ISO codes)" }),
          /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:111", value: newZone.countries, onChange: (e) => setNewZone((z) => ({ ...z, countries: e.target.value })), placeholder: '["US","CA","MX"]', className: "font-mono text-sm" })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:113", className: "grid grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:114", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:115", className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block", children: "Base Rate ($)" }),
            /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:116", value: newZone.baseRate, onChange: (e) => setNewZone((z) => ({ ...z, baseRate: e.target.value })) })
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:118", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:119", className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block", children: "Per Unit ($)" }),
            /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:120", value: newZone.perUnitRate, onChange: (e) => setNewZone((z) => ({ ...z, perUnitRate: e.target.value })) })
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:122", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:123", className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block", children: "Per Kg ($)" }),
            /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:124", value: newZone.perKgRate, onChange: (e) => setNewZone((z) => ({ ...z, perKgRate: e.target.value })) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:127", className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:128", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:129", className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block", children: "Min Days" }),
            /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:130", type: "number", value: newZone.minDays, onChange: (e) => setNewZone((z) => ({ ...z, minDays: parseInt(e.target.value) || 7 })) })
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:132", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:133", className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block", children: "Max Days" }),
            /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:134", type: "number", value: newZone.maxDays, onChange: (e) => setNewZone((z) => ({ ...z, maxDays: parseInt(e.target.value) || 21 })) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:138", children: [
        /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:139", variant: "outline", onClick: () => setShowAdd(false), children: "Cancel" }),
        /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:140", onClick: () => createMutation.mutate(newZone), disabled: createMutation.isPending, className: "bg-gold text-black hover:bg-gold-light", children: [
          createMutation.isPending && /* @__PURE__ */ jsx(Loader2, { "data-loc": "client\\src\\pages\\admin\\AdminSettings.tsx:141", className: "w-4 h-4 animate-spin mr-2" }),
          "Create Zone"
        ] })
      ] })
    ] }) })
  ] }) });
}
export {
  AdminSettings as default
};
