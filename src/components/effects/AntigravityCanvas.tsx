import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

type Particle = { x: number; y: number; z: number; vx: number; vy: number; vz: number };

/** Apple-style floating particle field — pure Canvas 2D (no Three.js / eval) */
export default function AntigravityCanvas({
  className = "",
  intensity = 1,
  accent,
}: {
  className?: string;
  intensity?: number;
  accent?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const mouse = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const count = Math.floor(55 * intensity);
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004,
      vy: (Math.random() - 0.5) * 0.0004,
      vz: (Math.random() - 0.5) * 0.0003,
    }));

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      };
    };

    const color =
      accent ||
      getComputedStyle(document.documentElement).getPropertyValue("--vc-accent").trim() ||
      "#00f0ff";

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const mx = (mouse.current.x - 0.5) * 0.08;
      const my = (mouse.current.y - 0.5) * 0.08;

      for (const p of particles) {
        p.x += p.vx + mx * p.z * 0.02;
        p.y += p.vy + my * p.z * 0.02;
        p.z += p.vz;
        if (p.x < 0 || p.x > 1) p.vx *= -1;
        if (p.y < 0 || p.y > 1) p.vy *= -1;
        if (p.z < 0 || p.z > 1) p.vz *= -1;

        const scale = 0.4 + p.z * 0.9;
        const px = p.x * w;
        const py = p.y * h;
        const r = (1.2 + p.z * 2.5) * scale;

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.15 + p.z * 0.55;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [reduced, intensity, accent]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden
    />
  );
}
