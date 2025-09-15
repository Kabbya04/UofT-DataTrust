"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-3 rounded-3xl transition-all duration-300 bg-background/80 hover:bg-card border border-border shadow-sm hover:shadow-lg backdrop-blur-sm"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="relative w-5 h-5">
        {theme === "dark" ? (
          <Sun className="w-5 h-5 text-amber-500 dark:text-amber-400 transition-colors duration-300" />
        ) : (
          <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300 transition-colors duration-300" />
        )}
      </div>
    </button>
  );
}
