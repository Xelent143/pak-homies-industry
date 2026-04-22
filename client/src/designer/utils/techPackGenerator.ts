import type { DecalConfig, TextConfig } from '../types';

interface TechPackData {
    projectName: string;
    date: string;
    primaryColor: string;
    secondaryColor: string;
    materialPreset: string;
    meshColors: Record<string, string>;
    decals: DecalConfig[];
    texts: TextConfig[];
    views: {
        front: string;
        back: string;
        left: string;
        right: string;
    };
}

export const generateTechPack = async (data: TechPackData) => {
    // Dynamically import jsPDF and autoTable to avoid load-time issues
    const { jsPDF } = await import('jspdf');
    const autoTableModule = await import('jspdf-autotable');
    const autoTable = autoTableModule.default;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;

    // --- PAGE 1: COVER ---
    // Header
    doc.setFontSize(24);
    doc.text(data.projectName, margin, 30);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${data.date}`, margin, 40);
    doc.text(`Version: 1.0`, margin, 45);

    // Large Front View
    if (data.views.front) {
        const imgWidth = 120;
        const imgHeight = 160;
        const x = (pageWidth - imgWidth) / 2;
        doc.addImage(data.views.front, 'PNG', x, 60, imgWidth, imgHeight);
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Confirm all details with physical samples before bulk production.', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // --- PAGE 2: BILL OF MATERIALS (BOM) ---
    doc.addPage();
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('Bill of Materials (BOM)', margin, 20);

    const bomData = [
        ['Component', 'Material/Color', 'Placement', 'Notes'],
        ['Main Fabric', `${data.materialPreset} (${data.primaryColor})`, 'Body', 'Base Fabric'],
        ['Secondary Fabric', `${data.materialPreset} (${data.secondaryColor})`, 'Trim/Accents', 'Contrast'],
    ];

    // Add Mesh Specifics
    Object.entries(data.meshColors).forEach(([meshName, color]) => {
        if (color !== data.primaryColor && color !== data.secondaryColor) {
            bomData.push(['Panel/Part', `Custom Color (${color})`, meshName, 'Specific Panel Color']);
        }
    });

    autoTable(doc, {
        startY: 30,
        head: [['Component', 'Material/Color', 'Placement', 'Notes']],
        body: bomData.slice(1), // Remove header from data array
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185] },
    });

    // --- PAGE 3: GRAPHICS & PLACEMENT ---
    if (data.decals.length > 0 || data.texts.length > 0) {
        doc.addPage();
        doc.text('Graphic Placement', margin, 20);

        const graphicsData: any[] = [];

        data.decals.forEach((decal, index) => {
            graphicsData.push([
                `Logo #${index + 1}`,
                'Decal',
                decal.isBackSide ? 'Back' : 'Front',
                `Scale: ${decal.scale[0].toFixed(2)}x`
            ]);
        });

        data.texts.forEach((text, index) => {
            graphicsData.push([
                `Text #${index + 1}: "${text.text}"`,
                `Font: ${text.fontFamily}`,
                text.isBackSide ? 'Back' : 'Front',
                `Color: ${text.color}`
            ]);
        });

        autoTable(doc, {
            startY: 30,
            head: [['Artwork ID', 'Type', 'Position', 'Details']],
            body: graphicsData,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] },
        });
    }

    // --- PAGE 4: TECHNICAL VIEWS ---
    doc.addPage();
    doc.text('Technical Views', margin, 20);

    const viewSize = 70;
    const gap = 10;
    const startY = 40;

    // Front
    doc.setFontSize(10);
    doc.text('Front View', margin, startY - 5);
    if (data.views.front) doc.addImage(data.views.front, 'PNG', margin, startY, viewSize, viewSize);

    // Back
    doc.text('Back View', pageWidth / 2 + gap, startY - 5);
    if (data.views.back) doc.addImage(data.views.back, 'PNG', pageWidth / 2 + gap, startY, viewSize, viewSize);

    // Left
    doc.text('Left Side', margin, startY + viewSize + 20);
    if (data.views.left) doc.addImage(data.views.left, 'PNG', margin, startY + viewSize + 25, viewSize, viewSize);

    // Right
    doc.text('Right Side', pageWidth / 2 + gap, startY + viewSize + 20);
    if (data.views.right) doc.addImage(data.views.right, 'PNG', pageWidth / 2 + gap, startY + viewSize + 25, viewSize, viewSize);


    // Save
    doc.save(`${data.projectName.replace(/\s+/g, '_')}_TechPack.pdf`);
};
