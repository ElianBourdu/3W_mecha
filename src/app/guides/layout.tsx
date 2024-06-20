import React from "react";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Guides !",
  description: "des super guides pour super mecha",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
    </div>
  );
}
