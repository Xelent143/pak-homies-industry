import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { A as AdminLayout } from "./AdminLayout-D0S_T65I.js";
import { c as cn, t as trpc, B as Button } from "../entry-server.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, L as Label, I as Input, d as DialogFooter } from "./label-C2k6QFV2.js";
import { B as Badge } from "./badge-BLnXf9IA.js";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { Plus, Loader2, Folder, ChevronDown, ChevronRight, Edit2, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import "wouter";
import "@trpc/client";
import "./SEOHead-oEJRQGbs.js";
import "react-helmet-async";
import "@trpc/react-query";
import "@tanstack/react-query";
import "react-dom/server";
import "superjson";
import "next-themes";
import "@radix-ui/react-tooltip";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
function Collapsible({
  ...props
}) {
  return /* @__PURE__ */ jsx(CollapsiblePrimitive.Root, { "data-loc": "client\\src\\components\\ui\\collapsible.tsx:6", "data-slot": "collapsible", ...props });
}
function CollapsibleTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    CollapsiblePrimitive.CollapsibleTrigger,
    {
      "data-loc": "client\\src\\components\\ui\\collapsible.tsx:13",
      "data-slot": "collapsible-trigger",
      ...props
    }
  );
}
function CollapsibleContent({
  ...props
}) {
  return /* @__PURE__ */ jsx(
    CollapsiblePrimitive.CollapsibleContent,
    {
      "data-loc": "client\\src\\components\\ui\\collapsible.tsx:24",
      "data-slot": "collapsible-content",
      ...props
    }
  );
}
function ScrollArea({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    ScrollAreaPrimitive.Root,
    {
      "data-loc": "client\\src\\components\\ui\\scroll-area.tsx:12",
      "data-slot": "scroll-area",
      className: cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          ScrollAreaPrimitive.Viewport,
          {
            "data-loc": "client\\src\\components\\ui\\scroll-area.tsx:17",
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsx(ScrollBar, { "data-loc": "client\\src\\components\\ui\\scroll-area.tsx:23" }),
        /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, { "data-loc": "client\\src\\components\\ui\\scroll-area.tsx:24" })
      ]
    }
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    ScrollAreaPrimitive.ScrollAreaScrollbar,
    {
      "data-loc": "client\\src\\components\\ui\\scroll-area.tsx:35",
      "data-slot": "scroll-area-scrollbar",
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        ScrollAreaPrimitive.ScrollAreaThumb,
        {
          "data-loc": "client\\src\\components\\ui\\scroll-area.tsx:48",
          "data-slot": "scroll-area-thumb",
          className: "bg-border relative flex-1 rounded-full"
        }
      )
    }
  );
}
const defaultCategory = {
  name: "",
  slug: "",
  icon: "",
  description: "",
  imageUrl: "",
  sortOrder: 0,
  isActive: true,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: ""
};
const defaultSubcategory = {
  name: "",
  slug: "",
  description: "",
  sortOrder: 0,
  isActive: true
};
function AdminCategories() {
  const { data: categories, isLoading, error } = trpc.category.adminList.useQuery();
  const utils = trpc.useUtils();
  if (error) {
    console.error("Categories fetch error:", error);
  }
  const [expandedCategories, setExpandedCategories] = useState(/* @__PURE__ */ new Set());
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState("category");
  const [deleteId, setDeleteId] = useState(null);
  const [categoryForm, setCategoryForm] = useState(defaultCategory);
  const [subcategoryForm, setSubcategoryForm] = useState(defaultSubcategory);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const createCategory = trpc.category.create.useMutation({
    onSuccess: () => {
      utils.category.adminList.invalidate();
      setIsCategoryDialogOpen(false);
      setCategoryForm(defaultCategory);
      toast.success("Category created successfully");
    },
    onError: (error2) => toast.error("Failed to create category: " + error2.message)
  });
  const updateCategory = trpc.category.update.useMutation({
    onSuccess: () => {
      utils.category.adminList.invalidate();
      setIsCategoryDialogOpen(false);
      setCategoryForm(defaultCategory);
      toast.success("Category updated successfully");
    },
    onError: (error2) => toast.error("Failed to update category: " + error2.message)
  });
  const deleteCategory = trpc.category.delete.useMutation({
    onSuccess: () => {
      utils.category.adminList.invalidate();
      setIsDeleteDialogOpen(false);
      toast.success("Category deleted successfully");
    },
    onError: (error2) => toast.error("Failed to delete category: " + error2.message)
  });
  const createSubcategory = trpc.category.createSubcategory.useMutation({
    onSuccess: () => {
      utils.category.adminList.invalidate();
      setIsSubcategoryDialogOpen(false);
      setSubcategoryForm(defaultSubcategory);
      toast.success("Subcategory created successfully");
    },
    onError: (error2) => toast.error("Failed to create subcategory: " + error2.message)
  });
  const updateSubcategory = trpc.category.updateSubcategory.useMutation({
    onSuccess: () => {
      utils.category.adminList.invalidate();
      setIsSubcategoryDialogOpen(false);
      setSubcategoryForm(defaultSubcategory);
      toast.success("Subcategory updated successfully");
    },
    onError: (error2) => toast.error("Failed to update subcategory: " + error2.message)
  });
  const deleteSubcategory = trpc.category.deleteSubcategory.useMutation({
    onSuccess: () => {
      utils.category.adminList.invalidate();
      setIsDeleteDialogOpen(false);
      toast.success("Subcategory deleted successfully");
    },
    onError: (error2) => toast.error("Failed to delete subcategory: " + error2.message)
  });
  const toggleExpand = (id) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedCategories(newExpanded);
  };
  const openCategoryDialog = (category) => {
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
        seoKeywords: category.seoKeywords || ""
      });
    } else {
      setCategoryForm(defaultCategory);
    }
    setIsCategoryDialogOpen(true);
  };
  const openSubcategoryDialog = (categoryId, subcategory) => {
    setActiveCategoryId(categoryId);
    if (subcategory) {
      setSubcategoryForm({
        id: subcategory.id,
        categoryId,
        name: subcategory.name,
        slug: subcategory.slug,
        description: subcategory.description || "",
        sortOrder: subcategory.sortOrder,
        isActive: subcategory.isActive
      });
    } else {
      setSubcategoryForm({ ...defaultSubcategory, categoryId });
    }
    setIsSubcategoryDialogOpen(true);
  };
  const openDeleteDialog = (type, id) => {
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
    delete data.id;
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
    delete data.id;
    delete data.categoryId;
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
  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  };
  return /* @__PURE__ */ jsxs(AdminLayout, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:241", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:242", className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:243", className: "flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:244", children: [
          /* @__PURE__ */ jsx("h1", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:245", className: "font-serif text-2xl font-bold text-foreground", children: "Categories" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:246", className: "text-sm text-muted-foreground mt-1", children: "Manage product categories and subcategories" })
        ] }),
        /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:250", onClick: () => openCategoryDialog(), className: "bg-gold text-black hover:bg-gold-light", children: [
          /* @__PURE__ */ jsx(Plus, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:251", className: "w-4 h-4 mr-2" }),
          " Add Category"
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:255", className: "bg-card border border-border rounded-xl shadow-sm overflow-hidden", children: isLoading ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:257", className: "p-12 text-center text-muted-foreground", children: [
        /* @__PURE__ */ jsx(Loader2, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:258", className: "w-6 h-6 animate-spin mx-auto mb-2" }),
        "Loading categories..."
      ] }) : !categories || categories.length === 0 ? /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:262", className: "p-12 text-center", children: [
        error ? /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:265", className: "text-red-500 mb-2", children: "⚠️ Error loading categories" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:266", className: "text-sm text-muted-foreground mb-4", children: "Database tables may not exist. Run the SQL script or create categories manually." }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:269", className: "text-xs text-muted-foreground mb-4 font-mono bg-secondary p-2 rounded", children: error.message })
        ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(Folder, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:275", className: "w-12 h-12 mx-auto mb-4 opacity-30" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:276", className: "text-muted-foreground", children: "No categories found." })
        ] }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:279", className: "flex gap-2 justify-center mt-4", children: /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:280", onClick: () => openCategoryDialog(), variant: "outline", children: [
          /* @__PURE__ */ jsx(Plus, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:281", className: "w-4 h-4 mr-2" }),
          " Create Category"
        ] }) })
      ] }) : /* @__PURE__ */ jsx(ScrollArea, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:286", className: "h-[calc(100vh-280px)]", children: /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:287", className: "divide-y divide-border", children: categories.map((category) => /* @__PURE__ */ jsxs(
        Collapsible,
        {
          "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:289",
          open: expandedCategories.has(category.id),
          onOpenChange: () => toggleExpand(category.id),
          children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:294", className: "flex items-center gap-3 p-4 hover:bg-secondary/20 transition-colors group", children: [
              /* @__PURE__ */ jsx(CollapsibleTrigger, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:295", asChild: true, children: /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:296", variant: "ghost", size: "icon", className: "h-8 w-8 shrink-0", children: expandedCategories.has(category.id) ? /* @__PURE__ */ jsx(ChevronDown, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:298", className: "w-4 h-4" }) : /* @__PURE__ */ jsx(ChevronRight, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:300", className: "w-4 h-4" }) }) }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:305", className: "text-2xl shrink-0", children: category.icon || "📁" }),
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:307", className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:308", className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:309", className: "font-semibold text-foreground", children: category.name }),
                  !category.isActive && /* @__PURE__ */ jsx(Badge, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:311", variant: "secondary", className: "text-xs", children: "Inactive" })
                ] }),
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:314", className: "text-xs text-muted-foreground", children: [
                  "/",
                  category.slug,
                  " • ",
                  category.subcategories?.length || 0,
                  " subcategories"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:319", className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
                /* @__PURE__ */ jsxs(
                  Button,
                  {
                    "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:320",
                    variant: "ghost",
                    size: "sm",
                    className: "h-8 text-xs text-gold",
                    onClick: (e) => {
                      e.stopPropagation();
                      openSubcategoryDialog(category.id);
                    },
                    children: [
                      /* @__PURE__ */ jsx(Plus, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:326", className: "w-3.5 h-3.5 mr-1" }),
                      " Add Subcategory"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:328",
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8",
                    onClick: (e) => {
                      e.stopPropagation();
                      openCategoryDialog(category);
                    },
                    children: /* @__PURE__ */ jsx(Edit2, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:334", className: "w-4 h-4" })
                  }
                ),
                /* @__PURE__ */ jsx(
                  Button,
                  {
                    "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:336",
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8 text-destructive hover:text-destructive",
                    onClick: (e) => {
                      e.stopPropagation();
                      openDeleteDialog("category", category.id);
                    },
                    children: /* @__PURE__ */ jsx(Trash2, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:342", className: "w-4 h-4" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx(CollapsibleContent, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:347", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:348", className: "bg-secondary/20 border-t border-border", children: [
              category.subcategories && category.subcategories.length > 0 ? /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:350", className: "divide-y divide-border/50", children: category.subcategories.map((sub) => /* @__PURE__ */ jsxs(
                "div",
                {
                  "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:352",
                  className: "flex items-center gap-3 pl-14 pr-4 py-3 hover:bg-secondary/30 transition-colors group",
                  children: [
                    /* @__PURE__ */ jsx(Tag, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:356", className: "w-4 h-4 text-muted-foreground shrink-0" }),
                    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:357", className: "flex-1 min-w-0", children: [
                      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:358", className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:359", className: "text-sm font-medium", children: sub.name }),
                        !sub.isActive && /* @__PURE__ */ jsx(Badge, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:361", variant: "secondary", className: "text-xs", children: "Inactive" })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:364", className: "text-xs text-muted-foreground", children: [
                        "/",
                        sub.slug
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:366", className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:367",
                          variant: "ghost",
                          size: "icon",
                          className: "h-7 w-7",
                          onClick: () => openSubcategoryDialog(category.id, sub),
                          children: /* @__PURE__ */ jsx(Edit2, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:373", className: "w-3.5 h-3.5" })
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        Button,
                        {
                          "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:375",
                          variant: "ghost",
                          size: "icon",
                          className: "h-7 w-7 text-destructive hover:text-destructive",
                          onClick: () => openDeleteDialog("subcategory", sub.id),
                          children: /* @__PURE__ */ jsx(Trash2, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:381", className: "w-3.5 h-3.5" })
                        }
                      )
                    ] })
                  ]
                },
                sub.id
              )) }) : /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:388", className: "pl-14 pr-4 py-6 text-sm text-muted-foreground text-center", children: "No subcategories yet" }),
              /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:392", className: "pl-14 pr-4 py-3 border-t border-border/50", children: /* @__PURE__ */ jsxs(
                Button,
                {
                  "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:393",
                  variant: "ghost",
                  size: "sm",
                  className: "text-xs",
                  onClick: () => openSubcategoryDialog(category.id),
                  children: [
                    /* @__PURE__ */ jsx(Plus, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:399", className: "w-3.5 h-3.5 mr-1" }),
                    " Add Subcategory"
                  ]
                }
              ) })
            ] }) })
          ]
        },
        category.id
      )) }) }) })
    ] }),
    /* @__PURE__ */ jsx(Dialog, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:413", open: isCategoryDialogOpen, onOpenChange: setIsCategoryDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:414", className: "max-w-lg max-h-[90vh] overflow-y-auto", children: [
      /* @__PURE__ */ jsx(DialogHeader, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:415", children: /* @__PURE__ */ jsx(DialogTitle, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:416", children: categoryForm.id ? "Edit Category" : "Add Category" }) }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:418", className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:419", className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:420", className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:421", children: "Name *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:422",
                value: categoryForm.name,
                onChange: (e) => {
                  const name = e.target.value;
                  setCategoryForm((prev) => ({
                    ...prev,
                    name,
                    slug: prev.id ? prev.slug : generateSlug(name)
                  }));
                },
                placeholder: "e.g., Ski Wear"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:435", className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:436", children: "Slug *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:437",
                value: categoryForm.slug,
                onChange: (e) => setCategoryForm((prev) => ({ ...prev, slug: e.target.value })),
                placeholder: "e.g., ski-wear"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:444", className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:445", children: "Icon (emoji)" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:446",
              value: categoryForm.icon,
              onChange: (e) => setCategoryForm((prev) => ({ ...prev, icon: e.target.value })),
              placeholder: "e.g., ⛷️ or /images/icon.svg"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:452", className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:453", children: "Description" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:454",
              value: categoryForm.description,
              onChange: (e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value })),
              placeholder: "Brief description of this category"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:460", className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:461", children: "Image URL" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:462",
              value: categoryForm.imageUrl,
              onChange: (e) => setCategoryForm((prev) => ({ ...prev, imageUrl: e.target.value })),
              placeholder: "https://..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:468", className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:469", className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:470", children: "Sort Order" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:471",
                type: "number",
                value: categoryForm.sortOrder,
                onChange: (e) => setCategoryForm((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:477", className: "space-y-2", children: /* @__PURE__ */ jsxs(Label, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:478", className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:479",
                type: "checkbox",
                checked: categoryForm.isActive,
                onChange: (e) => setCategoryForm((prev) => ({ ...prev, isActive: e.target.checked })),
                className: "rounded border-border"
              }
            ),
            "Active"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:489", className: "border-t border-border pt-4", children: [
          /* @__PURE__ */ jsx("h4", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:490", className: "text-sm font-semibold mb-3", children: "SEO Settings" }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:491", className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:492", className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:493", children: "SEO Title" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:494",
                  value: categoryForm.seoTitle,
                  onChange: (e) => setCategoryForm((prev) => ({ ...prev, seoTitle: e.target.value })),
                  placeholder: "Custom page title for SEO"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:500", className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:501", children: "SEO Description" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:502",
                  value: categoryForm.seoDescription,
                  onChange: (e) => setCategoryForm((prev) => ({ ...prev, seoDescription: e.target.value })),
                  placeholder: "Meta description for search engines"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:508", className: "space-y-2", children: [
              /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:509", children: "SEO Keywords" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:510",
                  value: categoryForm.seoKeywords,
                  onChange: (e) => setCategoryForm((prev) => ({ ...prev, seoKeywords: e.target.value })),
                  placeholder: "keyword1, keyword2, keyword3"
                }
              )
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:519", children: [
        /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:520", variant: "outline", onClick: () => setIsCategoryDialogOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:521",
            onClick: handleSaveCategory,
            disabled: createCategory.isPending || updateCategory.isPending,
            className: "bg-gold text-black hover:bg-gold-light",
            children: [
              (createCategory.isPending || updateCategory.isPending) && /* @__PURE__ */ jsx(Loader2, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:527", className: "w-4 h-4 mr-2 animate-spin" }),
              categoryForm.id ? "Update" : "Create"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:536", open: isSubcategoryDialogOpen, onOpenChange: setIsSubcategoryDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:537", className: "max-w-lg", children: [
      /* @__PURE__ */ jsx(DialogHeader, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:538", children: /* @__PURE__ */ jsx(DialogTitle, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:539", children: subcategoryForm.id ? "Edit Subcategory" : "Add Subcategory" }) }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:541", className: "space-y-4 py-4", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:542", className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:543", className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:544", children: "Name *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:545",
                value: subcategoryForm.name,
                onChange: (e) => {
                  const name = e.target.value;
                  setSubcategoryForm((prev) => ({
                    ...prev,
                    name,
                    slug: prev.id ? prev.slug : generateSlug(name)
                  }));
                },
                placeholder: "e.g., Ski Jackets"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:558", className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:559", children: "Slug *" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:560",
                value: subcategoryForm.slug,
                onChange: (e) => setSubcategoryForm((prev) => ({ ...prev, slug: e.target.value })),
                placeholder: "e.g., ski-jackets"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:567", className: "space-y-2", children: [
          /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:568", children: "Description" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:569",
              value: subcategoryForm.description,
              onChange: (e) => setSubcategoryForm((prev) => ({ ...prev, description: e.target.value })),
              placeholder: "Brief description"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:575", className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:576", className: "space-y-2", children: [
            /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:577", children: "Sort Order" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:578",
                type: "number",
                value: subcategoryForm.sortOrder,
                onChange: (e) => setSubcategoryForm((prev) => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:584", className: "space-y-2", children: /* @__PURE__ */ jsxs(Label, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:585", className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:586",
                type: "checkbox",
                checked: subcategoryForm.isActive,
                onChange: (e) => setSubcategoryForm((prev) => ({ ...prev, isActive: e.target.checked })),
                className: "rounded border-border"
              }
            ),
            "Active"
          ] }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(DialogFooter, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:597", children: [
        /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:598", variant: "outline", onClick: () => setIsSubcategoryDialogOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:599",
            onClick: handleSaveSubcategory,
            disabled: createSubcategory.isPending || updateSubcategory.isPending,
            className: "bg-gold text-black hover:bg-gold-light",
            children: [
              (createSubcategory.isPending || updateSubcategory.isPending) && /* @__PURE__ */ jsx(Loader2, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:605", className: "w-4 h-4 mr-2 animate-spin" }),
              subcategoryForm.id ? "Update" : "Create"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(Dialog, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:614", open: isDeleteDialogOpen, onOpenChange: setIsDeleteDialogOpen, children: /* @__PURE__ */ jsxs(DialogContent, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:615", className: "max-w-md", children: [
      /* @__PURE__ */ jsx(DialogHeader, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:616", children: /* @__PURE__ */ jsx(DialogTitle, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:617", children: "Confirm Delete" }) }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:619", className: "py-4", children: /* @__PURE__ */ jsxs("p", { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:620", className: "text-muted-foreground", children: [
        "Are you sure you want to delete this ",
        deleteType,
        "? This action cannot be undone.",
        deleteType === "category" && " All subcategories will also be deleted."
      ] }) }),
      /* @__PURE__ */ jsxs(DialogFooter, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:625", children: [
        /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:626", variant: "outline", onClick: () => setIsDeleteDialogOpen(false), children: "Cancel" }),
        /* @__PURE__ */ jsxs(
          Button,
          {
            "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:627",
            variant: "destructive",
            onClick: handleDelete,
            disabled: deleteCategory.isPending || deleteSubcategory.isPending,
            children: [
              (deleteCategory.isPending || deleteSubcategory.isPending) && /* @__PURE__ */ jsx(Loader2, { "data-loc": "client\\src\\pages\\admin\\AdminCategories.tsx:633", className: "w-4 h-4 mr-2 animate-spin" }),
              "Delete"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  AdminCategories as default
};
