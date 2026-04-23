import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { useRoute, Link } from "wouter";
import { t as trpc, B as Button } from "../entry-server.js";
import { toast } from "sonner";
import { A as AdminLayout } from "./AdminLayout-D0S_T65I.js";
import { B as Badge } from "./badge-BLnXf9IA.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BlbuqoI-.js";
import { S as Separator } from "./separator-DGjjQRwf.js";
import { Loader2, ArrowLeft, Calendar, FileText, Wand2, BookOpen, User, Building2, Mail, Phone, Globe, Package, Ruler, Clock, DollarSign, MessageSquare, Save, Sparkles, Copy, Send, Plus, CheckCircle2, Trash2 } from "lucide-react";
import "@trpc/react-query";
import "@tanstack/react-query";
import "@trpc/client";
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
  new: "bg-amber-500/15 text-amber-500 border-amber-500/30",
  reviewed: "bg-blue-500/15 text-blue-500 border-blue-500/30",
  quoted: "bg-violet-500/15 text-violet-500 border-violet-500/30",
  closed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
};
function InfoRow({ icon: Icon, label, value, href, isGold }) {
  if (!value) return null;
  return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:27", className: "flex items-start gap-3 py-2.5", children: [
    /* @__PURE__ */ jsx(Icon, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:28", className: "w-4 h-4 text-muted-foreground mt-1 shrink-0" }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:29", className: "min-w-0", children: [
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:30", className: "text-[11px] uppercase tracking-wider text-muted-foreground font-medium", children: label }),
      href ? /* @__PURE__ */ jsx("a", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:32", href, className: "text-[15px] font-semibold text-gold hover:underline break-all", children: value }) : /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:34", className: `text-[15px] font-semibold ${isGold ? "text-gold" : "text-foreground"}`, children: value })
    ] })
  ] });
}
function AdminInquiryDetail() {
  const [, params] = useRoute("/admin-saad/inquiries/:id");
  const inquiryId = parseInt(params?.id || "0", 10);
  const { data: inquiry, isLoading } = trpc.rfq.getById.useQuery(
    { id: inquiryId },
    { enabled: inquiryId > 0 }
  );
  const utils = trpc.useUtils();
  const updateStatus = trpc.rfq.updateStatus.useMutation({
    onSuccess: () => {
      utils.rfq.getById.invalidate({ id: inquiryId });
      toast.success("Status updated");
    }
  });
  const addNote = trpc.rfq.addNote.useMutation({
    onSuccess: () => {
      utils.rfq.getById.invalidate({ id: inquiryId });
      setNoteText("");
      toast.success("Note added");
    }
  });
  const generateReply = trpc.rfq.generateAiReply.useMutation({
    onSuccess: (data) => {
      setAiReply(data.reply);
      toast.success("AI reply generated!");
    },
    onError: (err) => toast.error(err.message)
  });
  const { data: kbEntries } = trpc.rfq.getKnowledgeBase.useQuery();
  const addKb = trpc.rfq.addKnowledge.useMutation({
    onSuccess: () => {
      utils.rfq.getKnowledgeBase.invalidate();
      setKbTitle("");
      setKbContent("");
      setKbCategory("general");
      toast.success("Knowledge added");
    }
  });
  const deleteKb = trpc.rfq.deleteKnowledge.useMutation({
    onSuccess: () => {
      utils.rfq.getKnowledgeBase.invalidate();
      toast.success("Removed");
    }
  });
  const [noteText, setNoteText] = useState("");
  const [aiInstruction, setAiInstruction] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [showKbForm, setShowKbForm] = useState(false);
  const [kbTitle, setKbTitle] = useState("");
  const [kbContent, setKbContent] = useState("");
  const [kbCategory, setKbCategory] = useState("general");
  const [activeTab, setActiveTab] = useState("details");
  if (isLoading) {
    return /* @__PURE__ */ jsx(AdminLayout, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:98", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:99", className: "flex items-center justify-center py-24 text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Loader2, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:100", className: "w-6 h-6 animate-spin mr-2" }),
      " Loading inquiry..."
    ] }) });
  }
  if (!inquiry) {
    return /* @__PURE__ */ jsx(AdminLayout, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:108", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:109", className: "text-center py-24", children: [
      /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:110", className: "text-xl font-bold text-foreground mb-2", children: "Inquiry not found" }),
      /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:111", href: "/admin-saad/inquiries", children: /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:112", variant: "outline", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:112", className: "w-4 h-4 mr-2" }),
        " Back to Inquiries"
      ] }) })
    ] }) });
  }
  return /* @__PURE__ */ jsx(AdminLayout, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:120", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:121", className: "max-w-6xl mx-auto space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:123", className: "flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:124", className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:125", href: "/admin-saad/inquiries", children: /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:126", variant: "ghost", size: "icon", className: "shrink-0", children: /* @__PURE__ */ jsx(ArrowLeft, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:126", className: "w-5 h-5" }) }) }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:128", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:129", className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsx("h1", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:130", className: "text-2xl font-bold tracking-tight text-foreground", children: inquiry.companyName }),
            /* @__PURE__ */ jsx(Badge, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:133", className: `border text-[11px] font-bold ${STATUS_COLORS[inquiry.status]}`, children: inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1) })
          ] }),
          /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:137", className: "text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsx(Calendar, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:138", className: "w-3.5 h-3.5" }),
            new Date(inquiry.createdAt).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" }),
            " · ",
            inquiry.contactName,
            " · ",
            inquiry.email
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        Select,
        {
          "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:145",
          value: inquiry.status,
          onValueChange: (v) => updateStatus.mutate({ id: inquiry.id, status: v }),
          children: [
            /* @__PURE__ */ jsx(SelectTrigger, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:149", className: "w-[140px]", children: /* @__PURE__ */ jsx(SelectValue, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:149" }) }),
            /* @__PURE__ */ jsx(SelectContent, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:150", children: ["new", "reviewed", "quoted", "closed"].map((s) => /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:152", value: s, children: s.charAt(0).toUpperCase() + s.slice(1) }, s)) })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:159", className: "flex items-center gap-1 bg-card border border-border rounded-xl p-1", children: [
      { key: "details", label: "Inquiry Details", icon: FileText },
      { key: "ai", label: "AI Reply Assistant", icon: Wand2 },
      { key: "kb", label: "Knowledge Base", icon: BookOpen }
    ].map((tab) => /* @__PURE__ */ jsxs(
      "button",
      {
        "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:165",
        onClick: () => setActiveTab(tab.key),
        className: `flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex-1 justify-center
                ${activeTab === tab.key ? "bg-gold text-black shadow-sm" : "text-muted-foreground hover:text-foreground"}
              `,
        children: [
          /* @__PURE__ */ jsx(tab.icon, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:175", className: "w-4 h-4" }),
          " ",
          tab.label
        ]
      },
      tab.key
    )) }),
    activeTab === "details" && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:182", className: "grid grid-cols-1 lg:grid-cols-5 gap-5", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:185", className: "lg:col-span-3 space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:188", className: "bg-gold/5 border border-gold/15 rounded-2xl p-5 flex flex-wrap gap-x-10 gap-y-3", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:189", children: [
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:190", className: "text-[10px] uppercase tracking-widest text-gold/70 font-bold", children: "Product" }),
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:191", className: "text-lg font-bold text-foreground", children: inquiry.productType })
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:193", children: [
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:194", className: "text-[10px] uppercase tracking-widest text-gold/70 font-bold", children: "Quantity" }),
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:195", className: "text-lg font-bold text-foreground font-mono", children: inquiry.quantity })
          ] }),
          inquiry.timeline && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:198", children: [
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:199", className: "text-[10px] uppercase tracking-widest text-gold/70 font-bold", children: "Timeline" }),
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:200", className: "text-lg font-bold text-foreground", children: inquiry.timeline })
          ] }),
          inquiry.budget && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:204", children: [
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:205", className: "text-[10px] uppercase tracking-widest text-gold/70 font-bold", children: "Budget" }),
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:206", className: "text-lg font-bold text-foreground", children: inquiry.budget })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:212", className: "bg-card border border-border rounded-2xl p-5", children: [
          /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:213", className: "text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(User, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:214", className: "w-4 h-4 text-gold" }),
            " Contact"
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:216", className: "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0 divide-y sm:divide-y-0 divide-border/50", children: [
            /* @__PURE__ */ jsx(InfoRow, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:217", icon: User, label: "Name", value: inquiry.contactName }),
            /* @__PURE__ */ jsx(InfoRow, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:218", icon: Building2, label: "Company", value: inquiry.companyName }),
            /* @__PURE__ */ jsx(InfoRow, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:219", icon: Mail, label: "Email", value: inquiry.email, href: `mailto:${inquiry.email}`, isGold: true }),
            /* @__PURE__ */ jsx(InfoRow, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:220", icon: Phone, label: "Phone", value: inquiry.phone || "", href: inquiry.phone ? `tel:${inquiry.phone}` : void 0 }),
            /* @__PURE__ */ jsx(InfoRow, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:221", icon: Globe, label: "Country", value: inquiry.country || "" }),
            /* @__PURE__ */ jsx(InfoRow, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:222", icon: Globe, label: "Website", value: inquiry.website || "", href: inquiry.website || void 0, isGold: true })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:227", className: "bg-card border border-border rounded-2xl p-5", children: [
          /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:228", className: "text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Package, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:229", className: "w-4 h-4 text-gold" }),
            " Requirements"
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:231", className: "grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0", children: [
            /* @__PURE__ */ jsx(InfoRow, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:232", icon: Package, label: "Product Type", value: inquiry.productType }),
            /* @__PURE__ */ jsx(InfoRow, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:233", icon: Ruler, label: "Quantity", value: inquiry.quantity }),
            /* @__PURE__ */ jsx(InfoRow, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:234", icon: FileText, label: "Customization", value: inquiry.customization || "" }),
            /* @__PURE__ */ jsx(InfoRow, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:235", icon: FileText, label: "Fabric", value: inquiry.fabricPreference || "" }),
            /* @__PURE__ */ jsx(InfoRow, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:236", icon: Clock, label: "Timeline", value: inquiry.timeline || "" }),
            /* @__PURE__ */ jsx(InfoRow, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:237", icon: DollarSign, label: "Budget", value: inquiry.budget || "" })
          ] }),
          inquiry.additionalNotes && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:241", className: "mt-3 pt-3 border-t border-border/50", children: [
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:242", className: "text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-1.5", children: "Additional Notes" }),
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:243", className: "text-[14px] text-foreground whitespace-pre-wrap leading-relaxed bg-secondary/20 rounded-lg p-3", children: inquiry.additionalNotes })
          ] }),
          inquiry.designImageUrl && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:248", className: "mt-3 pt-3 border-t border-border/50", children: [
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:249", className: "text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-2", children: "Design Reference" }),
            /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:250", src: inquiry.designImageUrl, alt: "Design", className: "rounded-lg max-w-sm border border-border" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:257", className: "lg:col-span-2", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:258", className: "bg-card border border-border rounded-2xl p-5 sticky top-[76px]", children: [
        /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:259", className: "text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(MessageSquare, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:260", className: "w-4 h-4 text-gold" }),
          " Notes & Activity"
        ] }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:263",
            value: noteText,
            onChange: (e) => setNoteText(e.target.value),
            placeholder: "Add a note...",
            className: "w-full bg-secondary/30 border border-border rounded-lg px-3 py-2.5 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-gold/30"
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:269",
            size: "sm",
            className: "mt-2 bg-gold hover:bg-gold/90 text-black font-bold text-xs",
            disabled: !noteText.trim(),
            onClick: () => addNote.mutate({ rfqId: inquiry.id, content: noteText }),
            children: [
              /* @__PURE__ */ jsx(Save, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:275", className: "w-3 h-3 mr-1.5" }),
              " Save Note"
            ]
          }
        ),
        /* @__PURE__ */ jsx(Separator, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:278", className: "my-4" }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:280", className: "space-y-3 max-h-[500px] overflow-y-auto pr-1", children: (inquiry.notes ?? []).length === 0 ? /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:282", className: "text-xs text-muted-foreground text-center py-6", children: "No notes yet" }) : (inquiry.notes ?? []).map((note) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:285", className: `p-3 rounded-lg text-sm ${note.isAiGenerated ? "bg-violet-500/5 border border-violet-500/20" : "bg-secondary/20 border border-border/50"}`, children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:286", className: "flex items-center gap-2 mb-1.5", children: [
            note.isAiGenerated ? /* @__PURE__ */ jsxs(Badge, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:288", className: "text-[9px] bg-violet-500/15 text-violet-400 border-violet-500/30", children: [
              /* @__PURE__ */ jsx(Sparkles, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:289", className: "w-2.5 h-2.5 mr-1" }),
              " AI"
            ] }) : /* @__PURE__ */ jsx(Badge, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:292", className: "text-[9px] bg-secondary text-muted-foreground border-border", children: "Note" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:294", className: "text-[10px] text-muted-foreground ml-auto", children: new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) })
          ] }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:298", className: "text-foreground whitespace-pre-wrap leading-relaxed text-[13px]", children: note.content })
        ] }, note.id)) })
      ] }) })
    ] }),
    activeTab === "ai" && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:310", className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:311", className: "bg-card border border-border rounded-2xl p-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:312", className: "text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Wand2, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:313", className: "w-4 h-4 text-gold" }),
          " Generate Reply"
        ] }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:315", className: "text-sm text-muted-foreground", children: "Tell the AI what kind of reply you want. It uses your product catalog + knowledge base." }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:319", className: "flex flex-wrap gap-2", children: [
          "Write a professional quote reply with pricing",
          "Request more details about their requirements",
          "Send a follow-up email checking in",
          "Write a thank you and next steps email"
        ].map((suggestion) => /* @__PURE__ */ jsx(
          "button",
          {
            "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:326",
            onClick: () => setAiInstruction(suggestion),
            className: "text-[11px] px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-muted-foreground hover:text-foreground hover:border-gold/30 transition-all",
            children: suggestion
          },
          suggestion
        )) }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:336",
            value: aiInstruction,
            onChange: (e) => setAiInstruction(e.target.value),
            placeholder: "e.g., Write a professional quote reply with pricing for 500 units...",
            className: "w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-sm resize-none h-28 focus:outline-none focus:ring-2 focus:ring-gold/30"
          }
        ),
        /* @__PURE__ */ jsx(
          Button,
          {
            "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:342",
            className: "w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold",
            disabled: !aiInstruction.trim() || generateReply.isPending,
            onClick: () => generateReply.mutate({ rfqId: inquiry.id, instruction: aiInstruction }),
            children: generateReply.isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Loader2, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:348", className: "w-4 h-4 mr-2 animate-spin" }),
              " Generating..."
            ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx(Sparkles, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:350", className: "w-4 h-4 mr-2" }),
              " Generate Reply"
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:355", className: "bg-card border border-border rounded-2xl p-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:356", className: "text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Mail, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:357", className: "w-4 h-4 text-gold" }),
          " Reply Preview"
        ] }),
        aiReply ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:362", className: "bg-secondary/20 border border-border rounded-lg p-4 max-h-[400px] overflow-y-auto", children: /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:363", className: "text-sm text-foreground whitespace-pre-wrap leading-relaxed", children: aiReply }) }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:365", className: "flex items-center gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxs(
              Button,
              {
                "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:366",
                variant: "outline",
                size: "sm",
                className: "text-xs",
                onClick: () => {
                  navigator.clipboard.writeText(aiReply);
                  toast.success("Copied to clipboard!");
                },
                children: [
                  /* @__PURE__ */ jsx(Copy, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:375", className: "w-3.5 h-3.5 mr-1.5" }),
                  " Copy"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              Button,
              {
                "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:377",
                size: "sm",
                className: "text-xs bg-gold hover:bg-gold/90 text-black font-bold",
                onClick: () => {
                  addNote.mutate({ rfqId: inquiry.id, content: aiReply, isAiGenerated: true });
                },
                children: [
                  /* @__PURE__ */ jsx(Save, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:384", className: "w-3.5 h-3.5 mr-1.5" }),
                  " Save as Note"
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:386",
                href: `mailto:${inquiry.email}?subject=Re: Quote Request - ${inquiry.productType}&body=${encodeURIComponent(aiReply)}`,
                className: "inline-flex",
                children: /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:390", size: "sm", variant: "outline", className: "text-xs", children: [
                  /* @__PURE__ */ jsx(Send, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:391", className: "w-3.5 h-3.5 mr-1.5" }),
                  " Open in Email"
                ] })
              }
            )
          ] })
        ] }) : /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:397", className: "text-center py-16 text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Sparkles, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:398", className: "w-10 h-10 mx-auto mb-3 opacity-20" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:399", className: "text-sm", children: "AI reply will appear here after generation" })
        ] })
      ] })
    ] }),
    activeTab === "kb" && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:408", className: "space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:409", className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:410", children: [
          /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:411", className: "text-lg font-bold text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(BookOpen, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:412", className: "w-5 h-5 text-gold" }),
            " Knowledge Base"
          ] }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:414", className: "text-sm text-muted-foreground mt-0.5", children: "Custom information the AI references when generating replies. Product catalog is included automatically." })
        ] }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:418",
            size: "sm",
            className: "bg-gold hover:bg-gold/90 text-black font-bold text-xs",
            onClick: () => setShowKbForm(!showKbForm),
            children: [
              /* @__PURE__ */ jsx(Plus, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:423", className: "w-3.5 h-3.5 mr-1" }),
              " Add Entry"
            ]
          }
        )
      ] }),
      showKbForm && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:428", className: "bg-card border border-gold/20 rounded-2xl p-5 space-y-3", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:429",
            value: kbTitle,
            onChange: (e) => setKbTitle(e.target.value),
            placeholder: "Title (e.g., Shipping Policy, Lead Times)",
            className: "w-full bg-secondary/30 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
          }
        ),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:435",
            value: kbContent,
            onChange: (e) => setKbContent(e.target.value),
            placeholder: "Content the AI should know about...",
            className: "w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-gold/30"
          }
        ),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:441", className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxs(Select, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:442", value: kbCategory, onValueChange: setKbCategory, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:443", className: "w-[160px]", children: /* @__PURE__ */ jsx(SelectValue, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:443" }) }),
            /* @__PURE__ */ jsx(SelectContent, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:444", children: ["general", "pricing", "shipping", "production", "quality", "policies"].map((c) => /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:446", value: c, children: c.charAt(0).toUpperCase() + c.slice(1) }, c)) })
          ] }),
          /* @__PURE__ */ jsxs(
            Button,
            {
              "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:450",
              size: "sm",
              className: "bg-gold hover:bg-gold/90 text-black font-bold text-xs",
              disabled: !kbTitle.trim() || !kbContent.trim(),
              onClick: () => addKb.mutate({ title: kbTitle, content: kbContent, category: kbCategory }),
              children: [
                /* @__PURE__ */ jsx(CheckCircle2, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:456", className: "w-3.5 h-3.5 mr-1" }),
                " Save"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:462", className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: (kbEntries ?? []).length === 0 ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:464", className: "col-span-2 text-center py-16 text-muted-foreground bg-card border border-border rounded-2xl", children: [
        /* @__PURE__ */ jsx(BookOpen, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:465", className: "w-10 h-10 mx-auto mb-3 opacity-20" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:466", className: "text-sm", children: "No knowledge base entries yet." })
      ] }) : (kbEntries ?? []).map((entry) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:470", className: "bg-card border border-border rounded-2xl p-5 group hover:border-gold/20 transition-colors", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:471", className: "flex items-start justify-between mb-2", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:472", children: [
            /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:473", className: "font-semibold text-sm text-foreground", children: entry.title }),
            /* @__PURE__ */ jsx(Badge, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:474", className: "text-[9px] mt-1 bg-secondary text-muted-foreground border-border", children: entry.category })
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:478",
              variant: "ghost",
              size: "icon",
              className: "w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-500 hover:bg-red-500/10",
              onClick: () => deleteKb.mutate({ id: entry.id }),
              children: /* @__PURE__ */ jsx(Trash2, { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:484", className: "w-3.5 h-3.5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminInquiryDetail.tsx:487", className: "text-xs text-muted-foreground leading-relaxed line-clamp-4", children: entry.content })
      ] }, entry.id)) })
    ] })
  ] }) });
}
export {
  AdminInquiryDetail as default
};
