import React, {
    useRef,
    useEffect,
    useState
} from 'react';

import * as THREE from 'three';

import type { 
    GlobeProps
} from '@/app/_types/types';

const Earth = () => {
    // earth mesh
    const earthRef = useRef<THREE.Mesh>(null);

    const [earthTexture, setEarthTexture] = useState<THREE.Texture | null>(null);
    const [bumpMap, setBumpMap] = useState<THREE.Texture | null>(null);
    const [specularMap, setSpecularMap] = useState<THREE.Texture | null>(null);

    // Load textures
    useEffect(() => {
        const textureLoader = new THREE.TextureLoader();
        
        textureLoader.load('/assets/earth_texture.jpg', (texture) => {
            setEarthTexture(texture);
        });
        
        textureLoader.load('/assets/earth_bumpmap.jpg', (texture) => {
            setBumpMap(texture);
        });
        
        textureLoader.load('/assets/earth_specular.jpg', (texture) => {
            setSpecularMap(texture);
        });
    }, []);

    if (!earthTexture) {
        return null; // Return null or a loading sphere until textures are loaded
    }

    return (
        <mesh ref={earthRef}>
            <sphereGeometry args={[2, 64, 64]} />
            <meshPhongMaterial 
                map={earthTexture} 
                bumpMap={bumpMap || undefined}
                bumpScale={0.05}
                specularMap={specularMap || undefined}
                specular={new THREE.Color('grey')}
                shininess={10}
            />
        </mesh>
    );
}