import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { Client3D } from "./ClientOnly";
import type { ObjKind } from "@/components/three/HeroObject";

const HeroObject = lazy(() => import("@/components/three/HeroObject"));

export function PageHero({ kicker, title, accent, text, kind }: { kicker: string; title: string; accent: string; text: string; kind: ObjKind }) {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden px-6 pt-28 md:px-12">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-primary/15 to-transparent" />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-6 md:grid-cols-2">
        <div className="relative z-10">
          <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-4 text-sm font-bold uppercase tracking-[0.4em] text-primary">{kicker}</motion.p>
          <h1 className="font-display text-[18vw] md:text-[9vw]">
            {[title, accent].map((w, i) => (
              <span key={w} className="block overflow-hidden">
                <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.15 + i * 0.12, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }} className={`block ${i ? "text-primary" : ""}`}>{w}</motion.span>
              </span>
            ))}
          </h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6 max-w-md text-lg text-muted-foreground">{text}</motion.p>
        </div>
        <div className="relative h-[42vh] md:h-[70vh]">
          <Client3D>
            <Suspense fallback={null}><HeroObject kind={kind} /></Suspense>
          </Client3D>
        </div>
      </div>
    </section>
  );
}

export function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 50, rotateX: 15 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] }} style={{ transformPerspective: 900 }} className={className}>
      {children}
    </motion.div>
  );
}
