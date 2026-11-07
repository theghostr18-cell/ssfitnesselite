import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";
import { Client3D } from "@/components/site/ClientOnly";
import { Reveal } from "@/components/site/PageHero";
import { film } from "@/components/three/film-state";
import { BIZ, PHOTOS, waLink } from "@/lib/business";

const GymFilm = lazy(() => import("@/components/three/GymFilm"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SS Fitness Elite — Walk Into Badlapur's Elite Gym" },
      { name: "description", content: "Scroll through SS Fitness Elite in 3D: cardio, strength and dumbbell zones in Badlapur East. Rated 5.0 from 79 Google reviews." },
      { property: "og:title", content: "SS Fitness Elite — Walk Into Badlapur's Elite Gym" },
      { property: "og:description", content: "A cinematic 3D walk through Badlapur East's 5.0-rated gym." },
    ],
  }),
  component: Home,
});

// Chapter captions: [start, end] progress windows
const CHAPTERS = [
  { a: -0.1, b: 0.1, k: "Badlapur East · 2nd Floor", t: ["SS Fitness", "Elite"], d: "Scroll to step inside." },
  { a: 0.18, b: 0.34, k: "Zone 01 — Cardio", t: ["Burn", "the line"], d: "Treadmills, ellipticals and spin bikes along the mirrored wall." },
  { a: 0.38, b: 0.66, k: "Zone 02 — Strength", t: ["Load", "the bar"], d: "Every plate earns its place. Then you lift." },
  { a: 0.68, b: 0.84, k: "Zone 03 — Dumbbell wall", t: ["Pick", "your weight"], d: "Hover a dumbbell. It's ready when you are." },
  { a: 0.88, b: 1.2, k: "5.0 ★ · 79 Google reviews", t: ["No excuses.", "Just results."], d: "Your first session starts with one call." },
];

function Home() {
  const wrap = useRef<HTMLDivElement>(null);
  const caps = useRef<(HTMLDivElement | null)[]>([]);
  const bar = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const paint = (p: number) => {
      CHAPTERS.forEach((c, i) => {
        const el = caps.current[i];
        if (!el) return;
        const fadeIn = Math.min(1, Math.max(0, (p - c.a) / 0.04));
        const fadeOut = Math.min(1, Math.max(0, (c.b - p) / 0.04));
        const o = Math.min(fadeIn, fadeOut);
        el.style.opacity = String(o);
        el.style.transform = `translate3d(0, ${(1 - o) * (p < c.a + 0.04 ? 40 : -40)}px, 0)`;
        el.style.pointerEvents = o > 0.5 ? "auto" : "none";
      });
      if (bar.current) bar.current.style.transform = `scaleX(${p})`;
    };
    paint(0);
    const st = ScrollTrigger.create({
      trigger: wrap.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (s) => {
        film.p = s.progress;
        paint(s.progress);
      },
    });
    return () => {
      st.kill();
      film.p = 0;
    };
  }, []);

  return (
    <>
      <section ref={wrap} className="relative" style={{ height: "750vh" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden" data-scene-ready={ready ? "" : undefined}>
          <Client3D fallback={<img src={PHOTOS[0]!.src} alt={PHOTOS[0]!.alt} className="h-full w-full object-cover opacity-60" />}>
            <Suspense fallback={null}>
              <GymFilm onReady={() => setReady(true)} />
            </Suspense>
          </Client3D>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,var(--background)_100%)]" />
          {CHAPTERS.map((c, i) => (
            <div key={i} ref={(el) => { caps.current[i] = el; }} className={`absolute inset-x-0 px-6 md:px-12 ${i === 0 ? "bottom-24 md:bottom-16" : i % 2 ? "bottom-16 md:top-1/3 md:bottom-auto" : "bottom-16 md:top-1/3 md:bottom-auto md:text-right"}`} style={{ opacity: 0 }}>
              <div className={`mx-auto max-w-7xl ${i % 2 === 0 && i !== 0 ? "md:ml-auto" : ""}`}>
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.4em] text-primary">{c.k}</p>
                <h2 className={`font-display led-glow ${i === 0 ? "text-[19vw] md:text-[13vw]" : "text-6xl md:text-8xl"}`}>
                  {c.t[0]}<br /><span className="text-primary">{c.t[1]}</span>
                </h2>
                <p className="mt-4 text-base text-muted-foreground md:text-lg">{c.d}</p>
                {i === CHAPTERS.length - 1 && (
                  <div className={`mt-6 flex flex-wrap gap-3 ${i % 2 === 0 ? "md:justify-end" : ""}`}>
                    <a href={`tel:${BIZ.phoneTel}`} className="red-glow rounded-full bg-primary px-7 py-3 font-bold uppercase tracking-widest text-primary-foreground">Call {BIZ.phoneDisplay}</a>
                    <Link to="/contact" className="rounded-full border border-foreground/40 px-7 py-3 font-bold uppercase tracking-widest">Visit us</Link>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-border"><div ref={bar} className="h-full origin-left bg-primary" style={{ transform: "scaleX(0)" }} /></div>
        </div>
      </section>

      <section className="relative px-6 py-28 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary">What members say</p>
            <div className="mt-4 flex items-end gap-4">
              <span className="font-display text-[9rem] leading-none">5.0</span>
              <div className="pb-4">
                <div className="flex text-gold">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-6 w-6 fill-current" />)}</div>
                <p className="text-muted-foreground">{BIZ.reviewCount} Google reviews</p>
              </div>
            </div>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">{BIZ.reviewSummary}</p>
          </Reveal>
          <div className="space-y-4">
            {BIZ.reviews.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.1}>
                <blockquote className="border-l-2 border-primary bg-card p-6">
                  <p className="text-xl">“{r.text}”</p>
                  <footer className="mt-3 text-sm uppercase tracking-widest text-muted-foreground">— {r.name}</footer>
                </blockquote>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary px-6 py-24 text-primary-foreground md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <Reveal>
            <p className="text-xs font-bold uppercase tracking-[0.4em]">{BIZ.offer.title}</p>
            <p className="font-display text-[22vw] md:text-[12rem]">{BIZ.offer.price}</p>
            <p className="max-w-md opacity-80">{BIZ.offer.note}</p>
          </Reveal>
          <a href={waLink("Hi! I'd like to know about the 1 year membership offer.")} target="_blank" rel="noreferrer" className="rounded-full bg-background px-8 py-4 font-bold uppercase tracking-widest text-foreground transition hover:scale-105">Claim on WhatsApp</a>
        </div>
      </section>
    </>
  );
}
