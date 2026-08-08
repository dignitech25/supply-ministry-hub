import { PARTNER } from "@/partners/medhealth";

const SUPPLY_MINISTRY_LOGO = "/Supply_Ministry_logo_new_cropped.png";
const MEDHEALTH_LOGO = PARTNER.logo;

/** Supply Ministry mark, used on its own in tight spaces such as the footer. */
export function ArcMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <img
      src={SUPPLY_MINISTRY_LOGO}
      alt=""
      aria-hidden="true"
      className={`${className} w-auto object-contain object-left`}
    />
  );
}

export function SupplyMinistryLogo({ compact = false }: { compact?: boolean }) {
  return (
    <img
      src={SUPPLY_MINISTRY_LOGO}
      alt="Supply Ministry"
      className={`${compact ? "h-7" : "h-10 sm:h-11"} w-auto object-contain object-left`}
    />
  );
}

/** MedHealth wordmark, supplied by the partner. */
export function MedHealthLogo({ className = "" }: { className?: string }) {
  return (
    <img
      src={MEDHEALTH_LOGO}
      alt={PARTNER.name}
      className={`inline-block h-[1em] w-auto translate-y-[0.1em] object-contain align-baseline ${className}`}
    />
  );
}

/**
 * Masthead lockup. Supply Ministry leads, the partner sits clearly
 * secondary behind a "Prepared for" label, never as a co-equal mark.
 */
export function PartnerLockup({ onHome }: { onHome?: () => void }) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 sm:gap-x-6">
      <button
        type="button"
        onClick={onHome}
        aria-label="Back to catalogue home"
        className="rounded-lg transition-opacity hover:opacity-80"
      >
        <SupplyMinistryLogo />
      </button>
      <span
        aria-hidden="true"
        className="h-8 w-px shrink-0"
        style={{ backgroundColor: PARTNER.rule }}
      />
      <div className="min-w-0 leading-none">
        <span
          className="block text-[9px] font-semibold uppercase leading-none tracking-[0.18em]"
          style={{ color: "rgba(1,10,22,0.5)" }}
        >
          {PARTNER.preparedFor}
        </span>
        <MedHealthLogo className="mt-[7px] text-[16px] opacity-90 sm:text-[19px]" />
      </div>
    </div>
  );
}
