import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Florida Lawn Network',
  description: 'Terms of Service for Florida Lawn Network - Learn about the rules and guidelines for using our services.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <div className="flex items-center justify-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">
                Terms of Service
              </h1>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-500 text-center mb-8">Last updated: {new Date().toLocaleDateString()}</p>

              <section className="mb-12 p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">1</span>
                  Agreement to Terms
                </h2>
                <p className="text-gray-600 mb-4">
                  By accessing or using Florida Lawn Network's website and services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
                </p>
              </section>

              <section className="mb-12 p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">2</span>
                  Use of Services
                </h2>
                <p className="text-gray-600 mb-4">
                  Our services are intended for:
                </p>
                <ul className="list-none space-y-2 mb-4">
                  {[
                    'Homeowners seeking lawn care services',
                    'Lawn care providers offering services',
                    'General information about lawn care services'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="text-gray-600">
                  You agree to use our services only for lawful purposes and in accordance with these Terms.
                </p>
              </section>

              <section className="mb-12 p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">3</span>
                  User Accounts
                </h2>
                <p className="text-gray-600 mb-4">
                  When creating an account with us, you must provide accurate and complete information. You are responsible for:
                </p>
                <ul className="list-none space-y-2 mb-4">
                  {[
                    'Maintaining the security of your account',
                    'All activities that occur under your account',
                    'Notifying us of any unauthorized use'
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
                  Service Provider Guidelines
                </h2>
                <p className="text-gray-600 mb-4">
                  Lawn care providers must:
                </p>
                <ul className="list-none space-y-2 mb-4">
                  {[
                    'Provide accurate business information',
                    'Maintain appropriate licenses and insurance',
                    'Respond to customer inquiries promptly',
                    'Provide services as advertised',
                    'Maintain professional conduct'
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
                  User Content
                </h2>
                <p className="text-gray-600 mb-4">
                  You retain ownership of any content you post, but grant us a license to use, modify, and display it. You agree not to post content that:
                </p>
                <ul className="list-none space-y-2 mb-4">
                  {[
                    'Is illegal or violates any laws',
                    'Is defamatory or harmful',
                    'Infringes on others\' rights',
                    'Contains spam or unauthorized advertising'
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
                  Limitation of Liability
                </h2>
                <p className="text-gray-600 mb-4">
                  Florida Lawn Network is not responsible for:
                </p>
                <ul className="list-none space-y-2 mb-4">
                  {[
                    'The quality of services provided by listed providers',
                    'Disputes between users and service providers',
                    'Any damages arising from the use of our services',
                    'Technical issues or service interruptions'
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
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">7</span>
                  Changes to Terms
                </h2>
                <p className="text-gray-600 mb-4">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes. Continued use of our services after changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section className="p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3">8</span>
                  Contact Information
                </h2>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <p className="text-gray-600 mb-4">
                    For questions about these Terms of Service, please contact us at:
                  </p>
                  <div className="space-y-2">
                    <p className="text-gray-600 flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      terms@fllawnnetwork.com
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