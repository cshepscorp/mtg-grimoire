import Link from "next/link";
import ArcaneBackground from "./ArcaneBackground";
import FeatureRow from "./FeatureRow";
import styles from "./LandingPage.module.css";

const scry = (name) =>
  `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(name)}&format=image&version=art_crop`;

const FEATURES = [
  {
    icon: "✦",
    title: "Card Explorer",
    desc: "Search 30,000+ Magic cards by name, artist, set, or color identity. Dive deep into lore, art, and rulings.",
    href: "/explore",
    image: scry("Liliana of the Veil"),
  },
  {
    icon: "⊞",
    title: "Deck Builder",
    desc: "Build and save decks with a fluid editor. Sort by type, color, and CMC. Preview every card as you work.",
    href: "/deck/new",
    image: scry("Atraxa, Praetors' Voice"),
  },
  {
    icon: "◈",
    title: "Collection",
    desc: "Log the physical cards you own, track quantities by printing, and know exactly what's in your collection.",
    href: "/my-grimoire?tab=collection",
    image: scry("Black Lotus"),
  },
  {
    icon: "✧",
    title: "AI Deck Assistant",
    desc: "Find a card, then let AI build a full deck around it. Refine and iterate through conversation.",
    href: "/explore",
    image: scry("Nicol Bolas, Planeswalker"),
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
        {FEATURES.map((f, i) => (
          <FeatureRow key={f.title} feature={f} reverse={i % 2 === 1} />
        ))}
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
