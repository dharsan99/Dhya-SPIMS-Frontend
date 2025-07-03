import { Link } from 'react-router-dom';
import HeroSection from '../../components/website/HeroSection';
import FeatureSection from '../../components/website/FeatureSection';
import TestimonialSection from '../../components/website/TestimonialSection';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white transition-colors duration-300">
      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        
        {/* Hero Section */}
        <section className="relative">
          <HeroSection />
        </section>

        {/* Features Section */}
        <section className="relative bg-gradient-to-b from-white to-blue-50">
          <div className="relative">
            <FeatureSection />
          </div>
        </section>

        {/* Testimonials Section */}
        <TestimonialSection />

        {/* Call to Action */}
        <section className="relative bg-blue-600 text-center text-white overflow-hidden">
          <div className="max-w-4xl mx-auto px-6 py-28 animate-fadeInUp">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6">
              Transform Your Spinning Mill Operations
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-10">
              TexIntelli helps you streamline fibers, shades, production tracking, and more with a smart, integrated platform designed for modern spinning mills.
            </p>

            <div className="flex justify-center gap-6 flex-wrap">
              {/* Get Started Button */}
              <Link
                to="/login"
                className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
              >
                Get Started
              </Link>

              {/* Book a Meeting Button */}
              <a
                href="https://calendly.com/dharsan-dhya/TexIntelli-meeting" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-2 border-white text-white hover:bg-blue-500 font-semibold px-8 py-3 rounded-full transition transform hover:-translate-y-1"
              >
                Book a Meeting
              </a>
            </div>
          </div>

          {/* Decorative Background SVG */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg
              className="absolute top-0 left-1/2 transform -translate-x-1/2 opacity-10"
              width="1440"
              height="560"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="720" cy="280" r="400" fill="url(#paint0_radial)" />
              <defs>
                <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(720 280) rotate(90) scale(400)">
                  <stop stopColor="#ffffff" />
                  <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </section>

      </main>
    </div>
  );
};

export default LandingPage;