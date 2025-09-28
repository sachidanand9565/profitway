"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
// removed: import { useSearchParams } from "next/navigation";
import Header from "../component/include/header";
import Footer from "../component/include/footer";

function slugToTitle(slug) {
  if (!slug) return "Selected Package";
  return slug
    .replace(/-/g, " ")
    .split(" ")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export default function CheckoutPage() {
  // replaced useSearchParams with client-side state + URLSearchParams
  const [slug, setSlug] = useState("");
  const [qTitle, setQTitle] = useState("");
  const [qPrice, setQPrice] = useState("");
  const [qImage, setQImage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      setSlug(sp.get("slug") || "");
      setQTitle(sp.get("title") || "");
      setQPrice(sp.get("price") || "");
      setQImage(sp.get("image") || "");
    }
  }, []);

  const packageTitle = qTitle || slugToTitle(slug);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    packageTitle,
    price: qPrice,
    state: "",
    city: "",
    sponsorCode: "",
  });
  const [pkgData, setPkgData] = useState({ title: packageTitle, price: qPrice, image: qImage, slug });
  const [status, setStatus] = useState(null);

  // small list of states -> cities (extend as needed)
  const stateCityMap = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
    "Karnataka": ["Bengaluru", "Mysore", "Mangalore"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    "Delhi": ["New Delhi", "North Delhi", "South Delhi"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi"],
  };
  const [cities, setCities] = useState([]);

  useEffect(() => {
    // prefer sessionStorage package object (set by packages page)
    try {
      const raw = sessionStorage.getItem("checkout_pkg");
      if (raw) {
        const parsed = JSON.parse(raw);
        setPkgData({
          title: parsed.title || packageTitle,
          price: parsed.price || qPrice,
          image: parsed.image || qImage,
          slug: parsed.slug || slug,
        });
        setForm((s) => ({
          ...s,
          packageTitle: parsed.title || packageTitle,
          price: parsed.price || qPrice,
        }));
        return;
      }
    } catch (e) {
      // ignore storage errors
    }
    // fallback to query params
    setPkgData({ title: packageTitle, price: qPrice, image: qImage, slug });
    setForm((s) => ({ ...s, packageTitle: packageTitle, price: qPrice }));
  }, [slug, qTitle, qPrice, qImage, packageTitle]);

  // update cities when state changes
  useEffect(() => {
    const s = form.state;
    if (s && stateCityMap[s]) {
      setCities(stateCityMap[s]);
      // if current city not in new list, clear it
      if (!stateCityMap[s].includes(form.city)) {
        setForm((f) => ({ ...f, city: "" }));
      }
    } else {
      setCities([]);
    }
  }, [form.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    // TODO: replace with real API call
    setTimeout(() => {
      setStatus("sent");
      // optionally redirect: router.push('/thank-you')
    }, 1000);
  };

  return (
    <>
      <Head>
        <title>Checkout - {packageTitle} | ProfitWay</title>
        <meta name="description" content={`Checkout for ${packageTitle}`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />

        <main className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white">Checkout</h1>
              <p className="text-gray-300 mt-2">You're enrolling for: <span className="text-cyan-400 font-semibold">{packageTitle}</span></p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {/* Left: package summary */}
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-6 border border-gray-700/50">
                {pkgData.image ? (
                  <img src={pkgData.image} alt={pkgData.title} className="w-full h-48 object-cover rounded-lg mb-4 shadow-lg" />
                ) : null}
                <h2 className="text-2xl font-bold text-white mb-2">{pkgData.title}</h2>
                {form.price ? (
                  <div className="text-white font-semibold text-lg mb-3">Price: ₹{form.price}</div>
                ) : (
                  <div className="text-gray-300 mb-3">Price will be confirmed after checkout.</div>
                )}

                <p className="text-gray-300 mb-4">Review package details and complete checkout with your contact info.</p>

                <div className="space-y-2 text-sm text-gray-300">
                  <div>Includes: Courses, support & resources</div>
                  <div>Contact support after purchase for onboarding.</div>
                </div>
              </div>

              {/* Right: form */}
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-6 border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-4">Your details</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="rounded-md bg-gradient-to-r from-white/5 to-white/3 p-3 border border-white/5">
                    <div className="text-sm text-gray-300 mb-1">Selected Package</div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="text-white font-semibold">{pkgData.title}</div>
                        <div className="text-gray-400 text-sm">Price: {form.price || "TBD"}</div>
                      </div>
                      {pkgData.image ? <img src={pkgData.image} alt={pkgData.title} className="w-20 h-12 object-cover rounded" /> : null}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Full name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Email address</label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Mobile number</label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">State</label>
                      <select
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select state</option>
                        {Object.keys(stateCityMap).map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1">City</label>
                      {cities.length > 0 ? (
                        <select
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          required
                          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select city</option>
                          {cities.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          name="city"
                          value={form.city}
                          onChange={handleChange}
                          placeholder="City"
                          required
                          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Address (optional)</label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Sponsor Code (optional)</label>
                    <input
                      name="sponsorCode"
                      value={form.sponsorCode}
                      onChange={handleChange}
                      placeholder="Enter sponsor / referral code"
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Message / Notes</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-purple-700 transition-all"
                    >
                      {status === "sending" ? "Processing..." : "Confirm & Pay"}
                    </button>

                    {status === "sent" && (
                      <div className="text-green-400 font-medium">Request received — we will contact you shortly.</div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}