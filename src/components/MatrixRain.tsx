import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>{}[];:=+*/\\|!@#$%";
    const fontSize = 13;
    let drops: number[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -100);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      // Fade to transparent (not black) by clearing with low alpha
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();
      for (let i = 0; i < drops.length; i++) {
        const y = drops[i] * fontSize;
        if (y < 0) {
          drops[i] += 0.5;
          continue;
        }

        // Seed per-column randomness
        const seed = (i * 7 + now * 0.001) % 1;

        // Draw multiple trailing characters for the rain column
        const trailLength = 12;
        for (let t = 0; t < trailLength; t++) {
          const trailY = y - t * fontSize;
          if (trailY < 0) break;

          const char = chars[Math.floor((Math.random() + seed) * chars.length) % chars.length];
          const alpha = t === 0 ? 1 : (1 - t / trailLength) * 0.6;

          if (t === 0) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          } else if (t < 3) {
            ctx.fillStyle = `rgba(0, 229, 255, ${alpha})`; // cyan
          } else {
            ctx.fillStyle = `rgba(255, 0, 122, ${alpha})`; // pink
          }

          ctx.font = `${fontSize}px monospace`;
          ctx.fillText(char, i * fontSize, trailY);
        }

        // Reset column
        if (y > canvas.height && Math.random() > 0.97) {
          drops[i] = Math.random() * -50;
        }
        drops[i] += 0.5;
      }
    };

    const id = setInterval(draw, 40);
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.18 }}
      aria-hidden="true"
    />
  );
}
