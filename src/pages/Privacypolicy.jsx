import React from 'react';
import { motion } from 'framer-motion';

// Asset Import - Using the corporate banner asset
import bannerImg from "../assets/images/privacybnr.jpg"; 

const PrivacyPolicy = () => {
  return (
    <div className="bg-white min-h-screen selection:bg-[#28659b] selection:text-white">
      
      {/* SECTION 1: CORPORATE BANNER */}
      <section className="relative h-[50vh] md:h-[65vh] flex items-end overflow-hidden bg-black">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src={bannerImg}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            alt="Ameya Group Legal"
          />
          <div className="absolute inset-0 z-[5] bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        <div className="relative z-10 w-full max-w-[1450px] mx-auto px-6 pb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-3xl md:text-[48px] font-serif PlayfairDisplay tracking-tight"
          >
            Privacy Policy
          </motion.h1>
          {/* BREADCRUMB */}
          <div className="flex items-center gap-2 mt-4 text-white/70 text-[10px] md:text-[12px] uppercase tracking-[0.3em] CadillacGothic-Regular">
             <span>Home</span>
             <span className="text-[#9d2a2a]">/</span>
             <span className="text-white">Legal</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: CONTENT LAYOUT */}
      <section className="max-w-[1450px] mx-auto px-6 py-24">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* LEFT 65%: FULL ORIGINAL CONTENT */}
          <div className="lg:w-[65%]">
            <div className="space-y-12 CadillacGothic-Regular text-gray-600 leading-[1.8] text-[15px]">
              
              {/* INTRODUCTION */}
              <div className="space-y-6">
                <p className="text-black leading-[1.5] tracking-normal">
                  Ameya Commercial Projects Private Limited and its group companies (hereinafter referred to as “Ameya Group” “us” “we” or “our”) is committed to respecting your privacy and to complying with applicable data protection and privacy laws of India.
                </p>
              </div>

              {/* ACCEPTANCE */}
              <div className="space-y-6">
                <h3 className="text-[22px] md:text-[28px] lg:text-[32px] xl:text-[38px] font-serif PlayfairDisplay text-black tracking-tight flex items-center gap-4">
                  Acceptance <span className="h-[1px] flex-grow bg-gray-100"></span>
                </h3>
                <p className="text-black leading-[1.5] tracking-normal">
                  By using this website, you signify your acceptance to Ameya Group Privacy Policy. While information is the cornerstone of our ability to provide superior service, our most important asset is our customer’s trust. Keeping our customer’s information secure and using it only as per our customer’s requirement, has been a top priority for all of us at Ameya Group. 
                </p>
                <p className="text-black leading-[1.5] tracking-normal">
                  We will safeguard all information of our customers that has been shared with us in accordance with the standards of security as per the applicable laws prevalent in India. We use your Personal information only for providing and improving the site. By using the site, you agree to the collection and use of information in accordance with this Policy. 
                </p>
                <p className="text-black leading-[1.5] tracking-normal">
                  We compile personally identifiable information when you submit the enquiry form on our website. While using our site, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personal identifiable information may include but is not limited to your name. We will limit the collection and usage of customer information to the required minimum in order to provide service to our customers. 
                </p>
                <p className="text-black leading-[1.5] tracking-normal">
                  This includes but is not limited to, advising our customers about our products, services and other opportunities, and to administer our business and for compliance with their own legal obligations, including maintaining books & records.
                </p>
                <p className="text-black leading-[1.5] tracking-normal">
                  We will permit only authorized employees, who are trained in proper handling of customer information, to access such information such as providing and personalizing the services, communication with you, facilitating the loyalty programs and to accomplish our business purposes. We do not sell, rent or share personally identifiable information made available to us.
                </p>
              </div>

              {/* DISCLAIMER */}
              <div className="space-y-6 bg-[#f9f9f9] p-8 border-l-4 border-[#9d2a2a]">
                <h3 className="text-[22px] md:text-[28px] lg:text-[32px] xl:text-[38px] font-serif PlayfairDisplay text-black tracking-tight">
                  Disclaimer
                </h3>
                <p className="text-black leading-[1.5] tracking-normal">
                  All images (other than the actual images used) are merely artistic conceptualization, indicative in nature and do not replicate the exact product and should not be relied upon as definitive reference. Landscape amenities, accessories used, and furniture layout are only indicative in nature of how the furnished unit may appear, upon completion, and is merely an Artist’s Rendition only.
                </p>
                <p className="text-black leading-[1.5] tracking-normal">
                  Any images, plans, layouts, plot sizes, etc., are indicative and are subject to change as decided by Ameya Group or as directed by Competent Authority from time to time, and as deemed necessary. You/ intending purchasers are requested to contact the relevant project office to understand the details regarding the project and only after thorough understanding about the same and taking appropriate advice, take further decision regarding in relation to the projects.
                </p>
                <p className="text-black leading-[1.5] tracking-normal">
                  We will use and disclose customer information as we believe to be necessary or appropriate: (a) to comply with applicable law, including laws outside your country of residence; (b) to comply with legal process; (c) to respond to requests from public and government authorities, including authorities outside your country of residence and to meet national security or law enforcement requirements; (d) to enforce our terms and conditions; (e) to protect our operations, such as in the event of any reorganization, merger, sale, joint venture, assignment, transfer (f) to protect the rights, privacy, safety or property of Ameya Group; and (g) to allow us to pursue available remedies or limit the damages that we may sustain.
                </p>
                <p className="text-black leading-[1.5] tracking-normal">
                  We may use and disclose the customer information for any purpose, except where we are not allowed to under applicable law.
                </p>
              </div>

              {/* COPYRIGHT NOTICE */}
              <div className="space-y-6">
                <h3 className="text-[22px] md:text-[28px] lg:text-[32px] xl:text-[38px] font-serif PlayfairDisplay text-black tracking-tight flex items-center gap-4">
                  Copyright Notice <span className="h-[1px] flex-grow bg-gray-100"></span>
                </h3>
                <p className="text-black leading-[1.5] tracking-normal">
                  All content, design, site plans (Intellectual Property) and materials on this Web Site are protected by copyright law and applicable International Treaties and are exclusive property of Ameya Group. No person can use or reproduce or allow any other to use or reproduce any image or logo (such as the name) for any reason without prior written consent from Ameya Group. 
                </p>
                <p className="text-black leading-[1.5] tracking-normal">
                  No person is allowed to retrieve and display the content available on this website for personal, commercial and non-commercial purpose, or cannot reproduce, modify or in any way to make commercial use of the content. The use of content on this website without permission is prohibited. The privacy policy is subject to change and any modification to the privacy policy will be communicated here. You may not otherwise change, reproduce, distribute, publicly perform, or display this material in any way, without prior written approval of Ameya Group.
                </p>
              </div>

              {/* LIMITATION OF LIABILITY */}
              <div className="space-y-6">
                <h3 className="text-[22px] md:text-[28px] lg:text-[32px] xl:text-[38px] font-serif PlayfairDisplay text-black tracking-tight flex items-center gap-4">
                  General Limitation of Liability <span className="h-[1px] flex-grow bg-gray-100"></span>
                </h3>
                <p className="text-black leading-[1.5] tracking-normal">
                  Ameya Group cannot be held liable for any loss, monetary or otherwise, resulting from the usage and display of the information on this site or for the lawful use of the customer information. Ameya Group and/or its directors, employees, are not liable for any consequence of any action taken by the viewer relying on such material information herein.
                </p>
                <p className="text-black leading-[1.5] tracking-normal">
                  This site contains links to other sites and Ameya Group shall not be responsible at any point in time, for the privacy practices or the content of such web sites.
                </p>
              </div>

              {/* NOTICE OF CHANGES */}
              <div className="space-y-6">
                <h3 className="text-2xl font-serif PlayfairDisplay text-black tracking-tight flex items-center gap-4">
                  Notice of changes <span className="h-[1px] flex-grow bg-gray-100"></span>
                </h3>
                <p className="text-black leading-[1.5] tracking-normal">
                  From time to time, we may change or revise this Internet Privacy Policy.
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT 35%: STICKY CONTACT SIDEBAR */}
          <aside className="lg:w-[35%] h-[100vh] overflow-visible">
            <div className="sticky top-32 space-y-10">
              
              {/* CONTACT CARD */}
              <div className="bg-white border border-gray-100 p-10 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
                <h4 className="text-[12px] uppercase tracking-[1px] md:tracking-[0.2em] font-bold mb-10 CadillacGothic-Regular text-[#28659b]">Contacting the Website</h4>
                <div className="space-y-8 CadillacGothic-Regular">
                  <div>
                    <p className="text-black font-serif PlayfairDisplay text-[22px] md:text-[28px] leading-snug mb-2">Ameya Commercial Projects Private Limited</p>
                    <p className="text-gray-800 text-[12px] md:text-[14px] leading-relaxed">
                      Ameya One, Sector - 42, DLF V,<br />
                      DLF Golf Course Road, Gurugram - 122002
                    </p>
                  </div>
                  
                  <div className="pt-8 border-t border-gray-100">
                    <p className="text-[8px] md:text-[10px] uppercase tracking-[0.2em] text-gray-600 mb-2">Corporate Information</p>
                    <p className="text-black text-sm tracking-[0.2px] md:tracking-widest font-bold">CIN: U70200DL2009PTC195340</p>
                  </div>
                  
                  <button className="relative group w-full py-5 bg-[#28659b] text-white overflow-hidden text-[11px] uppercase tracking-[0.2em] font-bold transition-all">
                    <span className="relative z-10">Inquire Now</span>
                    <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  </button>
                </div>
              </div>

              {/* TRUST BADGE */}
              <div className="p-8 border-2 border-gray-100 text-center">
                 <p className="text-[10px] CadillacGothic-Regular text-gray-600 uppercase  tracking-[0.1em] md:tracking-[0.3em]">Customer Trust is our Priority</p>
              </div>

            </div>
          </aside>

        </div>
      </section>

    </div>
  );
};

export default PrivacyPolicy;