"use client";

import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import styles from "./LandingPage.module.css";

export default function NavAuthActions() {
  const { user, loading, signOut } = useAuth();

  if (loading) return <div style={{ width: 160 }} />;

  if (user) {
    return (
      <div className={styles.navActions}>
        <Link href="/explore" className={`${styles.navSignIn} ${styles.navHideMobile}`}>Explore</Link>
        <Link href="/my-grimoire" className={styles.navSignUp}>My Grimoire</Link>
        <button onClick={signOut} className={styles.navSignOut}>Sign out</button>
      </div>
    );
  }

  return (
    <div className={styles.navActions}>
      <Link href="/auth" className={styles.navSignIn}>Sign in</Link>
      <Link href="/auth" className={styles.navSignUp}>Sign up free</Link>
    </div>
  );
}
