'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import Link from "next/link";

interface LegalDialogProps {
  title: string;
  children: React.ReactNode;
  trigger: React.ReactNode;
}

export function LegalDialog({ title, children, trigger }: LegalDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-4 text-gray-600">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PrivacyDialog() {
  return (
    <LegalDialog
      title="Privacy Policy"
      trigger={<span className="text-base text-gray-400 hover:text-gray-300 transition cursor-pointer">Privacy</span>}
    >
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">1. Information We Collect</h2>
        <p>We collect information that you provide directly to us, including when you create an account, use our services, or communicate with us.</p>
        
        <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
        <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect Florida Lawn Network and our users.</p>
        
        <h2 className="text-xl font-semibold">3. Information Sharing</h2>
        <p>We do not share your personal information with companies, organizations, or individuals outside of Florida Lawn Network except in the following cases:</p>
        <ul className="list-disc pl-6">
          <li>With your consent</li>
          <li>For legal reasons</li>
          <li>With our service providers</li>
        </ul>
      </div>
    </LegalDialog>
  );
}

export function TermsDialog() {
  return (
    <LegalDialog
      title="Terms of Service"
      trigger={<span className="text-base text-gray-400 hover:text-gray-300 transition cursor-pointer">Terms</span>}
    >
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
        <p>By accessing and using Florida Lawn Network, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h2 className="text-xl font-semibold">2. Use License</h2>
        <p>Permission is granted to temporarily access the materials on Florida Lawn Network's website for personal, non-commercial transitory viewing only.</p>
        
        <h2 className="text-xl font-semibold">3. Disclaimer</h2>
        <p>The materials on Florida Lawn Network's website are provided on an 'as is' basis. Florida Lawn Network makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
      </div>
    </LegalDialog>
  );
}

export function CookiePolicyDialog() {
  return (
    <LegalDialog
      title="Cookie Policy"
      trigger={<span className="text-base text-gray-400 hover:text-gray-300 transition cursor-pointer">Cookie Policy</span>}
    >
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">1. What Are Cookies</h2>
        <p>Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide useful information to website owners.</p>
        
        <h2 className="text-xl font-semibold">2. How We Use Cookies</h2>
        <p>We use cookies for the following purposes:</p>
        <ul className="list-disc pl-6">
          <li>Essential cookies for website functionality</li>
          <li>Analytics cookies to understand how visitors interact with our website</li>
          <li>Marketing cookies to deliver relevant advertisements</li>
        </ul>
        
        <h2 className="text-xl font-semibold">3. Managing Cookies</h2>
        <p>You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.</p>
      </div>
    </LegalDialog>
  );
} 