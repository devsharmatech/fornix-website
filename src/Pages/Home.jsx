import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import banner from '../Assets/banner.avif';

function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const [flippedCards, setFlippedCards] = useState({});

  const stats = [
    { value: "5000+", label: "Students Enrolled" },
    { value: "4000+", label: "Qualified Doctors" },
    { value: "100+", label: "Expert Faculty" },
    { value: "70,000+", label: "Questions Bank" }
  ];

  const courses = [
    { title: "NEET UG", path: "/courses/neet-ug", color: "bg-orange-500", desc: "Comprehensive prep for undergraduate medical entrance." },
    { title: "NEET PG", path: "/courses/neet-pg", color: "bg-orange-500", desc: "Advanced concepts for postgraduate aspirants." },
    { title: "AMC", path: "/courses/amc", color: "bg-orange-500", desc: "Australian Medical Council exam preparation." },
    { title: "FMGE", path: "/courses/FMGE", color: "bg-orange-500", desc: "Foreign Medical Graduate Examination mastery." },
    { title: "PLAB", path: "/courses/PLAB", color: "bg-orange-500", desc: "Your gateway to UK medical practice." }
  ];

  const testimonials = [
    { name: "Dr. Sarah Johnson", role: "NEET PG Rank 150", quote: "Fornix's QBank changed the game for me. The explanations are incredible." },
    { name: "Rajesh Kumar", role: "FMGE Qualified", quote: "I cleared FMGE in my first attempt thanks to the structured video lectures." },
    { name: "Emily Chen", role: "AMC Candidate", quote: "The best resource for AMC clinical reasoning. Highly recommended!" }
  ];

  const faqs = [
    { q: "Can I access the courses on mobile?", a: "Yes! Our platform is fully responsive and optimized for mobile learning." },
    { q: "Is there a free trial?", a: "We offer free demo subjects and practice tests so you can try before you buy." },
    { q: "How often is content updated?", a: "Our medical board updates content weekly to align with the latest exam patterns." },
    { q: "What happens if I get stuck?", a: "Premium members get access to 24/7 doubt resolution with expert faculty." }
  ];

  return (
    <div className="pb-0">

      {/* Hero Section */}
      <section className="relative mb-20">
        <div className="relative h-150 overflow-hidden">
          <img
            src={banner}
            alt="Fornix Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 to-transparent flex flex-col justify-center px-6 md:px-20 pt-24">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in-up">
              Master Medicine <br />
              <span className="text-orange-500">With Confidence</span>
            </h1>
            <p className="text-gray-200 text-xl mb-8 max-w-xl animate-fade-in-up delay-100">
              Your ultimate companion for NEET UG/PG, FMGE, PLAB, and AMC.
              Smart tools, expert content, and proven results.
            </p>
            {/* <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
              <Link to="/courses" className="bg-orange-500 text-white px-10 py-4 rounded-full font-bold shadow-lg hover:bg-orange-600 transition transform hover:scale-105">
                Explore Courses
              </Link>
              <Link to="/signup" className="border-2 border-white text-white px-10 py-4 rounded-full font-bold hover:bg-white hover:text-gray-900 transition transform hover:scale-105">
                Join for Free
              </Link>
            </div> */}
          </div>

          {/* Social Media Icons - Vertical */}
          <div className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-20">
            {/* WhatsApp */}
            <a
              href="https://wa.me/+996552448787"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110 group"
              aria-label="WhatsApp"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/fornix.academy?igsh=czgzMGx4ZzBzb3c="
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110"
              aria-label="Instagram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/share/17ts8VVkbF/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110"
              aria-label="Facebook"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href="https://t.me/fornixacademy"
              target="_blank"
              rel="noopener noreferrer"
              className=" bg-[#26a2e0] text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110"
              aria-label="Telegram"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">

                <path d="M23.91 3.79L20.3 20.84c-.25 1.21-.98 1.5-2 .94l-5.5-4.07-2.66 2.57c-.3.3-.55.56-1.1.56-.72 0-.6-.27-.84-.95L6.3 13.7l-5.45-1.7c-1.18-.35-1.19-1.16.26-1.75l21.26-8.2c.97-.43 1.9.24 1.53 1.73z" />

              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 -mt-20 relative z-10 max-w-7xl mx-4 px-6 rounded-xl shadow-xl lg:mx-auto border border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-4">
              <h3 className="text-4xl font-bold text-orange-500 mb-2">{stat.value}</h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-orange-500 font-bold uppercase tracking-wide">Why Us</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Reinventing Medical Education</h2>
            <p className="text-gray-600 mt-4">Click any card to learn more</p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 items-start">
            {[
              {
                title: "Clinically Oriented",
                desc: "Learn with case-based scenarios that mirror real-world practice.",
                icon: (
                  <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                ),
                details: [
                  "Real patient case studies from top medical institutions",
                  "Clinical reasoning frameworks used by expert physicians",
                  "Integration of basic sciences with clinical practice",
                  "Step-by-step diagnostic approach training"
                ]
              },
              {
                title: "High-Yield QBank",
                desc: "7000+ questions curated to test high-probability exam topics.",
                icon: (
                  <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                details: [
                  "Questions written by very experienced doctors",
                  "Detailed explanations for every answer choice",
                  "Performance analytics to track your progress",
                  "Regular updates based on latest exam patterns"
                ]
              },
              {
                title: "Smart Analytics",
                desc: "Track your weak spots with our AI-driven performance dashboard.",
                icon: (
                  <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                details: [
                  "AI-powered weak area identification",
                  "Personalized study recommendations",
                  "Progress tracking across all subjects",
                  "Predictive score estimation for exams"
                ]
              },
              {
                title: "Audio Podcasts",
                desc: "High-yield medical audio content for learning anytime, anywhere.",
                icon: (
                  <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                ),
                details: [
                  "Expert-narrated topic summaries",
                  "Perfect for commute or workout sessions",
                  "Covers high-yield topics across all subjects"
                ]
              },
              {
                title: "24/7 Chatbot Support",
                desc: "Get instant answers to your medical queries round the clock.",
                icon: (
                  <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                ),
                details: [
                  "AI-powered instant doubt resolution",
                  "Access to medical knowledge database",
                  "Quick concept clarifications",
                  "Available across all devices"
                ]
              },
              {
                title: "Smart Revision",
                desc: "Revise smart. Perform better with spaced repetition.",
                icon: (
                  <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                details: [
                  "Scientifically-proven spaced repetition algorithm",
                  "Flashcards for quick revision",
                  "Custom revision schedules",
                  "Focus on your weak areas automatically"
                ]
              }
            ].map((item, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden cursor-pointer ${flippedCards[index] ? 'ring-2 ring-orange-500' : ''}`}
                onClick={() => setFlippedCards(prev => prev[index] ? {} : { [index]: true })}
              >
                <div className="p-8">
                  <div className="flex items-start justify-between">
                    <div className="mb-4">{item.icon}</div>
                    <svg
                      className={`w-6 h-6 text-orange-500 transition-transform duration-300 ${flippedCards[index] ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>

                  {/* Expandable Details */}
                  <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${flippedCards[index] ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
                      }`}
                  >
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-bold text-orange-500 uppercase tracking-wide mb-3">Key Features</h4>
                      <ul className="space-y-2">
                        {item.details.map((detail, i) => (
                          <li key={i} className="flex items-start text-sm text-gray-700">
                            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="leading-relaxed">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      {/* <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-orange-500 font-bold uppercase tracking-wide">Our Courses</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Choose Your Path</h2>
          </div>
          <Link to="/courses" className="text-orange-500 font-semibold hover:text-orange-600 hidden md:block">
            View All Courses →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 lg:grid-cols-3 gap-8">
          {courses.map((course, i) => (
            <Link key={i} to={course.path} className="group">
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition duration-300 border border-gray-100 h-full flex flex-col">
                <div className={`h-2 bg-gray-900 group-hover:${course.color.replace('bg-', 'bg-')} transition-colors duration-300`}></div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-orange-500 transition">{course.title}</h3>
                  <p className="text-gray-600 mb-6 flex-1">{course.desc}</p>
                  <div className="flex items-center text-orange-500 font-semibold mt-auto">
                    Start Learning
                    <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section> */}

      {/* Testimonials */}
      <section className="bg-gray-900 py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          {/* Abstract Pattern */}
          <svg width="100%" height="100%">
            <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#fff" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl font-bold text-center mb-16">Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-gray-800 p-8 rounded-2xl border border-gray-700 hover:-translate-y-2 transition duration-300">
                <div className="text-orange-500 text-4xl mb-4">"</div>
                <p className="text-gray-300 italic mb-6 text-lg">{t.quote}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center font-bold text-xl mr-4">
                    {t.name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold">{t.name}</h4>
                    <p className="text-orange-500 text-sm">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">FAQ'S</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-xl bg-white overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex justify-between items-center p-6 text-left hover:bg-gray-50 transition"
              >
                <span className="font-semibold text-lg text-gray-800">{faq.q}</span>
                <span className={`transform transition duration-200 ${openFaq === i ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openFaq === i && (
                <div className="p-6 pt-0 text-gray-600 border-t border-gray-100 bg-gray-50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 max-w-6xl mx-auto px-6 mb-20">
        <div className="bg-orange-500 rounded-3xl p-12 md:p-20 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">Ready to Ace Your Exams?</h2>
          <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto relative z-10">
            Join thousands of medical students who trust Fornix for their exam preparation.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link to="/login" className="bg-white text-orange-600 px-12 py-4 rounded-full font-bold shadow-lg hover:bg-gray-100 transition">
              Get Started Now
            </Link>
            <Link to="/contact" className="border-2 border-white text-white px-12 py-4 rounded-full font-bold hover:bg-white/10 transition">
              Contact Support
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;

