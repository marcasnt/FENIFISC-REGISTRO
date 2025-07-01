"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Trophy, Calendar, Database } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-gradient-dark">
      {/* Header */}
      <header className={`bg-white dark:bg-gray-900 border-b sticky top-0 z-50 transition-shadow ${scrolled ? "shadow-lg" : "shadow-sm"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Image
                src="/images/fenifisc-logo.webp"
                alt="FENIFISC Logo"
                width={120}
                height={105}
                className="rounded-lg sm:w-[120px] sm:h-[105px] w-[80px] h-[70px] neon-logo-hover"
              />
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold text-blue-900 dark:text-blue-400">FENIFISC</h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Federación Nicaragüense de Físico Culturismo</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2 sm:flex-row sm:space-x-4 items-center w-full sm:w-auto">
              <Link href="/admin">
                <Button variant="outline" className="w-full sm:w-auto">Panel Administrativo</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-white dark:bg-blue-700 dark:hover:bg-blue-800">Registrarse como Atleta</Button>
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-2 sm:px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-blue-200 mb-4 sm:mb-6 fade-in-up">Sistema de Registro de Atletas y Competencias</h2>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 fade-in-up">
            Plataforma oficial para la inscripción de atletas y gestión de competencias de físico culturismo en
            Nicaragua
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center fade-in-up">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto px-6 sm:px-8 py-3 dark:bg-blue-700 dark:hover:bg-blue-800 btn-animate">
                Inscribirse como Atleta
              </Button>
            </Link>
            <Link href="/competitions">
              <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-transparent border-gray-300 dark:border-gray-600 dark:text-gray-100 btn-animate">
                Ver Competencias
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 sm:py-16 px-2 sm:px-4 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl sm:text-3xl font-bold text-center text-gray-900 dark:text-blue-200 mb-8 sm:mb-12 fade-in-up">Características del Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            <Card className="bg-white/30 dark:bg-gray-800/60 backdrop-blur-md text-center neon-card-hover">
              <CardHeader>
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-2 sm:mb-4" />
                <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-blue-200">Registro de Atletas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                  Sistema completo de registro con datos personales, documentos y categorías
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/30 dark:bg-gray-800/60 backdrop-blur-md text-center neon-card-hover">
              <CardHeader>
                <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-2 sm:mb-4" />
                <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-blue-200">Gestión de Competencias</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Creación y administración de competencias con diferentes categorías</CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/30 dark:bg-gray-800/60 backdrop-blur-md text-center neon-card-hover">
              <CardHeader>
                <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-2 sm:mb-4" />
                <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-blue-200">Calendario de Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Visualización de fechas importantes y cronograma de competencias</CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/30 dark:bg-gray-800/60 backdrop-blur-md text-center neon-card-hover">
              <CardHeader>
                <Database className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-2 sm:mb-4" />
                <CardTitle className="text-base sm:text-lg text-gray-900 dark:text-blue-200">Base de Datos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Gestión centralizada de atletas, resultados y estadísticas</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 dark:bg-blue-950 text-white py-8 mt-8">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 text-center">
          <div className="flex flex-col items-center justify-center space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4 mb-4">
            <Image src="/images/fenifisc-logo.webp" alt="FENIFISC Logo" width={66} height={58} className="w-[66px] h-[58px] rounded" />
            <h4 className="text-lg sm:text-xl font-bold text-white dark:text-blue-200">FENIFISC</h4>
          </div>
          <p className="text-blue-200 dark:text-blue-300 text-xs sm:text-base">Federación Nicaragüense de Físico Culturismo - Sistema Oficial de Registro</p>
          <p className="text-blue-300 dark:text-blue-400 text-xs sm:text-sm mt-2">© 2024 FENIFISC. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
