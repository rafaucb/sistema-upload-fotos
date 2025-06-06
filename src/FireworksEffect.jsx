import { Fireworks } from 'fireworks-js';
import { useEffect, useRef } from 'react';

export default function FireworksEffect() {
  const containerRef = useRef(null);

  useEffect(() => {
    console.log("🔥 FireworksEffect montado");

    if (!containerRef.current) return;

    const fireworks = new Fireworks(containerRef.current, {
      autoresize: true,
      opacity: 0.5,
      acceleration: 1.05,
      gravity: 1.5,
      particles: 50,
      traceLength: 3,
      explosion: 5,
      intensity: 30,
      flickering: 50,
      lineStyle: "round",
      delay: { min: 30, max: 60 },
    });

    fireworks.start();
    console.log("🎆 Fogos iniciados!");

    setTimeout(() => {
      fireworks.stop();
      console.log("🎆 Fogos encerrados!");
    }, 6000);

    return () => {
      fireworks.stop();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}
