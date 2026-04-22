import { useEffect } from "react";
import { useLocation } from "wouter";

/**
 * Scrolls the window to the top whenever the route changes.
 * Must be rendered inside the Router context (inside Layout).
 */
export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Use instant scroll so the new page starts at top without animation conflict
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);

  return null;
}
