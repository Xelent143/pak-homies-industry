import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Menu, X, ArrowUpRight, Zap } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/shop", label: "SHOP" },
    { to: "/services", label: "SERVICES" },
    { to: "/products", label: "MANUFACTURING" },
    { to: "/customize", label: "CUSTOMIZER" },
    { to: "/capabilities/label-studio", label: "LABEL STUDIO" },
    { to: "/capabilities/techpack", label: "TECH PACKS" },
  ];

  const isActive = (to: string) => location === to || (to !== "/" && location.startsWith(to));

  return (
    <>
      {/* TOP TICKER STRIP */}
      <div className="fixed top-0 left-0 w-full z-[60] bg-[#1A1A1A] text-white h-7 overflow-hidden border-b border-[#FE3136]/40">
        <div className="flex animate-marquee whitespace-nowrap text-[10px] tracking-[0.3em] font-bold uppercase h-full items-center">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="mx-6 inline-flex items-center gap-2">
              <Zap size={11} className="text-[#FE3136]" /> MOQ 50 PIECES
              <span className="text-[#FE3136] mx-3">★</span> 7-DAY SAMPLES
              <span className="text-[#FE3136] mx-3">★</span> BSCI · OEKO-TEX · WRAP CERTIFIED
              <span className="text-[#FE3136] mx-3">★</span> FREE FREIGHT TO USA PORT
              <span className="text-[#FE3136] mx-3">★</span> DIRECT FOUNDER WHATSAPP
              <span className="text-[#FE3136] mx-3">★</span>
            </span>
          ))}
        </div>
      </div>

      {/* NAVBAR */}
      <nav
        className={`fixed top-7 left-0 w-full z-50 transition-all duration-300 border-b-2 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md border-[#1A1A1A] shadow-[0_2px_0_0_#FE3136] h-14"
            : "bg-[#F8F8F8]/90 backdrop-blur-sm border-[#1A1A1A] h-16"
        }`}
      >
        <div className="container mx-auto h-full px-6 flex justify-between items-center">
          {/* LOGO */}
          <Link href="/" className="group flex items-center gap-2 relative">
            <div className="relative">
              <span className="text-2xl font-black tracking-tighter text-[#1A1A1A] leading-none">PAK</span>
              <span className="text-2xl font-black tracking-tighter text-[#FE3136] leading-none">HOMIES</span>
              <span className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-[#FE3136] rounded-full animate-glow-pulse" />
            </div>
            <span className="hidden sm:block text-[8px] uppercase tracking-[0.2em] text-[#767685] font-bold border-l border-[#1A1A1A] pl-2 leading-tight">
              Sialkot<br />Streetwear<br />MFG.
            </span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex gap-1 items-center">
            {links.map((l) => {
              const active = isActive(l.to);
              return (
                <Link
                  key={l.to}
                  href={l.to}
                  className={`group relative font-headline uppercase tracking-widest font-bold text-[11px] px-3 py-2 transition-colors duration-200 ${
                    active ? "text-[#FE3136]" : "text-[#1A1A1A] hover:text-[#FE3136]"
                  }`}
                >
                  <span className="relative z-10">{l.label}</span>
                  {/* Active dot */}
                  {active && (
                    <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FE3136] rounded-full" />
                  )}
                  {/* Hover underline */}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#FE3136] transition-all duration-300 ${
                      active ? "w-6" : "w-0 group-hover:w-6"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="/inquire"
              className="hidden sm:inline-flex items-center gap-2 group relative bg-[#FE3136] text-white px-5 py-2.5 font-bold uppercase tracking-widest text-[11px] border-2 border-[#1A1A1A] overflow-hidden transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0_0_#1A1A1A]"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              <span className="relative">Start Batch</span>
              <ArrowUpRight size={14} className="relative transition-transform group-hover:rotate-45" />
            </Link>
            <button
              className="lg:hidden text-[#1A1A1A] border-2 border-[#1A1A1A] p-1.5"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="lg:hidden fixed top-[5.25rem] left-0 w-full z-40 bg-[#1A1A1A] border-b-2 border-[#FE3136] flex flex-col animate-slide-up">
          {links.map((l, i) => {
            const active = isActive(l.to);
            return (
              <Link
                key={l.to}
                href={l.to}
                onClick={() => setOpen(false)}
                className={`group flex items-center justify-between px-6 py-4 font-headline font-bold uppercase tracking-widest text-base border-b border-white/10 transition-colors ${
                  active ? "bg-[#FE3136] text-white" : "text-white hover:bg-[#3E41B6]"
                }`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="flex items-center gap-3">
                  <span className="text-[#FE3136] text-[10px] group-hover:text-white">0{i + 1}</span>
                  {l.label}
                </span>
                <ArrowUpRight size={16} className="opacity-50 group-hover:opacity-100 group-hover:rotate-45 transition" />
              </Link>
            );
          })}
          <Link
            href="/inquire"
            onClick={() => setOpen(false)}
            className="px-6 py-5 bg-[#FE3136] text-white font-bold uppercase tracking-widest text-center inline-flex items-center justify-center gap-2"
          >
            START BATCH <ArrowUpRight size={16} />
          </Link>
        </div>
      )}
    </>
  );
}
