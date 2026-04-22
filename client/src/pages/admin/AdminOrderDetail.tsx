import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import AdminLayout from "@/pages/layouts/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft, User, Mail, Phone, Building2, MapPin, CreditCard,
    FileText, Package, Loader2, Download, Calendar, Hash, Truck
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    paid: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    processing: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    shipped: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    delivered: "bg-green-500/20 text-green-400 border-green-500/30",
    cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
    refunded: "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

// ─── PDF Invoice Generator ────────────────────────────────────────────────────

async function generateInvoicePDF(order: any) {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF("p", "mm", "a4");
    const W = 210;
    const margin = 20;
    const contentW = W - margin * 2;
    let y = 20;

    const gold = [183, 150, 90] as [number, number, number];
    const dark = [20, 20, 20] as [number, number, number];
    const mid = [100, 100, 100] as [number, number, number];
    const lightBg = [248, 248, 245] as [number, number, number];

    // ── Header ──
    doc.setFillColor(...dark);
    doc.rect(0, 0, W, 48, "F");

    // Company name
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Pak Homies Industry", margin, 22);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(200, 200, 200);
    doc.text("Custom Apparel Manufacturing | Sialkot, Pakistan", margin, 30);
    doc.text("info@pakhomiesind.com  |  +92 302 292 2242", margin, 36);

    // Invoice title
    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("INVOICE", W - margin, 25, { align: "right" });
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text(`#${order.orderNumber}`, W - margin, 34, { align: "right" });

    y = 58;

    // ── Invoice details row ──
    doc.setFillColor(...lightBg);
    doc.rect(margin, y, contentW, 22, "F");

    doc.setTextColor(...mid);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("DATE", margin + 5, y + 6);
    doc.text("STATUS", margin + 55, y + 6);
    doc.text("PAYMENT METHOD", margin + 105, y + 6);

    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
    });
    doc.text(dateStr, margin + 5, y + 16);
    doc.text(order.status?.toUpperCase() || "PENDING", margin + 55, y + 16);
    doc.text((order.paymentMethod || "invoice").toUpperCase(), margin + 105, y + 16);

    y += 32;

    // ── Bill To ──
    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("BILL TO", margin, y);

    y += 6;
    doc.setTextColor(...dark);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(order.customerName, margin, y);
    y += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...mid);
    if (order.companyName) { doc.text(order.companyName, margin, y); y += 4.5; }
    doc.text(order.customerEmail, margin, y); y += 4.5;
    if (order.customerPhone) { doc.text(order.customerPhone, margin, y); y += 4.5; }
    doc.text(order.addressLine1, margin, y); y += 4.5;
    if (order.addressLine2) { doc.text(order.addressLine2, margin, y); y += 4.5; }
    doc.text(`${order.city}${order.state ? `, ${order.state}` : ""} ${order.postalCode || ""}`, margin, y); y += 4.5;
    doc.text(order.country, margin, y);

    y += 12;

    // ── Items Table ──
    // Header row
    // Column positions: ITEM=+4, SIZE=+72, COLOR=+88, QTY=+110, PRICE=+128, TOTAL=right
    const colItem = margin + 4;
    const colSize = margin + 72;
    const colColor = margin + 88;
    const colQty = margin + 108;
    const colPrice = margin + 124;
    const colTotal = W - margin - 4;

    doc.setFillColor(...dark);
    doc.rect(margin, y, contentW, 9, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("ITEM", colItem, y + 6);
    doc.text("SIZE", colSize, y + 6);
    doc.text("COLOR", colColor, y + 6);
    doc.text("QTY", colQty, y + 6);
    doc.text("PRICE", colPrice, y + 6);
    doc.text("TOTAL", colTotal, y + 6, { align: "right" });

    y += 9;

    // Parse items
    let items: any[] = [];
    try { items = typeof order.items === "string" ? JSON.parse(order.items) : order.items || []; } catch { }

    items.forEach((item: any, i: number) => {
        const rowH = 10;
        if (i % 2 === 0) {
            doc.setFillColor(252, 252, 250);
            doc.rect(margin, y, contentW, rowH, "F");
        }

        doc.setTextColor(...dark);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const title = item.title?.length > 30 ? item.title.substring(0, 30) + "..." : item.title;
        doc.text(title || "Product", colItem, y + 7);
        doc.text(item.size || "—", colSize, y + 7);
        const colorText = (item.color || "—").length > 10 ? item.color.substring(0, 10) + ".." : item.color || "—";
        doc.text(colorText, colColor, y + 7);
        doc.text(String(item.qty), colQty, y + 7);
        doc.text(`$${Number(item.unitPrice).toFixed(2)}`, colPrice, y + 7);

        const lineTotal = (item.qty * item.unitPrice).toFixed(2);
        doc.setFont("helvetica", "bold");
        doc.text(`$${lineTotal}`, colTotal, y + 7, { align: "right" });

        y += rowH;
    });

    // Separator line
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y, W - margin, y);
    y += 6;

    // ── Totals ──
    const totalsX = margin + 110;
    const totalsValX = W - margin - 4;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...mid);
    doc.text("Subtotal", totalsX, y);
    doc.setTextColor(...dark);
    doc.text(`$${Number(order.subtotal).toFixed(2)}`, totalsValX, y, { align: "right" });
    y += 6;

    doc.setTextColor(...mid);
    doc.text("Shipping", totalsX, y);
    doc.setTextColor(...dark);
    doc.text(`$${Number(order.shippingCost).toFixed(2)}`, totalsValX, y, { align: "right" });
    y += 8;

    // Total row with gold accent
    doc.setFillColor(...gold);
    doc.rect(totalsX - 4, y - 4, W - margin - totalsX + 8, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("TOTAL", totalsX, y + 4);
    doc.text(`$${Number(order.totalAmount).toFixed(2)}`, totalsValX, y + 4, { align: "right" });

    y += 24;

    // ── Footer notes ──
    doc.setDrawColor(220, 220, 220);
    doc.line(margin, y, W - margin, y);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...mid);
    doc.text("PAYMENT TERMS", margin, y);
    y += 4;
    doc.text("Payment is due upon receipt. For bank transfer orders, payment must be received within 7 days.", margin, y);
    y += 8;
    doc.text("BANK DETAILS", margin, y);
    y += 4;
    doc.text("Bank: [Your Bank Name]  |  Account: [Your Account Number]  |  SWIFT: [Your SWIFT Code]", margin, y);
    y += 8;

    doc.setTextColor(...gold);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("Thank you for your business!", margin, y);

    // Bottom bar
    doc.setFillColor(...dark);
    doc.rect(0, 287, W, 10, "F");
    doc.setTextColor(150, 150, 150);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text("Pak Homies Industry  •  Sialkot Industrial Estate, Sialkot 51310, Punjab, Pakistan  •  www.pakhomiesind.com", W / 2, 293, { align: "center" });

    doc.save(`Invoice-${order.orderNumber}.pdf`);
    return true;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminOrderDetail() {
    const [, params] = useRoute("/admin-saad/orders/:id");
    const orderId = parseInt(params?.id || "0", 10);

    const { data: order, isLoading } = trpc.order.getById.useQuery(
        { id: orderId },
        { enabled: orderId > 0 }
    );

    const utils = trpc.useUtils();
    const updateStatus = trpc.order.updateStatus.useMutation({
        onSuccess: () => {
            utils.order.getById.invalidate({ id: orderId });
            toast.success("Status updated");
        },
    });

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-24 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading order...
                </div>
            </AdminLayout>
        );
    }

    if (!order) {
        return (
            <AdminLayout>
                <div className="text-center py-24">
                    <h2 className="text-xl font-bold text-foreground mb-2">Order not found</h2>
                    <Link href="/admin-saad/orders">
                        <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Orders</Button>
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    let items: any[] = [];
    try { items = typeof order.items === "string" ? JSON.parse(order.items) : order.items || []; } catch { }

    return (
        <AdminLayout>
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin-saad/orders">
                            <Button variant="ghost" size="icon" className="shrink-0">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="font-serif text-2xl font-bold text-foreground flex items-center gap-3">
                                Order {order.orderNumber}
                                <Badge className={`border text-xs ${STATUS_COLORS[order.status] ?? ""}`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </Badge>
                            </h1>
                            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(order.createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                {" at "}
                                {new Date(order.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={async () => {
                                await generateInvoicePDF(order);
                                toast.success("Invoice downloaded!");
                            }}
                        >
                            <Download className="w-4 h-4 mr-2" /> Download Invoice
                        </Button>
                        <Select
                            value={order.status}
                            onValueChange={(v) => updateStatus.mutate({ id: order.id, status: v as any })}
                        >
                            <SelectTrigger className="w-[150px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"].map(s => (
                                    <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Col: Customer + Shipping */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Customer Info */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h2 className="font-condensed font-bold uppercase tracking-wider text-sm text-muted-foreground mb-4 flex items-center gap-2">
                                <User className="w-4 h-4 text-gold" /> Customer Information
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <User className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-semibold text-foreground">{order.customerName}</p>
                                        {order.companyName && <p className="text-muted-foreground text-xs">{order.companyName}</p>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
                                    <a href={`mailto:${order.customerEmail}`} className="text-gold hover:underline">{order.customerEmail}</a>
                                </div>
                                {order.customerPhone && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                                        <a href={`tel:${order.customerPhone}`} className="hover:underline">{order.customerPhone}</a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h2 className="font-condensed font-bold uppercase tracking-wider text-sm text-muted-foreground mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gold" /> Shipping Address
                            </h2>
                            <div className="text-sm space-y-1 text-foreground">
                                <p>{order.addressLine1}</p>
                                {order.addressLine2 && <p>{order.addressLine2}</p>}
                                <p>{order.city}{order.state ? `, ${order.state}` : ""} {order.postalCode}</p>
                                <p className="font-semibold">{order.country} ({order.countryCode})</p>
                            </div>
                        </div>

                        {/* Payment Info */}
                        <div className="bg-card border border-border rounded-xl p-6">
                            <h2 className="font-condensed font-bold uppercase tracking-wider text-sm text-muted-foreground mb-4 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gold" /> Payment
                            </h2>
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Method</span>
                                    <span className="font-semibold text-foreground capitalize">{order.paymentMethod || "Invoice"}</span>
                                </div>
                                {order.stripeSessionId && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Stripe Session</span>
                                        <span className="font-mono text-xs text-muted-foreground truncate max-w-[140px]">{order.stripeSessionId}</span>
                                    </div>
                                )}
                                {order.stripePaymentIntentId && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Payment Intent</span>
                                        <span className="font-mono text-xs text-muted-foreground truncate max-w-[140px]">{order.stripePaymentIntentId}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Items + Totals */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Items */}
                        <div className="bg-card border border-border rounded-xl overflow-hidden">
                            <div className="px-6 py-4 border-b border-border">
                                <h2 className="font-condensed font-bold uppercase tracking-wider text-sm text-muted-foreground flex items-center gap-2">
                                    <Package className="w-4 h-4 text-gold" /> Order Items ({items.length})
                                </h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-secondary/50 border-b border-border">
                                        <tr>
                                            {["Product", "Size", "Color", "Qty", "Unit Price", "Line Total"].map(h => (
                                                <th key={h} className="px-6 py-3 text-left font-condensed font-bold uppercase tracking-wider text-xs text-muted-foreground">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {items.map((item: any, i: number) => (
                                            <tr key={i} className="hover:bg-secondary/20 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-foreground">{item.title}</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">Product #{item.productId}</p>
                                                </td>
                                                <td className="px-6 py-4 text-foreground">{item.size || "—"}</td>
                                                <td className="px-6 py-4 text-foreground">{item.color || "—"}</td>
                                                <td className="px-6 py-4 font-semibold text-foreground">{item.qty}</td>
                                                <td className="px-6 py-4 font-mono text-foreground">${Number(item.unitPrice).toFixed(2)}</td>
                                                <td className="px-6 py-4 font-mono font-bold text-gold">${(item.qty * item.unitPrice).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals */}
                            <div className="border-t border-border px-6 py-5">
                                <div className="flex flex-col items-end gap-2 text-sm">
                                    <div className="flex items-center gap-8">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-mono w-24 text-right text-foreground">${Number(order.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <span className="text-muted-foreground flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Shipping</span>
                                        <span className="font-mono w-24 text-right text-foreground">${Number(order.shippingCost).toFixed(2)}</span>
                                    </div>
                                    <Separator className="w-40 my-1" />
                                    <div className="flex items-center gap-8">
                                        <span className="font-condensed font-bold uppercase tracking-wider text-foreground">Total</span>
                                        <span className="font-mono font-bold text-xl text-gold w-24 text-right">${Number(order.totalAmount).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {order.notes && (
                            <div className="bg-card border border-border rounded-xl p-6">
                                <h2 className="font-condensed font-bold uppercase tracking-wider text-sm text-muted-foreground mb-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-gold" /> Notes
                                </h2>
                                <p className="text-sm text-foreground whitespace-pre-wrap">{order.notes}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

