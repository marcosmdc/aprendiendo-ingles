import type { Metadata, Viewport } from "next";
import "./globals.css";
import RegisterServiceWorker from "./register-sw";
import { themeScript } from "./theme-toggle";

export const metadata: Metadata = {
  title: "Verbos irregulares",
  description: "Practica verbos irregulares en ingles con escucha, repeticion y mini quiz.",
  applicationName: "Verbos irregulares",
  appleWebApp: { capable: true, title: "Verbos", statusBarStyle: "default" },
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
    <html lang="es" suppressHydrationWarning>
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
