import React from "react";
import { Inter } from "next/font/google";
import {Metadata} from "next";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/footer/footer";

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
        <Footer/>
      </body>
    </html>
  );
}
