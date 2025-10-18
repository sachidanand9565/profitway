"use client";
import React, { useState } from "react";
import Head from "next/head";
import Header from '../component/include/header'
import Footer from '../component/include/footer'

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just simulate success. Replace with real API integration as needed.
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    }, 900);
  };

  return (
    <>
      <Head>
        <title>Contact Us - ProfitWay</title>
        <meta name="description" content="Contact ProfitWay for support, partnerships, or general inquiries." />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <Header />

        <main className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

              {/* Left: Image */}
              <div className="w-full rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1200&q=80"
                  alt="Contact us illustration"
                  className="w-full h-96 object-cover md:h-[520px] block"
                />
              </div>

              {/* Right: Form + Details */}
              <div>
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
                  <p className="text-gray-600 mb-6">Questions about courses, partnerships, or support? Send us a message and we'll reply within 24 hours.</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
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
                        className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Message</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={6}
                        required
                        className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-700 transition-all"
                        disabled={status === 'sending'}
                      >
                        {status === 'sending' ? 'Sending...' : 'Send Message'}
                      </button>

                      {status === 'sent' && (
                        <div className="text-green-600 font-medium">Message sent — we will reply shortly.</div>
                      )}
                    </div>
                  </form>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Info</h3>
                        <p className="text-gray-600">📞 +91 7460901738</p>
                    <p className="text-gray-600">📧 info.profitways@gmail.com</p>
                    <p className="text-gray-600">📍 Kushinagar, India</p>
                  </div>


                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
