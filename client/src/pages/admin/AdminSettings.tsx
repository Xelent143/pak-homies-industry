import { useState } from "react";
import AdminLayout from "@/pages/layouts/AdminLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, Edit, Globe, Loader2, Plane } from "lucide-react";

export default function AdminSettings() {
    const utils = trpc.useUtils();
    const { data: zones, isLoading } = trpc.shipping.adminZones.useQuery();
    const [editZone, setEditZone] = useState<any>(null);
    const [showAdd, setShowAdd] = useState(false);

    const deleteMutation = trpc.shipping.deleteZone.useMutation({
        onSuccess: () => { utils.shipping.adminZones.invalidate(); toast.success("Zone deleted"); },
    });

    const createMutation = trpc.shipping.createZone.useMutation({
        onSuccess: () => { utils.shipping.adminZones.invalidate(); toast.success("Zone created"); setShowAdd(false); },
        onError: (e) => toast.error("Failed", { description: e.message }),
    });

    const updateMutation = trpc.shipping.updateZone.useMutation({
        onSuccess: () => { utils.shipping.adminZones.invalidate(); toast.success("Zone updated"); setEditZone(null); },
        onError: (e) => toast.error("Failed", { description: e.message }),
    });

    const [newZone, setNewZone] = useState({
        zoneName: "", countries: "", baseRate: "0.00",
        perUnitRate: "0.00", perKgRate: "0.00",
        minDays: 7, maxDays: 21, currency: "USD", isActive: true,
    });

    return (
        <AdminLayout>
            <div className="space-y-8">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-foreground">Settings</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage global store configurations and shipping.</p>
                </div>

                {/* Shipping Zones Card */}
                <section className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                    <div className="bg-secondary/40 px-6 py-4 border-b border-border flex items-center justify-between">
                        <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                            <Plane className="w-5 h-5 text-gold" />
                            Shipping Zones
                        </h3>
                        <Button size="sm" onClick={() => setShowAdd(true)}>
                            <Plus className="w-4 h-4 mr-1" /> Add Zone
                        </Button>
                    </div>

                    <div className="p-6">
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2 text-muted-foreground py-8">
                                <Loader2 className="w-5 h-5 animate-spin" /> Loading zones...
                            </div>
                        ) : (zones ?? []).length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <Globe className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                No shipping zones defined. Customers cannot checkout without shipping zones.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {(zones ?? []).map(zone => (
                                    <div key={zone.id} className="flex items-center justify-between bg-background rounded-lg p-4 border border-border hover:border-gold/50 transition-colors">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-foreground">{zone.zoneName}</span>
                                                <Badge variant={zone.isActive ? "default" : "secondary"}>
                                                    {zone.isActive ? "Active" : "Inactive"}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Base: ${zone.baseRate} | {zone.minDays}–{zone.maxDays} days | {zone.currency}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="icon" variant="ghost" onClick={() => setEditZone(zone)}>
                                                <Edit className="w-4 h-4 text-muted-foreground hover:text-gold" />
                                            </Button>
                                            <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate({ id: zone.id })}>
                                                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Add Zone Dialog */}
                <Dialog open={showAdd} onOpenChange={setShowAdd}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add Shipping Zone</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Zone Name</Label>
                                <Input value={newZone.zoneName} onChange={e => setNewZone(z => ({ ...z, zoneName: e.target.value }))} placeholder="North America" />
                            </div>
                            <div>
                                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Countries (JSON array of ISO codes)</Label>
                                <Input value={newZone.countries} onChange={e => setNewZone(z => ({ ...z, countries: e.target.value }))} placeholder='["US","CA","MX"]' className="font-mono text-sm" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Base Rate ($)</Label>
                                    <Input value={newZone.baseRate} onChange={e => setNewZone(z => ({ ...z, baseRate: e.target.value }))} />
                                </div>
                                <div>
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Per Unit ($)</Label>
                                    <Input value={newZone.perUnitRate} onChange={e => setNewZone(z => ({ ...z, perUnitRate: e.target.value }))} />
                                </div>
                                <div>
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Per Kg ($)</Label>
                                    <Input value={newZone.perKgRate} onChange={e => setNewZone(z => ({ ...z, perKgRate: e.target.value }))} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Min Days</Label>
                                    <Input type="number" value={newZone.minDays} onChange={e => setNewZone(z => ({ ...z, minDays: parseInt(e.target.value) || 7 }))} />
                                </div>
                                <div>
                                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Max Days</Label>
                                    <Input type="number" value={newZone.maxDays} onChange={e => setNewZone(z => ({ ...z, maxDays: parseInt(e.target.value) || 21 }))} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                            <Button onClick={() => createMutation.mutate(newZone)} disabled={createMutation.isPending} className="bg-gold text-black hover:bg-gold-light">
                                {createMutation.isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                                Create Zone
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
