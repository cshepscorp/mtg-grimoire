import "./globals.css";
import { GrimoireProvider } from "../contexts/GrimoireContext";
import { AuthProvider } from "../contexts/AuthContext";

export const metadata = {
  title: "Grimoire",
  description: "A Magic: The Gathering lore and art explorer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <GrimoireProvider>
            {children}
          </GrimoireProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
