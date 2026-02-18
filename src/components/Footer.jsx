import { Link } from "react-router-dom";
import "../styles/footer.css";
import "../styles/home2.css";

const Footer = () => {
  return (
    <footer className="ar-footer bg-[#0a0a0a]">
      {/* MAIN FOOTER CONTENT - Responsive Grid Logic */}
      <div className="ar-footer-main-grid py-12 md:py-20 px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 max-w-[1450px] mx-auto gap-10 lg:gap-0">
        
        {/* COLUMN 1: CORPORATE & SALES OFFICES */}
        {/* We keep the border-r only on lg screens (4 columns) */}
        <div className="flex flex-col gap-8 lg:gap-10 lg:pr-12 lg:border-r lg:border-white/10">
          <div className="flex flex-col gap-3">
            <h4 className="text-white text-[20px] md:text-[24px] tracking-[0.4px] PlayfairDisplay">Corporate Office</h4>
            <address className="text-gray-400 text-[13px] md:text-[14px] leading-relaxed not-italic CadillacGothic-Regular">
              Ameya One, Golf Course Road, DLF City V, Sector 42, Gurgaon – 122002, Haryana, India
              
            </address>
          </div>

          {/* SOCIAL ICONS */}
          <div className="flex gap-5 mt-2">
            <a href="#" className="text-white hover:text-[#40a6ff] transition-all duration-300">
              <svg width="18" height="18" viewBox="0 0 152 152" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="m60.4 84.5h-16.1c-2.6 0-3.4-1-3.4-3.4 0-6.5 0-13.2 0-19.7 0-2.6 1-3.6 3.4-3.6h16.1v-14.3c-.2-6.3 1.3-12.7 4.4-18.4 3.3-5.7 8.5-9.9 14.5-12 4.1-1.5 8.1-2.1 12.4-2.1h15.9c2.3 0 3.3 1 3.3 3.3v18.5c0 2.3-1 3.3-3.3 3.3-4.4 0-8.8 0-13.2.2s-6.7 2.1-6.7 6.7c-.2 4.9 0 9.6 0 14.6h18.7c2.6 0 3.6 1 3.6 3.6v19.7c0 2.6-.8 3.6-3.6 3.6h-18.5v52.9c0 2.8-1 3.7-3.7 3.7h-20.3c-2.4 0-3.4-1-3.4-3.4z"/>
              </svg>
            </a>
            <a href="#" className="text-white hover:text-[#40a6ff] transition-all duration-300">
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="#" className="text-white hover:text-[#40a6ff] transition-all duration-300">
              <svg width="16" height="16" viewBox="0 0 1226.37 1226.37" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="m727.348 519.284 446.727-519.284h-105.86l-387.893 450.887-309.809-450.887h-357.328l468.492 681.821-468.492 544.549h105.866l409.625-476.152 327.181 476.152h357.328l-485.863-707.086zm-144.998 168.544-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721h-162.604l-323.311-462.446z"/>
              </svg>
            </a>
            <a href="#" className="text-white hover:text-[#40a6ff] transition-all duration-300">
              <svg width="18" height="18" viewBox="0 0 152 152" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="m140.9 140.9v-47.6c0-23.4-5-41.2-32.3-41.2-13.1 0-21.9 7.1-25.5 14h-.3v-11.9h-25.8v86.7h27v-42.9c0-11.4 2.1-22.2 16.2-22.2s14 13 14 23v42.2zM13.2 54.2h26.9v86.7h-26.9zM26.7 11c-8.6 0-15.7 7-15.7 15.6s7 15.7 15.6 15.7 15.7-7 15.7-15.6v-.2c0-8.5-7-15.5-15.6-15.5z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* COLUMN 2: QUICK LINKS */}
        <div className="flex flex-col gap-5 lg:gap-6 lg:px-12 lg:border-r lg:border-white/10">
          <h4 className="text-white text-[20px] md:text-[24px] tracking-[0.4px] PlayfairDisplay">Quick Links</h4>
          <nav className="flex flex-col gap-3 CadillacGothic-Regular text-[14px] md:text-[16px] text-gray-400">
            <Link to="/" className="hover:text-[#40a6ff] transition-colors w-fit">Home</Link>
            <Link to="/about2" className="hover:text-[#40a6ff] transition-colors w-fit">About Us</Link>
            <Link to="/career" className="hover:text-[#40a6ff] transition-colors w-fit">Career</Link>
            <Link to="/Newsandinsights" className="hover:text-[#40a6ff] transition-colors w-fit">News and Blogs</Link>
            <Link to="/Contactus" className="hover:text-[#40a6ff] transition-colors w-fit">Contact Us</Link>
            <Link to="/PrivacyPolicy" className="hover:text-[#40a6ff] transition-colors w-fit">Privacy Policy</Link>
          </nav>
        </div>

        {/* COLUMN 3: OUR OFFERINGS */}
        <div className="flex flex-col gap-5 lg:gap-6 lg:px-12 lg:border-r lg:border-white/10">
          <h4 className="text-white text-[20px] md:text-[24px] tracking-[0.4px] PlayfairDisplay">Our Offerings</h4>
          <nav className="flex flex-col gap-3 CadillacGothic-Regular text-[14px] md:text-[16px] text-gray-400">
            <Link to="/projects/sapphire-residences" className="hover:text-[#40a6ff] transition-colors w-fit">Residential</Link>
            <Link to="#" className="hover:text-[#40a6ff] transition-colors w-fit">Retail</Link> 
            <Link to="#" className="hover:text-[#40a6ff] transition-colors w-fit">Serviced Apartments</Link>
            <Link to="#" className="hover:text-[#40a6ff] transition-colors w-fit">Office Spaces</Link>
            <Link to="/Leasing" className="hover:text-[#40a6ff] transition-colors w-fit">Leasing</Link>
            <Link to="#" className="hover:text-[#40a6ff] transition-colors w-fit">Investment Plans</Link>
          </nav>
        </div>

        {/* COLUMN 4: FEATURED PROJECTS */}
        <div className="flex flex-col gap-5 lg:gap-6 lg:pl-12">
          <h4 className="text-white text-[20px] md:text-[24px] tracking-[0.4px] PlayfairDisplay">Featured Projects</h4>
          <nav className="flex flex-col gap-3 CadillacGothic-Regular text-[14px] md:text-[16px] text-gray-400">
            <Link to="/projects/sapphire-residences" className="hover:text-[#40a6ff] transition-colors w-fit">Sapphire Residences</Link>
            <Link to="/projects/sapphire-82a" className="hover:text-[#40a6ff] transition-colors w-fit">Sapphire 82A</Link>
            <Link to="/projects/sapphire-57" className="hover:text-[#40a6ff] transition-colors w-fit">Sapphire 57</Link>
            <Link to="/projects/sapphire-92" className="hover:text-[#40a6ff] transition-colors w-fit">Sapphire 92</Link> 
            <Link to="/projects/sapphire-93" className="hover:text-[#40a6ff] transition-colors w-fit">Sapphire 93</Link>
            <Link to="/projects/sapphire-84" className="hover:text-[#40a6ff] transition-colors w-fit">Sapphire 84</Link>
          </nav>
        </div>
      </div>

      {/* BOTTOM BAR - Adaptive for Mobile/Desktop */} 
      <div className="border-t border-white/10 bg-[#050505]">
        <div className="max-w-[1450px] mx-auto px-6 py-6 md:py-8 flex flex-col lg:flex-row justify-between items-center text-center">
          
          {/* TOP GROUP: Copyright and Links */}
          <div className="flex flex-col md:flex-row items-center justify-between w-full lg:w-auto gap-4 md:gap-10">
            {/* Copyright */}
            <div className="text-[12px] md:text-[14px] text-gray-400 CadillacGothic-Regular order-2 md:order-1">
              © 2026 Ameya Group. All Rights Reserved.
            </div>

            {/* Privacy & Terms */}
            {/* <div className="flex gap-6 md:gap-8 text-[12px] md:text-[14px] order-1 md:order-2">
              <Link to="/Privacypolicy" className="hover:text-[#40a6ff] transition-colors text-gray-400 CadillacGothic-Regular">Privacy Policy</Link>
              <Link to="#" className="hover:text-[#40a6ff] transition-colors text-gray-400 CadillacGothic-Regular">Terms & Conditions</Link>
            </div> */}
          </div>

          {/* BOTTOM GROUP: Credit (Small on mobile/tab, moves to right on desktop) */}
          <div className="mt-6 lg:mt-0 order-3 lg:ml-auto">
            <div className="text-[10px] md:text-[11px] lg:text-[14px] text-gray-500 CadillacGothic-Regular tracking-wider">
              Developed by <span className="text-gray-400 lg:text-white uppercase lg:capitalize">I Create Brand</span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;