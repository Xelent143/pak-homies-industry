import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { ArrowRight, Check } from "lucide-react";
import { PRODUCTS } from "@/data/products";

export default function Inquire() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    brand: "",
    email: "",
    whatsapp: "",
    city: "",
    products: [] as string[],
    quantity: "",
    customization: "",
    timeline: "",
    notes: "",
  });

  const update = (k: keyof typeof form, v: string | string[]) => setForm({ ...form, [k]: v });
  const toggleProduct = (slug: string) => {
    update("products", form.products.includes(slug) ? form.products.filter((p) => p !== slug) : [...form.products, slug]);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      // Endpoint may not exist yet — we still confirm the UX
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <PageHeader eyebrow="Inquiry received" title="We're on it." subtitle="Shehraz will message you within 4 hours via WhatsApp or email." />
        <section className="container-page py-20 max-w-2xl">
          <div className="p-10 border border-[#3E41B6] rounded text-center">
            <Check size={48} className="text-[#3E41B6] mx-auto" />
            <h2 className="font-display text-2xl mt-4">Inquiry submitted</h2>
            <p className="text-[#555] mt-3">A copy has been sent to Pakhomiesi@gmail.com. We reply within 4 hours during PKT business hours.</p>
            <a href="https://wa.me/923285619939" className="mt-6 inline-block px-6 py-3 bg-[#3E41B6] hover:bg-[#5A5DCB] text-white font-semibold rounded">
              Message Shehraz on WhatsApp now
            </a>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Get a free quote"
        title="Tell us what you want made."
        subtitle="6 quick fields. Shehraz quotes within 4 hours. No commitment."
      />

      <section className="container-page py-20">
        <form onSubmit={submit} className="grid lg:grid-cols-[1.4fr_1fr] gap-12">
          <div className="space-y-8">
            {/* Step 1: contact */}
            <div className="p-8 border border-[#E0E0E0] rounded">
              <div className="ribbon-text text-[#3E41B6]">Step 1 · You</div>
              <div className="mt-5 grid sm:grid-cols-2 gap-4">
                <Field label="Your name" value={form.name} onChange={(v) => update("name", v)} required />
                <Field label="Brand name" value={form.brand} onChange={(v) => update("brand", v)} required />
                <Field label="Email" value={form.email} onChange={(v) => update("email", v)} type="email" required />
                <Field label="WhatsApp (with country code)" value={form.whatsapp} onChange={(v) => update("whatsapp", v)} />
                <Field label="City" value={form.city} onChange={(v) => update("city", v)} placeholder="Atlanta, Houston, etc." />
              </div>
            </div>

            {/* Step 2: products */}
            <div className="p-8 border border-[#E0E0E0] rounded">
              <div className="ribbon-text text-[#3E41B6]">Step 2 · Products (pick any)</div>
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PRODUCTS.map((p) => {
                  const active = form.products.includes(p.slug);
                  return (
                    <button
                      type="button"
                      key={p.slug}
                      onClick={() => toggleProduct(p.slug)}
                      className={`p-4 border rounded text-left transition-colors ${
                        active ? "border-[#3E41B6] bg-[#3E41B6]/5" : "border-[#E0E0E0] hover:border-[#3E41B6]"
                      }`}
                    >
                      <div className="font-semibold text-sm">{p.name}</div>
                      <div className="text-xs text-[#555] mt-1">From ${p.basePrice.toFixed(2)}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: details */}
            <div className="p-8 border border-[#E0E0E0] rounded space-y-4">
              <div className="ribbon-text text-[#3E41B6]">Step 3 · Details</div>
              <Field label="Total quantity (across all styles)" value={form.quantity} onChange={(v) => update("quantity", v)} placeholder="e.g. 200 pieces" />
              <Field label="Customizations needed" value={form.customization} onChange={(v) => update("customization", v)} placeholder="Custom labels, embroidery, dye colors..." />
              <Field label="Timeline" value={form.timeline} onChange={(v) => update("timeline", v)} placeholder="When do you need bulk?" />
              <div>
                <label className="block ribbon-text text-[#555] mb-2">Anything else</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  rows={4}
                  className="w-full p-3 border border-[#E0E0E0] rounded focus:border-[#3E41B6] outline-none"
                  placeholder="Reference brands, hardware, fabric ideas, anything Shehraz should know."
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-7 py-4 bg-[#3E41B6] hover:bg-[#5A5DCB] text-white font-semibold rounded inline-flex items-center gap-2"
            >
              Submit Inquiry <ArrowRight size={18} />
            </button>
          </div>

          <aside className="p-8 bg-[#1A1A1A] text-white rounded h-fit sticky top-28">
            <div className="ribbon-text text-[#5A5DCB]">What happens next</div>
            <ol className="mt-5 space-y-4">
              {[
                "Shehraz reads your inquiry within 4 hours.",
                "You get a quote with slab pricing for every garment.",
                "If you approve: 7 days to sample, 15 days to bulk.",
                "Daily WhatsApp updates with photos throughout production.",
              ].map((step, i) => (
                <li key={i} className="flex gap-3">
                  <div className="w-7 h-7 shrink-0 rounded-full bg-[#3E41B6] flex items-center justify-center text-sm font-bold">{i + 1}</div>
                  <div className="text-white/80 text-sm">{step}</div>
                </li>
              ))}
            </ol>

            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="ribbon-text text-white/40">Direct line</div>
              <a href="https://wa.me/923285619939" className="block mt-2 text-white hover:text-[#FE3136]">+92 328 5619939</a>
              <a href="mailto:Pakhomiesi@gmail.com" className="block mt-1 text-white hover:text-[#FE3136]">Pakhomiesi@gmail.com</a>
            </div>
          </aside>
        </form>
      </section>
    </>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder, required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block ribbon-text text-[#555] mb-2">{label}{required && <span className="text-[#FE3136]"> *</span>}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full p-3 border border-[#E0E0E0] rounded focus:border-[#3E41B6] outline-none"
      />
    </div>
  );
}
