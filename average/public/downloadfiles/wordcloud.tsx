import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Billboard, Text } from "@react-three/drei";

const Word: React.FC<{ text: string; position: THREE.Vector3 }> = ({ text, position }) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current && ref.current.material instanceof THREE.MeshBasicMaterial) {
      ref.current.material.color.lerp(new THREE.Color("#ffffff"), 0.05);
    }
  });

  return (
    <Billboard position={position.toArray()}>
      <Text
        ref={ref}
        fontSize={1}
        color="#ffffff"
        onClick={() => console.log(`Clicked: ${text}`)}
      >
        {text}
      </Text>
    </Billboard>
  );
};

export default Word;
