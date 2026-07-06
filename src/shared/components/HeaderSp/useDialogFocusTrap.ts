import { type RefObject, useEffect } from "react";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const getFocusableElements = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    (element) => !element.hasAttribute("disabled") && element.tabIndex >= 0,
  );

interface UseDialogFocusTrapOptions {
  isOpen: boolean;
  dialogRef: RefObject<HTMLElement | null>;
  initialFocusRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}

export const useDialogFocusTrap = ({
  isOpen,
  dialogRef,
  initialFocusRef,
  onClose,
}: UseDialogFocusTrapOptions) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousFocus =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    initialFocusRef.current?.focus();

    const keepFocusInDialog = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const dialog = dialogRef.current;
      if (!dialog) return;

      const focusableElements = getFocusableElements(dialog);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);
      if (!(firstElement && lastElement)) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
      }

      if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", keepFocusInDialog);
    return () => {
      window.removeEventListener("keydown", keepFocusInDialog);
      document.body.style.overflow = previousBodyOverflow;
      previousFocus?.focus();
    };
  }, [dialogRef, initialFocusRef, isOpen, onClose]);
};
