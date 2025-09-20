// pages/about.js or app/about/page.js (depending on your Next.js version)
'use client';
import Head from 'next/head'
import { useState, useEffect } from 'react'
import Header from '../../components/Header/'

export default function About() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Head>
        <title>About Us - ProfitWay | Transforming Education Through Innovation</title>
        <meta name="description" content="Welcome to ProfitWay! Experience transformative learning with cutting-edge technology. Empowering your career and dreams, we're revolutionizing education." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navigation */}
        {/* <Header /> */}
        <Header/>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-cyan-800/20"></div>
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
                Dare to dream big and unlock your true potential with ProfitWay.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-xl">
                  Join Our Community
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-900 transition-all">
                  Explore Our Story
                </button>
              </div>
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-pink-400 to-cyan-400 rounded-full opacity-20 animate-ping"></div>
        </section>

        {/* Learning Without Boundaries Section */}
        <section className="py-20 bg-black/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  Learning Without 
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent block">
                    Boundaries
                  </span>
                </h2>
                <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                  <p>
                    With ProfitWay, geographical boundaries are no longer limitations to your education. 
                    Our courses allow you to learn from the comfort of your own home, while traveling, 
                    or from any location with internet access.
                  </p>
                  <p>
                    Whether you're in a bustling city or a remote village, our platform ensures that 
                    quality education is just a click away. Break free from traditional classroom 
                    constraints and embrace the future of learning.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-gradient-to-br from-purple-600/20 to-cyan-600/20 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
                  <div className="text-center">
                    <div className="text-6xl mb-6">🌍</div>
                    <h3 className="text-2xl font-bold text-white mb-4">Global Learning Network</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      Connect with learners from 50+ countries and access world-class education 
                      from anywhere in the world.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          24/7
                        </div>
                        <div className="text-gray-400 text-sm">Available</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          50+
                        </div>
                        <div className="text-gray-400 text-sm">Countries</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Expert Instructors Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-purple-600/20 to-cyan-600/20 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/50">
                  <div className="text-center">
                    <div className="text-6xl mb-6">👨‍🏫</div>
                    <h3 className="text-2xl font-bold text-white mb-4">Industry Experts</h3>
                    <p className="text-gray-300 leading-relaxed mb-6">
                      Learn from professionals who have real-world experience and are passionate 
                      about sharing their knowledge with the next generation.
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          10+
                        </div>
                        <div className="text-gray-400 text-xs">Years Exp.</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          50+
                        </div>
                        <div className="text-gray-400 text-xs">Instructors</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          4.9★
                        </div>
                        <div className="text-gray-400 text-xs">Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="order-1 lg:order-2">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                  Learn from 
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent block">
                    Industry Experts
                  </span>
                </h2>
                <div className="space-y-6 text-lg text-gray-300 leading-relaxed">
                  <p>
                    Our courses are led by industry experts and seasoned educators who bring their 
                    wealth of knowledge and experience to the virtual classroom. You'll receive 
                    top-notch instruction from the best in the field.
                  </p>
                  <p>
                    Each instructor is carefully selected based on their expertise, teaching ability, 
                    and passion for helping students succeed. They don't just teach theory—they 
                    share real-world insights and practical skills that you can apply immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-20 bg-black/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Meet Our <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Founder</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                The visionary behind ProfitWay's mission to transform education
              </p>
            </div>

            <div className="max-w-6xl mx-auto">
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
                        and businesses in the competitive world of digital marketing. With over a decade 
                        of experience in business strategy and online revenue generation, he has helped 
                        countless entrepreneurs achieve their goals.
                      </p>
                      <p>
                        His passion for education and technology led him to create ProfitWay as a platform 
                        for ambitious achievers to unleash their potential and achieve financial freedom. 
                        Under his leadership, ProfitWay has grown to become a trusted name in online education.
                      </p>
                      <p>
                        Himanshu believes that education should be transformative, practical, and accessible 
                        to everyone. His vision drives ProfitWay's commitment to innovation and excellence 
                        in online learning.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-lg p-4">
                        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          10+
                        </div>
                        <div className="text-gray-400 text-sm">Years Experience</div>
                      </div>
                      <div className="text-center bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-lg p-4">
                        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          10K+
                        </div>
                        <div className="text-gray-400 text-sm">Students Impacted</div>
                      </div>
                      <div className="text-center bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-lg p-4">
                        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          200+
                        </div>
                        <div className="text-gray-400 text-sm">Courses Created</div>
                      </div>
                      <div className="text-center bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-lg p-4">
                        <div className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                          50+
                        </div>
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
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our Mission & <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Vision</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Driving our commitment to transformative education
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:from-purple-800/30 hover:to-cyan-800/30 transition-all duration-300">
                <div className="text-5xl mb-6 text-center group-hover:scale-110 transition-transform">🎯</div>
                <h3 className="text-3xl font-bold text-white mb-6 text-center">Our Mission</h3>
                <p className="text-gray-300 leading-relaxed text-center text-lg">
                  To empower learners globally through accessible, innovative, and life-transforming education. 
                  We are committed to creating a dynamic online learning environment that blends technology, 
                  creativity, and real-world skills to prepare students for the future economy and help them 
                  achieve financial freedom.
                </p>
              </div>

              <div className="group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:from-purple-800/30 hover:to-cyan-800/30 transition-all duration-300">
                <div className="text-5xl mb-6 text-center group-hover:scale-110 transition-transform">🔮</div>
                <h3 className="text-3xl font-bold text-white mb-6 text-center">Our Vision</h3>
                <p className="text-gray-300 leading-relaxed text-center text-lg">
                  To become a global leader in transformative online education, where learning is not limited 
                  by geography, age, or circumstance. We envision a world where every individual has the 
                  opportunity to unlock their potential, pursue their dreams, and create a better future 
                  through quality education.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose ProfitWay Section */}
        <section className="py-20 bg-black/30">
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

        {/* Stats Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Our <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Impact</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Numbers that speak to our commitment to student success
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "10,000+", label: "Students Graduated", icon: "🎓" },
                { number: "95%", label: "Success Rate", icon: "📈" },
                { number: "50+", label: "Countries Reached", icon: "🌍" },
                { number: "4.9/5", label: "Average Rating", icon: "⭐" }
              ].map((stat, index) => (
                <div key={index} className="text-center bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
                  <div className="text-3xl mb-2">{stat.icon}</div>
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
              <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-xl">
                Start Learning Today
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-900 transition-all">
                Contact Us
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