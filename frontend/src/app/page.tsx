"use client";
import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import the IndonesiaMap with no SSR
const IndonesiaMap = dynamic(() => import('./_components/indonesia/IndonesiaMap'), { ssr: false });

export default function HomePage() {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]); // Correct type definition
  const [currentIndex, setCurrentIndex] = useState(0);
  const isScrolling = useRef(false);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) return;

      isScrolling.current = true;

      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIndex = Math.min(
        Math.max(currentIndex + direction, 0),
        sectionsRef.current.length - 1
      );

      setCurrentIndex(nextIndex);

      setTimeout(() => {
        sectionsRef.current[nextIndex]?.scrollIntoView({
          behavior: "smooth",
        });
        isScrolling.current = false;
      }, 500); // ⏱️ 0.5-second delay before scroll
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentIndex]);

  return (
    <div className="h-screen overflow-hidden scroll-smooth">
      <div
        ref={(el) => {
          sectionsRef.current[0] = el; // No return value
        }}
        className="h-screen flex items-center justify-center bg-black text-white text-6xl font-bold"
      >
        Seeker
      </div>

      <div
        ref={(el) => {
          sectionsRef.current[1] = el; // No return value
        }}
        className="h-screen bg-black"
      >
        <IndonesiaMap />
      </div>
    </div>
  );
}
