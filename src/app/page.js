// pages/index.js or app/page.js (depending on your Next.js version)
'use client';
import Head from 'next/head'
import { useState, useEffect } from 'react'
import Header from './component/include/header'
export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
     

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Navigation */}

           <Header />

        {/* Hero Section */}
        <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-cyan-800/20"></div>
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
                    That's why we offer a diverse range of courses—from foundational knowledge to 
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

        {/* Courses Section */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Digital Marketing Mastery",
                  duration: "12 weeks",
                  level: "Beginner to Advanced",
                  students: "2,500+",
                  rating: "4.9"
                },
                {
                  title: "Affiliate Marketing Blueprint",
                  duration: "8 weeks",
                  level: "Intermediate",
                  students: "1,800+",
                  rating: "4.8"
                },
                {
                  title: "E-commerce Business Strategy",
                  duration: "10 weeks",
                  level: "Advanced",
                  students: "1,200+",
                  rating: "4.9"
                },
                {
                  title: "Social Media Marketing",
                  duration: "6 weeks",
                  level: "Beginner",
                  students: "3,000+",
                  rating: "4.7"
                },
                {
                  title: "Content Creation & Copywriting",
                  duration: "8 weeks",
                  level: "Intermediate",
                  students: "2,200+",
                  rating: "4.8"
                },
                {
                  title: "Personal Branding Essentials",
                  duration: "4 weeks",
                  level: "Beginner",
                  students: "1,500+",
                  rating: "4.6"
                }
              ].map((course, index) => (
                <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:from-purple-800/30 hover:to-cyan-800/30 transition-all duration-300 transform hover:-translate-y-2 border border-gray-700/50">
                  <div className="h-48 bg-gradient-to-br from-purple-600/30 to-cyan-600/30 flex items-center justify-center">
                    <div className="text-6xl opacity-50">📚</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3">{course.title}</h3>
                    <div className="space-y-2 text-sm text-gray-300 mb-4">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="text-cyan-400">{course.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Level:</span>
                        <span className="text-purple-400">{course.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Students:</span>
                        <span className="text-green-400">{course.students}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rating:</span>
                        <span className="text-yellow-400">⭐ {course.rating}</span>
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-purple-700 transition-all">
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "10,000+", label: "Students Enrolled" },
                { number: "50+", label: "Expert Instructors" },
                { number: "200+", label: "Courses Available" },
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
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are transforming their careers with our innovative courses.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-cyan-600 hover:to-purple-700 transform hover:scale-105 transition-all shadow-xl">
                Get Started Free
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-purple-900 transition-all">
                View All Courses
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
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Courses</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Instructors</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
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