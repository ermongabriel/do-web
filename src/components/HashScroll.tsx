import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scrolls to the in-page anchor (e.g. /#features) after a route change.
// Needed because navbar links point at "/#features" so they work from any
// page — but react-router doesn't auto-scroll to a hash on navigation.
export default function HashScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }
    const id = hash.slice(1);
    // Wait a tick for the target section to mount, then scroll to it.
    const tryScroll = (attempt = 0) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (attempt < 10) {
        setTimeout(() => tryScroll(attempt + 1), 60);
      }
    };
    tryScroll();
  }, [pathname, hash]);

  return null;
}
