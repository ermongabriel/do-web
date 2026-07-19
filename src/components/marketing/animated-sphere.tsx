import { useEffect, useRef } from "react";

export function AnimatedSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // const chars = "░▒▓█▀▄▌▐│─┤├┴┬╭╮╰╯";
    const chars = "DO";
    let time = 0;

    // determine fill color based on nearest non-transparent ancestor background
    let fillRgb: [number, number, number] = [0, 0, 0]
    let isDarkBg = false

    const parseRGB = (val: string) => {
      // rgb(...) or rgba(...)
      const m = val.match(/rgba?\((\d{1,3})\D+(\d{1,3})\D+(\d{1,3})/)
      if (m) return [parseInt(m[1], 10), parseInt(m[2], 10), parseInt(m[3], 10)] as [number, number, number]
      // hex #rrggbb
      const mh = val.match(/#([0-9a-fA-F]{6})/)
      if (mh) {
        const hex = mh[1]
        return [parseInt(hex.substring(0, 2), 16), parseInt(hex.substring(2, 4), 16), parseInt(hex.substring(4, 6), 16)] as [number, number, number]
      }
      return null
    }

    const findNearestBackground = (el: Element | null) => {
      let node: Element | null = el
      while (node) {
        const cs = getComputedStyle(node as Element)
        const bg = cs.backgroundColor || ""
        if (bg && bg !== "transparent" && !/rgba?\(0,\s*0,\s*0,\s*0\)/.test(bg)) return bg
        node = node.parentElement
      }
      const bodyBg = getComputedStyle(document.body).backgroundColor
      return bodyBg || getComputedStyle(document.documentElement).backgroundColor || "rgb(255,255,255)"
    }

    const luminance = (rgb: [number, number, number]) => {
      const srgb = rgb.map((v) => v / 255)
      const lin = srgb.map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)))
      return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
    }

    const mq = typeof window !== "undefined" && (window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null)

    const updateFillFromBg = () => {
      const bg = findNearestBackground(canvas.parentElement).trim()

      // handle oklch(...) (first param is lightness 0..1 or percent)
      const oklchMatch = bg.match(/oklch\(([^)]+)\)/i)
      if (oklchMatch) {
        const parts = oklchMatch[1].trim().split(/\s+/)
        let L = parseFloat(parts[0]) || 0
        if (parts[0].includes("%")) L = L / 100
        // if people used 1..100 scale, clamp
        if (L > 1) L = L / 100
        isDarkBg = L < 0.5
      } else {
        const parsed = parseRGB(bg)
        if (parsed) {
          const lum = luminance(parsed)
          isDarkBg = lum < 0.5
        } else if (mq) {
          isDarkBg = mq.matches
        } else {
          isDarkBg = false
        }
      }

      // choose white on dark backgrounds, black on light
      fillRgb = isDarkBg ? [255, 255, 255] : [0, 0, 0]
    }

    updateFillFromBg()

    // observe theme/class/style changes to update fill color dynamically
    const mo = new MutationObserver(() => updateFillFromBg())
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] })
    mo.observe(document.body, { attributes: true, attributeFilter: ["class", "style"] })

    // listen for OS-level color-scheme changes as a fallback
    const mqListener = () => updateFillFromBg()
    if (mq) {
      try {
        if (mq.addEventListener) mq.addEventListener("change", mqListener)
        else if ((mq as any).addListener) (mq as any).addListener(mqListener)
      } catch (e) {
        /* ignore */
      }
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      // reset transform and scale to devicePixelRatio to keep crisp rendering
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(rect.width, rect.height) * 0.525;

      // responsive font size based on canvas size
      const baseFont = Math.max(8, Math.round(Math.min(rect.width, rect.height) * 0.02));
      ctx.font = `${baseFont}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // adaptive sampling: fewer points on small screens
      const minDim = Math.min(rect.width, rect.height);
      const density = Math.max(0.08, 0.12 * (600 / Math.max(200, minDim)));
      const points: { x: number; y: number; z: number; char: string }[] = [];

      // Generate sphere points (phi, theta step controlled by density)
      for (let phi = 0; phi < Math.PI * 2; phi += density) {
        for (let theta = 0; theta < Math.PI; theta += density) {
          const x = Math.sin(theta) * Math.cos(phi + time * 0.5);
          const y = Math.sin(theta) * Math.sin(phi + time * 0.5);
          const z = Math.cos(theta);

          // Rotate around Y axis
          const rotY = time * 0.3;
          const newX = x * Math.cos(rotY) - z * Math.sin(rotY);
          const newZ = x * Math.sin(rotY) + z * Math.cos(rotY);

          // Rotate around X axis
          const rotX = time * 0.2;
          const newY = y * Math.cos(rotX) - newZ * Math.sin(rotX);
          const finalZ = y * Math.sin(rotX) + newZ * Math.cos(rotX);

          const depth = (finalZ + 1) / 2;
          const charIndex = Math.floor(depth * (chars.length - 1));

          points.push({
            x: centerX + newX * radius,
            y: centerY + newY * radius,
            z: finalZ,
            char: chars[charIndex],
          });
        }
      }

      // Sort by z for depth
      points.sort((a, b) => a.z - b.z);

      // Draw points with stronger contrast in dark mode
      const baseAlpha = isDarkBg ? 0.32 : 0.18
      const scaleAlpha = isDarkBg ? 0.7 : 0.46
      // subtle glow for dark backgrounds
      if (isDarkBg) {
        ctx.shadowColor = `rgba(255,255,255,0.06)`
        ctx.shadowBlur = 6
      } else {
        ctx.shadowColor = `rgba(0,0,0,0)`
        ctx.shadowBlur = 0
      }

      // Draw points
      points.forEach((point) => {
        const alpha = baseAlpha + (point.z + 1) * scaleAlpha
        const [r, g, b] = fillRgb
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(1, alpha)})`
        ctx.fillText(point.char, point.x, point.y)
      })

      time += 0.02;
      frameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      mo.disconnect()
      if (mq) {
        try {
          if (mq.removeEventListener) mq.removeEventListener("change", mqListener)
          else if ((mq as any).removeListener) (mq as any).removeListener(mqListener)
        } catch (e) {
          /* ignore */
        }
      }
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
