import PageHeader from "@/components/PageHeader";
import { Check } from "lucide-react";
import { Link } from "wouter";

const CERTS = [
  {
    name: "BSCI",
    full: "Business Social Compliance Initiative",
    h: "Fair labor + supply chain transparency",
    body: "BSCI audits our labor practices, wages, working hours, freedom of association, health & safety, and environmental impact every year. Every worker earns above minimum wage, with paid leave, maternity benefits, and safe conditions.",
    proves: ["Fair wages (verified)", "Safe working conditions", "No child labor", "Environmental compliance", "Supply chain transparency"],
  },
  {
    name: "OEKO-TEX 100",
    full: "STANDARD 100 by OEKO-TEX",
    h: "Safe, chemical-free fabrics",
    body: "OEKO-TEX verifies all fabrics and finished garments are free from harmful chemicals and meet strict health and safety standards. Critical for Gen Z brands that sell to consumers who care about what touches their skin.",
    proves: ["No harmful dyes", "No banned substances", "Dermatologically safe", "Consumer-safe", "Annual recertification"],
  },
  {
    name: "WRAP",
    full: "Worldwide Responsible Accredited Production",
    h: "Lawful, humane, ethical production",
    body: "WRAP independently verifies that all garments are manufactured under lawful, humane, and ethical conditions. It's the gold standard for ethical apparel manufacturing.",
    proves: ["Lawful labor", "Humane treatment", "Ethical conditions", "No exploitation", "Community engagement"],
  },
];

export default function Certifications() {
  return (
    <>
      <PageHeader
        eyebrow="Certifications"
        title="Triple-certified. The rarest combination in Sialkot."
        subtitle="Fewer than 5% of Pakistani manufacturers hold all three. None of our direct competitors publicly display them."
      />

      <section className="container-page py-20 space-y-12">
        {CERTS.map((c) => (
          <div key={c.name} className="grid md:grid-cols-[280px_1fr] gap-10 p-10 border border-[#E0E0E0] rounded">
            <div>
              <div className="inline-block px-4 py-2 bg-[#3E41B6] text-white ribbon-text">{c.name}</div>
              <div className="text-xs text-[#555] mt-3 uppercase tracking-widest">{c.full}</div>
            </div>
            <div>
              <h2 className="font-display text-3xl">{c.h}</h2>
              <p className="text-[#555] mt-4 leading-relaxed">{c.body}</p>
              <div className="mt-6 grid sm:grid-cols-2 gap-2">
                {c.proves.map((p) => (
                  <div key={p} className="flex gap-2 text-sm">
                    <Check size={16} className="text-[#3E41B6] mt-1 shrink-0" /> {p}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div className="p-10 bg-[#1A1A1A] text-white rounded text-center">
          <h2 className="font-display text-3xl md:text-4xl">Need to see the audit reports?</h2>
          <p className="text-white/70 mt-3">Available on request to qualified buyers. Just ask.</p>
          <Link href="/contact" className="mt-6 inline-block px-7 py-3 bg-[#3E41B6] hover:bg-[#5A5DCB] font-semibold rounded">
            Request audit reports
          </Link>
        </div>
      </section>
    </>
  );
}
