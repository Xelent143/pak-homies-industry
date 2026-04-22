import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useState } from "react";
import { P as PageHeader } from "./PageHeader-BUZ8Ld1L.js";
import { Check, ArrowRight } from "lucide-react";
import { P as PRODUCTS } from "../entry-server.js";
import "@trpc/react-query";
import "@tanstack/react-query";
import "@trpc/client";
import "react-dom/server";
import "react-helmet-async";
import "superjson";
import "wouter";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
function Inquire() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    email: "",
    whatsapp: "",
    city: "",
    products: [],
    quantity: "",
    customization: "",
    timeline: "",
    notes: ""
  });
  const update = (k, v) => setForm({ ...form, [k]: v });
  const toggleProduct = (slug) => {
    update("products", form.products.includes(slug) ? form.products.filter((p) => p !== slug) : [...form.products, slug]);
  };
  const submit = async (e) => {
    e.preventDefault();
    try {
      await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
    } catch {
    }
    setSubmitted(true);
  };
  if (submitted) {
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(PageHeader, { "data-loc": "client\\src\\pages\\Inquire.tsx:43", eyebrow: "Inquiry received", title: "We're on it.", subtitle: "Shehraz will message you within 4 hours via WhatsApp or email." }),
      /* @__PURE__ */ jsx("section", { "data-loc": "client\\src\\pages\\Inquire.tsx:44", className: "container-page py-20 max-w-2xl", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Inquire.tsx:45", className: "p-10 border border-[#3E41B6] rounded text-center", children: [
        /* @__PURE__ */ jsx(Check, { "data-loc": "client\\src\\pages\\Inquire.tsx:46", size: 48, className: "text-[#3E41B6] mx-auto" }),
        /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\Inquire.tsx:47", className: "font-display text-2xl mt-4", children: "Inquiry submitted" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Inquire.tsx:48", className: "text-[#555] mt-3", children: "A copy has been sent to Pakhomiesi@gmail.com. We reply within 4 hours during PKT business hours." }),
        /* @__PURE__ */ jsx("a", { "data-loc": "client\\src\\pages\\Inquire.tsx:49", href: "https://wa.me/923285619939", className: "mt-6 inline-block px-6 py-3 bg-[#3E41B6] hover:bg-[#5A5DCB] text-white font-semibold rounded", children: "Message Shehraz on WhatsApp now" })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        "data-loc": "client\\src\\pages\\Inquire.tsx:60",
        eyebrow: "Get a free quote",
        title: "Tell us what you want made.",
        subtitle: "6 quick fields. Shehraz quotes within 4 hours. No commitment."
      }
    ),
    /* @__PURE__ */ jsx("section", { "data-loc": "client\\src\\pages\\Inquire.tsx:66", className: "container-page py-20", children: /* @__PURE__ */ jsxs("form", { "data-loc": "client\\src\\pages\\Inquire.tsx:67", onSubmit: submit, className: "grid lg:grid-cols-[1.4fr_1fr] gap-12", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Inquire.tsx:68", className: "space-y-8", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Inquire.tsx:70", className: "p-8 border border-[#E0E0E0] rounded", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Inquire.tsx:71", className: "ribbon-text text-[#3E41B6]", children: "Step 1 · You" }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Inquire.tsx:72", className: "mt-5 grid sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsx(Field, { "data-loc": "client\\src\\pages\\Inquire.tsx:73", label: "Your name", value: form.name, onChange: (v) => update("name", v), required: true }),
            /* @__PURE__ */ jsx(Field, { "data-loc": "client\\src\\pages\\Inquire.tsx:74", label: "Brand name", value: form.brand, onChange: (v) => update("brand", v), required: true }),
            /* @__PURE__ */ jsx(Field, { "data-loc": "client\\src\\pages\\Inquire.tsx:75", label: "Email", value: form.email, onChange: (v) => update("email", v), type: "email", required: true }),
            /* @__PURE__ */ jsx(Field, { "data-loc": "client\\src\\pages\\Inquire.tsx:76", label: "WhatsApp (with country code)", value: form.whatsapp, onChange: (v) => update("whatsapp", v) }),
            /* @__PURE__ */ jsx(Field, { "data-loc": "client\\src\\pages\\Inquire.tsx:77", label: "City", value: form.city, onChange: (v) => update("city", v), placeholder: "Atlanta, Houston, etc." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Inquire.tsx:82", className: "p-8 border border-[#E0E0E0] rounded", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Inquire.tsx:83", className: "ribbon-text text-[#3E41B6]", children: "Step 2 · Products (pick any)" }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Inquire.tsx:84", className: "mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3", children: PRODUCTS.map((p) => {
            const active = form.products.includes(p.slug);
            return /* @__PURE__ */ jsxs(
              "button",
              {
                "data-loc": "client\\src\\pages\\Inquire.tsx:88",
                type: "button",
                onClick: () => toggleProduct(p.slug),
                className: `p-4 border rounded text-left transition-colors ${active ? "border-[#3E41B6] bg-[#3E41B6]/5" : "border-[#E0E0E0] hover:border-[#3E41B6]"}`,
                children: [
                  /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Inquire.tsx:96", className: "font-semibold text-sm", children: p.name }),
                  /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Inquire.tsx:97", className: "text-xs text-[#555] mt-1", children: [
                    "From $",
                    p.basePrice.toFixed(2)
                  ] })
                ]
              },
              p.slug
            );
          }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Inquire.tsx:105", className: "p-8 border border-[#E0E0E0] rounded space-y-4", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Inquire.tsx:106", className: "ribbon-text text-[#3E41B6]", children: "Step 3 · Details" }),
          /* @__PURE__ */ jsx(Field, { "data-loc": "client\\src\\pages\\Inquire.tsx:107", label: "Total quantity (across all styles)", value: form.quantity, onChange: (v) => update("quantity", v), placeholder: "e.g. 200 pieces" }),
          /* @__PURE__ */ jsx(Field, { "data-loc": "client\\src\\pages\\Inquire.tsx:108", label: "Customizations needed", value: form.customization, onChange: (v) => update("customization", v), placeholder: "Custom labels, embroidery, dye colors..." }),
          /* @__PURE__ */ jsx(Field, { "data-loc": "client\\src\\pages\\Inquire.tsx:109", label: "Timeline", value: form.timeline, onChange: (v) => update("timeline", v), placeholder: "When do you need bulk?" }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Inquire.tsx:110", children: [
            /* @__PURE__ */ jsx("label", { "data-loc": "client\\src\\pages\\Inquire.tsx:111", className: "block ribbon-text text-[#555] mb-2", children: "Anything else" }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                "data-loc": "client\\src\\pages\\Inquire.tsx:112",
                value: form.notes,
                onChange: (e) => update("notes", e.target.value),
                rows: 4,
                className: "w-full p-3 border border-[#E0E0E0] rounded focus:border-[#3E41B6] outline-none",
                placeholder: "Reference brands, hardware, fabric ideas, anything Shehraz should know."
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            "data-loc": "client\\src\\pages\\Inquire.tsx:122",
            type: "submit",
            className: "px-7 py-4 bg-[#3E41B6] hover:bg-[#5A5DCB] text-white font-semibold rounded inline-flex items-center gap-2",
            children: [
              "Submit Inquiry ",
              /* @__PURE__ */ jsx(ArrowRight, { "data-loc": "client\\src\\pages\\Inquire.tsx:126", size: 18 })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("aside", { "data-loc": "client\\src\\pages\\Inquire.tsx:130", className: "p-8 bg-[#1A1A1A] text-white rounded h-fit sticky top-28", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Inquire.tsx:131", className: "ribbon-text text-[#5A5DCB]", children: "What happens next" }),
        /* @__PURE__ */ jsx("ol", { "data-loc": "client\\src\\pages\\Inquire.tsx:132", className: "mt-5 space-y-4", children: [
          "Shehraz reads your inquiry within 4 hours.",
          "You get a quote with slab pricing for every garment.",
          "If you approve: 7 days to sample, 15 days to bulk.",
          "Daily WhatsApp updates with photos throughout production."
        ].map((step, i) => /* @__PURE__ */ jsxs("li", { "data-loc": "client\\src\\pages\\Inquire.tsx:139", className: "flex gap-3", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Inquire.tsx:140", className: "w-7 h-7 shrink-0 rounded-full bg-[#3E41B6] flex items-center justify-center text-sm font-bold", children: i + 1 }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Inquire.tsx:141", className: "text-white/80 text-sm", children: step })
        ] }, i)) }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Inquire.tsx:146", className: "mt-8 pt-6 border-t border-white/10", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Inquire.tsx:147", className: "ribbon-text text-white/40", children: "Direct line" }),
          /* @__PURE__ */ jsx("a", { "data-loc": "client\\src\\pages\\Inquire.tsx:148", href: "https://wa.me/923285619939", className: "block mt-2 text-white hover:text-[#FE3136]", children: "+92 328 5619939" }),
          /* @__PURE__ */ jsx("a", { "data-loc": "client\\src\\pages\\Inquire.tsx:149", href: "mailto:Pakhomiesi@gmail.com", className: "block mt-1 text-white hover:text-[#FE3136]", children: "Pakhomiesi@gmail.com" })
        ] })
      ] })
    ] }) })
  ] });
}
function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required
}) {
  return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Inquire.tsx:169", children: [
    /* @__PURE__ */ jsxs("label", { "data-loc": "client\\src\\pages\\Inquire.tsx:170", className: "block ribbon-text text-[#555] mb-2", children: [
      label,
      required && /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Inquire.tsx:170", className: "text-[#FE3136]", children: " *" })
    ] }),
    /* @__PURE__ */ jsx(
      "input",
      {
        "data-loc": "client\\src\\pages\\Inquire.tsx:171",
        type,
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder,
        required,
        className: "w-full p-3 border border-[#E0E0E0] rounded focus:border-[#3E41B6] outline-none"
      }
    )
  ] });
}
export {
  Inquire as default
};
