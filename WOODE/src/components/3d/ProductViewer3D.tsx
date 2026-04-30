import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF, BakeShadows } from '@react-three/drei';

interface ModelProps {
  url: string;
}

// Model component
function Model({ url }: ModelProps) {
  // useGLTF will load the .gltf or .glb file
  const { scene } = useGLTF(url);
  // Clone the scene if we plan to use it multiple times, but here returning it directly is fine
  return <primitive object={scene} />;
}

interface ProductViewer3DProps {
  modelUrl?: string;
  imageUrl?: string;
  alt?: string;
  className?: string;
}

export function ProductViewer3D({ modelUrl, imageUrl, alt, className = '' }: ProductViewer3DProps) {
  // Fallback to 2D image if no 3D model is provided
  if (!modelUrl) {
    return (
      <div className={`relative w-full h-full bg-[#1A1A1A] rounded-xl overflow-hidden flex items-center justify-center ${className}`}>
        {imageUrl ? (
          <img src={imageUrl} alt={alt || 'Product'} className="object-cover w-full h-full" />
        ) : (
          <div className="text-[--color-text-muted] font-medium">No image available</div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full bg-[#1A1A1A] rounded-xl overflow-hidden ${className}`}>
      <Canvas shadows camera={{ position: [0, 0, 150], fov: 50 }}>
        <color attach="background" args={['#1A1A1A']} />
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6} adjustCamera={1.2}>
            <Model url={modelUrl} />
          </Stage>
        </Suspense>
        <BakeShadows />
        <OrbitControls
          makeDefault
          autoRotate
          autoRotateSpeed={0.5}
          enableZoom={true}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
      <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
        <span className="bg-[#1F1C18]/80 text-[#E0B84F] text-xs px-3 py-1.5 rounded-full backdrop-blur-sm border border-[#4A4035]">
          Tương tác 3D: Kéo để xoay, Cuộn để zoom
        </span>
      </div>
    </div>
  );
}

// Preload common models if needed
// useGLTF.preload('/models/chair-nordic.gltf')
