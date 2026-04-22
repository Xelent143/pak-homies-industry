import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  Bot,
  Clock3,
  Loader2,
  RefreshCw,
  Save,
  Send,
  Trash2,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import AdminLayout from "@/pages/layouts/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SettingsForm = {
  isEnabled: boolean;
  runEveryMinutes: number;
  maxSourcesPerRun: number;
  geminiRequestsPerMinuteLimit: number;
  geminiRequestsPerDayLimit: number;
  defaultCategoryId: number | null;
  defaultSubcategoryId: number | null;
  defaultCategoryLabel: string | null;
  savedModelId: number | null;
  defaultPrompt: string;
};

const DEFAULT_FORM: SettingsForm = {
  isEnabled: false,
  runEveryMinutes: 60,
  maxSourcesPerRun: 1,
  geminiRequestsPerMinuteLimit: 8,
  geminiRequestsPerDayLimit: 100,
  defaultCategoryId: null,
  defaultSubcategoryId: null,
  defaultCategoryLabel: null,
  savedModelId: null,
  defaultPrompt: "Place the extracted garment on the model naturally.",
};

function formatDate(value: unknown) {
  if (!value) return "Never";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "Never";
  return date.toLocaleString();
}

function statusTone(status: string) {
  switch (status) {
    case "draft_created":
      return "bg-green-500/10 text-green-600 border-green-500/30";
    case "processing":
      return "bg-blue-500/10 text-blue-600 border-blue-500/30";
    case "failed":
      return "bg-red-500/10 text-red-600 border-red-500/30";
    default:
      return "bg-secondary text-muted-foreground border-border";
  }
}

export default function AdminProductAutomation() {
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const { data: settingsData, isLoading: settingsLoading } = trpc.productAutomation.settings.useQuery();
  const { data: queue, isLoading: queueLoading } = trpc.productAutomation.listSources.useQuery();
  const { data: categories } = trpc.category.listWithSubs.useQuery();
  const { data: savedModels } = trpc.aiAgent.getSavedModels.useQuery();

  const [form, setForm] = useState<SettingsForm>(DEFAULT_FORM);
  const [bulkLinks, setBulkLinks] = useState("");

  useEffect(() => {
    if (settingsData?.settings) {
      setForm({
        isEnabled: !!settingsData.settings.isEnabled,
        runEveryMinutes: settingsData.settings.runEveryMinutes ?? 60,
        maxSourcesPerRun: settingsData.settings.maxSourcesPerRun ?? 1,
        geminiRequestsPerMinuteLimit: settingsData.settings.geminiRequestsPerMinuteLimit ?? 8,
        geminiRequestsPerDayLimit: settingsData.settings.geminiRequestsPerDayLimit ?? 100,
        defaultCategoryId: settingsData.settings.defaultCategoryId ?? null,
        defaultSubcategoryId: settingsData.settings.defaultSubcategoryId ?? null,
        defaultCategoryLabel: settingsData.settings.defaultCategoryLabel ?? null,
        savedModelId: settingsData.settings.savedModelId ?? null,
        defaultPrompt: settingsData.settings.defaultPrompt || DEFAULT_FORM.defaultPrompt,
      });
    }
  }, [settingsData]);

  const selectedCategory = categories?.find((category) => category.id === form.defaultCategoryId) ?? null;
  const requestsPerSource = settingsData?.requestsPerSource ?? 6;
  const estimatedDraftsPerMinute = Math.floor(form.geminiRequestsPerMinuteLimit / requestsPerSource);
  const estimatedDraftsPerDay = Math.floor(form.geminiRequestsPerDayLimit / requestsPerSource);

  const saveSettingsMutation = trpc.productAutomation.saveSettings.useMutation({
    onSuccess: () => {
      utils.productAutomation.settings.invalidate();
      toast.success("Automation settings saved.");
    },
    onError: (error) => toast.error(error.message),
  });

  const enqueueMutation = trpc.productAutomation.enqueue.useMutation({
    onSuccess: (result) => {
      utils.productAutomation.listSources.invalidate();
      setBulkLinks("");
      toast.success(`Queued ${result.added} new source links.`, {
        description: result.skipped > 0 ? `${result.skipped} duplicate links were skipped.` : undefined,
      });
    },
    onError: (error) => toast.error(error.message),
  });

  const runNowMutation = trpc.productAutomation.runNow.useMutation({
    onSuccess: (result) => {
      utils.productAutomation.listSources.invalidate();
      utils.productAutomation.settings.invalidate();
      utils.product.adminList.invalidate();
      toast.success(result.message);

      if (result.started) {
        window.setTimeout(() => {
          utils.productAutomation.listSources.invalidate();
          utils.productAutomation.settings.invalidate();
          utils.product.adminList.invalidate();
        }, 5000);

        window.setTimeout(() => {
          utils.productAutomation.listSources.invalidate();
          utils.productAutomation.settings.invalidate();
          utils.product.adminList.invalidate();
        }, 15000);
      }
    },
    onError: (error) => toast.error(error.message),
  });

  const retryMutation = trpc.productAutomation.retrySource.useMutation({
    onSuccess: () => {
      utils.productAutomation.listSources.invalidate();
      toast.success("Source moved back to the queue.");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = trpc.productAutomation.deleteSource.useMutation({
    onSuccess: () => {
      utils.productAutomation.listSources.invalidate();
      toast.success("Queue item removed.");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSaveSettings = () => {
    if (form.isEnabled && !form.savedModelId) {
      toast.error("Choose a saved model before enabling the automation.");
      return;
    }

    saveSettingsMutation.mutate({
      ...form,
      defaultCategoryLabel: selectedCategory?.name ?? form.defaultCategoryLabel ?? null,
    });
  };

  const handleQueueLinks = () => {
    const urls = Array.from(new Set(
      bulkLinks
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    ));

    if (urls.length === 0) {
      toast.error("Paste at least one product URL.");
      return;
    }

    enqueueMutation.mutate({
      urls,
      categoryId: form.defaultCategoryId,
      subcategoryId: form.defaultSubcategoryId,
      categoryLabel: selectedCategory?.name ?? null,
      promptOverride: null,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Product Automation</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Queue product links, let Gemini build draft listings on a schedule, and review them before going live.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => runNowMutation.mutate()}
              disabled={runNowMutation.isPending || settingsLoading}
            >
              {runNowMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              Run Now
            </Button>
            <Button
              onClick={handleSaveSettings}
              disabled={saveSettingsMutation.isPending || settingsLoading}
              className="bg-gold text-black hover:bg-gold-light"
            >
              {saveSettingsMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Settings
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Wand2 className="w-4 h-4 text-gold" />
              Gemini Budget
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{requestsPerSource}</p>
            <p className="text-xs text-muted-foreground">Reserved Gemini requests per queued product draft.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Clock3 className="w-4 h-4 text-gold" />
              Throughput / Minute
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{estimatedDraftsPerMinute}</p>
            <p className="text-xs text-muted-foreground">Based on your current requests-per-minute ceiling.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Bot className="w-4 h-4 text-gold" />
              Throughput / Day
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{estimatedDraftsPerDay}</p>
            <p className="text-xs text-muted-foreground">Approximate daily draft capacity before the worker pauses.</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-2xl border border-border bg-card p-6 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-condensed text-lg font-bold uppercase tracking-wider text-foreground">Automation Settings</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Semi-automatic mode creates draft products only. Nothing goes live until you review it in Products.
                </p>
              </div>
              <Badge className={form.isEnabled ? "bg-green-500/10 text-green-600 border-green-500/30" : "bg-secondary text-muted-foreground border-border"}>
                {form.isEnabled ? "Enabled" : "Paused"}
              </Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/20 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">Scheduler status</p>
                <p className="text-xs text-muted-foreground">The worker checks the queue in the background and creates inactive drafts.</p>
              </div>
              <Switch
                checked={form.isEnabled}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isEnabled: checked }))}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Run Every (Minutes)</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.runEveryMinutes}
                  onChange={(event) => setForm((prev) => ({ ...prev, runEveryMinutes: Number(event.target.value) || 1 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Queue Items Per Run</Label>
                <Input
                  type="number"
                  min={1}
                  value={form.maxSourcesPerRun}
                  onChange={(event) => setForm((prev) => ({ ...prev, maxSourcesPerRun: Number(event.target.value) || 1 }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Gemini Requests / Minute</Label>
                <Input
                  type="number"
                  min={requestsPerSource}
                  value={form.geminiRequestsPerMinuteLimit}
                  onChange={(event) => setForm((prev) => ({ ...prev, geminiRequestsPerMinuteLimit: Number(event.target.value) || requestsPerSource }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Gemini Requests / Day</Label>
                <Input
                  type="number"
                  min={requestsPerSource}
                  value={form.geminiRequestsPerDayLimit}
                  onChange={(event) => setForm((prev) => ({ ...prev, geminiRequestsPerDayLimit: Number(event.target.value) || requestsPerSource }))}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Saved Model</Label>
                <Select
                  value={form.savedModelId ? String(form.savedModelId) : "none"}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, savedModelId: value === "none" ? null : Number(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a saved model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No model selected</SelectItem>
                    {(savedModels?.models ?? []).map((model) => (
                      <SelectItem key={model.id} value={String(model.id)}>
                        {model.name || `Model #${model.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Default Category</Label>
                <Select
                  value={form.defaultCategoryId ? String(form.defaultCategoryId) : "none"}
                  onValueChange={(value) => {
                    const categoryId = value === "none" ? null : Number(value);
                    const category = categories?.find((item) => item.id === categoryId) ?? null;
                    setForm((prev) => ({
                      ...prev,
                      defaultCategoryId: categoryId,
                      defaultSubcategoryId: null,
                      defaultCategoryLabel: category?.name ?? null,
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No forced category</SelectItem>
                    {(categories ?? []).map((category) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Default Subcategory</Label>
              <Select
                value={form.defaultSubcategoryId ? String(form.defaultSubcategoryId) : "none"}
                onValueChange={(value) => setForm((prev) => ({
                  ...prev,
                  defaultSubcategoryId: value === "none" ? null : Number(value),
                }))}
                disabled={!selectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder={selectedCategory ? "Select subcategory" : "Pick a category first"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No forced subcategory</SelectItem>
                  {(selectedCategory?.subcategories ?? []).map((subcategory) => (
                    <SelectItem key={subcategory.id} value={String(subcategory.id)}>
                      {subcategory.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Default Try-On Prompt</Label>
              <Textarea
                rows={4}
                value={form.defaultPrompt}
                onChange={(event) => setForm((prev) => ({ ...prev, defaultPrompt: event.target.value }))}
                placeholder="Tell the worker how garments should be placed on the saved model."
              />
            </div>

            <div className="rounded-xl border border-dashed border-gold/30 bg-gold/5 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Current behavior</p>
              <p>
                Each queued source reserves about {requestsPerSource} Gemini requests: multiple try-on views plus listing analysis.
                Infographic generation is intentionally skipped here to keep your request budget predictable.
              </p>
              <p className="mt-2">
                Last run: <span className="text-foreground">{formatDate(settingsData?.settings?.lastRunAt)}</span>
              </p>
              <p className="mt-1">
                Summary: <span className="text-foreground">{settingsData?.settings?.lastRunSummary || "No runs yet."}</span>
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6 space-y-5">
            <div>
              <h2 className="font-condensed text-lg font-bold uppercase tracking-wider text-foreground">Queue Product Links</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Paste one product URL per line. New drafts will appear in the Products area as inactive items for review.
              </p>
            </div>

            <Textarea
              rows={10}
              value={bulkLinks}
              onChange={(event) => setBulkLinks(event.target.value)}
              placeholder={"https://example.com/product-1\nhttps://example.com/product-2\nhttps://example.com/product-3"}
            />

            <Button
              onClick={handleQueueLinks}
              disabled={enqueueMutation.isPending}
              className="w-full bg-gold text-black hover:bg-gold-light"
            >
              {enqueueMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Add Links To Queue
            </Button>

            <div className="rounded-xl border border-border bg-secondary/20 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Review flow</p>
              <p>
                The automation creates draft products only. Review them from the Products screen, then switch them to Active when they look right.
              </p>
            </div>
          </section>
        </div>

        <section className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex flex-col gap-2 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-condensed text-lg font-bold uppercase tracking-wider text-foreground">Queued Sources</h2>
              <p className="text-sm text-muted-foreground">Status, retries, and draft links for each imported product source.</p>
            </div>
            {settingsLoading || queueLoading ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /> : null}
          </div>

          <div className="divide-y divide-border">
            {(queue ?? []).length === 0 && !queueLoading ? (
              <div className="px-6 py-10 text-sm text-muted-foreground">No source links have been queued yet.</div>
            ) : null}

            {(queue ?? []).map((source) => (
              <div key={source.id} className="px-6 py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={statusTone(source.status)}>{source.status.replace(/_/g, " ")}</Badge>
                      {source.productId ? <Badge variant="outline">Draft #{source.productId}</Badge> : null}
                      <span className="text-xs text-muted-foreground">Attempts: {source.attemptCount ?? 0}</span>
                    </div>

                    <p className="text-sm font-medium text-foreground break-all">{source.sourceUrl}</p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>Created: {formatDate(source.createdAt)}</span>
                      <span>Last attempt: {formatDate(source.lastAttemptAt)}</span>
                      <span>Next try: {formatDate(source.nextAttemptAt)}</span>
                    </div>

                    {source.notes ? (
                      <p className="text-sm text-muted-foreground">{source.notes}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {source.productId ? (
                      <Button variant="outline" size="sm" onClick={() => setLocation(`/admin-saad/product/edit/${source.productId}`)}>
                        Review Draft
                      </Button>
                    ) : null}
                    {source.status === "failed" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => retryMutation.mutate({ id: source.id })}
                        disabled={retryMutation.isPending}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry
                      </Button>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate({ id: source.id })}
                      disabled={deleteMutation.isPending}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {(settingsLoading || queueLoading) && !settingsData ? (
          <div className="flex items-center justify-center py-10 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading automation workspace...
          </div>
        ) : null}
      </div>
    </AdminLayout>
  );
}
