import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";
import { PHOTOS } from "@/lib/business";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Inside SS Fitness Elite, Badlapur" },
      { name: "description", content: "Real photos of the SS Fitness Elite floor: LED ceilings, red lanes, cardio row and strength machines." },
      { property: "og:title", content: "Inside SS Fitness Elite" },
      { property: "og:description", content: "Photos from the gym floor in Badlapur East." },
    ],
  }),
  component: Gallery,
});

function TiltCard({ src, alt, onOpen, tall }: { src: string; alt: string; onOpen: () => void; tall: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 });
  return (
    <motion.button
      onClick={onOpen}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left) / r.width - 0.5);
        y.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      initial={{ opacity: 0, y: 80, rotateX: 25 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      className={`group relative mb-4 block w-full overflow-hidden ${tall ? "aspect-[3/4]" : "aspect-square"}`}
    >
      <img src={src} alt={alt} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
      <span className="absolute inset-0 border-2 border-primary opacity-0 transition group-hover:opacity-100" />
    </motion.button>
  );
}

function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="px-4 pb-24 pt-32 md:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary">Gallery</p>
        <h1 className="mt-3 font-display text-[16vw] md:text-[8vw]">The floor, <span className="text-primary">unfiltered</span></h1>
        <div className="mt-12 columns-2 gap-4 md:columns-3">
          {PHOTOS.map((p, i) => <TiltCard key={p.src} {...p} tall={i % 3 !== 1} onOpen={() => setOpen(i)} />)}
        </div>
      </div>
      <AnimatePresence>
        {open !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] grid place-items-center bg-background/95 p-4" onClick={() => setOpen(null)}>
            <button aria-label="Close" className="absolute right-6 top-6 grid h-12 w-12 place-items-center rounded-full border border-border"><X /></button>
            <motion.img initial={{ scale: 0.85, rotateY: -20 }} animate={{ scale: 1, rotateY: 0 }} src={PHOTOS[open]!.src} alt={PHOTOS[open]!.alt} className="max-h-[88vh] max-w-full object-contain" style={{ transformPerspective: 1000 }} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
