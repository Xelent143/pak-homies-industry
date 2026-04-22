import PageHeader from "@/components/PageHeader";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const TOOLS = [
  {
    n: "01",
    title: "3D Customizer",
    href: "/customize",
    body: "Configure colors, fabrics, decals and logos on a live 3D garment. Capture front/back/side views and submit them as part of your inquiry.",
    chips: ["WebGL · Three.js", "Real-time preview", "Logo + decal upload"],
  },
  {
    n: "02",
    title: "2D Label Studio",
    href: "/capabilities/label-studio",
    body: "Design woven, printed and embroidered labels in your browser. Drag fonts, ISO care symbols, sizing tables and brand marks. Export print-ready SVG/PNG.",
    chips: ["Fabric.js editor", "ISO care symbols", "Print-ready export"],
  },
  {
    n: "03",
    title: "Tech Pack Generator",
    href: "/capabilities/techpack",
    body: "Build a production-ready tech pack in minutes via a 5-step wizard: brand info, design, fabric, embellishments, sizing. Download a PDF or send it straight to us.",
    chips: ["5-step wizard", "PDF export", "Submit-to-factory"],
  },
  {
    n: "04",
    title: "Cut, Make, Trim (CMT)",
    href: "/contact",
    body: "Pattern grading, cutting, sewing, labeling and quality control — under one roof. Bring your designs, we handle the production end-to-end.",
    chips: ["Pattern grading", "QA at every stage", "0% defect SLA"],
  },
];

export default function Capabilities() {
  return (
    <>
      <PageHeader
        eyebrow="Capabilities"
        title="Three free tools. One factory floor."
        subtitle="Use the tools to design your brand, then send the spec straight to us. No signup. No middleman."
      />

      <section className="container-page py-20 grid md:grid-cols-2 gap-6">
        {TOOLS.map((t) => (
          <Link key={t.href} href={t.href} className="group p-10 border border-[#E0E0E0] rounded hover:border-[#3E41B6] hover:shadow-xl transition-all bg-white">
            <div className="font-display text-6xl text-[#3E41B6]/20 group-hover:text-[#3E41B6]/40 transition-colors">{t.n}</div>
            <h2 className="font-display text-3xl mt-6">{t.title}</h2>
            <p className="text-[#555] mt-3 leading-relaxed">{t.body}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {t.chips.map((c) => (
                <span key={c} className="px-2.5 py-1 bg-[#F8F8F8] border border-[#E0E0E0] text-xs">{c}</span>
              ))}
            </div>
            <div className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-[#3E41B6] group-hover:text-[#FE3136]">
              Open <ArrowRight size={16} />
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
