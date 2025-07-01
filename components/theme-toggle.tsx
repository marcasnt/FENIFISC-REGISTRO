"use client"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = (theme === "dark") || (theme === "system" && resolvedTheme === "dark")

  return (
    <button
      aria-label={isDark ? "Activar tema claro" : "Activar tema oscuro"}
      className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Tema claro" : "Tema oscuro"}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  )
} 