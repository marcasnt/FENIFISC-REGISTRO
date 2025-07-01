"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Calendar, MapPin, Users, Trophy, Clock, Eye, UserPlus, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

interface Competition {
  id: string
  name: string
  description?: string
  date: string
  location: string
  registration_deadline: string
  max_registrations: number
  created_at: string
  updated_at: string
  registrations_count?: number
  registered_athletes?: any[]
}

interface Category {
  id: string
  name: string
  description?: string
  gender: "male" | "female" | "both"
}

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const { toast } = useToast()
  const [scrolled, setScrolled] = useState(false)

  // Mapeo de categorías para mostrar nombres legibles
  const categoryNames: { [key: string]: string } = {
    "bodybuilding-65": "Bodybuilding hasta 65kg",
    "bodybuilding-70": "Bodybuilding hasta 70kg",
    "bodybuilding-75": "Bodybuilding hasta 75kg",
    "bodybuilding-80": "Bodybuilding hasta 80kg",
    "bodybuilding-85": "Bodybuilding hasta 85kg",
    "bodybuilding-85plus": "Bodybuilding más de 85kg",
    "mens-physique-174": "Men's Physique hasta 1.74m",
    "mens-physique-174plus": "Men's Physique más de 1.74m",
    "fisico-clasico-171": "Físico Clásico hasta 1.71m",
    "fisico-clasico-171plus": "Físico Clásico más de 1.71m",
    "classic-physique-171": "Classic Physique hasta 1.71m",
    "classic-physique-171plus": "Classic Physique más de 1.71m",
    "womens-physique": "Women's Physique",
    "bikini-alta": "Bikini Categoría Alta",
    "bikini-baja": "Bikini Categoría Baja",
    "body-fitness-alta": "Body Fitness Categoría Alta",
    "body-fitness-baja": "Body Fitness Categoría Baja",
    wellness: "Wellness",
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [competitionsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/competitions"),
        fetch("/api/categories"),
      ])

      if (competitionsResponse.ok) {
        const competitionsData = await competitionsResponse.json()
        setCompetitions(competitionsData.competitions || [])
      } else {
        throw new Error("Error al cargar competencias")
      }

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData.categories || [])
      } else {
        console.warn("No se pudieron cargar las categorías")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al cargar los datos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = async (competition: Competition) => {
    try {
      const response = await fetch(`/api/competitions/${competition.id}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedCompetition(data.competition)
        setShowDetailsDialog(true)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al cargar detalles")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al cargar detalles de la competencia",
        variant: "destructive",
      })
    }
  }

  const getCompetitionStatus = (competition: Competition) => {
    const today = new Date()
    const competitionDate = new Date(competition.date)
    const deadlineDate = new Date(competition.registration_deadline)

    if (competitionDate < today) {
      return { status: "finished", label: "Finalizada", color: "bg-gray-100 text-gray-800" }
    } else if (deadlineDate < today) {
      return { status: "closed", label: "Inscripciones Cerradas", color: "bg-orange-100 text-orange-800" }
    } else {
      return { status: "open", label: "Inscripciones Abiertas", color: "bg-green-100 text-green-800" }
    }
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getCategoryName = (categoryId: string): string => {
    return categoryNames[categoryId] || categoryId
  }

  const maleCategories = categories.filter((cat) => cat.gender === "male" || cat.gender === "both")
  const femaleCategories = categories.filter((cat) => cat.gender === "female" || cat.gender === "both")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className={`bg-white border-b sticky top-0 z-50 transition-shadow ${scrolled ? "shadow-lg" : "shadow-sm"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Image
                  src="/images/fenifisc-logo.webp"
                  alt="FENIFISC Logo"
                  width={120}
                  height={105}
                  className="rounded-lg sm:w-[120px] sm:h-[105px] w-[80px] h-[70px] neon-logo-hover"
                />
                <div>
                  <h1 className="text-xl font-bold text-blue-900">FENIFISC</h1>
                  <p className="text-sm text-gray-600">Competencias</p>
                </div>
              </div>
              <Link href="/">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Inicio
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

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
                <h1 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-400 fade-in-up">FENIFISC</h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Competencias</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2 sm:flex-row sm:space-x-4 items-center">
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto border-gray-300 dark:border-gray-600 dark:text-gray-100 btn-animate">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver al Inicio
                </Button>
              </Link>
              <ThemeToggle />
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-blue-200 mb-2 sm:mb-4 fade-in-up">Competencias FENIFISC</h1>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Descubre las próximas competencias de fisicoculturismo y fitness. Inscríbete y demuestra tu dedicación y
            talento.
          </p>
        </section>

        {/* Competitions Grid */}
        {competitions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <Trophy className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-blue-200 mb-2">No hay competencias disponibles</h3>
            <p className="text-gray-600 dark:text-gray-300">Las próximas competencias se anunciarán pronto.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {competitions.map((competition) => {
              const status = getCompetitionStatus(competition)
              const daysUntilDeadline = getDaysUntilDeadline(competition.registration_deadline)
              const registrationProgress = competition.registrations_count
                ? (competition.registrations_count / competition.max_registrations) * 100
                : 0

              return (
                <Card
                  key={competition.id}
                  className="neumorphic-select-card group text-center focus:outline-none"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg group-hover:text-blue-600 transition-colors text-gray-900 dark:text-blue-200">
                        {competition.name}
                      </CardTitle>
                      <Badge className={status.color}>{status.label}</Badge>
                    </div>
                    <CardDescription className="line-clamp-2 text-gray-600 dark:text-gray-300">{competition.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Información básica */}
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(competition.date)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4 mr-2" />
                        {competition.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="w-4 h-4 mr-2" />
                        Inscripciones hasta: {formatDate(competition.registration_deadline)}
                      </div>
                    </div>

                    {/* Contador de días */}
                    {status.status === "open" && daysUntilDeadline > 0 && (
                      <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{daysUntilDeadline}</div>
                          <div className="text-sm text-blue-600">
                            {daysUntilDeadline === 1 ? "día restante" : "días restantes"}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Progreso de inscripciones */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-1" />
                          Inscritos
                        </span>
                        <span className="font-medium">
                          {competition.registrations_count || 0} / {competition.max_registrations}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            registrationProgress >= 90
                              ? "bg-red-500"
                              : registrationProgress >= 70
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(registrationProgress, 100)}%` }}
                        ></div>
                      </div>
                      {registrationProgress >= 90 && (
                        <p className="text-xs text-red-600 dark:text-red-400 font-medium">¡Últimos cupos disponibles!</p>
                      )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(competition)}
                        className="flex-1 border-gray-300 dark:border-gray-600 dark:text-gray-100"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Más Detalles
                      </Button>
                      {status.status === "open" && (
                        <Link href="/register" className="flex-1">
                          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white btn-animate">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Inscribirse
                          </Button>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-full sm:max-w-4xl max-h-[80vh] overflow-y-auto p-2 sm:p-6 bg-white dark:bg-gray-900/95 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              {selectedCompetition?.name}
            </DialogTitle>
            <DialogDescription>Información completa de la competencia</DialogDescription>
          </DialogHeader>
          {selectedCompetition && (
            <div className="space-y-6">
              {/* Información General */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Información General</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium">Fecha:</span>
                        <span className="ml-2">{formatDate(selectedCompetition.date)}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium">Ubicación:</span>
                        <span className="ml-2">{selectedCompetition.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium">Límite de inscripción:</span>
                        <span className="ml-2">{formatDate(selectedCompetition.registration_deadline)}</span>
                      </div>
                    </div>
                  </div>

                  {selectedCompetition.description && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Descripción</h4>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedCompetition.description}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Estadísticas de Inscripción</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-800/80 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedCompetition.registrations_count || 0}
                        </div>
                        <div className="text-sm text-blue-600">Atletas Inscritos</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 dark:bg-green-800/80 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {selectedCompetition.max_registrations - (selectedCompetition.registrations_count || 0)}
                        </div>
                        <div className="text-sm text-green-600">Cupos Disponibles</div>
                      </div>
                    </div>
                  </div>

                  {/* Progreso visual */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Progreso de Inscripciones</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Ocupación</span>
                        <span>
                          {Math.round(
                            ((selectedCompetition.registrations_count || 0) / selectedCompetition.max_registrations) *
                              100,
                          )}
                          %
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              ((selectedCompetition.registrations_count || 0) / selectedCompetition.max_registrations) *
                                100,
                              100,
                            )}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categorías Disponibles */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Categorías Disponibles</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Categorías Masculinas */}
                  <div>
                    <h5 className="font-medium text-blue-600 mb-3 flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      Categorías Masculinas
                    </h5>
                    <div className="space-y-2">
                      {Object.entries(categoryNames)
                        .filter(
                          ([key]) =>
                            key.includes("bodybuilding") ||
                            key.includes("mens-physique") ||
                            key.includes("fisico-clasico") ||
                            key.includes("classic-physique"),
                        )
                        .map(([key, name]) => (
                          <div key={key} className="flex items-center p-2 bg-blue-50 dark:bg-blue-900/80 rounded text-sm">
                            <Trophy className="w-4 h-4 mr-2 text-blue-500" />
                            {name}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Categorías Femeninas */}
                  <div>
                    <h5 className="font-medium text-pink-600 mb-3 flex items-center">
                      <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
                      Categorías Femeninas
                    </h5>
                    <div className="space-y-2">
                      {Object.entries(categoryNames)
                        .filter(
                          ([key]) =>
                            key.includes("womens-physique") ||
                            key.includes("bikini") ||
                            key.includes("body-fitness") ||
                            key.includes("wellness"),
                        )
                        .map(([key, name]) => (
                          <div key={key} className="flex items-center p-2 bg-pink-50 dark:bg-pink-900/80 rounded text-sm">
                            <Trophy className="w-4 h-4 mr-2 text-pink-500" />
                            {name}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Atletas Inscritos */}
              {selectedCompetition.registered_athletes && selectedCompetition.registered_athletes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Atletas Inscritos</h4>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {selectedCompetition.registered_athletes.map((athlete, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded bg-gray-50 dark:bg-gray-800/80 text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/80 rounded-full flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-200">
                              {athlete.first_name?.[0]}
                              {athlete.last_name?.[0]}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {athlete.first_name} {athlete.last_name}
                            </span>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-200">{athlete.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botones de Acción */}
              <div className="flex gap-3 pt-4 border-t">
                {getCompetitionStatus(selectedCompetition).status === "open" && (
                  <Link href="/register" className="flex-1">
                    <Button className="w-full">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Inscribirse Ahora
                    </Button>
                  </Link>
                )}
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
