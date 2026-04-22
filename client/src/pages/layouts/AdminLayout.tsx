import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import SEOHead from "@/components/SEOHead";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isMobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background flex text-foreground">
            <SEOHead noIndex={true} />
            <AdminSidebar isMobileOpen={isMobileOpen} setMobileOpen={setMobileOpen} />

            <div className="flex-1 flex flex-col min-w-0">
                <AdminTopBar setMobileOpen={setMobileOpen} />
                <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
                    <div className="max-w-[1200px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
