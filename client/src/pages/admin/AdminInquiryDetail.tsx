import { useState } from "react";
import { useRoute, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import AdminLayout from "@/pages/layouts/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
    ArrowLeft, User, Mail, Phone, Building2, MapPin, Package,
    Calendar, Clock, FileText, Wand2, Copy, Save, Send,
    Loader2, Globe, DollarSign, Ruler, MessageSquare,
    BookOpen, Plus, Trash2, Sparkles, CheckCircle2
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    new: "bg-amber-500/15 text-amber-500 border-amber-500/30",
    reviewed: "bg-blue-500/15 text-blue-500 border-blue-500/30",
    quoted: "bg-violet-500/15 text-violet-500 border-violet-500/30",
    closed: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30",
};

function InfoRow({ icon: Icon, label, value, href, isGold }: { icon: any; label: string; value: string; href?: string; isGold?: boolean }) {
    if (!value) return null;
    return (
        <div className="flex items-start gap-3 py-2.5">
            <Icon className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
            <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
                {href ? (
                    <a href={href} className="text-[15px] font-semibold text-gold hover:underline break-all">{value}</a>
                ) : (
                    <p className={`text-[15px] font-semibold ${isGold ? "text-gold" : "text-foreground"}`}>{value}</p>
                )}
            </div>
        </div>
    );
}

export default function AdminInquiryDetail() {
    const [, params] = useRoute("/admin-saad/inquiries/:id");
    const inquiryId = parseInt(params?.id || "0", 10);

    const { data: inquiry, isLoading } = trpc.rfq.getById.useQuery(
        { id: inquiryId },
        { enabled: inquiryId > 0 }
    );

    const utils = trpc.useUtils();

    const updateStatus = trpc.rfq.updateStatus.useMutation({
        onSuccess: () => {
            utils.rfq.getById.invalidate({ id: inquiryId });
            toast.success("Status updated");
        },
    });

    const addNote = trpc.rfq.addNote.useMutation({
        onSuccess: () => {
            utils.rfq.getById.invalidate({ id: inquiryId });
            setNoteText("");
            toast.success("Note added");
        },
    });

    const generateReply = trpc.rfq.generateAiReply.useMutation({
        onSuccess: (data) => {
            setAiReply(data.reply);
            toast.success("AI reply generated!");
        },
        onError: (err) => toast.error(err.message),
    });

    const { data: kbEntries } = trpc.rfq.getKnowledgeBase.useQuery();
    const addKb = trpc.rfq.addKnowledge.useMutation({
        onSuccess: () => {
            utils.rfq.getKnowledgeBase.invalidate();
            setKbTitle(""); setKbContent(""); setKbCategory("general");
            toast.success("Knowledge added");
        },
    });
    const deleteKb = trpc.rfq.deleteKnowledge.useMutation({
        onSuccess: () => { utils.rfq.getKnowledgeBase.invalidate(); toast.success("Removed"); },
    });

    const [noteText, setNoteText] = useState("");
    const [aiInstruction, setAiInstruction] = useState("");
    const [aiReply, setAiReply] = useState("");
    const [showKbForm, setShowKbForm] = useState(false);
    const [kbTitle, setKbTitle] = useState("");
    const [kbContent, setKbContent] = useState("");
    const [kbCategory, setKbCategory] = useState("general");
    const [activeTab, setActiveTab] = useState<"details" | "ai" | "kb">("details");

    if (isLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-24 text-muted-foreground">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading inquiry...
                </div>
            </AdminLayout>
        );
    }

    if (!inquiry) {
        return (
            <AdminLayout>
                <div className="text-center py-24">
                    <h2 className="text-xl font-bold text-foreground mb-2">Inquiry not found</h2>
                    <Link href="/admin-saad/inquiries">
                        <Button variant="outline"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Inquiries</Button>
                    </Link>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="max-w-6xl mx-auto space-y-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/admin-saad/inquiries">
                            <Button variant="ghost" size="icon" className="shrink-0"><ArrowLeft className="w-5 h-5" /></Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                                    {inquiry.companyName}
                                </h1>
                                <Badge className={`border text-[11px] font-bold ${STATUS_COLORS[inquiry.status]}`}>
                                    {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5" />
                                {new Date(inquiry.createdAt).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}
                                {" · "}
                                {inquiry.contactName} · {inquiry.email}
                            </p>
                        </div>
                    </div>
                    <Select
                        value={inquiry.status}
                        onValueChange={(v) => updateStatus.mutate({ id: inquiry.id, status: v as any })}
                    >
                        <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                            {["new", "reviewed", "quoted", "closed"].map(s => (
                                <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
                    {([
                        { key: "details", label: "Inquiry Details", icon: FileText },
                        { key: "ai", label: "AI Reply Assistant", icon: Wand2 },
                        { key: "kb", label: "Knowledge Base", icon: BookOpen },
                    ] as const).map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex-1 justify-center
                ${activeTab === tab.key
                                    ? "bg-gold text-black shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                                }
              `}
                        >
                            <tab.icon className="w-4 h-4" /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* ═══════════ TAB: DETAILS ═══════════ */}
                {activeTab === "details" && (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                        {/* ── Left: Contact + Product (3 cols) ── */}
                        <div className="lg:col-span-3 space-y-5">

                            {/* Quick Summary Banner */}
                            <div className="bg-gold/5 border border-gold/15 rounded-2xl p-5 flex flex-wrap gap-x-10 gap-y-3">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-gold/70 font-bold">Product</p>
                                    <p className="text-lg font-bold text-foreground">{inquiry.productType}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-gold/70 font-bold">Quantity</p>
                                    <p className="text-lg font-bold text-foreground font-mono">{inquiry.quantity}</p>
                                </div>
                                {inquiry.timeline && (
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-gold/70 font-bold">Timeline</p>
                                        <p className="text-lg font-bold text-foreground">{inquiry.timeline}</p>
                                    </div>
                                )}
                                {inquiry.budget && (
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-gold/70 font-bold">Budget</p>
                                        <p className="text-lg font-bold text-foreground">{inquiry.budget}</p>
                                    </div>
                                )}
                            </div>

                            {/* Contact Card */}
                            <div className="bg-card border border-border rounded-2xl p-5">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                    <User className="w-4 h-4 text-gold" /> Contact
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0 divide-y sm:divide-y-0 divide-border/50">
                                    <InfoRow icon={User} label="Name" value={inquiry.contactName} />
                                    <InfoRow icon={Building2} label="Company" value={inquiry.companyName} />
                                    <InfoRow icon={Mail} label="Email" value={inquiry.email} href={`mailto:${inquiry.email}`} isGold />
                                    <InfoRow icon={Phone} label="Phone" value={inquiry.phone || ""} href={inquiry.phone ? `tel:${inquiry.phone}` : undefined} />
                                    <InfoRow icon={Globe} label="Country" value={inquiry.country || ""} />
                                    <InfoRow icon={Globe} label="Website" value={inquiry.website || ""} href={inquiry.website || undefined} isGold />
                                </div>
                            </div>

                            {/* Requirements Card */}
                            <div className="bg-card border border-border rounded-2xl p-5">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-gold" /> Requirements
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
                                    <InfoRow icon={Package} label="Product Type" value={inquiry.productType} />
                                    <InfoRow icon={Ruler} label="Quantity" value={inquiry.quantity} />
                                    <InfoRow icon={FileText} label="Customization" value={inquiry.customization || ""} />
                                    <InfoRow icon={FileText} label="Fabric" value={inquiry.fabricPreference || ""} />
                                    <InfoRow icon={Clock} label="Timeline" value={inquiry.timeline || ""} />
                                    <InfoRow icon={DollarSign} label="Budget" value={inquiry.budget || ""} />
                                </div>

                                {inquiry.additionalNotes && (
                                    <div className="mt-3 pt-3 border-t border-border/50">
                                        <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-1.5">Additional Notes</p>
                                        <p className="text-[14px] text-foreground whitespace-pre-wrap leading-relaxed bg-secondary/20 rounded-lg p-3">{inquiry.additionalNotes}</p>
                                    </div>
                                )}

                                {inquiry.designImageUrl && (
                                    <div className="mt-3 pt-3 border-t border-border/50">
                                        <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium mb-2">Design Reference</p>
                                        <img src={inquiry.designImageUrl} alt="Design" className="rounded-lg max-w-sm border border-border" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* ── Right: Notes (2 cols) ── */}
                        <div className="lg:col-span-2">
                            <div className="bg-card border border-border rounded-2xl p-5 sticky top-[76px]">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4 text-gold" /> Notes & Activity
                                </h2>

                                <textarea
                                    value={noteText}
                                    onChange={e => setNoteText(e.target.value)}
                                    placeholder="Add a note..."
                                    className="w-full bg-secondary/30 border border-border rounded-lg px-3 py-2.5 text-sm resize-none h-20 focus:outline-none focus:ring-2 focus:ring-gold/30"
                                />
                                <Button
                                    size="sm"
                                    className="mt-2 bg-gold hover:bg-gold/90 text-black font-bold text-xs"
                                    disabled={!noteText.trim()}
                                    onClick={() => addNote.mutate({ rfqId: inquiry.id, content: noteText })}
                                >
                                    <Save className="w-3 h-3 mr-1.5" /> Save Note
                                </Button>

                                <Separator className="my-4" />

                                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                                    {(inquiry.notes ?? []).length === 0 ? (
                                        <p className="text-xs text-muted-foreground text-center py-6">No notes yet</p>
                                    ) : (
                                        (inquiry.notes ?? []).map((note: any) => (
                                            <div key={note.id} className={`p-3 rounded-lg text-sm ${note.isAiGenerated ? "bg-violet-500/5 border border-violet-500/20" : "bg-secondary/20 border border-border/50"}`}>
                                                <div className="flex items-center gap-2 mb-1.5">
                                                    {note.isAiGenerated ? (
                                                        <Badge className="text-[9px] bg-violet-500/15 text-violet-400 border-violet-500/30">
                                                            <Sparkles className="w-2.5 h-2.5 mr-1" /> AI
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="text-[9px] bg-secondary text-muted-foreground border-border">Note</Badge>
                                                    )}
                                                    <span className="text-[10px] text-muted-foreground ml-auto">
                                                        {new Date(note.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                                                    </span>
                                                </div>
                                                <p className="text-foreground whitespace-pre-wrap leading-relaxed text-[13px]">{note.content}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════ TAB: AI REPLY ═══════════ */}
                {activeTab === "ai" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                                <Wand2 className="w-4 h-4 text-gold" /> Generate Reply
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Tell the AI what kind of reply you want. It uses your product catalog + knowledge base.
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {[
                                    "Write a professional quote reply with pricing",
                                    "Request more details about their requirements",
                                    "Send a follow-up email checking in",
                                    "Write a thank you and next steps email",
                                ].map(suggestion => (
                                    <button
                                        key={suggestion}
                                        onClick={() => setAiInstruction(suggestion)}
                                        className="text-[11px] px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-muted-foreground hover:text-foreground hover:border-gold/30 transition-all"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>

                            <textarea
                                value={aiInstruction}
                                onChange={e => setAiInstruction(e.target.value)}
                                placeholder="e.g., Write a professional quote reply with pricing for 500 units..."
                                className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-sm resize-none h-28 focus:outline-none focus:ring-2 focus:ring-gold/30"
                            />
                            <Button
                                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold"
                                disabled={!aiInstruction.trim() || generateReply.isPending}
                                onClick={() => generateReply.mutate({ rfqId: inquiry.id, instruction: aiInstruction })}
                            >
                                {generateReply.isPending ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                                ) : (
                                    <><Sparkles className="w-4 h-4 mr-2" /> Generate Reply</>
                                )}
                            </Button>
                        </div>

                        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gold" /> Reply Preview
                            </h2>

                            {aiReply ? (
                                <>
                                    <div className="bg-secondary/20 border border-border rounded-lg p-4 max-h-[400px] overflow-y-auto">
                                        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{aiReply}</p>
                                    </div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-xs"
                                            onClick={() => {
                                                navigator.clipboard.writeText(aiReply);
                                                toast.success("Copied to clipboard!");
                                            }}
                                        >
                                            <Copy className="w-3.5 h-3.5 mr-1.5" /> Copy
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="text-xs bg-gold hover:bg-gold/90 text-black font-bold"
                                            onClick={() => {
                                                addNote.mutate({ rfqId: inquiry.id, content: aiReply, isAiGenerated: true });
                                            }}
                                        >
                                            <Save className="w-3.5 h-3.5 mr-1.5" /> Save as Note
                                        </Button>
                                        <a
                                            href={`mailto:${inquiry.email}?subject=Re: Quote Request - ${inquiry.productType}&body=${encodeURIComponent(aiReply)}`}
                                            className="inline-flex"
                                        >
                                            <Button size="sm" variant="outline" className="text-xs">
                                                <Send className="w-3.5 h-3.5 mr-1.5" /> Open in Email
                                            </Button>
                                        </a>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-16 text-muted-foreground">
                                    <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">AI reply will appear here after generation</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ═══════════ TAB: KNOWLEDGE BASE ═══════════ */}
                {activeTab === "kb" && (
                    <div className="space-y-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-gold" /> Knowledge Base
                                </h2>
                                <p className="text-sm text-muted-foreground mt-0.5">
                                    Custom information the AI references when generating replies. Product catalog is included automatically.
                                </p>
                            </div>
                            <Button
                                size="sm"
                                className="bg-gold hover:bg-gold/90 text-black font-bold text-xs"
                                onClick={() => setShowKbForm(!showKbForm)}
                            >
                                <Plus className="w-3.5 h-3.5 mr-1" /> Add Entry
                            </Button>
                        </div>

                        {showKbForm && (
                            <div className="bg-card border border-gold/20 rounded-2xl p-5 space-y-3">
                                <input
                                    value={kbTitle}
                                    onChange={e => setKbTitle(e.target.value)}
                                    placeholder="Title (e.g., Shipping Policy, Lead Times)"
                                    className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30"
                                />
                                <textarea
                                    value={kbContent}
                                    onChange={e => setKbContent(e.target.value)}
                                    placeholder="Content the AI should know about..."
                                    className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-gold/30"
                                />
                                <div className="flex items-center gap-3">
                                    <Select value={kbCategory} onValueChange={setKbCategory}>
                                        <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {["general", "pricing", "shipping", "production", "quality", "policies"].map(c => (
                                                <SelectItem key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        size="sm"
                                        className="bg-gold hover:bg-gold/90 text-black font-bold text-xs"
                                        disabled={!kbTitle.trim() || !kbContent.trim()}
                                        onClick={() => addKb.mutate({ title: kbTitle, content: kbContent, category: kbCategory })}
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Save
                                    </Button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {(kbEntries ?? []).length === 0 ? (
                                <div className="col-span-2 text-center py-16 text-muted-foreground bg-card border border-border rounded-2xl">
                                    <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">No knowledge base entries yet.</p>
                                </div>
                            ) : (
                                (kbEntries ?? []).map(entry => (
                                    <div key={entry.id} className="bg-card border border-border rounded-2xl p-5 group hover:border-gold/20 transition-colors">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <h3 className="font-semibold text-sm text-foreground">{entry.title}</h3>
                                                <Badge className="text-[9px] mt-1 bg-secondary text-muted-foreground border-border">
                                                    {entry.category}
                                                </Badge>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-500 hover:bg-red-500/10"
                                                onClick={() => deleteKb.mutate({ id: entry.id })}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">{entry.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
