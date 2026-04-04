import React, { useState } from 'react';
import banner from '../Assets/banner.webp';
import { FiMail, FiPhone, FiMessageCircle, FiSend, FiMapPin, FiClock, FiArrowRight } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaTelegramPlane } from 'react-icons/fa';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build WhatsApp message
    const text = `Hi Fornix! I'm ${formData.name}.\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\n${formData.message}`;
    window.open(`https://wa.me/+996552448787?text=${encodeURIComponent(text)}`, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const socialLinks = [
    { icon: FaWhatsapp, href: 'https://wa.me/+996552448787', label: 'WhatsApp', color: 'from-green-500 to-green-600', hoverColor: 'hover:shadow-green-500/30' },
    { icon: FaInstagram, href: 'https://www.instagram.com/fornix.academy?igsh=czgzMGx4ZzBzb3c=', label: 'Instagram', color: 'from-[#833ab4] via-[#fd1d1d] to-[#fcb045]', hoverColor: 'hover:shadow-pink-500/30' },
    { icon: FaFacebookF, href: 'https://www.facebook.com/share/17ts8VVkbF/', label: 'Facebook', color: 'from-blue-600 to-blue-700', hoverColor: 'hover:shadow-blue-600/30' },
    { icon: FaTelegramPlane, href: 'https://t.me/fornixacademy', label: 'Telegram', color: 'from-sky-400 to-sky-500', hoverColor: 'hover:shadow-sky-400/30' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Hero Section */}
      <section className="relative mb-16">
        <div className="relative h-auto min-h-[400px] md:h-[500px] overflow-hidden">
          <img
            src={banner}
            alt="Contact Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-orange-900/90 via-orange-800/80 to-orange-700/70 flex flex-col justify-center items-center text-center px-6 pt-24">
            {/* Decorative circles */}
            <div className="absolute top-20 right-10 w-64 h-64 bg-white/5 rounded-full pointer-events-none"></div>
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/5 rounded-full pointer-events-none"></div>

            <div className="animate-fade-in-up relative z-10">
              <span className="bg-white/15 text-orange-100 border border-orange-300/30 px-5 py-2 rounded-full text-sm font-semibold uppercase tracking-wider mb-6 inline-block backdrop-blur-sm">
                We're Here to Help
              </span>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                Get In Touch
              </h1>
              <p className="text-orange-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                Have questions about our courses? Need technical support? Our team is ready to assist you on your medical education journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Email */}
          <a href="mailto:Venkat@fornixacademy.com"
            className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:border-orange-200 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform shrink-0">
                <FiMail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Email Support</h3>
                <p className="text-gray-500 text-sm mb-2">Get a response within 24 hours</p>
                <p className="text-orange-600 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Venkat@fornixacademy.com <FiArrowRight className="w-4 h-4" />
                </p>
              </div>
            </div>
          </a>

          {/* Phone */}
          <a href="tel:+996552448787"
            className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:border-orange-200 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform shrink-0">
                <FiPhone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">Call Us</h3>
                <p className="text-gray-500 text-sm mb-2">Mon – Sat, 9 AM – 7 PM</p>
                <p className="text-orange-600 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  +996 552 448 787 <FiArrowRight className="w-4 h-4" />
                </p>
              </div>
            </div>
          </a>

          {/* WhatsApp */}
          <a href="https://wa.me/+996552448787" target="_blank" rel="noopener noreferrer"
            className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl hover:border-green-200 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-200 group-hover:scale-110 transition-transform shrink-0">
                <FaWhatsapp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">WhatsApp</h3>
                <p className="text-gray-500 text-sm mb-2">Quick replies, instant support</p>
                <p className="text-green-600 font-semibold text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                  Start a Chat <FiArrowRight className="w-4 h-4" />
                </p>
              </div>
            </div>
          </a>
        </div>

        {/* Main Content: Form + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16">

          {/* Contact Form — 3 cols */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                <FiSend className="text-orange-500" /> Send Us a Message
              </h2>
              <p className="text-gray-500 text-sm">Fill out the form and we'll reach out via WhatsApp instantly.</p>
            </div>

            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                <p className="text-green-600">We've opened WhatsApp for you. Our team will respond shortly.</p>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Message</label>
                  <textarea
                    rows="5"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us how can we help you..."
                    className="w-full border border-gray-200 bg-gray-50 p-3.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400 transition-all resize-none"
                  ></textarea>
                </div>

                <p className="text-xs text-gray-400">
                  By submitting, you agree to be contacted via SMS, WhatsApp, Email, and other channels.
                </p>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FaWhatsapp className="w-5 h-5" /> Send via WhatsApp
                </button>
              </form>
            )}
          </div>

          {/* Side Info — 2 cols */}
          <div className="lg:col-span-2 space-y-6">

            {/* Office Info */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                <FiMapPin className="text-orange-500" /> Our Office
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 mt-0.5">
                    <FiMapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Headquarters</p>
                    <p className="text-gray-500 text-sm">Fornix Academy, Medical Education Hub</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 mt-0.5">
                    <FiClock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Working Hours</p>
                    <p className="text-gray-500 text-sm">Monday – Saturday, 9:00 AM – 7:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0 mt-0.5">
                    <FiMessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Response Time</p>
                    <p className="text-gray-500 text-sm">We typically respond within 2 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Connect With Us */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-5">Connect With Us</h3>
              <div className="grid grid-cols-2 gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-3 bg-gray-50 rounded-xl p-4 hover:shadow-lg ${social.hoverColor} transition-all duration-300 cursor-pointer`}
                  >
                    <div className={`w-10 h-10 bg-gradient-to-br ${social.color} rounded-lg flex items-center justify-center text-white group-hover:scale-110 transition-transform shrink-0`}>
                      <social.icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{social.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* FAQ Teaser */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Need Instant Help?</h3>
              <p className="text-white/90 text-sm mb-4">
                Most questions are answered within minutes on WhatsApp. Tap below to start a conversation.
              </p>
              <a
                href="https://wa.me/+996552448787"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-orange-50 transition-all cursor-pointer"
              >
                <FaWhatsapp className="w-5 h-5" /> Chat Now
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
export default ContactUs;
