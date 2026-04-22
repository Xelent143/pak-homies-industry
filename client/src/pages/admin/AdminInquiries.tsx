import { useState } from "react";
import { Link } from "wouter";
import AdminLayout from "@/pages/layouts/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    MessageSquare, Search, Clock, CheckCircle2, FileText,
    XCircle, Eye, ArrowUpRight, Loader2, Filter
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    new: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    reviewed: "bg-blue-500/15 text-blue-500 border-blue-500/30",
    quoted: "bg-violet-500/15 text-violet-500 border-violet-500/30",
    closed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
    new: <Clock className="w-3 h-3" />,
    reviewed: <Eye className="w-3 h-3" />,
    quoted: <FileText className="w-3 h-3" />,
    closed: <CheckCircle2 className="w-3 h-3" />,
};

type FilterStatus = "all" | "new" | "reviewed" | "quoted" | "closed";

export default function AdminInquiries() {
    const { data: inquiries, isLoading } = trpc.rfq.adminList.useQuery();
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
    const [search, setSearch] = useState("");

    const filtered = (inquiries ?? []).filter(inq => {
        if (filterStatus !== "all" && inq.status !== filterStatus) return false;
        if (search) {
            const q = search.toLowerCase();
            return (
                inq.companyName.toLowerCase().includes(q) ||
                inq.contactName.toLowerCase().includes(q) ||
                inq.email.toLowerCase().includes(q) ||
                inq.productType.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const statusCounts = {
        all: inquiries?.length ?? 0,
        new: inquiries?.filter(i => i.status === "new").length ?? 0,
        reviewed: inquiries?.filter(i => i.status === "reviewed").length ?? 0,
        quoted: inquiries?.filter(i => i.status === "quoted").length ?? 0,
        closed: inquiries?.filter(i => i.status === "closed").length ?? 0,
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="font-condensed text-3xl font-extrabold tracking-tight text-foreground uppercase flex items-center gap-3">
                            <MessageSquare className="w-7 h-7 text-gold" />
                            Inquiries
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Manage quotes, proposals, and customer inquiries from your website.
                        </p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                    {(["all", "new", "reviewed", "quoted", "closed"] as FilterStatus[]).map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`
                flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all
                ${filterStatus === status
                                    ? "bg-gold text-black shadow-md"
                                    : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
                                }
              `}
                        >
                            {status !== "all" && STATUS_ICONS[status]}
                            {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
                            <span className={`ml-1 text-[10px] ${filterStatus === status ? "text-black/60" : "text-muted-foreground/60"}`}>
                                {statusCounts[status]}
                            </span>
                        </button>
                    ))}

                    {/* Search */}
                    <div className="relative ml-auto">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search inquiries..."
                            className="pl-9 pr-4 py-2 bg-card border border-border rounded-lg text-sm w-[200px] focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50 transition-all"
                        />
                    </div>
                </div>

                {/* Inquiries Table */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mr-2" /> Loading inquiries...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-20 px-4">
                            <div className="w-14 h-14 rounded-2xl bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                {search ? "No inquiries match your search." : "No inquiries yet. They'll appear here when customers submit quote requests."}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-secondary/30 border-b border-border">
                                        {["Company", "Contact", "Product", "Quantity", "Status", "Date", ""].map(h => (
                                            <th key={h} className="px-6 py-3 text-left text-[10px] font-condensed font-bold uppercase tracking-[0.15em] text-muted-foreground">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/50">
                                    {filtered.map(inq => (
                                        <tr
                                            key={inq.id}
                                            className="group hover:bg-secondary/20 transition-colors cursor-pointer"
                                            onClick={() => window.location.href = `/admin-saad/inquiries/${inq.id}`}
                                        >
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-foreground">{inq.companyName}</p>
                                                {inq.country && <p className="text-xs text-muted-foreground">{inq.country}</p>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-foreground">{inq.contactName}</p>
                                                <p className="text-xs text-muted-foreground">{inq.email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-foreground">{inq.productType}</span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-foreground">{inq.quantity}</td>
                                            <td className="px-6 py-4">
                                                <Badge className={`border text-[10px] font-bold gap-1 ${STATUS_COLORS[inq.status]}`}>
                                                    {STATUS_ICONS[inq.status]}
                                                    {inq.status.charAt(0).toUpperCase() + inq.status.slice(1)}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">
                                                {new Date(inq.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link href={`/admin-saad/inquiries/${inq.id}`}>
                                                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8">
                                                        <ArrowUpRight className="w-4 h-4 text-gold" />
                                                    </Button>
                                                </Link>
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
