"use client";
import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaWhatsapp } from "react-icons/fa";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black/50 py-12 border-t border-gray-800 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <img src="/logo.png" alt="ProfitWay" className="h-8 w-auto inline-block" />
            </div>
            <p className="text-gray-400 mb-4">
              Start earning while you learn with our proven digital marketing strategies.
            </p>
           <div className="flex space-x-4">
  <a href="https://www.facebook.com/share/19rSdLYzU9/" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
    <FaFacebookF size={20} color="#1877F2" />
  </a>
  <a href="https://x.com/ProfitWayss?t=K1sTv6cau4P7HfrMIYm9Ng&s=09" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
    <FaTwitter size={20} color="#1DA1F2" />
  </a>
  <a href="https://whatsapp.com/channel/0029Vb6VmBj3AzNJKMPDmC2T" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
    <FaWhatsapp size={20} color="#0ef82dff" />
  </a>
  <a href="https://www.instagram.com/profitways.in?igsh=MWl5eW94OTI1eWxr" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
    <FaInstagram size={20} color="#E4405F" />
  </a>
</div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/packages" className="hover:text-white transition-colors">Courses</a></li>
              <li><a href="/login" className="hover:text-white transition-colors">Login</a></li>
              <li><a href="/signup" className="hover:text-white transition-colors">Sign Up</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/contact" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="/" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4">Stay updated with our latest courses and news.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-800 text-white px-4 py-2 rounded-l-lg flex-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 rounded-r-lg hover:from-cyan-600 hover:to-purple-700 transition-all">
                →
              </button>
            </div>
          </div>
        </div>
        
        <nav className="flex gap-4 flex-wrap mt-8">
  <a href="/" className="text-gray-200 hover:text-cyan-400">Home</a>
  <a href="/about" className="text-gray-200 hover:text-cyan-400">About</a>
  <a href="/packages" className="text-gray-200 hover:text-cyan-400">Packages</a>
  <a href="/contact" className="text-gray-200 hover:text-cyan-400">Contact</a>
  <a href="/login" className="text-gray-200 hover:text-cyan-400">Login</a>
</nav>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {year} ProfitWay. All rights reserved. Empowering digital entrepreneurs worldwide.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
