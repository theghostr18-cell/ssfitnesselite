import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense, useState } from "react";
import { Client3D } from "@/components/site/ClientOnly";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { SERVICES, waLink } from "@/lib/business";

const HeroObject = lazy(() => import("@/components/three/HeroObject"));

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "CrossFit, Zumba, Yoga, Gym & Cardio | SS Fitness Elite" },
      { name: "description", content: "CrossFit, Zumba, Yoga, Gym and Cardio at SS Fitness Elite, Badlapur." },
      { property: "og:title", content: "Services at SS Fitness Elite" },
      { property: "og:description", content: "Five ways to train in Badlapur East: CrossFit, Zumba, Yoga, Gym and Cardio." },
    ],
  }),
  component: Services,
});

function Services() {
  const [active, setActive] = useState(0);
  const s = SERVICES[active] ?? SERVICES[0];
  if (!s) return null;
  return (
    <>
      <PageHero kicker="Services" title="Train" accent="every way" text="CrossFit, Zumba, Yoga, Gym and Cardio. Find your way to move." kind="dumbbell" />
      <section className="px-6 pb-28 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2">
          <ul className="divide-y divide-border border-y border-border">
            {SERVICES.map((sv, i) => (
              <li key={sv.id}>
                <Button variant="ghost" onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} onClick={() => setActive(i)} className="group flex h-auto w-full justify-start items-baseline gap-6 rounded-none px-0 py-6 text-left">
                  <span className={`font-display text-xl transition ${active === i ? "text-primary" : "text-muted-foreground"}`}>{sv.n}</span>
                  <span className={`font-display text-4xl transition-all md:text-6xl ${active === i ? "translate-x-3 text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>{sv.title}</span>
                </Button>
              </li>
            ))}
          </ul>
          <div className="relative md:sticky md:top-28 md:h-[70vh]">
            <div className="h-[40vh] md:h-[50vh]">
              <Client3D>
                <Suspense fallback={null}><HeroObject key={s.obj} kind={s.obj} /></Suspense>
              </Client3D>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                <h3 className="font-display text-4xl text-primary">{s.title}</h3>
                <p className="mt-3 text-lg text-muted-foreground">{s.text}</p>
                <a href={waLink(`Hi! I'm interested in ${s.title} at SS Fitness Elite.`)} target="_blank" rel="noreferrer" className="mt-6 inline-block rounded-full bg-primary px-7 py-3 font-bold uppercase tracking-widest text-primary-foreground">Enquire</a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}
