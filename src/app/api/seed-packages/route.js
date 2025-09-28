import { NextResponse } from "next/server";
import { getCollection } from "@/lib/mongoClient";

const packages = [
  {
    slug: "basic-package",
    title: "Basic Package",
    price: "999",
    originalPrice: "1499",
    image: "https://images.unsplash.com/photo-1508830524289-0adcbe822b40?auto=format&fit=crop&w=1200&q=80",
    description: "Starter set of courses and basic support to get you earning.",
    features: ["Core courses", "Community access", "Email support"],
    createdAt: new Date(),
  },
  {
    slug: "medium-package",
    title: "Medium Package",
    price: "2999",
    originalPrice: "3999",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    description: "More courses, hands-on projects and priority support.",
    features: ["All Basic + projects", "Weekly Q&A", "Priority support"],
    createdAt: new Date(),
  },
  {
    slug: "pro-package",
    title: "Pro Package",
    price: "5999",
    originalPrice: "8999",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    description: "Advanced content, 1:1 mentorship and placement assistance.",
    features: ["1:1 mentorship", "Advanced modules", "Placement help"],
    createdAt: new Date(),
  },
  {
    slug: "master-package",
    title: "Master Package",
    price: "12999",
    originalPrice: "17999",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    description: "Full access, live workshops, and VIP onboarding.",
    features: ["Live workshops", "VIP onboarding", "Dedicated mentor"],
    createdAt: new Date(),
  },
  {
    slug: "crown-package",
    title: "Crown Package",
    price: "24999",
    originalPrice: "29999",
    image: "https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=1200&q=80",
    description: "Enterprise-level program with business coaching.",
    features: ["Business coaching", "Enterprise resources", "Dedicated success manager"],
    createdAt: new Date(),
  },
  {
    slug: "royal-package",
    title: "Royal Package",
    price: "49999",
    originalPrice: "59999",
    image: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=1200&q=80",
    description: "All-access VIP plan — premium support & partnership opportunities.",
    features: ["Partnerships", "Premium support", "Custom onboarding"],
    createdAt: new Date(),
  },
];

export async function GET() {
  try {
    const coll = await getCollection("packages");
    // Skip duplicates by slug: insert only slugs that don't exist
    const existing = await coll.find({ slug: { $in: packages.map((p) => p.slug) } }).project({ slug: 1 }).toArray();
    const existingSlugs = new Set(existing.map((e) => e.slug));
    const toInsert = packages.filter((p) => !existingSlugs.has(p.slug));
    if (toInsert.length === 0) {
      return NextResponse.json({ ok: true, inserted: 0, message: "All packages already exist" });
    }
    const result = await coll.insertMany(toInsert, { ordered: false });
    const inserted = result.insertedIds ? Object.keys(result.insertedIds).length : 0;
    return NextResponse.json({ ok: true, inserted, insertedIds: result.insertedIds || null });
  } catch (err) {
    console.error("seed-packages error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}