import PageHeader from "@/components/PageHeader";
import { Link } from "wouter";

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A Sialkot factory built for the next generation of Black streetwear."
        subtitle="Founded by Shehraz Ali. 15 years of apparel manufacturing in Sialkot. One mission: certified, transparent production for emerging brands the big factories ignore."
      />

      <section className="container-page py-20 grid lg:grid-cols-[1fr_1.4fr] gap-16">
        <div>
          <img
            src="/images/generated/founder-shehraz-portrait.webp"
            alt="Shehraz Ali, founder of Pak Homies Industry"
            className="w-full rounded border border-[#E0E0E0]"
          />
        </div>
        <div className="space-y-6 text-[#1A1A1A]/85 leading-relaxed">
          <div className="ribbon-text text-[#3E41B6]">Founder note</div>
          <h2 className="font-display text-3xl md:text-4xl text-[#1A1A1A]">
            "I built Pak Homies because emerging brands deserve a real factory partner — not a gatekeeper."
          </h2>
          <p>
            For 15 years I worked inside Sialkot's biggest export houses. I watched them turn away every brand that
            couldn't put 1,000 pieces on the table. Talented Black-owned streetwear founders with real designs, real
            customers and real momentum — sent away because their MOQ wasn't big enough.
          </p>
          <p>
            Pak Homies is the answer to that. MOQ 50. Published lead times. BSCI, OEKO-TEX and WRAP certified — the rarest
            combination in Pakistan. Direct WhatsApp to me. No middlemen. No "let me check with the factory."
            I am the factory.
          </p>
          <p>
            We're not the cheapest. We're the most accountable. If a stitch is wrong, you tell me, and I fix it.
          </p>
          <p className="font-semibold text-[#1A1A1A]">— Shehraz Ali, Founder</p>

          <div className="pt-6 flex flex-wrap gap-4">
            <Link href="/inquire" className="px-6 py-3 bg-[#3E41B6] hover:bg-[#5A5DCB] text-white font-semibold rounded">
              Get a Free Sample Quote
            </Link>
            <Link href="/process" className="px-6 py-3 border border-[#E0E0E0] hover:border-[#3E41B6] font-semibold rounded">
              See our process
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#F8F8F8] py-20">
        <div className="container-page">
          <div className="ribbon-text text-[#3E41B6]">By the numbers</div>
          <h2 className="font-display text-3xl md:text-5xl mt-3">15 years. 1 factory. 9 garments.</h2>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              ["15 yrs", "Sialkot manufacturing experience"],
              ["3", "Independent certifications"],
              ["50", "Pieces minimum order"],
              ["4 hrs", "Average reply time from Shehraz"],
            ].map(([big, small]) => (
              <div key={big} className="p-6 bg-white border border-[#E0E0E0] rounded">
                <div className="font-display text-3xl text-[#3E41B6]">{big}</div>
                <div className="text-xs text-[#555] mt-2 uppercase tracking-widest">{small}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
