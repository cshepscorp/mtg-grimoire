"use client";

import { useState, useEffect } from "react";
import styles from "./ScrollToTop.module.css";

export default function ScrollToTop({ containerRef }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = containerRef?.current;

    const check = () => {
      const elScroll = el ? el.scrollTop : 0;
      setVisible(elScroll > 300 || window.scrollY > 300);
    };

    el?.addEventListener("scroll", check, { passive: true });
    window.addEventListener("scroll", check, { passive: true });

    return () => {
      el?.removeEventListener("scroll", check);
      window.removeEventListener("scroll", check);
    };
  }, [containerRef]);

  const scrollToTop = () => {
    containerRef?.current?.scrollTo({ top: 0, behavior: "smooth" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!visible) return null;

  return (
    <button
      className={styles.btn}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      ↑
    </button>
  );
}
