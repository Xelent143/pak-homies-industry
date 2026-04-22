import PageHeader from "@/components/PageHeader";
import { Link } from "wouter";

const STEPS = [
  { day: "Day 1", title: "Submit your tech pack", body: "Upload sketches, references or use our free Tech Pack Generator. Shehraz reviews within 4 hours and confirms feasibility." },
  { day: "Day 2–6", title: "Sample production", body: "Our cutting and sewing teams build your sample to spec. Daily WhatsApp updates with photos." },
  { day: "Day 7", title: "Sample arrives", body: "DHL Express to your door. Inspect fit, color, stitching, fabric hand. Approve or request revisions." },
  { day: "Week 2–3", title: "Approve / iterate", body: "Most customers approve on the first sample. Revisions are 3–5 days each." },
  { day: "Week 4", title: "Place bulk order", body: "MOQ 50+. Slab pricing locked at quote. We start production immediately." },
  { day: "Week 4–6", title: "Bulk production", body: "15-day production cycle. Daily progress photos. QA at every stage. 0% defect SLA, ±1% tolerance." },
  { day: "Week 6–7", title: "QA + ship", body: "Final inspection. Packed with care labels and your branding. Air or sea freight to USA. Tracking shared." },
];

export default function Process() {
  return (
    <>
      <PageHeader
        eyebrow="The process"
        title="From sketch to shelf in 6 weeks."
        subtitle="Most competitors quote 2–4 weeks just for samples. We deliver finished bulk in the same window."
      />

      <section className="container-page py-20">
        <ol className="space-y-4">
          {STEPS.map((s, i) => (
            <li key={s.day} className="grid md:grid-cols-[160px_1fr] gap-6 p-6 border border-[#E0E0E0] rounded hover:border-[#3E41B6] transition-colors">
              <div>
                <div className="font-display text-5xl text-[#3E41B6]/30">{String(i + 1).padStart(2, "0")}</div>
                <div className="ribbon-text text-[#3E41B6] mt-2">{s.day}</div>
              </div>
              <div>
                <h3 className="font-display text-2xl">{s.title}</h3>
                <p className="text-[#555] mt-2 leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 p-10 bg-[#3E41B6] text-white rounded">
          <h2 className="font-display text-3xl md:text-4xl">Skip the consultant. Use our free tools.</h2>
          <p className="text-white/80 mt-3 max-w-xl">Build your tech pack, design custom labels, and configure a 3D garment — all in your browser, all free.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/capabilities/techpack" className="px-5 py-3 bg-white text-[#3E41B6] font-semibold rounded">Tech Pack Generator</Link>
            <Link href="/capabilities/label-studio" className="px-5 py-3 border border-white/30 hover:bg-white hover:text-[#3E41B6] font-semibold rounded">Label Studio</Link>
            <Link href="/customize" className="px-5 py-3 border border-white/30 hover:bg-white hover:text-[#3E41B6] font-semibold rounded">3D Customizer</Link>
          </div>
        </div>
      </section>
    </>
  );
}
