import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import RegisterServiceWorker from "./register-sw";
import { themeScript } from "./theme-toggle";

// La fuente se descarga al compilar y se sirve desde la app (funciona sin conexion).
const font = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "Speak Up",
  description: "Practica ingles: verbos irregulares, oraciones para completar y frases para la vida real.",
  applicationName: "Speak Up",
  appleWebApp: { capable: true, title: "Speak Up", statusBarStyle: "default" },
  icons: {
    icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: "/icons/apple-touch-icon.png"
  }
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1f7a5c" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1512" }
  ]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={font.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        {children}
        <RegisterServiceWorker />
      </body>
    </html>
  );
}
