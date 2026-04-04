import React from "react";
import { Link } from 'react-router-dom';
import banner from '../Assets/banner.webp';

function About() {
  const team = [
    { name: "Dr. A. Sharma", role: "Chief Medical Officer", desc: "Ex-AIIMS prof with 20+ years of teaching experience." },
    { name: "Dr. P. Patel", role: "Lead Faculty - Surgery", desc: "Gold Medalist surgeon passionate about simplifying concepts." },
    { name: "Dr. K. Iyer", role: "Head of Content", desc: "Ensuring every question and note meets global standards." },
    { name: "Dr. S. Khan", role: "Student Success Lead", desc: "Dedicated to mentoring students through their exam journey." }
  ];

  const milestones = [
    { year: "2020", title: "Inception", desc: "Fornix started with a vision to simplify medical education." },
    { year: "2021", title: "First 1000 Students", desc: "Rapid adoption by students across 5 major medical colleges." },
    { year: "2023", title: "Global Expansion", desc: "Launched FMGE and PLAB courses to help international aspirants." },
    { year: "2024", title: "Tech Refresh", desc: "Introduced AI-driven analytics and voice-based learning." }
  ];

  return (
    <div className="pb-0">

      {/* Hero Section */}
      <section className="relative mb-20">
        <div className="relative h-125 overflow-hidden">
          <img
            src={banner}
            alt="Fornix Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/80 to-transparent flex flex-col justify-center px-6 md:px-20 pt-24">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-fade-in-up">
              Refining Medical <br />
              <span className="text-orange-500">Excellence</span>
            </h1>
            <p className="text-gray-200 text-xl mb-8 max-w-2xl animate-fade-in-up delay-100">
              We are a passionate team of doctors, educators, and technologists, here to empower your journey from student to specialist—making it smoother, smarter, and truly transformative.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story & Stats */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-orange-500 font-bold uppercase tracking-wide">Who We Are</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">Empowering the Next Generation</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              At FORNIX, we believe medical education shouldn't be about rote memorization.
              It should be about <span className="text-gray-900 font-semibold">deep understanding</span> and
              <span className="text-gray-900 font-semibold"> clinical application</span>.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Founded by doctors who faced the same challenges you do, we've built a platform
              that focuses on high-yield content, rigorous practice, and personalized feedback.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-orange-50 p-8 rounded-2xl text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">10k+</div>
              <div className="text-gray-700 font-medium">Students Trusted</div>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-700 font-medium">Pass Rate</div>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-700 font-medium">Video Hours</div>
            </div>
            <div className="bg-orange-50 p-8 rounded-2xl text-center">
              <div className="text-4xl font-bold text-orange-500 mb-2">24/7</div>
              <div className="text-gray-700 font-medium">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-900 py-24 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-800 p-10 rounded-3xl border border-gray-700 hover:border-orange-500 transition duration-300">
              <div className="bg-orange-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                To become the global standard in digital medical education, bridging the gap between textbook knowledge and clinical excellence for students worldwide.
              </p>
            </div>
            <div className="bg-gray-800 p-10 rounded-3xl border border-gray-700 hover:border-orange-500 transition duration-300">
              <div className="bg-orange-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                To democratize high-quality medical training through accessible technology, personalized learning paths, and unwavering support for every aspirant.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">Our Journey</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {milestones.map((item, i) => (
            <div key={i} className="relative pt-8 md:pt-0">
              <div className="md:hidden absolute left-0 top-0 bottom-0 w-1 bg-orange-100"></div>
              <div className="hidden md:block absolute top-4.5 left-0 right-0 h-1 bg-orange-100 -z-10"></div>

              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative">
                <div className="w-10 h-10 bg-orange-500 rounded-full text-white flex items-center justify-center font-bold absolute -top-5 left-6 md:left-1/2 md:-translate-x-1/2 border-4 border-white shadow-sm">
                  {i + 1}
                </div>
                <div className="mt-4 text-center">
                  <div className="text-orange-500 font-bold mb-1">{item.year}</div>
                  <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Meet the Faculty */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900">Meet Our Experts</h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Content created by gold medalists and experienced specialists who know exactly what it takes to crack the exam.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {team.map((member, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-300">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <svg className="w-20 h-20 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
                  <p className="text-orange-500 text-sm font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 max-w-5xl mx-auto px-6 mb-20">
        <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-6">Join the Fornix Family</h2>
          <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
            Whether you are starting your journey or looking for that final push, we are here to support you every step of the way.
          </p>
          <Link to="/contact" className="bg-white text-orange-600 px-10 py-4 rounded-full font-bold shadow hover:bg-gray-100 transition inline-block">
            Contact Us
          </Link>
        </div>
      </section>

    </div>
  );
}

export default About;

