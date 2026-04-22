import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] w-full py-20 px-10 border-t-4 border-[#3E41B6] grid grid-cols-1 md:grid-cols-4 gap-12">
      <div>
        <div className="text-4xl font-black text-[#F8F8F8] mb-8">PAK HOMIES</div>
        <p className="text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em] mb-4 leading-relaxed">
          TACTICAL EDITORIAL MANUFACTURING.<br />
          SIALKOT, PUNJAB.
        </p>
        <div className="flex gap-4">
          <span className="w-8 h-8 border border-white/20 flex items-center justify-center text-white text-xs">IG</span>
          <span className="w-8 h-8 border border-white/20 flex items-center justify-center text-white text-xs">TW</span>
          <span className="w-8 h-8 border border-white/20 flex items-center justify-center text-white text-xs">LI</span>
        </div>
      </div>
      <div>
        <h5 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">EXPLORE</h5>
        <ul className="space-y-4">
          <li><Link href="/customize" className="text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em] hover:text-[#3E41B6]">3D CUSTOMIZER</Link></li>
          <li><Link href="/capabilities/label-studio" className="text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em] hover:text-[#3E41B6]">LABEL STUDIO</Link></li>
          <li><Link href="/capabilities/techpack" className="text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em] hover:text-[#3E41B6]">TECH PACK GEN</Link></li>
          <li><Link href="/products" className="text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em] hover:text-[#3E41B6]">PRODUCTS</Link></li>
        </ul>
      </div>
      <div>
        <h5 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">FACTORY</h5>
        <ul className="space-y-4">
          <li><Link href="/why-pak-homies" className="text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em] hover:text-[#3E41B6]">WHY PAK HOMIES</Link></li>
          <li><Link href="/certifications" className="text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em] hover:text-[#3E41B6]">CERTIFICATIONS</Link></li>
          <li><Link href="/process" className="text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em] hover:text-[#3E41B6]">PROCESS</Link></li>
        </ul>
      </div>
      <div>
        <h5 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">CONTACT</h5>
        <p className="text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em] leading-relaxed">
          AIRPORT ROAD, GANSARPUR<br />
          SIALKOT, PUNJAB 51310<br /><br />
          PAKHOMIESI@GMAIL.COM<br />
          WHATSAPP +92 328 5619939
        </p>
      </div>
      <div className="md:col-span-4 pt-12 border-t border-white/10 text-center">
        <span className="text-[#E0E0E0] uppercase text-[12px] tracking-[0.1em]">©2026 PAK HOMIES INDUSTRY. ALL RIGHTS RESERVED. · <Link href="/privacy" className="hover:text-white">PRIVACY</Link> · <Link href="/terms" className="hover:text-white">TERMS</Link></span>
      </div>
    </footer>
  );
}
