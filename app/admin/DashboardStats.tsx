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
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="bg-white/70 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 sm:p-10 backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-blue-200 text-center">Atletas por Categoría</h2>
        <div className="w-full h-[180px] sm:h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 40, right: 20, top: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" strokeOpacity={0.4} />
              <XAxis type="number" allowDecimals={false} stroke="#64748b" tick={{ fill: "#334155", fontSize: 14 }} tickLine={false} axisLine={false} />
              <YAxis dataKey="category" type="category" width={180} stroke="#64748b" tick={{ fill: "#334155", fontSize: 14 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#1e293b", color: "#fff", borderRadius: 8, border: "none" }} cursor={{ fill: "#2563eb22" }} />
              <Bar dataKey="count" fill="#2563eb" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
} 