import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2, RefreshCw, Save, Wand2, Clock3, Bot, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { A as AdminLayout } from "./AdminLayout-D0S_T65I.js";
import { c as cn, t as trpc, B as Button } from "../entry-server.js";
import { L as Label, I as Input } from "./label-C2k6QFV2.js";
import { T as Textarea } from "./textarea-DNjmcxjP.js";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { B as Badge } from "./badge-BLnXf9IA.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BlbuqoI-.js";
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
function Switch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SwitchPrimitive.Root,
    {
      "data-loc": "client\\src\\components\\ui\\switch.tsx:11",
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        SwitchPrimitive.Thumb,
        {
          "data-loc": "client\\src\\components\\ui\\switch.tsx:19",
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
const DEFAULT_FORM = {
  isEnabled: false,
  runEveryMinutes: 60,
  maxSourcesPerRun: 1,
  geminiRequestsPerMinuteLimit: 8,
  geminiRequestsPerDayLimit: 100,
  defaultCategoryId: null,
  defaultSubcategoryId: null,
  defaultCategoryLabel: null,
  savedModelId: null,
  defaultPrompt: "Place the extracted garment on the model naturally."
};
function formatDate(value) {
  if (!value) return "Never";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Never";
  return date.toLocaleString();
}
function statusTone(status) {
  switch (status) {
    case "draft_created":
      return "bg-green-500/10 text-green-600 border-green-500/30";
    case "processing":
      return "bg-blue-500/10 text-blue-600 border-blue-500/30";
    case "failed":
      return "bg-red-500/10 text-red-600 border-red-500/30";
    default:
      return "bg-secondary text-muted-foreground border-border";
  }
}
function AdminProductAutomation() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const { data: settingsData, isLoading: settingsLoading } = trpc.productAutomation.settings.useQuery();
  const { data: queue, isLoading: queueLoading } = trpc.productAutomation.listSources.useQuery();
  const { data: categories } = trpc.category.listWithSubs.useQuery();
  const { data: savedModels } = trpc.aiAgent.getSavedModels.useQuery();
  const [form, setForm] = useState(DEFAULT_FORM);
  const [bulkLinks, setBulkLinks] = useState("");
  useEffect(() => {
    if (settingsData?.settings) {
      setForm({
        isEnabled: !!settingsData.settings.isEnabled,
        runEveryMinutes: settingsData.settings.runEveryMinutes ?? 60,
        maxSourcesPerRun: settingsData.settings.maxSourcesPerRun ?? 1,
        geminiRequestsPerMinuteLimit: settingsData.settings.geminiRequestsPerMinuteLimit ?? 8,
        geminiRequestsPerDayLimit: settingsData.settings.geminiRequestsPerDayLimit ?? 100,
        defaultCategoryId: settingsData.settings.defaultCategoryId ?? null,
        defaultSubcategoryId: settingsData.settings.defaultSubcategoryId ?? null,
        defaultCategoryLabel: settingsData.settings.defaultCategoryLabel ?? null,
        savedModelId: settingsData.settings.savedModelId ?? null,
        defaultPrompt: settingsData.settings.defaultPrompt || DEFAULT_FORM.defaultPrompt
      });
    }
  }, [settingsData]);
  const selectedCategory = categories?.find((category) => category.id === form.defaultCategoryId) ?? null;
  const requestsPerSource = settingsData?.requestsPerSource ?? 6;
  const estimatedDraftsPerMinute = Math.floor(form.geminiRequestsPerMinuteLimit / requestsPerSource);
  const estimatedDraftsPerDay = Math.floor(form.geminiRequestsPerDayLimit / requestsPerSource);
  const saveSettingsMutation = trpc.productAutomation.saveSettings.useMutation({
    onSuccess: () => {
      utils.productAutomation.settings.invalidate();
      toast.success("Automation settings saved.");
    },
    onError: (error) => toast.error(error.message)
  });
  const enqueueMutation = trpc.productAutomation.enqueue.useMutation({
    onSuccess: (result) => {
      utils.productAutomation.listSources.invalidate();
      setBulkLinks("");
      toast.success(`Queued ${result.added} new source links.`, {
        description: result.skipped > 0 ? `${result.skipped} duplicate links were skipped.` : void 0
      });
    },
    onError: (error) => toast.error(error.message)
  });
  const runNowMutation = trpc.productAutomation.runNow.useMutation({
    onSuccess: (result) => {
      utils.productAutomation.listSources.invalidate();
      utils.productAutomation.settings.invalidate();
      utils.product.adminList.invalidate();
      toast.success(result.message);
      if (result.started) {
        window.setTimeout(() => {
          utils.productAutomation.listSources.invalidate();
          utils.productAutomation.settings.invalidate();
          utils.product.adminList.invalidate();
        }, 5e3);
        window.setTimeout(() => {
          utils.productAutomation.listSources.invalidate();
          utils.productAutomation.settings.invalidate();
          utils.product.adminList.invalidate();
        }, 15e3);
      }
    },
    onError: (error) => toast.error(error.message)
  });
  const retryMutation = trpc.productAutomation.retrySource.useMutation({
    onSuccess: () => {
      utils.productAutomation.listSources.invalidate();
      toast.success("Source moved back to the queue.");
    },
    onError: (error) => toast.error(error.message)
  });
  const deleteMutation = trpc.productAutomation.deleteSource.useMutation({
    onSuccess: () => {
      utils.productAutomation.listSources.invalidate();
      toast.success("Queue item removed.");
    },
    onError: (error) => toast.error(error.message)
  });
  const handleSaveSettings = () => {
    if (form.isEnabled && !form.savedModelId) {
      toast.error("Choose a saved model before enabling the automation.");
      return;
    }
    saveSettingsMutation.mutate({
      ...form,
      defaultCategoryLabel: selectedCategory?.name ?? form.defaultCategoryLabel ?? null
    });
  };
  const handleQueueLinks = () => {
    const urls = Array.from(new Set(
      bulkLinks.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
    ));
    if (urls.length === 0) {
      toast.error("Paste at least one product URL.");
      return;
    }
    enqueueMutation.mutate({
      urls,
      categoryId: form.defaultCategoryId,
      subcategoryId: form.defaultSubcategoryId,
      categoryLabel: selectedCategory?.name ?? null,
      promptOverride: null
    });
  };
  return /* @__PURE__ */ jsx(AdminLayout, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:197", children: /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:198", className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:199", className: "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:200", children: [
        /* @__PURE__ */ jsx("h1", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:201", className: "font-serif text-2xl font-bold text-foreground", children: "Product Automation" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:202", className: "text-sm text-muted-foreground mt-1", children: "Queue product links, let Gemini build draft listings on a schedule, and review them before going live." })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:207", className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxs(
          Button,
          {
            "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:208",
            variant: "outline",
            onClick: () => runNowMutation.mutate(),
            disabled: runNowMutation.isPending || settingsLoading,
            children: [
              runNowMutation.isPending ? /* @__PURE__ */ jsx(Loader2, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:213", className: "w-4 h-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(RefreshCw, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:213", className: "w-4 h-4 mr-2" }),
              "Run Now"
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:216",
            onClick: handleSaveSettings,
            disabled: saveSettingsMutation.isPending || settingsLoading,
            className: "bg-gold text-black hover:bg-gold-light",
            children: [
              saveSettingsMutation.isPending ? /* @__PURE__ */ jsx(Loader2, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:221", className: "w-4 h-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(Save, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:221", className: "w-4 h-4 mr-2" }),
              "Save Settings"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:227", className: "grid gap-4 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:228", className: "rounded-xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:229", className: "flex items-center gap-2 text-sm font-semibold text-foreground", children: [
          /* @__PURE__ */ jsx(Wand2, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:230", className: "w-4 h-4 text-gold" }),
          "Gemini Budget"
        ] }),
        /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:233", className: "mt-2 text-2xl font-bold text-foreground", children: requestsPerSource }),
        /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:234", className: "text-xs text-muted-foreground", children: "Reserved Gemini requests per queued product draft." })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:236", className: "rounded-xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:237", className: "flex items-center gap-2 text-sm font-semibold text-foreground", children: [
          /* @__PURE__ */ jsx(Clock3, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:238", className: "w-4 h-4 text-gold" }),
          "Throughput / Minute"
        ] }),
        /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:241", className: "mt-2 text-2xl font-bold text-foreground", children: estimatedDraftsPerMinute }),
        /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:242", className: "text-xs text-muted-foreground", children: "Based on your current requests-per-minute ceiling." })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:244", className: "rounded-xl border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:245", className: "flex items-center gap-2 text-sm font-semibold text-foreground", children: [
          /* @__PURE__ */ jsx(Bot, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:246", className: "w-4 h-4 text-gold" }),
          "Throughput / Day"
        ] }),
        /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:249", className: "mt-2 text-2xl font-bold text-foreground", children: estimatedDraftsPerDay }),
        /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:250", className: "text-xs text-muted-foreground", children: "Approximate daily draft capacity before the worker pauses." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:254", className: "grid gap-6 xl:grid-cols-[1.15fr_0.85fr]", children: [
      /* @__PURE__ */ jsxs("section", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:255", className: "rounded-2xl border border-border bg-card p-6 space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:256", className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:257", children: [
            /* @__PURE__ */ jsx("h2", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:258", className: "font-condensed text-lg font-bold uppercase tracking-wider text-foreground", children: "Automation Settings" }),
            /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:259", className: "text-sm text-muted-foreground mt-1", children: "Semi-automatic mode creates draft products only. Nothing goes live until you review it in Products." })
          ] }),
          /* @__PURE__ */ jsx(Badge, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:263", className: form.isEnabled ? "bg-green-500/10 text-green-600 border-green-500/30" : "bg-secondary text-muted-foreground border-border", children: form.isEnabled ? "Enabled" : "Paused" })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:268", className: "flex items-center justify-between rounded-xl border border-border bg-secondary/20 px-4 py-3", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:269", children: [
            /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:270", className: "text-sm font-medium text-foreground", children: "Scheduler status" }),
            /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:271", className: "text-xs text-muted-foreground", children: "The worker checks the queue in the background and creates inactive drafts." })
          ] }),
          /* @__PURE__ */ jsx(
            Switch,
            {
              "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:273",
              checked: form.isEnabled,
              onCheckedChange: (checked) => setForm((prev) => ({ ...prev, isEnabled: checked }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:279", className: "grid gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:280", className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:281", children: "Run Every (Minutes)" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:282",
                type: "number",
                min: 1,
                value: form.runEveryMinutes,
                onChange: (event) => setForm((prev) => ({ ...prev, runEveryMinutes: Number(event.target.value) || 1 }))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:289", className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:290", children: "Queue Items Per Run" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:291",
                type: "number",
                min: 1,
                value: form.maxSourcesPerRun,
                onChange: (event) => setForm((prev) => ({ ...prev, maxSourcesPerRun: Number(event.target.value) || 1 }))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:298", className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:299", children: "Gemini Requests / Minute" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:300",
                type: "number",
                min: requestsPerSource,
                value: form.geminiRequestsPerMinuteLimit,
                onChange: (event) => setForm((prev) => ({ ...prev, geminiRequestsPerMinuteLimit: Number(event.target.value) || requestsPerSource }))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:307", className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:308", children: "Gemini Requests / Day" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:309",
                type: "number",
                min: requestsPerSource,
                value: form.geminiRequestsPerDayLimit,
                onChange: (event) => setForm((prev) => ({ ...prev, geminiRequestsPerDayLimit: Number(event.target.value) || requestsPerSource }))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:318", className: "grid gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:319", className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:320", children: "Saved Model" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:321",
                value: form.savedModelId ? String(form.savedModelId) : "none",
                onValueChange: (value) => setForm((prev) => ({ ...prev, savedModelId: value === "none" ? null : Number(value) })),
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:325", children: /* @__PURE__ */ jsx(SelectValue, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:326", placeholder: "Choose a saved model" }) }),
                  /* @__PURE__ */ jsxs(SelectContent, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:328", children: [
                    /* @__PURE__ */ jsx(SelectItem, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:329", value: "none", children: "No model selected" }),
                    (savedModels?.models ?? []).map((model) => /* @__PURE__ */ jsx(SelectItem, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:331", value: String(model.id), children: model.name || `Model #${model.id}` }, model.id))
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:339", className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:340", children: "Default Category" }),
            /* @__PURE__ */ jsxs(
              Select,
              {
                "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:341",
                value: form.defaultCategoryId ? String(form.defaultCategoryId) : "none",
                onValueChange: (value) => {
                  const categoryId = value === "none" ? null : Number(value);
                  const category = categories?.find((item) => item.id === categoryId) ?? null;
                  setForm((prev) => ({
                    ...prev,
                    defaultCategoryId: categoryId,
                    defaultSubcategoryId: null,
                    defaultCategoryLabel: category?.name ?? null
                  }));
                },
                children: [
                  /* @__PURE__ */ jsx(SelectTrigger, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:354", children: /* @__PURE__ */ jsx(SelectValue, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:355", placeholder: "Select category" }) }),
                  /* @__PURE__ */ jsxs(SelectContent, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:357", children: [
                    /* @__PURE__ */ jsx(SelectItem, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:358", value: "none", children: "No forced category" }),
                    (categories ?? []).map((category) => /* @__PURE__ */ jsx(SelectItem, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:360", value: String(category.id), children: category.name }, category.id))
                  ] })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:369", className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:370", children: "Default Subcategory" }),
          /* @__PURE__ */ jsxs(
            Select,
            {
              "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:371",
              value: form.defaultSubcategoryId ? String(form.defaultSubcategoryId) : "none",
              onValueChange: (value) => setForm((prev) => ({
                ...prev,
                defaultSubcategoryId: value === "none" ? null : Number(value)
              })),
              disabled: !selectedCategory,
              children: [
                /* @__PURE__ */ jsx(SelectTrigger, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:379", children: /* @__PURE__ */ jsx(SelectValue, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:380", placeholder: selectedCategory ? "Select subcategory" : "Pick a category first" }) }),
                /* @__PURE__ */ jsxs(SelectContent, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:382", children: [
                  /* @__PURE__ */ jsx(SelectItem, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:383", value: "none", children: "No forced subcategory" }),
                  (selectedCategory?.subcategories ?? []).map((subcategory) => /* @__PURE__ */ jsx(SelectItem, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:385", value: String(subcategory.id), children: subcategory.name }, subcategory.id))
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:393", className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:394", children: "Default Try-On Prompt" }),
          /* @__PURE__ */ jsx(
            Textarea,
            {
              "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:395",
              rows: 4,
              value: form.defaultPrompt,
              onChange: (event) => setForm((prev) => ({ ...prev, defaultPrompt: event.target.value })),
              placeholder: "Tell the worker how garments should be placed on the saved model."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:403", className: "rounded-xl border border-dashed border-gold/30 bg-gold/5 p-4 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:404", className: "font-medium text-foreground mb-1", children: "Current behavior" }),
          /* @__PURE__ */ jsxs("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:405", children: [
            "Each queued source reserves about ",
            requestsPerSource,
            " Gemini requests: multiple try-on views plus listing analysis. Infographic generation is intentionally skipped here to keep your request budget predictable."
          ] }),
          /* @__PURE__ */ jsxs("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:409", className: "mt-2", children: [
            "Last run: ",
            /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:410", className: "text-foreground", children: formatDate(settingsData?.settings?.lastRunAt) })
          ] }),
          /* @__PURE__ */ jsxs("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:412", className: "mt-1", children: [
            "Summary: ",
            /* @__PURE__ */ jsx("span", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:413", className: "text-foreground", children: settingsData?.settings?.lastRunSummary || "No runs yet." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:418", className: "rounded-2xl border border-border bg-card p-6 space-y-5", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:419", children: [
          /* @__PURE__ */ jsx("h2", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:420", className: "font-condensed text-lg font-bold uppercase tracking-wider text-foreground", children: "Queue Product Links" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:421", className: "text-sm text-muted-foreground mt-1", children: "Paste one product URL per line. New drafts will appear in the Products area as inactive items for review." })
        ] }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:426",
            rows: 10,
            value: bulkLinks,
            onChange: (event) => setBulkLinks(event.target.value),
            placeholder: "https://example.com/product-1\nhttps://example.com/product-2\nhttps://example.com/product-3"
          }
        ),
        /* @__PURE__ */ jsxs(
          Button,
          {
            "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:433",
            onClick: handleQueueLinks,
            disabled: enqueueMutation.isPending,
            className: "w-full bg-gold text-black hover:bg-gold-light",
            children: [
              enqueueMutation.isPending ? /* @__PURE__ */ jsx(Loader2, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:438", className: "w-4 h-4 mr-2 animate-spin" }) : /* @__PURE__ */ jsx(Send, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:438", className: "w-4 h-4 mr-2" }),
              "Add Links To Queue"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:442", className: "rounded-xl border border-border bg-secondary/20 p-4 text-sm text-muted-foreground", children: [
          /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:443", className: "font-medium text-foreground mb-1", children: "Review flow" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:444", children: "The automation creates draft products only. Review them from the Products screen, then switch them to Active when they look right." })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:451", className: "rounded-2xl border border-border bg-card overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:452", className: "flex flex-col gap-2 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:453", children: [
          /* @__PURE__ */ jsx("h2", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:454", className: "font-condensed text-lg font-bold uppercase tracking-wider text-foreground", children: "Queued Sources" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:455", className: "text-sm text-muted-foreground", children: "Status, retries, and draft links for each imported product source." })
        ] }),
        settingsLoading || queueLoading ? /* @__PURE__ */ jsx(Loader2, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:457", className: "w-4 h-4 animate-spin text-muted-foreground" }) : null
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:460", className: "divide-y divide-border", children: [
        (queue ?? []).length === 0 && !queueLoading ? /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:462", className: "px-6 py-10 text-sm text-muted-foreground", children: "No source links have been queued yet." }) : null,
        (queue ?? []).map((source) => /* @__PURE__ */ jsx("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:466", className: "px-6 py-4", children: /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:467", className: "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:468", className: "min-w-0 space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:469", className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsx(Badge, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:470", className: statusTone(source.status), children: source.status.replace(/_/g, " ") }),
              source.productId ? /* @__PURE__ */ jsxs(Badge, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:471", variant: "outline", children: [
                "Draft #",
                source.productId
              ] }) : null,
              /* @__PURE__ */ jsxs("span", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:472", className: "text-xs text-muted-foreground", children: [
                "Attempts: ",
                source.attemptCount ?? 0
              ] })
            ] }),
            /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:475", className: "text-sm font-medium text-foreground break-all", children: source.sourceUrl }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:477", className: "flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground", children: [
              /* @__PURE__ */ jsxs("span", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:478", children: [
                "Created: ",
                formatDate(source.createdAt)
              ] }),
              /* @__PURE__ */ jsxs("span", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:479", children: [
                "Last attempt: ",
                formatDate(source.lastAttemptAt)
              ] }),
              /* @__PURE__ */ jsxs("span", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:480", children: [
                "Next try: ",
                formatDate(source.nextAttemptAt)
              ] })
            ] }),
            source.notes ? /* @__PURE__ */ jsx("p", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:484", className: "text-sm text-muted-foreground", children: source.notes }) : null
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:488", className: "flex flex-wrap gap-2", children: [
            source.productId ? /* @__PURE__ */ jsx(Button, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:490", variant: "outline", size: "sm", onClick: () => setLocation(`/admin-saad/product/edit/${source.productId}`), children: "Review Draft" }) : null,
            source.status === "failed" ? /* @__PURE__ */ jsxs(
              Button,
              {
                "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:495",
                variant: "outline",
                size: "sm",
                onClick: () => retryMutation.mutate({ id: source.id }),
                disabled: retryMutation.isPending,
                children: [
                  /* @__PURE__ */ jsx(RefreshCw, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:501", className: "w-4 h-4 mr-2" }),
                  "Retry"
                ]
              }
            ) : null,
            /* @__PURE__ */ jsxs(
              Button,
              {
                "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:505",
                variant: "ghost",
                size: "sm",
                onClick: () => deleteMutation.mutate({ id: source.id }),
                disabled: deleteMutation.isPending,
                className: "text-muted-foreground hover:text-destructive",
                children: [
                  /* @__PURE__ */ jsx(Trash2, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:512", className: "w-4 h-4 mr-2" }),
                  "Remove"
                ]
              }
            )
          ] })
        ] }) }, source.id))
      ] })
    ] }),
    (settingsLoading || queueLoading) && !settingsData ? /* @__PURE__ */ jsxs("div", { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:523", className: "flex items-center justify-center py-10 text-muted-foreground", children: [
      /* @__PURE__ */ jsx(Loader2, { "data-loc": "listing-generator\\client\\AdminProductAutomation.tsx:524", className: "w-5 h-5 animate-spin mr-2" }),
      "Loading automation workspace..."
    ] }) : null
  ] }) });
}
export {
  AdminProductAutomation as default
};
