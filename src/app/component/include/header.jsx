"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUser, FaBook, FaChartLine, FaMoneyBillWave, FaUsers, FaComments, FaSignOutAlt, FaEdit } from 'react-icons/fa';

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
    <div className="bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Head>
        <title>ProfitWay - Transform Your Future Through Learning</title>
        <meta
          name="description"
          content="Revolutionary online education platform combining neuro-education with arts. Unlock your potential with our innovative learning experience."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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

            {/* User Menu - Right side */}
            {user && (
              <div className="flex items-center relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-gray-900 hover:text-blue-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                    <FaUser className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden md:block text-sm font-medium">{user.username}</span>
                </button>

                {/* User Menu Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                          <FaUser className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium">{user.username}</span>
                      </div>
                    </div>
                    <nav className="py-2">
                      <a
                        href="/user/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <FaUser className="w-4 h-4" />
                        <span>Dashboard</span>
                      </a>
                      <button
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('dashboardMenuClick', { detail: 'myprofile' }));
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full text-left"
                      >
                        <FaEdit className="w-4 h-4" />
                        <span>My Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('dashboardMenuClick', { detail: 'mycourses' }));
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full text-left"
                      >
                        <FaBook className="w-4 h-4" />
                        <span>My Courses</span>
                      </button>
                      <button
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('dashboardMenuClick', { detail: 'affiliate' }));
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full text-left"
                      >
                        <FaChartLine className="w-4 h-4" />
                        <span>Affiliate</span>
                      </button>
                      <button
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('dashboardMenuClick', { detail: 'withdraw' }));
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full text-left"
                      >
                        <FaMoneyBillWave className="w-4 h-4" />
                        <span>Withdrawals</span>
                      </button>
                      <button
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('dashboardMenuClick', { detail: 'team' }));
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full text-left"
                      >
                        <FaUsers className="w-4 h-4" />
                        <span>My Team</span>
                      </button>
                      <button
                        onClick={() => {
                          window.dispatchEvent(new CustomEvent('dashboardMenuClick', { detail: 'community' }));
                          setIsUserMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 w-full text-left"
                      >
                        <FaComments className="w-4 h-4" />
                        <span>Community</span>
                      </button>
                    </nav>
                    <div className="border-t border-gray-200 pt-2 px-4">
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
                  </div>
                )}
              </div>
            )}

            {/* Desktop Menu: hide general links when user is logged in */}
            {!user && (
              <div className="hidden md:flex space-x-8">
                <a href="/" className="text-gray-900 hover:text-blue-600 transition-colors">Home</a>
                <a href="/about" className="text-gray-900 hover:text-blue-600 transition-colors">About</a>
                <a href="/packages" className="text-gray-900 hover:text-blue-600 transition-colors">Courses Packages</a>
                <a href="/contact" className="text-gray-900 hover:text-blue-600 transition-colors">Contact</a>
              </div>
            )}

          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
