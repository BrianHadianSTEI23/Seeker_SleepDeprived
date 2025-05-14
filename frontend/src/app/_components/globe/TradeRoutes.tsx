import React, {
    useRef,
    useEffect,
    useState
} from 'react';

import type { 
    TradeRoute
} from "@/app/_types/types";

import * as THREE from 'three';

import {
    useFrame,
} from '@react-three/fiber'

const TradeRoute = ({ 
    startLat, 
    startLng, 
    endLat, 
    endLng, 
    volume, 
    commodity 
}: TradeRoute) => {
    const curveRef = useRef<THREE.Line>(null);
    const [progress, setProgress] = useState(0);
    
    // Convert lat/lng to 3D coordinates
    const startPos = latLngToVector3(startLat, startLng, 2.05);
    const endPos = latLngToVector3(endLat, endLng, 2.05);
    
    // Curved path between points
    const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(startPos.x, startPos.y, startPos.z),
        new THREE.Vector3(
            (startPos.x + endPos.x) / 2,
            (startPos.y + endPos.y) / 2,
            (startPos.z + endPos.z) / 2 + 1
        ),
        new THREE.Vector3(endPos.x, endPos.y, endPos.z)
    );
    
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    
    // Color based on commodity type
    const commodityColors: {[key: string]: string} = {
        'oil': 'black',
        'rice': 'yellow',
        'palm_oil': 'orange',
        'coffee': 'brown',
        'rubber': 'green'
    };
    
    const color = commodityColors[commodity] || 'white';
    
    const lineWidth = Math.max(0.5, Math.min(volume / 1000, 5));
  
    // Animation frame
    useFrame(() => {
      setProgress((prev) => (prev + 0.005) % 1);
    });
    
    const particlePosition = curve.getPointAt(progress);
    
    return (
        <group>
            <line ref={curveRef} geometry={geometry}>
                <lineBasicMaterial 
                    color={color} 
                    linewidth={lineWidth} 
                    transparent={true} 
                    opacity={0.4} 
                />
            </line>
        
            {particlePosition && (
            <mesh position={[particlePosition.x, particlePosition.y, particlePosition.z]}>
                <sphereGeometry args={[0.03, 8, 8]} />
                <meshBasicMaterial color={color} />
            </mesh>
            )}
        </group>
    );
};
  
// Trade Routes Component
const TradeRoutes = ({ tradeData }: { tradeData?: TradeRoute[] }) => {
    return (
        <group>
            {tradeData && tradeData.map((route, index) => (
                <TradeRoute 
                    key={index} 
                    startLat={route.startLat} 
                    startLng={route.startLng}
                    endLat={route.endLat} 
                    endLng={route.endLng}
                    volume={route.volume} 
                    commodity={route.commodity}
                />
            ))}
        </group>
    );
};

 const latLngToVector3 = (lat: number, lng: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    return {
        x: -radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta)
    };
};