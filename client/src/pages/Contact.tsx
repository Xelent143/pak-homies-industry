import PageHeader from "@/components/PageHeader";
import { Link } from "wouter";
import { Mail, MessageCircle, MapPin, Clock } from "lucide-react";

export default function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Talk to Shehraz directly."
        subtitle="No sales reps. No automated bots. Direct WhatsApp to the founder, average reply 4 hours."
      />

      <section className="container-page py-20 grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          {[
            { icon: MessageCircle, label: "WhatsApp (preferred)", value: "+92 328 5619939", href: "https://wa.me/923285619939" },
            { icon: Mail, label: "Email", value: "Pakhomiesi@gmail.com", href: "mailto:Pakhomiesi@gmail.com" },
            { icon: MapPin, label: "Factory address", value: "Airport Road, Gansarpur, Sialkot 51310, Pakistan", href: null },
            { icon: Clock, label: "Hours (PKT)", value: "Mon–Sat 9am–7pm · Reply within 4 hours", href: null },
          ].map((row) => {
            const Icon = row.icon;
            const inner = (
              <div className="flex gap-4 items-start p-6 border border-[#E0E0E0] rounded hover:border-[#3E41B6] transition-colors">
                <div className="w-11 h-11 rounded bg-[#3E41B6]/10 flex items-center justify-center text-[#3E41B6] shrink-0">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="ribbon-text text-[#555]">{row.label}</div>
                  <div className="font-semibold text-base mt-1">{row.value}</div>
                </div>
              </div>
            );
            return row.href ? <a key={row.label} href={row.href}>{inner}</a> : <div key={row.label}>{inner}</div>;
          })}
        </div>

        <div className="p-10 bg-[#1A1A1A] text-white rounded">
          <div className="ribbon-text text-[#5A5DCB]">Faster</div>
          <h2 className="font-display text-3xl mt-3">Skip the form.<br />Send a real inquiry.</h2>
          <p className="text-white/70 mt-4">
            Use our 6-step inquiry builder. Spec your garments, quantities, customizations and timelines.
            Shehraz quotes within 4 hours.
          </p>
          <Link href="/inquire" className="mt-7 inline-block px-7 py-3 bg-[#3E41B6] hover:bg-[#5A5DCB] font-semibold rounded">
            Get a Free Sample Quote
          </Link>

          <div className="mt-10 pt-8 border-t border-white/10">
            <div className="ribbon-text text-white/40">Or use a tool</div>
            <ul className="mt-4 space-y-2">
              <li><Link href="/customize" className="text-white/80 hover:text-white">→ Open the 3D Customizer</Link></li>
              <li><Link href="/capabilities/label-studio" className="text-white/80 hover:text-white">→ Design a custom label</Link></li>
              <li><Link href="/capabilities/techpack" className="text-white/80 hover:text-white">→ Generate a tech pack</Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
