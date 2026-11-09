import { useEffect, useRef, type MutableRefObject } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type Petal = { x: number; y: number; s: number; r: number; vr: number; vx: number; vy: number; depth: number; hue: number; phase: number };

const COLORS = ['235,169,183', '248,222,228', '231,154,172', '251,246,236'];

/**
 * Canvas of slowly drifting petals. `progress` (0–1) adds scroll parallax:
 * near petals (high depth) move further than far ones.
 * Pauses when off-screen or the tab is hidden. Not rendered for reduced motion.
 */
export function PetalField({ progress, density = 1 }: { progress: MutableRefObject<number>; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = ref.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let petals: Petal[] = [];

    const seed = () => {
      const count = Math.round((w < 768 ? 14 : 30) * density);
      petals = Array.from({ length: count }, () => {
        const depth = 0.3 + Math.random() * 0.7;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          s: (6 + Math.random() * 10) * depth * (w < 768 ? 0.8 : 1),
          r: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.01,
          vx: 0.15 + Math.random() * 0.35,
          vy: 0.2 + Math.random() * 0.45,
          depth,
          hue: Math.floor(Math.random() * COLORS.length),
          phase: Math.random() * Math.PI * 2,
        };
      });
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!petals.length) seed();
    };

    const drawPetal = (p: Petal, t: number) => {
      const parallax = -progress.current * h * 0.9 * p.depth;
      const y = ((p.y + parallax) % (h + 40) + h + 40) % (h + 40) - 20;
      const sway = Math.sin(t * 0.0006 + p.phase) * 18 * p.depth;
      ctx.save();
      ctx.translate(p.x + sway, y);
      ctx.rotate(p.r);
      // Flip on one axis over time so petals appear to tumble.
      ctx.scale(1, 0.55 + 0.45 * Math.sin(t * 0.0012 + p.phase));
      ctx.beginPath();
      ctx.moveTo(0, -p.s);
      ctx.quadraticCurveTo(p.s * 0.9, -p.s * 0.2, 0, p.s);
      ctx.quadraticCurveTo(-p.s * 0.9, -p.s * 0.2, 0, -p.s);
      ctx.fillStyle = `rgba(${COLORS[p.hue]},${0.35 + p.depth * 0.5})`;
      ctx.fill();
      ctx.restore();
    };

    const frame = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of petals) {
        p.x += p.vx * p.depth;
        p.y += p.vy * p.depth;
        p.r += p.vr;
        if (p.x > w + 20) p.x = -20;
        if (p.y > h + 20) p.y = -20;
        drawPetal(p, t);
      }
      raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
    };

    const start = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    resize();
    start();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      start();
    });
    io.observe(canvas);
    const onVis = () => start();
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reduced, density, progress]);

  if (reduced) return null;
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />;
}
