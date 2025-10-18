// pages/index.js or app/page.js (depending on your Next.js version)
'use client';
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Header from './component/include/header'
import Footer from './component/include/footer'
import PackagesGrid from './component/packages/PackagesGrid'
import WhyChooseProfitWay from './component/WhyChooseProfitWay'
import StatsSection from './component/StatsSection'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [packages, setPackages] = useState([]);
  const router = useRouter();
  const [busySlug, setBusySlug] = useState(null);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const response = await fetch('/api/packages');
        if (!response.ok) {
          throw new Error('Failed to fetch packages');
        }
        const packagesData = await response.json();

        // Parse features JSON for each package
        const processedPackages = packagesData.map(pkg => ({
          ...pkg,
          features: typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features
        }));

        setPackages(processedPackages);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPackages();
  }, []);

  useEffect(() => {
    // run only on client
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    // set initial value
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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

  // Carousel courses data
  const carouselCourses = [
    {
      title: "Google Adsense",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop&crop=center",
      url: "/courses/google-adsense"
    },
    {
      title: "Growth Mindset",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop&crop=center",
      url: "/courses/growth-mindset"
    },
    {
      title: "Instagram Mastery",
      image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop&crop=center",
      url: "/courses/instagram-mastery"
    },
    {
      title: "Lead Generation",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&crop=center",
      url: "/courses/lead-generation"
    },
    {
      title: "Affiliate Marketing",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&crop=center",
      url: "/courses/affiliate-marketing"
    },
    {
      title: "Email Marketing",
      image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=300&fit=crop&crop=center",
      url: "/courses/email-marketing"
    },
    {
      title: "Content Creation",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop&crop=center",
      url: "/courses/content-creation"
    },
    {
      title: "Digital Marketing",
      image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=300&fit=crop&crop=center",
      url: "/courses/digital-marketing"
    }
  ];

  // Responsive items per slide
  const getItemsPerSlide = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1; // Mobile: 1 item
      if (window.innerWidth < 1024) return 2; // Tablet: 2 items
      return 4; // Desktop: 4 items
    }
    return 4;
  };

  const [itemsPerSlide, setItemsPerSlide] = useState(4);
  const totalSlides = Math.ceil(carouselCourses.length / itemsPerSlide);

  // Update items per slide on window resize
  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(getItemsPerSlide());
    };

    // Set initial value
    setItemsPerSlide(getItemsPerSlide());
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [currentSlide]);

 

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        {/* Navigation */}
        <Header />

        {/* Hero Section with banner background */}
        <section
          id="home"
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1600&auto=format&fit=crop')",
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Light overlay to keep text readable */}
          <div className="absolute inset-0 bg-white/70"></div>
          {/* Subtle gradient overlay for brand colors */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 mix-blend-overlay"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
                Transform Your
                <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent block">
                  Future Through Learning
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                Revolutionary online education platform that integrates neuro-education with the arts,
                creating borderless, inclusive learning experiences without traditional constraints.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-600 hover:to-cyan-700 transform hover:scale-105 transition-all shadow-xl">
                  Start Learning Today
                </button>
                <button className="border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-900 hover:text-white transition-all">
                  Explore Courses
                </button>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-30 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full opacity-30 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full opacity-30 animate-ping"></div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">ProfitWay</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Unlock expertise with exclusive packages. Empower with industry-leading courses.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "🎓",
                  title: "Expert Instructors",
                  description: "Learn from industry experts and experienced educators who bring real-world experience to the classroom."
                },
                {
                  icon: "🚀",
                  title: "Innovative Methods",
                  description: "We employ cutting-edge teaching methodologies and latest technology to enhance learning experience."
                },
                {
                  icon: "🌐",
                  title: "Industry Connections",
                  description: "Strong connections with leading companies, providing valuable networking and internship opportunities."
                },
                {
                  icon: "🎯",
                  title: "Personalized Support",
                  description: "Personalized mentorship to help each student achieve their academic and career goals."
                },
                {
                  icon: "🏆",
                  title: "Recognized Programs",
                  description: "Industry-recognized certifications that enhance the value of your qualifications and career prospects."
                },
                {
                  icon: "💡",
                  title: "Future-Ready Skills",
                  description: "Specialized courses tailored to meet the demands of various industries and future job markets."
                }
              ].map((feature, index) => (
                <div key={index} className="group bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 hover:border-blue-300">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                  Our <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Mission</span>
                </h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    At ProfitWay, our mission is to empower learners globally through accessible,
                    innovative, and life-transforming education. We are committed to creating a dynamic
                    online learning environment that blends technology, creativity, and real-world skills.
                  </p>
                  <p>
                    We believe that education should be inclusive, engaging, and future-focused.
                    That&apos;s why we offer a diverse range of courses—from foundational knowledge to
                    digital entrepreneurship and personal development.
                  </p>
                  <p>
                    Our vision is to become a global leader in transformative online education,
                    where learning is not limited by geography, age, or circumstance.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-200 shadow-lg">
                  <div className="text-center mb-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold text-white">
                      SK
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Himanshu Kushwaha</h3>
                    <p className="text-blue-600 font-semibold">Founder & CEO</p>
                  </div>
                  <p className="text-gray-600 text-center leading-relaxed">
                    Dedicated to empowering individuals and businesses in the competitive world of digital marketing.
                    With extensive experience in business strategy and online revenue generation, he created ProfitWay
                    as a platform for ambitious achievers to unleash their potential and achieve financial freedom.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Courses Section */}
        <section id="courses" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Popular <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Courses</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Specialized courses tailored to meet the demands of various industries
              </p>
            </div>

            {/* Carousel Container */}
            <div className="relative">
              {/* Previous Button */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full transition-all duration-300 hover:scale-110 border border-gray-200 hover:border-blue-300 shadow-lg sm:block hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full transition-all duration-300 hover:scale-110 border border-gray-200 hover:border-blue-300 shadow-lg sm:block hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Carousel Content */}
              <div className="overflow-hidden sm:mx-12 mx-0">
                <div 
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div key={slideIndex} className="w-full flex-shrink-0">
                      <div className="grid gap-6" style={{
                        gridTemplateColumns: `repeat(${itemsPerSlide}, minmax(0, 1fr))`
                      }}>
                        {carouselCourses
                          .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                          .map((course, index) => (
                            <a
                              key={index}
                              href={course.url}
                              className="group block bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 hover:border-blue-300"
                            >
                              {/* Course Image */}
                              <div className="relative h-48 overflow-hidden">
                                <img 
                                  src={course.image} 
                                  alt={course.title}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                
                                {/* Title Overlay */}
                                <div className="absolute bottom-4 left-4 right-4">
                                  <h3 className="text-gray-900 font-bold text-lg leading-tight group-hover:text-blue-600 transition-colors">
                                    {course.title}
                                  </h3>
                                </div>

                                {/* Hover Effect Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                            </a>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Navigation Buttons */}
              <div className="flex justify-between mt-6 sm:hidden">
                <button
                  onClick={prevSlide}
                  className="bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full transition-all duration-300 border border-gray-200 hover:border-blue-300 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full transition-all duration-300 border border-gray-200 hover:border-blue-300 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-600 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                ></button>
              ))}
            </div>

            {/* View All Courses Button */}
            <div className="text-center mt-12">
              <a
                href="/courses"
                className="inline-block border-2 border-blue-500 text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105"
              >
                View All Courses →
              </a>
            </div>
          </div>
        </section>

        {/* Our Packages Section - Updated with new income-based packages */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PackagesGrid packages={packages} handleEnrollNow={handleEnrollNow} busySlug={busySlug}/>
          </div>
        </section>

        {/* Why Choose ProfitWay Section */}
        <WhyChooseProfitWay />

        {/* Stats Section */}
        <StatsSection />

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are earning while they learn with our innovative income packages.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all shadow-xl">
                Start Earning Today
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all">
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