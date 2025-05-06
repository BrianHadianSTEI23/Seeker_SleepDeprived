"use client"

import React, { useRef, useEffect } from 'react';

import Earth from "./_components/globe/Globe";

import * as THREE from "three";

import { 
  Canvas,
  useFrame,
  useLoader
} from "@react-three/fiber";

import { OrbitControls } from '@react-three/drei';


const sampleTradeData = [
  {
    startLat: 1.3521, // Singapore
    startLng: 103.8198,
    endLat: 13.7563, // Thailand
    endLng: 100.5018,
    volume: 2500,
    commodity: 'rice'
  },
  {
    startLat: 4.2105, // Malaysia
    startLng: 101.9758,  
    endLat: -6.2088, // Indonesia
    endLng: 106.8456,
    volume: 3800,
    commodity: 'palm_oil'
  },
  {
    startLat: 16.8409, // Vietnam
    startLng: 107.0843,
    endLat: -6.2088, // Indonesia
    endLng: 106.8456,
    volume: 1500,
    commodity: 'coffee'
  }
];
// LANDING PAGE
const HomePage = () => {
  return (
    <div className="w-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <Earth/>
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={10}
        />
      </Canvas>
    </div>
  );
}

export default HomePage;