"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const slug = searchParams?.get("slug") || "";
  const qTitle = searchParams?.get("title") || "";
  const qPrice = searchParams?.get("price") || "";
  const qImage = searchParams?.get("image") || "";

  const packageTitle = qTitle || slugToTitle(slug);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    packageTitle,
    price: qPrice,
  });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    setForm((s) => ({ ...s, packageTitle, price: qPrice }));
  }, [packageTitle, qPrice]);

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
                {qImage ? (
                  <img src={qImage} alt={packageTitle} className="w-full h-44 object-cover rounded-lg mb-4" />
                ) : null}
                <h2 className="text-2xl font-bold text-white mb-2">{packageTitle}</h2>
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