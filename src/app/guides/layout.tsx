import { Inter } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Guides !",
  description: "des super guides pour super mecha",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
