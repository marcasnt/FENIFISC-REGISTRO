import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Trophy, Calendar, Database } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="/images/fenifisc-logo.webp"
                alt="FENIFISC Logo"
                width={60}
                height={60}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-blue-900">FENIFISC</h1>
                <p className="text-sm text-gray-600">Federación Nicaragüense de Físico Culturismo</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <Link href="/admin">
                <Button variant="outline">Panel Administrativo</Button>
              </Link>
              <Link href="/register">
                <Button className="bg-blue-600 hover:bg-blue-700">Registrarse como Atleta</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Sistema de Registro de Atletas y Competencias</h2>
          <p className="text-xl text-gray-600 mb-8">
            Plataforma oficial para la inscripción de atletas y gestión de competencias de físico culturismo en
            Nicaragua
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                Inscribirse como Atleta
              </Button>
            </Link>
            <Link href="/competitions">
              <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
                Ver Competencias
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Características del Sistema</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Registro de Atletas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sistema completo de registro con datos personales, documentos y categorías
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Trophy className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Gestión de Competencias</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Creación y administración de competencias con diferentes categorías</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Calendar className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Calendario de Eventos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Visualización de fechas importantes y cronograma de competencias</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Database className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Base de Datos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Gestión centralizada de atletas, resultados y estadísticas</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <Image src="/images/fenifisc-logo.webp" alt="FENIFISC Logo" width={40} height={40} className="rounded" />
            <h4 className="text-xl font-bold">FENIFISC</h4>
          </div>
          <p className="text-blue-200">Federación Nicaragüense de Físico Culturismo - Sistema Oficial de Registro</p>
          <p className="text-blue-300 text-sm mt-2">© 2024 FENIFISC. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
