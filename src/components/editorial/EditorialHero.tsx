import { useState } from "react";
import { ArrowRight, Camera } from "lucide-react";
import { Link } from "react-router-dom";

type Audience = {
  id: string;
  tabLabel: string;
  name: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

const audiences: Audience[] = [
  {
    id: "ot",
    tabLabel: "Occupational therapist",
    name: "An occupational therapist",
    description:
      "You know what your client needs. We source it, quote it, and document it — so you can focus on the clinical decision, not the procurement paperwork.",
    ctaLabel: "Find products for your clients",
    ctaHref: "/products",
  },
  {
    id: "aged-care",
    tabLabel: "Aged care provider",
    name: "An aged care provider",
    description:
      "Whether it's a single item or a full facility order, we handle sourcing, documentation, and delivery — so your team can focus on care.",
    ctaLabel: "Browse aged care equipment",
    ctaHref: "/products",
  },
  {
    id: "coordinator",
    tabLabel: "Support coordinator",
    name: "A support coordinator",
    description:
      "We help you source the right AT for your participants, with NDIS-ready quotes and documentation that saves you hours.",
    ctaLabel: "Source AT for participants",
    ctaHref: "/products",
  },
  {
    id: "participant",
    tabLabel: "NDIS participant",
    name: "An NDIS participant or family member",
    description:
      "Navigating AT funding is complex. We explain it plainly, source the right equipment, and handle the paperwork.",
    ctaLabel: "Get help with your equipment",
    ctaHref: "/quote",
  },
];

const stats = [
  { number: "468", suffix: "+", label: "Products across all\nAT categories" },
  { number: "48", suffix: "hr", label: "Typical quote\nturnaround" },
  { number: "3", suffix: "yr", label: "Serving providers\nnationally" },
];

const EditorialHero = () => {
  const [activeId, setActiveId] = useState(audiences[0].id);
  const active = audiences.find((a) => a.id === activeId) ?? audiences[0];

  return (
    <section className="bg-violet">
      {/* Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-[52px_1fr_42%] min-h-[520px]">
        {/* Column 1 — Vertical tabs */}
        <div className="flex flex-col">
          {audiences.map((aud, idx) => {
            const isActive = aud.id === activeId;
            return (
              <button
                key={aud.id}
                onClick={() => setActiveId(aud.id)}
                className={`flex-1 flex items-center justify-center transition-colors ${
                  idx !== 0 ? "border-t border-white/[0.06]" : ""
                } ${isActive ? "bg-white/[0.07] border-r-2 border-r-cream" : "hover:bg-white/[0.03]"}`}
                aria-pressed={isActive}
              >
                <span
                  className="font-geist uppercase text-[8px] font-light"
                  style={{
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                    letterSpacing: "0.16em",
                    color: isActive ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)",
                  }}
                >
                  {aud.tabLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Column 2 — Left content panel */}
        <div className="flex flex-col justify-between" style={{ padding: "56px 52px 48px 44px" }}>
          <div>
            <p
              className="font-serif-italic italic mb-10 pl-4 max-w-[280px]"
              style={{
                fontWeight: 200,
                fontSize: "13px",
                color: "rgba(255,255,255,0.32)",
                borderLeft: "1.5px solid rgba(255,255,255,0.12)",
              }}
            >
              They understood the clinical context, not just the catalogue.
            </p>
            <h1
              className="font-editorial mb-[26px] text-cream"
              style={{
                fontWeight: 200,
                fontSize: "64px",
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
              }}
            >
              Equipment
              <br />
              that{" "}
              <span
                className="italic"
                style={{ color: "hsl(var(--gold))" }}
              >
                changes
              </span>
              <br />
              lives
            </h1>
            <p
              className="font-geist max-w-[290px]"
              style={{
                fontWeight: 300,
                fontSize: "13px",
                color: "rgba(255,255,255,0.36)",
                lineHeight: 1.85,
              }}
            >
              We connect the people who care for others with the right assistive technology — sourced ethically, documented carefully, delivered with genuine respect.
            </p>
          </div>

          {/* Stats row */}
          <div
            className="mt-10 pt-7 flex gap-9"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div
                  className="font-editorial text-cream"
                  style={{ fontWeight: 200, fontSize: "36px", lineHeight: 1 }}
                >
                  {s.number}
                  <span className="italic" style={{ color: "hsl(var(--gold))" }}>
                    {s.suffix}
                  </span>
                </div>
                <div
                  className="font-geist uppercase mt-2 whitespace-pre-line"
                  style={{
                    fontWeight: 300,
                    fontSize: "9px",
                    letterSpacing: "0.13em",
                    color: "rgba(255,255,255,0.18)",
                    lineHeight: 1.65,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3 — Right panel */}
        <div className="bg-cream-alt border-l border-cream-border flex flex-col">
          <div
            className="flex-1 bg-cream-image relative flex items-center justify-center min-h-[268px] overflow-hidden"
          >
            {/* Geometric SVG decoration */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 400 400"
              preserveAspectRatio="none"
              style={{ opacity: 0.05 }}
              aria-hidden="true"
            >
              <line x1="0" y1="0" x2="400" y2="400" stroke="hsl(var(--violet))" strokeWidth="1" />
              <line x1="100" y1="0" x2="500" y2="400" stroke="hsl(var(--violet))" strokeWidth="1" />
              <circle cx="200" cy="200" r="80" stroke="hsl(var(--violet))" strokeWidth="1" fill="none" />
              <circle cx="200" cy="200" r="120" stroke="hsl(var(--violet))" strokeWidth="1" fill="none" />
            </svg>
            <div className="relative flex flex-col items-center gap-3 text-center px-6">
              <Camera className="w-7 h-7 text-muted-label" strokeWidth={1} />
              <span
                className="font-geist italic"
                style={{ fontSize: "10px", color: "#B8B2A6" }}
              >
                Authentic photography — OT with client at home
              </span>
            </div>
          </div>

          {/* Audience panel */}
          <div
            key={active.id}
            className="border-t border-cream-border animate-fade-in"
            style={{ padding: "26px 32px 28px" }}
          >
            <div
              className="font-geist uppercase mb-[10px]"
              style={{
                fontSize: "9px",
                fontWeight: 400,
                letterSpacing: "0.18em",
                color: "hsl(var(--muted-label))",
              }}
            >
              You are
            </div>
            <div
              className="font-serif-italic italic text-ink mb-[10px]"
              style={{ fontWeight: 200, fontSize: "22px" }}
            >
              {active.name}
            </div>
            <p
              className="font-geist mb-[18px]"
              style={{
                fontSize: "13px",
                fontWeight: 300,
                color: "hsl(var(--muted-body))",
                lineHeight: 1.75,
              }}
            >
              {active.description}
            </p>
            <Link
              to={active.ctaHref}
              className="font-geist inline-flex items-center gap-3 group"
              style={{ fontSize: "12px", fontWeight: 400, color: "hsl(var(--violet))" }}
            >
              <span>{active.ctaLabel}</span>
              <span
                className="w-[26px] h-[26px] rounded-full border border-pill-highlight flex items-center justify-center transition-colors group-hover:bg-pill-highlight/20"
              >
                <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden">
        {/* Horizontal tabs */}
        <div className="bg-violet flex overflow-x-auto px-4 py-3 gap-2 border-b border-white/[0.06]">
          {audiences.map((aud) => {
            const isActive = aud.id === activeId;
            return (
              <button
                key={aud.id}
                onClick={() => setActiveId(aud.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full font-geist uppercase whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-white/10 text-cream"
                    : "text-white/30"
                }`}
                style={{ fontSize: "9px", letterSpacing: "0.14em", fontWeight: 300 }}
              >
                {aud.tabLabel}
              </button>
            );
          })}
        </div>

        <div className="bg-violet px-6 py-10">
          <p
            className="font-serif-italic italic mb-6 pl-4"
            style={{
              fontWeight: 200,
              fontSize: "13px",
              color: "rgba(255,255,255,0.32)",
              borderLeft: "1.5px solid rgba(255,255,255,0.12)",
            }}
          >
            They understood the clinical context, not just the catalogue.
          </p>
          <h1
            className="font-editorial mb-5 text-cream"
            style={{ fontWeight: 200, fontSize: "44px", lineHeight: 0.95, letterSpacing: "-0.025em" }}
          >
            Equipment that{" "}
            <span className="italic" style={{ color: "hsl(var(--gold))" }}>
              changes
            </span>{" "}
            lives
          </h1>
          <p
            className="font-geist mb-8"
            style={{ fontSize: "13px", fontWeight: 300, color: "rgba(255,255,255,0.36)", lineHeight: 1.85 }}
          >
            We connect the people who care for others with the right assistive technology — sourced ethically, documented carefully, delivered with genuine respect.
          </p>
          <div
            className="pt-6 grid grid-cols-3 gap-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-editorial text-cream" style={{ fontWeight: 200, fontSize: "28px", lineHeight: 1 }}>
                  {s.number}
                  <span className="italic" style={{ color: "hsl(var(--gold))" }}>
                    {s.suffix}
                  </span>
                </div>
                <div
                  className="font-geist uppercase mt-2 whitespace-pre-line"
                  style={{ fontSize: "8px", letterSpacing: "0.13em", color: "rgba(255,255,255,0.18)", lineHeight: 1.5, fontWeight: 300 }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-cream-image relative flex items-center justify-center h-[220px] overflow-hidden">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" preserveAspectRatio="none" style={{ opacity: 0.05 }} aria-hidden="true">
            <line x1="0" y1="0" x2="400" y2="400" stroke="hsl(var(--violet))" strokeWidth="1" />
            <line x1="100" y1="0" x2="500" y2="400" stroke="hsl(var(--violet))" strokeWidth="1" />
            <circle cx="200" cy="200" r="80" stroke="hsl(var(--violet))" strokeWidth="1" fill="none" />
            <circle cx="200" cy="200" r="120" stroke="hsl(var(--violet))" strokeWidth="1" fill="none" />
          </svg>
          <div className="relative flex flex-col items-center gap-3 text-center px-6">
            <Camera className="w-7 h-7 text-muted-label" strokeWidth={1} />
            <span className="font-geist italic" style={{ fontSize: "10px", color: "#B8B2A6" }}>
              Authentic photography — OT with client at home
            </span>
          </div>
        </div>

        <div key={active.id} className="bg-cream-alt animate-fade-in" style={{ padding: "26px 24px 28px" }}>
          <div className="font-geist uppercase mb-[10px]" style={{ fontSize: "9px", fontWeight: 400, letterSpacing: "0.18em", color: "hsl(var(--muted-label))" }}>
            You are
          </div>
          <div className="font-serif-italic italic text-ink mb-[10px]" style={{ fontWeight: 200, fontSize: "22px" }}>
            {active.name}
          </div>
          <p className="font-geist mb-[18px]" style={{ fontSize: "13px", fontWeight: 300, color: "hsl(var(--muted-body))", lineHeight: 1.75 }}>
            {active.description}
          </p>
          <Link to={active.ctaHref} className="font-geist inline-flex items-center gap-3 group" style={{ fontSize: "12px", fontWeight: 400, color: "hsl(var(--violet))" }}>
            <span>{active.ctaLabel}</span>
            <span className="w-[26px] h-[26px] rounded-full border border-pill-highlight flex items-center justify-center transition-colors group-hover:bg-pill-highlight/20">
              <ArrowRight className="w-3 h-3" strokeWidth={1.5} />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EditorialHero;