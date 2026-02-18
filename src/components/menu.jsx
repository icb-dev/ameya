import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo/ameya-logo.png";
import "../styles/header.css"; 

const menu2 = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Detect scroll for sticky effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if we're on a page that needs a white navbar
  const needsWhiteNavbar = location.pathname !== '/';

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed w-full top-0 z-50 transition-all duration-300 ${
          isScrolled || needsWhiteNavbar ? "bg-white shadow-md translate-y-0" : "bg-transparent"
        }`}
      >
        <div className="w-[100%] md:w-[70%]  mx-auto flex items-end justify-between px-0 py-3">
          
          {/* Logo */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className={`transition-all duration-300 ${
                isScrolled || needsWhiteNavbar ? "w-[120px] md:w-[130px]" : "w-[100px] md:w-[140px]"
              }`}
            />
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-10 font-medium text-gray-700">
            <li className="ar-nav-li">
              <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
            </li>
            <li className="ar-nav-li">
              <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About Us</Link>
            </li>
            <li className="ar-nav-li">
              <Link to="/projects" className={location.pathname === '/projects' ? 'active' : ''}>Projects</Link>
            </li>
            <li className="ar-nav-li">
              <Link to="/career" className={location.pathname === '/career' ? 'active' : ''}>Career</Link>
            </li>
            <li className="ar-nav-li ar-nav-li-0">
              <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact Us</Link>
            </li>
          </ul>

          {/* Mobile Menu Icon */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden outline-none"
          >
            {/* 3 vertical dots SVG */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="ar-toggle"
            >
              <circle cx="12" cy="5" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="19" r="2" />
            </svg>
          </button>
        </div>
      </nav>

      {/* SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button onClick={() => setSidebarOpen(false)}>
            {/* Close (X) SVG */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
              strokeWidth="2"
              className="text-gray-700"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Sidebar Menu */}
        <ul className="flex flex-col items-center mt-10 space-y-6 text-lg text-gray-700">
          <li className="hover:text-black cursor-pointer">
            <Link to="/" onClick={() => setSidebarOpen(false)}>Home</Link>
          </li>
          <li className="hover:text-black cursor-pointer">
            <Link to="/about" onClick={() => setSidebarOpen(false)}>About Us</Link>
          </li>
          <li className="hover:text-black cursor-pointer">
            <Link to="/projects" onClick={() => setSidebarOpen(false)}>Projects</Link>
          </li>
          <li className="hover:text-black cursor-pointer">
            <Link to="/career" onClick={() => setSidebarOpen(false)}>Career</Link>
          </li>
          <li className="hover:text-black cursor-pointer">
            <Link to="/contact" onClick={() => setSidebarOpen(false)}>Contact Us</Link>
          </li>
        </ul>
      </div>

      {/* BACKDROP when sidebar open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default menu2;
