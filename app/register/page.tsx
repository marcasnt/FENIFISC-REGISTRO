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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };
  const isValid = formData.firstName && formData.lastName && formData.email && formData.cedula;
  return (
    <form className="space-y-4" onSubmit={e => { e.preventDefault(); if (isValid) onNext(); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Su nombre"
            required
            className="bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Su apellido"
            required
            className="bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="su.email@ejemplo.com"
            required
            className="bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+505 8888-8888"
            className="bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cedula">Cédula de Identidad *</Label>
          <Input
            id="cedula"
            value={formData.cedula}
            onChange={handleChange}
            placeholder="000-000000-0000X"
            required
            className="bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Textarea
          id="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Su dirección completa"
          rows={3}
          className="bg-white dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        />
      </div>
      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={!isValid} className="w-full sm:w-auto px-8 btn-animate">
          Siguiente
        </Button>
      </div>
    </form>
  );
}

// Paso 2: Subida de documentos
function StepDocuments({ formData, setFormData, onNext, onBack }: any) {
  const handleFileChange = (field: "cedulaFront" | "cedulaBack", file: File | null) => {
    setFormData((prev: any) => ({ ...prev, [field]: file }));
  };
  const isValid = formData.cedulaFront && formData.cedulaBack;
  return (
    <form className="space-y-4" onSubmit={e => { e.preventDefault(); if (isValid) onNext(); }}>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cedulaFront">Cédula (Frente) *</Label>
          <Input
            id="cedulaFront"
            type="file"
            accept="image/*"
            onChange={e => handleFileChange("cedulaFront", e.target.files?.[0] || null)}
            required
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200 dark:hover:file:bg-blue-800"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cedulaBack">Cédula (Reverso) *</Label>
          <Input
            id="cedulaBack"
            type="file"
            accept="image/*"
            onChange={e => handleFileChange("cedulaBack", e.target.files?.[0] || null)}
            required
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200 dark:hover:file:bg-blue-800"
          />
        </div>
      </div>
      <div className="flex justify-between pt-2 gap-2">
        <Button type="button" variant="outline" onClick={onBack} className="w-full sm:w-auto">Atrás</Button>
        <Button type="submit" disabled={!isValid} className="w-full sm:w-auto px-8 btn-animate">Siguiente</Button>
      </div>
    </form>
  );
}

// Paso 3: Selección de categoría
function StepCategory({ formData, setFormData, onNext, onBack, categories }: any) {
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      categories: checked ? [...prev.categories, categoryId] : prev.categories.filter((id: string) => id !== categoryId),
    }));
  };
  const isValid = formData.categories && formData.categories.length > 0;
  return (
    <form className="space-y-4" onSubmit={e => { e.preventDefault(); if (isValid) onNext(); }}>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Categorías a Participar *</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-blue-800 border-b border-blue-200 pb-1 mb-2">CATEGORÍAS MASCULINAS</h4>
          <div className="space-y-2">
            {categories.male.map((category: any) => (
              <div key={category.id} className="flex items-center gap-2">
                <Checkbox
                  id={category.id}
                  checked={formData.categories.includes(category.id)}
                  onCheckedChange={checked => handleCategoryChange(category.id, checked as boolean)}
                />
                <Label htmlFor={category.id} className="text-sm font-medium cursor-pointer">{category.name}</Label>
                <span className="text-xs text-gray-500">{category.description}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium text-pink-800 border-b border-pink-200 pb-1 mb-2">CATEGORÍAS FEMENINAS</h4>
          <div className="space-y-2">
            {categories.female.map((category: any) => (
              <div key={category.id} className="flex items-center gap-2">
                <Checkbox
                  id={category.id}
                  checked={formData.categories.includes(category.id)}
                  onCheckedChange={checked => handleCategoryChange(category.id, checked as boolean)}
                />
                <Label htmlFor={category.id} className="text-sm font-medium cursor-pointer">{category.name}</Label>
                <span className="text-xs text-gray-500">{category.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between pt-2 gap-2">
        <Button type="button" variant="outline" onClick={onBack} className="w-full sm:w-auto">Atrás</Button>
        <Button type="submit" disabled={!isValid} className="w-full sm:w-auto px-8 btn-animate">Siguiente</Button>
      </div>
    </form>
  );
}

// Paso 4: Selección de competencia
function StepCompetition({ formData, setFormData, onNext, onBack, competitions }: any) {
  const handleCompetitionChange = (competitionId: string, checked: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      competitions: checked ? [...prev.competitions, competitionId] : prev.competitions.filter((id: string) => id !== competitionId),
    }));
  };
  const isValid = formData.competitions && formData.competitions.length > 0;
  return (
    <form className="space-y-4" onSubmit={e => { e.preventDefault(); if (isValid) onNext(); }}>
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Competencias Disponibles *</h3>
      <div className="space-y-2">
        {competitions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No hay competencias disponibles en este momento.</p>
        ) : (
          competitions.map((competition: any) => (
            <div key={competition.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/80 rounded">
              <Checkbox
                id={competition.id}
                checked={formData.competitions.includes(competition.id)}
                onCheckedChange={checked => handleCompetitionChange(competition.id, checked as boolean)}
              />
              <Label htmlFor={competition.id} className="text-base font-medium cursor-pointer">{competition.name}</Label>
              <span className="text-xs text-gray-500 ml-2">{new Date(competition.date).toLocaleDateString("es-ES")}</span>
              <span className="text-xs text-gray-500 ml-2">{competition.location}</span>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-between pt-2 gap-2">
        <Button type="button" variant="outline" onClick={onBack} className="w-full sm:w-auto">Atrás</Button>
        <Button type="submit" disabled={!isValid} className="w-full sm:w-auto px-8 btn-animate">Siguiente</Button>
      </div>
    </form>
  );
}

// Paso 5: Revisión y confirmación
function StepReview({ formData, onBack, onSubmit, categories, competitions }: any) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revisión de Datos</h3>
      <div className="space-y-2">
        <div><span className="font-medium">Nombre:</span> {formData.firstName}</div>
        <div><span className="font-medium">Apellido:</span> {formData.lastName}</div>
        <div><span className="font-medium">Email:</span> {formData.email}</div>
        <div><span className="font-medium">Teléfono:</span> {formData.phone}</div>
        <div><span className="font-medium">Cédula:</span> {formData.cedula}</div>
        <div><span className="font-medium">Dirección:</span> {formData.address}</div>
        <div><span className="font-medium">Categorías:</span> {(formData.categories || []).map((id: string) => {
          const cat = [...categories.male, ...categories.female].find((c: any) => c.id === id);
          return cat ? cat.name : id;
        }).join(", ")}</div>
        <div><span className="font-medium">Competencias:</span> {(formData.competitions || []).map((id: string) => {
          const comp = competitions.find((c: any) => c.id === id);
          return comp ? comp.name : id;
        }).join(", ")}</div>
        <div><span className="font-medium">Cédula (Frente):</span> {formData.cedulaFront ? formData.cedulaFront.name : "No adjuntada"}</div>
        <div><span className="font-medium">Cédula (Reverso):</span> {formData.cedulaBack ? formData.cedulaBack.name : "No adjuntada"}</div>
      </div>
      <div className="flex justify-between pt-2 gap-2">
        <Button type="button" variant="outline" onClick={onBack} className="w-full sm:w-auto">Atrás</Button>
        <Button type="button" onClick={onSubmit} className="w-full sm:w-auto px-8 btn-animate">Confirmar y Enviar</Button>
      </div>
    </div>
  );
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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
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
      const submitData = new FormData();
      submitData.append("firstName", formData.firstName);
      submitData.append("lastName", formData.lastName);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);
      submitData.append("cedula", formData.cedula);
      submitData.append("address", formData.address);
      submitData.append("categories", JSON.stringify(formData.categories));
      submitData.append("competitions", JSON.stringify(formData.competitions));
      submitData.append("cedulaFront", formData.cedulaFront);
      submitData.append("cedulaBack", formData.cedulaBack);

      const response = await fetch("/api/athletes", {
        method: "POST",
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMsg = "Ocurrió un error al registrar. Intente de nuevo.";
        if (errorData.error && errorData.error.includes("athletes_cedula_key")) {
          errorMsg = "Error: La cédula ya está registrada.";
        }
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Si todo sale bien
      setIsSubmitted(true);
      toast({
        title: "Registro exitoso",
        description: "¡Te has registrado correctamente!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado. Intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              {step === 4 && <StepReview formData={formData} onBack={() => setStep(3)} onSubmit={handleSubmit} categories={categories} competitions={competitions} />}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
