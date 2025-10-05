// pages/plans.js or app/plans/page.js
'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from 'next/head'
import Header from '../component/include/header'
import Footer from '../component/include/footer'
import PackagesGrid from '../component/packages/PackagesGrid'

export default function Plans() {
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const router = useRouter();
  const [busySlug, setBusySlug] = useState(null);
  const [allPackages, setAllPackages] = useState([]);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const response = await fetch('/api/packages');
        if (!response.ok) {
          throw new Error('Failed to fetch packages');
        }
        const packages = await response.json();
        console.log(packages)

        // Parse features JSON for each package
        const processedPackages = packages.map(pkg => ({
          ...pkg,
          features: typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features
        }));

        setAllPackages(processedPackages);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPackages();
  }, []);

  const handleEnrollNow = (pkg) => {
    try {
      sessionStorage.setItem("checkout_pkg", JSON.stringify(pkg));
    } catch (e) {
      console.warn("sessionStorage unavailable", e);
    }
    const slug = encodeURIComponent((pkg.slug || pkg.title).toString().toLowerCase().replace(/\s+/g, "-"));
    setBusySlug(slug);
    // small delay to show micro-interaction if needed
    setTimeout(() => {
      router.push(`/checkout?slug=${slug}`);
    }, 120);
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

        {/* Banner Hero */}
        <section className="relative">
          <div
            className="relative bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1508830524289-0adcbe822b40?auto=format&fit=crop&w=1600&q=80')",
            }}
          >
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-28">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                  Income-Based Learning
                  <span className="block bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Packages
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Choose your package based on your income goals. From basic to royal level earnings.
                </p>

                <div className="mt-6 flex justify-center gap-4">
                  <a href="#packages" className="inline-block bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:from-cyan-600 hover:to-purple-700 transition-all">View Packages</a>
                  <a href="/contact" className="inline-block border border-white text-white px-6 py-3 rounded-full font-medium hover:bg-white hover:text-purple-900 transition-all">Contact Us</a>
                </div>
              </div>
            </div>

            {/* Decorative shapes */}
            <div className="absolute top-10 left-8 w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-20 blur-3xl" />
            <div className="absolute bottom-12 right-8 w-28 h-28 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-2xl" />
          </div>
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

            <PackagesGrid packages={allPackages} handleEnrollNow={handleEnrollNow} busySlug={busySlug} />
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
                onClick={() => allPackages.length > 0 && handleEnrollNow(allPackages[0])}
                disabled={allPackages.length === 0}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {allPackages.length > 0 ? `Start with ${allPackages[0].title}` : "Loading..."}
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-900 transition-all">
                View All Packages
              </button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}