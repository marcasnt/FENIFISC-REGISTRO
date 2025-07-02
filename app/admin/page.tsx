"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Calendar,
  Users,
  Trophy,
  Eye,
  Edit,
  Trash2,
  Plus,
  UserCheck,
  UserX,
  ArrowLeft,
  MapPin,
  Clock,
  User,
  Mail,
  Phone,
  CreditCard,
  Home,
  FileText,
  X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import DashboardStats from "./DashboardStats"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { saveAs } from "file-saver"
import * as XLSX from "xlsx"

interface Athlete {
  id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  cedula: string
  address?: string
  cedula_front_url?: string
  cedula_back_url?: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at: string
  categories?: string[]
  competitions?: any[]
}

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

export default function AdminPage() {
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

  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null)
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null)
  const [editingCompetition, setEditingCompetition] = useState<Competition | null>(null)
  const [newCompetition, setNewCompetition] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    registration_deadline: "",
    max_registrations: 100,
  })

  // Estados para controlar los diálogos
  const [showNewCompetitionDialog, setShowNewCompetitionDialog] = useState(false)
  const [showEditCompetitionDialog, setShowEditCompetitionDialog] = useState(false)
  const [showAthleteDetailsDialog, setShowAthleteDetailsDialog] = useState(false)
  const [showCompetitionDetailsDialog, setShowCompetitionDetailsDialog] = useState(false)
  const [showAllAthletesDialog, setShowAllAthletesDialog] = useState(false)
  const [showAllCompetitionsDialog, setShowAllCompetitionsDialog] = useState(false)

  const { toast } = useToast()

  const [scrolled, setScrolled] = useState(false)

  const router = useRouter()

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
      const [athletesResponse, competitionsResponse] = await Promise.all([
        fetch("/api/athletes"),
        fetch("/api/competitions"),
      ])

      if (athletesResponse.ok) {
        const athletesData = await athletesResponse.json()
        setAthletes(athletesData.athletes || [])
      } else {
        throw new Error("Error al cargar atletas")
      }

      if (competitionsResponse.ok) {
        const competitionsData = await competitionsResponse.json()
        setCompetitions(competitionsData.competitions || [])
      } else {
        throw new Error("Error al cargar competencias")
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

  const handleApproveAthlete = async (athleteId: string) => {
    try {
      // Buscar el atleta para obtener su email y nombre
      const athlete = athletes.find((a) => a.id === athleteId)
      const response = await fetch(`/api/athletes/${athleteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      })

      if (response.ok) {
        toast({
          title: "Atleta aprobado",
          description: "El atleta ha sido aprobado exitosamente",
        })
        // Enviar correo de notificación si se encontró el atleta
        if (athlete) {
          const emailRes = await fetch("/api/send-approval-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: athlete.email, name: `${athlete.first_name} ${athlete.last_name}`, status: "approved" }),
          })
          if (emailRes.ok) {
            toast({
              title: "Correo enviado",
              description: `Se notificó a ${athlete.email}`,
            })
          } else {
            toast({
              title: "Error al enviar correo",
              description: `No se pudo notificar a ${athlete.email}`,
              variant: "destructive",
            })
          }
        }
        await loadData()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al aprobar atleta")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al aprobar el atleta",
        variant: "destructive",
      })
    }
  }

  const handleRejectAthlete = async (athleteId: string) => {
    try {
      // Buscar el atleta para obtener su email y nombre
      const athlete = athletes.find((a) => a.id === athleteId)
      const response = await fetch(`/api/athletes/${athleteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      })

      if (response.ok) {
        toast({
          title: "Atleta rechazado",
          description: "El atleta ha sido rechazado",
        })
        // Enviar correo de notificación si se encontró el atleta
        if (athlete) {
          const emailRes = await fetch("/api/send-approval-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: athlete.email, name: `${athlete.first_name} ${athlete.last_name}`, status: "rejected" }),
          })
          if (emailRes.ok) {
            toast({
              title: "Correo enviado",
              description: `Se notificó a ${athlete.email}`,
            })
          } else {
            toast({
              title: "Error al enviar correo",
              description: `No se pudo notificar a ${athlete.email}`,
              variant: "destructive",
            })
          }
        }
        await loadData()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al rechazar atleta")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al rechazar el atleta",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAthlete = async (athleteId: string) => {
    try {
      const response = await fetch(`/api/athletes/${athleteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Atleta eliminado",
          description: "El atleta ha sido eliminado exitosamente",
        })
        await loadData()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al eliminar atleta")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar el atleta",
        variant: "destructive",
      })
    }
  }

  const handleViewAthleteDetails = async (athlete: Athlete) => {
    try {
      const response = await fetch(`/api/athletes/${athlete.id}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedAthlete(data.athlete)
        setShowAthleteDetailsDialog(true)
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al cargar detalles")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al cargar detalles del atleta",
        variant: "destructive",
      })
    }
  }

  const handleCreateCompetition = async () => {
    try {
      if (
        !newCompetition.name ||
        !newCompetition.date ||
        !newCompetition.location ||
        !newCompetition.registration_deadline
      ) {
        toast({
          title: "Error",
          description: "Complete todos los campos obligatorios",
          variant: "destructive",
        })
        return
      }

      const response = await fetch("/api/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCompetition),
      })

      if (response.ok) {
        toast({
          title: "Competencia creada",
          description: "La competencia ha sido creada exitosamente",
        })
        setNewCompetition({
          name: "",
          description: "",
          date: "",
          location: "",
          registration_deadline: "",
          max_registrations: 100,
        })
        setShowNewCompetitionDialog(false)
        await loadData()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al crear competencia")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear la competencia",
        variant: "destructive",
      })
    }
  }

  const handleEditCompetition = (competition: Competition) => {
    setEditingCompetition({ ...competition })
    setShowEditCompetitionDialog(true)
  }

  const handleSaveEditedCompetition = async () => {
    if (!editingCompetition) return

    try {
      const response = await fetch(`/api/competitions/${editingCompetition.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editingCompetition.name,
          description: editingCompetition.description,
          date: editingCompetition.date,
          location: editingCompetition.location,
          registration_deadline: editingCompetition.registration_deadline,
          max_registrations: editingCompetition.max_registrations,
        }),
      })

      if (response.ok) {
        toast({
          title: "Competencia actualizada",
          description: "La competencia ha sido actualizada exitosamente",
        })
        setShowEditCompetitionDialog(false)
        setEditingCompetition(null)
        await loadData()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al actualizar competencia")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar la competencia",
        variant: "destructive",
      })
    }
  }

  const handleViewCompetitionDetails = async (competition: Competition) => {
    try {
      const response = await fetch(`/api/competitions/${competition.id}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedCompetition(data.competition)
        setShowCompetitionDetailsDialog(true)
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

  const handleDeleteCompetition = async (competitionId: string) => {
    try {
      const response = await fetch(`/api/competitions/${competitionId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Competencia eliminada",
          description: "La competencia ha sido eliminada exitosamente",
        })
        await loadData()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al eliminar competencia")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al eliminar la competencia",
        variant: "destructive",
      })
    }
  }

  const getNextCompetition = () => {
    const today = new Date()
    const upcomingCompetitions = competitions
      .filter((comp) => new Date(comp.date) > today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    return upcomingCompetitions[0] || null
  }

  const getDaysUntilNextCompetition = () => {
    const nextComp = getNextCompetition()
    if (!nextComp) return null

    const today = new Date()
    const compDate = new Date(nextComp.date)
    const diffTime = compDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  const getCategoryName = (categoryId: string): string => {
    return categoryNames[categoryId] || categoryId
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("fenifisc_admin")
    router.push("/")
  }

  // Función para exportar atletas a Excel
  const exportAthletesToExcel = () => {
    if (!athletes.length) return;
    const headers = [
      "Nombre",
      "Apellido",
      "Email",
      "Teléfono",
      "Cédula",
      "Dirección",
      "Estado",
      "Categorías",
      "Fecha de Registro"
    ];
    const rows = athletes.map((a) => [
      a.first_name,
      a.last_name,
      a.email,
      a.phone || "",
      a.cedula,
      a.address || "",
      a.status,
      (a.categories || []).join("; "),
      formatDate(a.created_at)
    ]);
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Atletas");
    XLSX.writeFile(wb, `atletas_fenifisc_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // Función para exportar atletas inscritos en una competencia
  const exportRegisteredAthletesToExcel = (competition: Competition) => {
    if (!competition || !competition.registered_athletes || !competition.registered_athletes.length) return;
    const headers = [
      "Nombre",
      "Apellido",
      "Email",
      "Teléfono",
      "Cédula",
      "Dirección",
      "Estado",
      "Categorías",
      "Fecha de Registro"
    ];
    const rows = competition.registered_athletes.map((a: Athlete) => [
      a.first_name || "No proporcionado",
      a.last_name || "No proporcionado",
      a.email || "No proporcionado",
      a.phone || "No proporcionado",
      a.cedula || "No proporcionado",
      a.address || "No proporcionado",
      a.status || "No proporcionado",
      (a.categories && a.categories.length > 0)
        ? a.categories.map((catId: string) => {
            const cat = categoryNames[catId];
            return cat ? cat : catId;
          }).join(", ")
        : "No proporcionado",
      (a.created_at && !isNaN(Date.parse(a.created_at)))
        ? formatDate(a.created_at)
        : "No proporcionado"
    ]);
    // Agregar título y fecha como filas arriba
    const titleRow = [
      `Competencia: ${competition.name}`
    ];
    const dateRow = [
      `Fecha: ${formatDate(competition.date)}`
    ];
    const ws = XLSX.utils.aoa_to_sheet([
      titleRow,
      dateRow,
      [], // fila vacía
      headers,
      ...rows
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "AtletasInscritos");
    XLSX.writeFile(wb, `atletas_competencia_${competition.name.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando panel administrativo...</p>
        </div>
      </div>
    )
  }

  const pendingAthletes = athletes.filter((a) => a.status === "pending")
  const approvedAthletes = athletes.filter((a) => a.status === "approved")
  const nextCompetition = getNextCompetition()
  const daysUntilNext = getDaysUntilNextCompetition()

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-gradient-dark">
      {/* Header */}
      <header className={`bg-white dark:bg-gray-900 border-b sticky top-0 z-50 transition-shadow ${scrolled ? "shadow-lg" : "shadow-sm"} fade-in-up`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full">
              <Image
                src="/images/fenifisc-logo.webp"
                alt="FENIFISC Logo"
                width={120}
                height={105}
                className="rounded-lg sm:w-[120px] sm:h-[105px] w-[80px] h-[70px] neon-logo-hover mx-auto sm:mx-0"
              />
              <div className="text-center sm:text-left w-full">
                <h1 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-400 fade-in-up">FENIFISC</h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Panel Administrativo</p>
              </div>
            </div>
            <nav className="flex flex-col gap-2 sm:flex-row sm:space-x-4 items-center w-full sm:w-auto">
              <ThemeToggle />
              <Button variant="destructive" className="w-full sm:w-auto" onClick={handleLogout}>
                Cerrar sesión
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8 w-full">
        {/* Dashboard de estadísticas */}
        <DashboardStats athletes={athletes} categoryNames={categoryNames} />
        {/* Estadísticas - Tarjetas clickeables */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8 w-full">
          <Card
            className="cursor-pointer neumorphic-select-card focus:outline-none w-full"
            onClick={() => setShowAllAthletesDialog(true)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-blue-200">Total Atletas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-blue-200">{athletes.length}</div>
              <p className="text-xs text-muted-foreground dark:text-gray-300">
                {pendingAthletes.length} pendientes • {approvedAthletes.length} aprobados
              </p>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer neumorphic-select-card focus:outline-none w-full"
            onClick={() => setShowAllCompetitionsDialog(true)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-blue-200">Total Competencias</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-blue-200">{competitions.length}</div>
              <p className="text-xs text-muted-foreground dark:text-gray-300">Competencias anunciadas</p>
            </CardContent>
          </Card>

          <Card className="neumorphic-select-card focus:outline-none w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 dark:text-blue-200">Próxima Competencia</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-blue-200">{daysUntilNext !== null ? `${daysUntilNext} días` : "N/A"}</div>
              <p className="text-xs text-muted-foreground dark:text-gray-300">
                {nextCompetition ? nextCompetition.name : "No hay competencias programadas"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para alternar entre Atletas y Competencias */}
        <Tabs defaultValue="athletes" className="w-full">
          <TabsList className="mb-4 flex flex-row gap-2 w-full overflow-x-auto rounded-lg bg-gray-100 dark:bg-gray-800 p-1">
            <TabsTrigger value="athletes" className="flex-1 min-w-[140px] py-3 text-base rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">Gestión de Atletas</TabsTrigger>
            <TabsTrigger value="competitions" className="flex-1 min-w-[140px] py-3 text-base rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all">Gestión de Competencias</TabsTrigger>
          </TabsList>

          <TabsContent value="athletes">
            {/* Gestión de Atletas */}
            <div className="flex justify-end mb-2">
              <Button variant="outline" onClick={exportAthletesToExcel} className="text-blue-700 border-blue-400">
                Exportar Atletas (Excel)
              </Button>
            </div>
            <Card className="mb-8 bg-white/30 dark:bg-gray-800/60 backdrop-blur-md border border-white/40 dark:border-gray-700 shadow-lg w-full overflow-x-auto px-2 sm:px-6 py-4">
              <CardHeader>
                <CardTitle className="dark:text-blue-200">Gestión de Atletas</CardTitle>
                <CardDescription>Administra las inscripciones de atletas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {athletes.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No hay atletas registrados</p>
                  ) : (
                    athletes.slice(0, 5).map((athlete) => (
                      <div
                        key={athlete.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 neumorphic-select-card focus:outline-none"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">
                            {athlete.first_name} {athlete.last_name}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">{athlete.email}</p>
                          <p className="text-sm text-gray-500 truncate">Cédula: {athlete.cedula}</p>
                          {athlete.categories && athlete.categories.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {athlete.categories.map((categoryId, index) => (
                                <Badge key={index} variant="outline" className="bg-white/80 dark:bg-gray-800/80 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700 whitespace-nowrap">
                                  {getCategoryName(categoryId)}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-row flex-wrap items-center gap-2 mt-2 sm:mt-0">
                          {athlete.status === "approved" && (
                            <Badge variant="default" className="whitespace-nowrap bg-green-600 text-white border-none">Aprobado</Badge>
                          )}
                          {athlete.status === "rejected" && (
                            <Badge variant="destructive" className="whitespace-nowrap bg-red-600 text-white border-none">Rechazado</Badge>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAthleteDetails(athlete)}
                            title="Ver detalles"
                            className="btn-animate"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          {athlete.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleApproveAthlete(athlete.id)}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50 btn-animate"
                                title="Aprobar atleta"
                              >
                                <UserCheck className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectAthlete(athlete.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 btn-animate"
                                title="Rechazar atleta"
                              >
                                <UserX className="w-4 h-4" />
                              </Button>
                            </>
                          )}

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent btn-animate"
                                title="Eliminar atleta"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar atleta?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará permanentemente el atleta{" "}
                                  {athlete.first_name} {athlete.last_name} y todos sus datos asociados.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteAthlete(athlete.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))
                  )}
                  {athletes.length > 5 && (
                    <div className="text-center pt-4">
                      <Button variant="outline" onClick={() => setShowAllAthletesDialog(true)}>
                        Ver todos los atletas ({athletes.length})
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitions">
            {/* Gestión de Competencias */}
            <Card className="bg-white/30 dark:bg-gray-800/60 backdrop-blur-md border border-white/40 dark:border-gray-700 shadow-lg w-full overflow-x-auto px-2 sm:px-6 py-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="dark:text-blue-200">Gestión de Competencias</CardTitle>
                    <CardDescription>Administra las competencias de FENIFISC</CardDescription>
                  </div>
                  <Dialog open={showNewCompetitionDialog} onOpenChange={setShowNewCompetitionDialog}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Nueva Competencia
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Crear Nueva Competencia</DialogTitle>
                        <DialogDescription>Complete los datos de la nueva competencia</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nombre *</Label>
                          <Input
                            id="name"
                            value={newCompetition.name}
                            onChange={(e) => setNewCompetition((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Nombre de la competencia"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="date">Fecha *</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newCompetition.date}
                            onChange={(e) => setNewCompetition((prev) => ({ ...prev, date: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Ubicación *</Label>
                          <Input
                            id="location"
                            value={newCompetition.location}
                            onChange={(e) => setNewCompetition((prev) => ({ ...prev, location: e.target.value }))}
                            placeholder="Ciudad, País"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="deadline">Fecha límite de inscripción *</Label>
                          <Input
                            id="deadline"
                            type="date"
                            value={newCompetition.registration_deadline}
                            onChange={(e) =>
                              setNewCompetition((prev) => ({ ...prev, registration_deadline: e.target.value }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="max">Máximo de inscripciones</Label>
                          <Input
                            id="max"
                            type="number"
                            value={newCompetition.max_registrations}
                            onChange={(e) =>
                              setNewCompetition((prev) => ({ ...prev, max_registrations: Number.parseInt(e.target.value) }))
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Descripción</Label>
                          <Textarea
                            id="description"
                            value={newCompetition.description}
                            onChange={(e) => setNewCompetition((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Descripción de la competencia"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowNewCompetitionDialog(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={handleCreateCompetition}>Crear Competencia</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competitions.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No hay competencias creadas</p>
                  ) : (
                    competitions.slice(0, 5).map((competition) => (
                      <div
                        key={competition.id}
                        className="flex items-center justify-between p-4 neumorphic-select-card focus:outline-none"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium">{competition.name}</h3>
                          <p className="text-sm text-gray-600">{formatDate(competition.date)}</p>
                          <p className="text-sm text-gray-500">{competition.location}</p>
                          <p className="text-xs text-gray-400">
                            Límite inscripción: {formatDate(competition.registration_deadline)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewCompetitionDetails(competition)}
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCompetition(competition)}
                            title="Editar competencia"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                                title="Eliminar competencia"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar competencia?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. Se eliminará permanentemente la competencia{" "}
                                  {competition.name} y todas las inscripciones asociadas.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCompetition(competition.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))
                  )}
                  {competitions.length > 5 && (
                    <div className="text-center pt-4">
                      <Button variant="outline" onClick={() => setShowAllCompetitionsDialog(true)}>
                        Ver todas las competencias ({competitions.length})
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal: Detalles del Atleta */}
      <Dialog open={showAthleteDetailsDialog} onOpenChange={setShowAthleteDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900/95 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Detalles del Atleta
            </DialogTitle>
            <DialogDescription>Información detallada del atleta seleccionado.</DialogDescription>
          </DialogHeader>
          {selectedAthlete && (
            <div className="space-y-6">
              {/* Información Personal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Nombre:</span>
                    <span>
                      {selectedAthlete.first_name} {selectedAthlete.last_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Email:</span>
                    <span>{selectedAthlete.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Teléfono:</span>
                    <span>{selectedAthlete.phone || "No proporcionado"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Cédula:</span>
                    <span>{selectedAthlete.cedula}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Dirección:</span>
                    <span>{selectedAthlete.address || "No proporcionada"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Estado:</span>
                    <Badge
                      variant={
                        selectedAthlete.status === "approved"
                          ? "default"
                          : selectedAthlete.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {selectedAthlete.status === "approved"
                        ? "Aprobado"
                        : selectedAthlete.status === "pending"
                          ? "Pendiente"
                          : "Rechazado"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Registrado:</span>
                    <span>{formatDate(selectedAthlete.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Categorías */}
              {selectedAthlete.categories && selectedAthlete.categories.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Categorías:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedAthlete.categories.map((categoryId, index) => (
                      <Badge key={index} variant="outline" className="bg-white/80 dark:bg-gray-800/80 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700">
                        {getCategoryName(categoryId)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Competencias */}
              {selectedAthlete.competitions && selectedAthlete.competitions.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Competencias Inscritas:</h4>
                  <div className="space-y-2">
                    {selectedAthlete.competitions.map((comp, index) => (
                      <div key={index} className="p-2 bg-gray-50 dark:bg-gray-800/70 rounded text-gray-900 dark:text-gray-100">
                        <span className="font-medium">{comp.name}</span>
                        <span className="text-sm text-gray-600 ml-2">{formatDate(comp.date)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Documentos */}
              <div>
                <h4 className="font-medium mb-2">Documentos:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Cédula (Frontal):</p>
                    <Image
                      src={selectedAthlete.cedula_front_url || "/placeholder.svg"}
                      alt="Cédula frontal"
                      width={200}
                      height={120}
                      className="border rounded bg-white dark:bg-gray-800"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Cédula (Posterior):</p>
                    <Image
                      src={selectedAthlete.cedula_back_url || "/placeholder.svg"}
                      alt="Cédula posterior"
                      width={200}
                      height={120}
                      className="border rounded bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Acciones */}
              {selectedAthlete.status === "pending" && (
                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                  <Button
                    className="w-full sm:w-auto"
                    onClick={() => {
                      handleApproveAthlete(selectedAthlete.id)
                      setShowAthleteDetailsDialog(false)
                    }}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Aprobar Atleta
                  </Button>
                  <Button
                    className="w-full sm:w-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                    variant="outline"
                    onClick={() => {
                      handleRejectAthlete(selectedAthlete.id)
                      setShowAthleteDetailsDialog(false)
                    }}
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Rechazar Atleta
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal: Detalles de la Competencia */}
      <Dialog open={showCompetitionDetailsDialog} onOpenChange={setShowCompetitionDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900/95 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Detalles de la Competencia
            </DialogTitle>
            <DialogDescription>Información completa de la competencia seleccionada.</DialogDescription>
          </DialogHeader>
          {selectedCompetition && (
            <div className="space-y-6">
              {/* Información de la Competencia */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium">Nombre:</span>
                    <p className="text-lg">{selectedCompetition.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Fecha:</span>
                    <span>{formatDate(selectedCompetition.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Ubicación:</span>
                    <span>{selectedCompetition.location}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Límite de inscripción:</span>
                    <span>{formatDate(selectedCompetition.registration_deadline)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">Máximo inscripciones:</span>
                    <span>{selectedCompetition.max_registrations}</span>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              {selectedCompetition.description && (
                <div>
                  <h4 className="font-medium mb-2">Descripción:</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedCompetition.description}</p>
                </div>
              )}

              {/* Estadísticas */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded">
                  <div className="text-2xl font-bold text-blue-600">{selectedCompetition.registrations_count || 0}</div>
                  <div className="text-sm text-blue-600">Atletas Inscritos</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedCompetition.max_registrations - (selectedCompetition.registrations_count || 0)}
                  </div>
                  <div className="text-sm text-green-600">Cupos Disponibles</div>
                </div>
              </div>

              {/* Atletas Inscritos */}
              {selectedCompetition.registered_athletes && selectedCompetition.registered_athletes.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Atletas Inscritos:</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedCompetition.registered_athletes.map((athlete, index) => (
                      <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-2 rounded bg-gray-50 dark:bg-gray-800/80 text-gray-900 dark:text-white">
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-gray-900 dark:text-white">{athlete.first_name} {athlete.last_name}</span>
                          <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">{athlete.email}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Estado: {athlete.status}</span>
                        </div>
                        <div className="flex flex-row flex-wrap items-center gap-2">
                          {athlete.status === "approved" && (
                            <span className="inline-block px-3 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">Aprobado</span>
                          )}
                          {athlete.status === "rejected" && (
                            <span className="inline-block px-3 py-1 rounded-full bg-red-600 text-white text-xs font-semibold">Rechazado</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Botón de exportar Excel, responsivo y visible solo si hay atletas */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button
                      className="w-full sm:w-auto"
                      variant="outline"
                      onClick={() => exportRegisteredAthletesToExcel(selectedCompetition)}
                    >
                      Exportar Atletas Inscritos (Excel)
                    </Button>
                  </div>
                </div>
              )}

              {/* Acciones */}
              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setShowCompetitionDetailsDialog(false)
                    handleEditCompetition(selectedCompetition)
                  }}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Competencia
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal: Editar Competencia */}
      <Dialog open={showEditCompetitionDialog} onOpenChange={setShowEditCompetitionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Competencia</DialogTitle>
            <DialogDescription>Modifique los datos de la competencia seleccionada.</DialogDescription>
            <DialogDescription>Modifique los datos de la competencia</DialogDescription>
          </DialogHeader>
          {editingCompetition && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nombre *</Label>
                <Input
                  id="edit-name"
                  value={editingCompetition.name}
                  onChange={(e) => setEditingCompetition((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                  placeholder="Nombre de la competencia"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-date">Fecha *</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editingCompetition.date}
                  onChange={(e) => setEditingCompetition((prev) => (prev ? { ...prev, date: e.target.value } : null))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Ubicación *</Label>
                <Input
                  id="edit-location"
                  value={editingCompetition.location}
                  onChange={(e) =>
                    setEditingCompetition((prev) => (prev ? { ...prev, location: e.target.value } : null))
                  }
                  placeholder="Ciudad, País"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-deadline">Fecha límite de inscripción *</Label>
                <Input
                  id="edit-deadline"
                  type="date"
                  value={editingCompetition.registration_deadline}
                  onChange={(e) =>
                    setEditingCompetition((prev) => (prev ? { ...prev, registration_deadline: e.target.value } : null))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-max">Máximo de inscripciones</Label>
                <Input
                  id="edit-max"
                  type="number"
                  value={editingCompetition.max_registrations}
                  onChange={(e) =>
                    setEditingCompetition((prev) =>
                      prev ? { ...prev, max_registrations: Number.parseInt(e.target.value) } : null,
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Descripción</Label>
                <Textarea
                  id="edit-description"
                  value={editingCompetition.description || ""}
                  onChange={(e) =>
                    setEditingCompetition((prev) => (prev ? { ...prev, description: e.target.value } : null))
                  }
                  placeholder="Descripción de la competencia"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowEditCompetitionDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEditedCompetition}>Guardar Cambios</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal: Todos los Atletas */}
      <Dialog open={showAllAthletesDialog} onOpenChange={setShowAllAthletesDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Todos los Atletas ({athletes.length})
            </DialogTitle>
            <DialogDescription>Listado completo de atletas registrados.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {athletes.map((athlete) => (
              <div
                key={athlete.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 neumorphic-select-card focus:outline-none"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">
                    {athlete.first_name} {athlete.last_name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">{athlete.email}</p>
                  <p className="text-sm text-gray-500 truncate">Cédula: {athlete.cedula}</p>
                  {athlete.categories && athlete.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {athlete.categories.map((categoryId, index) => (
                        <Badge key={index} variant="outline" className="bg-white/80 dark:bg-gray-800/80 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700 whitespace-nowrap">
                          {getCategoryName(categoryId)}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-row flex-wrap items-center gap-2 mt-2 sm:mt-0">
                  {athlete.status === "approved" && (
                    <Badge variant="default" className="whitespace-nowrap bg-green-600 text-white border-none">Aprobado</Badge>
                  )}
                  {athlete.status === "rejected" && (
                    <Badge variant="destructive" className="whitespace-nowrap bg-red-600 text-white border-none">Rechazado</Badge>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAllAthletesDialog(false)
                      handleViewAthleteDetails(athlete)
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  {athlete.status === "pending" && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApproveAthlete(athlete.id)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 btn-animate"
                      >
                        <UserCheck className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRejectAthlete(athlete.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 btn-animate"
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                    </>
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent btn-animate"
                        title="Eliminar atleta"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar atleta?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Se eliminará permanentemente el atleta{" "}
                          {athlete.first_name} {athlete.last_name} y todos sus datos asociados.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteAthlete(athlete.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Todas las Competencias */}
      <Dialog open={showAllCompetitionsDialog} onOpenChange={setShowAllCompetitionsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Todas las Competencias ({competitions.length})
            </DialogTitle>
            <DialogDescription>Listado completo de competencias creadas.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {competitions.map((competition) => (
              <div
                key={competition.id}
                className="flex items-center justify-between p-4 neumorphic-select-card focus:outline-none"
              >
                <div className="flex-1">
                  <h3 className="font-medium">{competition.name}</h3>
                  <p className="text-sm text-gray-600">{formatDate(competition.date)}</p>
                  <p className="text-sm text-gray-500">{competition.location}</p>
                  <p className="text-xs text-gray-400">
                    Límite: {formatDate(competition.registration_deadline)} • Máx: {competition.max_registrations}{" "}
                    atletas
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAllCompetitionsDialog(false)
                      handleViewCompetitionDetails(competition)
                    }}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAllCompetitionsDialog(false)
                      handleEditCompetition(competition)
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
