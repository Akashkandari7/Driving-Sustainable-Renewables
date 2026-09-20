"use client";

import { currentTheme, setTheme } from "@/lib/theme";

// Which icon shows is decided in CSS from the html[data-theme] attribute, so there is no
// hydration mismatch and no flash of the wrong icon.
export default function ThemeToggle() {
  return (
    <button
      className="icon-btn theme-toggle"
      onClick={() => setTheme(currentTheme() === "dark" ? "light" : "dark")}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
    >
      <svg className="icon icon--moon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <path
          d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
      </svg>
      <svg className="icon icon--sun" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
        </g>
      </svg>
    </button>
  );
}
