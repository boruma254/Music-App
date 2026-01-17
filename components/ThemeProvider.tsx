"use client";

import { useEffect } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Load theme from localStorage on app start
    const savedTheme = localStorage.getItem("appTheme") as
      | "dark"
      | "light"
      | null;
    const theme = savedTheme || "dark";

    const root = document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
    root.style.colorScheme = theme;
  }, []);

  return <>{children}</>;
}
