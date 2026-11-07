import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

export type ObjKind = "plate" | "dumbbell" | "kettlebell";
const RED = "#d8262b";

function PlateObj() {
  return (
    <group>
      <mesh rotation-x={Math.PI / 2}><cylinderGeometry args={[1.3, 1.3, 0.22, 64]} /><meshStandardMaterial color="#111114" metalness={0.5} roughness={0.3} /></mesh>
      <mesh><torusGeometry args={[1.28, 0.08, 16, 64]} /><meshStandardMaterial color={RED} metalness={0.3} roughness={0.35} /></mesh>
      <mesh><torusGeometry args={[0.55, 0.05, 16, 48]} /><meshStandardMaterial color="#c9ccd1" metalness={1} roughness={0.2} /></mesh>
      <mesh rotation-x={Math.PI / 2}><cylinderGeometry args={[0.2, 0.2, 0.3, 32]} /><meshStandardMaterial color="#c9ccd1" metalness={1} roughness={0.15} /></mesh>
    </group>
  );
}
function DumbbellObj() {
  return (
    <group rotation-z={0.4}>
      <mesh rotation-z={Math.PI / 2}><cylinderGeometry args={[0.1, 0.1, 1.4, 24]} /><meshStandardMaterial color="#c9ccd1" metalness={1} roughness={0.2} /></mesh>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 0.85, 0, 0]}>
          <mesh rotation-z={Math.PI / 2}><cylinderGeometry args={[0.55, 0.55, 0.4, 6]} /><meshStandardMaterial color="#141416" metalness={0.4} roughness={0.35} /></mesh>
          <mesh position={[s * 0.21, 0, 0]} rotation-z={Math.PI / 2}><cylinderGeometry args={[0.3, 0.3, 0.03, 6]} /><meshStandardMaterial color={RED} /></mesh>
        </group>
      ))}
    </group>
  );
}
function KettlebellObj() {
  return (
    <group position={[0, -0.3, 0]}>
      <mesh><sphereGeometry args={[0.95, 48, 48]} /><meshStandardMaterial color="#141416" metalness={0.5} roughness={0.3} /></mesh>
      <mesh position={[0, 1.05, 0]}><torusGeometry args={[0.5, 0.13, 16, 48, Math.PI]} /><meshStandardMaterial color="#141416" metalness={0.5} roughness={0.3} /></mesh>
      <mesh position={[0, 0, 0]} rotation-x={Math.PI / 2}><torusGeometry args={[0.96, 0.04, 8, 64]} /><meshStandardMaterial color={RED} /></mesh>
    </group>
  );
}

function Rig({ kind }: { kind: ObjKind }) {
  const g = useRef<THREE.Group>(null);
  const m = useRef({ x: 0, y: 0 });
  useFrame((state, d) => {
    if (!g.current) return;
    m.current.x += (state.pointer.x - m.current.x) * Math.min(1, d * 3);
    m.current.y += (state.pointer.y - m.current.y) * Math.min(1, d * 3);
    const s = typeof window !== "undefined" ? window.scrollY / 600 : 0;
    g.current.rotation.y = m.current.x * 0.8 + s * 2 + state.clock.elapsedTime * 0.15;
    g.current.rotation.x = -m.current.y * 0.5 + s * 0.4;
  });
  return (
    <group ref={g}>
      {kind === "plate" && <PlateObj />}
      {kind === "dumbbell" && <DumbbellObj />}
      {kind === "kettlebell" && <KettlebellObj />}
    </group>
  );
}

export default function HeroObject({ kind }: { kind: ObjKind }) {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.2], fov: 40 }} gl={{ alpha: true, antialias: true }}>
      <ambientLight intensity={0.3} />
      <spotLight position={[3, 4, 4]} intensity={60} angle={0.5} penumbra={1} color="#fff2e0" />
      <pointLight position={[-3, -1, 2]} intensity={20} color={RED} />
      <Environment resolution={64}>
        <Lightformer intensity={3} position={[0, 4, 2]} scale={[6, 1, 1]} />
        <Lightformer intensity={2} color="#ff3030" position={[-4, 0, 1]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer intensity={1.5} color="#ffb357" position={[4, 0, 1]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
      </Environment>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.6}>
        <Rig kind={kind} />
      </Float>
    </Canvas>
  );
}
