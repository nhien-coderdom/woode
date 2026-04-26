import { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  url: string;
}

function RotatingModel({ url }: ModelProps) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);

  // Center and normalize the model scale upon load
  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      
      const maxDim = Math.max(size.x, size.y, size.z);
      const targetScale = 3 / maxDim; // Fit within a 3-unit bounding box
      setScale(targetScale);
      
      // Center the model
      setPosition([
        -center.x * targetScale,
        -center.y * targetScale,
        -center.z * targetScale
      ]);
    }
  }, [scene]);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive 
        object={scene} 
        scale={scale} 
        position={position} 
      />
    </group>
  );
}

interface FeaturedProduct3DProps {
  modelUrl: string;
  className?: string;
}

export function FeaturedProduct3D({ modelUrl, className = '' }: FeaturedProduct3DProps) {
  return (
    <div className={`relative w-full h-full bg-transparent ${className}`}>
      <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
        <Suspense fallback={null}>
          <Environment preset="city" />
          <RotatingModel url={modelUrl} />
        </Suspense>
      </Canvas>
    </div>
  );
}
