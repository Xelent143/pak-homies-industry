import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useCallback, useMemo, useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { LayoutDashboard, ShoppingBag, MessageSquare, Package, Bot, FolderTree, Users, Image, Wand2, Settings, ChevronRight, Store, LogOut, Menu, Search, Bell } from "lucide-react";
import { t as trpc, B as Button } from "../entry-server.js";
import { TRPCClientError } from "@trpc/client";
import { S as SEOHead } from "./SEOHead-oEJRQGbs.js";
const getLoginUrl = () => "/admin-saad/login";
function useAuth(options) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } = {};
  const utils = trpc.useUtils();
  const meQuery = trpc.auth.me.useQuery(void 0, {
    retry: false,
    refetchOnWindowFocus: false
  });
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(void 0, null);
    }
  });
  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      if (error instanceof TRPCClientError && error.data?.code === "UNAUTHORIZED") {
        return;
      }
      throw error;
    } finally {
      utils.auth.me.setData(void 0, null);
      await utils.auth.me.invalidate();
    }
  }, [logoutMutation, utils]);
  const state = useMemo(() => {
    localStorage.setItem(
      "manus-runtime-user-info",
      JSON.stringify(meQuery.data)
    );
    return {
      user: meQuery.data ?? null,
      loading: meQuery.isLoading || logoutMutation.isPending,
      error: meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: Boolean(meQuery.data)
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending
  ]);
  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading || logoutMutation.isPending) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;
    window.location.href = redirectPath;
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    logoutMutation.isPending,
    meQuery.isLoading,
    state.user
  ]);
  return {
    ...state,
    refresh: () => meQuery.refetch(),
    logout
  };
}
const NAVIGATION = [
  { name: "Dashboard", href: "/admin-saad", icon: LayoutDashboard, exact: true },
  { name: "Orders", href: "/admin-saad/orders", icon: ShoppingBag },
  { name: "Inquiries", href: "/admin-saad/inquiries", icon: MessageSquare },
  { name: "Products", href: "/admin-saad/products", icon: Package },
  { name: "Automation", href: "/admin-saad/product-automation", icon: Bot },
  { name: "Categories", href: "/admin-saad/categories", icon: FolderTree },
  { name: "Customers", href: "/admin-saad/customers", icon: Users },
  { name: "Content", href: "/admin-saad/content", icon: Image },
  { name: "AI Studio", href: "/admin-saad/ai-studio", icon: Wand2 },
  { name: "Settings", href: "/admin-saad/settings", icon: Settings }
];
function AdminSidebar({ isMobileOpen, setMobileOpen }) {
  const [location] = useLocation();
  const { logout, user } = useAuth();
  const isActive = (href, exact = false) => {
    if (exact) return location === href || location === href + "/";
    return location.startsWith(href);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    isMobileOpen && /* @__PURE__ */ jsx(
      "div",
      {
        "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:36",
        className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden",
        onClick: () => setMobileOpen(false)
      }
    ),
    /* @__PURE__ */ jsxs("aside", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:43", className: `
        fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px] bg-[#0c0c0e] flex flex-col transition-transform duration-300 ease-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `, children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:48", className: "h-[72px] flex items-center px-5 border-b border-white/[0.06] shrink-0", children: /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:49", href: "/", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:50", className: "flex items-center gap-3 cursor-pointer group", children: [
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:51", className: "w-9 h-9 bg-gradient-to-br from-gold to-gold/70 rounded-lg flex items-center justify-center shadow-lg shadow-gold/20 group-hover:shadow-gold/40 transition-shadow", children: /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:52", className: "text-black font-extrabold text-sm", children: "S" }) }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:54", className: "leading-none", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:55", className: "text-white font-condensed font-bold text-sm tracking-[0.08em] uppercase block", children: "Sialkot Sample" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:56", className: "text-gold/80 font-condensed font-semibold text-[11px] tracking-[0.12em] uppercase block mt-0.5", children: "Admin Panel" })
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsxs("nav", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:63", className: "flex-1 overflow-y-auto py-5 px-3 space-y-0.5 scrollbar-none", children: [
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:64", className: "text-[10px] font-condensed font-bold uppercase tracking-[0.2em] text-white/30 px-3 mb-3", children: "Main Menu" }),
        NAVIGATION.map((item) => {
          const active = isActive(item.href, item.exact);
          return /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:70", href: item.href, children: /* @__PURE__ */ jsxs(
            "div",
            {
              "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:71",
              className: `
                    relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-200 group
                    ${active ? "bg-white/[0.08] text-white" : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"}
                  `,
              onClick: () => setMobileOpen(false),
              children: [
                active && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:83", className: "absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gold rounded-r-full" }),
                /* @__PURE__ */ jsx(item.icon, { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:86", className: `w-[18px] h-[18px] shrink-0 transition-colors ${active ? "text-gold" : "text-white/40 group-hover:text-white/60"}` }),
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:87", className: "flex-1", children: item.name }),
                active && /* @__PURE__ */ jsx(ChevronRight, { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:90", className: "w-3.5 h-3.5 text-white/30" })
              ]
            }
          ) }, item.name);
        })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:99", className: "border-t border-white/[0.06] p-3 shrink-0 space-y-2", children: [
        /* @__PURE__ */ jsx(Link, { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:101", href: "/", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:102", className: "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-white/40 hover:bg-white/[0.04] hover:text-white/70 cursor-pointer transition-all group", children: [
          /* @__PURE__ */ jsx(Store, { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:103", className: "w-[18px] h-[18px] text-white/30 group-hover:text-white/50" }),
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:104", children: "Visit Store" }),
          /* @__PURE__ */ jsx(ChevronRight, { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:105", className: "w-3 h-3 ml-auto text-white/20" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:110", className: "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03]", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:111", className: "w-8 h-8 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-xs shrink-0", children: user?.name?.charAt(0).toUpperCase() || "A" }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:114", className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:115", className: "text-white text-xs font-medium truncate", children: user?.name || "Admin" }),
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:116", className: "text-white/30 text-[10px] truncate", children: user?.email || "admin" })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:118",
              onClick: () => logout(),
              className: "w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0",
              title: "Sign Out",
              children: /* @__PURE__ */ jsx(LogOut, { "data-loc": "client\\src\\components\\admin\\AdminSidebar.tsx:123", className: "w-4 h-4" })
            }
          )
        ] })
      ] })
    ] })
  ] });
}
const BREADCRUMB_MAP = {
  "/admin-saad": "Dashboard",
  "/admin-saad/orders": "Orders",
  "/admin-saad/products": "Products",
  "/admin-saad/customers": "Customers",
  "/admin-saad/content": "Content",
  "/admin-saad/ai-studio": "AI Studio",
  "/admin-saad/settings": "Settings",
  "/admin-saad/product/new": "New Product"
};
function AdminTopBar({ setMobileOpen }) {
  const { user } = useAuth();
  const [location] = useLocation();
  const pageName = BREADCRUMB_MAP[location] || (location.startsWith("/admin-saad/orders/") ? "Order Details" : location.startsWith("/admin-saad/product/edit/") ? "Edit Product" : "Admin");
  return /* @__PURE__ */ jsxs("header", { "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:25", className: "h-[60px] bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:26", className: "flex items-center gap-4 flex-1", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:27",
          variant: "ghost",
          size: "icon",
          className: "lg:hidden text-muted-foreground hover:text-foreground w-9 h-9",
          onClick: () => setMobileOpen(true),
          children: /* @__PURE__ */ jsx(Menu, { "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:33", className: "w-5 h-5" })
        }
      ),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:37", className: "hidden sm:flex items-center gap-2 text-sm", children: [
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:38", className: "text-muted-foreground/60", children: "Admin" }),
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:39", className: "text-muted-foreground/40", children: "/" }),
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:40", className: "font-semibold text-foreground", children: pageName })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:44", className: "flex items-center gap-2 shrink-0", children: [
      /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:46", variant: "ghost", size: "icon", className: "text-muted-foreground hover:text-foreground w-9 h-9", children: /* @__PURE__ */ jsx(Search, { "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:47", className: "w-4 h-4" }) }),
      /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:51", variant: "ghost", size: "icon", className: "relative text-muted-foreground hover:text-foreground w-9 h-9", children: [
        /* @__PURE__ */ jsx(Bell, { "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:52", className: "w-4 h-4" }),
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:53", className: "absolute top-2 right-2 w-2 h-2 bg-gold rounded-full ring-2 ring-background" })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:57", className: "w-px h-6 bg-border mx-1 hidden sm:block" }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:60", className: "flex items-center gap-2.5 pl-1", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:61", className: "text-right hidden sm:block", children: [
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:62", className: "text-xs font-semibold text-foreground leading-none", children: user?.name || "Admin" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:63", className: "text-[10px] text-muted-foreground mt-0.5", children: "Administrator" })
        ] }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\components\\admin\\AdminTopBar.tsx:65", className: "h-8 w-8 rounded-full bg-gradient-to-br from-gold/40 to-gold/10 border border-gold/20 flex items-center justify-center font-bold text-xs text-gold", children: user?.name?.charAt(0).toUpperCase() || "A" })
      ] })
    ] })
  ] });
}
function AdminLayout({ children }) {
  const [isMobileOpen, setMobileOpen] = useState(false);
  return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\layouts\\AdminLayout.tsx:10", className: "min-h-screen bg-background flex text-foreground", children: [
    /* @__PURE__ */ jsx(SEOHead, { "data-loc": "client\\src\\pages\\layouts\\AdminLayout.tsx:11", noIndex: true }),
    /* @__PURE__ */ jsx(AdminSidebar, { "data-loc": "client\\src\\pages\\layouts\\AdminLayout.tsx:12", isMobileOpen, setMobileOpen }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\layouts\\AdminLayout.tsx:14", className: "flex-1 flex flex-col min-w-0", children: [
      /* @__PURE__ */ jsx(AdminTopBar, { "data-loc": "client\\src\\pages\\layouts\\AdminLayout.tsx:15", setMobileOpen }),
      /* @__PURE__ */ jsx("main", { "data-loc": "client\\src\\pages\\layouts\\AdminLayout.tsx:16", className: "flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8", children: /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\layouts\\AdminLayout.tsx:17", className: "max-w-[1200px] mx-auto", children }) })
    ] })
  ] });
}
export {
  AdminLayout as A
};
