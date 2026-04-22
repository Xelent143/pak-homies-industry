import AdminLayout from "@/pages/layouts/AdminLayout";
import AIProductAgent from "./AIProductAgent";
import AIImageOptimizer from "./AIImageOptimizer";
import FashionDesignerStudio from "./FashionDesignerStudio";
import VirtualTryOnAgent from "./VirtualTryOnAgent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wand2, Image as ImageIcon, Shirt, ScanFace } from "lucide-react";
import { useState } from "react";

export default function AdminAIStudio() {
    const [activeTab, setActiveTab] = useState("tryon");
    const [scannedImageUrl, setScannedImageUrl] = useState<string | null>(null);

    const handleUseTryOnImage = (url: string) => {
        setScannedImageUrl(url);
        setActiveTab("agent");
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="font-serif text-2xl font-bold text-foreground">AI Studio</h1>
                    <p className="text-sm text-muted-foreground mt-1">Accelerate your workflow with specialized AI tools.</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="bg-secondary/50 border-border p-1">
                        <TabsTrigger value="tryon" className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground">
                            <ScanFace className="w-4 h-4 mr-2" /> Virtual Try-On
                        </TabsTrigger>
                        <TabsTrigger value="designer" className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground">
                            <Shirt className="w-4 h-4 mr-2" /> Quick Designer
                        </TabsTrigger>
                        <TabsTrigger value="agent" className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground">
                            <Wand2 className="w-4 h-4 mr-2" /> SEO Listing Agent
                        </TabsTrigger>
                        <TabsTrigger value="optimizer" className="data-[state=active]:bg-card data-[state=active]:text-foreground text-muted-foreground">
                            <ImageIcon className="w-4 h-4 mr-2" /> Image Optimizer
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="tryon" className="mt-6 border-none p-0 outline-none">
                        <VirtualTryOnAgent onUseImage={handleUseTryOnImage} />
                    </TabsContent>

                    <TabsContent value="designer" className="mt-6 border-none p-0 outline-none">
                        <FashionDesignerStudio />
                    </TabsContent>

                    <TabsContent value="agent" className="mt-6 border-none p-0 outline-none">
                        <AIProductAgent initialImageUrl={scannedImageUrl} onClearInitialImage={() => setScannedImageUrl(null)} />
                    </TabsContent>

                    <TabsContent value="optimizer" className="mt-6 border-none p-0 outline-none">
                        <AIImageOptimizer />
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
