"use client"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

interface Athlete {
  id: string
  first_name: string
  last_name: string
  email: string
  categories?: string[]
}

interface DashboardStatsProps {
  athletes: Athlete[]
  categoryNames: { [key: string]: string }
}

export default function DashboardStats({ athletes, categoryNames }: DashboardStatsProps) {
  // Contar atletas por categoría
  const categoryCount: { [key: string]: number } = {}
  athletes.forEach((athlete) => {
    athlete.categories?.forEach((cat) => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1
    })
  })
  const data = Object.entries(categoryCount).map(([key, value]) => ({
    category: categoryNames[key] || key,
    count: value,
  }))

  if (data.length === 0) return null

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-8">
      <h2 className="text-lg font-bold mb-4">Atletas por Categoría</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ left: 40, right: 20, top: 10, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="category" type="category" width={180} />
          <Tooltip />
          <Bar dataKey="count" fill="#2563eb" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 