export default function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How LawnFinder Works
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Find and connect with lawn care experts in just a few simple steps
          </p>
        </div>

        <div className="mt-16">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="relative">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-5 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="lg:mt-0 text-center">
                <h3 className="text-lg font-medium text-gray-900">Search</h3>
                <p className="mt-2 text-base text-gray-500">
                  Enter your location and the service you need to browse lawn care providers in your area.
                </p>
              </div>
              <div className="hidden lg:block absolute top-16 left-full transform -translate-x-1/2 mt-3 w-14 text-center lg:text-right lg:mt-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-14 text-primary-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            <div className="mt-10 lg:mt-0 relative">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-5 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="lg:mt-0 text-center">
                <h3 className="text-lg font-medium text-gray-900">Compare</h3>
                <p className="mt-2 text-base text-gray-500">
                  Read reviews, compare services, and select the provider that best fits your specific needs.
                </p>
              </div>
              <div className="hidden lg:block absolute top-16 left-full transform -translate-x-1/2 mt-3 w-14 text-center lg:text-right lg:mt-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-14 text-primary-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mb-5 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="lg:mt-0 text-center">
                <h3 className="text-lg font-medium text-gray-900">Connect</h3>
                <p className="mt-2 text-base text-gray-500">
                  Request a quote directly through our platform and schedule your service with the provider.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 