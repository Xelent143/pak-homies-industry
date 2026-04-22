import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { P as PageHeader } from "./PageHeader-BUZ8Ld1L.js";
import { Link } from "wouter";
import { MessageCircle, Mail, MapPin, Clock } from "lucide-react";
function Contact() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      PageHeader,
      {
        "data-loc": "client\\src\\pages\\Contact.tsx:8",
        eyebrow: "Contact",
        title: "Talk to Shehraz directly.",
        subtitle: "No sales reps. No automated bots. Direct WhatsApp to the founder, average reply 4 hours."
      }
    ),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Contact.tsx:14", className: "container-page py-20 grid lg:grid-cols-2 gap-12", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Contact.tsx:15", className: "space-y-6", children: [
        { icon: MessageCircle, label: "WhatsApp (preferred)", value: "+92 328 5619939", href: "https://wa.me/923285619939" },
        { icon: Mail, label: "Email", value: "Pakhomiesi@gmail.com", href: "mailto:Pakhomiesi@gmail.com" },
        { icon: MapPin, label: "Factory address", value: "Airport Road, Gansarpur, Sialkot 51310, Pakistan", href: null },
        { icon: Clock, label: "Hours (PKT)", value: "Mon–Sat 9am–7pm · Reply within 4 hours", href: null }
      ].map((row) => {
        const Icon = row.icon;
        const inner = /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Contact.tsx:24", className: "flex gap-4 items-start p-6 border border-[#E0E0E0] rounded hover:border-[#3E41B6] transition-colors", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Contact.tsx:25", className: "w-11 h-11 rounded bg-[#3E41B6]/10 flex items-center justify-center text-[#3E41B6] shrink-0", children: /* @__PURE__ */ jsx(Icon, { "data-loc": "client\\src\\pages\\Contact.tsx:26", size: 20 }) }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Contact.tsx:28", children: [
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Contact.tsx:29", className: "ribbon-text text-[#555]", children: row.label }),
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Contact.tsx:30", className: "font-semibold text-base mt-1", children: row.value })
          ] })
        ] });
        return row.href ? /* @__PURE__ */ jsx("a", { "data-loc": "client\\src\\pages\\Contact.tsx:34", href: row.href, children: inner }, row.label) : /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Contact.tsx:34", children: inner }, row.label);
      }) }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Contact.tsx:38", className: "p-10 bg-[#1A1A1A] text-white rounded", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Contact.tsx:39", className: "ribbon-text text-[#5A5DCB]", children: "Faster" }),
        /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\Contact.tsx:40", className: "font-display text-3xl mt-3", children: [
          "Skip the form.",
          /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\pages\\Contact.tsx:40" }),
          "Send a real inquiry."
        ] }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Contact.tsx:41", className: "text-white/70 mt-4", children: "Use our 6-step inquiry builder. Spec your garments, quantities, customizations and timelines. Shehraz quotes within 4 hours." }),
        /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\Contact.tsx:45", href: "/inquire", className: "mt-7 inline-block px-7 py-3 bg-[#3E41B6] hover:bg-[#5A5DCB] font-semibold rounded", children: "Get a Free Sample Quote" }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Contact.tsx:49", className: "mt-10 pt-8 border-t border-white/10", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Contact.tsx:50", className: "ribbon-text text-white/40", children: "Or use a tool" }),
          /* @__PURE__ */ jsxs("ul", { "data-loc": "client\\src\\pages\\Contact.tsx:51", className: "mt-4 space-y-2", children: [
            /* @__PURE__ */ jsx("li", { "data-loc": "client\\src\\pages\\Contact.tsx:52", children: /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\Contact.tsx:52", href: "/customize", className: "text-white/80 hover:text-white", children: "→ Open the 3D Customizer" }) }),
            /* @__PURE__ */ jsx("li", { "data-loc": "client\\src\\pages\\Contact.tsx:53", children: /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\Contact.tsx:53", href: "/capabilities/label-studio", className: "text-white/80 hover:text-white", children: "→ Design a custom label" }) }),
            /* @__PURE__ */ jsx("li", { "data-loc": "client\\src\\pages\\Contact.tsx:54", children: /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\Contact.tsx:54", href: "/capabilities/techpack", className: "text-white/80 hover:text-white", children: "→ Generate a tech pack" }) })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  Contact as default
};
