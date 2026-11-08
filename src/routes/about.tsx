import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Reveal } from "@/components/site/PageHero";
import { BIZ, PHOTOS } from "@/lib/business";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "About SS Fitness Elite — Premium Gym, Badlapur East" },
      { name: "description", content: "Modern equipment, expert trainers and a motivating environment near Ghorpade Chowk, Badlapur East." },
      { property: "og:title", content: "About SS Fitness Elite" },
      { property: "og:description", content: "The story and space behind Badlapur East's premium gym." },
    ],
  }),
  component: About,
});

const PILLARS = [
  { n: "Modern", d: "A wide variety of modern equipment across cardio and strength." },
  { n: "Clean", d: "Consistently clean and well-maintained, as members keep saying." },
  { n: "Guided", d: "Professional, supportive trainers who guide every goal." },
];

function About() {
  return (
    <>
      <PageHero kicker="About the gym" title="Built for" accent="the grind" text={BIZ.about} kind="plate" />
      <section className="px-6 py-24 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {PILLARS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.1}>
              <div className="group relative h-full overflow-hidden border border-border bg-card p-8 transition hover:border-primary">
                <span className="font-display text-8xl text-primary/20 transition group-hover:text-primary">0{i + 1}</span>
                <h3 className="mt-4 font-display text-4xl">{p.n}</h3>
                <p className="mt-3 text-muted-foreground">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="px-6 pb-28 md:px-12">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
          <Reveal className="relative">
            <img src={PHOTOS[1]!.src} alt={PHOTOS[1]!.alt} loading="lazy" className="aspect-[4/5] w-full object-cover" />
            <div className="absolute -bottom-6 -right-6 hidden bg-primary p-6 font-display text-3xl text-primary-foreground md:block">2nd Floor<br />Ganaraya Bldg.</div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-primary">Find us</p>
            <h2 className="mt-3 font-display text-6xl">Near Ghorpade Chowk</h2>
            <p className="mt-5 text-lg text-muted-foreground">{BIZ.address}</p>
            <p className="mt-3 text-muted-foreground">People typically spend 1–2 hours here.</p>
            <Link to="/contact" className="mt-8 inline-block rounded-full bg-primary px-8 py-4 font-bold uppercase tracking-widest text-primary-foreground">Plan your visit</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
