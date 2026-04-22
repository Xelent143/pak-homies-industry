import { Menu, Search, Bell, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

const BREADCRUMB_MAP: Record<string, string> = {
    "/admin-saad": "Dashboard",
    "/admin-saad/orders": "Orders",
    "/admin-saad/products": "Products",
    "/admin-saad/customers": "Customers",
    "/admin-saad/content": "Content",
    "/admin-saad/ai-studio": "AI Studio",
    "/admin-saad/settings": "Settings",
    "/admin-saad/product/new": "New Product",
};

export default function AdminTopBar({ setMobileOpen }: { setMobileOpen: (v: boolean) => void }) {
    const { user } = useAuth();
    const [location] = useLocation();

    // Generate breadcrumb
    const pageName = BREADCRUMB_MAP[location] || (location.startsWith("/admin-saad/orders/") ? "Order Details" : location.startsWith("/admin-saad/product/edit/") ? "Edit Product" : "Admin");

    return (
        <header className="h-[60px] bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-4 flex-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden text-muted-foreground hover:text-foreground w-9 h-9"
                    onClick={() => setMobileOpen(true)}
                >
                    <Menu className="w-5 h-5" />
                </Button>

                {/* Breadcrumb */}
                <div className="hidden sm:flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground/60">Admin</span>
                    <span className="text-muted-foreground/40">/</span>
                    <span className="font-semibold text-foreground">{pageName}</span>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                {/* Search */}
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground w-9 h-9">
                    <Search className="w-4 h-4" />
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground w-9 h-9">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-gold rounded-full ring-2 ring-background" />
                </Button>

                {/* Separator */}
                <div className="w-px h-6 bg-border mx-1 hidden sm:block" />

                {/* User */}
                <div className="flex items-center gap-2.5 pl-1">
                    <div className="text-right hidden sm:block">
                        <p className="text-xs font-semibold text-foreground leading-none">{user?.name || "Admin"}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Administrator</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gold/40 to-gold/10 border border-gold/20 flex items-center justify-center font-bold text-xs text-gold">
                        {user?.name?.charAt(0).toUpperCase() || "A"}
                    </div>
                </div>
            </div>
        </header>
    );
}
