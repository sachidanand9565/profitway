'use client';
import Head from 'next/head'
import { useState, useEffect } from 'react'
import Header from '@/app/component/include/header'

export default function About() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setScrollY(window.scrollY)
      }
    }
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <>
      <Head>
        <title>About Us - ProfitWay | Transforming Education Through Innovation</title>
        <meta name="description" content="Welcome to ProfitWay! Experience transformative learning with cutting-edge technology. Empowering your career and dreams." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-cyan-800/20"></div>
          
          {/* Floating Elements */}
          <div className="absolute top-32 left-10 w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full opacity-20 animate-ping"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Welcome to
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block">
                  ProfitWay!
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Experience transformative learning with cutting-edge technology. Empowering your career and dreams, 
                we're revolutionizing education. Join our community of go-getters, dreamers, and achievers.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <a 
                  href="/courses"
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-xl"
                >
                  Join Our Community
                </a>
                <a 
                  href="#story"
                  className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-900 transition-all"
                >
                  Explore Our Story
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* About Introduction */}
        <section id="story" className="py-20 bg-black/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                About <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">ProfitWay</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Transforming lives through innovative education and practical skills
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center" 
                    alt="ProfitWay Learning"
                    className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent rounded-2xl"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-white">10K+</div>
                          <div className="text-gray-300 text-sm">Students</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-white">50+</div>
                          <div className="text-gray-300 text-sm">Countries</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                  <p>
                    ProfitWay Online Learning Platform was founded with a powerful mission: to revolutionize 
                    education by making high-quality learning accessible, engaging, and future-ready.
                  </p>
                  <p>
                    What began as a vision to bridge the gap between traditional education and modern digital 
                    needs has grown into a dynamic platform empowering learners around the world.
                  </p>
                  <p>
                    From our early days, we focused on creating a space where learners of all ages could 
                    thrive—anytime, anywhere. We embraced innovative teaching methods and real-world skill 
                    development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Meet Our <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Founder</span>
              </h2>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-purple-600/20 to-cyan-600/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-700/50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                  <div className="text-center lg:text-left">
                    <div className="w-48 h-48 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full mx-auto lg:mx-0 mb-6 flex items-center justify-center text-6xl font-bold text-white">
                      HK
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-bold text-white">Himanshu Kushwaha</h3>
                      <p className="text-cyan-400 font-semibold text-lg">Founder & CEO</p>
                      <div className="flex justify-center lg:justify-start space-x-4 mt-4">
                        <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-2xl">💼</a>
                        <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-2xl">🐦</a>
                        <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-2xl">📘</a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-4 text-gray-300 leading-relaxed">
                      <p>
                        Himanshu Kushwaha is a visionary entrepreneur dedicated to empowering individuals 
                        and businesses in the competitive world of digital marketing. With extensive experience 
                        in business strategy and online revenue generation, he created ProfitWay as a platform 
                        for ambitious achievers to unleash their potential and achieve financial freedom.
                      </p>
                      <p>
                        His passion for education and technology drives ProfitWay's commitment to innovation 
                        and excellence in online learning, helping students transform their careers and lives.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-lg p-4">
                        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">10+</div>
                        <div className="text-gray-400 text-sm">Years Experience</div>
                      </div>
                      <div className="text-center bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-lg p-4">
                        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">10K+</div>
                        <div className="text-gray-400 text-sm">Students Impacted</div>
                      </div>
                      <div className="text-center bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-lg p-4">
                        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">200+</div>
                        <div className="text-gray-400 text-sm">Courses Created</div>
                      </div>
                      <div className="text-center bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-lg p-4">
                        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">50+</div>
                        <div className="text-gray-400 text-sm">Countries Reached</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-20 bg-black/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our Mission & <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Vision</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:from-purple-800/30 hover:to-cyan-800/30 transition-all duration-300">
                <div className="relative h-64">
                  <img 
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=300&fit=crop&crop=center" 
                    alt="Our Mission"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    <div className="text-4xl bg-white/10 backdrop-blur-sm rounded-lg p-3">🎯</div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-3xl font-bold text-white mb-6 text-center">Our Mission</h3>
                  <p className="text-gray-300 leading-relaxed text-center text-lg">
                    To empower learners globally through accessible, innovative, and life-transforming education. 
                    We create a dynamic learning environment that blends technology, creativity, and real-world skills.
                  </p>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700/50 hover:from-purple-800/30 hover:to-cyan-800/30 transition-all duration-300">
                <div className="relative h-64">
                  <img 
                    src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=300&fit=crop&crop=center" 
                    alt="Our Vision"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/70 to-transparent"></div>
                  <div className="absolute top-6 left-6">
                    <div className="text-4xl bg-white/10 backdrop-blur-sm rounded-lg p-3">🔮</div>
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-3xl font-bold text-white mb-6 text-center">Our Vision</h3>
                  <p className="text-gray-300 leading-relaxed text-center text-lg">
                    To become a global leader in transformative online education, where learning is not limited 
                    by geography, age, or circumstance. Every individual deserves the opportunity to unlock their potential.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose ProfitWay Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why Choose <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">ProfitWay?</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover what makes us the preferred choice for ambitious learners worldwide
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "🎓",
                  title: "Expert Instructors",
                  description: "Learn from industry experts and experienced educators who bring real-world experience to the classroom.",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop&crop=center"
                },
                {
                  icon: "🚀",
                  title: "Innovative Methods",
                  description: "We employ cutting-edge teaching methodologies and latest technology to enhance learning experience.",
                  image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=200&fit=crop&crop=center"
                },
                {
                  icon: "🌐",
                  title: "Global Network",
                  description: "Strong connections with leading companies, providing valuable networking and internship opportunities.",
                  image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&h=200&fit=crop&crop=center"
                },
                {
                  icon: "🎯",
                  title: "Personalized Support",
                  description: "Personalized mentorship to help each student achieve their academic and career goals.",
                  image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop&crop=center"
                },
                {
                  icon: "🏆",
                  title: "Recognized Programs",
                  description: "Industry-recognized certifications that enhance the value of your qualifications and career prospects.",
                  image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop&crop=center"
                },
                {
                  icon: "💡",
                  title: "Future-Ready Skills",
                  description: "Specialized courses tailored to meet the demands of various industries and future job markets.",
                  image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&h=200&fit=crop&crop=center"
                }
              ].map((feature, index) => (
                <div key={index} className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:from-purple-800/30 hover:to-cyan-800/30 transition-all duration-300 transform hover:-translate-y-2 border border-gray-700/50">
                  <div className="relative h-48">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <div className="text-3xl bg-white/10 backdrop-blur-sm rounded-lg p-2 group-hover:scale-110 transition-transform">
                        {feature.icon}
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Process Section */}
        <section className="py-20 bg-black/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                How We <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Transform Lives</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="space-y-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">1</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Expert-Led Learning</h3>
                      <p className="text-gray-300">Learn from industry experts who bring real-world experience and cutting-edge knowledge to every lesson.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">2</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Hands-On Practice</h3>
                      <p className="text-gray-300">Apply what you learn through practical projects and real-world scenarios that build confidence and skills.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">3</div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Career Transformation</h3>
                      <p className="text-gray-300">Get personalized career guidance and industry connections to accelerate your professional growth.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop&crop=center" 
                    alt="Learning Process"
                    className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent rounded-2xl"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-white mb-1">95%</div>
                        <div className="text-gray-300 text-sm">Success Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "10,000+", label: "Students Graduated", icon: "🎓" },
                { number: "95%", label: "Success Rate", icon: "📈" },
                { number: "50+", label: "Countries Reached", icon: "🌍" },
                { number: "4.9/5", label: "Average Rating", icon: "⭐" }
              ].map((stat, index) => (
                <div key={index} className="text-center bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:scale-105 transition-transform">
                  <div className="text-4xl mb-4">{stat.icon}</div>
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
              Ready to Transform Your Future?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are transforming their careers and achieving their dreams with ProfitWay.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <a 
                href="/courses"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-xl"
              >
                Start Learning Today
              </a>
              <a 
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-900 transition-all"
              >
                Contact Us
              </a>
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
                  Transforming education through innovative online learning experiences.
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
                  <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="/courses" className="hover:text-white transition-colors">Courses</a></li>
                  <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-white font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
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
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 ProfitWay. All rights reserved. Empowering learners worldwide.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}