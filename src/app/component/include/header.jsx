"use client";
import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaUser, FaBook, FaChartLine, FaMoneyBillWave, FaUsers, FaComments, FaSignOutAlt, FaEdit, FaTrophy, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';

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

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isUserMenuOpen && !e.target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserMenuOpen]);

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
          scrollY > 20
            ? "bg-white/95 backdrop-blur-xl shadow-xl border-b border-gray-100"
            : "bg-white/80 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-4">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="flex items-center gap-2 md:gap-3 group">
                <div className="relative">
                  <img 
                    src="/logo.png" 
                    alt="ProfitWay" 
                    className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 rounded-full blur-xl transition-opacity duration-300"></div>
                </div>
              </a>
            </div>

            {/* Desktop Navigation - Show only when NOT logged in */}
            {!user && (
              <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
                <a 
                  href="/" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 rounded-lg hover:bg-blue-50"
                >
                  Home
                </a>
                <a 
                  href="/about" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 rounded-lg hover:bg-blue-50"
                >
                  About
                </a>
                <a 
                  href="/packages" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 rounded-lg hover:bg-blue-50"
                >
                  Courses
                </a>
                <a 
                  href="/contact" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 rounded-lg hover:bg-blue-50"
                >
                  Contact
                </a>
                <a 
                  href="/login" 
                  className="ml-2 px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Login
                </a>
              </div>
            )}

            {/* User Menu - Show when logged in */}
            {user && (
              <div className="flex items-center gap-3">
                {/* Quick Access Buttons - Desktop Only */}
                <div className="hidden lg:flex items-center gap-2">
                  <button
                    onClick={() => router.push('/user/dashboard')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent('dashboardMenuClick', { detail: 'mycourses' }))}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    My Courses
                  </button>
                </div>

                {/* User Profile Button */}
                <div className="relative user-menu-container">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center gap-3 transition-all duration-200 ${
                      isUserMenuOpen 
                        ? 'opacity-90' 
                        : 'hover:opacity-80'
                    }`}
                  >
                    {/* Circular Avatar */}
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg border-2 transition-all duration-200 ${
                      isUserMenuOpen ? 'border-blue-600 scale-105' : 'border-white'
                    }`}>
                      {user.photo ? (
                        <img src={user.photo} alt="avatar" className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <span className="text-white font-bold text-sm">
                          {(user.username || user.name || 'U').charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    {/* User Info - Desktop Only */}
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-semibold text-gray-800 leading-tight">
                        {user.username || user.name || 'User'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {user.package_name || 'Member'}
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <>
                      {/* Backdrop for mobile */}
                      <div 
                        className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
                        onClick={() => setIsUserMenuOpen(false)}
                      ></div>

                      {/* Menu */}
                      <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-5 duration-200">
                        {/* User Info Header */}
                        <div className="p-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center shadow-lg">
                              {user.photo ? (
                                <img src={user.photo} alt="avatar" className="w-full h-full object-cover rounded-xl" />
                              ) : (
                                <span className="text-white font-bold text-xl">
                                  {(user.username || user.name || 'U').charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-bold text-base truncate">
                                {user.username || user.name || 'User'}
                              </div>
                              <div className="text-blue-100 text-xs mt-0.5">
                                {user.referral_code && `ID: ${user.referral_code}`}
                              </div>
                              {user.package_name && (
                                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-md">
                                  <FaTrophy className="w-2.5 h-2.5 text-yellow-300" />
                                  <span className="text-white text-xs font-medium">{user.package_name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <button
                            onClick={() => {
                              router.push('/user/dashboard');
                              setIsUserMenuOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                          >
                            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                              <FaChartLine className="w-4 h-4 text-blue-600" />
                            </div>
                            <span>Dashboard</span>
                          </button>

                          <button
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent('dashboardMenuClick', { detail: 'myprofile' }));
                              setIsUserMenuOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                          >
                            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                              <FaEdit className="w-4 h-4 text-purple-600" />
                            </div>
                            <span>My Profile</span>
                          </button>

                          <button
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent('dashboardMenuClick', { detail: 'mycourses' }));
                              setIsUserMenuOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                          >
                            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                              <FaBook className="w-4 h-4 text-green-600" />
                            </div>
                            <span>My Courses</span>
                          </button>

                          <button
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent('dashboardMenuClick', { detail: 'affiliate' }));
                              setIsUserMenuOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                          >
                            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                              <FaTrophy className="w-4 h-4 text-amber-600" />
                            </div>
                            <span>Affiliate</span>
                          </button>

                          <button
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent('dashboardMenuClick', { detail: 'withdraw' }));
                              setIsUserMenuOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                          >
                            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                              <FaMoneyBillWave className="w-4 h-4 text-emerald-600" />
                            </div>
                            <span>Withdrawals</span>
                          </button>

                          <button
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent('dashboardMenuClick', { detail: 'team' }));
                              setIsUserMenuOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                          >
                            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                              <FaUsers className="w-4 h-4 text-indigo-600" />
                            </div>
                            <span>My Team</span>
                          </button>

                          <button
                            onClick={() => {
                              window.dispatchEvent(new CustomEvent('dashboardMenuClick', { detail: 'community' }));
                              setIsUserMenuOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-150"
                          >
                            <div className="w-8 h-8 bg-pink-50 rounded-lg flex items-center justify-center">
                              <FaComments className="w-4 h-4 text-pink-600" />
                            </div>
                            <span>Community</span>
                          </button>
                        </div>

                        {/* Logout Button */}
                        <div className="p-2 border-t border-gray-100">
                          <button
                            onClick={() => {
                              localStorage.removeItem('user');
                              setUser(null);
                              setIsUserMenuOpen(false);
                              router.push('/');
                            }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-all duration-150"
                          >
                            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                              <FaSignOutAlt className="w-4 h-4 text-red-600" />
                            </div>
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Mobile Menu Button - Show only when NOT logged in */}
            {!user && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              >
                {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
              </button>
            )}
          </div>

          {/* Mobile Menu - Show only when NOT logged in */}
          {!user && isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-2">
                <a 
                  href="/" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 rounded-lg"
                >
                  Home
                </a>
                <a 
                  href="/about" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 rounded-lg"
                >
                  About
                </a>
                <a 
                  href="/packages" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 rounded-lg"
                >
                  Courses
                </a>
                <a 
                  href="/contact" 
                  className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-all duration-200 rounded-lg"
                >
                  Contact
                </a>
                <a 
                  href="/login" 
                  className="mt-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg text-center hover:shadow-lg transition-all duration-200"
                >
                  Login
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Header;