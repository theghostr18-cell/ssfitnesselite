import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshReflectorMaterial, RoundedBox } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/** Shared scroll progress 0..1 written by GSAP ScrollTrigger, read every frame. */
export const film = { p: 0, mx: 0, my: 0 };

const RED = "#d8262b";
const BLACK = "#0d0d0f";
const STEEL = "#b9bcc2";
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Camera storyboard: [progress, position, lookAt]
const SHOTS: [number, [number, number, number], [number, number, number]][] = [
  [0.0, [0, 1.8, 15], [0, 2, 0]],
  [0.14, [0, 1.7, 3.5], [0, 1.7, -10]],
  [0.3, [-0.8, 1.5, -9], [-3.6, 0.9, -14]],
  [0.42, [0.6, 1.9, -20], [0, 1.2, -30]],
  [0.58, [2.6, 1.6, -27], [0, 1.6, -30.5]],
  [0.74, [-0.8, 1.5, -37], [3.6, 1.0, -41]],
  [0.88, [0, 2.2, -45], [0, 3.6, -55]],
  [1.0, [0, 3.0, -49.5], [0, 3.9, -55.5]],
];

function CameraRig() {
  const { camera, size } = useThree();
  const pos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const cur = useRef(new THREE.Vector3(0, 1.8, 15));
  const curLook = useRef(new THREE.Vector3(0, 2, 0));
  const tmpA = useMemo(() => new THREE.Vector3(), []);
  const tmpB = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, d) => {
    const dt = Math.min(d, 0.05);
    const p = film.p;
    let i = 0;
    while (i < SHOTS.length - 2 && p > SHOTS[i + 1][0]) i++;
    const [p0, a0, l0] = SHOTS[i];
    const [p1, a1, l1] = SHOTS[i + 1];
    const t = smooth(p0, p1, p);
    pos.copy(tmpA.fromArray(a0)).lerp(tmpB.fromArray(a1), t);
    look.copy(tmpA.fromArray(l0)).lerp(tmpB.fromArray(l1), t);
    // mouse parallax
    const par = size.width < 768 ? 0.15 : 0.45;
    pos.x += film.mx * par;
    pos.y += film.my * par * 0.5;
    const k = 1 - Math.exp(-4 * dt);
    cur.current.lerp(pos, k);
    curLook.current.lerp(look, k);
    camera.position.copy(cur.current);
    camera.lookAt(curLook.current);
  });
  return null;
}

function gridTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  g.fillStyle = "#18181a";
  g.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 4000; i++) {
    g.fillStyle = `rgba(255,255,255,${Math.random() * 0.04})`;
    g.fillRect(Math.random() * 256, Math.random() * 256, 1, 1);
  }
  g.strokeStyle = "#060607";
  g.lineWidth = 4;
  g.strokeRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(10, 60);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function posterTexture(lines: string[], accent: number) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 640;
  const g = c.getContext("2d")!;
  g.fillStyle = "#0b0b0c";
  g.fillRect(0, 0, 256, 640);
  for (let i = 0; i < 60; i++) {
    g.fillStyle = `rgba(216,38,43,${Math.random() * 0.5})`;
    g.beginPath();
    g.arc(Math.random() * 256, Math.random() * 640, Math.random() * 14, 0, 7);
    g.fill();
  }
  g.textAlign = "center";
  lines.forEach((l, i) => {
    g.font = "bold 58px Impact, sans-serif";
    if (i === accent) {
      g.fillStyle = "#d8262b";
      g.fillRect(14, 210 + i * 80 - 54, 228, 70);
      g.fillStyle = "#fff";
    } else g.fillStyle = "#f2f2f2";
    g.fillText(l, 128, 210 + i * 80);
  });
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function LedFrame({ z, w = 8, d = 4.5 }: { z: number; w?: number; d?: number }) {
  const m = <meshBasicMaterial color="#fff6e8" toneMapped={false} />;
  return (
    <group position={[0, 4.95, z]}>
      <mesh position={[0, 0, d / 2]}><boxGeometry args={[w, 0.05, 0.06]} />{m}</mesh>
      <mesh position={[0, 0, -d / 2]}><boxGeometry args={[w, 0.05, 0.06]} />{m}</mesh>
      <mesh position={[w / 2, 0, 0]}><boxGeometry args={[0.06, 0.05, d]} />{m}</mesh>
      <mesh position={[-w / 2, 0, 0]}><boxGeometry args={[0.06, 0.05, d]} />{m}</mesh>
    </group>
  );
}

function Hall() {
  const floor = useMemo(gridTexture, []);
  const posters = useMemo(
    () => [posterTexture(["NO", "PAIN.", "NO", "GAIN."], 1), posterTexture(["NO", "EXCUSES", "JUST", "RESULTS"], 1), posterTexture(["STRENGTH", "UN-", "LEASHED"], 0)],
    [],
  );
  const zs = Array.from({ length: 10 }, (_, i) => -3 - i * 5.6);
  return (
    <group>
      {/* rubber tile floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -26]} receiveShadow>
        <planeGeometry args={[10, 64]} />
        <meshStandardMaterial map={floor} roughness={0.9} />
      </mesh>
      {/* red lane, glossy */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.005, -26]}>
        <planeGeometry args={[3.2, 64]} />
        <MeshReflectorMaterial color={RED} blur={[200, 60]} resolution={512} mixBlur={1} mixStrength={6} roughness={0.55} metalness={0.1} mirror={0.4} />
      </mesh>
      {/* ceiling */}
      <mesh rotation-x={Math.PI / 2} position={[0, 5, -26]}>
        <planeGeometry args={[10, 64]} />
        <meshStandardMaterial color={BLACK} roughness={1} />
      </mesh>
      {/* white walls */}
      {[-5, 5].map((x) => (
        <mesh key={x} position={[x, 2.5, -26]} rotation-y={x < 0 ? Math.PI / 2 : -Math.PI / 2}>
          <planeGeometry args={[64, 5]} />
          <meshStandardMaterial color="#d9d9d6" roughness={0.85} />
        </mesh>
      ))}
      {/* mirrors with amber cove light */}
      {[-4.98, 4.98].map((x) => (
        <group key={x}>
          <mesh position={[x, 2.1, -26]} rotation-y={x < 0 ? Math.PI / 2 : -Math.PI / 2}>
            <planeGeometry args={[58, 2.2]} />
            <meshStandardMaterial color="#2a2a2e" metalness={1} roughness={0.08} />
          </mesh>
          <mesh position={[x * 0.995, 3.25, -26]}>
            <boxGeometry args={[0.04, 0.04, 58]} />
            <meshBasicMaterial color="#ffb357" toneMapped={false} />
          </mesh>
        </group>
      ))}
      {/* black pillars with posters */}
      {zs.map((z, i) => (
        <group key={z}>
          {[-4.6, 4.6].map((x, j) => (
            <mesh key={x} position={[x, 2.5, z]} castShadow>
              <boxGeometry args={[0.8, 5, 0.8]} />
              <meshStandardMaterial color={BLACK} roughness={0.4} map={(i + j) % 3 === 0 ? posters[(i + j) % 3] : undefined} />
            </mesh>
          ))}
          <LedFrame z={z - 2.8} />
        </group>
      ))}
      {/* back wall */}
      <mesh position={[0, 2.5, -57]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color={BLACK} roughness={0.6} />
      </mesh>
    </group>
  );
}

function Doors() {
  const l = useRef<THREE.Group>(null);
  const r = useRef<THREE.Group>(null);
  useFrame(() => {
    const o = smooth(0.02, 0.13, film.p) * 3.2;
    if (l.current) l.current.position.x = -1.6 - o;
    if (r.current) r.current.position.x = 1.6 + o;
  });
  const door = (
    <>
      <RoundedBox args={[3.2, 4.4, 0.15]} radius={0.03} position={[0, 2.2, 0]} castShadow>
        <meshStandardMaterial color="#111114" metalness={0.8} roughness={0.25} />
      </RoundedBox>
      <mesh position={[0, 2.2, 0.08]}>
        <boxGeometry args={[0.05, 4.2, 0.02]} />
        <meshBasicMaterial color={RED} toneMapped={false} />
      </mesh>
    </>
  );
  return (
    <group position={[0, 0, 0.2]}>
      {/* frame */}
      <mesh position={[0, 4.75, 0]}><boxGeometry args={[10, 0.5, 0.4]} /><meshStandardMaterial color={BLACK} /></mesh>
      <mesh position={[0, 4.48, 0.21]}><boxGeometry args={[6.6, 0.04, 0.02]} /><meshBasicMaterial color="#fff6e8" toneMapped={false} /></mesh>
      {[-4.2, 4.2].map((x) => (
        <mesh key={x} position={[x, 2.25, 0]}><boxGeometry args={[1.6, 4.5, 0.4]} /><meshStandardMaterial color={BLACK} /></mesh>
      ))}
      <group ref={l}>{door}</group>
      <group ref={r}>{door}</group>
    </group>
  );
}

function Treadmill({ z }: { z: number }) {
  const screen = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    if (screen.current) screen.current.color.setHSL(0.55, 0.6, 0.35 + Math.sin(clock.elapsedTime * 3 + z) * 0.1);
  });
  return (
    <group position={[-3.4, 0, z]} rotation-y={Math.PI / 2}>
      <RoundedBox args={[0.9, 0.28, 2.1]} radius={0.06} position={[0, 0.16, 0]} castShadow>
        <meshStandardMaterial color="#141416" roughness={0.5} />
      </RoundedBox>
      <mesh position={[0, 0.31, 0.05]}><boxGeometry args={[0.6, 0.02, 1.8]} /><meshStandardMaterial color="#050505" roughness={1} /></mesh>
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} position={[x, 0.75, -0.85]} rotation-x={-0.25}><boxGeometry args={[0.08, 1.1, 0.12]} /><meshStandardMaterial color="#1b1b1e" metalness={0.5} roughness={0.4} /></mesh>
      ))}
      <mesh position={[0, 1.32, -1.0]} rotation-x={-0.5}><boxGeometry args={[0.85, 0.35, 0.08]} /><meshStandardMaterial color="#111" /></mesh>
      <mesh position={[0, 1.33, -0.96]} rotation-x={-0.5}><planeGeometry args={[0.6, 0.22]} /><meshBasicMaterial ref={screen} toneMapped={false} /></mesh>
      <mesh position={[0.46, 0.2, 0]}><boxGeometry args={[0.01, 0.03, 2]} /><meshBasicMaterial color="#ff8a2a" toneMapped={false} /></mesh>
    </group>
  );
}

function Plate({ r = 0.45, color = BLACK }: { r?: number; color?: string }) {
  return (
    <group rotation-z={Math.PI / 2}>
      <mesh castShadow><cylinderGeometry args={[r, r, 0.07, 40]} /><meshStandardMaterial color={color} roughness={0.35} metalness={0.3} /></mesh>
      <mesh><torusGeometry args={[r * 0.98, 0.025, 8, 40]} /><meshStandardMaterial color={RED} roughness={0.4} /></mesh>
    </group>
  );
}

/** The barbell builds itself as plates fly in, then it is lifted. */
function Barbell() {
  const bar = useRef<THREE.Group>(null);
  const plates = useRef<(THREE.Group | null)[]>([]);
  const starts = useMemo(
    () => Array.from({ length: 6 }, (_, i) => new THREE.Vector3((i % 2 ? 1 : -1) * (3 + Math.random() * 2), 3 + Math.random() * 1.5, -26 - Math.random() * 6)),
    [],
  );
  useFrame(({ clock }) => {
    const p = film.p;
    plates.current.forEach((g, i) => {
      if (!g) return;
      const side = i % 2 ? 1 : -1;
      const slot = Math.floor(i / 2);
      const t = smooth(0.34 + slot * 0.04, 0.48 + slot * 0.04, p);
      const end = new THREE.Vector3(side * (0.9 + slot * 0.09), 0, 0);
      const startLocal = starts[i].clone().sub(new THREE.Vector3(0, 0.9, -30.5));
      g.position.lerpVectors(startLocal, end, t);
      g.rotation.x = (1 - t) * (clock.elapsedTime * 2 + i);
      g.rotation.y = (1 - t) * 2;
    });
    if (bar.current) {
      const lift = smooth(0.56, 0.66, p);
      bar.current.position.y = 0.9 + lift * 1.3 + Math.sin(clock.elapsedTime * 1.4) * 0.01;
      bar.current.rotation.x = Math.sin(clock.elapsedTime * 0.6) * 0.03 + smooth(0.3, 0.6, p) * Math.PI * 0.5;
    }
  });
  return (
    <group position={[0, 0, -30.5]}>
      {/* rack */}
      {[-1.25, 1.25].map((x) => (
        <group key={x}>
          <mesh position={[x, 1.25, -0.4]} castShadow><boxGeometry args={[0.1, 2.5, 0.1]} /><meshStandardMaterial color={BLACK} metalness={0.6} roughness={0.3} /></mesh>
          <mesh position={[x, 1.25, 0.4]} castShadow><boxGeometry args={[0.1, 2.5, 0.1]} /><meshStandardMaterial color={BLACK} metalness={0.6} roughness={0.3} /></mesh>
          <mesh position={[x, 0.03, 0]}><boxGeometry args={[0.2, 0.06, 1.2]} /><meshStandardMaterial color={RED} /></mesh>
        </group>
      ))}
      <group ref={bar} position={[0, 0.9, 0]}>
        <mesh rotation-z={Math.PI / 2} castShadow><cylinderGeometry args={[0.025, 0.025, 2.6, 16]} /><meshStandardMaterial color={STEEL} metalness={1} roughness={0.2} /></mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 1.05, 0, 0]} rotation-z={Math.PI / 2}><cylinderGeometry args={[0.05, 0.05, 0.5, 16]} /><meshStandardMaterial color={STEEL} metalness={1} roughness={0.15} /></mesh>
        ))}
        {starts.map((_, i) => (
          <group key={i} ref={(g) => { plates.current[i] = g; }}>
            <Plate r={0.45 - Math.floor(i / 2) * 0.07} />
          </group>
        ))}
      </group>
      <pointLight position={[0, 4, 0]} intensity={18} color="#ffffff" distance={9} />
    </group>
  );
}

function Dumbbell({ position, size }: { position: [number, number, number]; size: number }) {
  const g = useRef<THREE.Group>(null);
  const hover = useRef(false);
  useFrame((_, d) => {
    if (!g.current) return;
    const target = hover.current ? Math.PI * 2 : 0;
    g.current.rotation.x += (target - g.current.rotation.x) * Math.min(1, d * 4);
    g.current.position.y = position[1] + (hover.current ? 0.12 : 0);
  });
  return (
    <group ref={g} position={position} onPointerOver={() => (hover.current = true)} onPointerOut={() => (hover.current = false)}>
      <mesh rotation-x={Math.PI / 2}><cylinderGeometry args={[0.03, 0.03, 0.3, 12]} /><meshStandardMaterial color={STEEL} metalness={1} roughness={0.25} /></mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, 0, s * 0.17]} rotation-x={Math.PI / 2} castShadow>
          <cylinderGeometry args={[size, size, 0.1, 6]} />
          <meshStandardMaterial color="#1a1a1c" roughness={0.45} metalness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function DumbbellWall() {
  const rack = useRef<THREE.Group>(null);
  useFrame(() => {
    if (rack.current) rack.current.position.x = 3.7 + (1 - smooth(0.62, 0.72, film.p)) * 2;
  });
  const items: { pos: [number, number, number]; s: number }[] = [];
  for (let row = 0; row < 2; row++)
    for (let i = 0; i < 8; i++) items.push({ pos: [row * -0.35, 0.65 + row * 0.45, -i * 0.55 + 1.9], s: 0.07 + i * 0.008 });
  return (
    <group ref={rack} position={[3.7, 0, -41]} rotation-y={0}>
      {[0, 1].map((row) => (
        <mesh key={row} position={[row * -0.35, 0.55 + row * 0.45, 0]} castShadow><boxGeometry args={[0.32, 0.05, 4.6]} /><meshStandardMaterial color={BLACK} metalness={0.5} roughness={0.35} /></mesh>
      ))}
      {[-2.2, 2.2].map((z) => (
        <mesh key={z} position={[-0.15, 0.5, z]}><boxGeometry args={[0.6, 1.0, 0.08]} /><meshStandardMaterial color={RED} roughness={0.5} /></mesh>
      ))}
      {items.map((it, i) => (
        <group key={i} rotation-y={Math.PI / 2}>
          <Dumbbell position={[-it.pos[2], it.pos[1] + it.s, it.pos[0]]} size={it.s} />
        </group>
      ))}
      <pointLight position={[-1.5, 3, 0]} intensity={10} color="#ffe2c0" distance={7} />
    </group>
  );
}

/** Final scene: the plate chandelier from the gym ceiling, rebuilt in gold. */
function Chandelier() {
  const g = useRef<THREE.Group>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    const p = film.p;
    if (g.current) {
      g.current.rotation.z = clock.elapsedTime * 0.2;
      const s = 0.6 + smooth(0.8, 1, p) * 0.6;
      g.current.scale.setScalar(s);
    }
    if (mat.current) mat.current.emissiveIntensity = 0.6 + smooth(0.82, 1, p) * 3;
  });
  const rings: [number, number, number][] = [[0, 0, 0.55], [0.75, 0.4, 0.32], [-0.75, 0.4, 0.32], [0.6, -0.55, 0.3], [-0.6, -0.55, 0.3]];
  return (
    <group position={[0, 3.9, -56.6]}>
      <group ref={g}>
        {rings.map(([x, y, r], i) => (
          <mesh key={i} position={[x, y, 0]}>
            <torusGeometry args={[r, 0.06, 16, 48]} />
            <meshStandardMaterial ref={i === 0 ? mat : undefined} color="#e7c27a" emissive="#ffb84a" emissiveIntensity={1} metalness={1} roughness={0.25} />
          </mesh>
        ))}
      </group>
      <pointLight position={[0, 0, 1.5]} intensity={14} color="#ffc070" distance={10} />
    </group>
  );
}

function Ready({ onReady }: { onReady: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (!done.current) {
      done.current = true;
      onReady();
    }
  });
  return null;
}

export default function GymFilm({ onReady }: { onReady: () => void }) {
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;
  return (
    <Canvas
      shadows={!mobile}
      dpr={[1, mobile ? 1.25 : 1.75]}
      camera={{ fov: mobile ? 70 : 52, near: 0.1, far: 120, position: [0, 1.8, 15] }}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
      onPointerMove={(e) => {
        film.mx = (e.clientX / window.innerWidth) * 2 - 1;
        film.my = -((e.clientY / window.innerHeight) * 2 - 1);
      }}
    >
      <color attach="background" args={["#08080a"]} />
      <fog attach="fog" args={["#08080a", 8, 34]} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 6, 4]} intensity={0.8} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 4.2, -6]} intensity={12} color="#ffffff" distance={12} />
      <pointLight position={[0, 4.2, -14]} intensity={12} color="#ffffff" distance={12} />
      <pointLight position={[0, 3, 4]} intensity={8} color={RED} distance={10} />
      <Environment resolution={128}>
        <Lightformer intensity={2} position={[0, 5, 0]} scale={[10, 10, 1]} rotation-x={Math.PI / 2} />
        <Lightformer intensity={1.2} color="#ffb357" position={[-5, 2, -1]} rotation-y={Math.PI / 2} scale={[20, 1, 1]} />
        <Lightformer intensity={1.5} color="#ff3030" position={[5, 1, -1]} rotation-y={-Math.PI / 2} scale={[20, 1, 1]} />
      </Environment>
      <CameraRig />
      <Hall />
      <Doors />
      {[-10, -12.6, -15.2, -17.8].map((z) => <Treadmill key={z} z={z} />)}
      <Barbell />
      <DumbbellWall />
      <Chandelier />
      <Ready onReady={onReady} />
    </Canvas>
  );
}
