import React from "react"
import { Bar } from "react-chartjs-2"
import { useTheme } from "next-themes"

interface DashboardStatsProps {
  data: any
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ data }) => {
  const { theme } = useTheme()
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="bg-white/70 dark:bg-gray-900/80 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 sm:p-10 backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-blue-200 text-center">Atletas por Categoría</h2>
        <div className="w-full h-[320px] sm:h-[400px]">
          <Bar
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: 'y',
              plugins: {
                legend: { display: false },
                title: { display: false },
              },
              scales: {
                x: {
                  beginAtZero: true,
                  ticks: {
                    color: theme === 'dark' ? '#c7d2fe' : '#1e293b',
                    font: { size: 14 },
                  },
                  grid: {
                    color: theme === 'dark' ? '#334155' : '#e5e7eb',
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    color: theme === 'dark' ? '#c7d2fe' : '#1e293b',
                    font: { size: 14 },
                  },
                  grid: {
                    color: theme === 'dark' ? '#334155' : '#e5e7eb',
                  },
                },
              },
              backgroundColor: theme === 'dark' ? '#1e293b' : '#fff',
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardStats 