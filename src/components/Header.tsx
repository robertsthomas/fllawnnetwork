'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed w-full bg-white/95 backdrop-blur-sm z-50 transition-all duration-300 ${hasScrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:justify-start md:space-x-10">
          <div className="flex justify-start lg:w-0 lg:flex-1">
            <Link href="/" className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2c.5 0 1 .2 1.4.6l7 7c.4.4.6.9.6 1.4v9c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V11c0-.5.2-1 .6-1.4l7-7c.4-.4.9-.6 1.4-.6z"/>
                <path d="M9 14v3"/>
                <path d="M15 14v3"/>
                <path d="M9 21v-1"/>
                <path d="M15 21v-1"/>
                <path d="M3 11h18"/>
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-900">Florida LawnNetwork</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-10">
            <Link href="/" className="text-base font-medium text-gray-700 hover:text-primary-600 transition">
              Home
            </Link>
            <Link href="/directory" className="text-base font-medium text-gray-700 hover:text-primary-600 transition">
              Directory
            </Link>
            <Link href="/services" className="text-base font-medium text-gray-700 hover:text-primary-600 transition">
              Services
            </Link>
            <Link href="/about" className="text-base font-medium text-gray-700 hover:text-primary-600 transition">
              About
            </Link>
            <Link href="/contact" className="text-base font-medium text-gray-700 hover:text-primary-600 transition">
              Contact
            </Link>
          </nav>
          
          {/* <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            <Link href="/get-listed" className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition">
              List Your Business
            </Link>
          </div> */}
          
          {/* Mobile menu button */}
          <div className="-mr-2 -my-2 md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-0 inset-x-0 p-2 transition transform origin-top-right md:hidden">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <Link href="/" className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2c.5 0 1 .2 1.4.6l7 7c.4.4.6.9.6 1.4v9c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V11c0-.5.2-1 .6-1.4l7-7c.4-.4.9-.6 1.4-.6z"/>
                      <path d="M9 14v3"/>
                      <path d="M15 14v3"/>
                      <path d="M9 21v-1"/>
                      <path d="M15 21v-1"/>
                      <path d="M3 11h18"/>
                    </svg>
                    <span className="ml-2 text-xl font-bold text-gray-900">FLLawnNetwork</span>
                  </Link>
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
                  >
                    <span className="sr-only">Close menu</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  <Link href="/" className="text-base font-medium text-gray-900 hover:text-primary-600 transition">
                    Home
                  </Link>
                  <Link href="/directory" className="text-base font-medium text-gray-900 hover:text-primary-600 transition">
                    Directory
                  </Link>
                  <Link href="/services" className="text-base font-medium text-gray-900 hover:text-primary-600 transition">
                    Services
                  </Link>
                  <Link href="/about" className="text-base font-medium text-gray-900 hover:text-primary-600 transition">
                    About
                  </Link>
                  <Link href="/contact" className="text-base font-medium text-gray-900 hover:text-primary-600 transition">
                    Contact
                  </Link>
                </nav>
              </div>
            </div>
            {/* <div className="py-6 px-5 space-y-6">
              <Link href="/get-listed" className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition">
                List Your Business
              </Link>
            </div> */}
          </div>
        </div>
      )}
    </header>
  );
} 