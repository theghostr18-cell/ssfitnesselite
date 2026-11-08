import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BIZ, waLink } from "@/lib/business";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/career", label: "Career" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8">
        <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-border bg-background/60 py-2 pl-5 pr-2 backdrop-blur-md">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary font-display text-sm text-primary-foreground">SS</span>
            <span className="font-display text-lg tracking-wide">Fitness Elite</span>
          </Link>
          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((l) => {
              const active = l.to === "/" ? path === "/" : path.startsWith(l.to);
              return (
                <li key={l.to} className="relative">
                  <Link to={l.to} className={`relative z-10 block px-3 py-2 text-sm font-semibold uppercase tracking-widest transition-colors ${active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    {l.label}
                  </Link>
                  {active && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                </li>
              );
            })}
          </ul>
          <div className="flex items-center gap-2">
            <a href={waLink("Hi SS Fitness Elite! I'd like to enquire about membership.")} target="_blank" rel="noreferrer" className="hidden rounded-full bg-foreground px-5 py-2 text-sm font-bold uppercase tracking-widest text-background transition hover:bg-primary hover:text-primary-foreground sm:block">
              Join Now
            </a>
            <Button variant="ghost" size="icon" aria-label="Open menu" onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-full border border-border lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </nav>
      </header>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ clipPath: "circle(0% at 90% 5%)" }} animate={{ clipPath: "circle(150% at 90% 5%)" }} exit={{ clipPath: "circle(0% at 90% 5%)" }} transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }} className="fixed inset-0 z-[60] flex flex-col bg-primary p-6 text-primary-foreground">
            <Button variant="ghost" size="icon" aria-label="Close menu" onClick={() => setOpen(false)} className="ml-auto grid h-12 w-12 place-items-center rounded-full border border-primary-foreground/40">
              <X className="h-6 w-6" />
            </Button>
            <ul className="mt-10 space-y-2">
              {LINKS.map((l, i) => (
                <motion.li key={l.to} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.07 }}>
                  <Link to={l.to} className="font-display text-6xl">{l.label}</Link>
                </motion.li>
              ))}
            </ul>
            <a href={`tel:${BIZ.phoneTel}`} className="mt-auto font-display text-2xl">{BIZ.phoneDisplay}</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-background px-6 py-14 md:px-12">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <p className="font-display text-5xl">No excuses.<br /><span className="text-primary">Just results.</span></p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="mb-2 font-bold uppercase tracking-widest text-foreground">Visit</p>
          <p>{BIZ.address}</p>
          <p className="mt-2">{BIZ.hours}</p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="mb-2 font-bold uppercase tracking-widest text-foreground">Contact</p>
          <a className="block hover:text-primary" href={`tel:${BIZ.phoneTel}`}>{BIZ.phoneDisplay}</a>
          <a className="block hover:text-primary" href={BIZ.instagram} target="_blank" rel="noreferrer">{BIZ.instagramHandle}</a>
        </div>
      </div>
      <p className="mx-auto mt-12 max-w-7xl text-xs text-muted-foreground">© {new Date().getFullYear()} {BIZ.name}, Badlapur.</p>
    </footer>
  );
}
