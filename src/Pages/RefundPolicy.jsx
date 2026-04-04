import React from 'react';

function RefundPolicy() {
    return (
        <div className="pt-32 pb-20 min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-6">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Refund & Cancellation Policy
                    </h1>
                    <p className="text-lg text-gray-600">
                        Fornix Academy (Fornix Private Limited)
                    </p>
                </div>

                {/* Content Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-10 border border-gray-100">

                    {/* Digital Education Products Policy */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                            Digital Education Products Policy
                        </h2>
                        <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                            <p className="text-gray-800 font-medium mb-3">
                                Due to the nature of digital educational content, refunds are generally <span className="text-red-600 font-bold">not provided</span> once access is granted.
                            </p>
                            <p className="text-gray-600 mb-3">However, a refund may be considered if:</p>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✔</span> Duplicate payment made
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✔</span> Technical issue prevents access (verified)
                                </li>
                                <li className="flex items-center">
                                    <span className="text-green-500 mr-2">✔</span> Service not delivered as promised
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Refund Request Window */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                                Refund Request Window
                            </h2>
                            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                                <p className="text-gray-600 mb-4">Refund requests must be submitted within <span className="font-bold text-gray-900">7 days</span> of purchase.</p>
                                <div className="mt-2">
                                    <p className="font-semibold text-gray-900">Contact:</p>
                                    <a href="mailto:Venkat@fornixacademy.com " className="text-orange-500 hover:text-orange-600">Venkat@fornixacademy.com </a>
                                </div>
                            </div>
                        </section>

                        {/* Cancellation */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">3</span>
                                Cancellation
                            </h2>
                            <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm h-full flex items-center">
                                <p className="text-gray-600">
                                    Users may cancel future renewals <span className="font-bold text-gray-900">anytime</span> from account settings.
                                </p>
                            </div>
                        </section>
                    </div>

                    {/* Non-Refundable Cases */}
                    <section>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <span className="bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-3">4</span>
                            Non-Refundable Cases
                        </h2>
                        <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                            <p className="text-gray-800 mb-4 font-medium">Refunds will not be provided for:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {[
                                    'Change of mind',
                                    'Lack of usage',
                                    'Exam failure',
                                    'Plan misunderstanding after purchase'
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center text-gray-700 bg-white px-3 py-2 rounded-lg border border-red-100">
                                        <span className="text-red-500 mr-2 font-bold">✕</span> {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Data Retention & Deletion Policy */}
                    <div className="pt-8 border-t border-gray-200">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                            <span className="text-4xl">🗂</span>
                            Data Retention & Deletion Policy
                        </h2>

                        <div className="space-y-8">
                            {/* Data Retention */}
                            <section>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Data Retention</h3>
                                <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                                    <p className="text-gray-700 mb-3">We retain user data:</p>
                                    <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4 pl-2">
                                        <li>While account is active</li>
                                        <li>For legal and audit requirements</li>
                                        <li>For performance analytics (anonymized where possible)</li>
                                    </ul>
                                    <p className="text-sm font-semibold text-orange-800 bg-white inline-block px-3 py-1 rounded-full border border-orange-200">
                                        Typical retention: up to 5 years
                                    </p>
                                </div>
                            </section>

                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Data Deletion Requests */}
                                <section>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Data Deletion Requests</h3>
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-full">
                                        <p className="text-gray-600 mb-2">Users may request deletion by contacting:</p>
                                        <a href="mailto:Venkat@fornixacademy.com " className="text-orange-500 hover:text-orange-600 font-medium block mb-4">Venkat@fornixacademy.com </a>

                                        <p className="text-gray-700 font-medium mb-2">We will:</p>
                                        <ul className="space-y-2 text-sm text-gray-600">
                                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>Verify identity</li>
                                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>Process deletion within 30 days</li>
                                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>Remove personal data except where legally required</li>
                                        </ul>
                                    </div>
                                </section>

                                {/* Account Deletion Effects */}
                                <section>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">Account Deletion Effects</h3>
                                    <div className="bg-gray-900 text-white p-6 rounded-xl border border-gray-800 h-full flex flex-col justify-center">
                                        <p className="mb-4 text-gray-300">After deletion:</p>
                                        <ul className="space-y-3">
                                            <li className="flex items-center">
                                                <span className="text-red-400 mr-3 text-xl">⚠</span> Access is revoked
                                            </li>
                                            <li className="flex items-center">
                                                <span className="text-red-400 mr-3 text-xl">⚠</span> Progress history removed
                                            </li>
                                            <li className="flex items-center">
                                                <span className="text-red-400 mr-3 text-xl">⚠</span> Subscription forfeited
                                            </li>
                                        </ul>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default RefundPolicy;
