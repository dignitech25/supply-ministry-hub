import { useEffect, useState } from "react";
import { X, Copy, Download, CheckCircle2, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { downloadCsv, makeReference, money, toCsv, type Product } from "@/lib/medhealth-catalogue";
import { QtyStepper } from "./QtyStepper";

export interface Line {
  product: Product;
  qty: number;
}

interface Props {
  lines: Line[];
  total: number;
  onClose: () => void;
  onComplete: () => void;
  onQty: (code: string, delta: number) => void;
  onRemove: (code: string) => void;
}

function formatRequirements(lines: Line[], total: number) {
  const body = lines
    .map(
      (l) =>
        `${l.qty} x ${l.product.product_name} (${l.product.product_code}) - ${money(
          l.product.price_rrp,
        )} ea = ${money((l.product.price_rrp ?? 0) * l.qty)}`,
    )
    .join("\n");
  return `${body}\n\nIndicative total: ${money(total)} (ex delivery, GST-free status confirmed on quote)`;
}

export function ReviewSheet({ lines, total, onClose, onComplete, onQty, onRemove }: Props) {
  const isEmpty = lines.length === 0;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [clientRef, setClientRef] = useState("");
  const [suburb, setSuburb] = useState("");
  const [state, setState] = useState<"form" | "sending" | "done" | "error">("form");
  const [reference, setReference] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const csvRows = lines.map((l) => ({
    Category: l.product.category,
    Product: l.product.product_name,
    Code: l.product.product_code,
    Qty: l.qty,
    Price: l.product.price_rrp ?? "",
  }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    const ref = makeReference();
    const [first, ...rest] = name.trim().split(/\s+/);
    const { error } = await supabase.from("quote_requests").insert({
      first_name: first ?? "",
      last_name: rest.join(" ") || (first ?? ""),
      email: email.trim(),
      phone: phone.trim(),
      organization: "MedHealth",
      category: "MedHealth catalogue request",
      requirements: formatRequirements(lines, total),
      timeline: "Not specified",
      source_url: typeof window !== "undefined" ? window.location.href : null,
      metadata: {
        reference: ref,
        client_reference: clientRef,
        delivery_suburb: suburb,
        indicative_total: total,
        line_items: lines.map((l) => ({
          product_name: l.product.product_name,
          product_code: l.product.product_code,
          category: l.product.category,
          qty: l.qty,
          price_rrp: l.product.price_rrp,
        })),
      },
    });

    if (error) {
      console.error(error);
      setState("error");
      return;
    }
    setReference(ref);
    setState("done");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-[#231F20]/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-title"
        className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl"
      >
        <div
          className="h-1 w-full"
          style={{
            backgroundImage: "linear-gradient(90deg, #3D2D9E 0%, #33456B 38%, #2A5263 72%, #FCB040 100%)",
          }}
        />

        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <h2
            id="review-title"
            className="text-lg font-semibold"
            style={{ color: "#231F20", fontFamily: "Outfit, system-ui, sans-serif" }}
          >
            {state === "done" ? "Request sent" : "Review & send"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[#F4EFE6]"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {isEmpty && state !== "done" ? (
          <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Your selection is empty. Add items from the catalogue and they will appear here.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 min-h-11 rounded-xl px-8 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#3D2D9E", fontFamily: "Outfit, system-ui, sans-serif" }}
            >
              Back to catalogue
            </button>
          </div>
        ) : state === "done" ? (
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <CheckCircle2 className="h-12 w-12" style={{ color: "#3D2D9E" }} strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">
              Thanks {name.split(" ")[0]}. Your MedHealth selection is with the Supply Ministry
              team.
            </p>
            <p
              className="text-2xl font-bold tracking-tight"
              style={{ color: "#231F20", fontFamily: "Outfit, system-ui, sans-serif" }}
            >
              {reference}
            </p>
            <p className="max-w-xs text-xs text-muted-foreground">
              Quote your reference in any follow-up. Pricing is indicative; GST-free status on
              eligible items is confirmed on quote.
            </p>
            <button
              type="button"
              onClick={onComplete}
              className="mt-3 min-h-11 rounded-xl px-8 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#3D2D9E", fontFamily: "Outfit, system-ui, sans-serif" }}
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <ul className="divide-y divide-border">
                {lines.map((l) => (
                  <li key={l.product.product_code} className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3">
                    <span className="min-w-[8rem] flex-1 text-sm" style={{ color: "#231F20" }}>
                      {l.product.product_name}
                      <span className="ml-1 text-xs text-muted-foreground">
                        {l.product.product_code}
                      </span>
                    </span>
                    <QtyStepper
                      qty={l.qty}
                      label={l.product.product_name}
                      onQty={(d) => onQty(l.product.product_code, d)}
                      size="sm"
                    />
                    <span
                      className="min-w-[4.5rem] text-right text-sm font-semibold"
                      style={{ color: "#2A5263", fontFamily: "Outfit, system-ui, sans-serif" }}
                    >
                      {money((l.product.price_rrp ?? 0) * l.qty)}
                    </span>
                    <button
                      type="button"
                      onClick={() => onRemove(l.product.product_code)}
                      aria-label={`Remove ${l.product.product_name} from your selection`}
                      className="flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[#F4EFE6] hover:text-[#EC1C24]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex items-baseline justify-between border-t-2 border-[#231F20]/10 pt-3">
                <span
                  className="text-sm font-semibold"
                  style={{ color: "#231F20", fontFamily: "Outfit, system-ui, sans-serif" }}
                >
                  Indicative total
                </span>
                <span
                  className="text-xl font-bold"
                  style={{ color: "#2A5263", fontFamily: "Outfit, system-ui, sans-serif" }}
                >
                  {money(total)}
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard.writeText(formatRequirements(lines, total));
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="focus-blend flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors hover:bg-[rgba(51,69,107,0.1)]"
                  style={{ borderColor: "rgba(51,69,107,0.4)", color: "#33456B" }}
                >
                  <Copy className="h-4 w-4" /> {copied ? "Copied" : "Copy list"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    downloadCsv(
                      "supply-ministry-selection.csv",
                      toCsv(csvRows, ["Category", "Product", "Code", "Qty", "Price"]),
                    )
                  }
                  className="focus-blend flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-medium transition-colors hover:bg-[rgba(51,69,107,0.1)]"
                  style={{ borderColor: "rgba(51,69,107,0.4)", color: "#33456B" }}
                >
                  <Download className="h-4 w-4" /> Download CSV
                </button>
              </div>

              <div className="mt-5 space-y-3">
                {([
                  { id: "name", label: "Your name", value: name, set: setName, required: true },
                  {
                    id: "email",
                    label: "Email",
                    value: email,
                    set: setEmail,
                    required: true,
                    type: "email",
                  },
                  {
                    id: "phone",
                    label: "Phone",
                    value: phone,
                    set: setPhone,
                    required: true,
                    type: "tel",
                  },
                  {
                    id: "clientref",
                    label: "Client reference",
                    value: clientRef,
                    set: setClientRef,
                    required: true,
                  },
                  {
                    id: "suburb",
                    label: "Delivery suburb",
                    value: suburb,
                    set: setSuburb,
                    required: true,
                  },
                ] as Array<{
                  id: string;
                  label: string;
                  value: string;
                  set: (v: string) => void;
                  required: boolean;
                  type?: string;
                }>).map((f) => (
                  <div key={f.id}>
                    <label
                      htmlFor={f.id}
                      className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                    >
                      {f.label}
                    </label>
                    <input
                      id={f.id}
                      type={f.type ?? "text"}
                      value={f.value}
                      required={f.required}
                      maxLength={120}
                      onChange={(e) => f.set(e.target.value)}
                      className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-base outline-none focus:border-[#33456B]"
                      style={{ color: "#231F20" }}
                    />
                  </div>
                ))}
              </div>

              {state === "error" && (
                <p
                  role="alert"
                  className="mt-4 flex items-start gap-2 rounded-xl p-3 text-sm"
                  style={{ backgroundColor: "rgba(236,28,36,0.1)", color: "#EC1C24" }}
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  We couldn't send that request. Check your connection and try again, your
                  selection has been kept.
                </p>
              )}
            </div>

            <div className="border-t border-border px-5 py-4">
              <button
                type="submit"
                disabled={state === "sending" || isEmpty}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-4 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "#3D2D9E", fontFamily: "Outfit, system-ui, sans-serif" }}
              >
                {state === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
                {state === "sending" ? "Sending" : state === "error" ? "Try again" : "Send request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
