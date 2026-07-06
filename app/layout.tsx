import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ingles: verbos y pronunciacion",
  description: "Practica verbos irregulares en ingles con escucha, repeticion y mini quiz."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
