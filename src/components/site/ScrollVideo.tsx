import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollVideoTime } from "@/lib/scroll-video";

type Props = { src: string; poster: string; number: string; title: string; accent: string; text: string; first?: boolean };

export function ScrollVideo({ src, poster, number, title, accent, text, first = false }: Props) {
  const section = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const caption = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = video.current;
    const root = section.current;
    if (!el || !root) return;
    gsap.registerPlugin(ScrollTrigger);
    let target = 0;
    let frame = 0;
    let active = true;
    const seek = () => {
      frame = 0;
      if (!active || el.seeking || el.readyState < 2) return;
      const time = scrollVideoTime(target, el.duration);
      if (Math.abs(el.currentTime - time) > 0.025) el.currentTime = time;
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(seek);
    };
    el.addEventListener("loadeddata", queue);
    el.addEventListener("seeked", queue);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const trigger = ScrollTrigger.create({
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      onUpdate: ({ progress: p }) => {
        target = p;
        if (!reduced) queue();
        if (progress.current) gsap.set(progress.current, { scaleX: p });
        if (!reduced && caption.current) gsap.set(caption.current, { y: -p * 28 });
      },
      onRefresh: ({ progress: p }) => { target = p; queue(); },
    });
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      trigger.kill();
      el.removeEventListener("loadeddata", queue);
      el.removeEventListener("seeked", queue);
    };
  }, [src]);

  const Heading = first ? "h1" : "h2";
  return (
    <section ref={section} className="scroll-film relative" aria-label={`Gym film ${number}`}>
      <div className="sticky top-0 h-svh overflow-hidden bg-background">
        {failed ? <img src={poster} alt="Inside SS Fitness Elite" className="h-full w-full object-contain md:object-cover" /> : (
          <video ref={video} src={src} poster={poster} muted playsInline preload={first ? "auto" : "metadata"} onError={() => setFailed(true)} className="h-full w-full object-contain md:object-cover" aria-label={`SS Fitness Elite — film ${number}`} />
        )}
        <div className="film-shade pointer-events-none absolute inset-0" />
        <div ref={caption} className="absolute inset-x-0 bottom-14 px-6 md:bottom-20 md:px-12">
          <div className="mx-auto max-w-7xl">
            <p className="mb-4 text-xs font-bold uppercase text-primary">{first ? "Badlapur East" : "SS Fitness Elite"} / {number}</p>
            <Heading className="film-title font-display">{title}<br /><span className="text-primary">{accent}</span></Heading>
            <p className="mt-5 max-w-lg text-base text-foreground md:text-lg">{text}</p>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-border"><div ref={progress} className="h-full origin-left scale-x-0 bg-primary" /></div>
      </div>
    </section>
  );
}