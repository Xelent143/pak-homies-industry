import { Link } from "wouter";
import { useRef, useState } from "react";
import { FileText, Scissors, Cog, PackageCheck, Truck, Box, Tag, FileCode, Layers, Sparkles, Wand2, ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/data/products";

const STITCH_IMG = {
  hero: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2ovk_JjZXccx3_0DW_wZkwKHzd5V3BTJtMVCmMxbVUCs70h5aLSPWtEqOBNq3xot4_fWr1I0z0-oui37Efp1H3oiZ42xDhpT9d8kFPl0YPz7kpYANOM1dcgvy8X168kKVKgWCzttOGK21xwYnlY9hoX44hkNpetHSnHtUeJfLsQvuT5aRFhA8x1fyK5BiLEdCvdpZxmZWvQ0luYAXkvMC5qqBzf-Nn5G3L8JLf77V0DzcU_-E1gsINGBv8c010FkNfufSh2oesa9w",
  denim: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEfMMXfc1o7o7aoecA1k-WdnTrD6LR9_-D1QrJibrogiZn9N4JKt87GkOoY1YnD_6QcGXYGEaQLJ4-UiN7mMF6AQ_HHQNDJqF8wiqHnd-liUGNLdAEsE2YbIfO88Z1TSWRhwlowEYI0pH9z0vDRG3RpFReDVohc8lz7L8fUmvWQ0qiiu4ZKxPlV_C-w1XSGh7Q9ePOrAt9VEqSIsC3a0OGBzeP55xj9VjbiGzhHdz6hzyZx8nq0j6cZkD40mSNBwZj5BUtcYX03Mhe",
  fleece: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUFnXbQtKGQQtAMJozT12-8566rbomf9zNvF5bykh38wjPZ4IVXxfJXs00GEmJRM7m9QwzBAqUWuI46W--wIUx6OeVuYlHd7SGBu6zzeBiCmuEVSux63QlqYEaN71fzlAllKcYZ8W4VHfJhQ-Q5d2FhWAVo-X4D2KGJ-OFoRuwa7U_UOBXOV8o3BM8_-QRg72HDDIKbPNB8S1hUO7ui3FR741AMRfkTBjdPva0Gp6jtYCln3RnY4NKnJHMX9UC-NWr-Erxzz-Elckw",
  carpenter: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6g0q0-B5XK3xNiuA9ppN1X0nM6r3_hGcpEGheI6ihnrNKyO-kmZCKOf0GmuBVZwjFIb57NCEhkodUU2JS7RjpzxwaGMDVNWWdqqfTeeU-5a4hoqJOLcijulLkPaV1IXVk-uo_k5RBvILcAbO2Z-HOzYmHXswDL2gLmtDQc4mesPbY-hK_EojOSU0PQ9JGxoaQ-6hUODZ6IrQdToaUToH4ymqv3-906aSfXjXTJw6C89qxPjV60LUJk2md0jI4T5ax28-GsTAvwCPQ",
  g1: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSSzn7UUbgJ2kEEkezD2QCf_k9-oPKtV7KcomwEGPglMOJG0uWUA2viOHItqiJLMhePs_a3Ihpuy7KOwMPfpxLW4o0ComYY4tVAESpcJHIq6Si1lHImo12bw6i_5CraRuuYDCjMnwQxvzMLK1Bqz4a-ZxpzQ39zgO5GiUMMhJfBEkZGndSp_ep1Dlc2YcR2WTGohvgRSGnVTyAl2EkDthQ3HpyYBQA_iZcLtB8k7jHcFemRboQhG1Fv56cGGX8gmGRvHGbScTpvWgT",
  g2: "https://lh3.googleusercontent.com/aida-public/AB6AXuDtvfRUtK6NdpKLnuKQQZ4u-i5jT9dK0ho5Yc_2C98951g7LSwTwMAcARHVlVJs0mcrX1lMFESyzuURAxNPfDPMX3kjAodt8stBYXhS9jCIERaNZS25bR2Co_1hdhP7UBYXUWHSO9k9U5zpB65JDoe_OTIXxvT-a3PzIkU7snkVXk3kDTIJCvgLSXWIxTvMyM9_Qn34mpkrCStZJ7pftDhTYrEKvlmFhMFBvlCxDKg3D5Gs2fNulS4fKKzUpvxd_GUeald1AFaACNg1",
  g3: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9BYA58ekEiqLWFzQwEO725Uj7DL3R92kcsmu41GEJH9Cw1M-ItWymGPfKIacqvlINw3OcgOxVKCaqy20Ha9VN3qUy-31eBoiw0FKQKUGk63tgnlAiT7Hh4GPLoeiuZApIRoTtzFhK_uFM8fWg_47CyShN7WOEObSrVYfGRjhK1m30V84FqkSQ4gZXr4na10f7dF5CXb9B8o0twVuw6qALai5jbH8EvvzY042PYc51Mj6zqAAQosFxlvy6RBuNZ04_Lo60gwLQJSwG",
  factory: "https://lh3.googleusercontent.com/aida-public/AB6AXuBIu4D199DgL2QtQgzbJ37FJYo0Hu45ij298wi8LKBUkGsH1sfuRwTDQhBx6VckwwuUwUqyv7otk00_W-_qrhYneM9TvDxeHT6H7Mrw9IJHEjCtUTEnlvAdhslcXaEBqvFUaPTngOIqGYWRidF1v6c2QkZTVO8hrL2fgxLyeGPY6UuHrhWb3HSItRMu9VmVFDW1mRbEU4JwbJPitdl-jhhjg2ZB7xYlR3gTmX4VY5xjEp4tUFWNb7KD5PrhA1M4jl0E3L5463vzM8YR",
  t1: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5kKpy8NlfxyRmP0DoZvS6ZhqsGbFkLVYP-n9tJ-Ci_rXzDf6rYJlV6ubMK2L7eMb_UJVtExqWr-OTvR7muvwiuoIppt4hZfXR3PPUYfF0nIJiMIbq-wyzpuZe95bbV1Q9zcBWcMeq4dEDNp9pJTQhXe7K_ukwRV4WmNTCChz-X8V755ZVx3a5fZpQdMLSBXYYJvrM-KGyl8LztB9g6R5vUozh8VSq-8LnX0yv2sFUjrY0AM-5dCdM-OQ1NOz2KnLpGzNicLC8xQfw",
  t2: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwCTnkjLyHKEGBCvd-KHmU7fQyyu3dw3ebpsTXhXsLbYdONipMVIkRpVw_0MOqCqDxS7CEGeVdhDE1ovSFPHFtgaFF05SAO4lpPUHw_9U3yisQ8zYBaFJgZzN_T5PUJXEbeswbjcdZjyT6ATLrq9g6Q-JMOPqctujoFf6hFbz_6SzwfZGYpoZ2m1LhfSsgMYDXiRnAjS5zFwkcupfFBn0O1NADi_G6ru3YbfkRVEYQro5qPZ_9Dphkl8-0cY6yhKV0sH6OV34B92qD",
  t3: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtH3O_LnnySFTMD1u4CAWR-QvuUrQjB7JDQXtMeUd3IP6lXbrSSNR4k96uru3_V-oxFC0I_x4_s4DtKku6ItzrkDy-QXDjgOCxg3YGyHNsQ154BAwhVBVTeI0X7wnzOZqe_iASDoskYvZutjJeA0ru7f-7Rj20nE2tx-kwXKx-7CQxT_CL7XShJNNPMqFRTaoqHkDC_efS8HqEfS-WSUPbjCFBEvLreRWa8_DcwrLq1mqAyrrucG2ejg_qAGkoUKwUaVCwwl07MBWd",
  t4: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2sULbQMV1mbhZSN76Z_vsJAJdeKVHBvvTYUVvgVhrkkBSrUPoz13HoHZI-5XFzIkewBxJcCbesW36ofoTWSnhG90OlhgCk_-wsuTPb8qBoeTLjxWvZLP5X4gGpxzTUTlw_BJt17cJYKQce9psPO4sglKj7WQgWZxpMe7ICV4RUFTck6Dym9hwuSbJc8Jxaqr36FxL0TPQvTz-2trtFPbc0bKjj7aVIh9VzknulkubCYJ3mSZUdtWdFdz58RYdiSLLWNCnjCk1Uou7",
};

export default function Home() {
  // Featured products scroller
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState({ active: false, startX: 0, startScroll: 0 });

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : 360;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  const onDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    setDrag({ active: true, startX: e.pageX - el.offsetLeft, startScroll: el.scrollLeft });
  };
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drag.active) return;
    const el = scrollerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = drag.startScroll - (x - drag.startX) * 1.4;
  };
  const onUp = () => setDrag((d) => ({ ...d, active: false }));

  return (
    <main className="bg-[#F8F8F8] text-[#1A1A1A]">
      {/* 1. Hero */}
      <section className="relative min-h-[92vh] flex flex-col md:flex-row border-b-2 border-[#1A1A1A] paper-grain overflow-hidden">
        {/* Giant outline number */}
        <div className="absolute top-14 left-8 text-[18rem] font-headline font-black text-[#E0E0E0] opacity-30 select-none z-0 leading-none pointer-events-none">01</div>

        {/* LEFT — text column */}
        <div className="w-full md:w-[58%] p-10 md:p-20 flex flex-col justify-center z-10 relative">
          <span
            className="text-[#FE3136] text-xs uppercase tracking-[0.3em] mb-6 font-black flex items-center gap-3 animate-slide-up"
            style={{ animationDelay: "0.05s" }}
          >
            <span className="w-10 h-px bg-[#FE3136]" />
            01 / SIALKOT, PAKISTAN → USA
          </span>

          <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.92] font-headline font-black tracking-tighter mb-8 max-w-[900px]">
            <span className="block animate-slide-up" style={{ animationDelay: "0.15s" }}>Certified</span>
            <span className="block animate-slide-up" style={{ animationDelay: "0.3s" }}>
              <span className="relative inline-block">
                streetwear
                <span className="absolute left-0 right-0 bottom-1 h-[6px] bg-[#FE3136]/30 -z-10 animate-underline" />
              </span>
            </span>
            <span className="block animate-slide-up" style={{ animationDelay: "0.45s" }}>manufacturing for</span>
            <span className="block animate-slide-up" style={{ animationDelay: "0.6s" }}>
              <span className="relative inline-block border-b-8 border-[#FE3136]">
                Black-owned brands
                <span className="absolute inset-x-0 -bottom-2 h-2 animate-shimmer" />
              </span>
              <span className="text-[#FE3136]">.</span>
            </span>
          </h1>

          {/* Key points — animated chip row */}
          <div className="flex flex-wrap gap-2 mb-6 animate-slide-up" style={{ animationDelay: "0.75s" }}>
            {[
              { k: "MOQ 50", sub: "ONLY" },
              { k: "7-DAY", sub: "SAMPLES" },
              { k: "15-DAY", sub: "BULK" },
              { k: "BSCI", sub: "CERT" },
              { k: "OEKO-TEX", sub: "CERT" },
              { k: "WRAP", sub: "CERT" },
            ].map((c, i) => (
              <div
                key={c.k}
                className="group relative border-2 border-[#1A1A1A] bg-white px-3 py-2 flex items-baseline gap-1.5 hover:bg-[#1A1A1A] hover:text-white transition-colors cursor-default"
                style={{ animation: "slideUp 0.6s cubic-bezier(.2,.8,.2,1) both", animationDelay: `${0.8 + i * 0.07}s` }}
              >
                <span className="font-headline font-black text-sm">{c.k}</span>
                <span className="text-[9px] uppercase tracking-widest font-bold text-[#FE3136] group-hover:text-[#FE3136]">{c.sub}</span>
              </div>
            ))}
          </div>

          <p
            className="text-base text-[#3A3A3A] w-full max-w-[560px] mb-10 leading-relaxed animate-slide-up"
            style={{ animationDelay: "1.2s" }}
          >
            Made in Sialkot, trusted by emerging brands in{" "}
            <span className="font-bold text-[#1A1A1A]">Atlanta, Houston, LA, NYC, Detroit, and Chicago</span>.{" "}
            Direct access to the founder — <span className="text-[#FE3136] font-bold">no middleman</span>.
          </p>

          <div className="flex flex-wrap gap-4 items-start animate-slide-up" style={{ animationDelay: "1.35s" }}>
            <Link
              href="/inquire"
              className="group relative px-10 py-5 bg-[#3E41B6] text-white font-bold uppercase tracking-widest border-2 border-[#1A1A1A] hover:translate-x-1 hover:translate-y-1 transition-transform overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                Get a Free Sample Quote
                <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
              </span>
              <span className="absolute inset-0 bg-[#FE3136] translate-y-full group-hover:translate-y-0 transition-transform" />
            </Link>
            <Link
              href="/certifications"
              className="px-10 py-5 bg-white text-[#1A1A1A] font-bold uppercase tracking-widest border-2 border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
            >
              See Certifications
            </Link>
          </div>

          <div
            className="mt-12 inline-flex items-center gap-2 bg-[#EEEEEE] px-4 py-2 border-2 border-[#1A1A1A] max-w-fit animate-slide-up"
            style={{ animationDelay: "1.5s" }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest">Factory online · 47 orders in production</span>
          </div>
        </div>

        {/* MOQ stamp — positioned at section level so it straddles both columns */}
        <div className="absolute bottom-8 right-8 md:top-1/2 md:bottom-auto md:right-auto md:left-[58%] md:-translate-x-1/2 md:-translate-y-1/2 w-28 h-28 md:w-32 md:h-32 bg-[#FE3136] rounded-full flex items-center justify-center stamp-rotate z-30 border-2 border-[#1A1A1A] animate-scale-in animate-glow-pulse" style={{ animationDelay: "1.6s" }}>
          <span className="text-white text-center font-headline font-bold leading-tight">MOQ / 50<br />ONLY</span>
        </div>

        {/* RIGHT — image column */}
        <div className="w-full md:w-[42%] relative min-h-[500px] overflow-hidden bg-[#1A1A1A]">
          {/* Full-bleed hero image with ken burns */}
          <img
            className="absolute inset-0 w-full h-full object-cover contrast-110 brightness-90 animate-ken-burns"
            src="/images/generated/home-hero-factory-founder.webp"
            alt="Pak Homies Industry factory floor in Sialkot"
          />
          {/* Gradient veil */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A]/50 via-transparent to-[#1A1A1A]/70" />
          {/* Vertical red bar */}
          <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#FE3136]" />

          {/* Floating label cards */}
          <div
            className="absolute top-10 right-6 bg-white border-2 border-[#1A1A1A] p-3 shadow-lg animate-slide-up"
            style={{ animationDelay: "1.0s" }}
          >
            <div className="flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-[#3E41B6]" strokeWidth={2.5} />
              <div>
                <div className="text-[9px] uppercase tracking-widest font-black text-[#3A3A3A]">TRIPLE-CERTIFIED</div>
                <div className="text-xs font-black">BSCI · OEKO · WRAP</div>
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-10 right-6 bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] p-3 shadow-lg animate-slide-up"
            style={{ animationDelay: "1.2s" }}
          >
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[#FE3136]" strokeWidth={2.5} />
              <div>
                <div className="text-[9px] uppercase tracking-widest font-black text-white/60">SHIPS DDP TO</div>
                <div className="text-xs font-black">ANY US PORT</div>
              </div>
            </div>
          </div>

          {/* Bottom caption strip */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm border-t-2 border-[#FE3136] px-5 py-3 flex items-center justify-between">
            <span className="text-[9px] uppercase tracking-[0.3em] font-black text-white/60">GANSARPUR · AIRPORT RD</span>
            <span className="text-[9px] uppercase tracking-[0.3em] font-black text-[#FE3136]">LIVE</span>
          </div>
        </div>
      </section>

      {/* 2. Proof Bar */}
      <section className="bg-[#3E41B6] border-b-2 border-[#1A1A1A] grid grid-cols-2 md:grid-cols-4 divide-x-2 divide-[#1A1A1A] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.07] animate-doodle-drift pointer-events-none"
          style={{
            backgroundImage: "url('/images/streetwear-doodle-pattern.png')",
            backgroundSize: "500px 500px",
            backgroundRepeat: "repeat",
          }}
        />
        {[
          ["50", "Minimum Order Qty", "pieces — published, no games"],
          ["07", "Day Samples", "tech-pack to your hands"],
          ["15", "Day Bulk Run", "from approved sample"],
          ["4H", "Founder Reply", "WhatsApp, GMT+5 hours"],
        ].map(([n, l, sub], i) => (
          <div
            key={l}
            className="group relative p-8 text-white flex flex-col items-center text-center cursor-default overflow-hidden transition-all duration-500 hover:bg-[#FE3136]"
            style={{ animationDelay: `${i * 120}ms` }}
          >
            {/* Hover sweep */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
            {/* Animated number */}
            <span className="relative text-6xl md:text-8xl font-headline font-black mb-2 inline-block transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-1 animate-slide-up">
              {n}
            </span>
            {/* Animated underline */}
            <span className="relative block h-[3px] w-10 bg-white mb-3 transition-all duration-500 group-hover:w-24 group-hover:bg-white" />
            <span className="relative text-xs uppercase tracking-widest font-bold">{l}</span>
            {/* Reveal subtitle on hover */}
            <span className="relative text-[10px] uppercase tracking-wider text-white/0 group-hover:text-white/90 mt-2 max-h-0 group-hover:max-h-10 overflow-hidden transition-all duration-500">
              {sub}
            </span>
          </div>
        ))}
      </section>

      {/* 2b. Competitor Comparison */}
      <section className="py-24 border-b-2 border-[#1A1A1A] bg-white relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.08] animate-doodle-drift pointer-events-none"
          style={{
            backgroundImage: "url('/images/streetwear-doodle-pattern.png')",
            backgroundSize: "600px 600px",
            backgroundRepeat: "repeat",
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <span className="text-[#FE3136] text-xs uppercase tracking-[0.2em] font-bold block mb-4">02 / THE HONEST COMPARISON</span>
          <h2 className="text-5xl md:text-6xl font-headline font-black uppercase tracking-tight mb-4 max-w-4xl">You've Googled "streetwear manufacturer" 47 times. <span className="text-[#FE3136]">Here's the trap nobody told you about.</span></h2>
          <p className="text-lg text-[#3A3A3A] max-w-3xl mb-12">Every factory you've messaged falls into one of two camps — and both will burn you. <strong className="text-[#1A1A1A]">Pakistan</strong> is dirt cheap, but you'll wait 3 weeks for a quote that never comes. <strong className="text-[#1A1A1A]">USA</strong> answers in an hour, then quotes you double. We built Pak Homies because we got tired of watching brands choose between <em>cheap-and-shady</em> or <em>fast-and-broke</em>. Read the columns below — slowly. The third one is the reason 247 brands moved their production to us last year.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 border-2 border-[#1A1A1A] divide-y-2 md:divide-y-0 md:divide-x-2 divide-[#1A1A1A]">
            {[
              {
                tag: "❌ THE GHOST FACTORIES",
                sub: "Pakistan Competitors",
                punch: "You'll save 40%. You'll also wait 60 days for a sample and pray it shows up.",
                bg: "bg-[#F8F8F8]",
                tc: "text-[#1A1A1A]",
                items: [
                  'MOQ? "Send your tech pack first" (then silence)',
                  "Lead times \"depend on the season\" — every season",
                  "Zero certifications. Zero audit trail. Zero proof.",
                  "Email-only. No WhatsApp. No video calls. No founder.",
                  "You're talking to a sales agent, not the factory owner.",
                ],
              },
              {
                tag: "💸 THE PREMIUM TAX",
                sub: "USA Competitors",
                punch: "Beautiful website. Fast replies. Quote that breaks your unit economics.",
                bg: "bg-[#EEEEEE]",
                tc: "text-[#1A1A1A]",
                items: [
                  "Clear MOQ 50 — at $42/unit when you needed $18",
                  "Polished policies, but built for $80 retail tees",
                  "Some certifications (the cheap ones)",
                  "Fast US delivery you'll fund with a credit card",
                  "30–50% higher per-unit. Margins die at 100 pcs.",
                ],
              },
              {
                tag: "✓ THE THIRD OPTION",
                sub: "Pak Homies ✓",
                punch: "Pakistani prices. American transparency. Audited like a European brand.",
                bg: "bg-[#3E41B6]",
                tc: "text-white",
                items: [
                  "MOQ 50 — published, no hoops, no \"call us\"",
                  "7-day samples, 15-day bulk. In writing. Or you don't pay.",
                  "BSCI + OEKO-TEX + WRAP — three audits, framed on the wall",
                  "Direct WhatsApp to the founder. Not a chatbot. Not an agent.",
                  "All-in pricing: production + labels + freight to USA port",
                ],
              },
            ].map((col) => {
              const isUs = col.bg === "bg-[#3E41B6]";
              return (
                <div key={col.tag} className={`${col.bg} ${col.tc} p-10 min-h-[520px] flex flex-col ${isUs ? "relative" : ""}`}>
                  {isUs && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FE3136] text-white text-[10px] tracking-[0.2em] font-bold px-4 py-1.5 border-2 border-[#1A1A1A] rotate-[-2deg]">
                      ★ START HERE ★
                    </div>
                  )}
                  <span className="text-[11px] uppercase tracking-[0.18em] font-bold mb-4 text-[#FE3136]">{col.tag}</span>
                  <h3 className="text-3xl font-headline font-black uppercase mb-3 leading-none">{col.sub}</h3>
                  <p className={`text-sm italic mb-7 ${isUs ? "text-white/85" : "text-[#555]"}`}>"{col.punch}"</p>
                  <ul className="space-y-4 text-sm">
                    {col.items.map((it) => (
                      <li key={it} className="flex gap-3 border-b border-current/20 pb-3 leading-snug">
                        <span className="material-symbols-outlined text-base shrink-0">{isUs ? "check" : "close"}</span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <p className="text-center text-[#1A1A1A] font-headline uppercase tracking-widest text-sm mt-10">
            Still scrolling? <span className="text-[#FE3136]">Good.</span> Now scroll faster — your competitors already did.
          </p>
        </div>
      </section>

      {/* 5. Products Grid — 9 garments */}
      <section className="border-b-2 border-[#1A1A1A] bg-white">
        <div className="px-6 pt-16 pb-12 border-b-2 border-[#1A1A1A]">
          <div className="container mx-auto">
            <span className="text-[#FE3136] text-xs uppercase tracking-[0.2em] font-bold block mb-4">05 / CATALOG</span>
            <h2 className="text-5xl md:text-6xl font-headline font-black uppercase tracking-tight">Nine garment types. All MOQ 50.</h2>
            <p className="text-lg text-[#3A3A3A] max-w-2xl mt-4">Pick one or mix and match. All slab-priced. All certified. You customize — we produce.</p>
          </div>
        </div>
        {[
          [
            { n: "01", name: "Denim Jackets", code: "DNM/JKT", hover: "#3E41B6", img: "/images/generated/product-denim-jacket-hero.webp" },
            { n: "02", name: "Fleece Pullovers", code: "FLC/HDY", hover: "#FE3136", img: "/images/generated/product-fleece-pullover-hero.webp" },
            { n: "03", name: "Trousers", code: "TRS/PNT", hover: "#1A1A1A", img: "/images/generated/product-trousers-hero.webp" },
          ],
          [
            { n: "04", name: "Shorts", code: "MESH/COR", hover: "#3E41B6", img: "/images/generated/product-shorts-hero.webp" },
            { n: "05", name: "T-Shirts", code: "SUP/TEE", hover: "#FE3136", img: "/images/generated/product-tshirt-hero.webp" },
            { n: "06", name: "Windbreakers", code: "TECH/SHL", hover: "#1A1A1A", img: "/images/generated/product-windbreaker-hero.webp" },
          ],
          [
            { n: "07", name: "Denim Pants", code: "RAW/DNM", hover: "#1A1A1A", img: "/images/generated/product-denim-pants-hero.webp" },
            { n: "08", name: "Puffer Jackets", code: "PFR/INS", hover: "#3E41B6", img: "/images/generated/product-puffer-jacket-hero.webp" },
            { n: "09", name: "Vests", code: "UTY/VST", hover: "#FE3136", img: "/images/generated/product-vests-hero.webp" },
          ],
        ].map((row, ri) => (
          <div key={ri} className={`grid grid-cols-1 md:grid-cols-3 divide-x-2 divide-[#1A1A1A] ${ri < 2 ? "border-b-2 border-[#1A1A1A]" : ""}`}>
            {row.map((p) => (
              <Link key={p.n} href="/products" className="p-12 relative overflow-hidden group block border-b-2 md:border-b-0 border-[#1A1A1A]">
                <span className="absolute top-4 right-4 text-6xl font-headline font-black outline-text z-0">{p.n}</span>
                <h3 className="text-2xl font-headline font-black uppercase mb-8 relative z-10">{p.name}</h3>
                {"img" in p && p.img ? (
                  <img className="w-full h-64 object-cover fussy-cut grayscale group-hover:grayscale-0 transition-all mb-4" src={p.img} alt={p.name} />
                ) : (
                  <div
                    className="w-full h-64 bg-[#E0E0E0] flex items-center justify-center fussy-cut transition-colors group-hover:[background-color:var(--hoverc)] mb-4"
                    style={{ ["--hoverc" as string]: p.hover }}
                  >
                    <span className="text-[#F8F8F8] font-black text-4xl">{p.code}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest border-b-2 border-[#1A1A1A]">Configure Order →</span>
                  <span className="text-[10px] uppercase font-bold text-[#767685]">7D sample · 15D bulk</span>
                </div>
              </Link>
            ))}
          </div>
        ))}
      </section>

      {/* 5b. Featured Products Scroller */}
      <section className="py-24 border-b-2 border-[#1A1A1A] bg-[#EEEEEE] relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06] animate-doodle-drift pointer-events-none"
          style={{
            backgroundImage: "url('/images/streetwear-doodle-pattern.png')",
            backgroundSize: "560px 560px",
            backgroundRepeat: "repeat",
          }}
        />
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
            <div>
              <span className="text-[#FE3136] text-xs uppercase tracking-[0.2em] font-bold block mb-4">06 / FEATURED DROPS</span>
              <h2 className="text-5xl md:text-6xl font-headline font-black uppercase tracking-tight max-w-3xl">The garments brands keep <span className="text-[#3E41B6]">re-ordering.</span></h2>
              <p className="text-base text-[#3A3A3A] mt-4 max-w-xl">Drag, swipe, or use the arrows. Every piece below is in production this week — click to see specs, sizes, and slab pricing.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => scrollByCard(-1)}
                aria-label="Previous"
                className="w-14 h-14 flex items-center justify-center border-2 border-[#1A1A1A] bg-white hover:bg-[#1A1A1A] hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={() => scrollByCard(1)}
                aria-label="Next"
                className="w-14 h-14 flex items-center justify-center border-2 border-[#1A1A1A] bg-[#3E41B6] text-white hover:bg-[#FE3136] transition-colors"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll track */}
        <div
          ref={scrollerRef}
          onMouseDown={onDown}
          onMouseMove={onMove}
          onMouseUp={onUp}
          onMouseLeave={onUp}
          className={`flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 px-6 md:px-[max(1.5rem,calc((100vw-1280px)/2))] select-none ${drag.active ? "cursor-grabbing" : "cursor-grab"}`}
          style={{ scrollbarWidth: "none" }}
        >
          {PRODUCTS.map((p, i) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              data-card
              onClick={(e) => { if (drag.active) e.preventDefault(); }}
              className="group shrink-0 w-[280px] md:w-[340px] snap-start bg-white border-2 border-[#1A1A1A] hover:border-[#FE3136] transition-colors flex flex-col"
              draggable={false}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#F0F0F0]">
                <img
                  src={p.img}
                  alt={p.name}
                  draggable={false}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 bg-[#1A1A1A] text-white px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold">
                  0{i + 1}
                </div>
                {p.freeShipping && (
                  <div className="absolute top-3 right-3 bg-[#FE3136] text-white px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold inline-flex items-center gap-1">
                    <Truck size={11} /> FREE
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A1A1A] to-transparent p-3 text-white text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  View product →
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#767685] font-bold">{p.category}</div>
                <h3 className="font-headline font-black text-2xl mt-1 leading-tight">{p.name}</h3>
                <p className="text-xs text-[#3A3A3A] mt-2 line-clamp-2">{p.tagline}</p>
                <div className="mt-4 pt-4 border-t border-[#E0E0E0] flex items-stretch justify-between gap-3">
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="text-[11px] uppercase tracking-widest text-[#767685] font-bold">From</div>
                    <div className="font-headline font-black text-3xl text-[#3E41B6] leading-none mt-1">${p.basePrice.toFixed(2)}</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between text-right">
                    <div className="text-[11px] uppercase tracking-widest text-[#767685] font-bold">MOQ</div>
                    <div className="font-headline font-black text-3xl text-[#1A1A1A] leading-none mt-1">50</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="container mx-auto px-6 relative z-10 mt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-xs uppercase tracking-widest font-bold text-[#3A3A3A]">
              ← Drag to scroll · {PRODUCTS.length} products in catalog →
            </p>
            <Link href="/products" className="px-8 py-4 bg-[#1A1A1A] text-white font-bold uppercase tracking-widest text-sm border-2 border-[#1A1A1A] hover:bg-[#3E41B6] transition-colors inline-flex items-center gap-2">
              See full catalog <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Tools Trio */}
      <section className="relative py-16 border-b-2 border-[#1A1A1A] overflow-hidden bg-[#EEEEEE]">
        {/* BG grid + giant outline word */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.5] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(to right, #1A1A1A 1px, transparent 1px), linear-gradient(to bottom, #1A1A1A 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />
        <div className="absolute -bottom-10 -left-10 pointer-events-none select-none opacity-[0.06]">
          <span className="font-headline font-black text-[20rem] leading-none tracking-tighter">TOOLS.</span>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Header — compact single row */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8 border-b-2 border-[#1A1A1A] pb-5">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#FE3136] text-[10px] uppercase tracking-[0.3em] font-black">§04 / IN-HOUSE TOOLING</span>
                <span className="h-px w-10 bg-[#FE3136]" />
              </div>
              <h2 className="text-3xl md:text-4xl font-headline font-black uppercase tracking-tight leading-none">
                Three tools. <span className="text-[#FE3136]">Zero</span> middlemen.
              </h2>
            </div>
            <div className="flex gap-2">
              <span className="text-[9px] uppercase tracking-widest font-black bg-[#1A1A1A] text-white px-2.5 py-1">FREE</span>
              <span className="text-[9px] uppercase tracking-widest font-black bg-[#FE3136] text-white px-2.5 py-1">NO LOGIN</span>
            </div>
          </div>

          {/* Cards grid — compact equal row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                n: "01",
                meta: "DESIGN ENGINE",
                title: "3D Customizer",
                desc: "Configure garments in real-time 3D. Pick fabric, colorways, trims — export your spec.",
                Icon: Box,
                href: "/customize",
                cta: "LAUNCH BUILDER",
                bg: "#3E41B6",
                fg: "#ffffff",
                sub: "text-white/60",
                body: "text-white/75",
                btnCls: "bg-white text-[#3E41B6] hover:bg-[#FE3136] hover:text-white",
                shadow: "#FE3136",
                badge: null as string | null,
              },
              {
                n: "02",
                meta: "IDENTITY SUITE",
                title: "Label Studio",
                desc: "Woven labels, hangtags, and care instructions — US-customs compliant out of the box.",
                Icon: Tag,
                href: "/capabilities/label-studio",
                cta: "OPEN STUDIO",
                bg: "#F8F8F8",
                fg: "#1A1A1A",
                sub: "text-[#3A3A3A]",
                body: "text-[#3A3A3A]",
                btnCls: "bg-[#1A1A1A] text-white hover:bg-[#3E41B6]",
                shadow: "#3E41B6",
                badge: "BETA",
              },
              {
                n: "03",
                meta: "SPECIFICATION",
                title: "Tech Pack Gen",
                desc: "Turn rough sketches into factory-ready blueprints with measurements, callouts & BOM.",
                Icon: FileCode,
                href: "/capabilities/techpack",
                cta: "GENERATE NOW",
                bg: "#1A1A1A",
                fg: "#FE3136",
                sub: "text-white/50",
                body: "text-white/70",
                btnCls: "bg-[#FE3136] text-white hover:bg-white hover:text-[#FE3136]",
                shadow: "#FE3136",
                badge: null as string | null,
              },
            ].map((c) => (
              <div key={c.n} className="relative group">
                <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" style={{ backgroundColor: c.shadow }} />
                <div className="relative border-2 border-[#1A1A1A] p-6 flex flex-col h-full" style={{ backgroundColor: c.bg, color: c.fg === "#FE3136" ? "#ffffff" : c.fg }}>
                  {/* Header row */}
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <div className={`text-[9px] uppercase tracking-[0.3em] font-black ${c.sub}`}>№ {c.n} · {c.meta}</div>
                    </div>
                    <div className="w-9 h-9 border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: c.fg === "#1A1A1A" ? "#1A1A1A" : "rgba(255,255,255,0.3)" }}>
                      <c.Icon className="w-4 h-4" strokeWidth={2.5} style={{ color: c.fg === "#FE3136" ? "#FE3136" : c.fg }} />
                    </div>
                  </div>

                  {/* Title + badge */}
                  <div className="flex items-baseline gap-2 mb-2">
                    <h3 className="text-2xl md:text-3xl font-headline font-black uppercase leading-none" style={{ color: c.fg }}>{c.title}</h3>
                    {c.badge && (
                      <span className="text-[8px] uppercase tracking-widest font-black text-[#FE3136] border border-[#FE3136] px-1.5 py-0.5 red-stamp">{c.badge}</span>
                    )}
                  </div>

                  <p className={`text-[13px] leading-snug mb-6 ${c.body}`}>{c.desc}</p>

                  <Link
                    href={c.href}
                    className={`mt-auto flex items-center justify-between gap-3 px-4 py-3 font-black uppercase tracking-widest border-2 border-[#1A1A1A] transition-colors ${c.btnCls}`}
                  >
                    <span className="text-[11px]">{c.cta}</span>
                    <ArrowUpRight className="w-4 h-4" strokeWidth={3} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom strip */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-widest font-black text-[#3A3A3A]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FE3136] animate-pulse" />
              ALL TOOLS LIVE · NO ACCOUNT REQUIRED
            </div>
            <Link href="/inquire" className="text-[#1A1A1A] hover:text-[#FE3136] flex items-center gap-1.5 transition-colors">
              OR TALK TO SHEHRAZ DIRECTLY <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={3} />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Bento Why Us */}
      <section className="border-b-2 border-[#1A1A1A] paper-grain">
        <div className="flex flex-col md:flex-row divide-x-2 divide-[#1A1A1A]">
          <div className="w-full md:w-1/2 p-12 border-b-2 md:border-b-0 border-[#1A1A1A] relative min-h-[500px]">
            <img className="w-full h-full object-cover fussy-cut grayscale" src={STITCH_IMG.factory} alt="Factory" />
            <div className="absolute bottom-20 left-20 bg-[#FE3136] text-white px-8 py-2 red-stamp text-xl font-headline font-black border-2 border-[#1A1A1A]">MADE IN SIALKOT</div>
          </div>
          <div className="w-full md:w-1/2 grid grid-cols-1 md:grid-cols-2 divide-x-2 divide-y-2 divide-[#1A1A1A]">
            {[
              { icon: "lock", h: "Your IP Is Safe", p: "Confidentiality agreement on every order. We don't produce competing designs. We don't share yours. Direct relationship = no leaks." },
              { icon: "forum", h: "Direct Founder Access", p: "WhatsApp. Video calls. No middleman. Shehraz responds within 4 hours. Your questions are his priority." },
              { icon: "trending_up", h: "Start Small, Scale Big", p: "50 pieces to 500+ without switching factories. Same quality. No setup fees. Price drops at every slab tier." },
              { icon: "verified", h: "Ethical Proof, Visible", p: "BSCI, OEKO-TEX, WRAP — all three. Factory transparent. Worker safety verified. Your brand's integrity, protected." },
            ].map((t) => (
              <div key={t.h} className="p-12">
                <span className="material-symbols-outlined text-4xl mb-6 text-[#3E41B6] block">{t.icon}</span>
                <h4 className="text-xl font-headline font-bold uppercase mb-4">{t.h}</h4>
                <p className="text-sm leading-relaxed">{t.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Founder Letter */}
      <section className="border-b-2 border-[#1A1A1A] bg-[#F8F8F8] paper-grain">
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-[#1A1A1A]">
          {/* Left — portrait block */}
          <div className="lg:col-span-5 relative bg-[#1A1A1A] p-10 md:p-14 flex items-center justify-center min-h-[640px] overflow-hidden">
            {/* Giant background numeral */}
            <span className="absolute -bottom-20 -left-10 text-[24rem] font-headline font-black text-white/5 leading-none select-none pointer-events-none">07</span>

            {/* Portrait frame */}
            <div className="relative z-10 w-full max-w-[380px]">
              {/* Offset red block behind */}
              <div className="absolute -inset-4 translate-x-3 translate-y-3 bg-[#FE3136] border-2 border-white/20"></div>

              {/* Photo */}
              <img
                src="/images/generated/founder-shehraz-portrait.jpg"
                alt="Shehraz — Founder, Pak Homies Industry"
                className="relative z-10 w-full aspect-[4/5] object-cover fussy-cut grayscale border-2 border-white"
              />

              {/* Corner stamp */}
              <div className="absolute -top-4 -right-4 z-20 w-24 h-24 bg-white border-2 border-[#1A1A1A] rounded-full flex items-center justify-center red-stamp">
                <div className="text-center">
                  <div className="text-[8px] font-black uppercase tracking-[0.15em] leading-none text-[#FE3136]">EST.</div>
                  <div className="text-[#1A1A1A] text-2xl font-headline font-black leading-none mt-1">2019</div>
                  <div className="text-[7px] font-black uppercase tracking-widest leading-none mt-1 text-[#1A1A1A]">SIALKOT</div>
                </div>
              </div>

              {/* Signature tag */}
              <div className="relative z-20 mt-8 bg-white border-2 border-white p-4 text-[#1A1A1A]">
                <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#FE3136] mb-1">FOUNDER · OWNER · OPERATOR</div>
                <div className="font-headline font-black text-3xl uppercase leading-none">Shehraz</div>
                <div className="text-xs uppercase tracking-widest font-bold text-[#3A3A3A] mt-2">
                  Pak Homies Industry · Airport Rd, Sialkot
                </div>
              </div>
            </div>
          </div>

          {/* Right — founder letter */}
          <div className="lg:col-span-7 p-10 md:p-16 flex flex-col justify-between relative">
            {/* Red corner mark */}
            <div className="absolute top-10 right-10 flex items-center gap-3">
              <span className="h-px w-12 bg-[#FE3136]"></span>
              <span className="text-[#FE3136] text-xs uppercase tracking-[0.2em] font-bold">07 / A LETTER FROM THE FLOOR</span>
            </div>

            <div className="mt-16 lg:mt-0">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-headline font-black uppercase leading-[0.95] tracking-tight mb-10">
                No middlemen.<br />
                <span className="text-[#FE3136]">Just me,</span> the floor,<br />
                and your order.
              </h2>

              <div className="max-w-2xl space-y-5 text-[#1A1A1A] text-lg leading-relaxed">
                <p>
                  I'm Shehraz. I run Pak Homies Industry from our floor on Airport Road in Sialkot — the same floor that's stitched BSCI, OEKO-TEX, and WRAP-certified garments for the past seven years.
                </p>
                <p>
                  When you send an inquiry, it comes to <span className="font-bold">my</span> WhatsApp. When you request a sample, <span className="font-bold">I</span> walk it to the cutting table myself. When you scale from 50 pieces to 500, <span className="font-bold">I</span> allocate the line. No sales agent. No account manager. No telephone game.
                </p>
                <p>
                  We built Pak Homies because Black-owned streetwear founders deserve factory access that other brands pay 3× more for. Same quality. Same certifications. Direct to the person who answers for every stitch.
                </p>
              </div>

              {/* Signature line */}
              <div className="mt-12 flex items-center gap-6">
                <div>
                  <div className="font-headline font-black text-2xl italic text-[#3E41B6] leading-none">— Shehraz</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#3A3A3A] mt-2">FOUNDER, PAK HOMIES INDUSTRY</div>
                </div>
                <div className="h-16 w-px bg-[#1A1A1A]/20"></div>
                <a
                  href="https://wa.me/923285619939"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-4 bg-[#1A1A1A] text-white font-bold uppercase tracking-widest text-xs border-2 border-[#1A1A1A] hover:bg-[#3E41B6] transition-colors"
                >
                  WhatsApp Shehraz →
                </a>
              </div>
            </div>

            {/* Bottom stat strip */}
            <div className="mt-12 grid grid-cols-3 border-2 border-[#1A1A1A] divide-x-2 divide-[#1A1A1A]">
              {[
                ["7+", "Years on the floor"],
                ["4 HRS", "Reply time, guaranteed"],
                ["100%", "Owner-operated"],
              ].map(([v, l]) => (
                <div key={l} className="p-5 text-center bg-white">
                  <div className="font-headline font-black text-2xl md:text-3xl text-[#FE3136] leading-none">{v}</div>
                  <div className="text-[9px] uppercase tracking-widest font-bold text-[#3A3A3A] mt-2">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Process Flow Chart */}
      <section className="bg-[#1A1A1A] py-24 border-b-2 border-[#1A1A1A] relative overflow-hidden">
        {/* Giant background numeral */}
        <div className="absolute top-8 right-8 text-[14rem] font-headline font-black text-white/5 select-none leading-none pointer-events-none">09</div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="mb-20 max-w-3xl">
            <span className="text-[#FE3136] text-xs uppercase tracking-[0.2em] font-bold block mb-4">09 / THE SIX-WEEK PIPELINE</span>
            <h2 className="text-5xl md:text-6xl font-headline font-black uppercase text-white leading-none mb-4">
              From tech pack to <span className="text-[#FE3136]">US port</span> in six weeks.
            </h2>
            <p className="text-white/60 text-lg">Published, guaranteed, tracked at every checkpoint. No vague estimates.</p>
          </div>

          {/* Flow chart */}
          <div className="relative">
            {/* Desktop connector line */}
            <div className="hidden md:block absolute top-[68px] left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-[#3E41B6] via-[#FE3136] to-[#3E41B6]"></div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-4">
              {[
                { day: "DAY 1", title: "Inquiry", Icon: FileText, desc: "You submit tech pack + reference images. We confirm capacity within 4 hours." },
                { day: "DAY 7", title: "Sample", Icon: Scissors, desc: "Physical sample ships. You inspect fit, color, stitching, fabric weight." },
                { day: "WEEK 2", title: "Bulk Start", Icon: Cog, desc: "Approved. Pattern graded, fabric cut, production line allocated." },
                { day: "WEEK 5", title: "QC + Pack", Icon: PackageCheck, desc: "Every unit inspected. Labeled, polybagged, cartoned to your spec." },
                { day: "WEEK 6", title: "Port → US", Icon: Truck, desc: "DDP freight via Karachi port. Arrives at your US warehouse." },
              ].map((step, i) => (
                <div key={step.day} className="relative flex flex-col items-center text-center group">
                  {/* Step number tag */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FE3136] text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 border border-white z-20">
                    0{i + 1}
                  </div>

                  {/* Icon node — layered editorial card */}
                  <div className="relative z-10 w-[140px] h-[140px] mb-6">
                    {/* Offset red shadow block */}
                    <div className="absolute inset-0 translate-x-2 translate-y-2 bg-[#FE3136] border-2 border-white/20 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform"></div>
                    {/* Main icon tile with paper grain + gradient */}
                    <div
                      className="absolute inset-0 border-2 border-white flex items-center justify-center overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, #F8F8F8 0%, #FFFFFF 60%, #E0E0E0 100%)",
                      }}
                    >
                      {/* Corner crop marks */}
                      <span className="absolute top-1.5 left-1.5 w-2 h-2 border-l-2 border-t-2 border-[#1A1A1A]"></span>
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 border-r-2 border-t-2 border-[#1A1A1A]"></span>
                      <span className="absolute bottom-1.5 left-1.5 w-2 h-2 border-l-2 border-b-2 border-[#1A1A1A]"></span>
                      <span className="absolute bottom-1.5 right-1.5 w-2 h-2 border-r-2 border-b-2 border-[#1A1A1A]"></span>
                      {/* Grid pattern overlay */}
                      <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                          backgroundImage:
                            "linear-gradient(#1A1A1A 1px, transparent 1px), linear-gradient(90deg, #1A1A1A 1px, transparent 1px)",
                          backgroundSize: "12px 12px",
                        }}
                      ></div>
                      {/* Giant faded step number in background */}
                      <span className="absolute text-[7rem] font-headline font-black text-[#3E41B6]/10 leading-none select-none">
                        {i + 1}
                      </span>
                      {/* Icon */}
                      <step.Icon
                        strokeWidth={1.5}
                        className="relative z-10 w-14 h-14 text-[#1A1A1A] group-hover:text-[#3E41B6] transition-colors"
                      />
                    </div>
                    {/* Mobile connector arrow */}
                    {i < 4 && (
                      <div className="md:hidden absolute -bottom-10 left-1/2 -translate-x-1/2 text-[#FE3136] text-3xl">↓</div>
                    )}
                    {/* Desktop arrow between nodes */}
                    {i < 4 && (
                      <div className="hidden md:flex absolute top-1/2 -right-[calc(50%-16px)] -translate-y-1/2 text-[#FE3136] items-center text-2xl font-black">
                        →
                      </div>
                    )}
                  </div>

                  {/* Day tag */}
                  <span className="inline-block bg-white text-[#1A1A1A] text-[10px] font-black uppercase tracking-widest px-3 py-1 mb-3 border-2 border-white">
                    {step.day}
                  </span>

                  <h3 className="text-white font-headline font-black uppercase text-2xl mb-3">{step.title}</h3>
                  <p className="text-white/60 text-xs leading-relaxed max-w-[180px]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom stats bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 border-2 border-white/20 divide-x-2 divide-y-2 md:divide-y-0 divide-white/20">
            {[
              ["50–75%", "Faster than competitors"],
              ["4 HRS", "Quote turnaround"],
              ["100%", "Units QC inspected"],
              ["DDP", "Freight included"],
            ].map(([v, l]) => (
              <div key={l} className="p-6 text-center">
                <div className="text-3xl md:text-4xl font-headline font-black text-[#FE3136] mb-1">{v}</div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-white/60">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Certifications */}
      <section className="relative py-28 border-b-2 border-[#1A1A1A] overflow-hidden bg-[#F8F8F8]">
        {/* Parallax doodle pattern */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.08] animate-doodle-drift pointer-events-none"
          style={{
            backgroundImage: "url('/images/streetwear-doodle-pattern.png')",
            backgroundSize: "600px 600px",
            backgroundRepeat: "repeat",
          }}
        />
        {/* Gradient veil for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8F8F8]/85 via-[#F8F8F8]/70 to-[#F8F8F8]/90 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="h-px w-16 bg-[#FE3136]" />
              <span className="text-[#FE3136] text-xs uppercase tracking-[0.3em] font-black">§08 / TRIPLE-CERTIFIED</span>
              <span className="h-px w-16 bg-[#FE3136]" />
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-headline font-black uppercase tracking-tight leading-[0.9]">
              The rarest combination<br />
              <span className="outline-text" style={{ WebkitTextStroke: "2px #FE3136", color: "transparent" }}>in Sialkot</span><span className="text-[#FE3136]">.</span>
            </h2>
            <p className="mt-6 text-sm md:text-base text-[#3A3A3A] max-w-2xl mx-auto">
              Three independent audits. Three separate auditors. All three stacked on one floor —
              <span className="text-[#FE3136] font-bold"> fewer than 5% of Pakistani factories can say the same.</span>
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                logo: "/images/certs/bsci.png",
                badge: "BSCI",
                sub: "Audited annually",
                title: "Fair Labor + Transparency",
                desc: "Annual audits on wages, hours, freedom of association, health, safety, and environment.",
                bullets: ["Fair wages verified", "Safe conditions", "No child labor", "Supply chain transparency"],
                accent: "#3E41B6",
              },
              {
                logo: "/images/certs/oeko-tex.png",
                badge: "OEKO-TEX",
                sub: "Standard 100",
                title: "Chemically Safe Fabrics",
                desc: "Every fabric and finished garment is tested free from harmful chemicals and banned substances.",
                bullets: ["No harmful dyes", "Dermatologically safe", "Consumer-safe", "Environmental compliance"],
                accent: "#2E7D32",
              },
              {
                logo: "/images/certs/wrap.png",
                badge: "WRAP",
                sub: "Gold certified",
                title: "Lawful, Humane, Ethical",
                desc: "Independently verified production under lawful and humane conditions. The global gold standard.",
                bullets: ["Lawful labor", "Humane treatment", "No exploitation", "Community engagement"],
                accent: "#FE3136",
              },
            ].map((c, i) => (
              <div key={c.badge} className="relative group">
                {/* Offset colored shadow block */}
                <div
                  className="absolute inset-0 translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform"
                  style={{ backgroundColor: c.accent }}
                />
                {/* Card */}
                <div className="relative bg-white border-2 border-[#1A1A1A] p-10 flex flex-col h-full overflow-hidden">
                  {/* Decorative corner number */}
                  <span className="absolute -top-6 -right-4 text-[10rem] font-headline font-black text-[#1A1A1A]/[0.04] leading-none select-none pointer-events-none">
                    0{i + 1}
                  </span>

                  {/* Logo with spin-slow ring */}
                  <div className="relative mb-6 w-32 h-32 mx-auto md:mx-0">
                    {/* Rotating dashed ring */}
                    <div
                      className="absolute inset-0 rounded-full border-2 border-dashed animate-spin-slow"
                      style={{ borderColor: c.accent }}
                    />
                    {/* Logo image with float */}
                    <div className="absolute inset-2 rounded-full bg-white border-2 border-[#1A1A1A] flex items-center justify-center overflow-hidden animate-float-y group-hover:scale-105 transition-transform">
                      <img
                        src={c.logo}
                        alt={`${c.badge} certification badge`}
                        className="w-full h-full object-contain p-2"
                        loading="lazy"
                      />
                    </div>
                    {/* Tiny verified stamp */}
                    <div
                      className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-white font-black text-sm shadow-md"
                      style={{ backgroundColor: c.accent }}
                    >
                      ✓
                    </div>
                  </div>

                  {/* Badge name + sub */}
                  <div className="mb-4 relative z-10">
                    <div className="font-headline font-black text-3xl uppercase leading-none" style={{ color: c.accent }}>{c.badge}</div>
                    <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#3A3A3A] mt-1">{c.sub}</div>
                  </div>

                  <h4 className="font-headline font-black uppercase text-xl mb-3 relative z-10">{c.title}</h4>
                  <p className="text-sm leading-relaxed text-[#3A3A3A] mb-6 relative z-10">{c.desc}</p>

                  <ul className="space-y-2.5 mt-auto relative z-10 pt-5 border-t border-[#1A1A1A]/10">
                    {c.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-3 text-xs uppercase font-bold tracking-wider">
                        <span
                          className="w-4 h-4 flex items-center justify-center text-white text-[9px] font-black flex-shrink-0"
                          style={{ backgroundColor: c.accent }}
                        >
                          ✓
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Footer proof bar */}
          <div className="mt-14 relative group">
            <div className="absolute inset-0 bg-[#1A1A1A] translate-x-2 translate-y-2" />
            <div className="relative border-2 border-[#1A1A1A] bg-white p-8 md:p-10 grid grid-cols-1 md:grid-cols-3 items-center gap-6">
              <div className="md:col-span-2">
                <div className="text-[10px] uppercase tracking-[0.3em] font-black text-[#FE3136] mb-2">THE RAREST STACK</div>
                <p className="font-headline font-black text-2xl md:text-4xl uppercase leading-tight">
                  Fewer than <span className="text-[#FE3136]">5%</span> of Pakistani manufacturers hold all three.
                </p>
                <p className="text-xs md:text-sm uppercase tracking-widest font-bold text-[#3A3A3A] mt-3">
                  None of our direct competitors publicly display them.
                </p>
              </div>
              <div className="flex md:justify-end gap-3">
                <div className="bg-[#FE3136] text-white p-5 text-center red-stamp">
                  <div className="text-[9px] uppercase tracking-widest font-black">VERIFIED</div>
                  <div className="font-headline font-black text-3xl leading-none mt-1">3/3</div>
                  <div className="text-[9px] uppercase tracking-widest font-black mt-1">STACKED</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Scrolling Testimonials */}
      {(() => {
        const TESTIMONIALS = [
          { name: "Cameron R.", brand: "Crown Heights Denim", city: "ATLANTA, GA", avatar: "https://i.pravatar.cc/200?img=12", stars: 5, q: "First sample arrived in 7 days — stitching, weight, color all on point. No revisions. We went from 'waiting on the factory' to 'waiting on the drop.'" },
          { name: "Marcus T.", brand: "Third Ward Supply", city: "HOUSTON, TX", avatar: "https://i.pravatar.cc/200?img=33", stars: 5, q: "Direct WhatsApp to Shehraz. Zero gatekeepers. That alone saved us a month of email ping-pong with other factories." },
          { name: "Jada K.", brand: "Westside Index", city: "LOS ANGELES, CA", avatar: "https://i.pravatar.cc/200?img=47", stars: 5, q: "The BSCI + WRAP stack is why our retailer onboarded us in a single call. Compliance paperwork was already there." },
          { name: "Devon A.", brand: "Empire State Club", city: "NEW YORK, NY", avatar: "https://i.pravatar.cc/200?img=52", stars: 5, q: "Slab pricing meant we knew our margin before placing PO. No surprise invoices. No hidden freight. It just worked." },
          { name: "Rae M.", brand: "Motor City Militia", city: "DETROIT, MI", avatar: "https://i.pravatar.cc/200?img=45", stars: 5, q: "We dropped 250 pieces in 6 weeks from tech pack to warehouse. Every seam inspected, every label correct. Unreal." },
          { name: "Terrell W.", brand: "Southside Standard", city: "CHICAGO, IL", avatar: "https://i.pravatar.cc/200?img=59", stars: 5, q: "The 3D customizer let us lock the silhouette before cutting fabric. No wasted sample rounds. Saved us at least $2k." },
          { name: "Bianca L.", brand: "Forever Peachtree", city: "ATLANTA, GA", avatar: "https://i.pravatar.cc/200?img=23", stars: 5, q: "I sent a rough sketch on a Monday. Had a production-ready tech pack in my inbox Tuesday morning. That's the whole game." },
          { name: "Khalil J.", brand: "North Ave Goods", city: "BALTIMORE, MD", avatar: "https://i.pravatar.cc/200?img=68", stars: 5, q: "Heavyweight fleece at 500GSM, priced below what US factories quoted us for 380GSM. Same BSCI audit. Done deal." },
        ];

        return (
      <section className="relative border-y-2 border-[#1A1A1A] overflow-hidden">
        {/* Parallax background */}
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-cover scale-110"
          style={{ backgroundImage: "url('/images/testimonial_bg.png')", backgroundAttachment: "fixed" }}
        />
        {/* Dark editorial overlay + grain */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0E]/95 via-[#0A0A0E]/85 to-[#0A0A0E]/95" />
        <div className="absolute inset-0 paper-grain opacity-[0.04] mix-blend-overlay" />
        {/* Red editorial hairline */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#FE3136]" />

        <div className="relative z-10 py-24">
          {/* Editorial header — split layout */}
          <div className="container mx-auto px-6 mb-16">
            <div className="grid grid-cols-12 gap-8 items-end border-b border-white/10 pb-10">
              <div className="col-span-12 md:col-span-8">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-[#FE3136] text-xs uppercase tracking-[0.3em] font-black">§11</span>
                  <span className="h-px flex-1 max-w-[80px] bg-[#FE3136]" />
                  <span className="text-white/60 text-[10px] uppercase tracking-[0.3em] font-bold">FOUNDER DISPATCHES</span>
                </div>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-headline font-black uppercase tracking-tight leading-[0.9] text-white">
                  Shipped with<br />
                  <span className="outline-text" style={{ WebkitTextStroke: "2px #FE3136", color: "transparent" }}>receipts</span> <span className="text-[#FE3136]">.</span>
                </h2>
                <p className="text-white/60 text-sm md:text-base mt-6 max-w-xl leading-relaxed">
                  Unfiltered notes from the founders running the brands — straight off WhatsApp, straight to press.
                </p>
              </div>
              <div className="col-span-12 md:col-span-4 flex md:justify-end">
                <div className="bg-[#FE3136] text-white p-6 border-2 border-white/10 stamp-rotate inline-block">
                  <div className="text-[9px] uppercase tracking-[0.3em] font-black opacity-80">TRUSTED BY</div>
                  <div className="font-headline font-black text-5xl leading-none mt-1">48+</div>
                  <div className="text-[9px] uppercase tracking-[0.3em] font-black mt-1">US FOUNDERS</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrolling marquee — single row */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#0A0A0E] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#0A0A0E] to-transparent z-10 pointer-events-none" />

            <div className="flex gap-8 animate-marquee whitespace-nowrap" style={{ width: "max-content" }}>
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div
                  key={i}
                  className="w-[460px] flex-shrink-0 whitespace-normal relative group"
                >
                  {/* Offset red shadow block */}
                  <div className="absolute inset-0 bg-[#FE3136] translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" />
                  {/* Card */}
                  <div className="relative bg-[#F8F8F8] border-2 border-[#1A1A1A] p-8 min-h-[340px] flex flex-col">
                    {/* Header strip */}
                    <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#1A1A1A]/20">
                      <div className="flex gap-0.5">
                        {Array.from({ length: t.stars }).map((_, si) => (
                          <span key={si} className="text-[#FE3136] text-base">★</span>
                        ))}
                      </div>
                      <span className="text-[9px] uppercase tracking-[0.25em] font-black text-[#3A3A3A]">
                        DISPATCH № {String(i % TESTIMONIALS.length + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Giant quote mark */}
                    <span className="absolute top-14 right-6 text-[#FE3136]/15 font-headline font-black leading-none pointer-events-none select-none" style={{ fontSize: "140px" }}>
                      "
                    </span>

                    {/* Quote */}
                    <p className="font-headline font-bold text-lg leading-snug relative z-10 flex-1 text-[#1A1A1A]">
                      "{t.q}"
                    </p>

                    {/* Attribution row */}
                    <div className="flex items-center gap-4 pt-5 mt-5 border-t-2 border-[#1A1A1A] relative z-10">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-14 h-14 rounded-full border-2 border-[#1A1A1A] object-cover grayscale group-hover:grayscale-0 transition-all"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-headline font-black uppercase text-base truncate text-[#1A1A1A]">{t.name}</div>
                        <div className="text-[10px] uppercase tracking-widest font-black text-[#FE3136] truncate">{t.brand}</div>
                        <div className="text-[9px] uppercase tracking-widest font-bold text-[#767685] mt-0.5">{t.city}</div>
                      </div>
                      <div className="w-10 h-10 border-2 border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] font-black text-lg group-hover:bg-[#FE3136] group-hover:text-white group-hover:border-[#FE3136] transition-colors">
                        →
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom proof strip */}
          <div className="container mx-auto px-6 mt-16">
            <div className="grid grid-cols-2 md:grid-cols-4 border-2 border-white/20 divide-x divide-white/10 bg-black/30 backdrop-blur-sm">
              {[
                { k: "4.9/5", v: "AVG RATING" },
                { k: "48+", v: "ACTIVE BRANDS" },
                { k: "6 WKS", v: "AVG LEAD TIME" },
                { k: "0", v: "MIDDLEMEN" },
              ].map((s) => (
                <div key={s.v} className="p-6 text-center">
                  <div className="font-headline font-black text-3xl md:text-4xl text-white leading-none">{s.k}</div>
                  <div className="text-[10px] uppercase tracking-[0.25em] font-bold text-white/50 mt-2">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      );
      })()}

      {/* 12. Geo Grid */}
      <section className="border-b-2 border-[#1A1A1A]">
        <div className="p-6 bg-[#EEEEEE] border-b-2 border-[#1A1A1A]">
          <h2 className="text-xs font-bold uppercase tracking-[0.5em] text-center">FOUNDERS IN: US STREETWEAR CAPITALS</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x-2 divide-y-2 lg:divide-y-0 divide-[#1A1A1A]">
          {[
            { name: "Atlanta", tag: "ATL", img: "/images/cities/atlanta.png" },
            { name: "Houston", tag: "HOU", img: "/images/cities/houston.png" },
            { name: "Los Angeles", tag: "LAX", img: "/images/cities/los-angeles.png" },
            { name: "New York", tag: "NYC", img: "/images/cities/new-york.png" },
            { name: "Detroit", tag: "DTW", img: "/images/cities/detroit.png" },
            { name: "Chicago", tag: "CHI", img: "/images/cities/chicago.png" },
          ].map((c) => (
            <Link
              key={c.name}
              href={`/streetwear-manufacturer-${c.name.toLowerCase().replace(" ", "-")}`}
              className="relative overflow-hidden min-h-[240px] block group bg-[#1A1A1A]"
            >
              {/* Background image with zoom-on-hover */}
              <div
                className="absolute inset-0 bg-cover bg-center grayscale group-hover:grayscale-0 scale-100 group-hover:scale-110 transition-all duration-700 ease-out"
                style={{ backgroundImage: `url(${c.img})` }}
              ></div>
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/60 to-[#1A1A1A]/20 group-hover:from-[#3E41B6]/80 group-hover:via-[#1A1A1A]/40 transition-all duration-500"></div>

              {/* Airport tag top-left */}
              <span className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/70 border border-white/30 px-2 py-0.5 group-hover:border-[#FE3136] group-hover:text-[#FE3136] transition-colors">
                {c.tag}
              </span>

              {/* City name */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <span className="font-headline font-black text-2xl uppercase text-white tracking-tight leading-none transition-transform duration-500 group-hover:-translate-y-1">
                  {c.name}
                </span>
                <span className="material-symbols-outlined text-[#FE3136] text-2xl transition-all duration-500 group-hover:-translate-y-2 group-hover:rotate-12">
                  location_on
                </span>
              </div>

              {/* Bottom reveal bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FE3136] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
            </Link>
          ))}
        </div>
      </section>

      {/* 13. FAQ */}
      <section className="relative py-28 border-b-2 border-[#1A1A1A] paper-grain overflow-hidden">
        {/* Decorative giant outline text */}
        <div className="absolute -top-10 -right-20 pointer-events-none select-none opacity-[0.06]">
          <span className="font-headline font-black text-[22rem] leading-none tracking-tighter outline-text">FAQ.</span>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-12 gap-10 lg:gap-16">
            {/* Left sticky column */}
            <aside className="col-span-12 lg:col-span-4">
              <div className="lg:sticky lg:top-24">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-[#FE3136] text-xs uppercase tracking-[0.3em] font-black">§13</span>
                  <span className="h-px w-16 bg-[#FE3136]" />
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#3A3A3A]">KNOW BEFORE YOU BUY</span>
                </div>
                <h2 className="text-6xl md:text-7xl font-headline font-black uppercase leading-[0.9] tracking-tight mb-6">
                  Ask us<br />
                  <span className="text-[#FE3136]">anything.</span>
                </h2>
                <p className="text-[#3A3A3A] text-base leading-relaxed mb-8 max-w-sm">
                  Straight answers from the founder — no sales team, no runaround. If your question isn't here, WhatsApp Shehraz directly.
                </p>

                {/* Contact card */}
                <a
                  href="https://wa.me/923285619939"
                  target="_blank"
                  rel="noreferrer"
                  className="block relative group"
                >
                  <div className="absolute inset-0 bg-[#FE3136] translate-x-2 translate-y-2 group-hover:translate-x-3 group-hover:translate-y-3 transition-transform" />
                  <div className="relative bg-[#1A1A1A] text-white border-2 border-[#1A1A1A] p-6">
                    <div className="text-[9px] uppercase tracking-[0.3em] font-black text-[#FE3136] mb-2">STILL CURIOUS?</div>
                    <div className="font-headline font-black text-2xl uppercase leading-tight mb-3">WHATSAPP THE FOUNDER</div>
                    <div className="flex items-center gap-3 text-xs uppercase tracking-widest font-bold text-white/60">
                      <span>+92 328 5619939</span>
                      <span className="ml-auto w-8 h-8 border border-white/30 flex items-center justify-center group-hover:bg-[#FE3136] group-hover:border-[#FE3136] transition-colors">→</span>
                    </div>
                  </div>
                </a>

                {/* Quick stats */}
                <div className="mt-8 grid grid-cols-2 gap-0 border-2 border-[#1A1A1A] divide-x-2 divide-[#1A1A1A]">
                  <div className="p-4 bg-white text-center">
                    <div className="font-headline font-black text-2xl text-[#3E41B6] leading-none">&lt; 4H</div>
                    <div className="text-[9px] uppercase tracking-widest font-bold text-[#3A3A3A] mt-2">REPLY TIME</div>
                  </div>
                  <div className="p-4 bg-white text-center">
                    <div className="font-headline font-black text-2xl text-[#3E41B6] leading-none">7 DAYS</div>
                    <div className="text-[9px] uppercase tracking-widest font-bold text-[#3A3A3A] mt-2">FIRST SAMPLE</div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right — FAQ list */}
            <div className="col-span-12 lg:col-span-8">
              {[
                {
                  cat: "PRICING",
                  q: "What's your MOQ?",
                  a: "50 pieces across all garments. No exceptions, no setup fees. If you want to test with 50 and scale to 500 later, we price each tier separately with no penalties.",
                },
                {
                  cat: "TIMELINE",
                  q: "How fast are samples?",
                  a: "7 days standard turnaround. Expedited (3–4 days) available on request. Most customers approve without revisions, so typical sample-to-bulk timeline is 10–14 days total.",
                },
                {
                  cat: "COMPLIANCE",
                  q: "Are you really certified?",
                  a: "Yes — BSCI, OEKO-TEX, and WRAP. All three verified by independent auditors, audited annually. Audit reports available on request. Fewer than 5% of Pakistani manufacturers hold all three.",
                },
                {
                  cat: "FACTORY",
                  q: "Can I visit the factory in Sialkot?",
                  a: "Absolutely. We host founders monthly at our Airport Road, Gansarpur facility. We'll arrange airport pickup and walk you through the entire floor — cutting, stitching, QC, packaging.",
                },
                {
                  cat: "LOGISTICS",
                  q: "Who handles shipping to the US?",
                  a: "We ship DDP to any US port or door. Freight, customs, duties — all bundled in your invoice. No surprise fees, no brokers to chase. Typical ocean transit 18–22 days; air freight 4–6 days for rush drops.",
                },
                {
                  cat: "DESIGN",
                  q: "Do I need a tech pack to start?",
                  a: "Nope. Send a sketch, a Pinterest board, or a reference garment — we'll build the tech pack for you inside 24 hours using our generator. Free on first order.",
                },
              ].map(({ cat, q, a }, idx) => (
                <details
                  key={q}
                  className="group relative border-2 border-[#1A1A1A] bg-white hover:bg-[#FAFAFA] mb-4 open:bg-white open:shadow-[6px_6px_0_0_#FE3136] transition-all"
                >
                  <summary className="flex items-center gap-6 p-6 md:p-7 list-none cursor-pointer">
                    {/* Number */}
                    <div className="flex-shrink-0 w-12 h-12 border-2 border-[#1A1A1A] flex items-center justify-center font-headline font-black text-lg group-open:bg-[#FE3136] group-open:text-white group-open:border-[#FE3136] transition-colors">
                      {String(idx + 1).padStart(2, "0")}
                    </div>

                    {/* Text block */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] uppercase tracking-[0.3em] font-black text-[#FE3136] mb-1.5">{cat}</div>
                      <h4 className="font-headline font-black uppercase text-lg md:text-xl leading-tight text-[#1A1A1A]">{q}</h4>
                    </div>

                    {/* Toggle icon — pure CSS, single element rotating */}
                    <div className="flex-shrink-0 relative w-10 h-10 border-2 border-[#1A1A1A] flex items-center justify-center group-open:bg-[#1A1A1A] transition-colors">
                      <span className="block w-4 h-0.5 bg-[#1A1A1A] group-open:bg-white absolute transition-colors" />
                      <span className="block w-4 h-0.5 bg-[#1A1A1A] group-open:bg-white absolute rotate-90 group-open:rotate-0 transition-transform" />
                    </div>
                  </summary>

                  {/* Answer body */}
                  <div className="px-6 md:px-7 pb-7 pl-[88px] md:pl-[104px]">
                    <div className="border-l-2 border-[#FE3136] pl-5">
                      <p className="text-sm md:text-base leading-relaxed text-[#3A3A3A]">{a}</p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 14. ESG Ribbon */}
      <section className="bg-[#FE3136] py-6 border-b-2 border-[#1A1A1A] overflow-hidden">
        <div className="container mx-auto px-6 flex flex-wrap justify-between items-center gap-8">
          <span className="text-white font-headline font-black text-2xl uppercase italic">Ethical by default.</span>
          <div className="flex flex-wrap gap-12">
            {[
              ["energy_savings_leaf", "Solar Powered Floor"],
              ["payments", "Living Wage Certified"],
              ["recycling", "Zero-Waste Cutting"],
            ].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2 text-white font-bold uppercase text-xs">
                <span className="material-symbols-outlined">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. Final CTA */}
      <section className="py-40 border-b-2 border-[#1A1A1A] paper-grain relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <span className="text-[25vw] font-headline font-black text-[#1A1A1A] outline-text tracking-tighter leading-none">PAK HOMIES</span>
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-7xl md:text-[9rem] font-headline font-black leading-none uppercase mb-12">Let's build your next drop.</h2>
          <Link href="/inquire" className="inline-block px-20 py-8 bg-[#3E41B6] text-white text-2xl font-bold uppercase tracking-[0.2em] border-4 border-[#1A1A1A] hover:translate-x-2 hover:translate-y-2 transition-transform">
            INQUIRE NOW
          </Link>
        </div>
      </section>
    </main>
  );
}
