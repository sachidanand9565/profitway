"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "../component/include/header";
import Footer from "../component/include/footer";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutPageContent />
    </Suspense>
  );
}

function CheckoutPageContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const qTitle = searchParams.get("title");
  const qPrice = searchParams.get("price");
  const qImage = searchParams.get("image");

  function slugToTitle(slug) {
    if (!slug) return "Selected Package";
    return slug.replace(/-/g, " ").split(" ").map((s) => s.charAt(0).toUpperCase() + s.slice(1));
  }

  const packageTitle = slugToTitle(slug) || qTitle || "Selected Package";

  const [pkgData, setPkgData] = useState({ title: "", price: "", image: "", slug: "" });

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
    paymentScreenshot: null,
    utrNumber: "",
  });
  const [status, setStatus] = useState(null);

  // UI step: 'form' | 'review' | 'processing' | 'done'
  const [step, setStep] = useState("form");
  const [orderId, setOrderId] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // small list of states -> cities (extend as needed)
  const stateCityMap = {
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
    Karnataka: ["Bengaluru", "Mysore", "Mangalore"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
    Delhi: ["New Delhi", "North Delhi", "South Delhi"],
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

  // On form submit -> show review step
  const handleSubmit = (e) => {
    e.preventDefault();
    // basic validation before review
    if (!form.name || !form.email || !form.phone) {
      alert("Please fill name, email and phone before proceeding.");
      return;
    }
    setStep("review");
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  // Handle payment submission
  const handlePayNow = async () => {
    // Validation for payment screenshot and UTR number
    if (!form.paymentScreenshot) {
      alert("Please upload a payment screenshot before proceeding.");
      return;
    }
    if (!form.utrNumber || form.utrNumber.trim() === "") {
      alert("Please enter the UTR number before proceeding.");
      return;
    }

    setStep("processing");
    setStatus("sending");

    try {
      // Convert payment screenshot to base64 if exists
      let paymentScreenshotBase64 = null;
      if (form.paymentScreenshot) {
        paymentScreenshotBase64 = await fileToBase64(form.paymentScreenshot);
      }

      // Prepare data for API
      const orderData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        message: form.message,
        packageId: pkgData.slug || "unknown",
        packageTitle: pkgData.title,
        price: form.price,
        state: form.state,
        city: form.city,
        sponsorCode: form.sponsorCode,
        paymentScreenshot: paymentScreenshotBase64,
        utrNumber: form.utrNumber,
      };

      // Send to API
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (response.ok) {
        // generate simple order id
        const id = "ORD" + Date.now().toString().slice(-6);
        setOrderId(id);
        setStatus("paid");
        setStep("done");

        // clear session storage package to avoid reuse
        try {
          sessionStorage.removeItem("checkout_pkg");
        } catch (e) {}
      } else {
        throw new Error(result.error || "Failed to process order");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Failed to process payment. Please try again.");
      setStep("review");
      setStatus(null);
    }
  };

  const handleBackToForm = () => {
    setStep("form");
  };

  return (
    <>
      <Head>
        <title>Checkout - {pkgData.title} | ProfitWay</title>
        <meta name="description" content={`Checkout for ${pkgData.title}`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />

        <main className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white">Checkout</h1>
              <p className="text-gray-300 mt-2">
                You're enrolling for:{" "}
                <span className="text-cyan-400 font-semibold">{pkgData.title}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
           
              {/* Center: form or review */}
              <div className="lg:col-span-2 bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-6 border border-gray-700/50">
                {step === "form" && (
                  <>
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

                      <div className="grid grid-cols-1  gap-4">
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
                          Review & Pay
                        </button>

                        {status === "sent" && (
                          <div className="text-green-400 font-medium">Request received — we will contact you shortly.</div>
                        )}
                      </div>
                    </form>
                  </>
                )}

                {step === "review" && (
                  <>
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-3">Review your order</h3>
                      <div className="rounded-lg bg-gray-900/50 p-4 border border-gray-700">
                        {/* Mobile Layout */}
                        <div className="block md:hidden">
                          <div className="flex items-start gap-4 mb-4">
                            {pkgData.image && (
                              <img src={pkgData.image} alt={pkgData.title} className="w-20 h-16 object-cover rounded flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <div className="text-white font-semibold text-lg">{pkgData.title}</div>
                              <div className="text-gray-400 text-sm">Price: {form.price || "TBD"}</div>
                            </div>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div><span className="font-semibold">Name:</span> {form.name}</div>
                            <div><span className="font-semibold">Email:</span> {form.email}</div>
                            <div><span className="font-semibold">Phone:</span> {form.phone}</div>
                            {form.sponsorCode && <div><span className="font-semibold">Sponsor:</span> {form.sponsorCode}</div>}
                            <div><span className="font-semibold">Address:</span> {form.address || "-"}, {form.city || "-"}, {form.state || "-"}</div>
                          </div>
                        </div>

                        {/* Desktop Table Layout */}
                        <div className="hidden md:block overflow-x-auto">
                          <table className="min-w-full text-gray-300 text-sm">
                            <tbody>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-2 pr-4 font-semibold">Package</th>
                                <td className="py-2">{pkgData.title}</td>
                                <td rowSpan={7} className="pl-6">
                                  {pkgData.image && (
                                    <img src={pkgData.image} alt={pkgData.title} className="w-32 h-20 object-cover rounded" />
                                  )}
                                </td>
                              </tr>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-2 pr-4 font-semibold">Price</th>
                                <td className="py-2">{form.price || "TBD"}</td>
                              </tr>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-2 pr-4 font-semibold">Name</th>
                                <td className="py-2">{form.name}</td>
                              </tr>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-2 pr-4 font-semibold">Email</th>
                                <td className="py-2">{form.email}</td>
                              </tr>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-2 pr-4 font-semibold">Phone</th>
                                <td className="py-2">{form.phone}</td>
                              </tr>
                              {form.sponsorCode && (
                                <tr className="border-b border-gray-700">
                                  <th className="text-left py-2 pr-4 font-semibold">Sponsor</th>
                                  <td className="py-2">{form.sponsorCode}</td>
                                </tr>
                              )}
                              <tr>
                                <th className="text-left py-2 pr-4 font-semibold">Address</th>
                                <td className="py-2">{form.address || "-"}, {form.city || "-"}, {form.state || "-"}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info Section */}
                    <div className="mb-6 p-6 bg-gray-800 rounded-lg border border-gray-700">
                      <h3 className="text-lg font-bold text-white mb-4">Please Pay Rs. {form.price || "TBD"} /- On below given UPI</h3>
                      <div className="text-center mb-6">
<img
  src="/payqr.jpeg"
  alt="UPI QR Code"
  className="mx-auto w-56 h-56 object-contain rounded-lg border border-gray-600 p-2 bg-white"
/>
                      </div>
                      <div className="text-center mb-4">
<div className="text-2xl font-bold text-white mb-2">9236524244@axl</div>
<button
  onClick={() => {
    navigator.clipboard.writeText("9236524244@axl").then(() => {
      console.log("UPI ID copied to clipboard successfully");
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Reset after 2 seconds
    }).catch(() => {
      console.error("Failed to copy UPI ID to clipboard");
      setCopySuccess(false);
    });
  }}
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  {copySuccess ? "✓ Copied" : "Copy UPI"}
</button>
                      </div>
                      <p className="text-gray-300 mb-4 text-center">
                        After Payment share screenshot and registered email id on given number.
                      </p>
                      <div className="text-center mb-4">
                        <a href="https://wa.me/9236524244" target="_blank" rel="noopener noreferrer" className="inline-block bg-green-600 text-white px-4 py-2 rounded">
                          Whatsapp: +91-9236524244
                        </a>
                      </div>

                      <div className="mb-4">
                        <label className="block text-white mb-2 font-semibold">Payment Screenshot</label>
                        <p className="text-sm text-gray-400 mb-2">
                          Payment Screenshot मैं सब Details Show होनी चाहिए। Like :- UTR/ UPI Ref. Id ( 12 digital number )
                        </p>

                        {/* Mobile Layout: Stack input and preview */}
                        <div className="block md:hidden">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setForm((f) => ({ ...f, paymentScreenshot: file }));
                            }}
                            className="w-full text-gray-300 bg-gray-700 rounded px-3 py-2 mb-3"
                          />
                          <div className="w-full h-32 border border-gray-600 rounded overflow-hidden bg-gray-900 flex items-center justify-center">
                            {form.paymentScreenshot ? (
                              <img
                                src={URL.createObjectURL(form.paymentScreenshot)}
                                alt="Selected payment screenshot"
                                className="max-w-full max-h-full object-contain"
                              />
                            ) : (
                              <span className="text-gray-500 text-sm">No image selected</span>
                            )}
                          </div>
                        </div>

                        {/* Desktop Layout: Side by side */}
                        <div className="hidden md:flex items-center gap-4">
                          <div className="flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                setForm((f) => ({ ...f, paymentScreenshot: file }));
                              }}
                              className="w-full text-gray-300 bg-gray-700 rounded px-3 py-2"
                            />
                          </div>
                          <div className="w-24 h-24 border border-gray-600 rounded overflow-hidden bg-gray-900 flex items-center justify-center">
                            {form.paymentScreenshot ? (
                              <img
                                src={URL.createObjectURL(form.paymentScreenshot)}
                                alt="Selected payment screenshot"
                                className="max-w-full max-h-full object-contain"
                              />
                            ) : (
                              <span className="text-gray-500 text-xs">No image selected</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-white mb-2 font-semibold">UTR Number</label>
                        <input
                          type="text"
                          name="utrNumber"
                          value={form.utrNumber || ""}
                          onChange={(e) => setForm((f) => ({ ...f, utrNumber: e.target.value }))}
                          placeholder="Enter UTR / UPI Ref. Id"
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                        />
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={handleBackToForm}
                          className="px-5 py-3 rounded-lg border border-gray-600 text-gray-200 hover:bg-gray-800"
                        >
                          Back
                        </button>

                        <button
                          onClick={handlePayNow}
                          className="px-5 py-3 rounded-lg bg-gradient-to-r from-green-500 to-cyan-500 text-white font-semibold shadow-lg"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {step === "processing" && (
                  <div className="text-center py-12">
                    <div className="text-white font-semibold text-lg mb-3">Processing payment…</div>
                    <div className="text-gray-400">Please wait while we secure your transaction.</div>
                  </div>
                )}

                {step === "done" && (
                  <div className="text-center py-8">
                    <div className="text-2xl font-bold text-green-400 mb-3">Payment successful</div>
                    <div className="text-gray-300 mb-4">Thank you, {form.name}. We received your order.</div>
                    <div className="text-sm text-gray-400 mb-6">Order ID: <span className="font-mono text-white">{orderId}</span></div>

                    <div className="flex justify-center gap-4">
                      <a href="/packages" className="px-5 py-3 rounded-lg bg-cyan-500 text-white">Back to Packages</a>
                      <a href="/contact" className="px-5 py-3 rounded-lg border border-white text-white">Contact Support</a>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: price summary (hidden on mobile) */}
              <aside className="hidden lg:block lg:col-span-1 bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-6 border border-gray-700/50 shadow-xl">
                <h4 className="text-white font-bold text-lg mb-4">Order Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-300">
                    <span>Package:</span>
                    <span className="text-white font-medium">{pkgData.title}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Price:</span>
                    <span className="text-white font-medium">{form.price ? `₹${form.price}` : "TBD"}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3">
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total:</span>
                      <span>{form.price ? `₹${form.price}` : "TBD"}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <div className="text-sm text-gray-400">
                    Secure payment via UPI
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
