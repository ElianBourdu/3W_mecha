import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import React from "react";
import {Metadata} from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MechaWiki",
  description: "La référence française sur Mechabellum, trouvez tout les guides," +
    " et participez à des tournois de la communauté !"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
          <Navbar/>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
