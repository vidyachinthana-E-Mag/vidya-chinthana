import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";
import type * as THREE from "three";

export type SciFi3DVariant = "hero" | "auth" | "splash" | "profile";

function readAccent(fallback?: string) {
  if (fallback) return fallback;
  const c = getComputedStyle(document.documentElement).getPropertyValue("--vc-accent").trim();
  return c || "#00f0ff";
}

function useAccent(accent?: string) {
  const [color, setColor] = useState(() => readAccent(accent));
  useEffect(() => {
    setColor(readAccent(accent));
  }, [accent]);
  return color;
}

function WireCore({ color, scale = 1 }: { color: string; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.12;
    ref.current.rotation.y = state.clock.elapsedTime * 0.18;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.35} floatIntensity={0.5}>
      <mesh ref={ref} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color={color}
          wireframe
          emissive={color}
          emissiveIntensity={0.85}
          metalness={0.55}
          roughness={0.25}
        />
      </mesh>
    </Float>
  );
}

function OrbitRing({ color, radius }: { color: string; radius: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = state.clock.elapsedTime * 0.22;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2.4, 0, 0]}>
      <torusGeometry args={[radius, 0.025, 12, 72]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

function SceneContent({ variant, accent }: { variant: SciFi3DVariant; accent: string }) {
  const config = useMemo(() => {
    switch (variant) {
      case "auth":
        return { core: 0.65, stars: 700, rings: false };
      case "splash":
        return { core: 0.85, stars: 1000, rings: true };
      case "profile":
        return { core: 0.4, stars: 350, rings: false };
      default:
        return { core: 1, stars: 1400, rings: true };
    }
  }, [variant]);

  return (
    <>
      <ambientLight intensity={0.32} />
      <pointLight position={[4, 4, 4]} intensity={1.1} color={accent} />
      <pointLight position={[-3, -2, 3]} intensity={0.55} color="#ffffff" />
      <Stars radius={70} depth={35} count={config.stars} factor={2.5} saturation={0} fade speed={0.45} />
      <WireCore color={accent} scale={config.core} />
      {config.rings && (
        <>
          <OrbitRing color={accent} radius={2.1} />
          <OrbitRing color={accent} radius={2.75} />
        </>
      )}
    </>
  );
}

export default function SciFiHero3DScene({
  variant = "hero",
  className = "",
  intensity = 1,
  accent: accentProp,
}: {
  variant?: SciFi3DVariant;
  className?: string;
  intensity?: number;
  accent?: string;
}) {
  const accent = useAccent(accentProp);
  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.5) : 1;

  return (
    <div className={`sci-fi-hero-3d absolute inset-0 pointer-events-none ${className}`} aria-hidden>
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0, 5.5], fov: 48 }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ opacity: 0.5 + intensity * 0.22 }}
      >
        <Suspense fallback={null}>
          <SceneContent variant={variant} accent={accent} />
        </Suspense>
      </Canvas>
    </div>
  );
}
