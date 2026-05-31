import "./globals.css";
import { GrimoireProvider } from "../contexts/GrimoireContext";

export const metadata = {
  title: "Grimoire",
  description: "A Magic: The Gathering lore and art explorer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GrimoireProvider>
          {children}
        </GrimoireProvider>
      </body>
    </html>
  );
}
