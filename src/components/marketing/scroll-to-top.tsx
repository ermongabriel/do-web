import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { shadowButton } from "@/lib/utils";

// Bottom-right scroll-to-top control. Uses the site's signature "hard
// shadow" button treatment — gradient fill, 2px solid border, offset
// shadow that holds on press, and a scale-on-hover / shrink-on-press so it
// feels identical to the Hero / Navbar / Pricing CTAs.
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-none border-2 border-solid border-foreground bg-gradient-primary text-primary-foreground ${shadowButton} sm:bottom-8 sm:right-8 sm:h-14 sm:w-14 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};

export default ScrollToTop;
