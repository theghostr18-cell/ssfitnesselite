import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/PageHero";
import { BIZ, PHOTOS, waLink } from "@/lib/business";

export const Route = createFileRoute("/career")({
  head: () => ({ meta: [
    { title: "Career — Fitness Transformations | SS Fitness Elite" },
    { name: "description", content: "Fitness journeys and member transformations at SS Fitness Elite in Badlapur East." },
    { property: "og:title", content: "Career & Transformations — SS Fitness Elite" },
    { property: "og:description", content: "Every fitness journey starts somewhere. Begin yours at SS Fitness Elite." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Career,
});

function Career() {
  return (
    <>
      <section className="relative flex min-h-[85svh] items-end overflow-hidden px-6 pb-16 pt-32 md:px-12">
        <img src={PHOTOS[0]?.src} alt="The training floor at SS Fitness Elite" className="absolute inset-0 h-full w-full object-cover" />
        <div className="film-shade absolute inset-0" />
        <div className="relative mx-auto w-full max-w-7xl">
          <p className="mb-4 text-sm font-bold uppercase text-primary">Career / Transformations</p>
          <h1 className="film-title font-display">Your journey.<br /><span className="text-primary">Your change.</span></h1>
          <p className="mt-6 max-w-lg text-lg">Progress is personal. A new chapter starts with showing up.</p>
        </div>
      </section>
      <section className="px-6 py-20 md:px-12">
        <div className="mx-auto max-w-7xl">
          <Reveal><p className="text-sm font-bold uppercase text-primary">Member transformations</p><h2 className="mt-4 font-display text-5xl md:text-7xl">Real people. Real progress.</h2></Reveal>
          <div className="mt-10 border-y border-border py-12">
            <p className="max-w-xl text-lg text-muted-foreground">Member transformation stories are coming soon.</p>
            <Button asChild size="lg" className="mt-6"><a href={waLink("Hi! I'd like to share my fitness transformation story with SS Fitness Elite.")} target="_blank" rel="noreferrer">Share your journey <ArrowUpRight /></a></Button>
          </div>
        </div>
      </section>
      <section className="bg-primary px-6 py-16 text-primary-foreground md:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <h2 className="font-display text-5xl md:text-7xl">Start your next chapter.</h2>
          <Button asChild variant="secondary" size="lg"><a href={`tel:${BIZ.phoneTel}`}>Talk to the gym <ArrowUpRight /></a></Button>
        </div>
      </section>
    </>
  );
}