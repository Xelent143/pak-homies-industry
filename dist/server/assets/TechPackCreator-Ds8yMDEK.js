import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CheckIcon, CheckCircle2, ArrowLeft, ArrowRight, Download, Upload, Trash2, Plus } from "lucide-react";
import { c as cn, t as trpc, B as Button } from "../entry-server.js";
import { L as Label, I as Input } from "./label-C2k6QFV2.js";
import { T as Textarea } from "./textarea-DNjmcxjP.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BlbuqoI-.js";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { toast } from "sonner";
import { useLocation } from "wouter";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "@trpc/react-query";
import "@tanstack/react-query";
import "@trpc/client";
import "react-dom/server";
import "react-helmet-async";
import "superjson";
import "next-themes";
import "@radix-ui/react-tooltip";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "@radix-ui/react-dialog";
import "@radix-ui/react-label";
import "@radix-ui/react-select";
function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    CheckboxPrimitive.Root,
    {
      "data-loc": "client\\src\\components\\ui\\checkbox.tsx:12",
      "data-slot": "checkbox",
      className: cn(
        "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        CheckboxPrimitive.Indicator,
        {
          "data-loc": "client\\src\\components\\ui\\checkbox.tsx:20",
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current transition-none",
          children: /* @__PURE__ */ jsx(CheckIcon, { "data-loc": "client\\src\\components\\ui\\checkbox.tsx:24", className: "size-3.5" })
        }
      )
    }
  );
}
async function generateTechPackPdf(data, referenceNumber) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const primaryColor = [0, 0, 0];
  const accentColor = [212, 175, 55];
  const grayColor = [100, 100, 100];
  const lightGray = [240, 240, 240];
  const addHeader = (title, yPos = 20) => {
    doc.setFillColor(...primaryColor);
    doc.rect(0, yPos - 12, pageWidth, 16, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(title.toUpperCase(), 14, yPos - 1);
    doc.setTextColor(...primaryColor);
    return yPos + 10;
  };
  doc.setDrawColor(...accentColor);
  doc.setLineWidth(1.5);
  doc.line(14, 15, pageWidth - 14, 15);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("TECHNICAL PACKAGE", 14, 28);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...grayColor);
  doc.text(`Ref Number: ${referenceNumber}`, 14, 34);
  doc.text(`Date: ${(/* @__PURE__ */ new Date()).toLocaleDateString()}`, 14, 39);
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text(data.brandName.toUpperCase() || "BRAND NAME", pageWidth - 14, 28, { align: "right" });
  let y = 55;
  y = addHeader("1. Style Overview", y);
  const overviewData = [
    ["Style Name:", data.styleName || "N/A", "Garment Type:", data.garmentType || "N/A"],
    ["Season:", data.season || "N/A", "Gender:", data.gender || "N/A"],
    ["Contact:", data.contactName || "N/A", "Email:", data.email || "N/A"],
    ["Target Market:", data.targetMarket || "N/A", "Date Dev:", (/* @__PURE__ */ new Date()).toLocaleDateString()]
  ];
  doc.autoTable({
    startY: y,
    body: overviewData,
    theme: "plain",
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: {
      0: { fontStyle: "bold", textColor: grayColor, cellWidth: 35 },
      1: { cellWidth: 55 },
      2: { fontStyle: "bold", textColor: grayColor, cellWidth: 35 },
      3: { cellWidth: 55 }
    }
  });
  y = doc.lastAutoTable.finalY + 15;
  y = addHeader("2. Bill of Materials (BOM)", y);
  const bomData = [
    ["Component", "Description / Details"],
    ["Main Fabric", `${data.mainFabric || "N/A"}${data.mainFabricWeight ? ` (${data.mainFabricWeight})` : ""}`],
    ["Fabric Color", data.mainFabricColor || "N/A"],
    ["Lining Fabric", data.liningFabric || "N/A"],
    ["Secondary Fabric", data.secondaryFabric || "N/A"],
    ["Trims & Accessories", data.trims || "N/A"]
  ];
  doc.autoTable({
    startY: y,
    body: bomData.slice(1),
    columns: [{ header: bomData[0][0], dataKey: 0 }, { header: bomData[0][1], dataKey: 1 }],
    theme: "grid",
    headStyles: { fillColor: lightGray, textColor: primaryColor, fontStyle: "bold" },
    styles: { fontSize: 9 },
    columnStyles: { 0: { cellWidth: 50, fontStyle: "bold" } }
  });
  y = doc.lastAutoTable.finalY + 15;
  y = addHeader("3. Construction & Embellishments", y);
  const embellishmentsText = data.embellishments?.length > 0 ? data.embellishments.join(", ") : "None specified";
  const constructData = [
    ["Techniques", embellishmentsText],
    ["Placement Notes", data.embellishmentNotes || "N/A"]
  ];
  doc.autoTable({
    startY: y,
    body: constructData,
    theme: "grid",
    styles: { fontSize: 9 },
    columnStyles: { 0: { cellWidth: 50, fontStyle: "bold", fillColor: lightGray } }
  });
  doc.addPage();
  y = 20;
  y = addHeader(`4. Measurement Specifications (${data.sizeUnit?.toUpperCase() || "IN"})`, y);
  if (data.sizeChart && data.sizeChart.length > 0) {
    const sizeHeaders = ["Point of Measure", "Tol (+/-)", ...data.availableSizes || []];
    const sizeBody = data.sizeChart.map((row) => {
      const rowData = [row.pointOfMeasure, row.tolerance];
      (data.availableSizes || []).forEach((size) => {
        rowData.push(row.sizes[size] || "-");
      });
      return rowData;
    });
    doc.autoTable({
      startY: y,
      head: [sizeHeaders],
      body: sizeBody,
      theme: "grid",
      headStyles: { fillColor: primaryColor, textColor: 255 },
      styles: { fontSize: 8, halign: "center" },
      columnStyles: {
        0: { halign: "left", cellWidth: "auto", fontStyle: "bold" },
        1: { cellWidth: 20 }
      }
    });
    y = doc.lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.text("No measurement specifications provided.", 14, y);
    y += 15;
  }
  y = addHeader("5. Colorways & Quantities", y);
  if (data.colorways && data.colorways.length > 0) {
    const colorHeaders = ["Color Way", "Pantone", ...data.availableSizes || [], "Total"];
    let grandTotal = 0;
    const colorBody = data.colorways.map((cw) => {
      const rowData = [cw.colorName || "-", cw.pantoneCode || "-"];
      let rowTotal = 0;
      (data.availableSizes || []).forEach((size) => {
        const qty = Number(cw.quantities[size]) || 0;
        rowTotal += qty;
        rowData.push(qty.toString());
      });
      grandTotal += rowTotal;
      rowData.push(rowTotal.toString());
      return rowData;
    });
    const footerRow = ["TOTALS", ""];
    (data.availableSizes || []).forEach((size) => {
      const sizeTotal = data.colorways.reduce((sum, cw) => sum + (Number(cw.quantities[size]) || 0), 0);
      footerRow.push(sizeTotal.toString());
    });
    footerRow.push(grandTotal.toString());
    colorBody.push(footerRow);
    doc.autoTable({
      startY: y,
      head: [colorHeaders],
      body: colorBody,
      theme: "grid",
      headStyles: { fillColor: primaryColor, textColor: 255 },
      footStyles: { fillColor: lightGray, textColor: primaryColor, fontStyle: "bold" },
      styles: { fontSize: 9, halign: "center" },
      columnStyles: {
        0: { halign: "left", fontStyle: "bold" },
        1: { halign: "left" }
      },
      willDrawCell: function(data2) {
        if (data2.row.index === colorBody.length - 1) {
          doc.setFont("helvetica", "bold");
          doc.setFillColor(...lightGray);
        }
      }
    });
    y = doc.lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.text("No colorways provided.", 14, y);
    y += 15;
  }
  y = addHeader("6. Packaging & Labels", y);
  const pkgData = [
    ["Neck Label / Brand Tag", data.neckLabel || "Standard"],
    ["Care Label", data.careLabel || "Standard"],
    ["Hangtag", data.hangtag || "None"],
    ["Bagging / Packaging", data.packaging || "Standard clear polybag"]
  ];
  doc.autoTable({
    startY: y,
    body: pkgData,
    theme: "grid",
    styles: { fontSize: 9 },
    columnStyles: { 0: { cellWidth: 50, fontStyle: "bold", fillColor: lightGray } }
  });
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text(
      `Tech Pack: ${referenceNumber}  |  Generated by Pak Homies Industry`,
      14,
      doc.internal.pageSize.getHeight() - 10
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - 14,
      doc.internal.pageSize.getHeight() - 10,
      { align: "right" }
    );
  }
  doc.save(`TechPack_${data.garmentType}_${referenceNumber}.pdf`);
}
const techPackSchema = z.object({
  // Step 1: Basic Info
  brandName: z.string().min(1, "Brand name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  country: z.string().optional(),
  garmentType: z.string().min(1, "Garment type is required"),
  styleName: z.string().optional(),
  season: z.string().optional(),
  gender: z.string().optional(),
  targetMarket: z.string().optional(),
  // Step 2: Design Uploads
  images: z.array(z.object({
    imageUrl: z.string().url(),
    imageType: z.enum(["mockup", "flat_sketch", "reference", "hangtag", "care_label"]),
    caption: z.string().optional()
  })).default([]),
  // Step 3: Fabric & Materials
  mainFabric: z.string().min(1, "Main fabric details are required"),
  mainFabricWeight: z.string().optional(),
  mainFabricColor: z.string().optional(),
  liningFabric: z.string().optional(),
  secondaryFabric: z.string().optional(),
  trims: z.string().optional(),
  // Step 4: Embellishments
  embellishments: z.array(z.string()).default([]),
  embellishmentNotes: z.string().optional(),
  // Step 5: Size Specifications
  sizeUnit: z.enum(["inches", "cm"]).default("inches"),
  sizeChart: z.array(z.object({
    pointOfMeasure: z.string(),
    tolerance: z.string(),
    sizes: z.record(z.string(), z.string())
    // e.g., { "S": "20", "M": "21" }
  })).default([]),
  availableSizes: z.array(z.string()).default(["S", "M", "L", "XL"]),
  // Step 6: Colors & Quantities
  colorways: z.array(z.object({
    colorName: z.string(),
    pantoneCode: z.string().optional(),
    quantities: z.record(z.string(), z.number())
    // e.g., { "S": 50, "M": 100 }
  })).default([]),
  // Step 7: Packaging & Labels
  neckLabel: z.string().optional(),
  careLabel: z.string().optional(),
  hangtag: z.string().optional(),
  packaging: z.string().optional()
});
const STEPS = [
  { id: 1, title: "Basic Info", description: "Garment & Contact details" },
  { id: 2, title: "Design Uploads", description: "Mockups & Sketches" },
  { id: 3, title: "Fabric & Materials", description: "BOM & Fabrics" },
  { id: 4, title: "Embellishments", description: "Print & Embroidery" },
  { id: 5, title: "Size Chart", description: "Measurement specs" },
  { id: 6, title: "Colorways", description: "Colors & Quantities" },
  { id: 7, title: "Packaging", label: "Labels & Polybags" },
  { id: 8, title: "Review", description: "Submit & Download PDF" }
];
function TechPackCreator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();
  const formRef = useRef(null);
  const submitMutation = trpc.techPack.submit.useMutation({
    onSuccess: async (data, variables) => {
      toast.success(`Tech Pack ${data.referenceNumber} created successfully!`);
      await generateTechPackPdf(variables, data.referenceNumber);
      setTimeout(() => setLocation("/"), 3e3);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit tech pack");
    }
  });
  const methods = useForm({
    resolver: zodResolver(techPackSchema),
    defaultValues: {
      brandName: "",
      contactName: "",
      email: "",
      garmentType: "",
      mainFabric: "",
      sizeUnit: "inches",
      embellishments: [],
      availableSizes: ["XS", "S", "M", "L", "XL", "2XL"],
      images: [],
      sizeChart: [
        { pointOfMeasure: "1/2 Chest Width", tolerance: "+/- 0.5", sizes: { S: "", M: "", L: "", XL: "" } },
        { pointOfMeasure: "Body Length", tolerance: "+/- 0.5", sizes: { S: "", M: "", L: "", XL: "" } },
        { pointOfMeasure: "Sleeve Length", tolerance: "+/- 0.5", sizes: { S: "", M: "", L: "", XL: "" } }
      ],
      colorways: [
        { colorName: "Black", quantities: { S: 0, M: 0, L: 0, XL: 0 } }
      ]
    }
  });
  const { handleSubmit, formState: { errors }, trigger } = methods;
  const handleNext = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) fieldsToValidate = ["brandName", "contactName", "email", "garmentType"];
    else if (currentStep === 3) fieldsToValidate = ["mainFabric"];
    const isStepValid = await trigger(fieldsToValidate);
    if (!isStepValid) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }
    if (currentStep < STEPS.length) {
      setCurrentStep((curr) => curr + 1);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((curr) => curr - 1);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  const onSubmit = (data) => {
    submitMutation.mutate({
      ...data,
      techPackData: JSON.stringify(data)
    });
  };
  const renderStep1 = () => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:166", className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:167", className: "border-b border-border pb-4", children: [
      /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:168", className: "text-2xl font-condensed font-bold uppercase text-gold", children: "1. Basic Information" }),
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:169", className: "text-muted-foreground text-sm", children: "Let's start with the standard details about your garment and brand." })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:172", className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:173", className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:174", htmlFor: "brandName", children: "Brand Name *" }),
        /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:175", id: "brandName", ...methods.register("brandName"), placeholder: "Acme Clothing Co." }),
        errors.brandName && /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:176", className: "text-destructive text-xs", children: errors.brandName.message })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:178", className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:179", htmlFor: "contactName", children: "Contact Name *" }),
        /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:180", id: "contactName", ...methods.register("contactName"), placeholder: "John Doe" }),
        errors.contactName && /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:181", className: "text-destructive text-xs", children: errors.contactName.message })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:183", className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:184", htmlFor: "email", children: "Email Address *" }),
        /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:185", id: "email", type: "email", ...methods.register("email"), placeholder: "john@example.com" }),
        errors.email && /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:186", className: "text-destructive text-xs", children: errors.email.message })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:188", className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:189", htmlFor: "phone", children: "Phone Number" }),
        /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:190", id: "phone", ...methods.register("phone"), placeholder: "+1 (555) 000-0000" })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:192", className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:193", htmlFor: "garmentType", children: "Garment Type *" }),
        /* @__PURE__ */ jsxs(Select, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:194", onValueChange: (val) => methods.setValue("garmentType", val), defaultValue: methods.getValues("garmentType"), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:195", children: /* @__PURE__ */ jsx(SelectValue, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:196", placeholder: "Select garment type" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:198", children: [
            /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:199", value: "T-Shirt", children: "T-Shirt" }),
            /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:200", value: "Hoodie", children: "Hoodie" }),
            /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:201", value: "Sweatpants", children: "Sweatpants" }),
            /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:202", value: "Jacket", children: "Jacket" }),
            /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:203", value: "Shorts", children: "Shorts" }),
            /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:204", value: "Other", children: "Other" })
          ] })
        ] }),
        errors.garmentType && /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:207", className: "text-destructive text-xs", children: errors.garmentType.message })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:209", className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:210", htmlFor: "styleName", children: "Style Name / Number" }),
        /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:211", id: "styleName", ...methods.register("styleName"), placeholder: "e.g. SS25-Heavy-Tee" })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:213", className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:214", htmlFor: "season", children: "Season" }),
        /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:215", id: "season", ...methods.register("season"), placeholder: "e.g. FW26" })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:217", className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:218", htmlFor: "gender", children: "Gender / Category" }),
        /* @__PURE__ */ jsxs(Select, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:219", onValueChange: (val) => methods.setValue("gender", val), defaultValue: methods.getValues("gender"), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:220", children: /* @__PURE__ */ jsx(SelectValue, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:221", placeholder: "Select gender" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:223", children: [
            /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:224", value: "Unisex", children: "Unisex" }),
            /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:225", value: "Mens", children: "Mens" }),
            /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:226", value: "Womens", children: "Womens" }),
            /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:227", value: "Kids", children: "Kids" })
          ] })
        ] })
      ] })
    ] })
  ] });
  const renderStep2 = () => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:236", className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:237", className: "border-b border-border pb-4", children: [
      /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:238", className: "text-2xl font-condensed font-bold uppercase text-gold", children: "2. Design Uploads" }),
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:239", className: "text-muted-foreground text-sm", children: "Upload your mockups, flat sketches, and reference imagery." })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:241", className: "p-8 border-2 border-dashed border-border rounded-xl text-center bg-secondary/20 flex flex-col items-center justify-center gap-4", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:242", className: "w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground", children: /* @__PURE__ */ jsx(Upload, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:243", className: "w-8 h-8" }) }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:245", children: [
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:246", className: "font-medium", children: "Drag & drop files here, or click to select files" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:247", className: "text-xs text-muted-foreground mt-1", children: "Supports JPG, PNG, WEBP (Max 5MB each)" })
      ] }),
      /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:249", variant: "outline", className: "mt-2", children: "Select Files" })
    ] }),
    /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:251", className: "text-center text-muted-foreground italic text-sm", children: "(Upload functionality will be wired up shortly)" })
  ] });
  const renderStep3 = () => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:256", className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:257", className: "border-b border-border pb-4", children: [
      /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:258", className: "text-2xl font-condensed font-bold uppercase text-gold", children: "3. Fabric & Materials" }),
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:259", className: "text-muted-foreground text-sm", children: "Define the Bill of Materials (BOM) including fabrics and trims." })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:261", className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:262", className: "space-y-2 md:col-span-2", children: [
        /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:263", htmlFor: "mainFabric", children: "Main Body Fabric *" }),
        /* @__PURE__ */ jsx(Textarea, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:264", id: "mainFabric", ...methods.register("mainFabric"), placeholder: "e.g. 100% French Terry Cotton, 400gsm", rows: 3 }),
        errors.mainFabric && /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:265", className: "text-destructive text-xs", children: errors.mainFabric.message })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:267", className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:268", htmlFor: "mainFabricWeight", children: "Fabric Weight" }),
        /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:269", id: "mainFabricWeight", ...methods.register("mainFabricWeight"), placeholder: "e.g. 400 GSM" })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:271", className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:272", htmlFor: "mainFabricColor", children: "Fabric Color (if dyed)" }),
        /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:273", id: "mainFabricColor", ...methods.register("mainFabricColor"), placeholder: "e.g. Pantone 19-4052 Classic Blue" })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:275", className: "space-y-2 md:col-span-2", children: [
        /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:276", htmlFor: "liningFabric", children: "Lining Fabric (Optional)" }),
        /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:277", id: "liningFabric", ...methods.register("liningFabric"), placeholder: "e.g. 100% Polyester Mesh" })
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:279", className: "space-y-2 md:col-span-2", children: [
        /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:280", htmlFor: "trims", children: "Trims & Accessories" }),
        /* @__PURE__ */ jsx(Textarea, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:281", id: "trims", ...methods.register("trims"), placeholder: "e.g. YKK #5 Silver Metal Zipper, 8mm Silver Eyelets, Flat Cotton Drawstrings", rows: 3 })
      ] })
    ] })
  ] });
  const renderStep4 = () => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:288", className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:289", className: "border-b border-border pb-4", children: [
      /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:290", className: "text-2xl font-condensed font-bold uppercase text-gold", children: "4. Embellishments" }),
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:291", className: "text-muted-foreground text-sm", children: "Select all required printing, embroidery, and other embellishment techniques." })
    ] }),
    /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:294", className: "grid grid-cols-2 md:grid-cols-3 gap-4", children: ["Screen Print", "Sublimation", "DTG", "DTF", "Puff Print", "High Density Print", "Standard Embroidery", "3D Puff Embroidery", "Chenille Embroidery", "Applique", "Woven Patch", "Leather Patch", "Rubber / PVC Patch", "Rhinestone", "Acid Wash / Vintage Wash"].map((technique) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:296", className: "flex items-center space-x-2 border border-border p-3 rounded-md hover:bg-secondary/20 transition-colors", children: [
      /* @__PURE__ */ jsx(
        Checkbox,
        {
          "data-loc": "client\\src\\pages\\TechPackCreator.tsx:297",
          id: `tech-\${technique}`,
          checked: methods.getValues("embellishments").includes(technique),
          onCheckedChange: (checked) => {
            const current = methods.getValues("embellishments");
            if (checked) {
              methods.setValue("embellishments", [...current, technique]);
            } else {
              methods.setValue("embellishments", current.filter((t) => t !== technique));
            }
          }
        }
      ),
      /* @__PURE__ */ jsx("label", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:309", htmlFor: `tech-\${technique}`, className: "text-sm font-medium leading-none cursor-pointer", children: technique })
    ] }, technique)) }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:316", className: "space-y-2 mt-6", children: [
      /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:317", htmlFor: "embellishmentNotes", children: "Placement & Special Instructions" }),
      /* @__PURE__ */ jsx(
        Textarea,
        {
          "data-loc": "client\\src\\pages\\TechPackCreator.tsx:318",
          id: "embellishmentNotes",
          ...methods.register("embellishmentNotes"),
          placeholder: "e.g. Screen print logo 3 inches wide on left chest. Large puff print logo centered on back.",
          rows: 4
        }
      )
    ] })
  ] });
  const { fields: sizeChartFields, append: appendSizeRow, remove: removeSizeRow } = useFieldArray({
    control: methods.control,
    name: "sizeChart"
  });
  const renderStep5 = () => {
    const availableSizes = methods.getValues("availableSizes");
    return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:337", className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:338", className: "border-b border-border pb-4 flex justify-between items-end", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:339", children: [
          /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:340", className: "text-2xl font-condensed font-bold uppercase text-gold", children: "5. Size Specifications" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:341", className: "text-muted-foreground text-sm", children: "Define the graded measurement chart for manufacturing." })
        ] }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:343", className: "w-32", children: /* @__PURE__ */ jsxs(Select, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:344", onValueChange: (val) => methods.setValue("sizeUnit", val), defaultValue: methods.getValues("sizeUnit"), children: [
          /* @__PURE__ */ jsx(SelectTrigger, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:345", children: /* @__PURE__ */ jsx(SelectValue, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:346", placeholder: "Unit" }) }),
          /* @__PURE__ */ jsxs(SelectContent, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:348", children: [
            /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:349", value: "inches", children: "Inches" }),
            /* @__PURE__ */ jsx(SelectItem, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:350", value: "cm", children: "Centimeters" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:356", className: "overflow-x-auto border border-border rounded-xl", children: /* @__PURE__ */ jsxs("table", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:357", className: "w-full text-sm text-left", children: [
        /* @__PURE__ */ jsx("thead", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:358", className: "bg-secondary/50 text-xs uppercase font-condensed font-bold", children: /* @__PURE__ */ jsxs("tr", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:359", children: [
          /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:360", className: "px-4 py-3 min-w-[200px]", children: "Point of Measure (POM)" }),
          /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:361", className: "px-4 py-3 w-24", children: "Tolerance" }),
          availableSizes.map((size) => /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:363", className: "px-4 py-3 text-center", children: size }, size)),
          /* @__PURE__ */ jsx("th", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:365", className: "px-4 py-3 w-16" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:368", className: "divide-y divide-border", children: sizeChartFields.map((field, index) => /* @__PURE__ */ jsxs("tr", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:370", className: "hover:bg-secondary/10", children: [
          /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:371", className: "px-2 py-2", children: /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:372", ...methods.register(`sizeChart.\${index}.pointOfMeasure`), className: "h-8 shadow-none", placeholder: "e.g. Chest Width" }) }),
          /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:374", className: "px-2 py-2", children: /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:375", ...methods.register(`sizeChart.\${index}.tolerance`), className: "h-8 shadow-none", placeholder: "± 0.5" }) }),
          availableSizes.map((size) => /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:378", className: "px-2 py-2", children: /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:379", ...methods.register(`sizeChart.\${index}.sizes.\${size}`), className: "h-8 text-center shadow-none", placeholder: "-" }) }, size)),
          /* @__PURE__ */ jsx("td", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:382", className: "px-2 py-2 text-center", children: /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:383", type: "button", variant: "ghost", size: "icon", className: "h-8 w-8 text-muted-foreground hover:text-destructive", onClick: () => removeSizeRow(index), children: /* @__PURE__ */ jsx(Trash2, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:384", className: "h-4 w-4" }) }) })
        ] }, field.id)) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:393", className: "flex justify-end pt-2", children: /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:394", type: "button", variant: "outline", size: "sm", onClick: () => appendSizeRow({ pointOfMeasure: "New POM", tolerance: "+/- 0.5", sizes: {} }), children: [
        /* @__PURE__ */ jsx(Plus, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:395", className: "w-4 h-4 mr-2" }),
        " Add Measurement Point"
      ] }) })
    ] });
  };
  const { fields: colorwayFields, append: appendColorway, remove: removeColorway } = useFieldArray({
    control: methods.control,
    name: "colorways"
  });
  const renderStep6 = () => {
    const availableSizes = methods.getValues("availableSizes");
    methods.watch("colorways");
    let grandTotal = 0;
    return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:415", className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:416", className: "border-b border-border pb-4", children: [
        /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:417", className: "text-2xl font-condensed font-bold uppercase text-gold", children: "6. Colors & Quantities" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:418", className: "text-muted-foreground text-sm", children: "Specify the colorways and breakdown quantities per size." })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:421", className: "space-y-4", children: colorwayFields.map((field, index) => {
        const rowTotals = availableSizes.reduce((sum, size) => sum + (Number(methods.watch(`colorways.${index}.quantities.${size}`)) || 0), 0);
        grandTotal += rowTotals;
        return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:427", className: "bg-secondary/10 border border-border p-4 rounded-xl relative group", children: [
          /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:428", className: "absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:429", type: "button", variant: "ghost", size: "icon", className: "h-8 w-8 bg-background shadow-sm hover:text-destructive", onClick: () => removeColorway(index), children: /* @__PURE__ */ jsx(Trash2, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:430", className: "h-4 w-4" }) }) }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:434", className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:435", children: [
              /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:436", className: "text-xs", children: "Color Name" }),
              /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:437", ...methods.register(`colorways.${index}.colorName`), className: "h-9 mt-1", placeholder: "e.g. Navy Blue" })
            ] }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:439", children: [
              /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:440", className: "text-xs", children: "Pantone Code (Optional)" }),
              /* @__PURE__ */ jsx(Input, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:441", ...methods.register(`colorways.${index}.pantoneCode`), className: "h-9 mt-1", placeholder: "e.g. 19-4014 TPX" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:445", className: "bg-background rounded-lg p-3 border border-border/50", children: [
            /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:446", className: "text-xs font-semibold mb-3", children: "Quantity Breakdown" }),
            /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:447", className: "flex flex-wrap gap-2", children: [
              availableSizes.map((size) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:449", className: "flex-1 min-w-[60px]", children: [
                /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:450", className: "text-[10px] text-muted-foreground uppercase", children: size }),
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    "data-loc": "client\\src\\pages\\TechPackCreator.tsx:451",
                    ...methods.register(`colorways.\${index}.quantities.\${size}`, { valueAsNumber: true }),
                    type: "number",
                    min: "0",
                    className: "h-8 px-2 mt-1 text-center font-mono",
                    placeholder: "0"
                  }
                )
              ] }, size)),
              /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:460", className: "flex-1 min-w-[80px] bg-secondary/30 rounded-md flex flex-col items-center justify-center border border-border", children: [
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:461", className: "text-[10px] text-muted-foreground uppercase", children: "Row Total" }),
                /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:462", className: "font-bold", children: rowTotals })
              ] })
            ] })
          ] })
        ] }, field.id);
      }) }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:471", className: "flex items-center justify-between border-t border-border pt-4", children: [
        /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:472", type: "button", variant: "outline", size: "sm", onClick: () => appendColorway({ colorName: "", quantities: {} }), children: [
          /* @__PURE__ */ jsx(Plus, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:473", className: "w-4 h-4 mr-2" }),
          " Add Colorway"
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:475", className: "bg-gold/10 border border-gold/20 px-6 py-2 rounded-lg flex items-center gap-4", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:476", className: "text-sm font-condensed font-bold uppercase tracking-wider text-muted-foreground", children: "Grand Total:" }),
          /* @__PURE__ */ jsxs("span", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:477", className: "text-xl font-bold text-gold", children: [
            grandTotal,
            " pcs"
          ] })
        ] })
      ] })
    ] });
  };
  const renderStep7 = () => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:485", className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:486", className: "border-b border-border pb-4", children: [
      /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:487", className: "text-2xl font-condensed font-bold uppercase text-gold", children: "7. Packaging & Labels" }),
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:488", className: "text-muted-foreground text-sm", children: "Specify labeling, hangtags, and final presentation details." })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:491", className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:492", className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:493", htmlFor: "neckLabel", children: "Neck Label / Brand Tag" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            "data-loc": "client\\src\\pages\\TechPackCreator.tsx:494",
            id: "neckLabel",
            ...methods.register("neckLabel"),
            placeholder: "e.g. Woven label sewn at center back neck. Or Screen printed inside neck.",
            rows: 3
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:501", className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:502", htmlFor: "careLabel", children: "Care/Wash Label" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            "data-loc": "client\\src\\pages\\TechPackCreator.tsx:503",
            id: "careLabel",
            ...methods.register("careLabel"),
            placeholder: "e.g. Standard printed satin label inside left side seam, 2 inches from bottom.",
            rows: 3
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:510", className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:511", htmlFor: "hangtag", children: "Hangtag Instructions" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            "data-loc": "client\\src\\pages\\TechPackCreator.tsx:512",
            id: "hangtag",
            ...methods.register("hangtag"),
            placeholder: "e.g. Attach brand hangtag with black string/safety pin to left sleeve hem.",
            rows: 3
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:519", className: "space-y-2", children: [
        /* @__PURE__ */ jsx(Label, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:520", htmlFor: "packaging", children: "Bagging & Packaging" }),
        /* @__PURE__ */ jsx(
          Textarea,
          {
            "data-loc": "client\\src\\pages\\TechPackCreator.tsx:521",
            id: "packaging",
            ...methods.register("packaging"),
            placeholder: "e.g. Individual clear polybags with size sticker on the front top right corner.",
            rows: 3
          }
        )
      ] })
    ] })
  ] });
  const renderStep8 = () => {
    const data = methods.getValues();
    return /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:535", className: "space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500", children: [
      /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:536", className: "border-b border-border pb-4", children: [
        /* @__PURE__ */ jsx("h2", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:537", className: "text-2xl font-condensed font-bold uppercase text-gold", children: "8. Review & Generate" }),
        /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:538", className: "text-muted-foreground text-sm", children: "Review your specifications before finalizing the Tech Pack." })
      ] }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:541", className: "bg-secondary/10 border border-border rounded-xl p-6 space-y-6", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:542", className: "grid grid-cols-2 gap-4 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:543", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:543", className: "text-muted-foreground block text-xs uppercase mb-1", children: "Brand" }),
          " ",
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:543", className: "font-medium", children: data.brandName || "—" })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:544", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:544", className: "text-muted-foreground block text-xs uppercase mb-1", children: "Contact" }),
          " ",
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:544", className: "font-medium", children: data.contactName || "—" })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:545", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:545", className: "text-muted-foreground block text-xs uppercase mb-1", children: "Garment" }),
          " ",
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:545", className: "font-medium", children: data.garmentType || "—" })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:546", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:546", className: "text-muted-foreground block text-xs uppercase mb-1", children: "Style Name" }),
          " ",
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:546", className: "font-medium", children: data.styleName || "—" })
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:547", className: "col-span-2", children: [
          /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:548", className: "text-muted-foreground block text-xs uppercase mb-1", children: "Main Fabric" }),
          /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:549", className: "line-clamp-2 leading-relaxed", children: data.mainFabric || "—" })
        ] }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:551", className: "col-span-2 mt-2 pt-4 border-t border-border", children: /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:552", className: "text-xs text-muted-foreground italic", children: 'By clicking "Submit & Download PDF", this tech pack will be added to your account workspace and submitted to our manufacturing team for an initial quote review. A PDF copy will be generated and downloaded to your device.' }) })
      ] }) })
    ] });
  };
  return /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:564", className: "min-h-screen bg-background pt-24 pb-16", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:565", className: "max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:568", className: "text-center mb-12", children: [
      /* @__PURE__ */ jsxs("h1", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:569", className: "text-4xl md:text-5xl font-condensed font-black uppercase tracking-tight text-foreground mb-4", children: [
        "Tech Pack ",
        /* @__PURE__ */ jsx("span", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:570", className: "text-gold", children: "Generator" })
      ] }),
      /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:572", className: "text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed", children: "Build a professional, industry-standard tech pack in minutes. Download the PDF immediately and submit directly to our manufacturing team for a quote." })
    ] }),
    /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:577", className: "flex flex-col lg:flex-row gap-8", children: [
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:580", className: "lg:w-72 shrink-0 hidden lg:block", children: /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:581", className: "sticky top-28 bg-card border border-border rounded-2xl p-6 shadow-xl shadow-black/5", children: [
        /* @__PURE__ */ jsx("h3", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:582", className: "font-condensed font-bold uppercase text-gold tracking-widest text-sm mb-6 border-b border-border pb-4", children: "Creation Progress" }),
        /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:585", className: "space-y-4", children: STEPS.map((step, idx) => /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:587", className: "relative", children: [
          idx !== STEPS.length - 1 && /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:589", className: `absolute left-3.5 top-8 w-px h-8 ${currentStep > step.id ? "bg-gold" : "bg-border"}` }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              "data-loc": "client\\src\\pages\\TechPackCreator.tsx:591",
              onClick: () => currentStep > step.id && setCurrentStep(step.id),
              disabled: currentStep < step.id,
              className: `flex items-start gap-3 w-full text-left group ${currentStep < step.id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`,
              children: [
                /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:596", className: `w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-all mt-0.5
                        ${currentStep > step.id ? "bg-gold text-black" : currentStep === step.id ? "bg-transparent border-2 border-gold text-gold" : "bg-transparent border-2 border-muted-foreground text-muted-foreground"}
                      `, children: currentStep > step.id ? /* @__PURE__ */ jsx(CheckCircle2, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:599", className: "w-4 h-4" }) : step.id }),
                /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:601", children: [
                  /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:602", className: `font-condensed font-bold uppercase text-sm ${currentStep === step.id ? "text-gold" : "text-foreground"}`, children: step.title }),
                  /* @__PURE__ */ jsx("p", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:605", className: "text-[10px] text-muted-foreground line-clamp-1", children: step.description })
                ] })
              ]
            }
          )
        ] }, step.id)) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:615", className: "flex-1", ref: formRef, children: /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:616", className: "bg-card border border-border shadow-2xl shadow-black/10 rounded-2xl p-6 md:p-8 lg:p-10", children: /* @__PURE__ */ jsx(FormProvider, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:617", ...methods, children: /* @__PURE__ */ jsxs("form", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:618", onSubmit: handleSubmit(onSubmit), children: [
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:620", className: "min-h-[400px]", children: [
          currentStep === 1 && renderStep1(),
          currentStep === 2 && renderStep2(),
          currentStep === 3 && renderStep3(),
          currentStep === 4 && renderStep4(),
          currentStep === 5 && renderStep5(),
          currentStep === 6 && renderStep6(),
          currentStep === 7 && renderStep7(),
          currentStep === 8 && renderStep8()
        ] }),
        /* @__PURE__ */ jsxs("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:632", className: "flex items-center justify-between pt-8 mt-12 border-t border-border", children: [
          currentStep > 1 ? /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:634", type: "button", variant: "outline", onClick: handleBack, className: "gap-2", children: [
            /* @__PURE__ */ jsx(ArrowLeft, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:635", className: "w-4 h-4" }),
            " Back"
          ] }) : /* @__PURE__ */ jsx("div", { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:637" }),
          currentStep < STEPS.length ? /* @__PURE__ */ jsxs(Button, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:640", type: "button", onClick: handleNext, className: "gap-2 bg-gold text-black hover:bg-gold/90 border-0", children: [
            "Next Step ",
            /* @__PURE__ */ jsx(ArrowRight, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:641", className: "w-4 h-4" })
          ] }) : /* @__PURE__ */ jsx(Button, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:644", type: "submit", disabled: submitMutation.isPending, className: "gap-2 bg-gold text-black hover:bg-gold/90 border-0 shadow-[0_0_20px_rgba(234,179,8,0.2)]", children: submitMutation.isPending ? "Submitting..." : /* @__PURE__ */ jsxs(Fragment, { children: [
            "Submit & Download PDF ",
            /* @__PURE__ */ jsx(Download, { "data-loc": "client\\src\\pages\\TechPackCreator.tsx:646", className: "w-4 h-4" })
          ] }) })
        ] })
      ] }) }) }) })
    ] })
  ] }) });
}
export {
  TechPackCreator as default
};
