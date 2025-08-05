import { useGLTF } from '@react-three/drei';
import { useEffect, useState } from 'react';

const PowerPlantModel = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Always call useGLTF at the top level
  const { scene } = useGLTF('/assets/Power_Plant_Mid.glb');
  
  return (
    <primitive 
      object={scene} 
      scale={isMobile ? 0.065 : 0.05}
      position={isMobile ? [0, -1.2, 0] : [0, -1, 0]}
    />
  );
};

// Preload the model
useGLTF.preload('/assets/Power_Plant_Mid.glb');

export default PowerPlantModel; 