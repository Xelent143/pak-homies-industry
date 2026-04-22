import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-D0S_T65I.js";
import { t as trpc, B as Button } from "../entry-server.js";
import { toast } from "sonner";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, L as Label, I as Input, d as DialogFooter } from "./label-C2k6QFV2.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BlbuqoI-.js";
import { Plus, Loader2, Image, Trash2 } from "lucide-react";
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
import "@radix-ui/react-select";
const PORTFOLIO_CATEGORIES = [
  "Hunting Wear",
  "Sports Wear",
  "Ski Wear",
  "Tech Wear",
  "Streetwear",
  "Martial Arts Wear"
];
function AdminContent() {
  const utils = trpc.useUtils();
  const { data: portfolioItems, isLoading } = trpc.portfolio.adminList.useQuery();
  const [showAdd, setShowAdd] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({
    title: "",
    category: "Streetwear",
    imageUrl: "",
    clientName: "",
    dateCompleted: "",
    sortOrder: 0
  });
  const uploadMutation = trpc.portfolio.uploadImage.useMutation({
    onSuccess: (data) => {
      setForm((prev) => ({ ...prev, imageUrl: data.url || data.imageUrl }));
      toast.success("Image uploaded!");
    },
    onError: (e) => toast.error("Upload failed", { description: e.message })
  });
  const createMutation = trpc.portfolio.create.useMutation({
    onSuccess: () => {
      utils.portfolio.adminList.invalidate();
      toast.success("Portfolio item added");
      setShowAdd(false);
    }
  });
  const deleteMutation = trpc.portfolio.delete.useMutation({
    onSuccess: () => {
      utils.portfolio.adminList.invalidate();
      toast.success("Portfolio item deleted");
    }
  });
  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const imageBase64 = reader.result.split(",")[1];
      uploadMutation.mutate({ imageBase64, mimeType: file.type || "image/jpeg" });
    };
    reader.readAsDataURL(file);
  };
  return /* @__PURE__ */ jsx(AdminLayout, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:63", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:64", className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:65", className: "flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:66", children: [
        /* @__PURE__ */ jsx("h1", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:67", className: "font-serif text-2xl font-bold text-foreground", children: "Content & Portfolio" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:68", className: "text-sm text-muted-foreground mt-1", children: "Manage public portfolio showcases and assets." })
      ] }),
      /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:70", onClick: () => setShowAdd(true), className: "bg-gold text-black hover:bg-gold-light", children: [
        /* @__PURE__ */ jsx(Plus, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:71", className: "w-4 h-4 mr-2" }),
        " Add Portfolio Item"
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:77", className: "flex justify-center p-12", children: /* @__PURE__ */ jsx(Loader2, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:78", className: "w-6 h-6 animate-spin text-muted-foreground" }) }) : (portfolioItems ?? []).length === 0 ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:81", className: "text-center py-16 px-4 bg-card border border-border rounded-xl shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:82", className: "bg-secondary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(Image, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:83", className: "w-8 h-8 text-muted-foreground" }) }),
      /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:85", className: "text-lg font-bold text-foreground mb-1", children: "No portfolio items yet" }),
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:86", className: "text-muted-foreground text-sm max-w-sm mx-auto", children: "Showcase your best manufacturing work. Add items here to display them on the public portfolio page." })
    ] }) : /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:89", className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: (portfolioItems ?? []).map((item) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:91", className: "bg-card border border-border rounded-xl overflow-hidden group", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:92", className: "aspect-[4/3] bg-secondary relative", children: [
        /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:93", src: item.imageUrl, alt: item.title, className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:94", className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3", children: /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:95", size: "icon", variant: "destructive", className: "h-9 w-9 rounded-full", onClick: () => deleteMutation.mutate({ id: item.id }), children: /* @__PURE__ */ jsx(Trash2, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:96", className: "w-4 h-4" }) }) })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:100", className: "p-4", children: /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:101", className: "flex items-start justify-between", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:102", children: [
        /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:103", className: "font-bold text-foreground truncate", children: item.title }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:104", className: "text-sm text-muted-foreground", children: item.category })
      ] }) }) })
    ] }, item.id)) }),
    /* @__PURE__ */ jsx(Dialog, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:114", open: showAdd, onOpenChange: setShowAdd, children: /* @__PURE__ */ jsxs(DialogContent, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:115", className: "max-w-md", children: [
      /* @__PURE__ */ jsx(DialogHeader, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:116", children: /* @__PURE__ */ jsx(DialogTitle, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:117", children: "Add to Portfolio" }) }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:119", className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:120", children: [
          /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:121", className: "mb-1 block text-muted-foreground", children: "Title *" }),
          /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:122", value: form.title, onChange: (e) => setForm((f) => ({ ...f, title: e.target.value })), placeholder: "e.g. Custom BJJ Gi for Alpha Team" })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:124", children: [
          /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:125", className: "mb-1 block text-muted-foreground", children: "Category *" }),
          /* @__PURE__ */ jsxs(Select, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:126", value: form.category, onValueChange: (v) => setForm((f) => ({ ...f, category: v })), children: [
            /* @__PURE__ */ jsx(SelectTrigger, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:127", children: /* @__PURE__ */ jsx(SelectValue, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:127" }) }),
            /* @__PURE__ */ jsx(SelectContent, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:128", children: PORTFOLIO_CATEGORIES.map((c) => /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:129", value: c, children: c }, c)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:133", children: [
          /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:134", className: "mb-1 block text-muted-foreground", children: "Image *" }),
          form.imageUrl ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:136", className: "mt-2 relative rounded overflow-hidden shadow-sm aspect-video", children: [
            /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:137", src: form.imageUrl, alt: "Preview", className: "w-full h-full object-cover" }),
            /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:138", type: "button", size: "sm", variant: "destructive", className: "absolute top-2 right-2", onClick: () => setForm((f) => ({ ...f, imageUrl: "" })), children: "Clear" })
          ] }) : /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:143", className: "mt-2 flex items-center gap-3", children: [
            /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:144", type: "file", accept: "image/*", onChange: handleFile, disabled: uploadMutation.isPending }),
            uploadMutation.isPending && /* @__PURE__ */ jsx(Loader2, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:145", className: "w-5 h-5 animate-spin" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:150", children: [
        /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:151", variant: "outline", onClick: () => setShowAdd(false), children: "Cancel" }),
        /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:152", onClick: () => createMutation.mutate(form), disabled: !form.title || !form.imageUrl || createMutation.isPending, className: "bg-gold text-black hover:bg-gold-light", children: [
          createMutation.isPending && /* @__PURE__ */ jsx(Loader2, { "data-loc": "client\\src\\pages\\admin\\AdminContent.tsx:153", className: "w-4 h-4 animate-spin mr-2" }),
          "Publish Item"
        ] })
      ] })
    ] }) })
  ] }) });
}
export {
  AdminContent as default
};
