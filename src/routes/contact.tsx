import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Instagram, MapPin, Phone } from "lucide-react";
import { PageHero, Reveal } from "@/components/site/PageHero";
import { BIZ, SERVICES, waLink } from "@/lib/business";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Join — SS Fitness Elite, Badlapur East" },
      { name: "description", content: "Call +91 83081 41817 or visit 2nd floor, Ganaraya building, New DP Rd, Katrap, Badlapur East." },
      { property: "og:title", content: "Contact SS Fitness Elite" },
      { property: "og:description", content: "Book a visit or enquire about membership at SS Fitness Elite." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", interest: SERVICES[0].title, time: "Morning" });
  const [error, setError] = useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[0-9+\s-]{10,15}$/.test(form.phone.trim())) return setError("Please enter a valid phone number.");
    setError("");
    const msg = `Hi SS Fitness Elite! I'm ${form.name.trim()} (${form.phone.trim()}). I'd like to book a visit for ${form.interest}, preferably in the ${form.time.toLowerCase()}.`;
    window.open(waLink(msg), "_blank", "noopener");
  };
  const field = "w-full border-b border-input bg-transparent py-3 text-lg outline-none transition focus:border-primary";
  return (
    <>
      <PageHero kicker="Contact" title="Your first" accent="rep starts here" text="Book a visit, ask about membership, or just drop in." kind="kettlebell" />
      <section className="px-6 pb-28 md:px-12">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2">
          <Reveal>
            <form onSubmit={submit} className="space-y-6 border border-border bg-card p-8">
              <h2 className="font-display text-4xl">Book a visit</h2>
              <input className={field} placeholder="Your name" value={form.name} maxLength={60} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input className={field} placeholder="Phone number" inputMode="tel" value={form.phone} maxLength={15} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <select className={field} value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })}>
                {SERVICES.map((s) => <option key={s.id} className="bg-card">{s.title}</option>)}
              </select>
              <div className="flex gap-2">
                {["Morning", "Evening"].map((t) => (
                  <button type="button" key={t} onClick={() => setForm({ ...form, time: t })} className={`flex-1 rounded-full border py-2 font-bold uppercase tracking-widest transition ${form.time === t ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground"}`}>{t}</button>
                ))}
              </div>
              {error && <p className="text-sm text-primary">{error}</p>}
              <button type="submit" className="red-glow w-full rounded-full bg-primary py-4 font-bold uppercase tracking-widest text-primary-foreground">Send on WhatsApp</button>
              <p className="text-xs text-muted-foreground">Opens WhatsApp with your details filled in, ready to send to the gym.</p>
            </form>
          </Reveal>
          <Reveal delay={0.15} className="space-y-6">
            {[
              { I: Phone, l: "Call", v: BIZ.phoneDisplay, h: `tel:${BIZ.phoneTel}` },
              { I: MapPin, l: "Address", v: BIZ.address, h: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BIZ.mapsQuery)}` },
              { I: Clock, l: "Hours", v: `${BIZ.hours}. Holiday hours may vary — call to confirm.` },
              { I: Instagram, l: "Instagram", v: BIZ.instagramHandle, h: BIZ.instagram },
            ].map(({ I, l, v, h }) => (
              <a key={l} href={h} target={h?.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex gap-4 border-b border-border pb-6 transition hover:text-primary">
                <I className="mt-1 h-6 w-6 shrink-0 text-primary" />
                <div><p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">{l}</p><p className="mt-1 text-lg">{v}</p></div>
              </a>
            ))}
            <iframe title="Map to SS Fitness Elite" loading="lazy" className="h-72 w-full grayscale invert-[0.9]" src={`https://www.google.com/maps?q=${encodeURIComponent(BIZ.mapsQuery)}&output=embed`} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
