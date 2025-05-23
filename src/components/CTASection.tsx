import Link from 'next/link';
import Image from 'next/image';

export default function CTASection() {
  return (
    <section className="relative bg-primary-700">
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-white" viewBox="0 0 1200 1200" fill="currentColor">
          <path d="M0,1200 L1200,1200 L1200,0 L0,0 L0,1200 Z M50,50 L50,1150 L1150,1150 L1150,50 L50,50 Z" />
          <path d="M100,100 L100,1100 L1100,1100 L1100,100 L100,100 Z M150,150 L150,1050 L1050,1050 L1050,150 L150,150 Z" />
          <path d="M200,200 L200,1000 L1000,1000 L1000,200 L200,200 Z M250,250 L250,950 L950,950 L950,250 L250,250 Z" />
          <path d="M300,300 L300,900 L900,900 L900,300 L300,300 Z M350,350 L350,850 L850,850 L850,350 L350,350 Z" />
          <path d="M400,400 L400,800 L800,800 L800,400 L400,400 Z M450,450 L450,750 L750,750 L750,450 L450,450 Z" />
          <path d="M500,500 L500,700 L700,700 L700,500 L500,500 Z M550,550 L550,650 L650,650 L650,550 L550,550 Z" />
        </svg>
      </div>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 relative">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Are You a Lawn Care Professional?
            </h2>
            <p className="mt-3 max-w-3xl text-lg text-primary-100">
              Join our network of top-rated providers and connect with customers looking for your services. Grow your business and reach more clients in your area.
            </p>
            <div className="mt-8 flex">
              <div className="inline-flex rounded-md shadow">
                <Link 
                  href="/get-listed" 
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 transition transform hover:scale-105"
                >
                  List Your Business
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-3 -mr-1 h-5 w-5 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              <div className="ml-3 inline-flex">
                <Link 
                  href="/pricing" 
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-800 hover:bg-primary-900 transition"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-10 lg:mt-0">
            <div className="pl-4">
              <Image
                className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5" 
                src="https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Landscaper working"
                width={800}
                height={600}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 