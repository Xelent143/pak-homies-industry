import { useState, useRef } from "react";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowLeft, ArrowRight, CheckCircle2, Upload, Plus, Trash2, Save, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { generateTechPackPdf } from "@/lib/pdfGenerator";

// ─── Wizard Data Schema ───────────────────────────────────────────────────────

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
    caption: z.string().optional(),
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
    sizes: z.record(z.string(), z.string()), // e.g., { "S": "20", "M": "21" }
  })).default([]),
  availableSizes: z.array(z.string()).default(["S", "M", "L", "XL"]),

  // Step 6: Colors & Quantities
  colorways: z.array(z.object({
    colorName: z.string(),
    pantoneCode: z.string().optional(),
    quantities: z.record(z.string(), z.number()), // e.g., { "S": 50, "M": 100 }
  })).default([]),

  // Step 7: Packaging & Labels
  neckLabel: z.string().optional(),
  careLabel: z.string().optional(),
  hangtag: z.string().optional(),
  packaging: z.string().optional(),
});

type TechPackFormData = z.infer<typeof techPackSchema>;

const STEPS = [
  { id: 1, title: "Basic Info", description: "Garment & Contact details" },
  { id: 2, title: "Design Uploads", description: "Mockups & Sketches" },
  { id: 3, title: "Fabric & Materials", description: "BOM & Fabrics" },
  { id: 4, title: "Embellishments", description: "Print & Embroidery" },
  { id: 5, title: "Size Chart", description: "Measurement specs" },
  { id: 6, title: "Colorways", description: "Colors & Quantities" },
  { id: 7, title: "Packaging", label: "Labels & Polybags" },
  { id: 8, title: "Review", description: "Submit & Download PDF" },
];

export default function TechPackCreator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [, setLocation] = useLocation();
  const formRef = useRef<HTMLDivElement>(null);

  const submitMutation = trpc.techPack.submit.useMutation({
    onSuccess: async (data, variables) => {
      toast.success(`Tech Pack ${data.referenceNumber} created successfully!`);
      // Generate and download the PDF
      await generateTechPackPdf(variables, data.referenceNumber);
      // Redirect to a thank you page or back to home after a delay
      setTimeout(() => setLocation("/"), 3000);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to submit tech pack");
    }
  });

  const methods = useForm<any>({
    resolver: zodResolver(techPackSchema) as any,
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
        { pointOfMeasure: "Sleeve Length", tolerance: "+/- 0.5", sizes: { S: "", M: "", L: "", XL: "" } },
      ],
      colorways: [
        { colorName: "Black", quantities: { S: 0, M: 0, L: 0, XL: 0 } },
      ],
    },
  });

  const { handleSubmit, formState: { errors }, trigger } = methods;

  const handleNext = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) fieldsToValidate = ["brandName", "contactName", "email", "garmentType"];
    else if (currentStep === 3) fieldsToValidate = ["mainFabric"];
    // Add validations for other steps...

    const isStepValid = await trigger(fieldsToValidate as any);
    if (!isStepValid) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(curr => curr + 1);
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(curr => curr - 1);
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const onSubmit = (data: TechPackFormData) => {
    submitMutation.mutate({
      ...data,
      techPackData: JSON.stringify(data),
    });
  };

  // ─── Step Components ────────────────────────────────────────────────────────

  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-condensed font-bold uppercase text-gold">1. Basic Information</h2>
        <p className="text-muted-foreground text-sm">Let's start with the standard details about your garment and brand.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="brandName">Brand Name *</Label>
          <Input id="brandName" {...methods.register("brandName")} placeholder="Acme Clothing Co." />
          {errors.brandName && <p className="text-destructive text-xs">{errors.brandName.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactName">Contact Name *</Label>
          <Input id="contactName" {...methods.register("contactName")} placeholder="John Doe" />
          {errors.contactName && <p className="text-destructive text-xs">{errors.contactName.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input id="email" type="email" {...methods.register("email")} placeholder="john@example.com" />
          {errors.email && <p className="text-destructive text-xs">{errors.email.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input id="phone" {...methods.register("phone")} placeholder="+1 (555) 000-0000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="garmentType">Garment Type *</Label>
          <Select onValueChange={(val) => methods.setValue("garmentType", val)} defaultValue={methods.getValues("garmentType")}>
            <SelectTrigger>
              <SelectValue placeholder="Select garment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="T-Shirt">T-Shirt</SelectItem>
              <SelectItem value="Hoodie">Hoodie</SelectItem>
              <SelectItem value="Sweatpants">Sweatpants</SelectItem>
              <SelectItem value="Jacket">Jacket</SelectItem>
              <SelectItem value="Shorts">Shorts</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.garmentType && <p className="text-destructive text-xs">{errors.garmentType.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="styleName">Style Name / Number</Label>
          <Input id="styleName" {...methods.register("styleName")} placeholder="e.g. SS25-Heavy-Tee" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="season">Season</Label>
          <Input id="season" {...methods.register("season")} placeholder="e.g. FW26" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="gender">Gender / Category</Label>
          <Select onValueChange={(val) => methods.setValue("gender", val)} defaultValue={methods.getValues("gender")}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Unisex">Unisex</SelectItem>
              <SelectItem value="Mens">Mens</SelectItem>
              <SelectItem value="Womens">Womens</SelectItem>
              <SelectItem value="Kids">Kids</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-condensed font-bold uppercase text-gold">2. Design Uploads</h2>
        <p className="text-muted-foreground text-sm">Upload your mockups, flat sketches, and reference imagery.</p>
      </div>
      <div className="p-8 border-2 border-dashed border-border rounded-xl text-center bg-secondary/20 flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground">
          <Upload className="w-8 h-8" />
        </div>
        <div>
          <p className="font-medium">Drag & drop files here, or click to select files</p>
          <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, WEBP (Max 5MB each)</p>
        </div>
        <Button variant="outline" className="mt-2">Select Files</Button>
      </div>
      <p className="text-center text-muted-foreground italic text-sm">(Upload functionality will be wired up shortly)</p>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-condensed font-bold uppercase text-gold">3. Fabric & Materials</h2>
        <p className="text-muted-foreground text-sm">Define the Bill of Materials (BOM) including fabrics and trims.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="mainFabric">Main Body Fabric *</Label>
          <Textarea id="mainFabric" {...methods.register("mainFabric")} placeholder="e.g. 100% French Terry Cotton, 400gsm" rows={3} />
          {errors.mainFabric && <p className="text-destructive text-xs">{errors.mainFabric.message as string}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="mainFabricWeight">Fabric Weight</Label>
          <Input id="mainFabricWeight" {...methods.register("mainFabricWeight")} placeholder="e.g. 400 GSM" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mainFabricColor">Fabric Color (if dyed)</Label>
          <Input id="mainFabricColor" {...methods.register("mainFabricColor")} placeholder="e.g. Pantone 19-4052 Classic Blue" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="liningFabric">Lining Fabric (Optional)</Label>
          <Input id="liningFabric" {...methods.register("liningFabric")} placeholder="e.g. 100% Polyester Mesh" />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="trims">Trims & Accessories</Label>
          <Textarea id="trims" {...methods.register("trims")} placeholder="e.g. YKK #5 Silver Metal Zipper, 8mm Silver Eyelets, Flat Cotton Drawstrings" rows={3} />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-condensed font-bold uppercase text-gold">4. Embellishments</h2>
        <p className="text-muted-foreground text-sm">Select all required printing, embroidery, and other embellishment techniques.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {["Screen Print", "Sublimation", "DTG", "DTF", "Puff Print", "High Density Print", "Standard Embroidery", "3D Puff Embroidery", "Chenille Embroidery", "Applique", "Woven Patch", "Leather Patch", "Rubber / PVC Patch", "Rhinestone", "Acid Wash / Vintage Wash"].map(technique => (
          <div key={technique} className="flex items-center space-x-2 border border-border p-3 rounded-md hover:bg-secondary/20 transition-colors">
            <Checkbox
              id={`tech-\${technique}`}
              checked={methods.getValues("embellishments").includes(technique)}
              onCheckedChange={(checked) => {
                const current = methods.getValues("embellishments");
                if (checked) {
                  methods.setValue("embellishments", [...current, technique]);
                } else {
                  methods.setValue("embellishments", current.filter((t: string) => t !== technique));
                }
              }}
            />
            <label htmlFor={`tech-\${technique}`} className="text-sm font-medium leading-none cursor-pointer">
              {technique}
            </label>
          </div>
        ))}
      </div>

      <div className="space-y-2 mt-6">
        <Label htmlFor="embellishmentNotes">Placement & Special Instructions</Label>
        <Textarea
          id="embellishmentNotes"
          {...methods.register("embellishmentNotes")}
          placeholder="e.g. Screen print logo 3 inches wide on left chest. Large puff print logo centered on back."
          rows={4}
        />
      </div>
    </div >
  );

  const { fields: sizeChartFields, append: appendSizeRow, remove: removeSizeRow } = useFieldArray({
    control: methods.control,
    name: "sizeChart",
  });

  const renderStep5 = () => {
    const availableSizes = methods.getValues("availableSizes");

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="border-b border-border pb-4 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-condensed font-bold uppercase text-gold">5. Size Specifications</h2>
            <p className="text-muted-foreground text-sm">Define the graded measurement chart for manufacturing.</p>
          </div>
          <div className="w-32">
            <Select onValueChange={(val) => methods.setValue("sizeUnit", val as "inches" | "cm")} defaultValue={methods.getValues("sizeUnit")}>
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inches">Inches</SelectItem>
                <SelectItem value="cm">Centimeters</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto border border-border rounded-xl">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-xs uppercase font-condensed font-bold">
              <tr>
                <th className="px-4 py-3 min-w-[200px]">Point of Measure (POM)</th>
                <th className="px-4 py-3 w-24">Tolerance</th>
                {availableSizes.map((size: string) => (
                  <th key={size} className="px-4 py-3 text-center">{size}</th>
                ))}
                <th className="px-4 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sizeChartFields.map((field, index) => (
                <tr key={field.id} className="hover:bg-secondary/10">
                  <td className="px-2 py-2">
                    <Input {...methods.register(`sizeChart.\${index}.pointOfMeasure`)} className="h-8 shadow-none" placeholder="e.g. Chest Width" />
                  </td>
                  <td className="px-2 py-2">
                    <Input {...methods.register(`sizeChart.\${index}.tolerance`)} className="h-8 shadow-none" placeholder="± 0.5" />
                  </td>
                  {availableSizes.map((size: string) => (
                    <td key={size} className="px-2 py-2">
                      <Input {...methods.register(`sizeChart.\${index}.sizes.\${size}`)} className="h-8 text-center shadow-none" placeholder="-" />
                    </td>
                  ))}
                  <td className="px-2 py-2 text-center">
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => removeSizeRow(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="button" variant="outline" size="sm" onClick={() => appendSizeRow({ pointOfMeasure: "New POM", tolerance: "+/- 0.5", sizes: {} })}>
            <Plus className="w-4 h-4 mr-2" /> Add Measurement Point
          </Button>
        </div>
      </div>
    );
  };

  const { fields: colorwayFields, append: appendColorway, remove: removeColorway } = useFieldArray({
    control: methods.control,
    name: "colorways",
  });

  const renderStep6 = () => {
    const availableSizes = methods.getValues("availableSizes");

    // Calculate totals
    const formVals = methods.watch("colorways");
    let grandTotal = 0;

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="border-b border-border pb-4">
          <h2 className="text-2xl font-condensed font-bold uppercase text-gold">6. Colors & Quantities</h2>
          <p className="text-muted-foreground text-sm">Specify the colorways and breakdown quantities per size.</p>
        </div>

        <div className="space-y-4">
          {colorwayFields.map((field, index) => {
            const rowTotals = availableSizes.reduce((sum: number, size: string) => sum + (Number(methods.watch(`colorways.${index}.quantities.${size}`)) || 0), 0);
            grandTotal += rowTotals;

            return (
              <div key={field.id} className="bg-secondary/10 border border-border p-4 rounded-xl relative group">
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button type="button" variant="ghost" size="icon" className="h-8 w-8 bg-background shadow-sm hover:text-destructive" onClick={() => removeColorway(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-xs">Color Name</Label>
                    <Input {...methods.register(`colorways.${index}.colorName` as any)} className="h-9 mt-1" placeholder="e.g. Navy Blue" />
                  </div>
                  <div>
                    <Label className="text-xs">Pantone Code (Optional)</Label>
                    <Input {...methods.register(`colorways.${index}.pantoneCode` as any)} className="h-9 mt-1" placeholder="e.g. 19-4014 TPX" />
                  </div>
                </div>

                <div className="bg-background rounded-lg p-3 border border-border/50">
                  <p className="text-xs font-semibold mb-3">Quantity Breakdown</p>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map((size: string) => (
                      <div key={size} className="flex-1 min-w-[60px]">
                        <Label className="text-[10px] text-muted-foreground uppercase">{size}</Label>
                        <Input
                          {...methods.register(`colorways.\${index}.quantities.\${size}`, { valueAsNumber: true })}
                          type="number"
                          min="0"
                          className="h-8 px-2 mt-1 text-center font-mono"
                          placeholder="0"
                        />
                      </div>
                    ))}
                    <div className="flex-1 min-w-[80px] bg-secondary/30 rounded-md flex flex-col items-center justify-center border border-border">
                      <span className="text-[10px] text-muted-foreground uppercase">Row Total</span>
                      <span className="font-bold">{rowTotals}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <Button type="button" variant="outline" size="sm" onClick={() => appendColorway({ colorName: "", quantities: {} })}>
            <Plus className="w-4 h-4 mr-2" /> Add Colorway
          </Button>
          <div className="bg-gold/10 border border-gold/20 px-6 py-2 rounded-lg flex items-center gap-4">
            <span className="text-sm font-condensed font-bold uppercase tracking-wider text-muted-foreground">Grand Total:</span>
            <span className="text-xl font-bold text-gold">{grandTotal} pcs</span>
          </div>
        </div>
      </div>
    );
  };

  const renderStep7 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="border-b border-border pb-4">
        <h2 className="text-2xl font-condensed font-bold uppercase text-gold">7. Packaging & Labels</h2>
        <p className="text-muted-foreground text-sm">Specify labeling, hangtags, and final presentation details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="neckLabel">Neck Label / Brand Tag</Label>
          <Textarea
            id="neckLabel"
            {...methods.register("neckLabel")}
            placeholder="e.g. Woven label sewn at center back neck. Or Screen printed inside neck."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="careLabel">Care/Wash Label</Label>
          <Textarea
            id="careLabel"
            {...methods.register("careLabel")}
            placeholder="e.g. Standard printed satin label inside left side seam, 2 inches from bottom."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hangtag">Hangtag Instructions</Label>
          <Textarea
            id="hangtag"
            {...methods.register("hangtag")}
            placeholder="e.g. Attach brand hangtag with black string/safety pin to left sleeve hem."
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="packaging">Bagging & Packaging</Label>
          <Textarea
            id="packaging"
            {...methods.register("packaging")}
            placeholder="e.g. Individual clear polybags with size sticker on the front top right corner."
            rows={3}
          />
        </div>
      </div>
    </div>
  );

  const renderStep8 = () => {
    const data = methods.getValues();
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="border-b border-border pb-4">
          <h2 className="text-2xl font-condensed font-bold uppercase text-gold">8. Review & Generate</h2>
          <p className="text-muted-foreground text-sm">Review your specifications before finalizing the Tech Pack.</p>
        </div>

        <div className="bg-secondary/10 border border-border rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="text-muted-foreground block text-xs uppercase mb-1">Brand</span> <span className="font-medium">{data.brandName || "—"}</span></div>
            <div><span className="text-muted-foreground block text-xs uppercase mb-1">Contact</span> <span className="font-medium">{data.contactName || "—"}</span></div>
            <div><span className="text-muted-foreground block text-xs uppercase mb-1">Garment</span> <span className="font-medium">{data.garmentType || "—"}</span></div>
            <div><span className="text-muted-foreground block text-xs uppercase mb-1">Style Name</span> <span className="font-medium">{data.styleName || "—"}</span></div>
            <div className="col-span-2">
              <span className="text-muted-foreground block text-xs uppercase mb-1">Main Fabric</span>
              <p className="line-clamp-2 leading-relaxed">{data.mainFabric || "—"}</p>
            </div>
            <div className="col-span-2 mt-2 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground italic">By clicking "Submit & Download PDF", this tech pack will be added to your account workspace and submitted to our manufacturing team for an initial quote review. A PDF copy will be generated and downloaded to your device.</p>
            </div>
          </div>
        </div>
      </div>
    );
  };


  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-condensed font-black uppercase tracking-tight text-foreground mb-4">
            Tech Pack <span className="text-gold">Generator</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Build a professional, industry-standard tech pack in minutes. Download the PDF immediately and submit directly to our manufacturing team for a quote.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Progress */}
          <div className="lg:w-72 shrink-0 hidden lg:block">
            <div className="sticky top-28 bg-card border border-border rounded-2xl p-6 shadow-xl shadow-black/5">
              <h3 className="font-condensed font-bold uppercase text-gold tracking-widest text-sm mb-6 border-b border-border pb-4">
                Creation Progress
              </h3>
              <div className="space-y-4">
                {STEPS.map((step, idx) => (
                  <div key={step.id} className="relative">
                    {idx !== STEPS.length - 1 && (
                      <div className={`absolute left-3.5 top-8 w-px h-8 ${currentStep > step.id ? 'bg-gold' : 'bg-border'}`} />
                    )}
                    <button
                      onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                      disabled={currentStep < step.id}
                      className={`flex items-start gap-3 w-full text-left group ${currentStep < step.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold transition-all mt-0.5
                        ${currentStep > step.id ? 'bg-gold text-black' : currentStep === step.id ? 'bg-transparent border-2 border-gold text-gold' : 'bg-transparent border-2 border-muted-foreground text-muted-foreground'}
                      `}>
                        {currentStep > step.id ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                      </div>
                      <div>
                        <p className={`font-condensed font-bold uppercase text-sm ${currentStep === step.id ? 'text-gold' : 'text-foreground'}`}>
                          {step.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground line-clamp-1">{step.description}</p>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Area */}
          <div className="flex-1" ref={formRef}>
            <div className="bg-card border border-border shadow-2xl shadow-black/10 rounded-2xl p-6 md:p-8 lg:p-10">
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit as any)}>

                  <div className="min-h-[400px]">
                    {currentStep === 1 && renderStep1()}
                    {currentStep === 2 && renderStep2()}
                    {currentStep === 3 && renderStep3()}
                    {currentStep === 4 && renderStep4()}
                    {currentStep === 5 && renderStep5()}
                    {currentStep === 6 && renderStep6()}
                    {currentStep === 7 && renderStep7()}
                    {currentStep === 8 && renderStep8()}
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between pt-8 mt-12 border-t border-border">
                    {currentStep > 1 ? (
                      <Button type="button" variant="outline" onClick={handleBack} className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back
                      </Button>
                    ) : <div></div>}

                    {currentStep < STEPS.length ? (
                      <Button type="button" onClick={handleNext} className="gap-2 bg-gold text-black hover:bg-gold/90 border-0">
                        Next Step <ArrowRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button type="submit" disabled={submitMutation.isPending} className="gap-2 bg-gold text-black hover:bg-gold/90 border-0 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                        {submitMutation.isPending ? "Submitting..." : (
                          <>Submit & Download PDF <Download className="w-4 h-4" /></>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </FormProvider>
            </div>
          </div>

        </div >
      </div >
    </div >
  );
}
