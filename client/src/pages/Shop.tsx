import { Link } from "wouter";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search, Truck, Filter, X } from "lucide-react";
import { PRODUCTS } from "@/data/products";

const ALL = "All";

export default function Shop() {
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    PRODUCTS.forEach((p) => { counts[p.category] = (counts[p.category] ?? 0) + 1; });
    return [{ name: ALL, count: PRODUCTS.length }, ...Object.entries(counts).map(([name, count]) => ({ name, count }))];
  }, []);

  const [active, setActive] = useState(ALL);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"featured" | "price-asc" | "price-desc">("featured");
  const [mobileOpen, setMobileOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => active === ALL || p.category === active);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.tagline.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    if (sort === "price-asc") list = [...list].sort((a, b) => a.basePrice - b.basePrice);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.basePrice - a.basePrice);
    return list;
  }, [active, query, sort]);

  return (
    <main className="bg-[#F8F8F8] text-[#1A1A1A] min-h-screen">
      {/* HERO */}
      <section className="bg-[#0A0A0E] text-white border-b-2 border-[#1A1A1A] relative overflow-hidden">
        <div className="absolute inset-0 paper-grain opacity-[0.04] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.06] animate-doodle-drift pointer-events-none"
          style={{ backgroundImage: "url('/images/streetwear-doodle-pattern.png')", backgroundSize: "600px 600px" }}
        />
        <div className="container mx-auto px-6 py-16 relative z-10">
          <span className="text-[#FE3136] text-xs uppercase tracking-[0.2em] font-bold block mb-4">SHOP / CATALOG</span>
          <h1 className="text-5xl md:text-7xl font-headline font-black uppercase tracking-tight leading-[0.95]">
            Browse the floor.<br />
            <span className="text-[#FE3136]">Order from 50 pieces.</span>
          </h1>
          <p className="text-lg text-white/70 mt-6 max-w-2xl">
            Every garment below is cut, sewn, and finished in our Sialkot factory. Filter by category, search, or just scroll.
            Click any piece to see fabric specs, slab pricing, and customization options.
          </p>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <section className="container mx-auto px-6 py-12">
        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden mb-6 inline-flex items-center gap-2 px-5 py-3 border-2 border-[#1A1A1A] bg-white font-bold uppercase tracking-widest text-xs"
        >
          <Filter size={14} /> Filter & Categories
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10">
          {/* ── LEFT SIDEBAR ── */}
          <aside
            className={`${mobileOpen ? "fixed inset-0 z-50 bg-white p-6 overflow-y-auto" : "hidden"} lg:block lg:static lg:p-0 lg:bg-transparent`}
          >
            {mobileOpen && (
              <button onClick={() => setMobileOpen(false)} className="lg:hidden absolute top-4 right-4 p-2" aria-label="Close">
                <X size={24} />
              </button>
            )}

            <div className="lg:sticky lg:top-24">
              {/* Search */}
              <div className="border-2 border-[#1A1A1A] bg-white flex items-center gap-2 px-4 py-3">
                <Search size={16} className="text-[#767685]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search garments…"
                  className="bg-transparent outline-none text-sm w-full placeholder:text-[#767685]"
                />
              </div>

              {/* Categories */}
              <div className="mt-8">
                <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#FE3136] font-bold mb-4">Categories</h3>
                <ul className="space-y-1">
                  {categories.map((c) => (
                    <li key={c.name}>
                      <button
                        onClick={() => { setActive(c.name); setMobileOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 border-2 transition-colors ${
                          active === c.name
                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                            : "bg-white text-[#1A1A1A] border-[#E0E0E0] hover:border-[#1A1A1A]"
                        }`}
                      >
                        <span className="font-headline font-black uppercase text-sm tracking-wide">{c.name}</span>
                        <span className={`text-[10px] tracking-widest font-bold ${active === c.name ? "text-white/60" : "text-[#767685]"}`}>
                          {c.count.toString().padStart(2, "0")}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price hint */}
              <div className="mt-8 p-5 border-2 border-[#1A1A1A] bg-[#3E41B6] text-white">
                <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/70">Slab pricing</div>
                <div className="font-headline font-black text-3xl mt-2 leading-none">From $9</div>
                <p className="text-xs text-white/80 mt-3 leading-relaxed">
                  All-in landed price drops up to <strong className="text-[#FE3136]">32%</strong> at 500+ units.
                </p>
                <Link href="/inquire" className="mt-4 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-white border-b-2 border-white pb-0.5 hover:text-[#FE3136] hover:border-[#FE3136]">
                  Get quote <ArrowUpRight size={11} />
                </Link>
              </div>

              {/* Trust strip */}
              <div className="mt-6 grid grid-cols-3 gap-2">
                {["BSCI", "OEKO-TEX", "WRAP"].map((c) => (
                  <div key={c} className="border border-[#E0E0E0] bg-white p-2 text-center text-[9px] uppercase tracking-widest font-bold text-[#3A3A3A]">
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* ── RIGHT GRID ── */}
          <div>
            {/* Toolbar */}
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6 pb-4 border-b-2 border-[#1A1A1A]">
              <div>
                <h2 className="font-headline font-black uppercase text-2xl">{active}</h2>
                <p className="text-xs uppercase tracking-widest text-[#767685] font-bold mt-1">
                  Showing {filtered.length} {filtered.length === 1 ? "product" : "products"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-[#767685]">Sort</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  className="border-2 border-[#1A1A1A] bg-white px-3 py-2 text-xs font-bold uppercase tracking-widest outline-none cursor-pointer"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low → High</option>
                  <option value="price-desc">Price: High → Low</option>
                </select>
              </div>
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="border-2 border-dashed border-[#1A1A1A] p-16 text-center bg-white">
                <p className="font-headline font-black text-2xl uppercase">No matches</p>
                <p className="text-sm text-[#3A3A3A] mt-2">Try a different category or search term.</p>
                <button onClick={() => { setActive(ALL); setQuery(""); }} className="mt-6 px-6 py-3 bg-[#1A1A1A] text-white font-bold uppercase tracking-widest text-xs">
                  Reset filters
                </button>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  className="group bg-white border-2 border-[#1A1A1A] hover:border-[#FE3136] transition-colors flex flex-col"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#F0F0F0]">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 bg-[#1A1A1A] text-white px-2.5 py-1 text-[10px] uppercase tracking-widest font-bold">
                      {String(i + 1).padStart(2, "0")}
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
          </div>
        </div>
      </section>
    </main>
  );
}
