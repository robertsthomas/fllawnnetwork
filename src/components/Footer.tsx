'use client';

import Image from 'next/image';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col items-center">
        <div className="flex items-center mb-2">
          <Image
            src="/logo.png"
            alt="Florida LawnNetwork Logo"
            width={40}
            height={40}
            className="h-8 w-8"
            priority
          />
          <span className="ml-2 text-xl font-bold text-white">FLLawnNetwork</span>
        </div>
        <p className="text-gray-300 text-base mb-2 text-center">
          Connecting homeowners with reliable lawn care professionals in Florida.
        </p>
        <p className="text-base text-gray-400 text-center">
          &copy; {currentYear} FLLawnNetwork. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 