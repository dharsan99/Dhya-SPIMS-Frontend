import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PowerPlantModel from './PowerPlantModel';

interface ThreeJSWrapperProps {
  isMobile: boolean;
}

const Loader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const ThreeJSWrapper: React.FC<ThreeJSWrapperProps> = ({ isMobile }) => {
  return (
    <div className="w-full h-full bg-gray-100 rounded-lg">
      <Canvas 
        camera={{ position: [2, 2, 5], fov: 50 }}
        dpr={isMobile ? 1 : window.devicePixelRatio}
        gl={{ 
          antialias: !isMobile,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
          depth: true
        }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Suspense fallback={<Loader />}>
          <PowerPlantModel />
          <OrbitControls 
            autoRotate 
            enableZoom={false}
            autoRotateSpeed={isMobile ? 0.5 : 1}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeJSWrapper; 