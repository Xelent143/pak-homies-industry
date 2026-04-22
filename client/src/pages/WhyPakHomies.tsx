import PageHeader from "@/components/PageHeader";
import { Check, X } from "lucide-react";
import { Link } from "wouter";

const ROWS: [string, boolean | string, boolean | string, boolean | string][] = [
  ["Published MOQ", "Vague — 'call for quote'", "50–100 pieces", "50 pieces, published"],
  ["Sample lead time", "2–4 weeks", "2 weeks", "7 days, guaranteed"],
  ["Bulk lead time", "4–8 weeks", "3–4 weeks", "15 days"],
  ["BSCI certified", false, "Some", true],
  ["OEKO-TEX certified", false, "Some", true],
  ["WRAP certified", false, "Some", true],
  ["Direct founder access", false, false, true],
  ["Slab pricing published", false, "Sometimes", true],
  ["Per-unit cost (50pc denim jacket)", "$14–22", "$28–40", "$18.50"],
];

function Cell({ v }: { v: boolean | string }) {
  if (v === true) return <Check size={18} className="text-[#3E41B6]" />;
  if (v === false) return <X size={18} className="text-[#FE3136]/60" />;
  return <span className="text-sm text-[#555]">{v}</span>;
}

export default function WhyPakHomies() {
  return (
    <>
      <PageHeader
        eyebrow="Why Pak Homies"
        title="The only factory that's certified, fast and affordable — at the same time."
        subtitle="We compared ourselves to the two alternatives most founders end up considering. Here's what we found."
      />

      <section className="container-page py-20">
        <div className="overflow-x-auto border border-[#E0E0E0] rounded">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#E0E0E0] bg-[#F8F8F8]">
                <th className="p-4 text-xs uppercase tracking-widest text-[#555]">Factor</th>
                <th className="p-4 text-xs uppercase tracking-widest text-[#555]">PK Competitor</th>
                <th className="p-4 text-xs uppercase tracking-widest text-[#555]">USA Competitor</th>
                <th className="p-4 text-xs uppercase tracking-widest text-white bg-[#3E41B6]">Pak Homies</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, a, b, c], i) => (
                <tr key={i} className="border-b border-[#E0E0E0] last:border-0">
                  <td className="p-4 font-semibold text-sm">{label}</td>
                  <td className="p-4"><Cell v={a} /></td>
                  <td className="p-4"><Cell v={b} /></td>
                  <td className="p-4 bg-[#3E41B6]/5"><Cell v={c} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {[
            { h: "Your IP is safe", body: "Confidentiality agreement on every order. We don't produce competing designs. We don't share your designs. Direct relationship = no leaks." },
            { h: "Direct access", body: "WhatsApp. Video calls. No middleman. Shehraz responds within 4 hours. Your questions are his priority." },
            { h: "Start small, scale big", body: "50 pieces to 500+ without switching factories. Same quality. No setup fees. Price drops at each slab tier." },
            { h: "Ethical proof", body: "BSCI, OEKO-TEX, WRAP — visible. Factory transparent. Worker safety verified. Your brand's integrity is protected." },
          ].map((c) => (
            <div key={c.h} className="p-7 border border-[#E0E0E0] rounded hover:border-[#3E41B6] transition-colors">
              <h3 className="font-display text-2xl">{c.h}</h3>
              <p className="text-[#555] mt-3 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 p-10 bg-[#1A1A1A] text-white rounded">
          <h2 className="font-display text-3xl md:text-4xl">Ready to compare for yourself?</h2>
          <p className="text-white/70 mt-3 max-w-xl">Submit your tech pack. Shehraz will quote you within 4 hours.</p>
          <Link href="/inquire" className="mt-6 inline-block px-6 py-3 bg-[#3E41B6] hover:bg-[#5A5DCB] font-semibold rounded">
            Get a Free Sample Quote
          </Link>
        </div>
      </section>
    </>
  );
}
