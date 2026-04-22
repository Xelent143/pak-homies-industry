import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { createTRPCReact } from "@trpc/react-query";
import { QueryClient, QueryClientProvider, dehydrate } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import React__default, { Component, createContext, useState, useEffect, useRef, lazy, Suspense } from "react";
import ReactDOMServer from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import superjson from "superjson";
import { useLocation, Link, Switch, Route, Router as Router$1 } from "wouter";
import { useTheme } from "next-themes";
import { Toaster as Toaster$1 } from "sonner";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AlertTriangle, RotateCcw, Zap, ArrowUpRight, X, Menu, AlertCircle, Home as Home$1, PackageCheck, Truck, ArrowLeft, ArrowRight, Box, Tag, FileCode, FileText, Scissors, Cog } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
const trpc = createTRPCReact();
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme();
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      "data-loc": "client\\src\\components\\ui\\sonner.tsx:8",
      theme,
      className: "toaster group",
      style: {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)"
      },
      ...props
    }
  );
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
function TooltipProvider({
  delayDuration = 0,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    TooltipPrimitive.Provider,
    {
      "data-loc": "client\\src\\components\\ui\\tooltip.tsx:11",
      "data-slot": "tooltip-provider",
      delayDuration,
      ...props
    }
  );
}
function Tooltip({
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipProvider, { "data-loc": "client\\src\\components\\ui\\tooltip.tsx:23", children: /* @__PURE__ */ jsx(TooltipPrimitive.Root, { "data-loc": "client\\src\\components\\ui\\tooltip.tsx:24", "data-slot": "tooltip", ...props }) });
}
function TooltipTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipPrimitive.Trigger, { "data-loc": "client\\src\\components\\ui\\tooltip.tsx:32", "data-slot": "tooltip-trigger", ...props });
}
function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsx(TooltipPrimitive.Portal, { "data-loc": "client\\src\\components\\ui\\tooltip.tsx:42", children: /* @__PURE__ */ jsxs(
    TooltipPrimitive.Content,
    {
      "data-loc": "client\\src\\components\\ui\\tooltip.tsx:43",
      "data-slot": "tooltip-content",
      sideOffset,
      className: cn(
        "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(TooltipPrimitive.Arrow, { "data-loc": "client\\src\\components\\ui\\tooltip.tsx:53", className: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
      ]
    }
  ) });
}
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\components\\ErrorBoundary.tsx:27", className: "flex items-center justify-center min-h-screen p-8 bg-background", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\ErrorBoundary.tsx:28", className: "flex flex-col items-center w-full max-w-2xl p-8", children: [
        /* @__PURE__ */ jsx(
          AlertTriangle,
          {
            "data-loc": "client\\src\\components\\ErrorBoundary.tsx:29",
            size: 48,
            className: "text-destructive mb-6 flex-shrink-0"
          }
        ),
        /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\components\\ErrorBoundary.tsx:34", className: "text-xl mb-4", children: "An unexpected error occurred." }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\components\\ErrorBoundary.tsx:36", className: "p-4 w-full rounded bg-muted overflow-auto mb-6", children: /* @__PURE__ */ jsx("pre", { "data-loc": "client\\src\\components\\ErrorBoundary.tsx:37", className: "text-sm text-muted-foreground whitespace-break-spaces", children: this.state.error?.stack }) }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            "data-loc": "client\\src\\components\\ErrorBoundary.tsx:42",
            onClick: () => window.location.reload(),
            className: cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg",
              "bg-primary text-primary-foreground",
              "hover:opacity-90 cursor-pointer"
            ),
            children: [
              /* @__PURE__ */ jsx(RotateCcw, { "data-loc": "client\\src\\components\\ErrorBoundary.tsx:50", size: 16 }),
              "Reload Page"
            ]
          }
        )
      ] }) });
    }
    return this.props.children;
  }
}
const ThemeContext = createContext(void 0);
function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false
}) {
  const [theme, setTheme] = useState(() => {
    if (switchable) {
      const stored = localStorage.getItem("theme");
      return stored || defaultTheme;
    }
    return defaultTheme;
  });
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    if (switchable) {
      localStorage.setItem("theme", theme);
    }
  }, [theme, switchable]);
  const toggleTheme = switchable ? () => {
    setTheme((prev) => prev === "light" ? "dark" : "light");
  } : void 0;
  return /* @__PURE__ */ jsx(ThemeContext.Provider, { "data-loc": "client\\src\\contexts\\ThemeContext.tsx:52", value: { theme, toggleTheme, switchable }, children });
}
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    { to: "/shop", label: "SHOP" },
    { to: "/services", label: "SERVICES" },
    { to: "/products", label: "MANUFACTURING" },
    { to: "/customize", label: "CUSTOMIZER" },
    { to: "/capabilities/label-studio", label: "LABEL STUDIO" },
    { to: "/capabilities/techpack", label: "TECH PACKS" }
  ];
  const isActive = (to) => location === to || to !== "/" && location.startsWith(to);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\components\\Navbar.tsx:31", className: "fixed top-0 left-0 w-full z-[60] bg-[#1A1A1A] text-white h-7 overflow-hidden border-b border-[#FE3136]/40", children: /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\components\\Navbar.tsx:32", className: "flex animate-marquee whitespace-nowrap text-[10px] tracking-[0.3em] font-bold uppercase h-full items-center", children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\components\\Navbar.tsx:34", className: "mx-6 inline-flex items-center gap-2", children: [
      /* @__PURE__ */ jsx(Zap, { "data-loc": "client\\src\\components\\Navbar.tsx:35", size: 11, className: "text-[#FE3136]" }),
      " MOQ 50 PIECES",
      /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\Navbar.tsx:36", className: "text-[#FE3136] mx-3", children: "★" }),
      " 7-DAY SAMPLES",
      /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\Navbar.tsx:37", className: "text-[#FE3136] mx-3", children: "★" }),
      " BSCI · OEKO-TEX · WRAP CERTIFIED",
      /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\Navbar.tsx:38", className: "text-[#FE3136] mx-3", children: "★" }),
      " FREE FREIGHT TO USA PORT",
      /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\Navbar.tsx:39", className: "text-[#FE3136] mx-3", children: "★" }),
      " DIRECT FOUNDER WHATSAPP",
      /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\Navbar.tsx:40", className: "text-[#FE3136] mx-3", children: "★" })
    ] }, i)) }) }),
    /* @__PURE__ */ jsx(
      "nav",
      {
        "data-loc": "client\\src\\components\\Navbar.tsx:47",
        className: `fixed top-7 left-0 w-full z-50 transition-all duration-300 border-b-2 ${scrolled ? "bg-white/95 backdrop-blur-md border-[#1A1A1A] shadow-[0_2px_0_0_#FE3136] h-14" : "bg-[#F8F8F8]/90 backdrop-blur-sm border-[#1A1A1A] h-16"}`,
        children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\Navbar.tsx:54", className: "container mx-auto h-full px-6 flex justify-between items-center", children: [
          /* @__PURE__ */ jsxs(Link, { "data-loc": "client\\src\\components\\Navbar.tsx:56", href: "/", className: "group flex items-center gap-2 relative", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\Navbar.tsx:57", className: "relative", children: [
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\Navbar.tsx:58", className: "text-2xl font-black tracking-tighter text-[#1A1A1A] leading-none", children: "PAK" }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\Navbar.tsx:59", className: "text-2xl font-black tracking-tighter text-[#FE3136] leading-none", children: "HOMIES" }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\Navbar.tsx:60", className: "absolute -top-1 -right-3 w-1.5 h-1.5 bg-[#FE3136] rounded-full animate-glow-pulse" })
            ] }),
            /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\components\\Navbar.tsx:62", className: "hidden sm:block text-[8px] uppercase tracking-[0.2em] text-[#767685] font-bold border-l border-[#1A1A1A] pl-2 leading-tight", children: [
              "Sialkot",
              /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\components\\Navbar.tsx:63" }),
              "Streetwear",
              /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\components\\Navbar.tsx:63" }),
              "MFG."
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\components\\Navbar.tsx:68", className: "hidden lg:flex gap-1 items-center", children: links.map((l) => {
            const active = isActive(l.to);
            return /* @__PURE__ */ jsxs(
              Link,
              {
                "data-loc": "client\\src\\components\\Navbar.tsx:72",
                href: l.to,
                className: `group relative font-headline uppercase tracking-widest font-bold text-[11px] px-3 py-2 transition-colors duration-200 ${active ? "text-[#FE3136]" : "text-[#1A1A1A] hover:text-[#FE3136]"}`,
                children: [
                  /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\Navbar.tsx:79", className: "relative z-10", children: l.label }),
                  active && /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\Navbar.tsx:82", className: "absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FE3136] rounded-full" }),
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      "data-loc": "client\\src\\components\\Navbar.tsx:85",
                      className: `absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#FE3136] transition-all duration-300 ${active ? "w-6" : "w-0 group-hover:w-6"}`
                    }
                  )
                ]
              },
              l.to
            );
          }) }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\Navbar.tsx:96", className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxs(
              Link,
              {
                "data-loc": "client\\src\\components\\Navbar.tsx:97",
                href: "/inquire",
                className: "hidden sm:inline-flex items-center gap-2 group relative bg-[#FE3136] text-white px-5 py-2.5 font-bold uppercase tracking-widest text-[11px] border-2 border-[#1A1A1A] overflow-hidden transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_0_#1A1A1A]",
                children: [
                  /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\Navbar.tsx:101", className: "absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" }),
                  /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\Navbar.tsx:102", className: "relative", children: "Start Batch" }),
                  /* @__PURE__ */ jsx(ArrowUpRight, { "data-loc": "client\\src\\components\\Navbar.tsx:103", size: 14, className: "relative transition-transform group-hover:rotate-45" })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                "data-loc": "client\\src\\components\\Navbar.tsx:105",
                className: "lg:hidden text-[#1A1A1A] border-2 border-[#1A1A1A] p-1.5",
                onClick: () => setOpen(!open),
                "aria-label": "Menu",
                children: open ? /* @__PURE__ */ jsx(X, { "data-loc": "client\\src\\components\\Navbar.tsx:110", size: 20 }) : /* @__PURE__ */ jsx(Menu, { "data-loc": "client\\src\\components\\Navbar.tsx:110", size: 20 })
              }
            )
          ] })
        ] })
      }
    ),
    open && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\Navbar.tsx:118", className: "lg:hidden fixed top-[5.25rem] left-0 w-full z-40 bg-[#1A1A1A] border-b-2 border-[#FE3136] flex flex-col animate-slide-up", children: [
      links.map((l, i) => {
        const active = isActive(l.to);
        return /* @__PURE__ */ jsxs(
          Link,
          {
            "data-loc": "client\\src\\components\\Navbar.tsx:122",
            href: l.to,
            onClick: () => setOpen(false),
            className: `group flex items-center justify-between px-6 py-4 font-headline font-bold uppercase tracking-widest text-base border-b border-white/10 transition-colors ${active ? "bg-[#FE3136] text-white" : "text-white hover:bg-[#3E41B6]"}`,
            style: { animationDelay: `${i * 60}ms` },
            children: [
              /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\components\\Navbar.tsx:131", className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\components\\Navbar.tsx:132", className: "text-[#FE3136] text-[10px] group-hover:text-white", children: [
                  "0",
                  i + 1
                ] }),
                l.label
              ] }),
              /* @__PURE__ */ jsx(ArrowUpRight, { "data-loc": "client\\src\\components\\Navbar.tsx:135", size: 16, className: "opacity-50 group-hover:opacity-100 group-hover:rotate-45 transition" })
            ]
          },
          l.to
        );
      }),
      /* @__PURE__ */ jsxs(
        Link,
        {
          "data-loc": "client\\src\\components\\Navbar.tsx:139",
          href: "/inquire",
          onClick: () => setOpen(false),
          className: "px-6 py-5 bg-[#FE3136] text-white font-bold uppercase tracking-widest text-center inline-flex items-center justify-center gap-2",
          children: [
            "START BATCH ",
            /* @__PURE__ */ jsx(ArrowUpRight, { "data-loc": "client\\src\\components\\Navbar.tsx:144", size: 16 })
          ]
        }
      )
    ] })
  ] });
}
function Footer() {
  return /* @__PURE__ */ jsxs("footer", { "data-loc": "client\\src\\components\\Footer.tsx:5", className: "bg-[#1A1A1A] w-full py-20 px-10 border-t-4 border-[#3E41B6] grid grid-cols-1 md:grid-cols-4 gap-12", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\Footer.tsx:6", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\components\\Footer.tsx:7", className: "text-4xl font-black text-[#F8F8F8] mb-8", children: "PAK HOMIES" }),
      /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\components\\Footer.tsx:8", className: "text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em] mb-4 leading-relaxed", children: [
        "TACTICAL EDITORIAL MANUFACTURING.",
        /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\components\\Footer.tsx:9" }),
        "SIALKOT, PUNJAB."
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\Footer.tsx:12", className: "flex gap-4", children: [
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\Footer.tsx:13", className: "w-8 h-8 border border-white/20 flex items-center justify-center text-white text-xs", children: "IG" }),
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\Footer.tsx:14", className: "w-8 h-8 border border-white/20 flex items-center justify-center text-white text-xs", children: "TW" }),
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\Footer.tsx:15", className: "w-8 h-8 border border-white/20 flex items-center justify-center text-white text-xs", children: "LI" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\Footer.tsx:18", children: [
      /* @__PURE__ */ jsx("h5", { "data-loc": "client\\src\\components\\Footer.tsx:19", className: "text-white font-bold mb-6 uppercase tracking-widest text-sm", children: "EXPLORE" }),
      /* @__PURE__ */ jsxs("ul", { "data-loc": "client\\src\\components\\Footer.tsx:20", className: "space-y-4", children: [
        /* @__PURE__ */ jsx("li", { "data-loc": "client\\src\\components\\Footer.tsx:21", children: /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\components\\Footer.tsx:21", href: "/customize", className: "text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em] hover:text-[#3E41B6]", children: "3D CUSTOMIZER" }) }),
        /* @__PURE__ */ jsx("li", { "data-loc": "client\\src\\components\\Footer.tsx:22", children: /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\components\\Footer.tsx:22", href: "/capabilities/label-studio", className: "text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em] hover:text-[#3E41B6]", children: "LABEL STUDIO" }) }),
        /* @__PURE__ */ jsx("li", { "data-loc": "client\\src\\components\\Footer.tsx:23", children: /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\components\\Footer.tsx:23", href: "/capabilities/techpack", className: "text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em] hover:text-[#3E41B6]", children: "TECH PACK GEN" }) }),
        /* @__PURE__ */ jsx("li", { "data-loc": "client\\src\\components\\Footer.tsx:24", children: /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\components\\Footer.tsx:24", href: "/products", className: "text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em] hover:text-[#3E41B6]", children: "PRODUCTS" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\Footer.tsx:27", children: [
      /* @__PURE__ */ jsx("h5", { "data-loc": "client\\src\\components\\Footer.tsx:28", className: "text-white font-bold mb-6 uppercase tracking-widest text-sm", children: "FACTORY" }),
      /* @__PURE__ */ jsxs("ul", { "data-loc": "client\\src\\components\\Footer.tsx:29", className: "space-y-4", children: [
        /* @__PURE__ */ jsx("li", { "data-loc": "client\\src\\components\\Footer.tsx:30", children: /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\components\\Footer.tsx:30", href: "/why-pak-homies", className: "text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em] hover:text-[#3E41B6]", children: "WHY PAK HOMIES" }) }),
        /* @__PURE__ */ jsx("li", { "data-loc": "client\\src\\components\\Footer.tsx:31", children: /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\components\\Footer.tsx:31", href: "/certifications", className: "text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em] hover:text-[#3E41B6]", children: "CERTIFICATIONS" }) }),
        /* @__PURE__ */ jsx("li", { "data-loc": "client\\src\\components\\Footer.tsx:32", children: /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\components\\Footer.tsx:32", href: "/process", className: "text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em] hover:text-[#3E41B6]", children: "PROCESS" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\Footer.tsx:35", children: [
      /* @__PURE__ */ jsx("h5", { "data-loc": "client\\src\\components\\Footer.tsx:36", className: "text-white font-bold mb-6 uppercase tracking-widest text-sm", children: "CONTACT" }),
      /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\components\\Footer.tsx:37", className: "text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em] leading-relaxed", children: [
        "AIRPORT ROAD, GANSARPUR",
        /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\components\\Footer.tsx:38" }),
        "SIALKOT, PUNJAB 51310",
        /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\components\\Footer.tsx:39" }),
        /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\components\\Footer.tsx:39" }),
        "PAKHOMIESI@GMAIL.COM",
        /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\components\\Footer.tsx:40" }),
        "WHATSAPP +92 328 5619939"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\components\\Footer.tsx:44", className: "md:col-span-4 pt-12 border-t border-white/10 text-center", children: /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\components\\Footer.tsx:45", className: "text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em]", children: [
      "©2026 PAK HOMIES INDUSTRY. ALL RIGHTS RESERVED. · ",
      /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\components\\Footer.tsx:45", href: "/privacy", className: "hover:text-white", children: "PRIVACY" }),
      " · ",
      /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\components\\Footer.tsx:45", href: "/terms", className: "hover:text-white", children: "TERMS" })
    ] }) })
  ] });
}
function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-transparent shadow-xs hover:bg-accent dark:bg-transparent dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-loc": "client\\src\\components\\ui\\button.tsx:52",
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-loc": "client\\src\\components\\ui\\card.tsx:7",
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-loc": "client\\src\\components\\ui\\card.tsx:66",
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
function NotFound() {
  const [, setLocation] = useLocation();
  const handleGoHome = () => {
    setLocation("/");
  };
  return /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\NotFound.tsx:14", className: "min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100", children: /* @__PURE__ */ jsx(Card, { "data-loc": "client\\src\\pages\\NotFound.tsx:15", className: "w-full max-w-lg mx-4 shadow-lg border-0 bg-white/80 backdrop-blur-sm", children: /* @__PURE__ */ jsxs(CardContent, { "data-loc": "client\\src\\pages\\NotFound.tsx:16", className: "pt-8 pb-8 text-center", children: [
    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\NotFound.tsx:17", className: "flex justify-center mb-6", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\NotFound.tsx:18", className: "relative", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\NotFound.tsx:19", className: "absolute inset-0 bg-red-100 rounded-full animate-pulse" }),
      /* @__PURE__ */ jsx(AlertCircle, { "data-loc": "client\\src\\pages\\NotFound.tsx:20", className: "relative h-16 w-16 text-red-500" })
    ] }) }),
    /* @__PURE__ */ jsx("h1", { "data-loc": "client\\src\\pages\\NotFound.tsx:24", className: "text-4xl font-bold text-slate-900 mb-2", children: "404" }),
    /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\NotFound.tsx:26", className: "text-xl font-semibold text-slate-700 mb-4", children: "Page Not Found" }),
    /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\NotFound.tsx:30", className: "text-slate-600 mb-8 leading-relaxed", children: [
      "Sorry, the page you are looking for doesn't exist.",
      /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\pages\\NotFound.tsx:32" }),
      "It may have been moved or deleted."
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        "data-loc": "client\\src\\pages\\NotFound.tsx:36",
        id: "not-found-button-group",
        className: "flex flex-col sm:flex-row gap-3 justify-center",
        children: /* @__PURE__ */ jsxs(
          Button,
          {
            "data-loc": "client\\src\\pages\\NotFound.tsx:40",
            onClick: handleGoHome,
            className: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg",
            children: [
              /* @__PURE__ */ jsx(Home$1, { "data-loc": "client\\src\\pages\\NotFound.tsx:44", className: "w-4 h-4 mr-2" }),
              "Go Home"
            ]
          }
        )
      }
    )
  ] }) }) });
}
const defaultSizes = ["XS", "S", "M", "L", "XL", "XXL"];
const defaultColors = [
  { name: "Off-White", hex: "#F8F8F8" },
  { name: "Charcoal", hex: "#3A3A3A" },
  { name: "Jet Black", hex: "#1A1A1A" },
  { name: "Pak Blue", hex: "#3E41B6" },
  { name: "Stamp Red", hex: "#FE3136" },
  { name: "Sage", hex: "#7A8A6B" }
];
const defaultSizeChart = [
  { size: "XS", chest: '38"', length: '26"', sleeve: '23"', waist: '30"' },
  { size: "S", chest: '40"', length: '27"', sleeve: '24"', waist: '32"' },
  { size: "M", chest: '42"', length: '28"', sleeve: '24.5"', waist: '34"' },
  { size: "L", chest: '44"', length: '29"', sleeve: '25"', waist: '36"' },
  { size: "XL", chest: '46"', length: '30"', sleeve: '25.5"', waist: '38"' },
  { size: "XXL", chest: '48"', length: '31"', sleeve: '26"', waist: '40"' }
];
const defaultStory = "Cut, sewn, and finished on our own floor on Airport Road in Sialkot — the same team that holds BSCI, OEKO-TEX, and WRAP certifications. Every unit is inspected seam-by-seam before it leaves the floor. No subcontractors, no middlemen, no surprises.";
const defaultInfographic = "/images/generated/factory-floor-workspace.webp";
const PRODUCTS = [
  {
    slug: "denim-jackets",
    name: "Denim Jackets",
    category: "Outerwear",
    tagline: "Heavyweight Type-II silhouettes, custom washes, contrast stitching.",
    description: "Our signature Type-II denim jacket is built on 14.5oz raw selvedge indigo, finished with copper rivets, chain-stitched seams, and a boxy oversized cut. Designed to hold its shape through every wash — a canvas for your label.",
    img: "/images/generated/product-denim-jacket-hero.webp",
    gallery: [
      "/images/generated/product-denim-jacket-hero.webp",
      "/images/generated/product-denim-pants-hero.webp",
      "/images/generated/factory-floor-workspace.webp"
    ],
    manufacturingInfographic: defaultInfographic,
    basePrice: 18.5,
    slabPricing: [
      { qty: "50–99", price: 18.5, savings: "—" },
      { qty: "100–199", price: 16, savings: "13%" },
      { qty: "200–499", price: 14.5, savings: "22%" },
      { qty: "500+", price: 12.5, savings: "32%" }
    ],
    freeShipping: true,
    fabric: "12–14oz selvedge denim",
    weight: "12oz / 14oz",
    availableSizes: defaultSizes,
    availableColors: [
      { name: "Raw Indigo", hex: "#1C2C4A" },
      { name: "Mid Wash", hex: "#5A7AA3" },
      { name: "Dark Wash", hex: "#2C3E55" },
      { name: "Black Wash", hex: "#1A1A1A" },
      { name: "Acid", hex: "#AFBCCC" }
    ],
    customizations: [
      "Wash (raw, mid, dark, acid)",
      "Stitch color & weight",
      "Hardware (rivets, buttons)",
      "Custom labels",
      "Embroidery & patches"
    ],
    sizeChart: defaultSizeChart,
    manufacturingStory: defaultStory
  },
  {
    slug: "fleece-pullovers",
    name: "Fleece Pullovers",
    category: "Tops",
    tagline: "450gsm heavyweight fleece with brushed interior.",
    description: "Heavyweight 450gsm loopback fleece with a brushed interior for warmth and drape. Boxy cut, thick rib at the hem and cuffs, reinforced kangaroo pocket. Available as hoodie, half-zip, or crewneck.",
    img: "/images/generated/product-fleece-pullover-hero.webp",
    gallery: ["/images/generated/product-fleece-pullover-hero.webp", "/images/generated/factory-floor-workspace.webp"],
    manufacturingInfographic: defaultInfographic,
    basePrice: 16,
    slabPricing: [
      { qty: "50–99", price: 16, savings: "—" },
      { qty: "100–199", price: 14, savings: "12%" },
      { qty: "200–499", price: 12.5, savings: "22%" },
      { qty: "500+", price: 11, savings: "31%" }
    ],
    freeShipping: true,
    fabric: "450gsm cotton/poly fleece",
    weight: "450gsm",
    availableSizes: defaultSizes,
    availableColors: defaultColors,
    customizations: ["Hood, half-zip or crewneck", "Drawcord material", "Custom rib", "Puff print, embroidery, patches"],
    sizeChart: defaultSizeChart,
    manufacturingStory: defaultStory
  },
  {
    slug: "trousers",
    name: "Trousers",
    category: "Bottoms",
    tagline: "Cargo, pleated, work and wide-leg silhouettes.",
    description: "Workwear-grade trousers built from twill, ripstop, or canvas. Reinforced stress points, double-needle stitching, and deep pockets. Available in slim, relaxed, or wide-leg cuts.",
    img: "/images/generated/product-trousers-hero.webp",
    gallery: ["/images/generated/product-trousers-hero.webp", "/images/generated/factory-floor-workspace.webp"],
    manufacturingInfographic: defaultInfographic,
    basePrice: 14.5,
    slabPricing: [
      { qty: "50–99", price: 14.5, savings: "—" },
      { qty: "100–199", price: 12.5, savings: "13%" },
      { qty: "200–499", price: 11, savings: "24%" },
      { qty: "500+", price: 9.5, savings: "34%" }
    ],
    freeShipping: true,
    fabric: "Twill, ripstop, canvas",
    weight: "10oz / 12oz",
    availableSizes: defaultSizes,
    availableColors: defaultColors,
    customizations: ["Cut (slim, relaxed, wide)", "Pocket placement", "Hardware", "Custom waistband"],
    sizeChart: defaultSizeChart,
    manufacturingStory: defaultStory
  },
  {
    slug: "shorts",
    name: "Shorts",
    category: "Bottoms",
    tagline: "Mesh, fleece, denim and cargo shorts.",
    description: "Street-ready shorts in mesh, fleece, denim or cargo. Choose inseam, pocket style, and waistband treatment. Reinforced side seams and bar-tacked stress points.",
    img: "/images/generated/product-shorts-hero.webp",
    gallery: ["/images/generated/product-shorts-hero.webp"],
    manufacturingInfographic: defaultInfographic,
    basePrice: 9,
    slabPricing: [
      { qty: "50–99", price: 9, savings: "—" },
      { qty: "100–199", price: 7.5, savings: "16%" },
      { qty: "200–499", price: 6.5, savings: "27%" },
      { qty: "500+", price: 5.5, savings: "38%" }
    ],
    freeShipping: true,
    fabric: "Cotton, polyester, fleece",
    weight: "180–280gsm",
    availableSizes: defaultSizes,
    availableColors: defaultColors,
    customizations: ['Length (5", 7", 9")', "Pocket style", "Drawcord", "Print/embroidery"],
    sizeChart: defaultSizeChart,
    manufacturingStory: defaultStory
  },
  {
    slug: "t-shirts",
    name: "T-Shirts",
    category: "Tops",
    tagline: "Heavyweight 240–280gsm cotton, boxy and oversized fits.",
    description: "Heavyweight supima cotton t-shirts, 240–280gsm, with a boxy or oversized silhouette and ribbed collar. Pre-shrunk and garment-dyed for deep color retention.",
    img: "/images/generated/product-tshirt-hero.webp",
    gallery: ["/images/generated/product-tshirt-hero.webp"],
    manufacturingInfographic: defaultInfographic,
    basePrice: 7.5,
    slabPricing: [
      { qty: "50–99", price: 7.5, savings: "—" },
      { qty: "100–199", price: 6.25, savings: "16%" },
      { qty: "200–499", price: 5.5, savings: "26%" },
      { qty: "500+", price: 4.75, savings: "36%" }
    ],
    freeShipping: true,
    fabric: "240–280gsm cotton",
    weight: "240gsm / 260gsm / 280gsm",
    availableSizes: defaultSizes,
    availableColors: defaultColors,
    customizations: ["Cut (boxy, oversized, fitted)", "Garment dye", "DTG, screen, puff print", "Custom labels"],
    sizeChart: defaultSizeChart,
    manufacturingStory: defaultStory
  },
  {
    slug: "windbreakers",
    name: "Windbreakers",
    category: "Outerwear",
    tagline: "Lightweight nylon shells, half-zip pullovers, full anoraks.",
    description: "Technical nylon shells with taped seams, zippered pockets, and storm flaps. Available as half-zip pullovers, full-zip jackets, or anorak silhouettes.",
    img: "/images/generated/product-windbreaker-hero.webp",
    gallery: ["/images/generated/product-windbreaker-hero.webp"],
    manufacturingInfographic: defaultInfographic,
    basePrice: 17,
    slabPricing: [
      { qty: "50–99", price: 17, savings: "—" },
      { qty: "100–199", price: 14.5, savings: "14%" },
      { qty: "200–499", price: 13, savings: "23%" },
      { qty: "500+", price: 11.5, savings: "32%" }
    ],
    freeShipping: true,
    fabric: "Nylon ripstop, taslan",
    weight: "70–110gsm",
    availableSizes: defaultSizes,
    availableColors: defaultColors,
    customizations: ["Zipper style", "Reflective taping", "Custom lining", "Logo printing"],
    sizeChart: defaultSizeChart,
    manufacturingStory: defaultStory
  },
  {
    slug: "denim-pants",
    name: "Denim Pants",
    category: "Bottoms",
    tagline: "Selvedge denim jeans in straight, slim and baggy fits.",
    description: "Raw selvedge denim jeans with chain-stitched hems, hidden rivets, and custom hardware. Choose from straight, slim, relaxed, or baggy fit — each with its own pattern block.",
    img: "/images/generated/product-denim-pants-hero.webp",
    gallery: ["/images/generated/product-denim-pants-hero.webp"],
    manufacturingInfographic: defaultInfographic,
    basePrice: 16.5,
    slabPricing: [
      { qty: "50–99", price: 16.5, savings: "—" },
      { qty: "100–199", price: 14.5, savings: "12%" },
      { qty: "200–499", price: 13, savings: "21%" },
      { qty: "500+", price: 11.5, savings: "30%" }
    ],
    freeShipping: true,
    fabric: "12–14oz selvedge denim",
    weight: "12oz / 14oz",
    availableSizes: defaultSizes,
    availableColors: defaultColors,
    customizations: ["Wash", "Hardware", "Pocket detailing", "Custom rivets"],
    sizeChart: defaultSizeChart,
    manufacturingStory: defaultStory
  },
  {
    slug: "puffer-jackets",
    name: "Puffer Jackets",
    category: "Outerwear",
    tagline: "Down-alternative insulated puffers and bombers.",
    description: "Heavyweight quilted puffers with recycled down-alternative fill (300–400). Horizontal baffle channels, oversized boxy fit, YKK zippers, and optional hood or high collar.",
    img: "/images/generated/product-puffer-jacket-hero.webp",
    gallery: ["/images/generated/product-puffer-jacket-hero.webp"],
    manufacturingInfographic: defaultInfographic,
    basePrice: 24,
    slabPricing: [
      { qty: "50–99", price: 24, savings: "—" },
      { qty: "100–199", price: 21, savings: "12%" },
      { qty: "200–499", price: 19, savings: "21%" },
      { qty: "500+", price: 17, savings: "29%" }
    ],
    freeShipping: true,
    fabric: "Nylon shell + recycled fill",
    weight: "300–400 fill",
    availableSizes: defaultSizes,
    availableColors: defaultColors,
    customizations: ["Length (cropped, regular, long)", "Hood / collar", "Color blocking", "Embroidery, screen print"],
    sizeChart: defaultSizeChart,
    manufacturingStory: defaultStory
  },
  {
    slug: "vests",
    name: "Vests",
    category: "Outerwear",
    tagline: "Utility, puffer and tactical vests.",
    description: "Utility, tactical, and puffer vests with multi-pocket configurations and heavyweight hardware. Canvas, nylon or fleece shells — insulation and lining optional.",
    img: "/images/generated/product-vests-hero.webp",
    gallery: ["/images/generated/product-vests-hero.webp"],
    manufacturingInfographic: defaultInfographic,
    basePrice: 13,
    slabPricing: [
      { qty: "50–99", price: 13, savings: "—" },
      { qty: "100–199", price: 11, savings: "15%" },
      { qty: "200–499", price: 10, savings: "23%" },
      { qty: "500+", price: 8.5, savings: "35%" }
    ],
    freeShipping: true,
    fabric: "Canvas, nylon, fleece",
    weight: "Variable",
    availableSizes: defaultSizes,
    availableColors: defaultColors,
    customizations: ["Pocket count & style", "Hardware", "Insulation", "Lining"],
    sizeChart: defaultSizeChart,
    manufacturingStory: defaultStory
  }
];
const getProduct = (slug) => PRODUCTS.find((p) => p.slug === slug);
const STITCH_IMG = {
  factory: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIu4D199DgL2QtQgzbJ37FJYo0Hu45ij298wi8LKBUkGsH1sfuRwTDQhBx6VckwwuUwUqyv7otk00_W-_qrhYneM9TvDxeHT6H7Mrw9IJHEjCtUTEnlvAdhslcXaEBqvFUaPTngOIqGYWRidF1v6c2QkZTVO8hrL2fgxLyeGPY6UuHrhWb3HSItRMu9VmVFDW1mRbEU4JwbJPitdl-jhhjg2ZB7xYlR3gTmX4VY5xjEp4tUFWNb7KD5PrhA1M4jl0E3L5463vzM8YR"
};
function Home() {
  const scrollerRef = useRef(null);
  const [drag, setDrag] = useState({ active: false, startX: 0, startScroll: 0 });
  const scrollByCard = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const step = card ? card.offsetWidth + 24 : 360;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };
  const onDown = (e) => {
    const el = scrollerRef.current;
    if (!el) return;
    setDrag({ active: true, startX: e.pageX - el.offsetLeft, startScroll: el.scrollLeft });
  };
  const onMove = (e) => {
    if (!drag.active) return;
    const el = scrollerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = drag.startScroll - (x - drag.startX) * 1.4;
  };
  const onUp = () => setDrag((d) => ({ ...d, active: false }));
  return /* @__PURE__ */ jsxs("main", { "data-loc": "client\\src\\pages\\Home.tsx:50", className: "bg-[#F8F8F8] text-[#1A1A1A]", children: [
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Home.tsx:52", className: "relative min-h-[92vh] flex flex-col md:flex-row border-b-2 border-[#1A1A1A] paper-grain overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:54", className: "absolute top-14 left-8 text-[18rem] font-headline font-black text-[#E0E0E0] opacity-30 select-none z-0 leading-none pointer-events-none", children: "01" }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:57", className: "w-full md:w-[58%] p-10 md:p-20 flex flex-col justify-center z-10 relative", children: [
        /* @__PURE__ */ jsxs(
          "span",
          {
            "data-loc": "client\\src\\pages\\Home.tsx:58",
            className: "text-[#FE3136] text-xs uppercase tracking-[0.3em] mb-6 font-black flex items-center gap-3 animate-slide-up",
            style: { animationDelay: "0.05s" },
            children: [
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:62", className: "w-10 h-px bg-[#FE3136]" }),
              "01 / SIALKOT, PAKISTAN → USA"
            ]
          }
        ),
        /* @__PURE__ */ jsxs("h1", { "data-loc": "client\\src\\pages\\Home.tsx:66", className: "text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.92] font-headline font-black tracking-tighter mb-8 max-w-[900px]", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:67", className: "block animate-slide-up", style: { animationDelay: "0.15s" }, children: "Certified" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:68", className: "block animate-slide-up", style: { animationDelay: "0.3s" }, children: /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\pages\\Home.tsx:69", className: "relative inline-block", children: [
            "streetwear",
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:71", className: "absolute left-0 right-0 bottom-1 h-[6px] bg-[#FE3136]/30 -z-10 animate-underline" })
          ] }) }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:74", className: "block animate-slide-up", style: { animationDelay: "0.45s" }, children: "manufacturing for" }),
          /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\pages\\Home.tsx:75", className: "block animate-slide-up", style: { animationDelay: "0.6s" }, children: [
            /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\pages\\Home.tsx:76", className: "relative inline-block border-b-8 border-[#FE3136]", children: [
              "Black-owned brands",
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:78", className: "absolute inset-x-0 -bottom-2 h-2 animate-shimmer" })
            ] }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:80", className: "text-[#FE3136]", children: "." })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:85", className: "flex flex-wrap gap-2 mb-6 animate-slide-up", style: { animationDelay: "0.75s" }, children: [
          { k: "MOQ 50", sub: "ONLY" },
          { k: "7-DAY", sub: "SAMPLES" },
          { k: "15-DAY", sub: "BULK" },
          { k: "BSCI", sub: "CERT" },
          { k: "OEKO-TEX", sub: "CERT" },
          { k: "WRAP", sub: "CERT" }
        ].map((c, i) => /* @__PURE__ */ jsxs(
          "div",
          {
            "data-loc": "client\\src\\pages\\Home.tsx:94",
            className: "group relative border-2 border-[#1A1A1A] bg-white px-3 py-2 flex items-baseline gap-1.5 hover:bg-[#1A1A1A] hover:text-white transition-colors cursor-default",
            style: { animation: "slideUp 0.6s cubic-bezier(.2,.8,.2,1) both", animationDelay: `${0.8 + i * 0.07}s` },
            children: [
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:99", className: "font-headline font-black text-sm", children: c.k }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:100", className: "text-[9px] uppercase tracking-widest font-bold text-[#FE3136] group-hover:text-[#FE3136]", children: c.sub })
            ]
          },
          c.k
        )) }),
        /* @__PURE__ */ jsxs(
          "p",
          {
            "data-loc": "client\\src\\pages\\Home.tsx:105",
            className: "text-base text-[#3A3A3A] w-full max-w-[560px] mb-10 leading-relaxed animate-slide-up",
            style: { animationDelay: "1.2s" },
            children: [
              "Made in Sialkot, trusted by emerging brands in",
              " ",
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:110", className: "font-bold text-[#1A1A1A]", children: "Atlanta, Houston, LA, NYC, Detroit, and Chicago" }),
              ".",
              " ",
              "Direct access to the founder — ",
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:111", className: "text-[#FE3136] font-bold", children: "no middleman" }),
              "."
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:114", className: "flex flex-wrap gap-4 items-start animate-slide-up", style: { animationDelay: "1.35s" }, children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              "data-loc": "client\\src\\pages\\Home.tsx:115",
              href: "/inquire",
              className: "group relative px-10 py-5 bg-[#3E41B6] text-white font-bold uppercase tracking-widest border-2 border-[#1A1A1A] hover:translate-x-1 hover:translate-y-1 transition-transform overflow-hidden",
              children: [
                /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\pages\\Home.tsx:119", className: "relative z-10 flex items-center gap-3", children: [
                  "Get a Free Sample Quote",
                  /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:121", className: "inline-block group-hover:translate-x-1 transition-transform", children: "→" })
                ] }),
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:123", className: "absolute inset-0 bg-[#FE3136] translate-y-full group-hover:translate-y-0 transition-transform" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              "data-loc": "client\\src\\pages\\Home.tsx:125",
              href: "/certifications",
              className: "px-10 py-5 bg-white text-[#1A1A1A] font-bold uppercase tracking-widest border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors",
              children: "See Certifications"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            "data-loc": "client\\src\\pages\\Home.tsx:133",
            className: "mt-12 inline-flex items-center gap-2 bg-[#EEEEEE] px-4 py-2 border-2 border-[#1A1A1A] max-w-fit animate-slide-up",
            style: { animationDelay: "1.5s" },
            children: [
              /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\pages\\Home.tsx:137", className: "relative flex h-2.5 w-2.5", children: [
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:138", className: "absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" }),
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:139", className: "relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" })
              ] }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:141", className: "text-[10px] uppercase font-bold tracking-widest", children: "Factory online · 47 orders in production" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:146", className: "absolute bottom-8 right-8 md:top-1/2 md:bottom-auto md:right-auto md:left-[58%] md:-translate-x-1/2 md:-translate-y-1/2 w-28 h-28 md:w-32 md:h-32 bg-[#FE3136] rounded-full flex items-center justify-center stamp-rotate z-30 border-2 border-[#1A1A1A] animate-scale-in animate-glow-pulse", style: { animationDelay: "1.6s" }, children: /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\pages\\Home.tsx:147", className: "text-white text-center font-headline font-bold leading-tight", children: [
        "MOQ / 50",
        /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\pages\\Home.tsx:147" }),
        "ONLY"
      ] }) }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:151", className: "w-full md:w-[42%] relative min-h-[500px] overflow-hidden bg-[#1A1A1A]", children: [
        /* @__PURE__ */ jsx(
          "img",
          {
            "data-loc": "client\\src\\pages\\Home.tsx:153",
            className: "absolute inset-0 w-full h-full object-cover contrast-110 brightness-90 animate-ken-burns",
            src: "/images/generated/home-hero-factory-founder.webp",
            alt: "Pak Homies Industry factory floor in Sialkot"
          }
        ),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:159", className: "absolute inset-0 bg-gradient-to-br from-[#1A1A1A]/50 via-transparent to-[#1A1A1A]/70" }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:161", className: "absolute top-0 bottom-0 left-0 w-1 bg-[#FE3136]" }),
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-loc": "client\\src\\pages\\Home.tsx:164",
            className: "absolute top-10 right-6 bg-white border-2 border-[#1A1A1A] p-3 shadow-lg animate-slide-up",
            style: { animationDelay: "1.0s" },
            children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:168", className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(PackageCheck, { "data-loc": "client\\src\\pages\\Home.tsx:169", className: "w-5 h-5 text-[#3E41B6]", strokeWidth: 2.5 }),
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:170", children: [
                /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:171", className: "text-[9px] uppercase tracking-widest font-black text-[#3A3A3A]", children: "TRIPLE-CERTIFIED" }),
                /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:172", className: "text-xs font-black", children: "BSCI · OEKO · WRAP" })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-loc": "client\\src\\pages\\Home.tsx:177",
            className: "absolute bottom-10 right-6 bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] p-3 shadow-lg animate-slide-up",
            style: { animationDelay: "1.2s" },
            children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:181", className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(Truck, { "data-loc": "client\\src\\pages\\Home.tsx:182", className: "w-5 h-5 text-[#FE3136]", strokeWidth: 2.5 }),
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:183", children: [
                /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:184", className: "text-[9px] uppercase tracking-widest font-black text-white/60", children: "SHIPS DDP TO" }),
                /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:185", className: "text-xs font-black", children: "ANY US PORT" })
              ] })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:191", className: "absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm border-t-2 border-[#FE3136] px-5 py-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:192", className: "text-[9px] uppercase tracking-[0.3em] font-black text-white/60", children: "GANSARPUR · AIRPORT RD" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:193", className: "text-[9px] uppercase tracking-[0.3em] font-black text-[#FE3136]", children: "LIVE" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Home.tsx:199", className: "bg-[#3E41B6] border-b-2 border-[#1A1A1A] grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-[#1A1A1A] relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          "data-loc": "client\\src\\pages\\Home.tsx:200",
          className: "absolute inset-0 opacity-[0.07] animate-doodle-drift pointer-events-none",
          style: {
            backgroundImage: "url('/images/streetwear-doodle-pattern.png')",
            backgroundSize: "500px 500px",
            backgroundRepeat: "repeat"
          }
        }
      ),
      [
        ["50", "Minimum Order Qty", "pieces — published, no games"],
        ["07", "Day Samples", "tech-pack to your hands"],
        ["15", "Day Bulk Run", "from approved sample"],
        ["4H", "Founder Reply", "WhatsApp, GMT+5 hours"]
      ].map(([n, l, sub], i) => /* @__PURE__ */ jsxs(
        "div",
        {
          "data-loc": "client\\src\\pages\\Home.tsx:214",
          className: "group relative p-8 text-white flex flex-col items-center text-center cursor-default overflow-hidden transition-all duration-500 hover:bg-[#FE3136]",
          style: { animationDelay: `${i * 120}ms` },
          children: [
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:220", className: "absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:222", className: "relative text-6xl md:text-8xl font-headline font-black mb-2 inline-block transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-1 animate-slide-up", children: n }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:226", className: "relative block h-[3px] w-10 bg-white mb-3 transition-all duration-500 group-hover:w-24 group-hover:bg-white" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:227", className: "relative text-xs uppercase tracking-widest font-bold", children: l }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:229", className: "relative text-[10px] uppercase tracking-wider text-white/0 group-hover:text-white/90 mt-2 max-h-0 group-hover:max-h-10 overflow-hidden transition-all duration-500", children: sub })
          ]
        },
        l
      ))
    ] }),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Home.tsx:237", className: "py-24 border-b-2 border-[#1A1A1A] bg-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          "data-loc": "client\\src\\pages\\Home.tsx:238",
          className: "absolute inset-0 opacity-[0.08] animate-doodle-drift pointer-events-none",
          style: {
            backgroundImage: "url('/images/streetwear-doodle-pattern.png')",
            backgroundSize: "600px 600px",
            backgroundRepeat: "repeat"
          }
        }
      ),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:246", className: "container mx-auto px-6 relative z-10", children: [
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:247", className: "text-[#FE3136] text-xs uppercase tracking-[0.2em] font-bold block mb-4", children: "02 / THE HONEST COMPARISON" }),
        /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\Home.tsx:248", className: "text-5xl md:text-6xl font-headline font-black uppercase tracking-tight mb-4 max-w-4xl", children: [
          `You've Googled "streetwear manufacturer" 47 times. `,
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:248", className: "text-[#FE3136]", children: "Here's the trap nobody told you about." })
        ] }),
        /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\Home.tsx:249", className: "text-lg text-[#3A3A3A] max-w-3xl mb-12", children: [
          "Every factory you've messaged falls into one of two camps — and both will burn you. ",
          /* @__PURE__ */ jsx("strong", { "data-loc": "client\\src\\pages\\Home.tsx:249", className: "text-[#1A1A1A]", children: "Pakistan" }),
          " is dirt cheap, but you'll wait 3 weeks for a quote that never comes. ",
          /* @__PURE__ */ jsx("strong", { "data-loc": "client\\src\\pages\\Home.tsx:249", className: "text-[#1A1A1A]", children: "USA" }),
          " answers in an hour, then quotes you double. We built Pak Homies because we got tired of watching brands choose between ",
          /* @__PURE__ */ jsx("em", { "data-loc": "client\\src\\pages\\Home.tsx:249", children: "cheap-and-shady" }),
          " or ",
          /* @__PURE__ */ jsx("em", { "data-loc": "client\\src\\pages\\Home.tsx:249", children: "fast-and-broke" }),
          ". Read the columns below — slowly. The third one is the reason 247 brands moved their production to us last year."
        ] }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:250", className: "grid grid-cols-1 md:grid-cols-3 border-2 border-[#1A1A1A] divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#1A1A1A]", children: [
          {
            tag: "❌ THE GHOST FACTORIES",
            sub: "Pakistan Competitors",
            punch: "You'll save 40%. You'll also wait 60 days for a sample and pray it shows up.",
            bg: "bg-[#F8F8F8]",
            tc: "text-[#1A1A1A]",
            items: [
              'MOQ? "Send your tech pack first" (then silence)',
              'Lead times "depend on the season" — every season',
              "Zero certifications. Zero audit trail. Zero proof.",
              "Email-only. No WhatsApp. No video calls. No founder.",
              "You're talking to a sales agent, not the factory owner."
            ]
          },
          {
            tag: "💸 THE PREMIUM TAX",
            sub: "USA Competitors",
            punch: "Beautiful website. Fast replies. Quote that breaks your unit economics.",
            bg: "bg-[#EEEEEE]",
            tc: "text-[#1A1A1A]",
            items: [
              "Clear MOQ 50 — at $42/unit when you needed $18",
              "Polished policies, but built for $80 retail tees",
              "Some certifications (the cheap ones)",
              "Fast US delivery you'll fund with a credit card",
              "30–50% higher per-unit. Margins die at 100 pcs."
            ]
          },
          {
            tag: "✓ THE THIRD OPTION",
            sub: "Pak Homies ✓",
            punch: "Pakistani prices. American transparency. Audited like a European brand.",
            bg: "bg-[#3E41B6]",
            tc: "text-white",
            items: [
              'MOQ 50 — published, no hoops, no "call us"',
              "7-day samples, 15-day bulk. In writing. Or you don't pay.",
              "BSCI + OEKO-TEX + WRAP — three audits, framed on the wall",
              "Direct WhatsApp to the founder. Not a chatbot. Not an agent.",
              "All-in pricing: production + labels + freight to USA port"
            ]
          }
        ].map((col) => {
          const isUs = col.bg === "bg-[#3E41B6]";
          return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:297", className: `${col.bg} ${col.tc} p-10 min-h-[520px] flex flex-col ${isUs ? "relative" : ""}`, children: [
            isUs && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:299", className: "absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FE3136] text-white text-[10px] tracking-[0.2em] font-bold px-4 py-1.5 border-2 border-[#1A1A1A] rotate-[-2deg]", children: "★ START HERE ★" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:303", className: "text-[11px] uppercase tracking-[0.18em] font-bold mb-4 text-[#FE3136]", children: col.tag }),
            /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\pages\\Home.tsx:304", className: "text-3xl font-headline font-black uppercase mb-3 leading-none", children: col.sub }),
            /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\Home.tsx:305", className: `text-sm italic mb-7 ${isUs ? "text-white/85" : "text-[#555]"}`, children: [
              '"',
              col.punch,
              '"'
            ] }),
            /* @__PURE__ */ jsx("ul", { "data-loc": "client\\src\\pages\\Home.tsx:306", className: "space-y-4 text-sm", children: col.items.map((it) => /* @__PURE__ */ jsxs("li", { "data-loc": "client\\src\\pages\\Home.tsx:308", className: "flex gap-3 border-b border-current/20 pb-3 leading-snug", children: [
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:309", className: "material-symbols-outlined text-base shrink-0", children: isUs ? "check" : "close" }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:310", children: it })
            ] }, it)) })
          ] }, col.tag);
        }) }),
        /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\Home.tsx:318", className: "text-center text-[#1A1A1A] font-headline uppercase tracking-widest text-sm mt-10", children: [
          "Still scrolling? ",
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:319", className: "text-[#FE3136]", children: "Good." }),
          " Now scroll faster — your competitors already did."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Home.tsx:325", className: "border-b-2 border-[#1A1A1A] bg-white", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:326", className: "px-6 pt-16 pb-12 border-b-2 border-[#1A1A1A]", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:327", className: "container mx-auto", children: [
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:328", className: "text-[#FE3136] text-xs uppercase tracking-[0.2em] font-bold block mb-4", children: "05 / CATALOG" }),
        /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\Home.tsx:329", className: "text-5xl md:text-6xl font-headline font-black uppercase tracking-tight", children: "Nine garment types. All MOQ 50." }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Home.tsx:330", className: "text-lg text-[#3A3A3A] max-w-2xl mt-4", children: "Pick one or mix and match. All slab-priced. All certified. You customize — we produce." })
      ] }) }),
      [
        [
          { n: "01", name: "Denim Jackets", code: "DNM/JKT", hover: "#3E41B6", img: "/images/generated/product-denim-jacket-hero.webp" },
          { n: "02", name: "Fleece Pullovers", code: "FLC/HDY", hover: "#FE3136", img: "/images/generated/product-fleece-pullover-hero.webp" },
          { n: "03", name: "Trousers", code: "TRS/PNT", hover: "#1A1A1A", img: "/images/generated/product-trousers-hero.webp" }
        ],
        [
          { n: "04", name: "Shorts", code: "MESH/COR", hover: "#3E41B6", img: "/images/generated/product-shorts-hero.webp" },
          { n: "05", name: "T-Shirts", code: "SUP/TEE", hover: "#FE3136", img: "/images/generated/product-tshirt-hero.webp" },
          { n: "06", name: "Windbreakers", code: "TECH/SHL", hover: "#1A1A1A", img: "/images/generated/product-windbreaker-hero.webp" }
        ],
        [
          { n: "07", name: "Denim Pants", code: "RAW/DNM", hover: "#1A1A1A", img: "/images/generated/product-denim-pants-hero.webp" },
          { n: "08", name: "Puffer Jackets", code: "PFR/INS", hover: "#3E41B6", img: "/images/generated/product-puffer-jacket-hero.webp" },
          { n: "09", name: "Vests", code: "UTY/VST", hover: "#FE3136", img: "/images/generated/product-vests-hero.webp" }
        ]
      ].map((row, ri) => /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:350", className: `grid grid-cols-1 md:grid-cols-3 divide-x-2 divide-[#1A1A1A] ${ri < 2 ? "border-b-2 border-[#1A1A1A]" : ""}`, children: row.map((p) => /* @__PURE__ */ jsxs(Link, { "data-loc": "client\\src\\pages\\Home.tsx:352", href: "/products", className: "p-12 relative overflow-hidden group block border-b-2 md:border-b-0 border-[#1A1A1A]", children: [
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:353", className: "absolute top-4 right-4 text-6xl font-headline font-black outline-text z-0", children: p.n }),
        /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\pages\\Home.tsx:354", className: "text-2xl font-headline font-black uppercase mb-8 relative z-10", children: p.name }),
        "img" in p && p.img ? /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\pages\\Home.tsx:356", className: "w-full h-64 object-cover fussy-cut grayscale group-hover:grayscale-0 transition-all mb-4", src: p.img, alt: p.name }) : /* @__PURE__ */ jsx(
          "div",
          {
            "data-loc": "client\\src\\pages\\Home.tsx:358",
            className: "w-full h-64 bg-[#E0E0E0] flex items-center justify-center fussy-cut transition-colors group-hover:[background-color:var(--hoverc)] mb-4",
            style: { ["--hoverc"]: p.hover },
            children: /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:362", className: "text-[#F8F8F8] font-black text-4xl", children: p.code })
          }
        ),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:365", className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:366", className: "text-xs font-bold uppercase tracking-widest border-b-2 border-[#1A1A1A]", children: "Configure Order →" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:367", className: "text-[10px] uppercase font-bold text-[#767685]", children: "7D sample · 15D bulk" })
        ] })
      ] }, p.n)) }, ri))
    ] }),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Home.tsx:376", className: "py-24 border-b-2 border-[#1A1A1A] bg-[#EEEEEE] relative overflow-hidden", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          "data-loc": "client\\src\\pages\\Home.tsx:377",
          className: "absolute inset-0 opacity-[0.06] animate-doodle-drift pointer-events-none",
          style: {
            backgroundImage: "url('/images/streetwear-doodle-pattern.png')",
            backgroundSize: "560px 560px",
            backgroundRepeat: "repeat"
          }
        }
      ),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:385", className: "container mx-auto px-6 relative z-10", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:386", className: "flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:387", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:388", className: "text-[#FE3136] text-xs uppercase tracking-[0.2em] font-bold block mb-4", children: "06 / FEATURED DROPS" }),
          /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\Home.tsx:389", className: "text-5xl md:text-6xl font-headline font-black uppercase tracking-tight max-w-3xl", children: [
            "The garments brands keep ",
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:389", className: "text-[#3E41B6]", children: "re-ordering." })
          ] }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Home.tsx:390", className: "text-base text-[#3A3A3A] mt-4 max-w-xl", children: "Drag, swipe, or use the arrows. Every piece below is in production this week — click to see specs, sizes, and slab pricing." })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:392", className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              "data-loc": "client\\src\\pages\\Home.tsx:393",
              onClick: () => scrollByCard(-1),
              "aria-label": "Previous",
              className: "w-14 h-14 flex items-center justify-center border-2 border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] hover:text-white transition-colors",
              children: /* @__PURE__ */ jsx(ArrowLeft, { "data-loc": "client\\src\\pages\\Home.tsx:398", size: 20 })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              "data-loc": "client\\src\\pages\\Home.tsx:400",
              onClick: () => scrollByCard(1),
              "aria-label": "Next",
              className: "w-14 h-14 flex items-center justify-center border-2 border-[#1A1A1A] bg-[#3E41B6] text-white hover:bg-[#FE3136] transition-colors",
              children: /* @__PURE__ */ jsx(ArrowRight, { "data-loc": "client\\src\\pages\\Home.tsx:405", size: 20 })
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsx(
        "div",
        {
          "data-loc": "client\\src\\pages\\Home.tsx:412",
          ref: scrollerRef,
          onMouseDown: onDown,
          onMouseMove: onMove,
          onMouseUp: onUp,
          onMouseLeave: onUp,
          className: `flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 px-6 md:px-[max(1.5rem,calc((100vw-1280px)/2))] select-none ${drag.active ? "cursor-grabbing" : "cursor-grab"}`,
          style: { scrollbarWidth: "none" },
          children: PRODUCTS.map((p, i) => /* @__PURE__ */ jsxs(
            Link,
            {
              "data-loc": "client\\src\\pages\\Home.tsx:422",
              href: `/products/${p.slug}`,
              "data-card": true,
              onClick: (e) => {
                if (drag.active) e.preventDefault();
              },
              className: "group shrink-0 w-[280px] md:w-[340px] snap-start bg-white border-2 border-[#1A1A1A] hover:border-[#FE3136] transition-colors flex flex-col",
              draggable: false,
              children: [
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:430", className: "relative aspect-[4/5] overflow-hidden bg-[#F0F0F0]", children: [
                  /* @__PURE__ */ jsx(
                    "img",
                    {
                      "data-loc": "client\\src\\pages\\Home.tsx:431",
                      src: p.img,
                      alt: p.name,
                      draggable: false,
                      className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:437", className: "absolute top-3 left-3 bg-[#1A1A1A] text-white px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold", children: [
                    "0",
                    i + 1
                  ] }),
                  p.freeShipping && /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:441", className: "absolute top-3 right-3 bg-[#FE3136] text-white px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold inline-flex items-center gap-1", children: [
                    /* @__PURE__ */ jsx(Truck, { "data-loc": "client\\src\\pages\\Home.tsx:442", size: 11 }),
                    " FREE"
                  ] }),
                  /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:445", className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A1A1A] to-transparent p-3 text-white text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity", children: "View product →" })
                ] }),
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:449", className: "p-5 flex-1 flex flex-col", children: [
                  /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:450", className: "text-[10px] uppercase tracking-[0.2em] text-[#767685] font-bold", children: p.category }),
                  /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\pages\\Home.tsx:451", className: "font-headline font-black text-2xl mt-1 leading-tight", children: p.name }),
                  /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Home.tsx:452", className: "text-xs text-[#3A3A3A] mt-2 line-clamp-2", children: p.tagline }),
                  /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:453", className: "mt-4 pt-4 border-t border-[#E0E0E0] flex items-stretch justify-between gap-3", children: [
                    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:454", className: "flex-1 flex flex-col justify-between", children: [
                      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:455", className: "text-[11px] uppercase tracking-widest text-[#767685] font-bold", children: "From" }),
                      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:456", className: "font-headline font-black text-3xl text-[#3E41B6] leading-none mt-1", children: [
                        "$",
                        p.basePrice.toFixed(2)
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:458", className: "flex-1 flex flex-col justify-between text-right", children: [
                      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:459", className: "text-[11px] uppercase tracking-widest text-[#767685] font-bold", children: "MOQ" }),
                      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:460", className: "font-headline font-black text-3xl text-[#1A1A1A] leading-none mt-1", children: "50" })
                    ] })
                  ] })
                ] })
              ]
            },
            p.slug
          ))
        }
      ),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:468", className: "container mx-auto px-6 relative z-10 mt-6", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:469", className: "flex items-center justify-between flex-wrap gap-4", children: [
        /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\Home.tsx:470", className: "text-xs uppercase tracking-widest font-bold text-[#3A3A3A]", children: [
          "← Drag to scroll · ",
          PRODUCTS.length,
          " products in catalog →"
        ] }),
        /* @__PURE__ */ jsxs(Link, { "data-loc": "client\\src\\pages\\Home.tsx:473", href: "/products", className: "px-8 py-4 bg-[#1A1A1A] text-white font-bold uppercase tracking-widest text-sm border-2 border-[#1A1A1A] hover:bg-[#3E41B6] transition-colors inline-flex items-center gap-2", children: [
          "See full catalog ",
          /* @__PURE__ */ jsx(ArrowUpRight, { "data-loc": "client\\src\\pages\\Home.tsx:474", size: 16 })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Home.tsx:481", className: "relative py-16 border-b-2 border-[#1A1A1A] overflow-hidden bg-[#EEEEEE]", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          "data-loc": "client\\src\\pages\\Home.tsx:483",
          "aria-hidden": true,
          className: "absolute inset-0 opacity-[0.5] pointer-events-none",
          style: {
            backgroundImage: "linear-gradient(to right, #1A1A1A 1px, transparent 1px), linear-gradient(to bottom, #1A1A1A 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)"
          }
        }
      ),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:494", className: "absolute -bottom-10 -left-10 pointer-events-none select-none opacity-[0.06]", children: /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:495", className: "font-headline font-black text-[20rem] leading-none tracking-tighter", children: "TOOLS." }) }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:498", className: "container mx-auto px-6 relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:500", className: "flex flex-wrap items-end justify-between gap-4 mb-8 border-b-2 border-[#1A1A1A] pb-5", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:501", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:502", className: "flex items-center gap-3 mb-2", children: [
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:503", className: "text-[#FE3136] text-[10px] uppercase tracking-[0.3em] font-black", children: "§04 / IN-HOUSE TOOLING" }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:504", className: "h-px w-10 bg-[#FE3136]" })
            ] }),
            /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\Home.tsx:506", className: "text-3xl md:text-4xl font-headline font-black uppercase tracking-tight leading-none", children: [
              "Three tools. ",
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:507", className: "text-[#FE3136]", children: "Zero" }),
              " middlemen."
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:510", className: "flex gap-2", children: [
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:511", className: "text-[9px] uppercase tracking-widest font-black bg-[#1A1A1A] text-white px-2.5 py-1", children: "FREE" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:512", className: "text-[9px] uppercase tracking-widest font-black bg-[#FE3136] text-white px-2.5 py-1", children: "NO LOGIN" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:517", className: "grid grid-cols-1 md:grid-cols-3 gap-5", children: [
          {
            n: "01",
            meta: "DESIGN ENGINE",
            title: "3D Customizer",
            desc: "Configure garments in real-time 3D. Pick fabric, colorways, trims — export your spec.",
            Icon: Box,
            href: "/customize",
            cta: "LAUNCH BUILDER",
            bg: "#3E41B6",
            fg: "#ffffff",
            sub: "text-white/60",
            body: "text-white/75",
            btnCls: "bg-white text-[#3E41B6] hover:bg-[#FE3136] hover:text-white",
            shadow: "#FE3136",
            badge: null
          },
          {
            n: "02",
            meta: "IDENTITY SUITE",
            title: "Label Studio",
            desc: "Woven labels, hangtags, and care instructions — US-customs compliant out of the box.",
            Icon: Tag,
            href: "/capabilities/label-studio",
            cta: "OPEN STUDIO",
            bg: "#F8F8F8",
            fg: "#1A1A1A",
            sub: "text-[#3A3A3A]",
            body: "text-[#3A3A3A]",
            btnCls: "bg-[#1A1A1A] text-white hover:bg-[#3E41B6]",
            shadow: "#3E41B6",
            badge: "BETA"
          },
          {
            n: "03",
            meta: "SPECIFICATION",
            title: "Tech Pack Gen",
            desc: "Turn rough sketches into factory-ready blueprints with measurements, callouts & BOM.",
            Icon: FileCode,
            href: "/capabilities/techpack",
            cta: "GENERATE NOW",
            bg: "#1A1A1A",
            fg: "#FE3136",
            sub: "text-white/50",
            body: "text-white/70",
            btnCls: "bg-[#FE3136] text-white hover:bg-white hover:text-[#FE3136]",
            shadow: "#FE3136",
            badge: null
          }
        ].map((c) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:568", className: "relative group", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:569", className: "absolute inset-0 translate-x-1.5 translate-y-1.5 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform", style: { backgroundColor: c.shadow } }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:570", className: "relative border-2 border-[#1A1A1A] p-6 flex flex-col h-full", style: { backgroundColor: c.bg, color: c.fg === "#FE3136" ? "#ffffff" : c.fg }, children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:572", className: "flex items-start justify-between mb-5", children: [
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:573", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:574", className: `text-[9px] uppercase tracking-[0.3em] font-black ${c.sub}`, children: [
                "№ ",
                c.n,
                " · ",
                c.meta
              ] }) }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:576", className: "w-9 h-9 border-2 flex items-center justify-center flex-shrink-0", style: { borderColor: c.fg === "#1A1A1A" ? "#1A1A1A" : "rgba(255,255,255,0.3)" }, children: /* @__PURE__ */ jsx(c.Icon, { "data-loc": "client\\src\\pages\\Home.tsx:577", className: "w-4 h-4", strokeWidth: 2.5, style: { color: c.fg === "#FE3136" ? "#FE3136" : c.fg } }) })
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:582", className: "flex items-baseline gap-2 mb-2", children: [
              /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\pages\\Home.tsx:583", className: "text-2xl md:text-3xl font-headline font-black uppercase leading-none", style: { color: c.fg }, children: c.title }),
              c.badge && /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:585", className: "text-[8px] uppercase tracking-widest font-black text-[#FE3136] border border-[#FE3136] px-1.5 py-0.5 red-stamp", children: c.badge })
            ] }),
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Home.tsx:589", className: `text-[13px] leading-snug mb-6 ${c.body}`, children: c.desc }),
            /* @__PURE__ */ jsxs(
              Link,
              {
                "data-loc": "client\\src\\pages\\Home.tsx:591",
                href: c.href,
                className: `mt-auto flex items-center justify-between gap-3 px-4 py-3 font-black uppercase tracking-widest border-2 border-[#1A1A1A] transition-colors ${c.btnCls}`,
                children: [
                  /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:595", className: "text-[11px]", children: c.cta }),
                  /* @__PURE__ */ jsx(ArrowUpRight, { "data-loc": "client\\src\\pages\\Home.tsx:596", className: "w-4 h-4", strokeWidth: 3 })
                ]
              }
            )
          ] })
        ] }, c.n)) }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:604", className: "mt-6 flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-widest font-black text-[#3A3A3A]", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:605", className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:606", className: "w-1.5 h-1.5 rounded-full bg-[#FE3136] animate-pulse" }),
            "ALL TOOLS LIVE · NO ACCOUNT REQUIRED"
          ] }),
          /* @__PURE__ */ jsxs(Link, { "data-loc": "client\\src\\pages\\Home.tsx:609", href: "/inquire", className: "text-[#1A1A1A] hover:text-[#FE3136] flex items-center gap-1.5 transition-colors", children: [
            "OR TALK TO SHEHRAZ DIRECTLY ",
            /* @__PURE__ */ jsx(ArrowUpRight, { "data-loc": "client\\src\\pages\\Home.tsx:610", className: "w-3.5 h-3.5", strokeWidth: 3 })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { "data-loc": "client\\src\\pages\\Home.tsx:617", className: "border-b-2 border-[#1A1A1A] paper-grain", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:618", className: "flex flex-col md:flex-row divide-x-2 divide-[#1A1A1A]", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:619", className: "w-full md:w-1/2 p-12 border-b-2 md:border-b-0 border-[#1A1A1A] relative min-h-[500px]", children: [
        /* @__PURE__ */ jsx("img", { "data-loc": "client\\src\\pages\\Home.tsx:620", className: "w-full h-full object-cover fussy-cut grayscale", src: STITCH_IMG.factory, alt: "Factory" }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:621", className: "absolute bottom-20 left-20 bg-[#FE3136] text-white px-8 py-2 red-stamp text-xl font-headline font-black border-2 border-[#1A1A1A]", children: "MADE IN SIALKOT" })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:623", className: "w-full md:w-1/2 grid grid-cols-1 md:grid-cols-2 divide-x-2 divide-y-2 divide-[#1A1A1A]", children: [
        { icon: "lock", h: "Your IP Is Safe", p: "Confidentiality agreement on every order. We don't produce competing designs. We don't share yours. Direct relationship = no leaks." },
        { icon: "forum", h: "Direct Founder Access", p: "WhatsApp. Video calls. No middleman. Shehraz responds within 4 hours. Your questions are his priority." },
        { icon: "trending_up", h: "Start Small, Scale Big", p: "50 pieces to 500+ without switching factories. Same quality. No setup fees. Price drops at every slab tier." },
        { icon: "verified", h: "Ethical Proof, Visible", p: "BSCI, OEKO-TEX, WRAP — all three. Factory transparent. Worker safety verified. Your brand's integrity, protected." }
      ].map((t) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:630", className: "p-12", children: [
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:631", className: "material-symbols-outlined text-4xl mb-6 text-[#3E41B6] block", children: t.icon }),
        /* @__PURE__ */ jsx("h4", { "data-loc": "client\\src\\pages\\Home.tsx:632", className: "text-xl font-headline font-bold uppercase mb-4", children: t.h }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Home.tsx:633", className: "text-sm leading-relaxed", children: t.p })
      ] }, t.h)) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { "data-loc": "client\\src\\pages\\Home.tsx:641", className: "border-b-2 border-[#1A1A1A] bg-[#F8F8F8] paper-grain", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:642", className: "grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-[#1A1A1A]", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:644", className: "lg:col-span-5 relative bg-[#1A1A1A] p-10 md:p-14 flex items-center justify-center min-h-[640px] overflow-hidden", children: [
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:646", className: "absolute -bottom-20 -left-10 text-[24rem] font-headline font-black text-white/5 leading-none select-none pointer-events-none", children: "07" }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:649", className: "relative z-10 w-full max-w-[380px]", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:651", className: "absolute -inset-4 translate-x-3 translate-y-3 bg-[#FE3136] border-2 border-white/20" }),
          /* @__PURE__ */ jsx(
            "img",
            {
              "data-loc": "client\\src\\pages\\Home.tsx:654",
              src: "/images/generated/founder-shehraz-portrait.jpg",
              alt: "Shehraz — Founder, Pak Homies Industry",
              className: "relative z-10 w-full aspect-[4/5] object-cover fussy-cut grayscale border-2 border-white"
            }
          ),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:661", className: "absolute -top-4 -right-4 z-20 w-24 h-24 bg-white border-2 border-[#1A1A1A] rounded-full flex items-center justify-center red-stamp", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:662", className: "text-center", children: [
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:663", className: "text-[8px] font-black uppercase tracking-[0.15em] leading-none text-[#FE3136]", children: "EST." }),
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:664", className: "text-[#1A1A1A] text-2xl font-headline font-black leading-none mt-1", children: "2019" }),
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:665", className: "text-[7px] font-black uppercase tracking-widest leading-none mt-1 text-[#1A1A1A]", children: "SIALKOT" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:670", className: "relative z-20 mt-8 bg-white border-2 border-white p-4 text-[#1A1A1A]", children: [
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:671", className: "text-[10px] uppercase tracking-[0.2em] font-bold text-[#FE3136] mb-1", children: "FOUNDER · OWNER · OPERATOR" }),
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:672", className: "font-headline font-black text-3xl uppercase leading-none", children: "Shehraz" }),
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:673", className: "text-xs uppercase tracking-widest font-bold text-[#3A3A3A] mt-2", children: "Pak Homies Industry · Airport Rd, Sialkot" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:681", className: "lg:col-span-7 p-10 md:p-16 flex flex-col justify-between relative", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:683", className: "absolute top-10 right-10 flex items-center gap-3", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:684", className: "h-px w-12 bg-[#FE3136]" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:685", className: "text-[#FE3136] text-xs uppercase tracking-[0.2em] font-bold", children: "07 / A LETTER FROM THE FLOOR" })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:688", className: "mt-16 lg:mt-0", children: [
          /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\Home.tsx:689", className: "text-5xl md:text-6xl lg:text-7xl font-headline font-black uppercase leading-[0.95] tracking-tight mb-10", children: [
            "No middlemen.",
            /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\pages\\Home.tsx:690" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:691", className: "text-[#FE3136]", children: "Just me," }),
            " the floor,",
            /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\pages\\Home.tsx:691" }),
            "and your order."
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:695", className: "max-w-2xl space-y-5 text-[#1A1A1A] text-lg leading-relaxed", children: [
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Home.tsx:696", children: "I'm Shehraz. I run Pak Homies Industry from our floor on Airport Road in Sialkot — the same floor that's stitched BSCI, OEKO-TEX, and WRAP-certified garments for the past seven years." }),
            /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\Home.tsx:699", children: [
              "When you send an inquiry, it comes to ",
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:700", className: "font-bold", children: "my" }),
              " WhatsApp. When you request a sample, ",
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:700", className: "font-bold", children: "I" }),
              " walk it to the cutting table myself. When you scale from 50 pieces to 500, ",
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:700", className: "font-bold", children: "I" }),
              " allocate the line. No sales agent. No account manager. No telephone game."
            ] }),
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Home.tsx:702", children: "We built Pak Homies because Black-owned streetwear founders deserve factory access that other brands pay 3× more for. Same quality. Same certifications. Direct to the person who answers for every stitch." })
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:708", className: "mt-12 flex items-center gap-6", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:709", children: [
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:710", className: "font-headline font-black text-2xl italic text-[#3E41B6] leading-none", children: "— Shehraz" }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:711", className: "text-[10px] uppercase tracking-[0.2em] font-bold text-[#3A3A3A] mt-2", children: "FOUNDER, PAK HOMIES INDUSTRY" })
            ] }),
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:713", className: "h-16 w-px bg-[#1A1A1A]/20" }),
            /* @__PURE__ */ jsx(
              "a",
              {
                "data-loc": "client\\src\\pages\\Home.tsx:714",
                href: "https://wa.me/923285619939",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "inline-flex items-center gap-2 px-6 py-4 bg-[#1A1A1A] text-white font-bold uppercase tracking-widest text-xs border-2 border-[#1A1A1A] hover:bg-[#3E41B6] transition-colors",
                children: "WhatsApp Shehraz →"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:726", className: "mt-12 grid grid-cols-3 border-2 border-[#1A1A1A] divide-x-2 divide-[#1A1A1A]", children: [
          ["7+", "Years on the floor"],
          ["4 HRS", "Reply time, guaranteed"],
          ["100%", "Owner-operated"]
        ].map(([v, l]) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:732", className: "p-5 text-center bg-white", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:733", className: "font-headline font-black text-2xl md:text-3xl text-[#FE3136] leading-none", children: v }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:734", className: "text-[9px] uppercase tracking-widest font-bold text-[#3A3A3A] mt-2", children: l })
        ] }, l)) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Home.tsx:743", className: "bg-[#1A1A1A] py-24 border-b-2 border-[#1A1A1A] relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:745", className: "absolute top-8 right-8 text-[14rem] font-headline font-black text-white/5 select-none leading-none pointer-events-none", children: "09" }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:747", className: "container mx-auto px-6 relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:748", className: "mb-20 max-w-3xl", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:749", className: "text-[#FE3136] text-xs uppercase tracking-[0.2em] font-bold block mb-4", children: "09 / THE SIX-WEEK PIPELINE" }),
          /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\Home.tsx:750", className: "text-5xl md:text-6xl font-headline font-black uppercase text-white leading-none mb-4", children: [
            "From tech pack to ",
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:751", className: "text-[#FE3136]", children: "US port" }),
            " in six weeks."
          ] }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Home.tsx:753", className: "text-white/60 text-lg", children: "Published, guaranteed, tracked at every checkpoint. No vague estimates." })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:757", className: "relative", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:759", className: "hidden md:block absolute top-[68px] left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-[#3E41B6] via-[#FE3136] to-[#3E41B6]" }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:761", className: "grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-4", children: [
            { day: "DAY 1", title: "Inquiry", Icon: FileText, desc: "You submit tech pack + reference images. We confirm capacity within 4 hours." },
            { day: "DAY 7", title: "Sample", Icon: Scissors, desc: "Physical sample ships. You inspect fit, color, stitching, fabric weight." },
            { day: "WEEK 2", title: "Bulk Start", Icon: Cog, desc: "Approved. Pattern graded, fabric cut, production line allocated." },
            { day: "WEEK 5", title: "QC + Pack", Icon: PackageCheck, desc: "Every unit inspected. Labeled, polybagged, cartoned to your spec." },
            { day: "WEEK 6", title: "Port → US", Icon: Truck, desc: "DDP freight via Karachi port. Arrives at your US warehouse." }
          ].map((step, i) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:769", className: "relative flex flex-col items-center text-center group", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:771", className: "absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FE3136] text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border border-white z-20", children: [
              "0",
              i + 1
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:776", className: "relative z-10 w-[140px] h-[140px] mb-6", children: [
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:778", className: "absolute inset-0 translate-x-2 translate-y-2 bg-[#FE3136] border-2 border-white/20 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" }),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  "data-loc": "client\\src\\pages\\Home.tsx:780",
                  className: "absolute inset-0 border-2 border-white flex items-center justify-center overflow-hidden",
                  style: {
                    background: "linear-gradient(135deg, #F8F8F8 0%, #FFFFFF 60%, #E0E0E0 100%)"
                  },
                  children: [
                    /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:788", className: "absolute top-1.5 left-1.5 w-2 h-2 border-l-2 border-t-2 border-[#1A1A1A]" }),
                    /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:789", className: "absolute top-1.5 right-1.5 w-2 h-2 border-r-2 border-t-2 border-[#1A1A1A]" }),
                    /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:790", className: "absolute bottom-1.5 left-1.5 w-2 h-2 border-l-2 border-b-2 border-[#1A1A1A]" }),
                    /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:791", className: "absolute bottom-1.5 right-1.5 w-2 h-2 border-r-2 border-b-2 border-[#1A1A1A]" }),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        "data-loc": "client\\src\\pages\\Home.tsx:793",
                        className: "absolute inset-0 opacity-[0.08]",
                        style: {
                          backgroundImage: "linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)",
                          backgroundSize: "12px 12px"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:802", className: "absolute text-[7rem] font-headline font-black text-[#3E41B6]/10 leading-none select-none", children: i + 1 }),
                    /* @__PURE__ */ jsx(
                      step.Icon,
                      {
                        "data-loc": "client\\src\\pages\\Home.tsx:806",
                        strokeWidth: 1.5,
                        className: "relative z-10 w-14 h-14 text-[#1A1A1A] group-hover:text-[#3E41B6] transition-colors"
                      }
                    )
                  ]
                }
              ),
              i < 4 && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:813", className: "md:hidden absolute -bottom-10 left-1/2 -translate-x-1/2 text-[#FE3136] text-3xl", children: "↓" }),
              i < 4 && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:817", className: "hidden md:flex absolute top-1/2 -right-[calc(50%-16px)] -translate-y-1/2 text-[#FE3136] items-center text-2xl font-black", children: "→" })
            ] }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:824", className: "inline-block bg-white text-[#1A1A1A] text-[10px] font-black uppercase tracking-widest px-3 py-1 mb-3 border-2 border-white", children: step.day }),
            /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\pages\\Home.tsx:828", className: "text-white font-headline font-black uppercase text-2xl mb-3", children: step.title }),
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Home.tsx:829", className: "text-white/60 text-xs leading-relaxed max-w-[180px]", children: step.desc })
          ] }, step.day)) })
        ] }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:836", className: "mt-20 grid grid-cols-2 md:grid-cols-4 border-2 border-white/20 divide-x-2 divide-y-2 md:divide-y-0 divide-white/20", children: [
          ["50–75%", "Faster than competitors"],
          ["4 HRS", "Quote turnaround"],
          ["100%", "Units QC inspected"],
          ["DDP", "Freight included"]
        ].map(([v, l]) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:843", className: "p-6 text-center", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:844", className: "text-3xl md:text-4xl font-headline font-black text-[#FE3136] mb-1", children: v }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:845", className: "text-[10px] uppercase tracking-widest font-bold text-white/60", children: l })
        ] }, l)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Home.tsx:853", className: "relative py-28 border-b-2 border-[#1A1A1A] overflow-hidden bg-[#F8F8F8]", children: [
      /* @__PURE__ */ jsx(
        "div",
        {
          "data-loc": "client\\src\\pages\\Home.tsx:855",
          "aria-hidden": true,
          className: "absolute inset-0 opacity-[0.08] animate-doodle-drift pointer-events-none",
          style: {
            backgroundImage: "url('/images/streetwear-doodle-pattern.png')",
            backgroundSize: "600px 600px",
            backgroundRepeat: "repeat"
          }
        }
      ),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:865", className: "absolute inset-0 bg-gradient-to-b from-[#F8F8F8]/85 via-[#F8F8F8]/70 to-[#F8F8F8]/90 pointer-events-none" }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:867", className: "container mx-auto px-6 relative z-10", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:869", className: "text-center mb-20", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:870", className: "flex items-center justify-center gap-4 mb-6", children: [
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:871", className: "h-px w-16 bg-[#FE3136]" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:872", className: "text-[#FE3136] text-xs uppercase tracking-[0.3em] font-black", children: "§08 / TRIPLE-CERTIFIED" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:873", className: "h-px w-16 bg-[#FE3136]" })
          ] }),
          /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\Home.tsx:875", className: "text-5xl md:text-7xl lg:text-8xl font-headline font-black uppercase tracking-tight leading-[0.9]", children: [
            "The rarest combination",
            /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\pages\\Home.tsx:876" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:877", className: "outline-text", style: { WebkitTextStroke: "2px #FE3136", color: "transparent" }, children: "in Sialkot" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:877", className: "text-[#FE3136]", children: "." })
          ] }),
          /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\Home.tsx:879", className: "mt-6 text-sm md:text-base text-[#3A3A3A] max-w-2xl mx-auto", children: [
            "Three independent audits. Three separate auditors. All three stacked on one floor —",
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:881", className: "text-[#FE3136] font-bold", children: " fewer than 5% of Pakistani factories can say the same." })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:886", className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
          {
            logo: "/images/certs/bsci.png",
            badge: "BSCI",
            sub: "Audited annually",
            title: "Fair Labor + Transparency",
            desc: "Annual audits on wages, hours, freedom of association, health, safety, and environment.",
            bullets: ["Fair wages verified", "Safe conditions", "No child labor", "Supply chain transparency"],
            accent: "#3E41B6"
          },
          {
            logo: "/images/certs/oeko-tex.png",
            badge: "OEKO-TEX",
            sub: "Standard 100",
            title: "Chemically Safe Fabrics",
            desc: "Every fabric and finished garment is tested free from harmful chemicals and banned substances.",
            bullets: ["No harmful dyes", "Dermatologically safe", "Consumer-safe", "Environmental compliance"],
            accent: "#2E7D32"
          },
          {
            logo: "/images/certs/wrap.png",
            badge: "WRAP",
            sub: "Gold certified",
            title: "Lawful, Humane, Ethical",
            desc: "Independently verified production under lawful and humane conditions. The global gold standard.",
            bullets: ["Lawful labor", "Humane treatment", "No exploitation", "Community engagement"],
            accent: "#FE3136"
          }
        ].map((c, i) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:916", className: "relative group", children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              "data-loc": "client\\src\\pages\\Home.tsx:918",
              className: "absolute inset-0 translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform",
              style: { backgroundColor: c.accent }
            }
          ),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:923", className: "relative bg-white border-2 border-[#1A1A1A] p-10 flex flex-col h-full overflow-hidden", children: [
            /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\pages\\Home.tsx:925", className: "absolute -top-6 -right-4 text-[10rem] font-headline font-black text-[#1A1A1A]/[0.04] leading-none select-none pointer-events-none", children: [
              "0",
              i + 1
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:930", className: "relative mb-6 w-32 h-32 mx-auto md:mx-0", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  "data-loc": "client\\src\\pages\\Home.tsx:932",
                  className: "absolute inset-0 rounded-full border-2 border-dashed animate-spin-slow",
                  style: { borderColor: c.accent }
                }
              ),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:937", className: "absolute inset-2 rounded-full bg-white border-2 border-[#1A1A1A] flex items-center justify-center overflow-hidden animate-float-y group-hover:scale-105 transition-transform", children: /* @__PURE__ */ jsx(
                "img",
                {
                  "data-loc": "client\\src\\pages\\Home.tsx:938",
                  src: c.logo,
                  alt: `${c.badge} certification badge`,
                  className: "w-full h-full object-contain p-2",
                  loading: "lazy"
                }
              ) }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  "data-loc": "client\\src\\pages\\Home.tsx:946",
                  className: "absolute -bottom-1 -right-1 w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white font-black text-sm shadow-md",
                  style: { backgroundColor: c.accent },
                  children: "✓"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:955", className: "mb-4 relative z-10", children: [
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:956", className: "font-headline font-black text-3xl uppercase leading-none", style: { color: c.accent }, children: c.badge }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:957", className: "text-[10px] uppercase tracking-[0.3em] font-bold text-[#3A3A3A] mt-1", children: c.sub })
            ] }),
            /* @__PURE__ */ jsx("h4", { "data-loc": "client\\src\\pages\\Home.tsx:960", className: "font-headline font-black uppercase text-xl mb-3 relative z-10", children: c.title }),
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Home.tsx:961", className: "text-sm leading-relaxed text-[#3A3A3A] mb-6 relative z-10", children: c.desc }),
            /* @__PURE__ */ jsx("ul", { "data-loc": "client\\src\\pages\\Home.tsx:963", className: "space-y-2.5 mt-auto relative z-10 pt-5 border-t border-[#1A1A1A]/10", children: c.bullets.map((b) => /* @__PURE__ */ jsxs("li", { "data-loc": "client\\src\\pages\\Home.tsx:965", className: "flex items-center gap-3 text-xs uppercase font-bold tracking-wider", children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  "data-loc": "client\\src\\pages\\Home.tsx:966",
                  className: "w-4 h-4 flex items-center justify-center text-white text-[9px] font-black flex-shrink-0",
                  style: { backgroundColor: c.accent },
                  children: "✓"
                }
              ),
              b
            ] }, b)) })
          ] })
        ] }, c.badge)) }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:982", className: "mt-14 relative group", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:983", className: "absolute inset-0 bg-[#1A1A1A] translate-x-2 translate-y-2" }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:984", className: "relative border-2 border-[#1A1A1A] bg-white p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 items-center gap-6", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:985", className: "md:col-span-2", children: [
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:986", className: "text-[10px] uppercase tracking-[0.3em] font-black text-[#FE3136] mb-2", children: "THE RAREST STACK" }),
              /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\Home.tsx:987", className: "font-headline font-black text-2xl md:text-4xl uppercase leading-tight", children: [
                "Fewer than ",
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:988", className: "text-[#FE3136]", children: "5%" }),
                " of Pakistani manufacturers hold all three."
              ] }),
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Home.tsx:990", className: "text-xs md:text-sm uppercase tracking-widest font-bold text-[#3A3A3A] mt-3", children: "None of our direct competitors publicly display them." })
            ] }),
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:994", className: "flex md:justify-end gap-3", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:995", className: "bg-[#FE3136] text-white p-5 text-center red-stamp", children: [
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:996", className: "text-[9px] uppercase tracking-widest font-black", children: "VERIFIED" }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:997", className: "font-headline font-black text-3xl leading-none mt-1", children: "3/3" }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:998", className: "text-[9px] uppercase tracking-widest font-black mt-1", children: "STACKED" })
            ] }) })
          ] })
        ] })
      ] })
    ] }),
    (() => {
      const TESTIMONIALS = [
        { name: "Cameron R.", brand: "Crown Heights Denim", city: "ATLANTA, GA", avatar: "https://i.pravatar.cc/200?img=12", stars: 5, q: "First sample arrived in 7 days — stitching, weight, color all on point. No revisions. We went from 'waiting on the factory' to 'waiting on the drop.'" },
        { name: "Marcus T.", brand: "Third Ward Supply", city: "HOUSTON, TX", avatar: "https://i.pravatar.cc/200?img=33", stars: 5, q: "Direct WhatsApp to Shehraz. Zero gatekeepers. That alone saved us a month of email ping-pong with other factories." },
        { name: "Jada K.", brand: "Westside Index", city: "LOS ANGELES, CA", avatar: "https://i.pravatar.cc/200?img=47", stars: 5, q: "The BSCI + WRAP stack is why our retailer onboarded us in a single call. Compliance paperwork was already there." },
        { name: "Devon A.", brand: "Empire State Club", city: "NEW YORK, NY", avatar: "https://i.pravatar.cc/200?img=52", stars: 5, q: "Slab pricing meant we knew our margin before placing PO. No surprise invoices. No hidden freight. It just worked." },
        { name: "Rae M.", brand: "Motor City Militia", city: "DETROIT, MI", avatar: "https://i.pravatar.cc/200?img=45", stars: 5, q: "We dropped 250 pieces in 6 weeks from tech pack to warehouse. Every seam inspected, every label correct. Unreal." },
        { name: "Terrell W.", brand: "Southside Standard", city: "CHICAGO, IL", avatar: "https://i.pravatar.cc/200?img=59", stars: 5, q: "The 3D customizer let us lock the silhouette before cutting fabric. No wasted sample rounds. Saved us at least $2k." },
        { name: "Bianca L.", brand: "Forever Peachtree", city: "ATLANTA, GA", avatar: "https://i.pravatar.cc/200?img=23", stars: 5, q: "I sent a rough sketch on a Monday. Had a production-ready tech pack in my inbox Tuesday morning. That's the whole game." },
        { name: "Khalil J.", brand: "North Ave Goods", city: "BALTIMORE, MD", avatar: "https://i.pravatar.cc/200?img=68", stars: 5, q: "Heavyweight fleece at 500GSM, priced below what US factories quoted us for 380GSM. Same BSCI audit. Done deal." }
      ];
      return /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Home.tsx:1020", className: "relative border-y-2 border-[#1A1A1A] overflow-hidden", children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            "data-loc": "client\\src\\pages\\Home.tsx:1022",
            className: "absolute inset-0 bg-center bg-no-repeat bg-cover scale-110",
            style: { backgroundImage: "url('/images/testimonial_bg.png')", backgroundAttachment: "fixed" }
          }
        ),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1027", className: "absolute inset-0 bg-gradient-to-b from-[#0A0A0E]/95 via-[#0A0A0E]/85 to-[#0A0A0E]/95" }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1028", className: "absolute inset-0 paper-grain opacity-[0.04] mix-blend-overlay" }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1030", className: "absolute top-0 left-0 right-0 h-[3px] bg-[#FE3136]" }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1032", className: "relative z-10 py-24", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1034", className: "container mx-auto px-6 mb-16", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1035", className: "grid grid-cols-12 gap-8 items-end border-b border-white/10 pb-10", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1036", className: "col-span-12 md:col-span-8", children: [
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1037", className: "flex items-center gap-4 mb-6", children: [
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1038", className: "text-[#FE3136] text-xs uppercase tracking-[0.3em] font-black", children: "§11" }),
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1039", className: "h-px flex-1 max-w-[80px] bg-[#FE3136]" }),
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1040", className: "text-white/60 text-[10px] uppercase tracking-[0.3em] font-bold", children: "FOUNDER DISPATCHES" })
              ] }),
              /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\Home.tsx:1042", className: "text-5xl md:text-7xl lg:text-8xl font-headline font-black uppercase tracking-tight leading-[0.9] text-white", children: [
                "Shipped with",
                /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\pages\\Home.tsx:1043" }),
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1044", className: "outline-text", style: { WebkitTextStroke: "2px #FE3136", color: "transparent" }, children: "receipts" }),
                " ",
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1044", className: "text-[#FE3136]", children: "." })
              ] }),
              /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Home.tsx:1046", className: "text-white/60 text-sm md:text-base mt-6 max-w-xl leading-relaxed", children: "Unfiltered notes from the founders running the brands — straight off WhatsApp, straight to press." })
            ] }),
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1050", className: "col-span-12 md:col-span-4 flex md:justify-end", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1051", className: "bg-[#FE3136] text-white p-6 border-2 border-white/10 stamp-rotate inline-block", children: [
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1052", className: "text-[9px] uppercase tracking-[0.3em] font-black opacity-80", children: "TRUSTED BY" }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1053", className: "font-headline font-black text-5xl leading-none mt-1", children: "48+" }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1054", className: "text-[9px] uppercase tracking-[0.3em] font-black mt-1", children: "US FOUNDERS" })
            ] }) })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1061", className: "relative", children: [
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1062", className: "absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#0A0A0E] to-transparent z-10 pointer-events-none" }),
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1063", className: "absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#0A0A0E] to-transparent z-10 pointer-events-none" }),
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1065", className: "flex gap-8 animate-marquee whitespace-nowrap", style: { width: "max-content" }, children: [...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => /* @__PURE__ */ jsxs(
              "div",
              {
                "data-loc": "client\\src\\pages\\Home.tsx:1067",
                className: "w-[460px] flex-shrink-0 whitespace-normal relative group",
                children: [
                  /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1072", className: "absolute inset-0 bg-[#FE3136] translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" }),
                  /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1074", className: "relative bg-[#F8F8F8] border-2 border-[#1A1A1A] p-8 min-h-[340px] flex flex-col", children: [
                    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1076", className: "flex items-center justify-between pb-4 mb-5 border-b border-[#1A1A1A]/20", children: [
                      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1077", className: "flex gap-0.5", children: Array.from({ length: t.stars }).map((_, si) => /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1079", className: "text-[#FE3136] text-base", children: "★" }, si)) }),
                      /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\pages\\Home.tsx:1082", className: "text-[9px] uppercase tracking-[0.25em] font-black text-[#3A3A3A]", children: [
                        "DISPATCH № ",
                        String(i % TESTIMONIALS.length + 1).padStart(2, "0")
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1088", className: "absolute top-14 right-6 text-[#FE3136]/15 font-headline font-black leading-none pointer-events-none select-none", style: { fontSize: "140px" }, children: '"' }),
                    /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\Home.tsx:1093", className: "font-headline font-bold text-lg leading-snug relative z-10 flex-1 text-[#1A1A1A]", children: [
                      '"',
                      t.q,
                      '"'
                    ] }),
                    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1098", className: "flex items-center gap-4 pt-5 mt-5 border-t-2 border-[#1A1A1A] relative z-10", children: [
                      /* @__PURE__ */ jsx(
                        "img",
                        {
                          "data-loc": "client\\src\\pages\\Home.tsx:1099",
                          src: t.avatar,
                          alt: t.name,
                          className: "w-14 h-14 rounded-full border-2 border-[#1A1A1A] object-cover grayscale group-hover:grayscale-0 transition-all"
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1104", className: "flex-1 min-w-0", children: [
                        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1105", className: "font-headline font-black uppercase text-base truncate text-[#1A1A1A]", children: t.name }),
                        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1106", className: "text-[10px] uppercase tracking-widest font-black text-[#FE3136] truncate", children: t.brand }),
                        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1107", className: "text-[9px] uppercase tracking-widest font-bold text-[#767685] mt-0.5", children: t.city })
                      ] }),
                      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1109", className: "w-10 h-10 border-2 border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] font-black text-lg group-hover:bg-[#FE3136] group-hover:text-white group-hover:border-[#FE3136] transition-colors", children: "→" })
                    ] })
                  ] })
                ]
              },
              i
            )) })
          ] }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1120", className: "container mx-auto px-6 mt-16", children: /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1121", className: "grid grid-cols-2 md:grid-cols-4 border-2 border-white/20 divide-x divide-white/10 bg-black/30 backdrop-blur-sm", children: [
            { k: "4.9/5", v: "AVG RATING" },
            { k: "48+", v: "ACTIVE BRANDS" },
            { k: "6 WKS", v: "AVG LEAD TIME" },
            { k: "0", v: "MIDDLEMEN" }
          ].map((s) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1128", className: "p-6 text-center", children: [
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1129", className: "font-headline font-black text-3xl md:text-4xl text-white leading-none", children: s.k }),
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1130", className: "text-[10px] uppercase tracking-[0.25em] font-bold text-white/50 mt-2", children: s.v })
          ] }, s.v)) }) })
        ] })
      ] });
    })(),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Home.tsx:1141", className: "border-b-2 border-[#1A1A1A]", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1142", className: "p-6 bg-[#EEEEEE] border-b-2 border-[#1A1A1A]", children: /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\Home.tsx:1143", className: "text-xs font-bold uppercase tracking-[0.5em] text-center", children: "FOUNDERS IN: US STREETWEAR CAPITALS" }) }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1145", className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x-2 divide-y-2 lg:divide-y-0 divide-[#1A1A1A]", children: [
        { name: "Atlanta", tag: "ATL", img: "/images/cities/atlanta.png" },
        { name: "Houston", tag: "HOU", img: "/images/cities/houston.png" },
        { name: "Los Angeles", tag: "LAX", img: "/images/cities/los-angeles.png" },
        { name: "New York", tag: "NYC", img: "/images/cities/new-york.png" },
        { name: "Detroit", tag: "DTW", img: "/images/cities/detroit.png" },
        { name: "Chicago", tag: "CHI", img: "/images/cities/chicago.png" }
      ].map((c) => /* @__PURE__ */ jsxs(
        Link,
        {
          "data-loc": "client\\src\\pages\\Home.tsx:1154",
          href: `/streetwear-manufacturer-${c.name.toLowerCase().replace(" ", "-")}`,
          className: "relative overflow-hidden min-h-[240px] block group bg-[#1A1A1A]",
          children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                "data-loc": "client\\src\\pages\\Home.tsx:1160",
                className: "absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 scale-100 group-hover:scale-110 transition-all duration-700 ease-out",
                style: { backgroundImage: `url(${c.img})` }
              }
            ),
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1165", className: "absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/60 to-[#1A1A1A]/20 group-hover:from-[#3E41B6]/80 group-hover:via-[#1A1A1A]/40 transition-all duration-500" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1168", className: "absolute top-4 left-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/70 border border-white/30 px-2 py-0.5 group-hover:border-[#FE3136] group-hover:text-[#FE3136] transition-colors", children: c.tag }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1173", className: "absolute bottom-6 left-6 right-6 flex items-end justify-between", children: [
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1174", className: "font-headline font-black text-2xl uppercase text-white tracking-tight leading-none transition-transform duration-500 group-hover:-translate-y-1", children: c.name }),
              /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1177", className: "material-symbols-outlined text-[#FE3136] text-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-12", children: "location_on" })
            ] }),
            /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1183", className: "absolute bottom-0 left-0 right-0 h-[3px] bg-[#FE3136] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" })
          ]
        },
        c.name
      )) })
    ] }),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Home.tsx:1190", className: "relative py-28 border-b-2 border-[#1A1A1A] paper-grain overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1192", className: "absolute -top-10 -right-20 pointer-events-none select-none opacity-[0.06]", children: /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1193", className: "font-headline font-black text-[22rem] leading-none tracking-tighter outline-text", children: "FAQ." }) }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1196", className: "container mx-auto px-6 relative z-10", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1197", className: "grid grid-cols-12 gap-10 lg:gap-16", children: [
        /* @__PURE__ */ jsx("aside", { "data-loc": "client\\src\\pages\\Home.tsx:1199", className: "col-span-12 lg:col-span-4", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1200", className: "lg:sticky lg:top-24", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1201", className: "flex items-center gap-3 mb-6", children: [
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1202", className: "text-[#FE3136] text-xs uppercase tracking-[0.3em] font-black", children: "§13" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1203", className: "h-px w-16 bg-[#FE3136]" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1204", className: "text-[10px] uppercase tracking-[0.3em] font-bold text-[#3A3A3A]", children: "KNOW BEFORE YOU BUY" })
          ] }),
          /* @__PURE__ */ jsxs("h2", { "data-loc": "client\\src\\pages\\Home.tsx:1206", className: "text-6xl md:text-7xl font-headline font-black uppercase leading-[0.9] tracking-tight mb-6", children: [
            "Ask us",
            /* @__PURE__ */ jsx("br", { "data-loc": "client\\src\\pages\\Home.tsx:1207" }),
            /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1208", className: "text-[#FE3136]", children: "anything." })
          ] }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Home.tsx:1210", className: "text-[#3A3A3A] text-base leading-relaxed mb-8 max-w-sm", children: "Straight answers from the founder — no sales team, no runaround. If your question isn't here, WhatsApp Shehraz directly." }),
          /* @__PURE__ */ jsxs(
            "a",
            {
              "data-loc": "client\\src\\pages\\Home.tsx:1215",
              href: "https://wa.me/923285619939",
              target: "_blank",
              rel: "noreferrer",
              className: "block relative group",
              children: [
                /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1221", className: "absolute inset-0 bg-[#FE3136] translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" }),
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1222", className: "relative bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] p-6", children: [
                  /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1223", className: "text-[9px] uppercase tracking-[0.3em] font-black text-[#FE3136] mb-2", children: "STILL CURIOUS?" }),
                  /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1224", className: "font-headline font-black text-2xl uppercase leading-tight mb-3", children: "WHATSAPP THE FOUNDER" }),
                  /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1225", className: "flex items-center gap-3 text-xs uppercase tracking-widest font-bold text-white/60", children: [
                    /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1226", children: "+92 328 5619939" }),
                    /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1227", className: "ml-auto w-8 h-8 border border-white/30 flex items-center justify-center group-hover:bg-[#FE3136] group-hover:border-[#FE3136] transition-colors", children: "→" })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1233", className: "mt-8 grid grid-cols-2 gap-0 border-2 border-[#1A1A1A] divide-x-2 divide-[#1A1A1A]", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1234", className: "p-4 bg-white text-center", children: [
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1235", className: "font-headline font-black text-2xl text-[#3E41B6] leading-none", children: "< 4H" }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1236", className: "text-[9px] uppercase tracking-widest font-bold text-[#3A3A3A] mt-2", children: "REPLY TIME" })
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1238", className: "p-4 bg-white text-center", children: [
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1239", className: "font-headline font-black text-2xl text-[#3E41B6] leading-none", children: "7 DAYS" }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1240", className: "text-[9px] uppercase tracking-widest font-bold text-[#3A3A3A] mt-2", children: "FIRST SAMPLE" })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1247", className: "col-span-12 lg:col-span-8", children: [
          {
            cat: "PRICING",
            q: "What's your MOQ?",
            a: "50 pieces across all garments. No exceptions, no setup fees. If you want to test with 50 and scale to 500 later, we price each tier separately with no penalties."
          },
          {
            cat: "TIMELINE",
            q: "How fast are samples?",
            a: "7 days standard turnaround. Expedited (3–4 days) available on request. Most customers approve without revisions, so typical sample-to-bulk timeline is 10–14 days total."
          },
          {
            cat: "COMPLIANCE",
            q: "Are you really certified?",
            a: "Yes — BSCI, OEKO-TEX, and WRAP. All three verified by independent auditors, audited annually. Audit reports available on request. Fewer than 5% of Pakistani manufacturers hold all three."
          },
          {
            cat: "FACTORY",
            q: "Can I visit the factory in Sialkot?",
            a: "Absolutely. We host founders monthly at our Airport Road, Gansarpur facility. We'll arrange airport pickup and walk you through the entire floor — cutting, stitching, QC, packaging."
          },
          {
            cat: "LOGISTICS",
            q: "Who handles shipping to the US?",
            a: "We ship DDP to any US port or door. Freight, customs, duties — all bundled in your invoice. No surprise fees, no brokers to chase. Typical ocean transit 18–22 days; air freight 4–6 days for rush drops."
          },
          {
            cat: "DESIGN",
            q: "Do I need a tech pack to start?",
            a: "Nope. Send a sketch, a Pinterest board, or a reference garment — we'll build the tech pack for you inside 24 hours using our generator. Free on first order."
          }
        ].map(({ cat, q, a }, idx) => /* @__PURE__ */ jsxs(
          "details",
          {
            "data-loc": "client\\src\\pages\\Home.tsx:1280",
            className: "group relative border-2 border-[#1A1A1A] bg-white hover:bg-[#FAFAFA] mb-4 open:bg-white open:shadow-[6px_6px_0_0_#FE3136] transition-all",
            children: [
              /* @__PURE__ */ jsxs("summary", { "data-loc": "client\\src\\pages\\Home.tsx:1284", className: "flex items-center gap-6 p-6 md:p-7 list-none cursor-pointer", children: [
                /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1286", className: "flex-shrink-0 w-12 h-12 border-2 border-[#1A1A1A] flex items-center justify-center font-headline font-black text-lg group-open:bg-[#FE3136] group-open:text-white group-open:border-[#FE3136] transition-colors", children: String(idx + 1).padStart(2, "0") }),
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1291", className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1292", className: "text-[9px] uppercase tracking-[0.3em] font-black text-[#FE3136] mb-1.5", children: cat }),
                  /* @__PURE__ */ jsx("h4", { "data-loc": "client\\src\\pages\\Home.tsx:1293", className: "font-headline font-black uppercase text-lg md:text-xl leading-tight text-[#1A1A1A]", children: q })
                ] }),
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1297", className: "flex-shrink-0 relative w-10 h-10 border-2 border-[#1A1A1A] flex items-center justify-center group-open:bg-[#1A1A1A] transition-colors", children: [
                  /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1298", className: "block w-4 h-0.5 bg-[#1A1A1A] group-open:bg-white absolute transition-colors" }),
                  /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1299", className: "block w-4 h-0.5 bg-[#1A1A1A] group-open:bg-white absolute rotate-90 group-open:rotate-0 transition-transform" })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1304", className: "px-6 md:px-7 pb-7 pl-[88px] md:pl-[104px]", children: /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1305", className: "border-l-2 border-[#FE3136] pl-5", children: /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\Home.tsx:1306", className: "text-sm md:text-base leading-relaxed text-[#3A3A3A]", children: a }) }) })
            ]
          },
          q
        )) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx("section", { "data-loc": "client\\src\\pages\\Home.tsx:1317", className: "bg-[#FE3136] py-6 border-b-2 border-[#1A1A1A] overflow-hidden", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1318", className: "container mx-auto px-6 flex flex-wrap justify-between items-center gap-8", children: [
      /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1319", className: "text-white font-headline font-black text-2xl uppercase italic", children: "Ethical by default." }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1320", className: "flex flex-wrap gap-12", children: [
        ["energy_savings_leaf", "Solar Powered Floor"],
        ["payments", "Living Wage Certified"],
        ["recycling", "Zero-Waste Cutting"]
      ].map(([icon, label]) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1326", className: "flex items-center gap-2 text-white font-bold uppercase text-xs", children: [
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1327", className: "material-symbols-outlined", children: icon }),
        label
      ] }, label)) })
    ] }) }),
    /* @__PURE__ */ jsxs("section", { "data-loc": "client\\src\\pages\\Home.tsx:1336", className: "py-40 border-b-2 border-[#1A1A1A] paper-grain relative overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\Home.tsx:1337", className: "absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none", children: /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\Home.tsx:1338", className: "text-[25vw] font-headline font-black text-[#1A1A1A] outline-text tracking-tighter leading-none", children: "PAK HOMIES" }) }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\Home.tsx:1340", className: "container mx-auto px-6 text-center relative z-10", children: [
        /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\Home.tsx:1341", className: "text-7xl md:text-[9rem] font-headline font-black leading-none uppercase mb-12", children: "Let's build your next drop." }),
        /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\pages\\Home.tsx:1342", href: "/inquire", className: "inline-block px-20 py-8 bg-[#3E41B6] text-white text-2xl font-bold uppercase tracking-[0.2em] border-4 border-[#1A1A1A] hover:translate-x-2 hover:translate-y-2 transition-transform", children: "INQUIRE NOW" })
      ] })
    ] })
  ] });
}
const About = lazy(() => import("./assets/About-BL2W3NvQ.js"));
const WhyPakHomies = lazy(() => import("./assets/WhyPakHomies-CVaI8m0d.js"));
const Process = lazy(() => import("./assets/Process-D0rvgTHw.js"));
const Certifications = lazy(() => import("./assets/Certifications-DKqQI6D8.js"));
const Products = lazy(() => import("./assets/Products-txs0zUvs.js"));
const ProductDetail = lazy(() => import("./assets/ProductDetail-A6G5bYOM.js"));
const Capabilities = lazy(() => import("./assets/Capabilities-_vEHHz32.js"));
const Services = lazy(() => import("./assets/Services-BMuDiTci.js"));
const Shop = lazy(() => import("./assets/Shop-CGh1cXdT.js"));
const FAQ = lazy(() => import("./assets/FAQ-DDlNAK7S.js"));
const Contact = lazy(() => import("./assets/Contact-CjcTsTi5.js"));
const Inquire = lazy(() => import("./assets/Inquire-CIPc1oyh.js"));
const GeoLanding = lazy(() => import("./assets/GeoLanding-CXFA6txU.js"));
const Privacy = lazy(() => import("./assets/Privacy-B0gW0EE5.js"));
const Terms = lazy(() => import("./assets/Terms-D6QHr3xz.js"));
const Customize = lazy(() => import("./assets/Customize-lw7w8Gq9.js"));
const BrandingStudio = lazy(() => import("./assets/BrandingStudio-BsOQ1Dpr.js"));
const TechPackCreator = lazy(() => import("./assets/TechPackCreator-Ds8yMDEK.js"));
const AdminLogin = lazy(() => import("./assets/AdminLogin-DtGngGNH.js"));
const AdminDashboard = lazy(() => import("./assets/AdminDashboard-CKYR-jhV.js"));
const AdminOrders = lazy(() => import("./assets/AdminOrders-BpPC6fG9.js"));
const AdminOrderDetail = lazy(() => import("./assets/AdminOrderDetail-Cn6zDqk2.js"));
const AdminInquiries = lazy(() => import("./assets/AdminInquiries-Bbm4Kxzu.js"));
const AdminInquiryDetail = lazy(() => import("./assets/AdminInquiryDetail-Didt-TXG.js"));
const AdminCustomers = lazy(() => import("./assets/AdminCustomers-iERIltBn.js"));
const AdminProducts = lazy(() => import("./assets/AdminProducts-B55ImjVZ.js"));
const AdminAIStudio = lazy(() => import("./assets/AdminAIStudio-C8Rbg6Ww.js"));
const AdminProductAutomation = lazy(() => import("./assets/AdminProductAutomation-CiejMhwO.js"));
const AdminContent = lazy(() => import("./assets/AdminContent-EWpvEt-l.js"));
const AdminSettings = lazy(() => import("./assets/AdminSettings-BWNZM0y8.js"));
const AdminCategories = lazy(() => import("./assets/AdminCategories-BhKhBGHE.js"));
function PageLoader() {
  return /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\App.tsx:54", className: "min-h-[60vh] flex items-center justify-center", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\App.tsx:55", className: "flex flex-col items-center gap-4", children: [
    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\App.tsx:56", className: "w-8 h-8 border-2 border-[#3E41B6] border-t-transparent rounded-full animate-spin" }),
    /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\App.tsx:57", className: "text-[#555] text-sm tracking-widest uppercase", children: "Loading…" })
  ] }) });
}
const BARE_ROUTES = ["/admin-saad", "/customize", "/capabilities/label-studio", "/capabilities/techpack"];
function Redirect({ to }) {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation(to);
  }, [to, setLocation]);
  return null;
}
function Router() {
  return /* @__PURE__ */ jsx(Suspense, { "data-loc": "client\\src\\App.tsx:74", fallback: /* @__PURE__ */ jsx(PageLoader, { "data-loc": "client\\src\\App.tsx:74" }), children: /* @__PURE__ */ jsxs(Switch, { "data-loc": "client\\src\\App.tsx:75", children: [
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:76", path: "/", component: Home }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:77", path: "/about", component: About }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:78", path: "/why-pak-homies", component: WhyPakHomies }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:79", path: "/process", component: Process }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:80", path: "/certifications", component: Certifications }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:81", path: "/products", component: Products }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:82", path: "/products/:slug", component: ProductDetail }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:83", path: "/capabilities", component: Capabilities }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:84", path: "/capabilities/label-studio", component: BrandingStudio }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:85", path: "/capabilities/techpack", component: TechPackCreator }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:86", path: "/customize", component: Customize }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:87", path: "/faq", component: FAQ }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:88", path: "/contact", component: Contact }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:89", path: "/inquire", component: Inquire }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:90", path: "/cities/:region", component: GeoLanding }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:91", path: "/privacy", component: Privacy }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:92", path: "/terms", component: Terms }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:95", path: "/admin-saad", component: AdminDashboard }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:96", path: "/admin-saad/login", component: AdminLogin }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:97", path: "/admin-saad/orders", component: AdminOrders }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:98", path: "/admin-saad/orders/:id", component: AdminOrderDetail }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:99", path: "/admin-saad/inquiries", component: AdminInquiries }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:100", path: "/admin-saad/inquiries/:id", component: AdminInquiryDetail }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:101", path: "/admin-saad/customers", component: AdminCustomers }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:102", path: "/admin-saad/products", component: AdminProducts }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:103", path: "/admin-saad/ai-studio", component: AdminAIStudio }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:104", path: "/admin-saad/product-automation", component: AdminProductAutomation }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:105", path: "/admin-saad/content", component: AdminContent }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:106", path: "/admin-saad/settings", component: AdminSettings }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:107", path: "/admin-saad/categories", component: AdminCategories }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:110", path: "/shop", component: Shop }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:111", path: "/shop/:slug", children: (p) => /* @__PURE__ */ jsx(Redirect, { "data-loc": "client\\src\\App.tsx:111", to: `/products/${p.slug}` }) }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:112", path: "/services", component: Services }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:113", path: "/branding-studio", children: /* @__PURE__ */ jsx(Redirect, { "data-loc": "client\\src\\App.tsx:113", to: "/capabilities/label-studio" }) }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:114", path: "/tech-pack", children: /* @__PURE__ */ jsx(Redirect, { "data-loc": "client\\src\\App.tsx:114", to: "/capabilities/techpack" }) }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:115", path: "/rfq", children: /* @__PURE__ */ jsx(Redirect, { "data-loc": "client\\src\\App.tsx:115", to: "/inquire" }) }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:116", path: "/portfolio", children: /* @__PURE__ */ jsx(Redirect, { "data-loc": "client\\src\\App.tsx:116", to: "/" }) }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:117", path: "/blog", children: /* @__PURE__ */ jsx(Redirect, { "data-loc": "client\\src\\App.tsx:117", to: "/" }) }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:118", path: "/blog/:rest*", children: /* @__PURE__ */ jsx(Redirect, { "data-loc": "client\\src\\App.tsx:118", to: "/" }) }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:119", path: "/checkout", children: /* @__PURE__ */ jsx(Redirect, { "data-loc": "client\\src\\App.tsx:119", to: "/inquire" }) }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:120", path: "/checkout/:rest*", children: /* @__PURE__ */ jsx(Redirect, { "data-loc": "client\\src\\App.tsx:120", to: "/inquire" }) }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:122", path: "/404", component: NotFound }),
    /* @__PURE__ */ jsx(Route, { "data-loc": "client\\src\\App.tsx:123", component: NotFound })
  ] }) });
}
function Layout() {
  const [location] = useLocation();
  const isBare = BARE_ROUTES.some((r) => location.startsWith(r));
  if (isBare) {
    return /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\App.tsx:135", className: "min-h-screen bg-background text-foreground", children: /* @__PURE__ */ jsx(Router, { "data-loc": "client\\src\\App.tsx:136" }) });
  }
  return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\App.tsx:142", className: "min-h-screen bg-background text-foreground flex flex-col", children: [
    /* @__PURE__ */ jsx(ScrollToTop, { "data-loc": "client\\src\\App.tsx:143" }),
    /* @__PURE__ */ jsx(Navbar, { "data-loc": "client\\src\\App.tsx:144" }),
    /* @__PURE__ */ jsx("main", { "data-loc": "client\\src\\App.tsx:145", className: "flex-1 pt-[5.75rem]", children: /* @__PURE__ */ jsx(Router, { "data-loc": "client\\src\\App.tsx:146" }) }),
    /* @__PURE__ */ jsx(Footer, { "data-loc": "client\\src\\App.tsx:148" })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(ErrorBoundary, { "data-loc": "client\\src\\App.tsx:155", children: /* @__PURE__ */ jsx(ThemeProvider, { "data-loc": "client\\src\\App.tsx:156", defaultTheme: "light", children: /* @__PURE__ */ jsxs(TooltipProvider, { "data-loc": "client\\src\\App.tsx:157", children: [
    /* @__PURE__ */ jsx(Toaster, { "data-loc": "client\\src\\App.tsx:158" }),
    /* @__PURE__ */ jsx(Layout, { "data-loc": "client\\src\\App.tsx:159" })
  ] }) }) });
}
async function render(url) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 1e3 * 60 * 5
        // 5 minutes
      }
    }
  });
  const port = process.env.PORT || 3e3;
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: `http://localhost:${port}/api/trpc`,
        transformer: superjson,
        fetch(input, init) {
          return globalThis.fetch(input, init);
        }
      })
    ]
  });
  try {
    if (url === "/" || url.startsWith("/shop")) {
      console.log(`[SSR] Prefetching data for ${url}...`);
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: [["product", "list"], { input: { limit: 48, offset: 0 }, type: "query" }],
          queryFn: () => trpcClient.product.list.query({ limit: 48, offset: 0 })
        }),
        queryClient.prefetchQuery({
          queryKey: [["category", "listWithSubs"], { type: "query" }],
          queryFn: () => trpcClient.category.listWithSubs.query()
        })
      ]);
      console.log(`[SSR] Prefetching complete for ${url}.`);
    }
  } catch (err) {
    console.error("[SSR] Prefetch error:", err);
  }
  const helmetContext = {};
  const hook = () => [url, () => {
  }];
  const html = ReactDOMServer.renderToString(
    /* @__PURE__ */ jsx(React__default.StrictMode, { "data-loc": "client\\src\\entry-server.tsx:59", children: /* @__PURE__ */ jsx(HelmetProvider, { "data-loc": "client\\src\\entry-server.tsx:60", context: helmetContext, children: /* @__PURE__ */ jsx(Router$1, { "data-loc": "client\\src\\entry-server.tsx:61", hook, children: /* @__PURE__ */ jsx(trpc.Provider, { "data-loc": "client\\src\\entry-server.tsx:62", client: trpcClient, queryClient, children: /* @__PURE__ */ jsx(QueryClientProvider, { "data-loc": "client\\src\\entry-server.tsx:63", client: queryClient, children: /* @__PURE__ */ jsx(App, { "data-loc": "client\\src\\entry-server.tsx:64" }) }) }) }) }) })
  );
  const { helmet } = helmetContext;
  const dehydratedState = dehydrate(queryClient);
  return { html, helmet, dehydratedState };
}
export {
  Button as B,
  NotFound as N,
  PRODUCTS as P,
  Tooltip as T,
  TooltipTrigger as a,
  TooltipContent as b,
  cn as c,
  fileToBase64 as f,
  getProduct as g,
  render,
  trpc as t
};
