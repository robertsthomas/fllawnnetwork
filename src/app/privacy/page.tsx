import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Florida Lawn Network',
  description: 'Privacy Policy for Florida Lawn Network - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="flex items-center justify-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
                Privacy Policy
              </h1>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-500 text-center mb-8">Last updated: {new Date().toLocaleDateString()}</p>

              <section className="mb-12 p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">1</span>
                  Introduction
                </h2>
                <p className="text-gray-600 mb-4">
                  Florida Lawn Network ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
                </p>
              </section>

              <section className="mb-12 p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">2</span>
                  Information We Collect
                </h2>
                <h3 className="text-xl font-medium text-gray-900 mb-2">2.1 Personal Information</h3>
                <p className="text-gray-600 mb-4">
                  We may collect personal information that you voluntarily provide to us when you:
                </p>
                <ul className="list-none space-y-2 mb-4">
                  {['Create an account', 'Request quotes from lawn care providers', 'Submit reviews or ratings', 'Contact us for support', 'Subscribe to our newsletter'].map((item, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-12 p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">3</span>
                  How We Use Your Information
                </h2>
                <ul className="list-none space-y-2 mb-4">
                  {[
                    'Provide and maintain our services',
                    'Connect you with lawn care providers',
                    'Process your requests and transactions',
                    'Send you updates and marketing communications',
                    'Improve our website and services',
                    'Comply with legal obligations'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-12 p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">4</span>
                  Information Sharing
                </h2>
                <ul className="list-none space-y-2 mb-4">
                  {[
                    'Lawn care providers to fulfill your service requests',
                    'Service providers who assist in our operations',
                    'Legal authorities when required by law'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-12 p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">5</span>
                  Your Rights
                </h2>
                <ul className="list-none space-y-2 mb-4">
                  {[
                    'Access your personal information',
                    'Correct inaccurate information',
                    'Request deletion of your information',
                    'Opt-out of marketing communications',
                    'Object to processing of your information'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="mb-12 p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">6</span>
                  Security
                </h2>
                <p className="text-gray-600 mb-4">
                  We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section className="p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">7</span>
                  Contact Us
                </h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <p className="text-gray-600 mb-4">
                    If you have questions about this Privacy Policy, please contact us at:
                  </p>
                  <div className="space-y-2">
                    <p className="text-gray-600 flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      privacy@fllawnnetwork.com
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      [Your Business Address]
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 