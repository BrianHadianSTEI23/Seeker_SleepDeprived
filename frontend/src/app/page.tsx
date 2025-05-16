"use client";
import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import Statistics from "./_components/statistics/Statistics";
import { ChevronLeft, ChevronRight } from "lucide-react";

const IndonesiaMap = dynamic(() => import("./_components/indonesia/IndonesiaMap"), { ssr: false });

export default function HomePage() {
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [statistics, setStatistics] = useState<any | null>(null);
  const [commodityIndex, setCommodityIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const isScrolling = useRef(false);

  const fetchStats = async (areaName: string, areaCommodity: string[]) => {
    try {
      console.log(areaName)
      console.log(Object.keys(areaCommodity))
      const response = await fetch(`/api/StatisticsHandler`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          areaName,
          areaCommodity
          // : (Object.keys(areaCommodity)).join(", "),
        }),
      });

      const data = await response.json();
      setStatistics(data.result.commodities);
      setCommodityIndex(0);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
    }
  };

  // Fetch Indonesia stats on first load
  useEffect(() => {
    fetchStats("Indonesia", ["Coal", "Cocoa", "Coffee", "Crude Oil"]);
  }, []);

  // When province is clicked on map
  const handleProvinceStats = (data: {
    areaName: string;
    areaCommodity: string[];
  }) => {
    fetchStats(data.areaName, data.areaCommodity);
  };

  const handleNext = () => {
    if (!statistics) return;
    setCommodityIndex((prev) => (prev + 1) % statistics.length);
  };

  const handlePrev = () => {
    if (!statistics) return;
    setCommodityIndex((prev) => (prev - 1 + statistics.length) % statistics.length);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) return;

      isScrolling.current = true;
      const direction = e.deltaY > 0 ? 1 : -1;
      const nextIndex = Math.min(Math.max(currentIndex + direction, 0), sectionsRef.current.length - 1);
      setCurrentIndex(nextIndex);

      setTimeout(() => {
        sectionsRef.current[nextIndex]?.scrollIntoView({ behavior: "smooth" });
        isScrolling.current = false;
      }, 500);
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [currentIndex]);

  return (
    <div className="h-screen overflow-hidden scroll-smooth">
      <div
        ref={(el) => { sectionsRef.current[0] = el; }}
        className="h-screen flex items-center justify-center bg-black text-white text-6xl font-bold font-Satoshi tracking-widest"
      >
        Seeker
      </div>

      <div
        ref={(el) => { sectionsRef.current[1] = el; }}
        className="h-screen bg-black"
      >
        <IndonesiaMap onProvinceStats={handleProvinceStats} />
      </div>

      <div
        ref={(el) => { sectionsRef.current[2] = el; }}
        className="h-screen w-screen flex justify-center text-center items-center bg-black text-white text-8xl relative"
      >
        {/* Controls */}
        {statistics && (
          <>
            <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 transition">
              <ChevronLeft size={36} />
            </button>
            <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 transition">
              <ChevronRight size={36} />
            </button>
          </>
        )}

        {/* Display Stats */}
        {statistics && (
          <AnimatePresence mode="wait">
            <motion.div
              key={commodityIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full flex justify-center items-center"
            >
              <Statistics data={statistics[commodityIndex]} />
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
  
  
  
  