"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import styles from "./LandingPage.module.css";

export default function FeatureRow({ feature, reverse }) {
  const ref = useRef(null);
  const [state, setState] = useState("init"); // init | hidden | visible

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Already in view on mount — show immediately, no animation
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 40) {
      setState("visible");
      return;
    }

    setState("hidden");
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const hidden = state === "hidden";
  const transitioning = state === "visible";
  const dur = "0.7s ease-out";

  return (
    <Link
      ref={ref}
      href={feature.href}
      className={`${styles.featureRow} ${reverse ? styles.featureRowReverse : ""}`}
      style={{
        opacity: hidden ? 0 : 1,
        transition: transitioning ? `opacity ${dur}` : "none",
      }}
    >
      <div
        className={styles.featureImageWrap}
        style={{
          transform: hidden ? `translateX(${reverse ? "-28px" : "28px"})` : "translateX(0)",
          transition: transitioning ? `transform ${dur} 0.08s, opacity ${dur} 0.08s` : "none",
          opacity: hidden ? 0 : 1,
        }}
      >
        <img src={feature.image} alt={feature.title} className={styles.featureImage} />
        <div className={styles.featureImageOverlay} />
      </div>
      <div
        className={styles.featureCopy}
        style={{
          transform: hidden ? `translateX(${reverse ? "28px" : "-28px"})` : "translateX(0)",
          transition: transitioning ? `transform ${dur}, opacity ${dur}` : "none",
          opacity: hidden ? 0 : 1,
        }}
      >
        <div className={styles.featureIcon}>{feature.icon}</div>
        <div className={styles.featureTitle}>{feature.title}</div>
        <p className={styles.featureDesc}>{feature.desc}</p>
        <span className={styles.featureCta}>Explore →</span>
      </div>
    </Link>
  );
}
