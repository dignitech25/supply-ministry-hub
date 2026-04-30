import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-rollator-home.png";
const heroVideo = "/hero-video.mp4";

type Audience = {
  id: string;
  tabLabel: string;
  tabLabelLines?: [string, string];
  name: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

const audiences: Audience[] = [
  {
    id: "ot",
    tabLabel: "Occupational therapist",
    tabLabelLines: ["Occupational", "therapist"],
    name: "An occupational therapist",
    description:
      "You write the recommendation. We source exactly what you asked for, on one quote.",
    ctaLabel: "Find products for your clients",
    ctaHref: "/products",
  },
  {
    id: "aged-care",
    tabLabel: "Home care manager",
    tabLabelLines: ["Home care", "manager"],
    name: "A home care manager or case manager",
    description:
      "We manage the equipment and the family conversations, so the only thing you hear back is that they are happy.",
    ctaLabel: "Browse equipment for home care",
    ctaHref: "/products",
  },
  {
    id: "coordinator",
    tabLabel: "Support coordinator",
    tabLabelLines: ["Support", "coordinator"],
    name: "A support coordinator",
    description:
      "We get your participants the equipment they need, quickly and safely.",
    ctaLabel: "Source equipment for participants",
    ctaHref: "/products",
  },
  {
    id: "participant",
    tabLabel: "NDIS participant",
    tabLabelLines: ["NDIS", "participant"],
    name: "An NDIS participant, or a family member helping someone you love",
    description:
      "We do not rush. We answer your questions and make sure you are happy with what arrives.",
    ctaLabel: "Talk to us about what is needed",
    ctaHref: "/quote",
  },
];

const stats = [
  { number: "5-10", suffix: " homes a week", label: "Across Greater Melbourne" },
  { number: "24hr", suffix: " response", label: "On every quote we receive" },
];

const EditorialHero = () => {
  const [activeId, setActiveId] = useState(audiences[0].id);
  const active = audiences.find((a) => a.id === activeId) ?? audiences[0];

  return (
    <section className="bg-violet">
      {/* Desktop layout */}
      <div className="hidden min-[960px]:grid min-[960px]:grid-cols-[132px_1fr_42%] min-h-[640px]">
        {/* Column 0: Vertical audience tabs */}
        <div className="flex flex-col border-r border-white/[0.12]">
          {audiences.map((aud, idx) => {
            const isActive = aud.id === activeId;
            const lines = aud.tabLabelLines ?? [aud.tabLabel, ""];
            return (
              <button
                key={aud.id}
                onClick={() => setActiveId(aud.id)}
                aria-label={aud.tabLabel}
                className={`relative flex-1 min-h-[140px] flex flex-col justify-center px-5 text-left transition-colors ${
                  idx !== 0 ? "border-t border-white/[0.12]" : ""
                } ${isActive ? "bg-white/[0.08]" : "hover:bg-white/[0.04]"}`}
                aria-pressed={isActive}
              >
                <span
                  className="font-geist uppercase text-[10px] font-medium leading-[1.35]"
                  style={{
                    letterSpacing: "0.14em",
                    color: isActive ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.5)",
                  }}
                >
                  <span className="block">{lines[0]}</span>
                  {lines[1] && <span className="block">{lines[1]}</span>}
                </span>
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute right-0 top-0 bottom-0 w-px bg-cream"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Column 1: Left content panel */}
        <div className="flex flex-col justify-center" style={{ padding: "56px 52px 56px 44px", gap: "44px" }}>
          <div>
            <h1
              className="font-editorial mb-[26px] text-cream"
              style={{
                fontWeight: 200,
                fontSize: "64px",
                lineHeight: 0.95,
                letterSpacing: "-0.025em",
              }}
            >
              Helping people feel safer and more comfortable at{" "}
              <span className="italic" style={{ color: "hsl(var(--gold))" }}>
                home
              </span>
            </h1>
            <p
              className="font-geist max-w-[290px]"
              style={{
                fontWeight: 300,
                fontSize: "15px",
                color: "rgba(255,255,255,0.65)",
                lineHeight: 1.85,
              }}
            >
              We find the right equipment, deliver it carefully, set it up, and stay close until everyone is happy with it.
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
                    fontWeight: 400,
                    fontSize: "9px",
                    letterSpacing: "0.13em",
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.65,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: Right panel */}
        <div className="bg-cream-alt border-l border-cream-border flex flex-col">
          <div
            className="flex-1 relative min-h-[268px] overflow-hidden"
          >
            <video
              src={heroVideo}
              poster={heroImage}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Supply Ministry assistive equipment in use"
              className="absolute inset-0 w-full h-full object-cover object-center"
              width={896}
              height={1184}
            />
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
      <div className="min-[960px]:hidden">
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
          <h1
            className="font-editorial mb-5 text-cream"
            style={{ fontWeight: 200, fontSize: "44px", lineHeight: 0.95, letterSpacing: "-0.025em" }}
          >
            Helping people feel safer and more comfortable at{" "}
            <span className="italic" style={{ color: "hsl(var(--gold))" }}>
              home
            </span>
          </h1>
          <p
            className="font-geist mb-8"
            style={{ fontSize: "15px", fontWeight: 300, color: "rgba(255,255,255,0.65)", lineHeight: 1.85 }}
          >
            We find the right equipment, deliver it carefully, set it up, and stay close until everyone is happy with it.
          </p>
          <div
            className="pt-6 grid grid-cols-2 gap-4"
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
                  style={{ fontSize: "8px", letterSpacing: "0.13em", color: "rgba(255,255,255,0.55)", lineHeight: 1.5, fontWeight: 400 }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative h-[340px] overflow-hidden">
          <video
            src={heroVideo}
            poster={heroImage}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Supply Ministry assistive equipment in use"
            className="absolute inset-0 w-full h-full object-cover object-center"
            width={896}
            height={1184}
          />
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