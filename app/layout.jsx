import "./globals.css";

export const metadata = {
  title: "Grimoire",
  description: "A Magic: The Gathering lore and art explorer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
