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

  const [pkgData, setPkgData] = useState({ title: "", price: "", image: "", slug: "", id: null });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
    packageTitle,
    price: qPrice,
    state: "",
    sponsorCode: "",
    paymentScreenshot: null,
    utrNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState(null);

  // UI step: 'form' | 'review' | 'processing' | 'done'
  const [step, setStep] = useState("form");
  const [orderId, setOrderId] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [doneFade, setDoneFade] = useState(false);
  const [orderPrice, setOrderPrice] = useState(null);

  // New state variables for validation
  const [emailExists, setEmailExists] = useState(false);
  const [sponsorName, setSponsorName] = useState(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [checkingSponsor, setCheckingSponsor] = useState(false);

  // comprehensive list of Indian states and union territories
  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

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
          id: parsed.id || null,
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
    // fallback to query params - try to get package ID from slug
    const getPackageIdFromSlug = async (slug) => {
      if (!slug) return null;
      try {
        const response = await fetch(`/api/packages?slug=${slug}`);
        if (response.ok) {
          const pkg = await response.json();
          return pkg.id || null;
        }
      } catch (e) {
        console.warn('Failed to fetch package ID from slug:', e);
      }
      return null;
    };

    const initializePackageData = async () => {
      let packageId = null;
      if (slug) {
        packageId = await getPackageIdFromSlug(slug);
      }
      setPkgData({ title: packageTitle, price: qPrice, image: qImage, slug, id: packageId });
      setForm((s) => ({ ...s, packageTitle: packageTitle, price: qPrice }));
    };

    initializePackageData();
  }, [slug, qTitle, qPrice, qImage, packageTitle]);

  // If user previously completed an order, allow showing the success panel from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('last_order');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.orderId) {
          setOrderId(parsed.orderId);
          // show success panel with basic info if caller wants
          // do not automatically switch UI unless user explicitly revisits checkout
        }
      }
    } catch (e) {}
  }, []);

  // Check if email exists
  useEffect(() => {
    if (!form.email || !form.email.includes('@')) {
      setEmailExists(false);
      return;
    }

    const checkEmail = async () => {
      setCheckingEmail(true);
      try {
        const response = await fetch(`/api/check-email?email=${encodeURIComponent(form.email)}`);
        if (response.ok) {
          const result = await response.json();
          setEmailExists(result.exists);
        } else {
          setEmailExists(false);
        }
      } catch (error) {
        console.error('Error checking email:', error);
        setEmailExists(false);
      } finally {
        setCheckingEmail(false);
      }
    };

    const debounceTimer = setTimeout(checkEmail, 500); // Debounce for 500ms
    return () => clearTimeout(debounceTimer);
  }, [form.email]);

  // Check sponsor code
  useEffect(() => {
    if (!form.sponsorCode || form.sponsorCode.trim() === '') {
      setSponsorName(null);
      return;
    }

    const checkSponsor = async () => {
      setCheckingSponsor(true);
      try {
        const response = await fetch(`/api/check-sponsor?code=${encodeURIComponent(form.sponsorCode)}`);
        if (response.ok) {
          const result = await response.json();
          setSponsorName(result.name || null);
        } else {
          setSponsorName(null);
        }
      } catch (error) {
        console.error('Error checking sponsor:', error);
        setSponsorName(null);
      } finally {
        setCheckingSponsor(false);
      }
    };

    const debounceTimer = setTimeout(checkSponsor, 500); // Debounce for 500ms
    return () => clearTimeout(debounceTimer);
  }, [form.sponsorCode]);

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
    if (!form.password || !form.confirmPassword) {
      alert("Please fill password and confirm password before proceeding.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match. Please try again.");
      return;
    }
    if (form.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    if (emailExists) {
      alert("This email is already registered. Please use a different email address.");
      return;
    }
    setStep("review");
  };

  // Helper function to compress image if needed
  const compressImage = (file) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        // Max width 800px, maintain aspect ratio
        const maxWidth = 800;
        const ratio = maxWidth / img.width;
        canvas.width = maxWidth;
        canvas.height = img.height * ratio;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        // Compress to JPEG with quality 0.8
        canvas.toBlob(resolve, 'image/jpeg', 0.8);
      };
      img.onerror = (error) => {
        reject(new Error('Failed to load image. Please ensure the file is a valid image.'));
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // Helper function to convert file to base64, with compression for images
  const fileToBase64 = async (file) => {
    try {
      console.log('[checkout] fileToBase64 start', { name: file.name, size: file.size, type: file.type });
      let processedFile = file;
      if (file && file.type && file.type.indexOf('image/') === 0) {
        try {
          const compressed = await compressImage(file);
          // compressed may be a Blob
          if (compressed && compressed.size) {
            processedFile = compressed;
            console.log('[checkout] image compressed', { original: file.size, compressed: processedFile.size });
          }
        } catch (compErr) {
          console.warn('[checkout] image compression failed, using original file', compErr);
          processedFile = file;
        }
      }

      return await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(processedFile);
        reader.onload = () => {
          try {
            const res = reader.result;
            console.log('[checkout] file read complete', { length: res ? res.length : 0 });
            resolve(res);
          } catch (e) {
            reject(e);
          }
        };
        reader.onerror = (error) => {
          console.error('[checkout] file read error', error);
          reject(new Error('Failed to read file. Please try again.'));
        };
      });
    } catch (error) {
      console.error('[checkout] fileToBase64 error', error);
      throw new Error('Failed to process image: ' + (error && error.message ? error.message : String(error)));
    }
  };

 // Key improvements for handlePayNow function
// Replace your existing handlePayNow with this improved version

const handlePayNow = async () => {
  // Validation
  if (!form.paymentScreenshot) {
    alert("कृपया payment screenshot upload करें");
    return;
  }
  if (!form.utrNumber || form.utrNumber.trim() === "") {
    alert("कृपया UTR number enter करें");
    return;
  }

  setStep("processing");
  setStatus("sending");

  try {
    console.log('[checkout] handlePayNow start', { name: form.name, email: form.email, phone: form.phone, hasScreenshot: !!form.paymentScreenshot });
    // Convert payment screenshot to base64
    let paymentScreenshotBase64 = null;
    if (form.paymentScreenshot) {
      try {
        paymentScreenshotBase64 = await fileToBase64(form.paymentScreenshot);
        console.log('[checkout] paymentScreenshotBase64 length', paymentScreenshotBase64 ? paymentScreenshotBase64.length : 0);
      } catch (imageError) {
        console.error('[checkout] Image processing error:', imageError);
        throw new Error("Failed to process image: " + (imageError && imageError.message ? imageError.message : String(imageError)));
      }
    }

    // Prepare data for API - ensure packageId is numeric
    let packageId = pkgData.id;
    if (!packageId && pkgData.slug) {
      // Try to get package ID from slug if not already available
      try {
        const pkgResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/packages?slug=${pkgData.slug}`);
        if (pkgResponse.ok) {
          const pkg = await pkgResponse.json();
          packageId = pkg.id || null;
        }
      } catch (e) {
        console.warn('Failed to fetch package ID from slug in checkout:', e);
      }
    }

    const orderData = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      message: form.message,
      packageId: packageId || null,
      packageTitle: pkgData.title,
      price: form.price,
      state: form.state,
      city: form.city,
      sponsorCode: form.sponsorCode,
      paymentScreenshot: paymentScreenshotBase64,
      utrNumber: form.utrNumber,
      password: form.password,
    };

    // Send to API with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    let response = null;
    let result = null;
    try {
      console.log('[checkout] sending orderData', { packageId, packageTitle: pkgData.title, price: form.price });
      response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
        signal: controller.signal,
      });
      result = await response.json();
      console.log('[checkout] api response', { status: response.status, ok: response.ok, result });
    } finally {
      clearTimeout(timeoutId);
    }

    if (response && response.ok && result && result.success) {
      // Success handling
      const id = "ORD" + Date.now().toString().slice(-6);
      const finalPrice = form.price || pkgData.price;
      setOrderId(id);
      setOrderPrice(finalPrice);
      setStatus("paid");
      setStep("done");

      // Persist order
      try {
        localStorage.setItem('last_order', JSON.stringify({
          orderId: id,
          name: form.name,
          packageTitle: pkgData.title,
          price: finalPrice,
          date: new Date().toISOString()
        }));
      } catch (e) {
        console.warn('Could not persist order to localStorage', e);
      }

      setTimeout(() => setDoneFade(true), 10);

      // Clear session
      try {
        sessionStorage.removeItem("checkout_pkg");
      } catch (e) {}
    } else {
      throw new Error((result && result.error) || "Failed to process order");
    }
  } catch (error) {
    console.error("Payment error:", error);

    // Better error handling
    let errorMessage = "Payment submit करने में error हुआ। कृपया फिर से try करें।";

    if (error.name === 'AbortError') {
      errorMessage = "Request timeout हो गया। कृपया अपना internet connection check करें और फिर से try करें।";
    } else if (!navigator.onLine) {
      errorMessage = "Internet connection नहीं है। कृपया अपना connection check करें।";
    } else if (error.message && error.message.includes('Failed to process image')) {
      errorMessage = "Image process नहीं हो पाई। कृपया छोटी image select करें (max 5MB) और फिर से try करें।";
    } else if (error.message && error.message.includes('File size')) {
      errorMessage = "File बहुत बड़ी है। कृपया छोटी image select करें (max 5MB)।";
    } else if (error.message && (error.message.includes('Failed to load image') || error.message.includes('Failed to read file'))) {
      errorMessage = "Invalid image file। कृपया valid image file select करें।";
    } else if (error.message && (error.message.includes('Failed to fetch') || error.message.includes('Network'))) {
      errorMessage = "Network error। कृपया अपना internet connection check करें।";
    } else if (error.response && !error.response.ok) {
      errorMessage = error.message || "Server error। कृपया कुछ देर बाद फिर से try करें।";
    }

    // Show a friendly alert and revert to review step so user can retry
    alert(errorMessage);
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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <Header />

        <main className="py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Checkout</h1>
              <p className="text-gray-600 mt-2">
                You're enrolling for:{" "}
                <span className="text-blue-600 font-semibold">{pkgData.title}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
           
              {/* Center: form or review */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                {step === "form" && (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Your details</h3>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="rounded-md bg-gray-50 p-3 border border-gray-200">
                        <div className="text-sm text-gray-600 mb-1">Selected Package</div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <div className="text-gray-900 font-semibold">{pkgData.title}</div>
                            <div className="text-gray-500 text-sm">Price: {pkgData.price || pkgData.price || "TBD"}</div>
                          </div>
                          {pkgData.image ? <img src={pkgData.image} alt={pkgData.title} className="w-20 h-12 object-cover rounded" /> : null}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Full name</label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Email address</label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className={`w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                            emailExists ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                          }`}
                        />
                        {checkingEmail && <div className="text-sm text-blue-600 mt-1">Checking...</div>}
                        {form.email && !checkingEmail && emailExists && <div className="text-sm text-red-600 mt-1">This email is already registered</div>}
                        {form.email && !checkingEmail && !emailExists && form.email.includes('@') && <div className="text-sm text-green-600 mt-1">Email available</div>}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Mobile number</label>
                        <input
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          required
                          className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-1  gap-4">
                        <div>
                          <label className="block text-sm text-gray-700 mb-1">State</label>
                          <select
                            name="state"
                            value={form.state}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select state</option>
                            {states.map((st) => (
                              <option key={st} value={st}>{st}</option>
                            ))}
                          </select>
                        </div>

                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Address (optional)</label>
                        <input
                          name="address"
                          value={form.address}
                          onChange={handleChange}
                          className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Sponsor Code (optional)</label>
                        <input
                          name="sponsorCode"
                          value={form.sponsorCode}
                          onChange={handleChange}
                          placeholder="Enter sponsor / referral code"
                          className={`w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${
                            sponsorName === null && form.sponsorCode && !checkingSponsor ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                          }`}
                        />
                        {checkingSponsor && <div className="text-sm text-blue-600 mt-1">Checking...</div>}
                        {form.sponsorCode && !checkingSponsor && sponsorName && <div className="text-sm text-green-600 mt-1">Sponsor: {sponsorName}</div>}
                        {form.sponsorCode && !checkingSponsor && sponsorName === null && <div className="text-sm text-red-600 mt-1">Invalid sponsor code</div>}
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Password</label>
                        <input
                          name="password"
                          type="password"
                          value={form.password}
                          onChange={handleChange}
                          required
                          className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Confirm Password</label>
                        <input
                          name="confirmPassword"
                          type="password"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          required
                          className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Message / Notes</label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          rows={4}
                          className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <button
                          type="submit"
                          disabled={status === "sending"}
                          className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-700 transition-all"
                        >
                          Review & Pay
                        </button>

                        {status === "sent" && (
                          <div className="text-green-600 font-medium">Request received — we will contact you shortly.</div>
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
                              <div className="text-gray-400 text-sm">Price: {pkgData.price || pkgData.price || "TBD"}</div>
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
                                <td className="py-2">{form.price || pkgData.price || "TBD"}</td>
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
                      <h3 className="text-lg font-bold text-white mb-4">Please Pay Rs. {form.price || pkgData.price || "TBD"} /- On below given UPI</h3>
                      <div className="text-center mb-6">
<img
  src="/QR.jpeg"
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
                            capture="environment"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file && file.size > 5 * 1024 * 1024) {
                                alert("File size must be less than 5MB. Please select a smaller image.");
                                return;
                              }
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
                              capture="environment"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file && file.size > 5 * 1024 * 1024) {
                                  alert("File size must be less than 5MB. Please select a smaller image.");
                                  return;
                                }
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
                  <div className={`text-center py-8 transform transition-all duration-500 ${doneFade ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <div className="text-2xl font-bold text-green-400 mb-3">Request submit successful</div>
                    <div className="text-gray-300 mb-4">Thank you, {form.name}. Your request has been submitted successfully.</div>

                    <div className="mx-auto my-4 max-w-md bg-white rounded-lg p-4 text-left text-gray-900 shadow">
                      <h4 className="font-semibold mb-2">Order Summary</h4>
                      <div className="flex justify-between"><span>Package:</span><span>{pkgData.title}</span></div>
                      <div className="flex justify-between"><span>Price:</span><span>{orderPrice ? `₹${orderPrice}` : 'TBD'}</span></div>
                      <div className="border-t mt-3 pt-2 flex justify-between font-bold"><span>Total:</span><span>{orderPrice ? `₹${orderPrice}` : 'TBD'}</span></div>
                    </div>

                    <div className="flex justify-center gap-4">
                      <a href="/packages" className="px-5 py-3 rounded-lg bg-cyan-500 text-white">Back to Packages</a>
                      <a href="/contact" className="px-5 py-3 rounded-lg border border-white text-white">Contact Support</a>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: price summary (hidden on mobile) */}
              {step !== 'done' && (
              <aside className="hidden lg:block lg:col-span-1 bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                <h4 className="text-gray-900 font-bold text-lg mb-4">Order Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Package:</span>
                    <span className="text-gray-900 font-medium">{pkgData.title}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Price:</span>
                    <span className="text-gray-900 font-medium">{pkgData.price ? `₹${form.price}` : "TBD"}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between text-gray-900 font-bold text-lg">
                      <span>Total:</span>
                      <span>{form.price ? `₹${pkgData.price}` : "TBD"}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <div className="text-sm text-gray-500">
                    Secure payment via UPI
                  </div>
                </div>
              </aside>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}