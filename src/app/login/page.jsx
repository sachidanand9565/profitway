"use client";
import React, { useState } from "react";
import Head from "next/head";
import Header from '../component/include/header'
import Footer from '../component/include/footer'

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setForm({ email: '', password: '' });
    }, 800);
  };

  return (
    <>
      <Head>
        <title>Login - ProfitWay</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <Header />

        <main className="py-24">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Login to your account</h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Email</label>
                  <input name="email" value={form.email} onChange={handleChange} required className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-lg border border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Password</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-lg border border-gray-300" />
                </div>
                <div className="flex items-center justify-between">

                  <button type="submit" className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-12 py-2 rounded-lg">Sign in</button>
                </div>
                {status === 'success' && <div className="text-green-600">Logged in (demo)</div>}
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
