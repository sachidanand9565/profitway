"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener("scroll", handleScroll);

      // set initial value
      setScrollY(window.scrollY);

      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div>
      <Head>
        <title>ProfitWay - Transform Your Future Through Learning</title>
        <meta
          name="description"
          content="Revolutionary online education platform combining neuro-education with arts. Unlock your potential with our innovative learning experience."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navigation */}
        <nav
          className={`fixed w-full z-50 transition-all duration-300 ${
            scrollY > 50
              ? "bg-black/80 backdrop-blur-lg"
              : "bg-transparent"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
                <div className="flex items-center">
                  <a href="/" className="flex items-center gap-3">
                    {/* logo — use public file */}
                    <img src="/logo.png" alt="ProfitWay" className="h-12 md:h-14 w-auto object-contain" />
                  </a>
                </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex space-x-8">
                <a href="/" className="text-white hover:text-cyan-400 transition-colors">Home</a>
                <a href="/about" className="text-white hover:text-cyan-400 transition-colors">About</a>
                <a href="/packages" className="text-white hover:text-cyan-400 transition-colors">Courses Packages</a>
                <a href="/contact" className="text-white hover:text-cyan-400 transition-colors">Contact</a>
              </div>

              <div className="hidden md:flex items-center space-x-4">
                <a href="/login" className="text-white hover:text-cyan-400 transition-colors">Login</a>
                <a href="/signup" className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-cyan-600 hover:to-purple-700 transition-all">
                  Get Started
                </a>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white hover:text-cyan-400 transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
              <div className="md:hidden bg-black/90 backdrop-blur-lg rounded-lg mt-2 py-4">
                <div className="flex flex-col space-y-4 px-4">
                  <a href="/" className="text-white hover:text-cyan-400 transition-colors">Home</a>
                  <a href="/about" className="text-white hover:text-cyan-400 transition-colors">About</a>
                  <a href="/packages" className="text-white hover:text-cyan-400 transition-colors">Courses Packages</a>
                  <a href="/contact" className="text-white hover:text-cyan-400 transition-colors">Contact</a>
                  <div className="pt-4 border-t border-gray-700">
                    <a href="/login" className="text-white hover:text-cyan-400 transition-colors mb-2 block">Login</a>
                    <a href="/signup" className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-2 rounded-full w-full text-center">Get Started</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Header;
