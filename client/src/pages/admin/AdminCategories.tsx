import { useState } from "react";
import AdminLayout from "@/pages/layouts/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Plus, Edit2, Trash2, ChevronDown, ChevronRight, Folder, FolderOpen, Tag, GripVertical, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryFormData {
  id?: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

interface SubcategoryFormData {
  id?: number;
  categoryId?: number;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
}

const defaultCategory: CategoryFormData = {
  name: "",
  slug: "",
  icon: "",
  description: "",
  imageUrl: "",
  sortOrder: 0,
  isActive: true,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
};

const defaultSubcategory: SubcategoryFormData = {
  name: "",
  slug: "",
  description: "",
  sortOrder: 0,
  isActive: true,
};

export default function AdminCategories() {
  const { data: categories, isLoading, error } = trpc.category.adminList.useQuery();
  const utils = trpc.useUtils();

  // Debug: log any errors
  if (error) {
    console.error("Categories fetch error:", error);
  }

  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"category" | "subcategory">("category");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>(defaultCategory);
  const [subcategoryForm, setSubcategoryForm] = useState<SubcategoryFormData>(defaultSubcategory);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const createCategory = trpc.category.create.useMutation({
    onSuccess: () => {
      utils.category.adminList.invalidate();
      setIsCategoryDialogOpen(false);
      setCategoryForm(defaultCategory);
      toast.success("Category created successfully");
    },
    onError: (error) => toast.error("Failed to create category: " + error.message),
  });

  const updateCategory = trpc.category.update.useMutation({
    onSuccess: () => {
      utils.category.adminList.invalidate();
      setIsCategoryDialogOpen(false);
      setCategoryForm(defaultCategory);
      toast.success("Category updated successfully");
    },
    onError: (error) => toast.error("Failed to update category: " + error.message),
  });

  const deleteCategory = trpc.category.delete.useMutation({
    onSuccess: () => {
      utils.category.adminList.invalidate();
      setIsDeleteDialogOpen(false);
      toast.success("Category deleted successfully");
    },
    onError: (error) => toast.error("Failed to delete category: " + error.message),
  });

  const createSubcategory = trpc.category.createSubcategory.useMutation({
    onSuccess: () => {
      utils.category.adminList.invalidate();
      setIsSubcategoryDialogOpen(false);
      setSubcategoryForm(defaultSubcategory);
      toast.success("Subcategory created successfully");
    },
    onError: (error) => toast.error("Failed to create subcategory: " + error.message),
  });

  const updateSubcategory = trpc.category.updateSubcategory.useMutation({
    onSuccess: () => {
      utils.category.adminList.invalidate();
      setIsSubcategoryDialogOpen(false);
      setSubcategoryForm(defaultSubcategory);
      toast.success("Subcategory updated successfully");
    },
    onError: (error) => toast.error("Failed to update subcategory: " + error.message),
  });

  const deleteSubcategory = trpc.category.deleteSubcategory.useMutation({
    onSuccess: () => {
      utils.category.adminList.invalidate();
      setIsDeleteDialogOpen(false);
      toast.success("Subcategory deleted successfully");
    },
    onError: (error) => toast.error("Failed to delete subcategory: " + error.message),
  });

  const toggleExpand = (id: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCategories(newExpanded);
  };

  const openCategoryDialog = (category?: any) => {
    if (category) {
      setCategoryForm({
        id: category.id,
        name: category.name,
        slug: category.slug,
        icon: category.icon || "",
        description: category.description || "",
        imageUrl: category.imageUrl || "",
        sortOrder: category.sortOrder,
        isActive: category.isActive,
        seoTitle: category.seoTitle || "",
        seoDescription: category.seoDescription || "",
        seoKeywords: category.seoKeywords || "",
      });
    } else {
      setCategoryForm(defaultCategory);
    }
    setIsCategoryDialogOpen(true);
  };

  const openSubcategoryDialog = (categoryId: number, subcategory?: typeof subcategoryForm & { id: number }) => {
    setActiveCategoryId(categoryId);
    if (subcategory) {
      setSubcategoryForm({
        id: subcategory.id,
        categoryId,
        name: subcategory.name,
        slug: subcategory.slug,
        description: subcategory.description || "",
        sortOrder: subcategory.sortOrder,
        isActive: subcategory.isActive,
      });
    } else {
      setSubcategoryForm({ ...defaultSubcategory, categoryId });
    }
    setIsSubcategoryDialogOpen(true);
  };

  const openDeleteDialog = (type: "category" | "subcategory", id: number) => {
    setDeleteType(type);
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name || !categoryForm.slug) {
      toast.error("Name and slug are required");
      return;
    }

    const data = { ...categoryForm };
    delete (data as any).id;

    if (categoryForm.id) {
      updateCategory.mutate({ id: categoryForm.id, ...data });
    } else {
      createCategory.mutate(data);
    }
  };

  const handleSaveSubcategory = () => {
    if (!subcategoryForm.name || !subcategoryForm.slug) {
      toast.error("Name and slug are required");
      return;
    }

    const data = { ...subcategoryForm };
    delete (data as any).id;
    delete (data as any).categoryId;

    if (subcategoryForm.id && activeCategoryId) {
      updateSubcategory.mutate({ id: subcategoryForm.id, ...data });
    } else if (activeCategoryId) {
      createSubcategory.mutate({ categoryId: activeCategoryId, ...data });
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;

    if (deleteType === "category") {
      deleteCategory.mutate({ id: deleteId });
    } else {
      deleteSubcategory.mutate({ id: deleteId });
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Categories</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage product categories and subcategories
            </p>
          </div>
          <Button onClick={() => openCategoryDialog()} className="bg-gold text-black hover:bg-gold-light">
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Button>
        </div>

        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading categories...
            </div>
          ) : !categories || categories.length === 0 ? (
            <div className="p-12 text-center">
              {error ? (
                <>
                  <div className="text-red-500 mb-2">⚠️ Error loading categories</div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Database tables may not exist. Run the SQL script or create categories manually.
                  </p>
                  <p className="text-xs text-muted-foreground mb-4 font-mono bg-secondary p-2 rounded">
                    {error.message}
                  </p>
                </>
              ) : (
                <>
                  <Folder className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-muted-foreground">No categories found.</p>
                </>
              )}
              <div className="flex gap-2 justify-center mt-4">
                <Button onClick={() => openCategoryDialog()} variant="outline">
                  <Plus className="w-4 h-4 mr-2" /> Create Category
                </Button>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="divide-y divide-border">
                {categories.map((category) => (
                  <Collapsible
                    key={category.id}
                    open={expandedCategories.has(category.id)}
                    onOpenChange={() => toggleExpand(category.id)}
                  >
                    <div className="flex items-center gap-3 p-4 hover:bg-secondary/20 transition-colors group">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                          {expandedCategories.has(category.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>

                      <div className="text-2xl shrink-0">{category.icon || "📁"}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{category.name}</span>
                          {!category.isActive && (
                            <Badge variant="secondary" className="text-xs">Inactive</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          /{category.slug} • {category.subcategories?.length || 0} subcategories
                        </div>
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-gold"
                          onClick={(e) => { e.stopPropagation(); openSubcategoryDialog(category.id); }}
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" /> Add Subcategory
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => { e.stopPropagation(); openCategoryDialog(category); }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={(e) => { e.stopPropagation(); openDeleteDialog("category", category.id); }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <CollapsibleContent>
                      <div className="bg-secondary/20 border-t border-border">
                        {category.subcategories && category.subcategories.length > 0 ? (
                          <div className="divide-y divide-border/50">
                            {category.subcategories.map((sub) => (
                              <div
                                key={sub.id}
                                className="flex items-center gap-3 pl-14 pr-4 py-3 hover:bg-secondary/30 transition-colors group"
                              >
                                <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">{sub.name}</span>
                                    {!sub.isActive && (
                                      <Badge variant="secondary" className="text-xs">Inactive</Badge>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">/{sub.slug}</div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7"
                                    onClick={() => openSubcategoryDialog(category.id, sub as any)}
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                    onClick={() => openDeleteDialog("subcategory", sub.id)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="pl-14 pr-4 py-6 text-sm text-muted-foreground text-center">
                            No subcategories yet
                          </div>
                        )}
                        <div className="pl-14 pr-4 py-3 border-t border-border/50">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            onClick={() => openSubcategoryDialog(category.id)}
                          >
                            <Plus className="w-3.5 h-3.5 mr-1" /> Add Subcategory
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{categoryForm.id ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={categoryForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setCategoryForm(prev => ({
                      ...prev,
                      name,
                      slug: prev.id ? prev.slug : generateSlug(name),
                    }));
                  }}
                  placeholder="e.g., Ski Wear"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g., ski-wear"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Icon (emoji)</Label>
              <Input
                value={categoryForm.icon}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="e.g., ⛷️ or /images/icon.svg"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={categoryForm.description}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of this category"
              />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input
                value={categoryForm.imageUrl}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                placeholder="https://..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={categoryForm.sortOrder}
                  onChange={(e) => setCategoryForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={categoryForm.isActive}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-border"
                  />
                  Active
                </Label>
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <h4 className="text-sm font-semibold mb-3">SEO Settings</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>SEO Title</Label>
                  <Input
                    value={categoryForm.seoTitle}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, seoTitle: e.target.value }))}
                    placeholder="Custom page title for SEO"
                  />
                </div>
                <div className="space-y-2">
                  <Label>SEO Description</Label>
                  <Input
                    value={categoryForm.seoDescription}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, seoDescription: e.target.value }))}
                    placeholder="Meta description for search engines"
                  />
                </div>
                <div className="space-y-2">
                  <Label>SEO Keywords</Label>
                  <Input
                    value={categoryForm.seoKeywords}
                    onChange={(e) => setCategoryForm(prev => ({ ...prev, seoKeywords: e.target.value }))}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSaveCategory}
              disabled={createCategory.isPending || updateCategory.isPending}
              className="bg-gold text-black hover:bg-gold-light"
            >
              {(createCategory.isPending || updateCategory.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {categoryForm.id ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subcategory Dialog */}
      <Dialog open={isSubcategoryDialogOpen} onOpenChange={setIsSubcategoryDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{subcategoryForm.id ? "Edit Subcategory" : "Add Subcategory"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  value={subcategoryForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setSubcategoryForm(prev => ({
                      ...prev,
                      name,
                      slug: prev.id ? prev.slug : generateSlug(name),
                    }));
                  }}
                  placeholder="e.g., Ski Jackets"
                />
              </div>
              <div className="space-y-2">
                <Label>Slug *</Label>
                <Input
                  value={subcategoryForm.slug}
                  onChange={(e) => setSubcategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g., ski-jackets"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={subcategoryForm.description}
                onChange={(e) => setSubcategoryForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Sort Order</Label>
                <Input
                  type="number"
                  value={subcategoryForm.sortOrder}
                  onChange={(e) => setSubcategoryForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={subcategoryForm.isActive}
                    onChange={(e) => setSubcategoryForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-border"
                  />
                  Active
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubcategoryDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleSaveSubcategory}
              disabled={createSubcategory.isPending || updateSubcategory.isPending}
              className="bg-gold text-black hover:bg-gold-light"
            >
              {(createSubcategory.isPending || updateSubcategory.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {subcategoryForm.id ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-muted-foreground">
              Are you sure you want to delete this {deleteType}? This action cannot be undone.
              {deleteType === "category" && " All subcategories will also be deleted."}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteCategory.isPending || deleteSubcategory.isPending}
            >
              {(deleteCategory.isPending || deleteSubcategory.isPending) && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
