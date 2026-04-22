import { useState } from "react";
import AdminLayout from "@/pages/layouts/AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, Edit, Loader2, Image as ImageIcon, Search } from "lucide-react";

const PORTFOLIO_CATEGORIES = [
    "Hunting Wear", "Sports Wear", "Ski Wear", "Tech Wear", "Streetwear", "Martial Arts Wear",
];

export default function AdminContent() {
    const utils = trpc.useUtils();
    const { data: portfolioItems, isLoading } = trpc.portfolio.adminList.useQuery();
    const [showAdd, setShowAdd] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const [form, setForm] = useState({
        title: "", category: "Streetwear", imageUrl: "",
        clientName: "", dateCompleted: "", sortOrder: 0
    });

    const uploadMutation = trpc.portfolio.uploadImage.useMutation({
        onSuccess: (data: any) => {
            setForm(prev => ({ ...prev, imageUrl: data.url || data.imageUrl }));
            toast.success("Image uploaded!");
        },
        onError: (e) => toast.error("Upload failed", { description: e.message })
    });

    const createMutation = trpc.portfolio.create.useMutation({
        onSuccess: () => {
            utils.portfolio.adminList.invalidate();
            toast.success("Portfolio item added");
            setShowAdd(false);
        }
    });

    const deleteMutation = trpc.portfolio.delete.useMutation({
        onSuccess: () => {
            utils.portfolio.adminList.invalidate();
            toast.success("Portfolio item deleted");
        }
    });

    const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const imageBase64 = (reader.result as string).split(",")[1];
            uploadMutation.mutate({ imageBase64, mimeType: file.type || "image/jpeg" });
        };
        reader.readAsDataURL(file);
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-bold text-foreground">Content & Portfolio</h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage public portfolio showcases and assets.</p>
                    </div>
                    <Button onClick={() => setShowAdd(true)} className="bg-gold text-black hover:bg-gold-light">
                        <Plus className="w-4 h-4 mr-2" /> Add Portfolio Item
                    </Button>
                </div>

                {/* Portfolio Grids */}
                {isLoading ? (
                    <div className="flex justify-center p-12">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                    </div>
                ) : (portfolioItems ?? []).length === 0 ? (
                    <div className="text-center py-16 px-4 bg-card border border-border rounded-xl shadow-sm">
                        <div className="bg-secondary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-1">No portfolio items yet</h3>
                        <p className="text-muted-foreground text-sm max-w-sm mx-auto">Showcase your best manufacturing work. Add items here to display them on the public portfolio page.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(portfolioItems ?? []).map((item: any) => (
                            <div key={item.id} className="bg-card border border-border rounded-xl overflow-hidden group">
                                <div className="aspect-[4/3] bg-secondary relative">
                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                        <Button size="icon" variant="destructive" className="h-9 w-9 rounded-full" onClick={() => deleteMutation.mutate({ id: item.id })}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="font-bold text-foreground truncate">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground">{item.category}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Dialog */}
                <Dialog open={showAdd} onOpenChange={setShowAdd}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add to Portfolio</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label className="mb-1 block text-muted-foreground">Title *</Label>
                                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Custom BJJ Gi for Alpha Team" />
                            </div>
                            <div>
                                <Label className="mb-1 block text-muted-foreground">Category *</Label>
                                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {PORTFOLIO_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label className="mb-1 block text-muted-foreground">Image *</Label>
                                {form.imageUrl ? (
                                    <div className="mt-2 relative rounded overflow-hidden shadow-sm aspect-video">
                                        <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <Button type="button" size="sm" variant="destructive" className="absolute top-2 right-2" onClick={() => setForm(f => ({ ...f, imageUrl: "" }))}>
                                            Clear
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="mt-2 flex items-center gap-3">
                                        <Input type="file" accept="image/*" onChange={handleFile} disabled={uploadMutation.isPending} />
                                        {uploadMutation.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                                    </div>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                            <Button onClick={() => createMutation.mutate(form)} disabled={!form.title || !form.imageUrl || createMutation.isPending} className="bg-gold text-black hover:bg-gold-light">
                                {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                Publish Item
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

            </div>
        </AdminLayout>
    );
}
