import { useEffect, useRef } from "react";

const fallbackGradientColors = ["#0a528e", "#bf9ce4"];

function getGradientColors() {
  const gradientValue = getComputedStyle(document.documentElement)
    .getPropertyValue("--gradient-color")
    .trim();
  const colors = gradientValue.match(/#[0-9a-f]{3,8}\b|rgba?\([^)]+\)/gi);

  return colors && colors.length >= 2 ? colors.slice(0, 2) : fallbackGradientColors;
}

const AnimatedWave = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars = "·∘○◯◌●◉";
    let time = 0;
    let waveColors = getGradientColors();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const refreshWaveColors = () => {
      waveColors = getGradientColors();
    };

    resize();
    window.addEventListener("resize", resize);
    const themeObserver = new MutationObserver(refreshWaveColors);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const cols = Math.floor(rect.width / 20);
      const rows = Math.floor(rect.height / 20);
      const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
      gradient.addColorStop(0, waveColors[0]);
      gradient.addColorStop(1, waveColors[1]);
      ctx.fillStyle = gradient;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const px = (x + 0.5) * (rect.width / cols);
          const py = (y + 0.5) * (rect.height / rows);

          // Multiple wave interference
          const wave1 = Math.sin(x * 0.2 + time * 2) * Math.cos(y * 0.15 + time);
          const wave2 = Math.sin((x + y) * 0.1 + time * 1.5);
          const wave3 = Math.cos(x * 0.1 - y * 0.1 + time * 0.8);
          
          const combined = (wave1 + wave2 + wave3) / 3;
          const normalized = (combined + 1) / 2;
          
          const charIndex = Math.floor(normalized * (chars.length - 1));
          const alpha = 0.3 + normalized * 0.65;

          ctx.globalAlpha = alpha;
          ctx.fillText(chars[charIndex], px, py);
        }
      }

      ctx.globalAlpha = 1;
      time += 0.03;
      frameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
      cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: "block" }}
    />
  );
}

export default AnimatedWave;
