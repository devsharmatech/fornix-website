import React from 'react';
import { Link } from 'react-router-dom';

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
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
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
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                </a>

                <a
                  href="https://www.instagram.com/fornix.academy?igsh=czgzMGx4ZzBzb3c="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                <a
                  href="https://www.facebook.com/share/17ts8VVkbF/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                <a
                  href="https://t.me/fornixacademy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#26a2e0] text-white p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110"
                  aria-label="Telegram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.91 3.79L20.3 20.84c-.25 1.21-.98 1.5-2 .94l-5.5-4.07-2.66 2.57c-.3.3-.55.56-1.1.56-.72 0-.6-.27-.84-.95L6.3 13.7l-5.45-1.7c-1.18-.35-1.19-1.16.26-1.75l21.26-8.2c.97-.43 1.9.24 1.53 1.73z" />
                  </svg>
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
