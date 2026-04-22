import jsPDF from "jspdf";
import "jspdf-autotable";

// Note: jspdf-autotable adds an .autoTable method to jsPDF, but TypeScript might not know
// We can cast the doc to `any` when using autoTable to avoid type errors.

export async function generateTechPackPdf(data: any, referenceNumber: string) {
    const doc = new jsPDF() as any;
    const pageWidth = doc.internal.pageSize.getWidth();

    // ─── Colors & Fonts ──────────────────────────────
    const primaryColor = [0, 0, 0];
    const accentColor = [212, 175, 55]; // Gold
    const grayColor = [100, 100, 100];
    const lightGray = [240, 240, 240];

    // Helper to add a branded header
    const addHeader = (title: string, yPos = 20) => {
        doc.setFillColor(...primaryColor);
        doc.rect(0, yPos - 12, pageWidth, 16, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(title.toUpperCase(), 14, yPos - 1);
        doc.setTextColor(...primaryColor); // Reset text color
        return yPos + 10;
    };

    // ─── PAGE 1: COVER & OVERVIEW ────────────────────

    // Top Header Line
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
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 39);

  // Logo Placeholder / Brand Name
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.setFont("helvetica", "bold");
  doc.text(data.brandName.toUpperCase() || "BRAND NAME", pageWidth - 14, 28, { align: "right" });

  let y = 55;
  y = addHeader("1. Style Overview", y);

  // Overview Data Map
  const overviewData = [
    ["Style Name:", data.styleName || "N/A", "Garment Type:", data.garmentType || "N/A"],
    ["Season:", data.season || "N/A", "Gender:", data.gender || "N/A"],
    ["Contact:", data.contactName || "N/A", "Email:", data.email || "N/A"],
    ["Target Market:", data.targetMarket || "N/A", "Date Dev:", new Date().toLocaleDateString()],
  ];

  doc.autoTable({
    startY: y,
    body: overviewData,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: {
      0: { fontStyle: 'bold', textColor: grayColor, cellWidth: 35 },
      1: { cellWidth: 55 },
      2: { fontStyle: 'bold', textColor: grayColor, cellWidth: 35 },
      3: { cellWidth: 55 },
    },
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  y = addHeader("2. Bill of Materials (BOM)", y);

  const bomData = [
    ["Component", "Description / Details"],
    ["Main Fabric", `${data.mainFabric || "N/A"}${data.mainFabricWeight ? ` (${data.mainFabricWeight})` : ""}`],
    ["Fabric Color", data.mainFabricColor || "N/A"],
    ["Lining Fabric", data.liningFabric || "N/A"],
    ["Secondary Fabric", data.secondaryFabric || "N/A"],
    ["Trims & Accessories", data.trims || "N/A"],
  ];

  doc.autoTable({
    startY: y,
    body: bomData.slice(1),
    columns: [{ header: bomData[0][0], dataKey: 0 }, { header: bomData[0][1], dataKey: 1 }],
    theme: 'grid',
    headStyles: { fillColor: lightGray, textColor: primaryColor, fontStyle: 'bold' },
    styles: { fontSize: 9 },
    columnStyles: { 0: { cellWidth: 50, fontStyle: 'bold' } },
  });

  y = (doc as any).lastAutoTable.finalY + 15;

  y = addHeader("3. Construction & Embellishments", y);
  
  const embellishmentsText = data.embellishments?.length > 0 
    ? data.embellishments.join(", ") 
    : "None specified";

  const constructData = [
    ["Techniques", embellishmentsText],
    ["Placement Notes", data.embellishmentNotes || "N/A"],
  ];

  doc.autoTable({
    startY: y,
    body: constructData,
    theme: 'grid',
    styles: { fontSize: 9 },
    columnStyles: { 0: { cellWidth: 50, fontStyle: 'bold', fillColor: lightGray } }
  });


  // ─── PAGE 2: SPECS & SIZING ──────────────────────
  doc.addPage();
  y = 20;
  
  y = addHeader(`4. Measurement Specifications (${data.sizeUnit?.toUpperCase() || "IN"})`, y);

  if (data.sizeChart && data.sizeChart.length > 0) {
    const sizeHeaders = ["Point of Measure", "Tol (+/-)", ...(data.availableSizes || [])];
    const sizeBody = data.sizeChart.map((row: any) => {
      const rowData = [row.pointOfMeasure, row.tolerance];
      (data.availableSizes || []).forEach((size: string) => {
        rowData.push(row.sizes[size] || "-");
      });
      return rowData;
    });

    doc.autoTable({
      startY: y,
      head: [sizeHeaders],
      body: sizeBody,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255 },
      styles: { fontSize: 8, halign: 'center' },
      columnStyles: { 
        0: { halign: 'left', cellWidth: 'auto', fontStyle: 'bold' },
        1: { cellWidth: 20 }
      }
    });
    
    y = (doc as any).lastAutoTable.finalY + 15;
  } else {
    doc.setFontSize(10);
    doc.text("No measurement specifications provided.", 14, y);
    y += 15;
  }

  y = addHeader("5. Colorways & Quantities", y);

  if (data.colorways && data.colorways.length > 0) {
    const colorHeaders = ["Color Way", "Pantone", ...(data.availableSizes || []), "Total"];
    let grandTotal = 0;
    
    const colorBody = data.colorways.map((cw: any) => {
      const rowData = [cw.colorName || "-", cw.pantoneCode || "-"];
      let rowTotal = 0;
      (data.availableSizes || []).forEach((size: string) => {
        const qty = Number(cw.quantities[size]) || 0;
        rowTotal += qty;
        rowData.push(qty.toString());
      });
      grandTotal += rowTotal;
      rowData.push(rowTotal.toString());
      return rowData;
    });

    // Add footer row for totals
    const footerRow = ["TOTALS", ""];
    let footerTotal = 0;
    (data.availableSizes || []).forEach((size: string) => {
      const sizeTotal = data.colorways.reduce((sum: number, cw: any) => sum + (Number(cw.quantities[size]) || 0), 0);
      footerRow.push(sizeTotal.toString());
    });
    footerRow.push(grandTotal.toString());
    colorBody.push(footerRow);

    doc.autoTable({
      startY: y,
      head: [colorHeaders],
      body: colorBody,
      theme: 'grid',
      headStyles: { fillColor: primaryColor, textColor: 255 },
      footStyles: { fillColor: lightGray, textColor: primaryColor, fontStyle: 'bold' },
      styles: { fontSize: 9, halign: 'center' },
      columnStyles: { 
        0: { halign: 'left', fontStyle: 'bold' },
        1: { halign: 'left' }
      },
      willDrawCell: function(data: any) {
        if (data.row.index === colorBody.length - 1) {
          doc.setFont("helvetica", "bold");
          doc.setFillColor(...lightGray);
        }
      }
    });

    y = (doc as any).lastAutoTable.finalY + 15;
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
    ["Bagging / Packaging", data.packaging || "Standard clear polybag"],
  ];

  doc.autoTable({
    startY: y,
    body: pkgData,
    theme: 'grid',
    styles: { fontSize: 9 },
    columnStyles: { 0: { cellWidth: 50, fontStyle: 'bold', fillColor: lightGray } }
  });


  // Footer on all pages
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

  // Generate & Download
  doc.save(`TechPack_${data.garmentType}_${referenceNumber}.pdf`);
}
