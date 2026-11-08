import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/PageHero";
import { ScrollVideo } from "@/components/site/ScrollVideo";
import { Button } from "@/components/ui/button";
import { GYM_VIDEOS } from "@/lib/gym-videos";
import { BIZ, SERVICES, waLink } from "@/lib/business";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "SS Fitness Elite — A Cinematic Gym Tour in Badlapur" },
    { name: "description", content: "Explore SS Fitness Elite through three scroll-controlled gym films. CrossFit, Zumba, Yoga, Gym and Cardio in Badlapur East." },
    { property: "og:title", content: "SS Fitness Elite — Step Inside" },
    { property: "og:description", content: "A cinematic tour of SS Fitness Elite in Badlapur East." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Home,
});

function Home() {
  return (
    <>
      <ScrollVideo {...GYM_VIDEOS[0]} number="01" title="SS Fitness" accent="Elite" text={BIZ.addressShort} first />
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto grid max-w-7xl items-start gap-8 md:grid-cols-2">
          <Reveal><p className="text-sm font-bold uppercase text-primary">The gym</p><h2 className="mt-4 font-display text-5xl md:text-7xl">A place to<br />push further.</h2></Reveal>
          <Reveal><p className="text-lg text-muted-foreground">{BIZ.about}</p><Button asChild variant="outline" className="mt-6"><Link to="/about">Inside SS Fitness Elite <ArrowUpRight /></Link></Button></Reveal>
        </div>
      </section>
      <ScrollVideo {...GYM_VIDEOS[1]} number="02" title="Find your" accent="movement." text="CrossFit. Zumba. Yoga. Gym. Cardio." />
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal><p className="text-sm font-bold uppercase text-primary">Five ways to train</p><h2 className="mt-4 font-display text-5xl md:text-7xl">Make it your own.</h2></Reveal>
          <div className="mt-10 grid border-t border-border sm:grid-cols-2 lg:grid-cols-5">
            {SERVICES.map(s => <Link key={s.id} to="/services" className="group border-b border-border py-7 pr-4"><span className="text-sm text-primary">{s.n}</span><h3 className="mt-4 flex items-center gap-3 font-display text-3xl">{s.title}<ArrowUpRight className="h-5 w-5 text-primary transition-transform group-hover:-translate-y-1" /></h3></Link>)}
          </div>
        </div>
      </section>
      <ScrollVideo {...GYM_VIDEOS[2]} number="03" title="Show up." accent="Build yourself." text="Your next chapter starts here." />
      <section className="px-6 py-16 md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center"><h2 className="font-display text-4xl md:text-6xl">Every journey starts somewhere.</h2><Button asChild size="lg"><Link to="/career">Transformations <ArrowUpRight /></Link></Button></div>
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
