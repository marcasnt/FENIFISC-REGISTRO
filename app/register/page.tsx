"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Calendar, MapPin, Users, Trophy, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { ThemeToggle } from "@/components/theme-toggle"

interface Competition {
  id: string
  name: string
  date: string
  location: string
  registration_deadline: string
  max_registrations: number
  status: string
}

interface Category {
  id: string
  name: string
  description?: string
  gender: "male" | "female" | "both"
}

// Paso 1: Información personal
function StepPersonalInfo({ formData, setFormData, onNext }: any) {
  // ...campos de información personal...
  return (
    <div>
      {/* Aquí van los inputs de nombre, apellido, email, etc. */}
      <Button onClick={onNext}>Siguiente</Button>
    </div>
  )
}

// Paso 2: Subida de documentos
function StepDocuments({ formData, setFormData, onNext, onBack }: any) {
  // ...inputs para subir documentos...
  return (
    <div>
      {/* Inputs para cedulaFront y cedulaBack */}
      <Button onClick={onBack}>Atrás</Button>
      <Button onClick={onNext}>Siguiente</Button>
    </div>
  )
}

// Paso 3: Selección de categoría
function StepCategory({ formData, setFormData, onNext, onBack, categories }: any) {
  // ...checkboxes de categorías...
  return (
    <div>
      {/* Listado de categorías */}
      <Button onClick={onBack}>Atrás</Button>
      <Button onClick={onNext}>Siguiente</Button>
    </div>
  )
}

// Paso 4: Selección de competencia
function StepCompetition({ formData, setFormData, onNext, onBack, competitions }: any) {
  // ...checkboxes de competencias...
  return (
    <div>
      {/* Listado de competencias */}
      <Button onClick={onBack}>Atrás</Button>
      <Button onClick={onNext}>Siguiente</Button>
    </div>
  )
}

// Paso 5: Revisión y confirmación
function StepReview({ formData, onBack, onSubmit }: any) {
  // ...mostrar resumen de datos...
  return (
    <div>
      {/* Resumen de datos ingresados */}
      <Button onClick={onBack}>Atrás</Button>
      <Button onClick={onSubmit}>Confirmar y Enviar</Button>
    </div>
  )
}

// Barra de progreso visual
function StepProgressBar({ currentStep }: { currentStep: number }) {
  const steps = [
    "Información personal",
    "Documentos",
    "Categoría",
    "Competencia",
    "Revisión"
  ];
  return (
    <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
      {steps.map((label, idx) => (
        <div key={label} style={{ flex: 1, textAlign: 'center' }}>
          <div style={{
            height: 6,
            background: idx <= currentStep ? '#6366f1' : '#e5e7eb',
            borderRadius: 4,
            marginBottom: 4
          }} />
          <span style={{ fontSize: 12, color: idx === currentStep ? '#6366f1' : '#6b7280' }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

export default function RegisterPage() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cedula: "",
    address: "",
    categories: [] as string[],
    competitions: [] as string[],
    cedulaFront: null as File | null,
    cedulaBack: null as File | null,
  })
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()
  const [scrolled, setScrolled] = useState(false)

  // Categorías oficiales de FENIFISC según IFBB
  const categories = {
    male: [
      { id: "bodybuilding-65", name: "Bodybuilding hasta 65kg", description: "Categoría masculina hasta 65kg" },
      { id: "bodybuilding-70", name: "Bodybuilding hasta 70kg", description: "Categoría masculina hasta 70kg" },
      { id: "bodybuilding-75", name: "Bodybuilding hasta 75kg", description: "Categoría masculina hasta 75kg" },
      { id: "bodybuilding-80", name: "Bodybuilding hasta 80kg", description: "Categoría masculina hasta 80kg" },
      { id: "bodybuilding-85", name: "Bodybuilding hasta 85kg", description: "Categoría masculina hasta 85kg" },
      { id: "bodybuilding-85plus", name: "Bodybuilding más de 85kg", description: "Categoría masculina más de 85kg" },
      {
        id: "mens-physique-174",
        name: "Men's Physique hasta 1.74m",
        description: "Categoría masculina hasta 1.74m de altura",
      },
      {
        id: "mens-physique-174plus",
        name: "Men's Physique más de 1.74m",
        description: "Categoría masculina más de 1.74m de altura",
      },
      {
        id: "fisico-clasico-171",
        name: "Físico Clásico hasta 1.71m",
        description: "Categoría masculina hasta 1.71m de altura",
      },
      {
        id: "fisico-clasico-171plus",
        name: "Físico Clásico más de 1.71m",
        description: "Categoría masculina más de 1.71m de altura",
      },
      {
        id: "classic-physique-171",
        name: "Classic Physique hasta 1.71m",
        description: "Categoría masculina hasta 1.71m de altura",
      },
      {
        id: "classic-physique-171plus",
        name: "Classic Physique más de 1.71m",
        description: "Categoría masculina más de 1.71m de altura",
      },
    ],
    female: [
      { id: "womens-physique", name: "Women's Physique", description: "Única categoría femenina" },
      { id: "bikini-alta", name: "Bikini Categoría Alta", description: "Categoría femenina bikini alta" },
      { id: "bikini-baja", name: "Bikini Categoría Baja", description: "Categoría femenina bikini baja" },
      {
        id: "body-fitness-alta",
        name: "Body Fitness Categoría Alta",
        description: "Categoría femenina body fitness alta",
      },
      {
        id: "body-fitness-baja",
        name: "Body Fitness Categoría Baja",
        description: "Categoría femenina body fitness baja",
      },
      { id: "wellness", name: "Wellness", description: "Categoría libre femenina" },
    ],
  }

  useEffect(() => {
    loadCompetitions()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const loadCompetitions = async () => {
    try {
      const response = await fetch("/api/competitions")
      if (response.ok) {
        const data = await response.json()
        setCompetitions(data.competitions || [])
      }
    } catch (error) {
      console.error("Error loading competitions:", error)
    }
  }

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      categories: checked ? [...prev.categories, categoryId] : prev.categories.filter((id) => id !== categoryId),
    }))
  }

  const handleCompetitionChange = (competitionId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      competitions: checked
        ? [...prev.competitions, competitionId]
        : prev.competitions.filter((id) => id !== competitionId),
    }))
  }

  const handleFileChange = (field: "cedulaFront" | "cedulaBack", file: File | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validaciones básicas
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.cedula) {
        toast({
          title: "Error",
          description: "Complete todos los campos obligatorios",
          variant: "destructive",
        })
        return
      }

      if (formData.categories.length === 0) {
        toast({
          title: "Error",
          description: "Seleccione al menos una categoría",
          variant: "destructive",
        })
        return
      }

      if (formData.competitions.length === 0) {
        toast({
          title: "Error",
          description: "Seleccione al menos una competencia",
          variant: "destructive",
        })
        return
      }

      // Crear FormData para envío con archivos
      const submitData = new FormData()
      submitData.append("firstName", formData.firstName)
      submitData.append("lastName", formData.lastName)
      submitData.append("email", formData.email)
      submitData.append("phone", formData.phone)
      submitData.append("cedula", formData.cedula)
      submitData.append("address", formData.address)
      submitData.append("categories", JSON.stringify(formData.categories))
      submitData.append("competitions", JSON.stringify(formData.competitions))

      if (formData.cedulaFront) {
        submitData.append("cedulaFront", formData.cedulaFront)
      }
      if (formData.cedulaBack) {
        submitData.append("cedulaBack", formData.cedulaBack)
      }

      const response = await fetch("/api/athletes", {
        method: "POST",
        body: submitData,
      })

      if (response.ok) {
        // Notificar a los administradores
        try {
          await fetch("/api/notify-admin-new-athlete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              cedula: formData.cedula,
              categories: formData.categories,
              created_at: new Date().toISOString(),
            }),
          })
        } catch (err) {
          // No interrumpe el flujo si falla la notificación
          console.error("Error notificando a admins:", err)
        }
        setIsSubmitted(true)
        toast({
          title: "¡Registro exitoso!",
          description: "Su inscripción ha sido enviada y está pendiente de aprobación",
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al registrar atleta")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al procesar el registro",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/30 backdrop-blur-md border border-white/40 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-green-800">¡Registro Exitoso!</CardTitle>
            <CardDescription>
              Su inscripción ha sido enviada correctamente y está pendiente de aprobación por parte de los
              administradores de FENIFISC.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Recibirá una notificación por email una vez que su registro sea revisado y aprobado.
            </p>
            <Link href="/">
              <Button className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-gradient-dark">
      {/* Header */}
      <header className={`bg-white dark:bg-gray-900 border-b sticky top-0 z-50 transition-shadow ${scrolled ? "shadow-lg" : "shadow-sm"} fade-in-up`}>
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
                <h1 className="text-lg sm:text-xl font-bold text-blue-900 dark:text-blue-400">FENIFISC</h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Registro de Atletas</p>
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

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-8">
        <Card className="bg-white/30 dark:bg-gray-900/95 backdrop-blur-md border border-white/40 dark:border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle className="fade-in-up">Registro de Atleta</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Complete el formulario para registrarse en las competencias de FENIFISC. Todos los campos marcados con *
              son obligatorios.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <StepProgressBar currentStep={step} />
              {step === 0 && <StepPersonalInfo formData={formData} setFormData={setFormData} onNext={() => setStep(1)} />}
              {step === 1 && <StepDocuments formData={formData} setFormData={setFormData} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
              {step === 2 && <StepCategory formData={formData} setFormData={setFormData} onNext={() => setStep(3)} onBack={() => setStep(1)} categories={categories} />}
              {step === 3 && <StepCompetition formData={formData} setFormData={setFormData} onNext={() => setStep(4)} onBack={() => setStep(2)} competitions={competitions} />}
              {step === 4 && <StepReview formData={formData} onBack={() => setStep(3)} onSubmit={handleSubmit} />}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
