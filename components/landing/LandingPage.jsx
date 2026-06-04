import Link from "next/link";
import ArcaneBackground from "./ArcaneBackground";
import styles from "./LandingPage.module.css";

const FEATURES = [
  {
    icon: "✦",
    title: "Card Explorer",
    desc: "Search 30,000+ Magic cards by name, artist, set, or color identity. Dive into lore, art, and rulings.",
    href: "/explore",
  },
  {
    icon: "⊞",
    title: "Deck Builder",
    desc: "Build and save decks with a fluid editor. Sort by type, color, and CMC. Preview every card as you work.",
    href: "/deck/new",
  },
  {
    icon: "◈",
    title: "Collection",
    desc: "Log the physical cards you own, track quantities, and know exactly what's in your collection.",
    href: "/my-grimoire?tab=collection",
  },
  {
    icon: "✧",
    title: "AI Deck Assistant",
    desc: "Find a card, then let AI build a full deck around it. Refine and iterate through conversation.",
    href: "/explore",
  },
];

export default function LandingPage() {
  return (
    <div className={styles.page}>

      {/* Nav */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.navLogo}>
          <div className={styles.navLogoText}>Grimoire</div>
        </Link>
        <div className={styles.navActions}>
          {/* href → /auth once auth is implemented */}
          <Link href="/explore" className={styles.navSignIn}>Sign in</Link>
          <Link href="/explore" className={styles.navSignUp}>Sign up free</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <ArcaneBackground />
        <div className={styles.heroRule}>Magic: The Gathering</div>
        <h1 className={styles.heroTitle}>Grimoire</h1>
        <p className={styles.heroTagline}>Your complete companion</p>
        <p className={styles.heroDesc}>
          Explore thirty thousand cards, track your collection, build decks,
          and craft strategies with AI — all in one place.
        </p>
        <div className={styles.heroCtas}>
          {/* href → /auth once auth is implemented */}
          <Link href="/explore" className={styles.ctaPrimary}>Sign up free</Link>
          <Link href="/explore" className={styles.ctaSecondary}>Explore cards →</Link>
        </div>
        <div className={styles.scrollHint}>
          <div className={styles.scrollHintLine} />
          Discover
        </div>
      </section>

      <div className={styles.divider} />

      {/* Features */}
      <section className={styles.features}>
        <div className={styles.featuresLabel}>What's inside</div>
        <div className={styles.featuresGrid}>
          {FEATURES.map((f) => (
            <Link key={f.title} href={f.href} className={`${styles.featureCard} ${styles.linked}`}>
              <div className={styles.featureIcon}>{f.icon}</div>
              <div className={styles.featureTitle}>{f.title}</div>
              <p className={styles.featureDesc}>{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className={styles.divider} />

      {/* Footer */}
      <footer className={styles.footer}>
        <span>© 2026 Grimoire</span>
        <div className={styles.footerLinks}>
          <Link href="/explore" className={styles.footerLink}>Explore</Link>
          <Link href="/my-grimoire" className={styles.footerLink}>My Grimoire</Link>
          <Link href="/deck/new" className={styles.footerLink}>New Deck</Link>
        </div>
      </footer>

    </div>
  );
}
