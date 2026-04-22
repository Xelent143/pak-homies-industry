import { jsxs, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-D0S_T65I.js";
import { t as trpc, B as Button } from "../entry-server.js";
import { useLocation } from "wouter";
import { I as Input, D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, L as Label, d as DialogFooter } from "./label-C2k6QFV2.js";
import { B as Badge } from "./badge-BLnXf9IA.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BlbuqoI-.js";
import { Plus, Search, Loader2, Image, Eye, Edit, Trash2, X, Save } from "lucide-react";
import { toast } from "sonner";
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
import "@radix-ui/react-select";
function AdminProducts() {
  const [, setLocation] = useLocation();
  const { data: products, isLoading, error } = trpc.product.adminList.useQuery();
  const { data: categories } = trpc.category.listWithSubs.useQuery();
  const utils = trpc.useUtils();
  const [searchTerm, setSearchTerm] = useState("");
  const [quickEditOpen, setQuickEditOpen] = useState(false);
  const [quickEditForm, setQuickEditForm] = useState(null);
  const deleteMutation = trpc.product.delete.useMutation({
    onSuccess: () => {
      utils.product.adminList.invalidate();
      toast.success("Product deleted");
    }
  });
  const toggleStatus = trpc.product.update.useMutation({
    onSuccess: () => {
      utils.product.adminList.invalidate();
      toast.success("Status updated");
    }
  });
  const quickUpdateMutation = trpc.product.update.useMutation({
    onSuccess: () => {
      utils.product.adminList.invalidate();
      toast.success("Product updated successfully");
      setQuickEditOpen(false);
      setQuickEditForm(null);
    },
    onError: (error2) => toast.error("Failed to update: " + error2.message)
  });
  const filtered = products?.filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase())) ?? [];
  const openQuickEdit = (product) => {
    setQuickEditForm({
      id: product.id,
      title: product.title,
      samplePrice: product.samplePrice || "",
      weight: product.weight || "",
      categoryId: product.categoryId || null,
      subcategoryId: product.subcategoryId || null
    });
    setQuickEditOpen(true);
  };
  const handleQuickUpdate = () => {
    if (!quickEditForm) return;
    quickUpdateMutation.mutate({
      id: quickEditForm.id,
      samplePrice: quickEditForm.samplePrice,
      weight: quickEditForm.weight,
      categoryId: quickEditForm.categoryId,
      subcategoryId: quickEditForm.subcategoryId
    });
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:79", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:80", className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:81", className: "flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:82", children: [
          /* @__PURE__ */ jsx("h1", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:83", className: "font-serif text-2xl font-bold text-foreground", children: "Products" }),
          /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:84", className: "text-sm text-muted-foreground mt-1", children: [
            products?.length || 0,
            " products in catalog"
          ] })
        ] }),
        /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:86", onClick: () => setLocation("/admin-saad/product/new"), className: "bg-gold text-black hover:bg-gold-light", children: [
          /* @__PURE__ */ jsx(Plus, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:87", className: "w-4 h-4 mr-2" }),
          " Add Product"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:91", className: "bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:92", className: "p-4 border-b border-border bg-secondary/30", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:93", className: "relative max-w-sm", children: [
          /* @__PURE__ */ jsx(Search, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:94", className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:95",
              placeholder: "Search products...",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "pl-9 bg-background h-9"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:104", className: "overflow-x-auto flex-1", children: /* @__PURE__ */ jsxs("table", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:105", className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:106", className: "bg-secondary/50 border-b border-border", children: /* @__PURE__ */ jsxs("tr", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:107", children: [
            /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:108", className: "px-6 py-3 text-left font-condensed font-bold uppercase tracking-wider text-xs text-muted-foreground", children: "Product" }),
            /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:109", className: "px-6 py-3 text-left font-condensed font-bold uppercase tracking-wider text-xs text-muted-foreground w-48", children: "Status" }),
            /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:110", className: "px-6 py-3 text-left font-condensed font-bold uppercase tracking-wider text-xs text-muted-foreground w-48", children: "Inventory" }),
            /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:111", className: "px-6 py-3 text-left font-condensed font-bold uppercase tracking-wider text-xs text-muted-foreground w-32", children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:114", className: "divide-y divide-border", children: isLoading ? /* @__PURE__ */ jsx("tr", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:116", children: /* @__PURE__ */ jsxs("td", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:117", colSpan: 4, className: "px-6 py-12 text-center text-muted-foreground", children: [
            /* @__PURE__ */ jsx(Loader2, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:118", className: "w-6 h-6 animate-spin mx-auto mb-2" }),
            "Loading products..."
          ] }) }) : error ? /* @__PURE__ */ jsx("tr", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:123", children: /* @__PURE__ */ jsxs("td", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:124", colSpan: 4, className: "px-6 py-12 text-center", children: [
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:125", className: "text-red-500 mb-2", children: "⚠️ Error loading products" }),
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:126", className: "text-sm text-muted-foreground", children: error.message }),
            /* @__PURE__ */ jsx(
              Button,
              {
                "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:127",
                variant: "outline",
                size: "sm",
                className: "mt-4",
                onClick: () => utils.product.adminList.invalidate(),
                children: "Try Again"
              }
            )
          ] }) }) : filtered.length === 0 ? /* @__PURE__ */ jsx("tr", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:138", children: /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:139", colSpan: 4, className: "px-6 py-12 text-center text-muted-foreground", children: "No products found. Add some to get started." }) }) : filtered.map((product) => /* @__PURE__ */ jsxs("tr", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:144", className: "hover:bg-secondary/20 transition-colors", children: [
            /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:145", className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:146", className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:147", className: "w-12 h-12 rounded-md bg-secondary border border-border overflow-hidden shrink-0 flex items-center justify-center", children: product.mainImage ? /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:149", src: product.mainImage, alt: product.title, className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(Image, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:151", className: "w-5 h-5 text-muted-foreground opacity-50" }) }),
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:154", children: [
                /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:155", className: "font-bold text-foreground hover:text-gold cursor-pointer transition-colors", onClick: () => setLocation(`/admin-saad/product/edit/${product.id}`), children: product.title }),
                /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:158", className: "text-xs text-muted-foreground mt-0.5", children: product.category })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxs("td", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:162", className: "px-6 py-4", children: [
              /* @__PURE__ */ jsx(
                Badge,
                {
                  "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:163",
                  variant: "outline",
                  className: `cursor-pointer transition-colors ${product.isActive ? "bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`,
                  onClick: () => toggleStatus.mutate({ id: product.id, isActive: !product.isActive, title: product.title, category: product.category, slug: product.slug }),
                  children: product.isActive ? "Active" : "Draft"
                }
              ),
              product.isFeatured && /* @__PURE__ */ jsx(Badge, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:171", variant: "outline", className: "ml-2 bg-gold/10 text-gold border-gold/20", children: "Featured" })
            ] }),
            /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:174", className: "px-6 py-4 text-muted-foreground", children: product.samplePrice ? `$${product.samplePrice}` : "Needs pricing" }),
            /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:177", className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:178", className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:179", size: "icon", variant: "ghost", onClick: () => window.open(`/shop/${product.slug}`, "_blank"), className: "h-8 w-8 text-muted-foreground hover:text-foreground", title: "View", children: /* @__PURE__ */ jsx(Eye, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:180", className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:182", size: "sm", variant: "ghost", onClick: () => openQuickEdit(product), className: "h-8 text-xs text-gold hover:text-gold hover:bg-gold/10", title: "Quick Edit", children: [
                /* @__PURE__ */ jsx(Edit, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:183", className: "w-3.5 h-3.5 mr-1" }),
                " Quick"
              ] }),
              /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:185", size: "icon", variant: "ghost", onClick: () => setLocation(`/admin-saad/product/edit/${product.id}`), className: "h-8 w-8 text-muted-foreground hover:text-gold", title: "Full Edit", children: /* @__PURE__ */ jsx(Edit, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:186", className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:188", size: "icon", variant: "ghost", onClick: () => {
                if (confirm("Delete product?")) deleteMutation.mutate({ id: product.id });
              }, className: "h-8 w-8 text-muted-foreground hover:text-destructive", title: "Delete", children: /* @__PURE__ */ jsx(Trash2, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:189", className: "w-4 h-4" }) })
            ] }) })
          ] }, product.id)) })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:202", open: quickEditOpen, onOpenChange: setQuickEditOpen, children: /* @__PURE__ */ jsxs(DialogContent, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:203", className: "max-w-md", children: [
      /* @__PURE__ */ jsx(DialogHeader, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:204", children: /* @__PURE__ */ jsxs(DialogTitle, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:205", className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(Edit, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:206", className: "w-5 h-5 text-gold" }),
        "Quick Edit Product"
      ] }) }),
      quickEditForm && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:212", className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:213", className: "bg-secondary/30 p-3 rounded-lg", children: /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:214", className: "font-medium text-sm", children: quickEditForm.title }) }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:217", className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:218", className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:219", className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Sample Price ($)" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:220",
                type: "number",
                step: "0.01",
                value: quickEditForm.samplePrice,
                onChange: (e) => setQuickEditForm((f) => f ? { ...f, samplePrice: e.target.value } : null),
                placeholder: "0.00"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:228", className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:229", className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Weight (kg)" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:230",
                type: "number",
                step: "0.001",
                value: quickEditForm.weight,
                onChange: (e) => setQuickEditForm((f) => f ? { ...f, weight: e.target.value } : null),
                placeholder: "0.000"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:240", className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:241", className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Category" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:242",
              value: quickEditForm.categoryId?.toString() || "",
              onValueChange: (v) => {
                const catId = parseInt(v);
                setQuickEditForm((f) => f ? { ...f, categoryId: catId, subcategoryId: null } : null);
              },
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:249", children: /* @__PURE__ */ jsx(SelectValue, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:250", placeholder: "Select category" }) }),
                /* @__PURE__ */ jsx(SelectContent, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:252", children: categories?.map((c) => /* @__PURE__ */ jsxs(SelectItem, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:254", value: c.id.toString(), children: [
                  c.icon,
                  " ",
                  c.name
                ] }, c.id)) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:262", className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:263", className: "text-xs uppercase tracking-wider text-muted-foreground", children: "Subcategory" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:264",
              value: quickEditForm.subcategoryId?.toString() || "",
              onValueChange: (v) => setQuickEditForm((f) => f ? { ...f, subcategoryId: parseInt(v) } : null),
              disabled: !quickEditForm.categoryId,
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:269", children: /* @__PURE__ */ jsx(SelectValue, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:270", placeholder: quickEditForm.categoryId ? "Select subcategory" : "Select category first" }) }),
                /* @__PURE__ */ jsx(SelectContent, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:272", children: categories?.find((c) => c.id === quickEditForm.categoryId)?.subcategories?.map((s) => /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:274", value: s.id.toString(), children: s.name }, s.id)) })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:284", children: [
        /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:285", variant: "outline", onClick: () => setQuickEditOpen(false), children: [
          /* @__PURE__ */ jsx(X, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:286", className: "w-4 h-4 mr-2" }),
          " Cancel"
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:288",
            onClick: handleQuickUpdate,
            disabled: quickUpdateMutation.isPending,
            className: "bg-gold text-black hover:bg-gold-light",
            children: [
              quickUpdateMutation.isPending ? /* @__PURE__ */ jsx(Loader2, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:294", className: "w-4 h-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(Save, { "data-loc": "client\\src\\pages\\admin\\AdminProducts.tsx:296", className: "w-4 h-4 mr-2" }),
              "Save Changes"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  AdminProducts as default
};
