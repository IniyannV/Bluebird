import { useEffect, useRef } from "react";
import Button from "./Button";

export default function Modal({ open, title, children, confirmLabel = "Confirm", onConfirm, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!open || !modalRef.current) return undefined;

    const previouslyFocused = document.activeElement;
    const modal = modalRef.current;
    const focusableSelector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const getFocusableElements = () => Array.from(modal.querySelectorAll(focusableSelector));
    const focusableElements = getFocusableElements();

    focusableElements[0]?.focus();

    function handleKeyDown(event) {
      if (event.key !== "Tab") return;

      const elements = getFocusableElements();
      if (!elements.length) return;

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    modal.addEventListener("keydown", handleKeyDown);
    return () => {
      modal.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-lg border border-app-border bg-app-surface p-5 shadow-2xl">
        <div className="mb-3 flex items-start justify-between gap-4">
          <h2 className="text-lg font-bold text-app-text">{title}</h2>
          <button
            aria-label="Close modal"
            className="rounded text-app-muted transition-all duration-150 hover:text-white"
            onClick={onClose}
          >
            x
          </button>
        </div>
        <div className="text-sm leading-6 text-app-muted">{children}</div>
        <div className="mt-5 flex justify-end gap-2">
          <Button aria-label="Cancel" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button aria-label={confirmLabel} variant="danger" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
