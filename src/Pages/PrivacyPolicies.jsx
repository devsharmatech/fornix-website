import React from 'react';

function PrivacyPolicies() {
    return (
        <div className="pt-32 pb-20 min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Privacy Policy
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
                            Fornix Academy (operated by Fornix Private Limited) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, platform, and services.
                        </p>
                    </section>

                    {/* 1. Information We Collect */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                            Information We Collect
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4 text-lg">Personal Information</h3>
                                <ul className="space-y-3 text-gray-600">
                                    <li className="flex items-center">
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></span>Full name
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></span>Email address
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></span>Phone number
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></span>Educational details
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></span>Payment details (via secure gateways)
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></span>Account login credentials
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4 text-lg">Usage Data</h3>
                                <ul className="space-y-3 text-gray-600">
                                    <li className="flex items-center">
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3"></span>IP address
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3"></span>Device type
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3"></span>Browser type
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3"></span>Pages visited
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3"></span>Time spent on platform
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-3"></span>Test performance analytics
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 2. How We Use Your Information */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                            How We Use Your Information
                        </h2>
                        <div className="prose text-gray-600 max-w-none">
                            <p className="mb-4">We use collected information to:</p>
                            <ul className="grid md:grid-cols-2 gap-4 list-none pl-0">
                                {['Provide medical exam preparation services', 'Create and manage your account', 'Process payments and subscriptions', 'Improve Q-bank and learning tools', 'Send updates and service notifications', 'Provide customer support', 'Prevent fraud and misuse'].map((item, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <svg className="w-5 h-5 text-green-500 mr-3 mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    {/* 3. Sharing of Information */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                            Sharing of Information
                        </h2>
                        <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-r-xl">
                            <p className="text-gray-800 font-medium mb-2">We do not sell personal data.</p>
                            <p className="text-gray-600 mb-4">We may share information with:</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['Payment gateways', 'Cloud hosting', 'Analytics services', 'Legal authorities'].map((item, idx) => (
                                    <div key={idx} className="bg-white p-3 rounded-lg text-center shadow-sm text-sm font-medium text-gray-700">
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 4. Data Security */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">4</span>
                            Data Security
                        </h2>
                        <p className="text-gray-600 mb-4">We implement reasonable security safeguards including:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { icon: '🔒', text: 'Encrypted connections' },
                                { icon: '🔑', text: 'Access controls' },
                                { icon: '🛡️', text: 'Secure servers' },
                                { icon: '👥', text: 'Limited staff access' }
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col items-center justify-center bg-gray-50 p-4 rounded-xl text-center hover:bg-orange-50 transition-colors">
                                    <span className="text-2xl mb-2">{item.icon}</span>
                                    <span className="text-sm font-medium text-gray-700">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 5. Cookies & Tracking */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">5</span>
                            Cookies & Tracking
                        </h2>
                        <div className="bg-gray-50 rounded-xl p-6">
                            <p className="text-gray-600 mb-4">We may use cookies and similar technologies to improve user experience, track performance, and save login sessions.</p>
                            <p className="text-sm text-gray-500 italic">
                                Note: Users can disable cookies via browser settings.
                            </p>
                        </div>
                    </section>

                    {/* 6. User Rights & 7. Policy Updates */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">6</span>
                                User Rights
                            </h2>
                            <ul className="space-y-3 text-gray-600">
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></span>Request access to your data
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></span>Request correction
                                </li>
                                <li className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-3"></span>Request deletion (subject to policy limits)
                                </li>
                            </ul>
                            <div className="mt-6">
                                <p className="font-semibold text-gray-900">Contact:</p>
                                <a href="mailto:Venkat@fornixacademy.com " className="text-orange-500 hover:text-orange-600">Venkat@fornixacademy.com </a>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">7</span>
                                Policy Updates
                            </h2>
                            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                                <p className="text-gray-700">
                                    We may update this policy from time to time. Continued use means acceptance of the updated policy.
                                </p>
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicies;
