import AdminLayout from "@/pages/layouts/AdminLayout";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DollarSign, ShoppingBag, Package, TrendingUp,
    Clock, CheckCircle2, Truck, ArrowUpRight, AlertCircle,
    ExternalLink, Plus, Eye, MessageSquare
} from "lucide-react";
import { trpc } from "@/lib/trpc";

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    paid: "bg-blue-500/15 text-blue-500 border-blue-500/30",
    processing: "bg-violet-500/15 text-violet-500 border-violet-500/30",
    shipped: "bg-cyan-500/15 text-cyan-500 border-cyan-500/30",
    delivered: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
    cancelled: "bg-red-500/15 text-red-500 border-red-500/30",
    refunded: "bg-orange-500/15 text-orange-500 border-orange-500/30",
};

export default function AdminDashboard() {
    const { data: stats, isLoading } = trpc.order.adminStats.useQuery();

    const kpis = [
        {
            label: "Total Revenue",
            value: `$${stats?.totalRevenue ?? "0.00"}`,
            sub: `${stats?.paidOrderCount ?? 0} paid orders`,
            icon: DollarSign,
            iconBg: "bg-emerald-500/10",
            iconColor: "text-emerald-500",
            accent: "from-emerald-500/20 to-transparent",
        },
        {
            label: "Total Orders",
            value: stats?.orderCount ?? 0,
            sub: `${stats?.pendingCount ?? 0} pending • ${stats?.processingCount ?? 0} processing`,
            icon: ShoppingBag,
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-500",
            accent: "from-blue-500/20 to-transparent",
        },
        {
            label: "Products",
            value: stats?.productCount ?? 0,
            sub: `${stats?.activeProductCount ?? 0} active in catalog`,
            icon: Package,
            iconBg: "bg-violet-500/10",
            iconColor: "text-violet-500",
            accent: "from-violet-500/20 to-transparent",
        },
        {
            label: "Avg. Order Value",
            value: stats?.orderCount
                ? `$${(parseFloat(stats.totalRevenue) / (stats.paidOrderCount || 1)).toFixed(2)}`
                : "$0.00",
            sub: "Per paid order",
            icon: TrendingUp,
            iconBg: "bg-gold/10",
            iconColor: "text-gold",
            accent: "from-gold/20 to-transparent",
        },
        {
            label: "Inquiries",
            value: stats?.inquiryCount ?? 0,
            sub: `${stats?.newInquiryCount ?? 0} new inquiries`,
            icon: MessageSquare,
            iconBg: "bg-cyan-500/10",
            iconColor: "text-cyan-500",
            accent: "from-cyan-500/20 to-transparent",
        },
    ];

    const recentOrders = stats?.recentOrders ?? [];
    const recentInquiries = (stats as any)?.recentInquiries ?? [];

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-condensed text-3xl font-extrabold tracking-tight text-foreground uppercase">
                            Dashboard
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Welcome back. Here's what's happening with your store.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/admin-saad/product/new">
                            <Button className="bg-gold hover:bg-gold/90 text-black font-condensed font-bold uppercase tracking-wider text-xs h-9 px-4">
                                <Plus className="w-4 h-4 mr-1.5" /> New Product
                            </Button>
                        </Link>
                        <Link href="/">
                            <Button variant="outline" size="sm" className="text-xs font-medium gap-1.5">
                                <ExternalLink className="w-3.5 h-3.5" /> View Store
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                    {kpis.map((kpi) => (
                        <div
                            key={kpi.label}
                            className="relative overflow-hidden bg-card border border-border rounded-2xl p-5 group hover:border-border/80 transition-all duration-300 hover:shadow-lg hover:shadow-black/5"
                        >
                            {/* Accent gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${kpi.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

                            <div className="relative flex items-start justify-between">
                                <div className="space-y-3">
                                    <p className="text-xs font-condensed font-bold uppercase tracking-[0.15em] text-muted-foreground">
                                        {kpi.label}
                                    </p>
                                    <p className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
                                        {isLoading ? (
                                            <span className="inline-block w-20 h-8 bg-secondary/80 rounded animate-pulse" />
                                        ) : (
                                            kpi.value
                                        )}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{kpi.sub}</p>
                                </div>
                                <div className={`w-11 h-11 rounded-xl ${kpi.iconBg} flex items-center justify-center shrink-0`}>
                                    <kpi.icon className={`w-5 h-5 ${kpi.iconColor}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Status Pills */}
                <div className="flex flex-wrap gap-3">
                    {(stats?.pendingCount ?? 0) > 0 && (
                        <Link href="/admin-saad/orders">
                            <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-full px-4 py-2 text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition-colors">
                                <Clock className="w-3.5 h-3.5" />
                                {stats?.pendingCount} Pending Orders
                                <ArrowUpRight className="w-3 h-3" />
                            </div>
                        </Link>
                    )}
                    {(stats?.processingCount ?? 0) > 0 && (
                        <Link href="/admin-saad/orders">
                            <div className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 text-violet-500 rounded-full px-4 py-2 text-xs font-bold cursor-pointer hover:bg-violet-500/20 transition-colors">
                                <Truck className="w-3.5 h-3.5" />
                                {stats?.processingCount} Processing
                                <ArrowUpRight className="w-3 h-3" />
                            </div>
                        </Link>
                    )}
                </div>

                {/* Recent Orders */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <div>
                            <h2 className="font-condensed font-bold text-sm uppercase tracking-[0.12em] text-foreground">
                                Recent Orders
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">Latest activity in your store</p>
                        </div>
                        <Link href="/admin-saad/orders">
                            <Button variant="ghost" size="sm" className="text-xs text-gold hover:text-gold/80 gap-1">
                                View All <ArrowUpRight className="w-3 h-3" />
                            </Button>
                        </Link>
                    </div>

                    {recentOrders.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground">No orders yet. They'll appear here once customers start ordering.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-secondary/30">
                                        {["Order", "Customer", "Items", "Total", "Status", "Date", ""].map(h => (
                                            <th key={h} className="px-6 py-3 text-left text-[10px] font-condensed font-bold uppercase tracking-[0.15em] text-muted-foreground">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {recentOrders.map((order: any) => {
                                        let items: any[] = [];
                                        try { items = typeof order.items === "string" ? JSON.parse(order.items) : order.items || []; } catch { }
                                        const totalQty = items.reduce((s: number, i: any) => s + (i.qty || 0), 0);

                                        return (
                                            <tr key={order.id} className="group hover:bg-secondary/20 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="font-mono text-xs font-bold text-gold">{order.orderNumber}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="font-semibold text-foreground text-sm">{order.customerName}</p>
                                                    <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-muted-foreground">
                                                        {items.length} item{items.length !== 1 ? "s" : ""} • {totalQty} units
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-foreground tabular-nums">${Number(order.totalAmount).toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    <Badge className={`border text-[10px] font-bold ${STATUS_COLORS[order.status] || ""}`}>
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">
                                                    {new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Link href={`/admin-saad/orders/${order.id}`}>
                                                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8">
                                                            <Eye className="w-4 h-4 text-muted-foreground" />
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                {/* Recent Inquiries */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                        <div>
                            <h2 className="font-condensed font-bold text-sm uppercase tracking-[0.12em] text-foreground">
                                Recent Inquiries
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">Latest quote requests from your website</p>
                        </div>
                        <Link href="/admin-saad/inquiries">
                            <Button variant="ghost" size="sm" className="text-xs text-gold hover:text-gold/80 gap-1">
                                View All <ArrowUpRight className="w-3 h-3" />
                            </Button>
                        </Link>
                    </div>

                    {recentInquiries.length === 0 ? (
                        <div className="text-center py-12 px-4">
                            <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground">No inquiries yet. They'll appear here when customers submit quote requests.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-secondary/30">
                                        {["Company", "Contact", "Product", "Qty", "Status", "Date"].map(h => (
                                            <th key={h} className="px-6 py-3 text-left text-[10px] font-condensed font-bold uppercase tracking-[0.15em] text-muted-foreground">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {recentInquiries.map((inq: any) => (
                                        <tr key={inq.id} className="group hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => window.location.href = `/admin-saad/inquiries/${inq.id}`}>
                                            <td className="px-6 py-4 font-semibold text-foreground">{inq.companyName}</td>
                                            <td className="px-6 py-4">
                                                <p className="text-foreground">{inq.contactName}</p>
                                                <p className="text-xs text-muted-foreground">{inq.email}</p>
                                            </td>
                                            <td className="px-6 py-4 text-foreground">{inq.productType}</td>
                                            <td className="px-6 py-4 font-mono text-foreground">{inq.quantity}</td>
                                            <td className="px-6 py-4">
                                                <Badge className={`border text-[10px] font-bold ${STATUS_COLORS[inq.status] || ""}`}>
                                                    {inq.status.charAt(0).toUpperCase() + inq.status.slice(1)}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">
                                                {new Date(inq.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Link href="/admin-saad/product/new">
                        <div className="bg-card border border-border rounded-2xl p-5 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5 transition-all cursor-pointer group">
                            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Plus className="w-5 h-5 text-gold" />
                            </div>
                            <h3 className="font-condensed font-bold text-sm uppercase tracking-wider text-foreground mb-1">Add Product</h3>
                            <p className="text-xs text-muted-foreground">Create a new product listing</p>
                        </div>
                    </Link>
                    <Link href="/admin-saad/orders">
                        <div className="bg-card border border-border rounded-2xl p-5 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all cursor-pointer group">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <ShoppingBag className="w-5 h-5 text-blue-500" />
                            </div>
                            <h3 className="font-condensed font-bold text-sm uppercase tracking-wider text-foreground mb-1">Manage Orders</h3>
                            <p className="text-xs text-muted-foreground">View and process customer orders</p>
                        </div>
                    </Link>
                    <Link href="/admin-saad/products">
                        <div className="bg-card border border-border rounded-2xl p-5 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 transition-all cursor-pointer group">
                            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <Package className="w-5 h-5 text-violet-500" />
                            </div>
                            <h3 className="font-condensed font-bold text-sm uppercase tracking-wider text-foreground mb-1">Product Catalog</h3>
                            <p className="text-xs text-muted-foreground">Edit products, images & pricing</p>
                        </div>
                    </Link>
                </div>
            </div>
        </AdminLayout>
    );
}
