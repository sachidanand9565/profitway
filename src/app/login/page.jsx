"use client";
import React, { useState } from "react";
import Head from "next/head";
import Header from '../component/include/header'
import Footer from '../component/include/footer'

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setError("");

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (response.ok) {
        // Store user session/token
        localStorage.setItem('user', JSON.stringify(data.user));
        setStatus('success');
        // Redirect to user dashboard
        window.location.href = '/user/dashboard';
      } else {
        setError(data.error || 'Login failed');
        setStatus(null);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setStatus(null);
    }
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
                  <input name="username" value={form.username} onChange={handleChange} required className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-lg border border-gray-300" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Password</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} required className="w-full bg-gray-50 text-gray-900 px-4 py-3 rounded-lg border border-gray-300" />
                </div>
                <div className="flex items-center justify-between">
                  <a href="/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm">
                    Forgot password?
                  </a>
                  <button 
                    type="submit" 
                    disabled={status === 'sending'}
                    className={`px-12 py-2 rounded-lg text-white flex items-center gap-2 transition-all ${
                      status === 'sending' 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:opacity-90'
                    }`}
                  >
                    {status === 'sending' ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Logging in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </div>
                {error && <div className="text-red-600">{error}</div>}
                {status === 'success' && <div className="text-green-600">Login successful! Redirecting...</div>}
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
