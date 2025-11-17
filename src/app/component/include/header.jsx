"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUser, FaBook, FaChartLine, FaMoneyBillWave, FaUsers, FaComments, FaSignOutAlt } from 'react-icons/fa';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [user, setUser] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener("scroll", handleScroll);

      // set initial value
      setScrollY(window.scrollY);

      // Check if user is logged in
      const raw = localStorage.getItem('user');
      if (raw) {
        try {
          setUser(JSON.parse(raw));
        } catch (e) {
          setUser(null);
        }
      }

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

      <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        {/* Navigation */}
        <nav
          className={`fixed w-full z-50 transition-all duration-300 ${
            scrollY > 50
              ? "bg-white/90 backdrop-blur-lg shadow-lg"
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

              {/* Desktop Menu: hide general links when user is logged in */}
              {!user && (
                <div className="hidden md:flex space-x-8">
                  <a href="/" className="text-gray-900 hover:text-blue-600 transition-colors">Home</a>
                  <a href="/about" className="text-gray-900 hover:text-blue-600 transition-colors">About</a>
                  <a href="/packages" className="text-gray-900 hover:text-blue-600 transition-colors">Courses Packages</a>
                  <a href="/contact" className="text-gray-900 hover:text-blue-600 transition-colors">Contact</a>
                </div>
              )}

              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                        <FaUser className="w-4 h-4 text-white" />
                      </div>
                      <span>{user.username}</span>
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm font-medium text-gray-900">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <nav className="py-2">
                          <a href="/user/dashboard" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600">
                            <FaUser className="w-4 h-4" />
                            <span>Dashboard</span>
                          </a>
                          <div className="border-t border-gray-200 mt-2 pt-2 px-4">
                            <button
                              onClick={() => {
                                localStorage.removeItem('user');
                                setUser(null);
                                setIsUserMenuOpen(false);
                                router.push('/');
                              }}
                              className="flex items-center gap-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                            >
                              <FaSignOutAlt className="w-4 h-4" />
                              <span>Logout</span>
                            </button>
                          </div>
                        </nav>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <a href="/login" className="text-gray-900 hover:text-blue-600 transition-colors">Login</a>
                    <a href="/signup" className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-cyan-700 transition-all">
                      Get Started
                    </a>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-900 hover:text-blue-600 transition-colors"
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
                      <div className="md:hidden bg-white/95 backdrop-blur-lg rounded-lg mt-2 py-4 shadow-lg border border-gray-200">
                        <div className="flex flex-col space-y-4 px-4">
                          {/* general links hidden when logged in */}
                          {!user && (
                            <>
                              <a href="/" className="text-gray-900 hover:text-blue-600 transition-colors">Home</a>
                              <a href="/about" className="text-gray-900 hover:text-blue-600 transition-colors">About</a>
                              <a href="/packages" className="text-gray-900 hover:text-blue-600 transition-colors">Courses Packages</a>
                              <a href="/contact" className="text-gray-900 hover:text-blue-600 transition-colors">Contact</a>
                            </>
                          )}
                          <div className="pt-4 border-t border-gray-300">
                            {user ? (
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2 pb-2">
                                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                                    <FaUser className="w-4 h-4 text-white" />
                                  </div>
                                  <span className="text-sm font-medium">{user.username}</span>
                                </div>
                                <a href="/user/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded">
                                  <FaUser className="w-4 h-4" />
                                  <span>Dashboard</span>
                                </a>
                                <button
                                  onClick={() => {
                                    localStorage.removeItem('user');
                                    setUser(null);
                                    setIsMenuOpen(false);
                                    router.push('/');
                                  }}
                                  className="flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left rounded"
                                >
                                  <FaSignOutAlt className="w-4 h-4" />
                                  <span>Logout</span>
                                </button>
                              </div>
                            ) : (
                              <>
                                <a href="/login" className="text-gray-900 hover:text-blue-600 transition-colors mb-2 block">Login</a>
                                <a href="/signup" className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-2 rounded-full w-full text-center hover:from-blue-600 hover:to-cyan-700 transition-all">Get Started</a>
                              </>
                            )}
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
