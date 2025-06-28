// Backup del archivo original de /admin/page.tsx
// Fecha de backup: 2024-04-01
// Si necesitas restaurar, reemplaza el contenido de page.tsx con este archivo.

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
        const athleteData = await response.json()
        setSelectedAthlete(athleteData.athlete)
        setShowAthleteDetailsDialog(true)
      } else {
        throw new Error("Error al cargar detalles del atleta")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al cargar detalles del atleta",
        variant: "destructive",
      })
    }
  }

  // ... existing code ... 
} 