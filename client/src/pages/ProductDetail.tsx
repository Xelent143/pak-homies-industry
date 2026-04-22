import { Link, useParams } from "wouter";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  Truck,
  ShieldCheck,
  Clock,
  Package,
  MessageCircle,
  Download,
  Star,
  Factory,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { getProduct } from "@/data/products";
import NotFound from "./NotFound";

export default function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const product = getProduct(params.slug ?? "");

  const [activeImg, setActiveImg] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSlab, setSelectedSlab] = useState(1);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!product) return <NotFound />;

  const gallery = product.gallery.length ? product.gallery : [product.img];
  const currentSlab = product.slabPricing[selectedSlab] ?? product.slabPricing[0];

  const faqs = [
    { q: "What is the minimum order quantity?", a: "Our MOQ is 50 pieces per design / colorway. We can split across sizes within the same design at no extra cost." },
    { q: "How long does production take?", a: "Sample in 7 days. Bulk production in 15 days from approved sample. Sea freight to USA port adds 25–30 days; air freight 5–7 days." },
    { q: "Can I get a sample before bulk?", a: "Yes. Pre-production samples are $80–$150 depending on the garment, fully credited back to your bulk order." },
    { q: "What's included in the price?", a: "Cutting, sewing, finishing, woven main label, hangtag, polybag, and freight to your USA port. No hidden fees." },
    { q: "Do you handle custom labels and packaging?", a: "Yes. Woven labels, neck prints, hangtags, custom polybags, and branded mailers — all in-house." },
  ];

  return (
    <>
      {/* ── HERO ── */}
      <section className="bg-[#0A0A0E] text-white relative overflow-hidden">
        <div className="absolute inset-0 paper-grain opacity-[0.04] pointer-events-none" />
        <div className="container-page py-10 lg:py-14">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs ribbon-text text-white/50 mb-8">
            <Link href="/" className="hover:text-[#FE3136]">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[#FE3136]">Products</Link>
            <span>/</span>
            <span className="text-white/80">{product.category}</span>
            <span>/</span>
            <span className="text-[#FE3136]">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            {/* ── GALLERY ── */}
            <div className="lg:col-span-7">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-white/10 bg-[#14141A]">
                <img src={gallery[activeImg]} alt={product.name} className="w-full h-full object-cover animate-ken-burns" />
                {/* Stamps */}
                <div className="absolute top-5 left-5 flex flex-col gap-2">
                  <div className="bg-[#FE3136] text-white px-3 py-1.5 ribbon-text text-[10px] rounded">★ FACTORY DIRECT</div>
                  {product.freeShipping && (
                    <div className="bg-white text-[#1A1A1A] px-3 py-1.5 ribbon-text text-[10px] rounded inline-flex items-center gap-1">
                      <Truck size={12} /> FREE FREIGHT
                    </div>
                  )}
                </div>
                <div className="absolute top-5 right-5 w-20 h-20 rounded-full bg-[#FE3136] text-white flex flex-col items-center justify-center font-display text-center red-stamp shadow-2xl">
                  <span className="text-[10px] ribbon-text leading-none">MOQ</span>
                  <span className="text-2xl leading-none mt-1">50</span>
                  <span className="text-[9px] mt-0.5">PIECES</span>
                </div>
              </div>

              {/* Thumbs */}
              {gallery.length > 1 && (
                <div className="mt-3 grid grid-cols-5 gap-3">
                  {gallery.map((g, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`aspect-square overflow-hidden rounded border-2 transition ${
                        activeImg === i ? "border-[#FE3136]" : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <img src={g} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Trust strip under gallery */}
              <div className="mt-5 grid grid-cols-4 gap-2 text-center">
                {[
                  { icon: ShieldCheck, label: "BSCI" },
                  { icon: ShieldCheck, label: "OEKO-TEX" },
                  { icon: ShieldCheck, label: "WRAP" },
                  { icon: Factory, label: "Own Floor" },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="border border-white/10 rounded p-2 text-[10px] ribbon-text text-white/70">
                    <Icon size={14} className="mx-auto mb-1 text-[#5A5DCB]" />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* ── BUY BOX ── */}
            <div className="lg:col-span-5">
              <div className="ribbon-text text-[#5A5DCB]">{product.category}</div>
              <h1 className="font-display text-4xl md:text-5xl mt-3 leading-[1.05]">{product.name}</h1>
              <p className="text-white/70 mt-4 text-lg leading-relaxed">{product.tagline}</p>

              {/* Rating */}
              <div className="mt-4 flex items-center gap-2 text-sm">
                <div className="flex text-[#FE3136]">
                  {[1, 2, 3, 4, 5].map((i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <span className="text-white/60">4.9 / 5 · 247 buyers · 1.2M units shipped</span>
              </div>

              {/* Price block */}
              <div className="mt-6 p-5 bg-gradient-to-br from-[#14141A] to-[#1A1A22] border border-white/10 rounded-lg">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="ribbon-text text-white/50 text-[10px]">YOUR PRICE</div>
                    <div className="font-display text-5xl text-white mt-1">
                      ${currentSlab.price.toFixed(2)}
                      <span className="text-base text-white/50 font-sans font-normal ml-2">/ unit</span>
                    </div>
                  </div>
                  {currentSlab.savings !== "—" && (
                    <div className="bg-[#FE3136]/15 border border-[#FE3136]/40 text-[#FE3136] px-3 py-1.5 rounded ribbon-text text-xs">
                      SAVE {currentSlab.savings}
                    </div>
                  )}
                </div>
                <div className="mt-2 text-xs text-white/50">at {currentSlab.qty} pieces · all-in landed USA</div>

                {/* Slab selector */}
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {product.slabPricing.map((slab, i) => (
                    <button
                      key={slab.qty}
                      onClick={() => setSelectedSlab(i)}
                      className={`px-2 py-2 rounded text-center transition ${
                        selectedSlab === i
                          ? "bg-[#FE3136] text-white border border-[#FE3136]"
                          : "bg-white/5 text-white/70 border border-white/10 hover:border-white/30"
                      }`}
                    >
                      <div className="text-[10px] ribbon-text opacity-80">{slab.qty}</div>
                      <div className="font-display text-base mt-0.5">${slab.price.toFixed(0)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size selector */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <div className="ribbon-text text-white/50 text-[10px]">SIZE RANGE</div>
                  <a href="#size-chart" className="text-[10px] ribbon-text text-[#5A5DCB] hover:text-white">SIZE CHART →</a>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.availableSizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[44px] px-3 py-2 rounded border text-sm font-semibold transition ${
                        selectedSize === s
                          ? "bg-white text-[#1A1A1A] border-white"
                          : "bg-transparent text-white border-white/20 hover:border-white/60"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color swatches */}
              <div className="mt-5">
                <div className="ribbon-text text-white/50 text-[10px]">
                  COLORWAY {selectedColor && <span className="text-white normal-case ml-1 tracking-normal">— {selectedColor}</span>}
                </div>
                <div className="mt-2 flex flex-wrap gap-3">
                  {product.availableColors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      title={c.name}
                      className={`w-10 h-10 rounded-full border-2 transition ${
                        selectedColor === c.name ? "border-[#FE3136] scale-110" : "border-white/30 hover:border-white/70"
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>

              {/* CTAs */}
              <div className="mt-7 space-y-3">
                <Link
                  href="/inquire"
                  className="w-full px-6 py-4 bg-[#FE3136] hover:bg-[#FF4A4F] font-display text-lg rounded inline-flex items-center justify-center gap-2 animate-glow-pulse"
                >
                  Get Instant Quote <ArrowRight size={18} />
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/customize" className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 font-semibold text-sm rounded inline-flex items-center justify-center gap-2">
                    <Sparkles size={14} /> Customize 3D
                  </Link>
                  <a href="https://wa.me/923000000000" className="px-4 py-3 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-semibold text-sm rounded inline-flex items-center justify-center gap-2">
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                </div>
              </div>

              {/* Mini benefits */}
              <ul className="mt-6 space-y-2 text-sm text-white/80">
                {[
                  [Clock, "Sample in 7 days · Bulk in 15 days"],
                  [Package, "$80 sample fee · credited to bulk"],
                  [Truck, "Free freight to USA port included"],
                  [ShieldCheck, "100% inspection · re-make guarantee"],
                ].map(([Icon, txt], i) => (
                  <li key={i} className="flex items-center gap-3">
                    <Icon size={16} className="text-[#5A5DCB] shrink-0" />
                    {txt as string}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE TRUST RIBBON ── */}
      <div className="bg-[#FE3136] text-white py-3 overflow-hidden border-y border-[#FE3136]">
        <div className="flex animate-marquee whitespace-nowrap ribbon-text text-xs">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="mx-8 inline-flex items-center gap-2">
              FACTORY DIRECT · NO MIDDLEMEN ★ BSCI · OEKO-TEX · WRAP CERTIFIED ★ 1.2M UNITS SHIPPED ★ SAMPLE IN 7 DAYS ★
            </span>
          ))}
        </div>
      </div>

      {/* ── DESCRIPTION + KEY FEATURES ── */}
      <section className="container-page py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7">
            <div className="ribbon-text text-[#FE3136]">The Build</div>
            <h2 className="font-display text-4xl md:text-5xl mt-3 leading-[1.05]">
              Built like our team's <span className="text-[#3E41B6]">own wardrobe.</span>
            </h2>
            <p className="mt-6 text-lg text-[#333] leading-relaxed">{product.description}</p>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#F8F8F8] border border-[#E0E0E0] rounded-lg p-6">
              <div className="ribbon-text text-[#3E41B6] mb-4">Customization Options</div>
              <ul className="space-y-3">
                {product.customizations.map((c) => (
                  <li key={c} className="flex items-start gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-[#3E41B6] text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={12} />
                    </div>
                    <span className="text-[#1A1A1A]">{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPECS GRID ── */}
      <section className="bg-[#0A0A0E] text-white py-20">
        <div className="container-page">
          <div className="ribbon-text text-[#FE3136]">Tech Specs</div>
          <h2 className="font-display text-4xl mt-3">The receipts</h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { label: "Fabric", value: product.fabric },
              { label: "Weight", value: product.weight },
              { label: "Sizes", value: product.availableSizes.join(" · ") },
              { label: "Colors", value: `${product.availableColors.length} stock + custom` },
            ].map((spec) => (
              <div key={spec.label} className="bg-[#14141A] border border-white/10 rounded-lg p-5">
                <div className="ribbon-text text-[#5A5DCB] text-[10px]">{spec.label}</div>
                <div className="font-display text-xl mt-2 text-white leading-tight">{spec.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIZE CHART ── */}
      <section id="size-chart" className="bg-[#F8F8F8] py-20">
        <div className="container-page max-w-5xl">
          <div className="ribbon-text text-[#3E41B6]">Size chart</div>
          <h2 className="font-display text-4xl mt-3">Measurements (inches)</h2>
          <p className="text-sm text-[#555] mt-2">Tolerance ±0.5". Custom blocks available on orders 200+.</p>
          <div className="mt-8 overflow-x-auto bg-white border border-[#E0E0E0] rounded-lg">
            <table className="w-full text-left">
              <thead className="bg-[#1A1A1A] text-white">
                <tr>
                  <th className="p-4 text-xs uppercase tracking-widest">Size</th>
                  <th className="p-4 text-xs uppercase tracking-widest">Chest</th>
                  <th className="p-4 text-xs uppercase tracking-widest">Length</th>
                  <th className="p-4 text-xs uppercase tracking-widest">Sleeve</th>
                  <th className="p-4 text-xs uppercase tracking-widest">Waist</th>
                </tr>
              </thead>
              <tbody>
                {product.sizeChart.map((r, i) => (
                  <tr key={r.size} className={i % 2 ? "bg-[#F8F8F8]" : ""}>
                    <td className="p-4 font-display text-lg text-[#3E41B6]">{r.size}</td>
                    <td className="p-4 text-sm">{r.chest}</td>
                    <td className="p-4 text-sm">{r.length}</td>
                    <td className="p-4 text-sm">{r.sleeve ?? "—"}</td>
                    <td className="p-4 text-sm">{r.waist ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── PRICING LADDER ── */}
      <section className="container-page py-20">
        <div className="text-center max-w-2xl mx-auto">
          <div className="ribbon-text text-[#FE3136]">Volume = Savings</div>
          <h2 className="font-display text-4xl md:text-5xl mt-3">The more you order, <br /><span className="text-[#3E41B6]">the less you pay.</span></h2>
        </div>
        <div className="mt-12 grid md:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {product.slabPricing.map((slab, i) => {
            const isPopular = i === 2;
            return (
              <div
                key={slab.qty}
                className={`relative p-6 rounded-lg border-2 transition ${
                  isPopular ? "border-[#FE3136] bg-[#FE3136]/5 scale-105 shadow-xl" : "border-[#E0E0E0] bg-white"
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#FE3136] text-white px-3 py-1 ribbon-text text-[10px] rounded">
                    MOST POPULAR
                  </div>
                )}
                <div className="ribbon-text text-[#555] text-[10px]">{slab.qty} PIECES</div>
                <div className="font-display text-5xl mt-3 text-[#1A1A1A]">${slab.price.toFixed(2)}</div>
                <div className="text-xs text-[#555] mt-1">per unit · landed</div>
                {slab.savings !== "—" && (
                  <div className="mt-4 inline-block bg-[#3E41B6] text-white px-3 py-1 ribbon-text text-[10px] rounded">
                    SAVE {slab.savings}
                  </div>
                )}
                <Link
                  href="/inquire"
                  className={`mt-5 w-full py-3 rounded font-semibold text-sm inline-flex items-center justify-center gap-1 ${
                    isPopular ? "bg-[#FE3136] text-white hover:bg-[#FF4A4F]" : "bg-[#1A1A1A] text-white hover:bg-[#3E41B6]"
                  }`}
                >
                  Quote this <ArrowRight size={14} />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── MANUFACTURING STORY ── */}
      <section className="bg-[#1A1A1A] text-white py-20 relative overflow-hidden">
        <div className="container-page grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="aspect-[4/3] overflow-hidden rounded-lg border border-white/10">
            <img src={product.manufacturingInfographic} alt="Manufacturing process" className="w-full h-full object-cover animate-ken-burns" />
          </div>
          <div>
            <div className="ribbon-text text-[#FE3136]">Made in Sialkot</div>
            <h2 className="font-display text-4xl md:text-5xl mt-3 leading-[1.05]">From our floor <br />to your label.</h2>
            <p className="mt-6 text-lg text-white/75 leading-relaxed">{product.manufacturingStory}</p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[["50+", "Sewing lines"], ["07d", "Sample lead"], ["1.2M", "Units shipped"]].map(([k, v]) => (
                <div key={k} className="border border-white/15 p-4 rounded">
                  <div className="font-display text-3xl text-[#FE3136]">{k}</div>
                  <div className="ribbon-text text-white/60 text-[10px] mt-1">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="container-page py-20 max-w-4xl">
        <div className="text-center">
          <div className="ribbon-text text-[#FE3136]">FAQ</div>
          <h2 className="font-display text-4xl mt-3">Questions buyers ask before they pull the trigger.</h2>
        </div>
        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => (
            <button
              key={i}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full text-left bg-[#F8F8F8] border border-[#E0E0E0] rounded-lg p-5 hover:border-[#3E41B6] transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-display text-sm shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="font-display text-lg text-[#1A1A1A] pt-1">{f.q}</div>
                </div>
                <ChevronDown
                  size={20}
                  className={`text-[#3E41B6] shrink-0 transition-transform mt-2 ${openFaq === i ? "rotate-180" : ""}`}
                />
              </div>
              {openFaq === i && <div className="mt-4 ml-12 text-[#444] leading-relaxed">{f.a}</div>}
            </button>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="bg-[#FE3136] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 paper-grain opacity-10" />
        <div className="container-page text-center relative z-10">
          <div className="ribbon-text text-white/80">Ready when you are</div>
          <h2 className="font-display text-5xl md:text-7xl mt-4 leading-[0.95]">
            Get your {product.name.toLowerCase()} <br />quoted in <span className="outline-text" style={{ WebkitTextStroke: "2px #fff" }}>4 hours.</span>
          </h2>
          <p className="mt-6 text-white/90 text-lg max-w-2xl mx-auto">
            Drop your specs, we send back tech pack, lead time, and landed USA pricing — same day, no sales calls.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link href="/inquire" className="px-8 py-4 bg-white text-[#FE3136] font-display text-lg rounded hover:bg-[#1A1A1A] hover:text-white transition inline-flex items-center gap-2">
              Get My Quote <ArrowRight size={18} />
            </Link>
            <a href="/tech-pack-template.pdf" className="px-8 py-4 border-2 border-white text-white font-display text-lg rounded hover:bg-white hover:text-[#FE3136] transition inline-flex items-center gap-2">
              <Download size={18} /> Tech Pack Template
            </a>
          </div>
        </div>
      </section>

      {/* ── STICKY MOBILE CTA ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0E] border-t border-white/10 p-3 flex items-center gap-3">
        <div className="flex-1">
          <div className="text-[10px] ribbon-text text-white/50">FROM</div>
          <div className="font-display text-xl text-white leading-none">${product.slabPricing[product.slabPricing.length - 1].price.toFixed(2)}<span className="text-xs text-white/50 ml-1">/unit</span></div>
        </div>
        <Link href="/inquire" className="px-5 py-3 bg-[#FE3136] text-white font-display rounded inline-flex items-center gap-2">
          Get Quote <ArrowRight size={16} />
        </Link>
      </div>
    </>
  );
}
