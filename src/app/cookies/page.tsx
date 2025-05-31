import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy | Florida Lawn Network',
  description: 'Cookie Policy for Florida Lawn Network - Learn how we use cookies and similar technologies on our website.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="flex items-center justify-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
                Cookie Policy
              </h1>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-500 text-center mb-8">Last updated: {new Date().toLocaleDateString()}</p>

              <section className="mb-12 p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">1</span>
                  What Are Cookies
                </h2>
                <p className="text-gray-600 mb-4">
                  Cookies are small text files that are placed on your computer or mobile device when you visit our website. They help us provide you with a better experience and allow certain features to work properly.
                </p>
              </section>

              <section className="mb-12 p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">2</span>
                  Types of Cookies We Use
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">2.1 Essential Cookies</h3>
                    <p className="text-gray-600">
                      These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">2.2 Performance Cookies</h3>
                    <p className="text-gray-600">
                      These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They help us improve our website's performance.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">2.3 Functionality Cookies</h3>
                    <p className="text-gray-600">
                      These cookies enable enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-medium text-gray-900 mb-2">2.4 Targeting Cookies</h3>
                    <p className="text-gray-600">
                      These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for individual users.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-12 p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">3</span>
                  How We Use Cookies
                </h2>
                <p className="text-gray-600 mb-4">
                  We use cookies for various purposes, including:
                </p>
                <ul className="list-none space-y-2 mb-4">
                  {[
                    'Remembering your preferences and settings',
                    'Understanding how you use our website',
                    'Improving our website\'s performance',
                    'Personalizing your experience',
                    'Analyzing website traffic',
                    'Showing relevant advertisements'
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
                  Third-Party Cookies
                </h2>
                <p className="text-gray-600 mb-4">
                  Some cookies are placed by third-party services that appear on our pages. We use the following third-party services:
                </p>
                <ul className="list-none space-y-2 mb-4">
                  {[
                    'Google Analytics for website analytics',
                    'Google Ads for advertising',
                    'Social media platforms for sharing content'
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
                  Managing Cookies
                </h2>
                <p className="text-gray-600 mb-4">
                  You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed. However, if you do this, you may have to manually adjust some preferences every time you visit our website and some services and functionalities may not work.
                </p>
                <p className="text-gray-600 mb-4">
                  To manage cookies, you can:
                </p>
                <ul className="list-none space-y-2 mb-4">
                  {[
                    'Use your browser settings to manage cookies',
                    'Use our cookie consent tool to manage preferences',
                    'Contact us for assistance with cookie management'
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
                  Changes to This Policy
                </h2>
                <p className="text-gray-600 mb-4">
                  We may update this Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">7</span>
                  Contact Us
                </h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <p className="text-gray-600 mb-4">
                    If you have questions about our Cookie Policy, please contact us at:
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