import { Minus, Plus } from "lucide-react";

interface Props {
  qty: number;
  label: string;
  onQty: (delta: number) => void;
  size?: "md" | "sm";
}

export function QtyStepper({ qty, label, onQty, size = "md" }: Props) {
  const btn = size === "sm" ? "h-9 w-9" : "h-11 w-11";

  return (
    <div
      className="flex items-center gap-1 rounded-full border p-1"
      style={{ borderColor: "rgba(1,10,22,0.4)", backgroundColor: "rgba(1,10,22,0.1)" }}
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        aria-label={`Decrease quantity of ${label}`}
        onClick={() => onQty(-1)}
        className={`flex ${btn} items-center justify-center rounded-full transition-colors hover:bg-white`}
        style={{ color: "#010A16" }}
      >
        <Minus className="h-4 w-4" />
      </button>
      <span
        aria-live="polite"
        className="min-w-6 text-center text-base font-semibold"
        style={{ color: "#231F20", fontFamily: "Outfit, system-ui, sans-serif" }}
      >
        {qty}
      </span>
      <button
        type="button"
        aria-label={`Increase quantity of ${label}`}
        onClick={() => onQty(1)}
        className={`flex ${btn} items-center justify-center rounded-full transition-colors hover:bg-white`}
        style={{ color: "#010A16" }}
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
