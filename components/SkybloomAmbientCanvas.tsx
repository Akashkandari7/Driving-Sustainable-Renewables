"use client";

import { useEffect, useRef } from "react";

export default function SkybloomAmbientCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mouse coordinates for interactive parallax
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Organic biophilic solar particles
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1.5 + Math.random() * 3.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.3 - Math.random() * 0.5, // gentle upward drift like warm air / photons
      alpha: 0.15 + Math.random() * 0.45,
      color: Math.random() > 0.45 ? "16, 185, 129" : "14, 165, 233", // Emerald or Solar Cyan
      pulse: Math.random() * Math.PI,
    }));

    let time = 0;

    const render = () => {
      time += 0.015;
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Soft sunlight ambient wash at top
      const sunGradient = ctx.createRadialGradient(
        width * 0.5 + (mouse.x - width * 0.5) * 0.1,
        -50 + (mouse.y - height * 0.5) * 0.05,
        50,
        width * 0.5,
        -50,
        width * 0.65
      );
      sunGradient.addColorStop(0, "rgba(52, 211, 153, 0.09)");
      sunGradient.addColorStop(0.5, "rgba(56, 189, 248, 0.04)");
      sunGradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = sunGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Render floating clean-energy photons
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        // Wrap around edges
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const dynamicAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

        ctx.beginPath();
        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
        radGrad.addColorStop(0, `rgba(${p.color}, ${dynamicAlpha})`);
        radGrad.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = radGrad;
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
