"use client";
import React, { useState } from "react";
import Head from "next/head";
import Header from '../component/include/header'
import Footer from '../component/include/footer'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => { setStatus('created'); setForm({ name: '', email: '', password: '' }); }, 900);
  };

  return (
    <>
      <Head>
        <title>Sign up - ProfitWay</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />

        <main className="py-24">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-8 border border-gray-700/50">
              <h1 className="text-2xl font-bold text-white mb-4">Create an account</h1>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Full name</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Email</label>
                  <input name="email" value={form.email} onChange={handleChange} required className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Password</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg" />
                </div>
                <div className="flex items-center justify-between">
                  <a href="/login" className="text-sm text-cyan-400 hover:underline">Already have an account?</a>
                  <button type="submit" className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-5 py-2 rounded-lg">Create</button>
                </div>
                {status === 'created' && <div className="text-green-400">Account created (demo)</div>}
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
