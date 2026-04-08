import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelope, FaWhatsapp, FaInstagram, FaFacebookF, FaTelegramPlane } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">

          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-orange-500 mb-4">FORNIX Academy</h3>
            <p className="text-gray-300 leading-relaxed">
              Smart Preparation for Global Medical Exams
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              Built by experienced doctors to help students clear AMC & PLAB with confidence through structured Q Bank practice and exam-oriented learning.
            </p>
          </div>

          {/* Features Section */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-orange-500 mb-4">What We Offer</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✔</span>
                <span>70,000+ Clinical Questions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✔</span>
                <span>Concept-based Explanations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✔</span>
                <span>Mock Tests</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-1">✔</span>
                <span>AI Doubt Support</span>
              </li>
            </ul>
          </div>
          {/* terms and conditions */}
          <div className=' space-y-4'>
            <h3 className='text-lg font-bold text-white mb-4' > <Link to="/terms-and-conditions" className='hover:text-orange-500 transition'>Terms & Conditions</Link></h3>
            <h3 className='text-lg font-bold text-white mb-4' > <Link to="/privacy-policy" className='hover:text-orange-500 transition'>Privacy Policy</Link></h3>
            <h3 className='text-lg font-bold text-white mb-4' > <Link to="/refund-policy" className='hover:text-orange-500 transition'>Refund & Cancellation Policy</Link></h3>
          </div>
          {/* Contact & Social Section */}
          <div className="space-y-4 ">
            <h4 className="text-lg font-bold text-orange-500 mb-4">Connect With Us</h4>
            <div className="space-y-3">
              <a
                href="mailto:Venkat@fornixacademy.com "
                className="flex items-center gap-2 text-gray-300 hover:text-orange-500 transition"
              >
                <FaEnvelope className="w-5 h-5" />
                Venkat@fornixacademy.com
              </a>

              {/* Social Media Icons */}
              <div className="flex gap-4 ">
                <a
                  href="https://wa.me/+996552448787"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 hover:bg-green-600 text-white p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp className="w-5 h-5" />
                </a>

                <a
                  href="https://www.instagram.com/fornix.academy?igsh=czgzMGx4ZzBzb3c="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-5 h-5" />
                </a>

                <a
                  href="https://www.facebook.com/share/17ts8VVkbF/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="w-5 h-5" />
                </a>

                <a
                  href="https://t.me/fornixacademy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#26a2e0] text-white p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110"
                  aria-label="Telegram"
                >
                  <FaTelegramPlane className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="text-center text-gray-400 text-sm space-y-2">
            <p className="leading-relaxed">
              © 2026 Fornix Academy, powered by <span className="text-orange-500 font-semibold">FORNIX AMC</span>, powered by <span className="text-orange-500 font-semibold">FORNIX PLAB</span>, Powered by <span className="text-orange-500 font-semibold">FORNIX FMGE</span>, Powered by <span className="text-orange-500 font-semibold">FORNIX NEET PG</span>
            </p>
            <p className="text-xs text-gray-500">
              All rights reserved. Built with ❤️ for medical students worldwide.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
