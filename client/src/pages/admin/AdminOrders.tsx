import { Loader2, RefreshCw, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import AdminLayout from "@/pages/layouts/AdminLayout";

export default function AdminOrders() {
    const { data: orders, isLoading, refetch } = trpc.order.adminList.useQuery();
    const utils = trpc.useUtils();

    const updateStatus = trpc.order.updateStatus.useMutation({
        onSuccess: () => { utils.order.adminList.invalidate(); toast.success("Status updated"); },
    });

    const STATUS_COLORS: Record<string, string> = {
        pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
        paid: "bg-blue-500/20 text-blue-400 border-blue-500/30",
        processing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
        shipped: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
        delivered: "bg-green-500/20 text-green-400 border-green-500/30",
        cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
        refunded: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-foreground">Orders</h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage and update customer orders.</p>
                    </div>
                    <Button onClick={() => refetch()} variant="outline">
                        <RefreshCw className="w-4 h-4 mr-2" /> Refresh
                    </Button>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12 text-muted-foreground">
                            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading orders...
                        </div>
                    ) : (orders ?? []).length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="bg-secondary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground mb-1">No orders yet</h3>
                            <p className="text-muted-foreground text-sm max-w-sm mx-auto">When customers place orders, they will appear here for you to manage and fulfill.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-secondary/50 border-b border-border">
                                    <tr>
                                        {["Order", "Customer", "Destination", "Total", "Status", "Date", "Actions"].map(h => (
                                            <th key={h} className="px-6 py-3.5 text-left font-condensed font-bold uppercase tracking-wider text-xs text-muted-foreground">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {(orders ?? []).map(order => (
                                        <tr key={order.id} className="hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => window.location.href = `/admin-saad/orders/${order.id}`}>
                                            <td className="px-6 py-4 font-mono text-sm font-bold text-gold">{order.orderNumber}</td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-foreground">{order.customerName}</div>
                                                <div className="text-muted-foreground text-xs mt-0.5">{order.customerEmail}</div>
                                                {order.companyName && <div className="text-muted-foreground text-xs">{order.companyName}</div>}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">{order.country}</td>
                                            <td className="px-6 py-4 font-condensed font-bold text-foreground">${Number(order.totalAmount).toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <Badge className={`border ${STATUS_COLORS[order.status] ?? ""}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                                {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4" onClick={e => e.stopPropagation()}>
                                                <div className="flex items-center gap-2">
                                                    <Select
                                                        value={order.status}
                                                        onValueChange={(v) => updateStatus.mutate({ id: order.id, status: v as any })}
                                                    >
                                                        <SelectTrigger className="w-[130px] h-8 text-xs bg-background">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"].map(s => (
                                                                <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
