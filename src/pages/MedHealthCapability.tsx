import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

/* ------------------------------------------------------------------
   THEME CONFIG BLOCK
   The only block that changes per partner account.
   Supply Ministry owns every action colour. The partner layer sets
   ground and mood only.
   NOTE: partner tokens below are PLACEHOLDERS. Verify against a real
   MedHealth screenshot before this link is sent out.
------------------------------------------------------------------- */
const theme = {
  "--sm": "#3D2D9E",
  "--sm-hover": "#2E2178",
  "--sm-cream": "#F4EFE6",
  "--sm-cream-2": "#FBF8F2",
  "--p-ink": "#123B4A",
  "--p-ink-soft": "#4C6B77",
  "--p-accent": "#1F7A8C",
  "--p-accent-pale": "#E3EEF1",
} as React.CSSProperties;

const PARTNER_NAME = "MedHealth";

interface MicrositeProduct {
  id: string;
  clinical_group: string | null;
  status: string;
  product_name: string;
  product_code: string | null;
  category: string | null;
  price_rrp: number | null;
  key_specifications: string | null;
  sort_order: number;
}

const formatAud = (value: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value);

const firstSentence = (text: string | null) => {
  if (!text) return "";
  const match = text.match(/^[\s\S]*?[.!?](\s|$)/);
  return (match ? match[0] : text).trim();
};

const navLinks = [
  { label: "The range", href: "#the-range" },
  { label: "Source anything", href: "#source-anything" },
  { label: "Bed & mattress trials", href: "#trials" },
  { label: "Funding", href: "#funding" },
  { label: "How to order", href: "#how-to-order" },
];

const promises = [
  "If it is not listed we source it",
  "We beat any comparable quote",
  "One quote, one invoice",
  "Melbourne metro delivery",
  "GST-free on eligible items",
  "7-night bed and mattress trials",
];

const enquirySchema = z.object({
  first_name: z.string().trim().min(1, "First name is required").max(80),
  last_name: z.string().trim().min(1, "Last name is required").max(80),
  email: z.string().trim().email("Enter a valid email address").max(255),
  phone: z.string().trim().min(6, "Phone number is required").max(40),
  organization: z.string().trim().max(160).optional().or(z.literal("")),
  category: z.string().trim().min(1, "Select a category"),
  requirements: z.string().trim().min(1, "Tell us what you need").max(2000),
  timeline: z.string().trim().min(1, "Select a timeline"),
});

const btnPrimary =
  "inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[15px] font-semibold text-white transition-colors";

const MedHealthCapability = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["microsite_products", "medhealth"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("microsite_products")
        .select("*")
        .eq("collection", "medhealth")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as MicrositeProduct[];
    },
  });

  const priced = useMemo(
    () => (data ?? []).filter((p) => p.status === "priced"),
    [data]
  );
  const sourceable = useMemo(
    () => (data ?? []).filter((p) => p.status === "source_on_request"),
    [data]
  );

  const groups = useMemo(() => {
    const map = new Map<string, MicrositeProduct[]>();
    priced.forEach((p) => {
      const key = p.clinical_group || "Other equipment";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    });
    return Array.from(map.entries());
  }, [priced]);

  return (
    <div
      style={theme}
      className="min-h-screen font-[Outfit,system-ui,sans-serif] antialiased"
    >
      <Helmet>
        <title>Supply Ministry capability, prepared for {PARTNER_NAME}</title>
        <meta
          name="description"
          content="A Supply Ministry capability resource prepared for the MedHealth injury-rehabilitation and OT team. Baseline equipment priced, sourced and delivered on one invoice."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div style={{ backgroundColor: "var(--sm-cream)", color: "var(--p-ink)" }}>
        {/* Masthead */}
        <header
          className="border-b"
          style={{ borderColor: "rgba(18,59,74,0.12)", backgroundColor: "var(--sm-cream-2)" }}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 sm:flex-row sm:items-center sm:justify-between md:px-8">
            <span
              className="text-xl font-extrabold uppercase tracking-[0.14em] sm:text-2xl"
              style={{ color: "var(--sm)" }}
            >
              Supply Ministry
            </span>
            <span
              className="w-fit rounded-full border px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em]"
              style={{ borderColor: "rgba(18,59,74,0.25)", color: "var(--p-ink-soft)" }}
            >
              Prepared for {PARTNER_NAME}
            </span>
          </div>
        </header>

        {/* Sticky sub-nav */}
        <nav
          className="sticky top-0 z-40 border-b backdrop-blur"
          style={{
            borderColor: "rgba(18,59,74,0.12)",
            backgroundColor: "rgba(251,248,242,0.92)",
          }}
        >
          <div className="mx-auto flex max-w-6xl items-center gap-4 overflow-x-auto px-5 py-3 md:px-8">
            <div className="flex flex-1 items-center gap-5 whitespace-nowrap">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm font-medium transition-colors hover:underline"
                  style={{ color: "var(--p-ink-soft)" }}
                >
                  {l.label}
                </a>
              ))}
            </div>
            <a
              href="#enquiry"
              className="shrink-0 rounded-full px-5 py-2 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--sm)" }}
            >
              Request a quote
            </a>
          </div>
        </nav>

        <main>
          {/* Hero */}
          <section className="mx-auto max-w-6xl px-5 pb-4 pt-14 md:px-8 md:pt-20">
            <p
              className="text-[12px] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "var(--p-accent)" }}
            >
              Prepared for the {PARTNER_NAME} injury-rehabilitation and OT team
            </p>
            <h1
              className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-[56px]"
              style={{ color: "var(--p-ink)" }}
            >
              Your baseline equipment list, priced, sourced and on one invoice.
            </h1>
            <p
              className="mt-6 max-w-2xl text-lg font-light leading-relaxed"
              style={{ color: "var(--p-ink-soft)" }}
            >
              We work provider-first. Your clinician sends the clinical requirement, we
              price it, source anything not on the list, deliver it to the home and set it
              up. One point of contact, one quote, one invoice.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#enquiry"
                className={btnPrimary}
                style={{ backgroundColor: "var(--sm)" }}
              >
                Request a quote
              </a>
              <a
                href="#the-range"
                className="inline-flex items-center justify-center rounded-full border px-7 py-3.5 text-[15px] font-semibold"
                style={{ borderColor: "var(--sm)", color: "var(--sm)" }}
              >
                See the range
              </a>
            </div>
          </section>

          {/* Promise strip */}
          <section className="mx-auto max-w-6xl px-5 pb-12 pt-8 md:px-8">
            <ul
              className="flex flex-wrap items-center gap-x-3 gap-y-2 border-y py-4 text-[13px]"
              style={{ borderColor: "rgba(18,59,74,0.14)", color: "var(--p-ink-soft)" }}
            >
              {promises.map((p, i) => (
                <li key={p} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden="true" style={{ color: "var(--p-accent)" }}>·</span>}
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* The range */}
          <section id="the-range" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-12 md:px-8 md:py-16">
            <h2
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
              style={{ color: "var(--p-ink)" }}
            >
              The range
            </h2>

            <div
              className="mt-6 rounded-[16px] border px-6 py-5"
              style={{
                borderColor: "rgba(18,59,74,0.14)",
                backgroundColor: "var(--sm-cream-2)",
              }}
            >
              <p className="text-2xl font-bold" style={{ color: "var(--sm)" }}>
                {isLoading ? "Loading" : `${priced.length} items priced and ready now`}
              </p>
            </div>

            <p
              className="mt-5 max-w-3xl text-[15px] leading-relaxed"
              style={{ color: "var(--p-ink-soft)" }}
            >
              Prices are indicative RRP including GST where it applies. The exact figure
              and GST-free status are confirmed on the quote.
            </p>

            {isLoading && (
              <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-52 animate-pulse rounded-[16px] border"
                    style={{
                      borderColor: "rgba(18,59,74,0.12)",
                      backgroundColor: "var(--sm-cream-2)",
                    }}
                  />
                ))}
              </div>
            )}

            {!isLoading && (isError || priced.length === 0) && (
              <div
                className="mt-10 rounded-[16px] border px-6 py-10 text-center"
                style={{ borderColor: "rgba(18,59,74,0.14)", backgroundColor: "var(--sm-cream-2)" }}
              >
                <p className="text-lg font-medium" style={{ color: "var(--p-ink)" }}>
                  The priced list is being updated.
                </p>
                <p className="mt-2 text-[15px]" style={{ color: "var(--p-ink-soft)" }}>
                  Send us the item, quantity, delivery suburb and funding source and we
                  will come straight back with pricing.
                </p>
              </div>
            )}

            {!isLoading &&
              groups.map(([group, items]) => (
                <div key={group} className="mt-12">
                  <h3
                    className="text-[13px] font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "var(--p-accent)" }}
                  >
                    {group}
                  </h3>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((p) => (
                      <article
                        key={p.id}
                        className="flex flex-col rounded-[16px] border p-6"
                        style={{
                          borderColor: "rgba(18,59,74,0.14)",
                          backgroundColor: "var(--sm-cream-2)",
                        }}
                      >
                        {p.category && (
                          <span
                            className="w-fit rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.1em]"
                            style={{
                              backgroundColor: "var(--p-accent-pale)",
                              color: "var(--p-ink)",
                            }}
                          >
                            {p.category}
                          </span>
                        )}
                        <h4
                          className="mt-4 text-lg font-semibold leading-snug"
                          style={{ color: "var(--p-ink)" }}
                        >
                          {p.product_name}
                        </h4>
                        {p.price_rrp !== null && (
                          <p className="mt-2 text-2xl font-bold" style={{ color: "var(--sm)" }}>
                            {formatAud(Number(p.price_rrp))}
                          </p>
                        )}
                        {p.key_specifications && (
                          <p
                            className="mt-3 flex-1 text-[14px] leading-relaxed"
                            style={{ color: "var(--p-ink-soft)" }}
                          >
                            {firstSentence(p.key_specifications)}
                          </p>
                        )}
                        {p.product_code && (
                          <p
                            className="mt-5 text-[11px] uppercase tracking-[0.12em]"
                            style={{ color: "var(--p-ink-soft)" }}
                          >
                            {p.product_code}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                </div>
              ))}
          </section>

          {/* Source anything */}
          <section
            id="source-anything"
            className="scroll-mt-20 py-12 md:py-16"
            style={{ backgroundColor: "var(--sm-cream-2)" }}
          >
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <h2
                className="text-3xl font-semibold tracking-tight sm:text-4xl"
                style={{ color: "var(--p-ink)" }}
              >
                Source anything
              </h2>
              <p
                className="mt-5 max-w-3xl text-[15px] leading-relaxed"
                style={{ color: "var(--p-ink-soft)" }}
              >
                Tell us the clinical requirement, not a product code. Send the item,
                quantity, delivery suburb and funding source and we come straight back.
              </p>

              {sourceable.length > 0 ? (
                <ul className="mt-8 flex flex-wrap gap-2.5">
                  {sourceable.map((p) => (
                    <li
                      key={p.id}
                      className="rounded-full border px-4 py-2 text-[14px]"
                      style={{
                        borderColor: "rgba(18,59,74,0.2)",
                        color: "var(--p-ink)",
                        backgroundColor: "var(--sm-cream)",
                      }}
                    >
                      {p.product_name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-8 text-[15px]" style={{ color: "var(--p-ink-soft)" }}>
                  Send through the requirement and we will confirm availability and
                  pricing.
                </p>
              )}
            </div>
          </section>

          {/* Trials */}
          <section id="trials" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-12 md:px-8 md:py-16">
            <h2
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
              style={{ color: "var(--p-ink)" }}
            >
              Sleep Choice bed and mattress trials
            </h2>
            <p
              className="mt-5 max-w-3xl text-[15px] leading-relaxed"
              style={{ color: "var(--p-ink-soft)" }}
            >
              The one item nobody should quote cold is the electric adjustable bed. It
              spends seven nights in the client's own bedroom first.
            </p>
            <ol className="mt-8 grid gap-4 md:grid-cols-5">
              {[
                ["01", "Pre-trial planning call", "We confirm the clinical goals, access and bedroom setup with the OT."],
                ["02", "Delivery and setup", "Delivered to the room the bed will live in, assembled and tested."],
                ["03", "Seven nights", "The client sleeps in it in their own home, not a showroom."],
                ["04", "OT documents", "Comfort, transfers and safety recorded across the trial."],
                ["05", "Decision", "Buy, rent-to-buy, or free collection. Invoice only if it is kept."],
              ].map(([n, title, body]) => (
                <li
                  key={n}
                  className="rounded-[16px] border p-5"
                  style={{
                    borderColor: "rgba(18,59,74,0.14)",
                    backgroundColor: "var(--sm-cream-2)",
                  }}
                >
                  <span className="text-[13px] font-bold" style={{ color: "var(--sm)" }}>
                    {n}
                  </span>
                  <h3
                    className="mt-2 text-[16px] font-semibold leading-snug"
                    style={{ color: "var(--p-ink)" }}
                  >
                    {title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--p-ink-soft)" }}>
                    {body}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* Funding: the one tinted section */}
          <section
            id="funding"
            className="scroll-mt-20 py-14 md:py-20"
            style={{ backgroundColor: "var(--p-accent)" }}
          >
            <div className="mx-auto max-w-6xl px-5 md:px-8">
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Funding flexibility
              </h2>
              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-white/85">
                Equipment decisions rarely line up neatly with a funding cycle. These are
                the arrangements we use most often.
              </p>
              <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  ["Free 7-night trial", "Beds and mattresses go into the home for seven nights before anything is invoiced."],
                  ["Rent-to-buy and hire-to-own", "Rent paid is credited towards the purchase if the client decides to keep the item."],
                  ["Split invoicing", "The provider funds the clinical item, the client funds any upgrade they choose."],
                  ["Bridging rentals", "Short-term rental keeps equipment in the home while a plan variation is processed."],
                ].map(([title, body]) => (
                  <div
                    key={title}
                    className="rounded-[16px] bg-white p-6"
                    style={{ color: "var(--p-ink)" }}
                  >
                    <h3 className="text-[17px] font-semibold leading-snug">{title}</h3>
                    <p className="mt-3 text-[14px] leading-relaxed" style={{ color: "var(--p-ink-soft)" }}>
                      {body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* How to order */}
          <section id="how-to-order" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-12 md:px-8 md:py-16">
            <h2
              className="text-3xl font-semibold tracking-tight sm:text-4xl"
              style={{ color: "var(--p-ink)" }}
            >
              How to order
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {[
                [
                  "What to send us",
                  ["The item or the clinical requirement", "Quantity", "Delivery suburb", "Funding source", "Any access notes for the home"],
                ],
                [
                  "What comes back",
                  ["A written quote with GST status confirmed", "Availability and delivery window", "Trial or rental options where they apply", "One invoice on completion", "A single contact for the whole job"],
                ],
              ].map(([title, items]) => (
                <div
                  key={title as string}
                  className="rounded-[16px] border p-6"
                  style={{
                    borderColor: "rgba(18,59,74,0.14)",
                    backgroundColor: "var(--sm-cream-2)",
                  }}
                >
                  <h3 className="text-[18px] font-semibold" style={{ color: "var(--p-ink)" }}>
                    {title as string}
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {(items as string[]).map((i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-[15px] leading-relaxed"
                        style={{ color: "var(--p-ink-soft)" }}
                      >
                        <span aria-hidden="true" style={{ color: "var(--sm)" }}>·</span>
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <EnquiryForm />

            <p className="mt-8 text-[15px]" style={{ color: "var(--p-ink-soft)" }}>
              <a href="tel:0404593090" className="font-medium underline" style={{ color: "var(--sm)" }}>
                0404 593 090
              </a>{" "}
              ·{" "}
              <a
                href="mailto:hello@supplyministry.com.au"
                className="font-medium underline"
                style={{ color: "var(--sm)" }}
              >
                hello@supplyministry.com.au
              </a>{" "}
              ·{" "}
              <a
                href="https://www.supplyministry.com.au"
                className="font-medium underline"
                style={{ color: "var(--sm)" }}
              >
                supplyministry.com.au
              </a>
            </p>
          </section>
        </main>

        <footer
          className="border-t py-10"
          style={{ borderColor: "rgba(18,59,74,0.14)", backgroundColor: "var(--sm-cream-2)" }}
        >
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <p className="max-w-4xl text-[13px] leading-relaxed" style={{ color: "var(--p-ink-soft)" }}>
              A Supply Ministry resource prepared for the MedHealth team, August 2026. Not
              published, not indexed, and not a statement of partnership, endorsement or
              approval by MedHealth or any of its brands. Supply Ministry Pty Ltd, a
              Dignitech brand. GST-free status applies to eligible assistive technology
              items and is confirmed on the quote.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

const categories = [
  "Bathing and showering",
  "Dressing and reaching",
  "Transfers and positioning",
  "Beds and mattresses",
  "Toileting",
  "Mobility",
  "Other",
];

const timelines = ["Urgent, within 48 hours", "This week", "Within a month", "Planning ahead"];

const inputClass =
  "w-full rounded-[14px] border bg-white px-4 py-3 text-[15px] outline-none focus:ring-2";

const EnquiryForm = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    organization: "",
    category: "",
    requirements: "",
    timeline: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const set = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = enquirySchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        next[String(i.path[0])] = i.message;
      });
      setErrors(next);
      return;
    }
    setErrors({});
    setState("submitting");
    const { error } = await supabase.from("quote_requests").insert({
      first_name: parsed.data.first_name,
      last_name: parsed.data.last_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      organization: parsed.data.organization || null,
      category: parsed.data.category,
      requirements: parsed.data.requirements,
      timeline: parsed.data.timeline,
      source_url: typeof window !== "undefined" ? window.location.href : null,
    });
    setState(error ? "error" : "success");
  };

  if (state === "success") {
    return (
      <div
        id="enquiry"
        className="mt-10 scroll-mt-24 rounded-[16px] border p-8"
        style={{ borderColor: "rgba(18,59,74,0.14)", backgroundColor: "var(--p-accent-pale)" }}
      >
        <h3 className="text-[20px] font-semibold" style={{ color: "var(--p-ink)" }}>
          Thanks, we have it.
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "var(--p-ink-soft)" }}>
          One of our team will come back to you with a written quote. If it is urgent, call
          0404 593 090.
        </p>
      </div>
    );
  }

  return (
    <form
      id="enquiry"
      onSubmit={onSubmit}
      noValidate
      className="mt-10 scroll-mt-24 rounded-[16px] border p-6 md:p-8"
      style={{ borderColor: "rgba(18,59,74,0.14)", backgroundColor: "var(--sm-cream-2)" }}
    >
      <h3 className="text-[22px] font-semibold" style={{ color: "var(--p-ink)" }}>
        Request a quote
      </h3>
      <p className="mt-2 text-[15px]" style={{ color: "var(--p-ink-soft)" }}>
        Short is fine. We will call if anything needs clarifying.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        {[
          ["first_name", "First name", "text"],
          ["last_name", "Last name", "text"],
          ["email", "Email", "email"],
          ["phone", "Phone", "tel"],
        ].map(([name, label, type]) => (
          <Field key={name} label={label} error={errors[name]}>
            <input
              type={type}
              value={(form as Record<string, string>)[name]}
              onChange={(e) => set(name, e.target.value)}
              className={inputClass}
              style={{ borderColor: "rgba(18,59,74,0.2)", color: "var(--p-ink)" }}
            />
          </Field>
        ))}

        <Field label="Organisation" error={errors.organization}>
          <input
            type="text"
            value={form.organization}
            onChange={(e) => set("organization", e.target.value)}
            className={inputClass}
            style={{ borderColor: "rgba(18,59,74,0.2)", color: "var(--p-ink)" }}
          />
        </Field>

        <Field label="Category" error={errors.category}>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className={inputClass}
            style={{ borderColor: "rgba(18,59,74,0.2)", color: "var(--p-ink)" }}
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Timeline" error={errors.timeline}>
          <select
            value={form.timeline}
            onChange={(e) => set("timeline", e.target.value)}
            className={inputClass}
            style={{ borderColor: "rgba(18,59,74,0.2)", color: "var(--p-ink)" }}
          >
            <option value="">Select a timeline</option>
            {timelines.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field
            label="What do you need, including quantity, delivery suburb and funding source"
            error={errors.requirements}
          >
            <textarea
              rows={5}
              value={form.requirements}
              onChange={(e) => set("requirements", e.target.value)}
              className={inputClass}
              style={{ borderColor: "rgba(18,59,74,0.2)", color: "var(--p-ink)" }}
            />
          </Field>
        </div>
      </div>

      {state === "error" && (
        <p className="mt-5 text-[14px] font-medium" style={{ color: "#B3261E" }}>
          That did not send. Please try again, or call 0404 593 090.
        </p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className={`${btnPrimary} mt-7 disabled:opacity-60`}
        style={{ backgroundColor: "var(--sm)" }}
      >
        {state === "submitting" ? "Sending" : "Send request"}
      </button>
    </form>
  );
};

const Field = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <label className="block">
    <span className="mb-2 block text-[13px] font-medium" style={{ color: "var(--p-ink)" }}>
      {label}
    </span>
    {children}
    {error && (
      <span className="mt-1.5 block text-[13px]" style={{ color: "#B3261E" }}>
        {error}
      </span>
    )}
  </label>
);

export default MedHealthCapability;
