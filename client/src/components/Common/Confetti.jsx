import { useEffect, useRef } from 'react';

const COLORS = ['#9b72cf', '#e8647a', '#c9a84c', '#3dbfb8', '#f0d080', '#ff9de2', '#7ec8e3'];
const SHAPES = ['rect', 'circle', 'ribbon'];
const PARTICLE_COUNT = 140;

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function createParticle(canvasWidth) {
  return {
    x: randomBetween(0, canvasWidth),
    y: randomBetween(-200, -10),
    w: randomBetween(6, 14),
    h: randomBetween(6, 18),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    speedY: randomBetween(2.5, 5.5),
    speedX: randomBetween(-1.5, 1.5),
    rotation: randomBetween(0, Math.PI * 2),
    rotSpeed: randomBetween(-0.08, 0.08),
    opacity: 1,
    swing: randomBetween(0.5, 1.5),
    swingOffset: randomBetween(0, Math.PI * 2),
  };
}

export default function Confetti({ onDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: PARTICLE_COUNT }, () => createParticle(canvas.width));
    let frame = 0;
    let rafId;

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(frame * 0.03 * p.swing + p.swingOffset) * 0.8;
        p.rotation += p.rotSpeed;
        if (frame > 90) p.opacity = Math.max(0, p.opacity - 0.012);

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'ribbon') {
          ctx.beginPath();
          ctx.moveTo(-p.w / 2, -p.h / 2);
          ctx.quadraticCurveTo(p.w / 2, 0, -p.w / 2, p.h / 2);
          ctx.quadraticCurveTo(p.w / 2, 0, -p.w / 2, -p.h / 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }

        ctx.restore();
      });

      const alive = particles.some((p) => p.opacity > 0 && p.y < canvas.height);
      if (alive) {
        rafId = requestAnimationFrame(draw);
      } else {
        onDone?.();
      }
    }

    rafId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafId);
  }, [onDone]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}
    />
  );
}
