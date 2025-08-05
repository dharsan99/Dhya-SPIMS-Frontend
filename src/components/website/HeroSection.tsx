import React from 'react';
import { useEffect, useState } from 'react';

// Lazy load Three.js components only when needed
const LazyThreeJS = React.lazy(() => import('./ThreeJSWrapper'));

// Set this to false to disable 3D completely for testing
const ENABLE_3D = true;

const HeroSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [show3D, setShow3D] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Only load 3D if enabled and on desktop or after a delay on mobile
      if (ENABLE_3D) {
        if (!mobile) {
          // Small delay to ensure everything is loaded
          setTimeout(() => setShow3D(true), 500);
        } else {
          // Delay 3D loading on mobile to improve initial load
          const timer = setTimeout(() => setShow3D(true), 3000);
          return () => clearTimeout(timer);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Error boundary for 3D component
  if (error || !ENABLE_3D) {
    return (
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-16">
          <div className="flex-1 text-center md:text-left space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
              Smart Spinning Mill Management System
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto md:mx-0">
              Streamline your spinning operations with comprehensive production tracking, inventory management, and real-time analytics — all in one powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <a
                href="/login"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-base transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
              >
                Get Started
              </a>
              <a
                href="https://calendly.com/dharsan-dhya/TexIntelli-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full font-semibold text-base transition-all duration-300 transform hover:-translate-y-1"
              >
                Book a Meeting
              </a>
            </div>
          </div>
          <div className="flex-1 flex justify-center items-center h-[350px] md:h-[500px]">
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg w-full">
              <div className="text-center">
                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">🏭</span>
                </div>
                <p className="text-gray-600 text-lg font-semibold">Spinning Mill Management</p>
                <p className="text-gray-500 text-sm">Smart Production System</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white py-24">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-16">
        
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left space-y-6" data-aos="fade-right">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900">
            Smart Spinning Mill Management System
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-xl mx-auto md:mx-0">
            Streamline your spinning operations with comprehensive production tracking, inventory management, and real-time analytics — all in one powerful platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
            <a
              href="/login"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-base transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
            >
              Get Started
            </a>

            <a
              href="https://calendly.com/dharsan-dhya/TexIntelli-meeting"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 rounded-full font-semibold text-base transition-all duration-300 transform hover:-translate-y-1"
            >
              Book a Meeting
            </a>
          </div>
        </div>

        {/* Right 3D Model - Conditionally rendered */}
        <div className="flex-1 flex justify-center items-center h-[350px] md:h-[500px]" data-aos="fade-left">
          {show3D ? (
            <ErrorBoundary onError={(err) => {
              if (typeof err === 'string') setError(err);
              else if (err && typeof err === 'object' && 'message' in err) setError((err as Error).message);
              else setError('Unknown error');
            }}>
              <React.Suspense fallback={
                <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg w-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading 3D Model...</p>
                  </div>
                </div>
              }>
                <LazyThreeJS isMobile={isMobile} />
              </React.Suspense>
            </ErrorBoundary>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg w-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading 3D Model...</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: (error: string) => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: (error: string) => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('3D Model Error:', error, errorInfo);
    this.props.onError(error.message);
  }

  render() {
    if (this.state.hasError) {
      return null; // Let parent handle the fallback
    }

    return this.props.children;
  }
}

export default HeroSection;