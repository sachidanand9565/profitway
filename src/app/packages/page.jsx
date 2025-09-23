// pages/plans.js or app/plans/page.js
'use client';
import Head from 'next/head'
import { useState } from 'react'
import Header from '../component/include/header'

export default function Plans() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Exact packages from your handwritten notes with improved features
  const allPackages = [
    {
      id: 'basic',
      title: "BASIC PACKAGE",
      description: "Perfect starting point for digital marketing beginners",
      price: "₹249",
      originalPrice: "₹399",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop",
      features: ["Digital Marketing Course", "Basic Affiliate Training", "Email Support", "Mobile App Access"],
      incomeDetails: {
        active: "₹175",
        passive: "₹25"
      }
    },
    {
      id: 'medium',
      title: "MEDIUM PACKAGE", 
      description: "Enhanced learning with better income opportunities",
      price: "₹499",
      originalPrice: "₹799",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
      features: ["All Basic Features", "Advanced Marketing", "Live Q&A Sessions", "Priority Support"],
      incomeDetails: {
        active: "₹350",
        passive: "₹50"
      }
    },
    {
      id: 'pro',
      title: "PRO PACKAGE",
      description: "Advanced strategies for serious income generation", 
      price: "₹999",
      originalPrice: "₹1599",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&h=200&fit=crop",
      features: ["All Medium Features", "1-on-1 Mentoring", "Premium Tools", "VIP Community"],
      incomeDetails: {
        active: "₹700",
        passive: "₹100"
      }
    },
    {
      id: 'master',
      title: "MASTER PACKAGE",
      description: "Complete mastery with maximum earning potential",
      price: "₹1999",
      originalPrice: "₹3199",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop",
      features: ["All Pro Features", "Weekly Mentoring", "Advanced Tools", "Masterclasses"],
      incomeDetails: {
        active: "₹1400",
        passive: "₹200"
      }
    },
    {
      id: 'crown',
      title: "CROWN PACKAGE",
      description: "Ultimate package for serious entrepreneurs",
      price: "₹3999",
      originalPrice: "₹6399",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&h=200&fit=crop",
      features: ["All Master Features", "Personal Mentor", "Business Setup", "Done-for-You Marketing"],
      incomeDetails: {
        active: "₹3000",
        passive: "₹400"
      }
    },
    {
      id: 'royal',
      title: "ROYAL PACKAGE",
      description: "The most premium package with highest returns",
      price: "₹7999",
      originalPrice: "₹12799",
      image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=300&h=200&fit=crop",
      features: ["All Crown Features", "Success Manager", "White-Label Rights", "Lifetime Support"],
      incomeDetails: {
        active: "₹6000",
        passive: "₹800"
      }
    }
  ];

  const handleEnrollNow = (packageId) => {
    setSelectedPlan(packageId);
    // Add enrollment logic here
    console.log(`Enrolled in: ${packageId}`);
  };

  return (
    <>
      <Head>
        <title>All Packages - ProfitWay | Choose Your Income Level</title>
        <meta name="description" content="Choose from our income-generating packages. Start earning with ProfitWay's proven strategies." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />

        {/* Hero Section */}
        <section className="relative pt-32 pb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-cyan-800/20"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Income-Based Learning
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
                  Packages
                </span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Choose your package based on your income goals. From basic to royal level earnings.
              </p>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-bounce"></div>
        </section>

        {/* All Packages Section - Same UI as Individual Courses */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Packages</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Unlock expertise with exclusive packages. Empower with industry-leading courses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allPackages.map((pkg, index) => (
                <div key={pkg.id} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:from-purple-800/30 hover:to-cyan-800/30 transition-all duration-300 transform hover:-translate-y-2 border border-gray-700/50 group">
                  {/* Package Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={pkg.image} 
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Price Overlay */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-gray-900 font-bold text-sm">{pkg.price}</span>
                      <span className="text-gray-500 line-through text-xs ml-1">{pkg.originalPrice}</span>
                    </div>
                    
                    {/* Title Overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-bold text-lg leading-tight group-hover:text-cyan-400 transition-colors">
                        {pkg.title}
                      </h3>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Package Content */}
                  <div className="p-5">
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {pkg.description}
                    </p>
                    
                    {/* Income Details */}
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
                      <div className="text-green-400 font-semibold text-sm mb-2">
                        <span className="font-bold text-xl">{pkg.price}</span>
                          <span className="text-gray-500 line-through text-xs ml-1">{pkg.originalPrice}</span>
                      </div>
                      <div className="space-y-1">
                        
                      </div>
                    </div>
                    
                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    {/* Enroll Button */}
                    <button 
                      onClick={() => handleEnrollNow(pkg.id)}
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:from-cyan-600 hover:to-purple-700 transition-all transform hover:scale-105"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Income Comparison Table */}
        {/* <section className="py-20 bg-black/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Income <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Comparison</span>
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Compare earning potential across all packages
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50 overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-4 gap-4 text-center text-white mb-6">
                  <div className="font-bold text-cyan-400">Package</div>
                  <div className="font-bold text-purple-400">Price</div>
                  <div className="font-bold text-green-400">Active Income</div>
                  <div className="font-bold text-yellow-400">Passive Income</div>
                </div>
                {allPackages.map((pkg, index) => (
                  <div key={pkg.id} className="grid grid-cols-4 gap-4 text-center py-3 border-b border-gray-700/30 text-sm">
                    <div className="text-white font-medium">{pkg.title}</div>
                    <div className="text-cyan-400">{pkg.price}</div>
                    <div className="text-green-400">{pkg.incomeDetails.active}</div>
                    <div className="text-yellow-400">{pkg.incomeDetails.passive}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section> */}

        {/* Why Choose Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">ProfitWay</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Start earning while you learn with our proven income system
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "💰",
                  title: "Guaranteed Income",
                  description: "Start earning from day one with our proven income generation system"
                },
                {
                  icon: "📈", 
                  title: "Progressive Growth",
                  description: "Your income grows as you progress through higher packages"
                },
                {
                  icon: "🎯",
                  title: "Dual Income Streams",
                  description: "Both active and passive income opportunities in every package"
                },
                {
                  icon: "🤝",
                  title: "Community Support",
                  description: "Join a network of successful earners and learn from their experience"
                },
                {
                  icon: "📚",
                  title: "Comprehensive Training",
                  description: "Complete courses covering all aspects of digital income generation"
                },
                {
                  icon: "🔄",
                  title: "Continuous Support",
                  description: "Ongoing mentorship and support to maximize your earnings"
                }
              ].map((feature, index) => (
                <div key={index} className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 hover:from-purple-800/30 hover:to-cyan-800/30 transition-all duration-300 transform hover:-translate-y-2 border border-gray-700/50">
                  <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
       <section className="py-20 bg-black/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[
                { number: "30000+", label: "Max Monthly Income" },
                { number: "5000+", label: "Active Earners" },
                { number: "95%", label: "Success Rate" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-900/50 to-cyan-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Choose your income level and start your journey to financial freedom today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button 
                onClick={() => handleEnrollNow('basic')}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-xl"
              >
                Start with Basic Package
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-900 transition-all">
                View All Packages
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/50 py-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
                  ProfitWay
                </div>
                <p className="text-gray-400 mb-4">
                  Start earning while you learn with our proven digital marketing strategies.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">📘</a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">🐦</a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">💼</a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">📷</a>
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
                  <li><a href="/courses" className="hover:text-white transition-colors">Courses</a></li>
                  <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Live Chat</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Contact Info</h4>
                <div className="space-y-2 text-gray-400">
                  <p>📞 +91 98765 43210</p>
                  <p>📧 support@profitway.com</p>
                  <p>📍 Mumbai, India</p>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 ProfitWay. All rights reserved. Empowering digital entrepreneurs worldwide.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}