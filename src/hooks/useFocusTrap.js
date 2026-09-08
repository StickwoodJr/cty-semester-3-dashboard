import { useEffect, useRef } from 'react';

/**
 * useFocusTrap: Traps keyboard focus within an active modal dialog
 * and restores focus to the previously active element upon closing.
 * Complies with WAI-ARIA APG Modal Dialog pattern (WCAG 2.1 AA).
 */
export function useFocusTrap(isOpen) {
  const containerRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // 1. Remember previously focused element to return focus on close
    previousFocusRef.current = document.activeElement;

    const container = containerRef.current;
    if (!container) return;

    const getFocusableElements = () => {
      return Array.from(
        container.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(el => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0);
    };

    const focusable = getFocusableElements();
    if (focusable.length > 0) {
      setTimeout(() => {
        if (!container.contains(document.activeElement)) {
          focusable[0]?.focus();
        }
      }, 50);
    }

    // 2. Trap Tab and Shift+Tab key inside container
    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;

      const elements = getFocusableElements();
      if (elements.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = elements[0];
      const lastElement = elements[elements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement || !container.contains(document.activeElement)) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement || !container.contains(document.activeElement)) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // 3. Restore focus on close
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen]);

  return containerRef;
}
