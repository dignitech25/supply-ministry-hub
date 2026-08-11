import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  /** Accessible title, rendered as the visible dialog heading. */
  title: ReactNode;
  /** Optional supporting line, wired to aria-describedby. */
  description?: ReactNode;
  closeLabel: string;
  onClose: () => void;
  /** False while a request is in flight: overlay clicks must not discard it. */
  dismissOnOverlay?: boolean;
  /** Optional coloured rule above the header. */
  topRule?: string;
  maxWidthClass?: string;
  children: ReactNode;
  /** Sticky footer area, kept outside the scrolling body. */
  footer?: ReactNode;
}

/**
 * Shared modal for the MedHealth catalogue.
 *
 * Radix Dialog supplies the behaviour the hand-rolled overlays lacked: focus
 * moves in on open and returns to the trigger on close, Tab is trapped, the
 * background is inert to pointer, keyboard and assistive technology, body
 * scroll is locked, and Escape always closes.
 */
export function ModalShell({
  title,
  description,
  closeLabel,
  onClose,
  dismissOnOverlay = true,
  topRule,
  maxWidthClass = "sm:max-w-2xl",
  children,
  footer,
}: Props) {
  /*
   * The dialog closes in two steps. Radix restores focus to the trigger while
   * its content unmounts, so the parent must keep this component mounted for
   * that tick. Tearing the whole Root down on the close click would drop focus
   * onto the body instead of the control that opened the dialog.
   */
  const [open, setOpen] = useState(true);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (open) return;
    const id = window.setTimeout(() => closeRef.current(), 0);
    return () => window.clearTimeout(id);
  }, [open]);

  const requestClose = useCallback(() => setOpen(false), []);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(next) => !next && requestClose()}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#231F20]/50 backdrop-blur-sm" />
        <DialogPrimitive.Content
          data-medhealth=""
          onPointerDownOutside={(e) => {
            if (!dismissOnOverlay) e.preventDefault();
          }}
          onInteractOutside={(e) => {
            if (!dismissOnOverlay) e.preventDefault();
          }}
          style={{ fontFamily: "Raleway, system-ui, sans-serif" }}
          className={`fixed bottom-0 left-1/2 z-50 flex max-h-[92vh] w-full -translate-x-1/2 flex-col overflow-hidden rounded-t-3xl bg-card text-[#231F20] shadow-2xl sm:bottom-auto sm:top-1/2 sm:w-[calc(100%-3rem)] sm:-translate-y-1/2 sm:rounded-3xl ${maxWidthClass}`}
        >
          {topRule && <div className="h-1 w-full shrink-0" style={{ backgroundImage: topRule }} />}

          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4">
            <div className="min-w-0">
              <DialogPrimitive.Title
                className="text-lg font-semibold"
                style={{ color: "#231F20" }}
              >
                {title}
              </DialogPrimitive.Title>
              {description ? (
                <DialogPrimitive.Description className="mt-1 text-sm text-muted-foreground">
                  {description}
                </DialogPrimitive.Description>
              ) : (
                <DialogPrimitive.Description className="sr-only">
                  {closeLabel}
                </DialogPrimitive.Description>
              )}
            </div>
            <DialogPrimitive.Close
              aria-label={closeLabel}
              className="mh-tap flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-[#F4EFE6]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>

          {children}

          {footer}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
