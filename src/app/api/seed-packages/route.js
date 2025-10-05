import { NextResponse } from "next/server";
import { query } from "../../../lib/mysqlClient";

const packagesData = [
  {
    name: "Basic Package",
    title: "Basic Package",
    subtitle: "Start your earning journey with fundamental skills",
    description: "Perfect for beginners looking to start earning online with basic digital marketing skills.",
    price: "₹2,999",
    originalPrice: "₹4,999",
    image: "/images/packages/basic-package.svg",
    features: [
      "Basic Digital Marketing Course",
      "Email Marketing Fundamentals",
      "Social Media Basics",
      "Lead Generation Techniques",
      "Community Access"
    ],
    slug: "basic-package"
  },
  {
    name: "Medium Package",
    title: "Medium Package",
    subtitle: "Advance your skills and increase your earning potential",
    description: "Intermediate level courses with advanced strategies for higher income generation.",
    price: "₹7,999",
    originalPrice: "₹12,999",
    image: "/images/packages/medium-package.svg",
    features: [
      "Advanced Digital Marketing",
      "SEO & SEM Mastery",
      "Content Creation",
      "Affiliate Marketing",
      "Analytics & Reporting"
    ],
    slug: "medium-package"
  },
  {
    name: "Pro Package",
    title: "Pro Package",
    subtitle: "Professional level training for serious earners",
    description: "Comprehensive training with business development strategies for maximum earnings.",
    price: "₹14,999",
    originalPrice: "₹24,999",
    image: "/images/packages/pro-package.svg",
    features: [
      "Complete Business Development",
      "Advanced SEO Strategies",
      "E-commerce Mastery",
      "Personal Branding",
      "Mentorship Program"
    ],
    slug: "pro-package"
  },
  {
    name: "Master Package",
    title: "Master Package",
    subtitle: "Elite training for top performers",
    description: "Master level courses with exclusive strategies and one-on-one coaching.",
    price: "₹24,999",
    originalPrice: "₹39,999",
    image: "/images/packages/master-package.svg",
    features: [
      "Elite Business Strategies",
      "Advanced Analytics",
      "Custom Marketing Plans",
      "VIP Community Access",
      "Personal Coach"
    ],
    slug: "master-package"
  },
  {
    name: "Crown Package",
    title: "Crown Package",
    subtitle: "Ultimate package for maximum earnings",
    description: "The ultimate earning package with all premium features and unlimited support.",
    price: "₹49,999",
    originalPrice: "₹79,999",
    image: "/images/packages/crown-package.svg",
    features: [
      "All Master Features",
      "Unlimited Consultations",
      "Custom Business Setup",
      "Priority Support",
      "Revenue Sharing"
    ],
    slug: "crown-package"
  },
  {
    name: "Royal Package",
    title: "Royal Package",
    subtitle: "Royal treatment for royal earnings",
    description: "Exclusive royal package with personalized strategies and guaranteed results.",
    price: "₹99,999",
    originalPrice: "₹149,999",
    image: "/images/packages/royal-package.svg",
    features: [
      "All Crown Features",
      "Guaranteed Results",
      "Personal Business Manager",
      "VIP Networking Events",
      "Royal Community"
    ],
    slug: "royal-package"
  }
];

export async function POST() {
  try {
    // First, create the database if it doesn't exist
    await query("CREATE DATABASE IF NOT EXISTS profitway", [], null);

    // Use the profitway database for subsequent queries
    const dbName = 'profitway';

    // First, create the packages table if it doesn't exist
    await query(`
      CREATE TABLE IF NOT EXISTS packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        subtitle TEXT,
        description TEXT,
        price VARCHAR(50),
        originalPrice VARCHAR(50),
        image VARCHAR(255),
        features JSON,
        slug VARCHAR(255) UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `, [], dbName);

    // Clear existing data
    await query("DELETE FROM packages", [], dbName);

    // Insert new data
    for (const pkg of packagesData) {
      await query(
        `INSERT INTO packages (name, title, subtitle, description, price, originalPrice, image, features, slug)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          pkg.name,
          pkg.title,
          pkg.subtitle,
          pkg.description,
          pkg.price,
          pkg.originalPrice,
          pkg.image,
          JSON.stringify(pkg.features),
          pkg.slug
        ],
        dbName
      );
    }

    return NextResponse.json({ message: "Packages seeded successfully" });
  } catch (err) {
    console.error("Seeding error:", err);
    return NextResponse.json({ error: "Failed to seed packages" }, { status: 500 });
  }
}
