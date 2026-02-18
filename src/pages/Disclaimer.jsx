import React from 'react';
import { Link } from 'react-router-dom';
import KeywordsDisplay from '../components/KeywordsDisplay';

const Disclaimer = () => {
  return (
    <main className="bg-white">
      {/* Breadcrumb Navigation */}
      <section className="py-6 px-6 md:px-10 bg-white mt-20">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900 transition-colors">HOME</Link>
            <span>&gt;</span>
            <span className="text-gray-900">DISCLAIMER</span>
          </nav>
        </div>
      </section>

      {/* Disclaimer Content */}
      <section className="py-12 md:py-16 px-6 md:px-10 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block">
              <h1 className="text-2xl md:text-3xl font-light tracking-[0.3em] text-gray-800 mb-3">
                DISCLAIMER
              </h1>
              <div className="w-24 h-[3px] bg-red-700 mx-auto"></div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* General Disclaimer */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                General Information
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                The information contained in this website is for general information purposes only. While Ameya Commercial Projects Private Limited ("Ameya Group") endeavours to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.
              </p>
            </div>

            {/* No Warranty */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                No Warranty
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                This website and its content are provided "as is" without any representations or warranties of any kind. Ameya Group makes no representations or warranties in relation to this website or the information and materials provided on this website. Nothing on this website constitutes, or is meant to constitute, advice of any kind.
              </p>
            </div>

            {/* Limitation of Liability */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Limitation of Liability
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                In no event will Ameya Group be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
              </p>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                Through this website, you may be able to link to other websites which are not under the control of Ameya Group. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.
              </p>
            </div>

            {/* Property Information */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Property Information and Specifications
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                All information regarding properties, including but not limited to dimensions, layouts, specifications, floor plans, images, amenities, facilities, and pricing displayed on this website are indicative and for guidance purposes only. These may be subject to change without prior notice and should not be relied upon as statements of fact or representations.
              </p>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                Interested parties are advised to verify all details independently and refer to the official sale documents, agreements, and approved plans before making any decision. The computer-generated images, walkthroughs, and other visual representations are artistic impressions and may not represent the actual property.
              </p>
            </div>

            {/* Not an Offer */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Not an Offer to Sell
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                Nothing contained in this website shall be construed as an offer to sell or solicitation of an offer to buy any property or unit. Any such offer or solicitation will be made only through formal legal agreements and documents. Any reliance you place on the information available on this website is strictly at your own risk.
              </p>
            </div>

            {/* Compliance and Approvals */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Regulatory Compliance
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                All projects are subject to necessary governmental approvals and clearances. While Ameya Group strives to obtain all required approvals and permissions, any delays or modifications required by regulatory authorities are beyond our control and shall not be considered as a default on our part.
              </p>
            </div>

            {/* Third Party Content */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Third-Party Content and Links
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                This website may contain links to third-party websites or references to third-party brands and services. Ameya Group is not responsible for the content, accuracy, or practices of these third-party sites. The presence of such links does not imply endorsement or association with those parties.
              </p>
            </div>

            {/* Intellectual Property */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Intellectual Property Rights
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                Unless otherwise stated, Ameya Group owns the intellectual property rights for all material on this website. All intellectual property rights are reserved. You may view and print pages from this website for your own personal use, subject to restrictions set in these terms and conditions. You must not republish, sell, or redistribute material from this website without permission.
              </p>
            </div>

            {/* Updates and Modifications */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Updates and Modifications
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                Ameya Group reserves the right to modify, update, or remove any content on this website at any time without prior notice. We may also update this disclaimer from time to time, and it is your responsibility to check this page periodically for changes.
              </p>
            </div>

            {/* Jurisdiction */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Governing Law and Jurisdiction
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                This disclaimer and any disputes arising out of the use of this website shall be governed by and construed in accordance with the laws of India. The courts of Gurgaon, Haryana shall have exclusive jurisdiction over any disputes arising from the use of this website.
              </p>
            </div>

            {/* Contact for Clarifications */}
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Contact for Clarifications
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-gray-800">
                For any questions or clarifications regarding this disclaimer or any information on this website, please contact us at:
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

            {/* Acceptance */}
            <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
              <p className="text-sm md:text-base leading-relaxed text-gray-800 font-semibold">
                By using this website, you acknowledge that you have read, understood, and agreed to be bound by this disclaimer. If you do not agree with any part of this disclaimer, please do not use this website.
              </p>
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

export default Disclaimer;

