import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { products, productImages, slabPrices, sizeCharts } from "./drizzle/schema";

async function main() {
    console.log("Connecting to database...");
    const connection = await mysql.createConnection({
        uri: process.env.DATABASE_URL || "mysql://root:password@localhost:3306/xelent_uniforms",
    });
    const db = drizzle(connection);

    const categories = [
        {
            id: "sportswear",
            name: "Custom Sportswear",
            items: [
                {
                    slug: "custom-elite-basketball-jersey",
                    title: "Custom Elite Basketball Jersey",
                    shortDescription: "Premium moisture-wicking basketball jersey.",
                    mainImage: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=85",
                    samplePrice: "35.00",
                    weight: "0.200",
                    availableSizes: JSON.stringify(["S", "M", "L", "XL", "2XL", "3XL"]),
                    availableColors: JSON.stringify(["Red", "Blue", "Black", "White", "Custom"]),
                    material: "180 GSM Micro Mesh Polyester",
                    seoTitle: "Custom Elite Basketball Jersey Manufacturer",
                    seoDescription: "Order premium custom basketball jerseys for your team.",
                },
                {
                    slug: "sublimated-soccer-kit",
                    title: "Pro Sublimated Soccer Kit",
                    shortDescription: "Fully sublimated custom soccer uniforms.",
                    mainImage: "https://images.unsplash.com/photo-1518091043644-c1d44570a2c9?w=800&q=85",
                    samplePrice: "40.00",
                    weight: "0.250",
                    availableSizes: JSON.stringify(["S", "M", "L", "XL", "2XL"]),
                    availableColors: JSON.stringify(["Custom Team Colors"]),
                    material: "160 GSM Interlock Polyester",
                    seoTitle: "Pro Sublimated Soccer Kit Custom",
                    seoDescription: "High performance soccer kits with fully custom sublimation.",
                },
                {
                    slug: "compression-base-layer",
                    title: "Athletic Compression Base Layer",
                    shortDescription: "4-way stretch compression wear for all sports.",
                    mainImage: "https://images.unsplash.com/photo-1581636625402-29f2a0dfbef4?w=800&q=85",
                    samplePrice: "25.00",
                    weight: "0.150",
                    availableSizes: JSON.stringify(["XS", "S", "M", "L", "XL", "2XL"]),
                    availableColors: JSON.stringify(["Black", "White", "Navy", "Charcoal"]),
                    material: "Spandex/Polyester Blend 220 GSM",
                    seoTitle: "Custom Compression Base Layer Manufacturing",
                    seoDescription: "Private label compression gear for your athletic brand.",
                },
            ]
        },
        {
            id: "hunting-wear",
            name: "Custom Hunting Wear",
            items: [
                {
                    slug: "waterproof-hunting-jacket",
                    title: "Tactical Waterproof Hunting Jacket",
                    shortDescription: "Silent shell waterproof jacket in custom camo.",
                    mainImage: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&q=85",
                    samplePrice: "85.00",
                    weight: "0.900",
                    availableSizes: JSON.stringify(["M", "L", "XL", "2XL", "3XL"]),
                    availableColors: JSON.stringify(["Multicam", "Real Tree", "Olive Drab"]),
                    material: "Softshell with DWR coating",
                    seoTitle: "Custom Tactical Hunting Jacket Manufacturer",
                    seoDescription: "B2B manufacturing for silent waterproof hunting jackets.",
                },
                {
                    slug: "ripstop-cargo-pants",
                    title: "Reinforced Ripstop Hunting Cargo Pants",
                    shortDescription: "Tough ripstop pants with articulated knees.",
                    mainImage: "https://images.unsplash.com/photo-1550346059-59eb4df42d8a?w=800&q=85",
                    samplePrice: "55.00",
                    weight: "0.600",
                    availableSizes: JSON.stringify(["30", "32", "34", "36", "38", "40"]),
                    availableColors: JSON.stringify(["Khaki", "Coyote Brown", "Multicam"]),
                    material: "Cotton/Poly Ripstop 280 GSM",
                    seoTitle: "Ripstop Hunting Cargo Pants Wholesale",
                    seoDescription: "Durable ripstop cargo pants designed for the wild.",
                },
                {
                    slug: "camo-fleece-pullover",
                    title: "Thermal Camo Fleece Pullover",
                    shortDescription: "Mid-layer fleece for cold morning hunts.",
                    mainImage: "https://media.istockphoto.com/id/118320496/photo/hunter-in-camo-walking-through-the-woods.jpg?b=1&s=170667a&w=0&k=20&c=hF-Z_A4oO0w66B8p2jH0f_dG0_7l7D-r_4Pz0Qe2R-8=",
                    samplePrice: "45.00",
                    weight: "0.500",
                    availableSizes: JSON.stringify(["S", "M", "L", "XL", "2XL"]),
                    availableColors: JSON.stringify(["Woodland Camo", "Digital Camo"]),
                    material: "Microfleece 300 GSM",
                    seoTitle: "Wholesale Camo Fleece Pullover",
                    seoDescription: "Warm, silent, microfleece layer for hunting brands.",
                }
            ]
        },
        {
            id: "streetwear",
            name: "Custom Streetwear",
            items: [
                {
                    slug: "heavyweight-oversized-hoodie",
                    title: "450GSM Heavyweight Oversized Hoodie",
                    shortDescription: "Premium drop-shoulder boxy fit hoodie.",
                    mainImage: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=85",
                    samplePrice: "45.00",
                    weight: "0.850",
                    availableSizes: JSON.stringify(["S", "M", "L", "XL", "2XL"]),
                    availableColors: JSON.stringify(["Black", "Heather Grey", "Vintage Wash", "Cream"]),
                    material: "450 GSM French Terry Cotton",
                    seoTitle: "450GSM Heavyweight Oversized Hoodie Manufacturer",
                    seoDescription: "Premium blank and custom heavyweight hoodies for streetwear brands.",
                },
                {
                    slug: "vintage-wash-graphic-tee",
                    title: "Vintage Wash Graphic Tee",
                    shortDescription: "Acid-washed oversized tee ready for screen printing.",
                    mainImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=85",
                    samplePrice: "22.00",
                    weight: "0.280",
                    availableSizes: JSON.stringify(["XS", "S", "M", "L", "XL", "2XL"]),
                    availableColors: JSON.stringify(["Washed Black", "Washed Grey", "Washed Olive"]),
                    material: "280 GSM Ring-Spun Cotton",
                    seoTitle: "Vintage Wash Tees Bulk Sialkot",
                    seoDescription: "Acid washed blanks and custom printed vintage tees.",
                },
                {
                    slug: "nylon-cargo-joggers",
                    title: "Utility Nylon Cargo Joggers",
                    shortDescription: "Tech-inspired streetwear joggers with multiple pockets.",
                    mainImage: "https://plus.unsplash.com/premium_photo-1673356301535-224a0dcdcbca?w=800&q=85",
                    samplePrice: "38.00",
                    weight: "0.450",
                    availableSizes: JSON.stringify(["S", "M", "L", "XL"]),
                    availableColors: JSON.stringify(["Black", "Navy", "Olive"]),
                    material: "Nylon/Spandex Blend with DWR",
                    seoTitle: "Custom Nylon Cargo Joggers Streetwear",
                    seoDescription: "High-quality streetwear cargo pants wholesale manufacturing.",
                }
            ]
        },
        {
            id: "security-uniforms",
            name: "Custom Security Uniforms",
            items: [
                {
                    slug: "tactical-security-polo",
                    title: "Moisture-Wicking Tactical Security Polo",
                    shortDescription: "Professional guard polo with mic loops.",
                    mainImage: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=85",
                    samplePrice: "24.00",
                    weight: "0.250",
                    availableSizes: JSON.stringify(["S", "M", "L", "XL", "2XL", "3XL", "4XL"]),
                    availableColors: JSON.stringify(["Black", "Navy", "White"]),
                    material: "200 GSM Pique Moisture-Wicking",
                    seoTitle: "Custom Tactical Security Polo Manufacturer",
                    seoDescription: "Durable and breathable polos for security professionals.",
                },
                {
                    slug: "hi-vis-security-jacket",
                    title: "High-Visibility Patrol Jacket",
                    shortDescription: "Weatherproof jacket with 3M reflective tape.",
                    mainImage: "https://images.unsplash.com/photo-1532050212781-ca414b533e08?w=800&q=85",
                    samplePrice: "65.00",
                    weight: "1.100",
                    availableSizes: JSON.stringify(["M", "L", "XL", "2XL", "3XL"]),
                    availableColors: JSON.stringify(["Neon Yellow/Black", "Neon Orange/Navy"]),
                    material: "300D Oxford Polyester with PU Coating",
                    seoTitle: "Hi-Vis Patrol Jacket Wholesale",
                    seoDescription: "Safety outerwear built for extreme guard duties.",
                },
                {
                    slug: "security-combat-trousers",
                    title: "Reinforced Guard Combat Trousers",
                    shortDescription: "Teflon-coated durable pants with baton pocket.",
                    mainImage: "https://images.unsplash.com/photo-1623868662657-3f3efd684824?w=800&q=85",
                    samplePrice: "35.00",
                    weight: "0.550",
                    availableSizes: JSON.stringify(["30", "32", "34", "36", "38", "40", "42"]),
                    availableColors: JSON.stringify(["Black", "Navy"]),
                    material: "Poly/Cotton Twill with Teflon",
                    seoTitle: "Custom Security Guard Trousers Bulk",
                    seoDescription: "Professional guard trousers with teflon finish.",
                }
            ]
        },
        {
            id: "techwear",
            name: "Custom Techwear",
            items: [
                {
                    slug: "modular-tech-jacket",
                    title: "Modular Waterproof Techwear Jacket",
                    shortDescription: "Fidlock buckles, waterproof zips, multiple strapping points.",
                    mainImage: "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=85",
                    samplePrice: "120.00",
                    weight: "0.850",
                    availableSizes: JSON.stringify(["S", "M", "L", "XL"]),
                    availableColors: JSON.stringify(["Matte Black", "Gunmetal Grey"]),
                    material: "3-Layer GORE-TEX Compatible Shell",
                    seoTitle: "Techwear Manufacturer Modular Jacket",
                    seoDescription: "High-end conceptual techwear manufacturing for innovative brands.",
                },
                {
                    slug: "tactical-chest-rig",
                    title: "Urban Tactical Chest Rig bag",
                    shortDescription: "Laser cut molle, sleek urban design.",
                    mainImage: "https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=800&q=85",
                    samplePrice: "45.00",
                    weight: "0.400",
                    availableSizes: JSON.stringify(["One Size"]),
                    availableColors: JSON.stringify(["Black", "Silver Geo"]),
                    material: "500D Cordura Nylon",
                    seoTitle: "Urban Tactical Chest Rig Techwear",
                    seoDescription: "Wholesale manufacturing of techwear bags and rigs.",
                },
                {
                    slug: "articulated-tech-cargo",
                    title: "Articulated Techwear Cargo Pants",
                    shortDescription: "Pre-curved knees and expanding pocket system.",
                    mainImage: "https://images.unsplash.com/photo-1622519407650-3cb98286aa54?w=800&q=85",
                    samplePrice: "65.00",
                    weight: "0.600",
                    availableSizes: JSON.stringify(["28", "30", "32", "34", "36"]),
                    availableColors: JSON.stringify(["Black", "Olive", "Charcoal"]),
                    material: "Stretch Nylon Ripstop",
                    seoTitle: "Articulated Tech Cargo Pants Factory",
                    seoDescription: "Advanced pattern making for techwear brands.",
                }
            ]
        },
        {
            id: "ski-wear",
            name: "Custom Ski Wear",
            items: [
                {
                    slug: "alpine-pro-snow-jacket",
                    title: "Alpine Pro 20K Snow Jacket",
                    shortDescription: "20k/20k waterproof and breathable alpine jacket.",
                    mainImage: "https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800&q=85",
                    samplePrice: "140.00",
                    weight: "1.200",
                    availableSizes: JSON.stringify(["S", "M", "L", "XL", "2XL"]),
                    availableColors: JSON.stringify(["Neon Pink", "Ice Blue", "Black/White Bold"]),
                    material: "20K Poly Shell + Primaloft Insulation",
                    seoTitle: "Custom Ski Jacket Manufacturer 20K",
                    seoDescription: "High-end ski apparel manufacturing with 20K waterproofing.",
                },
                {
                    slug: "insulated-snow-bib",
                    title: "Insulated Freeride Snow Bib",
                    shortDescription: "Full coverage bib with sealed zippers and powder cuffs.",
                    mainImage: "https://images.unsplash.com/photo-1610443420456-c2ba79471f54?w=800&q=85",
                    samplePrice: "110.00",
                    weight: "1.000",
                    availableSizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
                    availableColors: JSON.stringify(["Mustard Yellow", "Black", "Forest Green"]),
                    material: "15K/15K Waterproof Oxford",
                    seoTitle: "Insulated Snow Bib Wholesale",
                    seoDescription: "Durable snow bibs and overalls for freeride and park snowboarding.",
                },
                {
                    slug: "merino-base-layer",
                    title: "Merino Wool Snow Base Layer Set",
                    shortDescription: "Natural odor resistant, temperature regulating set.",
                    mainImage: "https://images.unsplash.com/photo-1520113412521-996ff6d7734a?w=800&q=85",
                    samplePrice: "60.00",
                    weight: "0.350",
                    availableSizes: JSON.stringify(["S", "M", "L", "XL"]),
                    availableColors: JSON.stringify(["Black", "Charcoal Marl"]),
                    material: "100% Merino Wool 210 GSM",
                    seoTitle: "Merino Wool Base Layer Manufacturing",
                    seoDescription: "Custom merino wool thermals for winter sports.",
                }
            ]
        }
    ];

    for (const cat of categories) {
        console.log(`Inserting category: ${cat.name}`);
        for (const [index, p] of cat.items.entries()) {
            try {
                const [result] = await db.insert(products).values({
                    slug: p.slug,
                    title: p.title,
                    category: cat.id,
                    description: p.shortDescription + "\n\nThis is a fully customizable piece made at our cutting-edge manufacturing facility in Sialkot, Pakistan. Perfect for your brand.",
                    shortDescription: p.shortDescription,
                    mainImage: p.mainImage,
                    samplePrice: p.samplePrice,
                    weight: p.weight,
                    availableSizes: p.availableSizes,
                    availableColors: p.availableColors,
                    material: p.material,
                    isFeatured: true,
                    isActive: true,
                    freeShipping: false,
                    seoTitle: p.seoTitle,
                    seoDescription: p.seoDescription,
                    seoKeywords: `${cat.name}, custom manufacturer Sialkot`,
                    sortOrder: index,
                });

                const insertId = (result as any).insertId;
                console.log(`Inserted: ${p.title} with ID: ${insertId}`);

                // Add dummy slab prices
                await db.insert(slabPrices).values([
                    { productId: insertId, minQty: 50, maxQty: 100, pricePerUnit: (parseFloat(p.samplePrice) * 0.7).toFixed(2), label: "Startup", sortOrder: 0 },
                    { productId: insertId, minQty: 101, maxQty: 500, pricePerUnit: (parseFloat(p.samplePrice) * 0.5).toFixed(2), label: "Scale", sortOrder: 1 },
                    { productId: insertId, minQty: 501, maxQty: null, pricePerUnit: (parseFloat(p.samplePrice) * 0.4).toFixed(2), label: "Wholesale", sortOrder: 2 },
                ]);

                await db.insert(productImages).values({
                    productId: insertId,
                    imageUrl: p.mainImage,
                    altText: p.title + " Main Image",
                    sortOrder: 0,
                });

            } catch (err: any) {
                console.error(`Skipping ${p.title} (possibly exists): ${err?.message}`);
            }
        }
    }

    console.log("Done seeding products!");
    process.exit(0);
}

main().catch((err) => {
    console.error("Critical error:", err);
    process.exit(1);
});
