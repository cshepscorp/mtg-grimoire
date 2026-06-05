"use client";

import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./LandingPage.module.css";

export default function HeroCtas() {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ height: 52 }} />;

  if (user) {
    return (
      <div className={styles.heroCtas}>
        <Link href="/my-grimoire" className={styles.ctaPrimary}>My Grimoire</Link>
        <Link href="/explore" className={styles.ctaSecondary}>Explore cards →</Link>
      </div>
    );
  }

  return (
    <div className={styles.heroCtas}>
      <Link href="/auth" className={styles.ctaPrimary}>Sign up free</Link>
      <Link href="/explore" className={styles.ctaSecondary}>Explore cards →</Link>
    </div>
  );
}
