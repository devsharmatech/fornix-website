import React from 'react';

function TermsAndConditions() {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-lg text-gray-600">
            Fornix Academy (Fornix Private Limited)
          </p>
          <div className="inline-block mt-4 px-4 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
            Effective Date: February 1, 2026
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-10 border border-gray-100">

          {/* Introduction */}
          <section>
            <p className="text-gray-600 leading-relaxed text-lg">
              By using Fornix Academy services, you agree to the following terms.
            </p>
          </section>

          {/* 1. Service Scope */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
              Service Scope
            </h2>
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
              <p className="font-medium text-gray-900 mb-3">Fornix Academy provides:</p>
              <ul className="grid md:grid-cols-2 gap-3 text-gray-600 mb-4">
                {['Medical Q-banks', 'Notes', 'Practice tools', 'Exam preparation features'].map((item, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></span>{item}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-gray-500 italic">
                Note: We do not guarantee exam results.
              </p>
            </div>
          </section>

          {/* 2. Account Responsibility */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
              Account Responsibility
            </h2>
            <div className="space-y-4">
              <p className="text-gray-900 font-medium">Users must:</p>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { text: 'Provide accurate information', icon: '📝' },
                  { text: 'Keep login credentials secure', icon: '🔒' },
                  { text: 'Not share accounts', icon: '🚫' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 p-4 rounded-lg flex flex-col items-center text-center shadow-sm">
                    <span className="text-2xl mb-2">{item.icon}</span>
                    <span className="text-sm text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-100 flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Account sharing may result in suspension.
              </div>
            </div>
          </section>

          {/* 3. Intellectual Property */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
              Intellectual Property
            </h2>
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
              <p className="text-gray-900 mb-4">All content including:</p>
              <div className="flex flex-wrap gap-3 mb-6">
                {['Questions', 'Notes', 'Explanations', 'Interface'].map((item, idx) => (
                  <span key={idx} className="bg-white text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-100 shadow-sm">
                    {item}
                  </span>
                ))}
              </div>
              <p className="text-gray-700">
                Belongs to <span className="font-bold">Fornix Private Limited</span>. Copying or redistribution is prohibited.
              </p>
            </div>
          </section>

          {/* 4. Prohibited Use */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">4</span>
              Prohibited Use
            </h2>
            <p className="text-gray-600 mb-4">Users may not:</p>
            <ul className="space-y-3">
              {[
                'Copy or scrape content',
                'Reverse engineer platform',
                'Share paid content publicly',
                'Use automation tools to extract data'
              ].map((item, idx) => (
                <li key={idx} className="flex items-center text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                  <span className="text-red-500 mr-3">✕</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 5. Service Availability & 6. Limitation of Liability */}
          <div className="grid md:grid-cols-2 gap-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">5</span>
                Service Availability
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  We strive for uptime but do not guarantee uninterrupted access.
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  Maintenance downtime may occur.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">6</span>
                Limitation of Liability
              </h2>
              <p className="text-gray-600 mb-3">Fornix Academy is not liable for:</p>
              <ul className="space-y-2 text-gray-600 list-disc list-inside pl-2 text-sm">
                <li>Exam outcomes</li>
                <li>User decisions based on content</li>
                <li>Technical interruptions</li>
              </ul>
            </section>
          </div>

          {/* 7. Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">7</span>
              Governing Law
            </h2>
            <div className="bg-gray-50 border-l-4 border-gray-500 p-6 rounded-r-xl">
              <p className="text-gray-700">
                These terms are governed by laws of <span className="font-semibold">India</span>.
                <br />
                Jurisdiction: <span className="font-semibold">Hyderabad, Telangana</span>
              </p>
            </div>
          </section>

          {/* Payment & Subscription Policy */}
          <section className="mt-12 pt-12 border-t border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <span className="text-4xl">💳</span>
              Payment & Subscription Policy
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* 1. Pricing */}
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg text-gray-900 mb-3">1. Pricing</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Prices are listed on the website/app
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Subject to change without prior notice
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>Taxes extra where applicable
                  </li>
                </ul>
              </div>

              {/* 2. Subscription Access */}
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg text-gray-900 mb-3">2. Subscription Access</h3>
                <p className="text-gray-600 text-sm mb-2">Access is granted:</p>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>For the selected plan duration
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>Non-transferable
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>Single user only
                  </li>
                </ul>
              </div>

              {/* 3. Auto-Renewal */}
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg text-gray-900 mb-3">3. Auto-Renewal (if applicable)</h3>
                <div className="text-gray-600 text-sm space-y-2">
                  <p className="flex items-center"><span className="text-orange-500 mr-2">↻</span> If enabled, subscription renews automatically</p>
                  <p className="flex items-center"><span className="text-orange-500 mr-2">⚠</span> User may cancel before renewal date</p>
                </div>
              </div>

              {/* 4. Failed Payments */}
              <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg text-gray-900 mb-3">4. Failed Payments</h3>
                <p className="text-red-600 text-sm flex items-center">
                  <span className="mr-2 text-lg">✕</span>
                  Access may be suspended if payment fails.
                </p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;