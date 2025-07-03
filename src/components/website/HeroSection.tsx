import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Html } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';

const PowerPlantModel = () => {
  const { scene } = useGLTF('/assets/Power_Plant_Mid.glb');

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint = 768px
    };

    handleResize(); // initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <primitive 
      object={scene} 
      scale={isMobile ? 0.065 : 0.05} // smaller on mobile
      position={isMobile ? [0, -1.2, 0] : [0, -1, 0]} // slightly lower on mobile
    />
  );
};

const Loader = () => {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Loading...
        </p>
      </div>
    </Html>
  );
};

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-24">
      <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-16">
        
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left space-y-6" data-aos="fade-right">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 dark:text-white">
            Empower Your Production and Inventory Management
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-xl mx-auto md:mx-0">
            Manage fibers, shades, orders, and production workflows effortlessly with Dhya SPIMS — built for modern factories.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
  <a
    href="/login"
    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-base transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
  >
    Get Started
  </a>

 

  <a
    href="https://calendly.com/dharsan-dhya/spims-meeting"
    target="_blank"
    rel="noopener noreferrer"
    className="px-8 py-3 border-2 border-green-600 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-gray-800 rounded-full font-semibold text-base transition-all duration-300 transform hover:-translate-y-1"
  >
    Book a Meeting
  </a>
</div>
        </div>

        {/* Right 3D Model */}
        <div className="flex-1 flex justify-center items-center h-[350px] md:h-[500px]" data-aos="fade-left">
          <Canvas camera={{ position: [2, 2, 5], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Suspense fallback={<Loader />}>
              <PowerPlantModel />
              <OrbitControls autoRotate enableZoom={false} />
            </Suspense>
          </Canvas>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;