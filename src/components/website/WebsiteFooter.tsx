import { Link } from "react-router-dom";
import { FiMail, FiMapPin } from "react-icons/fi";
import { scrollToTop } from '@/utils/scrollToTop';

const WebsiteFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-100 to-white text-gray-600 text-sm pt-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12">

        {/* Logo + About */}
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <span className="text-2xl font-extrabold text-blue-600">
              Dhya
            </span>
            <span className="text-lg font-semibold text-gray-800 tracking-wide">
              SPIMS
            </span>
          </Link>
          <p className="leading-relaxed max-w-xs text-gray-600">
            Smart Production & Inventory Management System. Simplify textile operations through technology.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-5">Quick Links</h4>
          <ul className="space-y-3">
            {[
              { label: "Home", path: "/" },
              { label: "About", path: "/about" },
              { label: "Contact", path: "/contact" },
              { label: "Login", path: "/login" },
            ].map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className="hover:text-blue-600 hover:underline transition"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-5">Resources</h4>
          <ul className="space-y-3">
            <li><a href="/docs" className="hover:text-blue-600 hover:underline transition">Documentation</a></li>
            <li><a href="/docs#faq" className="hover:text-blue-600 hover:underline transition">FAQ</a></li>
            <li><a href="/terms" className="hover:text-blue-600 hover:underline transition">Terms & Conditions</a></li>
            <li><a href="/privacy-policy" className="hover:text-blue-600 hover:underline transition">Privacy Policy</a></li>
            <li><a href="/refund-policy" className="hover:text-blue-600 hover:underline transition">Refund/Cancellation Policy</a></li>
            <li><a href="/disclaimer" className="hover:text-blue-600 hover:underline transition">Disclaimer</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-bold text-gray-800 mb-5">Contact</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <FiMail className="text-blue-600" />
              <a href="mailto:support@dhya.in" className="hover:underline hover:text-blue-600 transition">
                support@dhya.in
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FiMapPin className="text-blue-600" />
              <span>Coimbatore, Tamil Nadu, India</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Divider */}
      <div className="border-t border-gray-300"></div>

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 py-4 max-w-7xl mx-auto px-6 md:px-12">
        {/* Copyright */}
        <div className="text-center md:text-left">
          &copy; {currentYear} Dhya Innovations Private Limited. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default WebsiteFooter;