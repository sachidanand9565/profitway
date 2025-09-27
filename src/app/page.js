// pages/index.js or app/page.js (depending on your Next.js version)
'use client';
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import Header from './component/include/header'
import Footer from './component/include/footer'

// (removed slug helper) using real package images from pkg.image

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

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

  const allCourses = [
    {
      title: "Digital Marketing Mastery",
      description: "Complete digital marketing course covering SEO, SEM, social media, and analytics",
      duration: "12 weeks",
      level: "Beginner to Advanced",
      students: "2,500+",
      rating: "4.9",
      price: "₹12,999",
      originalPrice: "₹19,999",
      features: ["SEO Optimization", "Google Ads", "Social Media Marketing", "Email Marketing", "Analytics"]
    },
    {
      title: "Affiliate Marketing Blueprint",
      description: "Master the art of affiliate marketing and build passive income streams",
      duration: "8 weeks",
      level: "Intermediate",
      students: "1,800+",
      rating: "4.8",
      price: "₹8,999",
      originalPrice: "₹14,999",
      features: ["Affiliate Networks", "Commission Strategies", "Content Marketing", "Traffic Generation", "Conversion Optimization"]
    },
    {
      title: "E-commerce Business Strategy",
      description: "Build and scale your online business with proven e-commerce strategies",
      duration: "10 weeks",
      level: "Advanced",
      students: "1,200+",
      rating: "4.9",
      price: "₹15,999",
      originalPrice: "₹24,999",
      features: ["Online Store Setup", "Product Research", "Supply Chain", "Customer Acquisition", "Scaling Strategies"]
    },
    {
      title: "Social Media Marketing",
      description: "Dominate social platforms and build engaged communities",
      duration: "6 weeks",
      level: "Beginner",
      students: "3,000+",
      rating: "4.7",
      price: "₹6,999",
      originalPrice: "₹9,999",
      features: ["Content Strategy", "Platform Optimization", "Influencer Marketing", "Paid Advertising", "Community Building"]
    },
    {
      title: "Content Creation & Copywriting",
      description: "Create compelling content that converts and engages audiences",
      duration: "8 weeks",
      level: "Intermediate",
      students: "2,200+",
      rating: "4.8",
      price: "₹9,999",
      originalPrice: "₹15,999",
      features: ["Copywriting Techniques", "Video Production", "Blog Writing", "Sales Funnels", "Brand Storytelling"]
    },
    {
      title: "Personal Branding Essentials",
      description: "Build a powerful personal brand that opens doors and creates opportunities",
      duration: "4 weeks",
      level: "Beginner",
      students: "1,500+",
      rating: "4.6",
      price: "₹4,999",
      originalPrice: "₹7,999",
      features: ["Brand Identity", "LinkedIn Optimization", "Networking", "Thought Leadership", "Online Presence"]
    },
    {
      title: "YouTube Marketing Mastery",
      description: "Grow your YouTube channel and monetize your content effectively",
      duration: "6 weeks",
      level: "Beginner to Intermediate",
      students: "1,900+",
      rating: "4.7",
      price: "₹7,999",
      originalPrice: "₹12,999",
      features: ["Channel Setup", "Video SEO", "Thumbnail Design", "Monetization", "Audience Engagement"]
    },
    {
      title: "Email Marketing Automation",
      description: "Build automated email sequences that convert leads into customers",
      duration: "5 weeks",
      level: "Intermediate",
      students: "1,400+",
      rating: "4.8",
      price: "₹6,499",
      originalPrice: "₹10,999",
      features: ["Email Sequences", "Automation Tools", "List Building", "Segmentation", "A/B Testing"]
    },
    {
      title: "Freelancing Success Blueprint",
      description: "Start and scale your freelancing business with proven strategies",
      duration: "7 weeks",
      level: "Beginner",
      students: "2,100+",
      rating: "4.6",
      price: "₹5,999",
      originalPrice: "₹9,999",
      features: ["Client Acquisition", "Pricing Strategies", "Portfolio Building", "Project Management", "Scaling Business"]
    }
  ];

  // Updated packages from handwritten notes with proper features
  const packages = [
    {
      name: "BASIC PACKAGE",
      image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=600&fit=crop",
      subtitle: "Perfect for Beginners",
      price: "₹249",
      originalPrice: "₹399",
      duration: "Income Generation",
      popular: false,
      features: [
        "Access to Digital Marketing Course",
        "Basic Affiliate Marketing Training",
        "Email Support",
        "Mobile App Access",
        "Community Access"
      ],
      courses: ["Digital Marketing Basics", "Income Generation Strategies"],
      savings: "37% OFF",
      incomeDetails: {
        active: "₹175",
        passive: "₹25"
      }
    },
    {
      name: "MEDIUM PACKAGE",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
      subtitle: "Enhanced Earning Potential",
      price: "₹499",
      originalPrice: "₹799",
      duration: "Income Generation",
      popular: false,
      features: [
        "All Basic Package Features",
        "Advanced Marketing Strategies",
        "Live Q&A Sessions",
        "Priority Support",
        "Bonus Templates & Tools"
      ],
      courses: ["All Basic Features", "Advanced Marketing", "Sales Strategies"],
      savings: "37% OFF",
      incomeDetails: {
        active: "₹350",
        passive: "₹50"
      }
    },
    {
      name: "PRO PACKAGE",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
      subtitle: "Professional Income Level",
      price: "₹999",
      originalPrice: "₹1599",
      duration: "Income Generation",
      popular: true,
      features: [
        "All Medium Package Features",
        "1-on-1 Mentoring Sessions",
        "Premium Marketing Tools",
        "VIP Community Access",
        "Business Strategy Course"
      ],
      courses: ["All Medium Features", "Pro Marketing Tools", "Business Strategy"],
      savings: "37% OFF",
      incomeDetails: {
        active: "₹700",
        passive: "₹100"
      }
    },
    {
      name: "MASTER PACKAGE",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop",
      subtitle: "Master Level Earnings",
      price: "₹1999",
      originalPrice: "₹3199",
      duration: "Income Generation",
      popular: false,
      features: [
        "All Pro Package Features",
        "Weekly Mentoring Calls",
        "Advanced Business Tools",
        "Exclusive Masterclasses",
        "Revenue Optimization Course"
      ],
      courses: ["All Pro Features", "Master Classes", "Advanced Business Tools"],
      savings: "37% OFF",
      incomeDetails: {
        active: "₹1400",
        passive: "₹200"
      }
    },
    {
      name: "CROWN PACKAGE",
      image: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=800&h=600&fit=crop",
      subtitle: "Elite Business Level",
      price: "₹3999",
      originalPrice: "₹6399",
      duration: "Income Generation",
      popular: false,
      features: [
        "All Master Package Features",
        "Personal Business Mentor",
        "Done-for-You Marketing",
        "Business Setup Assistance",
        "Partner Network Access"
      ],
      courses: ["All Master Features", "Business Setup", "Revenue Optimization"],
      savings: "37% OFF",
      incomeDetails: {
        active: "₹3000",
        passive: "₹400"
      }
    },
    {
      name: "ROYAL PACKAGE",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop",
      subtitle: "Ultimate Success Package",
      price: "₹7999",
      originalPrice: "₹12799",
      duration: "Income Generation",
      popular: false,
      features: [
        "All Crown Package Features",
        "Dedicated Success Manager",
        "White-Label Resources",
        "Lifetime Community Access",
        "Custom Strategy Development"
      ],
      courses: ["All Crown Features", "Done-for-You Services", "Lifetime Access"],
      savings: "37% OFF",
      incomeDetails: {
        active: "₹6000",
        passive: "₹800"
      }
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
          {/* Dark overlay to keep text readable */}
          <div className="absolute inset-0 bg-black/60"></div>
          {/* Subtle gradient overlay for brand colors */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-800/10 to-cyan-800/10 mix-blend-overlay"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Transform Your
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
                  Future Through Learning
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Revolutionary online education platform that integrates neuro-education with the arts, 
                creating borderless, inclusive learning experiences without traditional constraints.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-xl">
                  Start Learning Today
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-900 transition-all">
                  Explore Courses
                </button>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full opacity-20 animate-ping"></div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-black/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">ProfitWay</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
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
                <div key={index} className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 hover:from-purple-800/30 hover:to-cyan-800/30 transition-all duration-300 transform hover:-translate-y-2 border border-gray-700/50">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  Our <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Mission</span>
                </h2>
                <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
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
                <div className="bg-gradient-to-br from-purple-600/20 to-cyan-600/20 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
                  <div className="text-center mb-8">
                    <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold text-white">
                      SK
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Himanshu Kushwaha</h3>
                    <p className="text-cyan-400 font-semibold">Founder & CEO</p>
                  </div>
                  <p className="text-gray-300 text-center leading-relaxed">
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
        <section id="courses" className="py-20 bg-black/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Popular <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Courses</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Specialized courses tailored to meet the demands of various industries
              </p>
            </div>

            {/* Carousel Container */}
            <div className="relative">
              {/* Previous Button */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 border border-gray-700/50 hover:border-purple-400/50 sm:block hidden"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 border border-gray-700/50 hover:border-purple-400/50 sm:block hidden"
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
                              className="group block bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl border border-gray-700/50 hover:border-purple-400/50"
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
                                  <h3 className="text-white font-bold text-lg leading-tight group-hover:text-cyan-400 transition-colors">
                                    {course.title}
                                  </h3>
                                </div>

                                {/* Hover Effect Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 border border-gray-700/50 hover:border-purple-400/50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextSlide}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 border border-gray-700/50 hover:border-purple-400/50"
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
                      ? 'bg-gradient-to-r from-cyan-400 to-purple-400 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                ></button>
              ))}
            </div>

            {/* View All Courses Button */}
            <div className="text-center mt-12">
              <a 
                href="/courses"
                className="inline-block border-2 border-purple-400 text-purple-400 px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-400 hover:text-white transition-all transform hover:scale-105"
              >
                View All Courses →
              </a>
            </div>
          </div>
        </section>

        {/* Our Packages Section - Updated with new income-based packages */}
        <section id="all-courses" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Packages</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Unlock expertise with exclusive packages. Choose your income level and start earning.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {packages.slice(0, 6).map((pkg, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:from-purple-800/30 hover:to-cyan-800/30 transition-all duration-300 transform hover:-translate-y-2 border border-gray-700/50 group">
                  {/* Package Image */}
                  <div className="relative h-48 overflow-hidden">
                    {/* Use real photographic image from package data */}
                    <img
                      src={pkg.image}
                      alt={`${pkg.name} banner`}
                      loading="lazy"
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
                        {pkg.name}
                      </h3>
                    </div>

                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Package Content */}
                  <div className="p-5">
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {pkg.subtitle}
                    </p>
                    
                    {/* Income Details */}
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
                      <div className="text-green-400 font-semibold text-sm mb-2">
                        <span className="font-bold text-lg">{pkg.price}</span>
                        <span className="text-gray-500 line-through text-xs ml-1">{pkg.originalPrice}</span>
                      </div>
                      
                    </div>
                    
                    {/* Features */}
                    <div className="space-y-2 mb-4">
                      {pkg.features.slice(0, 3).map((feature, idx) => (
                        <div key={idx} className="flex items-center text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    {/* Enroll Button */}
                    <button 
                      className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-2.5 rounded-lg font-medium hover:from-cyan-600 hover:to-purple-700 transition-all transform hover:scale-105"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Button */}
            <div className="text-center mt-12">
              <a 
                href="/packages"
                className="inline-block border-2 border-purple-400 text-purple-400 px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-400 hover:text-white transition-all transform hover:scale-105"
              >
                View All Packages →
              </a>
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

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-900/50 to-cyan-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are earning while they learn with our innovative income packages.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-xl">
                Start Earning Today
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