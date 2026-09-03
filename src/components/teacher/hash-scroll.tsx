"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Next.js's built-in scroll-to-hash on client-side navigation between
// routes is unreliable (a known limitation) — links like
// "/teacher#tarix" from a different page can land at the top instead of
// the target section. This scrolls to the hash explicitly once the page
// (and its data) has rendered, with a couple of retries for slow paints.
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;

    const id = hash.slice(1);
    let attempts = 0;

    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      attempts++;
      if (attempts < 10) setTimeout(tryScroll, 100);
    };

    tryScroll();
  }, [pathname]);

  return null;
}
