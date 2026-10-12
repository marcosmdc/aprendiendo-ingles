"use client";

import { useEffect, useState } from "react";

type Theme = "system" | "light" | "dark";

const KEY = "theme";
const next: Record<Theme, Theme> = { system: "dark", dark: "light", light: "system" };
const labels: Record<Theme, string> = { system: "Tema: automatico", dark: "Tema: oscuro", light: "Tema: claro" };

// Se ejecuta en el <head> antes de pintar, para que no parpadee el tema claro.
export const themeScript = `try{var t=localStorage.getItem("${KEY}");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

function applyTheme(theme: Theme) {
  if (theme === "system") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  try {
    if (theme === "system") window.localStorage.removeItem(KEY);
    else window.localStorage.setItem(KEY, theme);
  } catch {}
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const saved = document.documentElement.dataset.theme;
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  function toggle() {
    const value = next[theme];
    setTheme(value);
    applyTheme(value);
  }

  return (
    <button className="themeToggle" onClick={toggle} aria-label={`${labels[theme]}. Cambiar tema`}>
      {labels[theme]}
    </button>
  );
}
