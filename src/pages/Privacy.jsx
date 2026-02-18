import React from 'react';
import { Link } from 'react-router-dom';
import KeywordsDisplay from '../components/KeywordsDisplay';

const Privacy = () => {
  return (
    <main className="bg-white">
      {/* Breadcrumb Navigation */}
      <section className="py-6 px-6 md:px-10 bg-white mt-20">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900 transition-colors">HOME</Link>
            <span>&gt;</span>
            <span className="text-gray-900">PRIVACY POLICY</span>
          </nav>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-12 md:py-16 px-6 md:px-10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block">
              <h1 className="text-2xl md:text-3xl font-light tracking-[0.3em] text-gray-800 mb-3">
                PRIVACY POLICY
              </h1>
              <div className="w-24 h-[3px] bg-red-700 mx-auto"></div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Introduction */}
            <div className="space-y-4">
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                Ameya Commercial Projects Private Limited and its group companies (hereinafter referred to as "Ameya Group" "us" "we" or "our") is committed to respecting your privacy and to complying with applicable data protection and privacy laws of India.
              </p>
            </div>

            {/* Information Collection */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Information We Collect
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                We collect information that you provide directly to us, including when you create an account, fill out a form, make an inquiry, or communicate with us. This information may include your name, email address, phone number, postal address, and any other information you choose to provide.
              </p>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                We also automatically collect certain information about your device when you use our website. This includes information about your web browser, IP address, time zone, and some of the cookies installed on your device.
              </p>
            </div>

            {/* How We Use Information */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                How We Use Your Information
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm md:text-base leading-relaxed text-gray-800 ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process and complete transactions</li>
                <li>Send you technical notices, updates, security alerts, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Communicate with you about products, services, offers, and events</li>
                <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
                <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              </ul>
            </div>

            {/* Information Sharing */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Information Sharing and Disclosure
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                We do not share, sell, rent, or trade your personal information with third parties for their promotional purposes. We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm md:text-base leading-relaxed text-gray-800 ml-4">
                <li>With your consent or at your direction</li>
                <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf</li>
                <li>In response to a request for information if we believe disclosure is in accordance with, or required by, any applicable law or legal process</li>
                <li>If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of Ameya Group or others</li>
                <li>In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company</li>
              </ul>
            </div>

            {/* Data Security */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Data Security
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no internet or email transmission is ever fully secure or error-free.
              </p>
            </div>

            {/* Cookies */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Cookies and Tracking Technologies
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                We use cookies and similar tracking technologies to track activity on our website and hold certain information. Cookies are files with a small amount of data that are commonly used as anonymous unique identifiers. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </div>

            {/* Your Rights */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Your Rights and Choices
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                You have the right to access, update, or delete the information we have on you. You may also have the right to object to or restrict certain processing of your personal information. If you wish to exercise any of these rights, please contact us using the information provided below.
              </p>
            </div>

            {/* Children's Privacy */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Children's Privacy
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                Our services are not directed to children under the age of 18. We do not knowingly collect personal information from children under 18. If you become aware that a child has provided us with personal information, please contact us.
              </p>
            </div>

            {/* Changes to Policy */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Changes to This Privacy Policy
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last Updated" date. You are advised to review this privacy policy periodically for any changes.
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Contact Us
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                If you have any questions about this privacy policy or our privacy practices, please contact us at:
              </p>
              <div className="text-sm md:text-base leading-relaxed text-gray-800 ml-4">
                <p><strong>Ameya Commercial Projects Private Limited</strong></p>
                <p>Ameya One, DLF – V,</p>
                <p>Golf Course Road,</p>
                <p>Gurgaon – 122002,</p>
                <p>Haryana, India</p>
                <p className="mt-2">Email: sales@ameyagroup.in</p>
                <p>Phone: +91-124-2571477, +91-124-2572477</p>
              </div>
            </div>

            {/* Last Updated */}
            <div className="pt-8 border-t border-gray-200">
              <p className="text-xs md:text-sm text-gray-600 italic">
                Last Updated: December 2024
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Keywords Display */}
      <KeywordsDisplay />
    </main>
  );
};

export default Privacy;

