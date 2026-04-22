import PageHeader from "@/components/PageHeader";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { PRODUCTS } from "@/data/products";

export default function Products() {
  return (
    <>
      <PageHeader
        eyebrow="Garment range"
        title="Nine garment types. All MOQ 50."
        subtitle="Pick one or mix and match. All slab-priced. All certified. Customize colors, fits, hardware, labels — we handle the production."
      />

      <section className="container-page py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="group bg-white border border-[#E0E0E0] rounded overflow-hidden hover:border-[#3E41B6] transition-colors"
            >
              <div className="aspect-[4/5] overflow-hidden bg-[#F2F2F2]">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <div className="font-display text-xl">{p.name}</div>
                <div className="text-sm text-[#555] mt-2">{p.tagline}</div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-[#555]">From </span>
                    <span className="font-semibold text-[#3E41B6]">${p.basePrice.toFixed(2)}</span>
                    <span className="text-[#555]">/unit</span>
                  </div>
                  <div className="text-xs font-semibold text-[#3E41B6] inline-flex items-center gap-1 group-hover:text-[#FE3136]">
                    Open <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
