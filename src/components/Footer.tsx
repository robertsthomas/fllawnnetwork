'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PrivacyDialog, TermsDialog, CookiePolicyDialog } from './LegalDialog';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-4 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="Florida Lawn Network Logo"
                width={40}
                height={40}
                className="h-8 w-8"
                priority
              />
              <span className="ml-2 text-xl font-bold text-white">Florida Lawn Network</span>
            </div>
            <p className="text-gray-300 text-base">
              Connecting homeowners with reliable lawn care professionals.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-gray-300 transition">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-300 transition">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-300 transition">
                <span className="sr-only">X</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-3">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Services
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/lawn-care"
                      className="text-base text-gray-400 hover:text-gray-300 transition"
                    >
                      Lawn Mowing
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/lawn-care"
                      className="text-base text-gray-400 hover:text-gray-300 transition"
                    >
                      Landscaping
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/lawn-care"
                      className="text-base text-gray-400 hover:text-gray-300 transition"
                    >
                      Garden Design
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/lawn-care"
                      className="text-base text-gray-400 hover:text-gray-300 transition"
                    >
                      Irrigation
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/lawn-care"
                      className="text-base text-gray-400 hover:text-gray-300 transition"
                    >
                      Tree Services
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  For Providers
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/providers/list"
                      className="text-base text-gray-400 hover:text-gray-300 transition"
                    >
                      List Your Business
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      href="/providers/pricing"
                      className="text-base text-gray-400 hover:text-gray-300 transition"
                    >
                      Pricing
                    </Link>
                  </li> */}
                  {/* <li>
                    <Link
                      href="/providers/success-stories"
                      className="text-base text-gray-400 hover:text-gray-300 transition"
                    >
                      Success Stories
                    </Link>
                  </li> */}
                  {/* <li>
                    <Link
                      href="/providers/resources"
                      className="text-base text-gray-400 hover:text-gray-300 transition"
                    >
                      Resources
                    </Link>
                  </li> */}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link
                      href="/about"
                      className="text-base text-gray-400 hover:text-gray-300 transition"
                    >
                      About
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/blog"
                      className="text-base text-gray-400 hover:text-gray-300 transition"
                    >
                      Blog
                    </Link>
                  </li>

                  {/* <li>
                    <Link
                      href="/partners"
                      className="text-base text-gray-400 hover:text-gray-300 transition"
                    >
                      Partners
                    </Link>
                  </li> */}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <PrivacyDialog />
                  </li>
                  <li>
                    <TermsDialog />
                  </li>
                  <li>
                    <CookiePolicyDialog />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; {currentYear} Florida Lawn Network. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
