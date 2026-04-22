import { Link, useLocation } from "wouter";
import {
    LayoutDashboard, ShoppingBag, Package, Users, Settings,
    Image as ImageIcon, Wand2, LogOut, ChevronRight, Store, MessageSquare,
    FolderTree, Bot
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { IMAGES } from "@/lib/images";

const NAVIGATION = [
    { name: "Dashboard", href: "/admin-saad", icon: LayoutDashboard, exact: true },
    { name: "Orders", href: "/admin-saad/orders", icon: ShoppingBag },
    { name: "Inquiries", href: "/admin-saad/inquiries", icon: MessageSquare },
    { name: "Products", href: "/admin-saad/products", icon: Package },
    { name: "Automation", href: "/admin-saad/product-automation", icon: Bot },
    { name: "Categories", href: "/admin-saad/categories", icon: FolderTree },
    { name: "Customers", href: "/admin-saad/customers", icon: Users },
    { name: "Content", href: "/admin-saad/content", icon: ImageIcon },
    { name: "AI Studio", href: "/admin-saad/ai-studio", icon: Wand2 },
    { name: "Settings", href: "/admin-saad/settings", icon: Settings },
];

export default function AdminSidebar({ isMobileOpen, setMobileOpen }: { isMobileOpen: boolean, setMobileOpen: (v: boolean) => void }) {
    const [location] = useLocation();
    const { logout, user } = useAuth();

    const isActive = (href: string, exact: boolean = false) => {
        if (exact) return location === href || location === href + "/";
        return location.startsWith(href);
    };

    return (
        <>
            {/* Mobile Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:sticky top-0 left-0 z-50 h-screen w-[260px] bg-[#0c0c0e] flex flex-col transition-transform duration-300 ease-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
                {/* Brand Header */}
                <div className="h-[72px] flex items-center px-5 border-b border-white/[0.06] shrink-0">
                    <Link href="/">
                        <div className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-9 h-9 bg-gradient-to-br from-gold to-gold/70 rounded-lg flex items-center justify-center shadow-lg shadow-gold/20 group-hover:shadow-gold/40 transition-shadow">
                                <span className="text-black font-extrabold text-sm">S</span>
                            </div>
                            <div className="leading-none">
                                <span className="text-white font-condensed font-bold text-sm tracking-[0.08em] uppercase block">Sialkot Sample</span>
                                <span className="text-gold/80 font-condensed font-semibold text-[11px] tracking-[0.12em] uppercase block mt-0.5">Admin Panel</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-0.5 scrollbar-none">
                    <p className="text-[10px] font-condensed font-bold uppercase tracking-[0.2em] text-white/30 px-3 mb-3">
                        Main Menu
                    </p>
                    {NAVIGATION.map((item) => {
                        const active = isActive(item.href, item.exact);
                        return (
                            <Link key={item.name} href={item.href}>
                                <div
                                    className={`
                    relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium cursor-pointer transition-all duration-200 group
                    ${active
                                            ? "bg-white/[0.08] text-white"
                                            : "text-white/50 hover:bg-white/[0.04] hover:text-white/80"
                                        }
                  `}
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {/* Active indicator */}
                                    {active && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gold rounded-r-full" />
                                    )}

                                    <item.icon className={`w-[18px] h-[18px] shrink-0 transition-colors ${active ? "text-gold" : "text-white/40 group-hover:text-white/60"}`} />
                                    <span className="flex-1">{item.name}</span>

                                    {active && (
                                        <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer: User + Sign Out */}
                <div className="border-t border-white/[0.06] p-3 shrink-0 space-y-2">
                    {/* Visit Store */}
                    <Link href="/">
                        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-white/40 hover:bg-white/[0.04] hover:text-white/70 cursor-pointer transition-all group">
                            <Store className="w-[18px] h-[18px] text-white/30 group-hover:text-white/50" />
                            <span>Visit Store</span>
                            <ChevronRight className="w-3 h-3 ml-auto text-white/20" />
                        </div>
                    </Link>

                    {/* User info + Sign Out */}
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/[0.03]">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 border border-gold/20 flex items-center justify-center text-gold font-bold text-xs shrink-0">
                            {user?.name?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-xs font-medium truncate">{user?.name || "Admin"}</p>
                            <p className="text-white/30 text-[10px] truncate">{user?.email || "admin"}</p>
                        </div>
                        <button
                            onClick={() => logout()}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all shrink-0"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
