"use client"

import { Card } from "@/components/ui/card"
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Products", value: 67, fill: "#3b82f6" },
  { name: "Service", value: 21, fill: "#f97316" },
  { name: "Consultation", value: 7, fill: "#a855f7" },
  { name: "Subscription", value: 5, fill: "#06b6d4" },
]

export function SalesDistributionChart() {
  return (
    <Card className="p-6 rounded-xl border border-border">
      <h3 className="text-lg font-semibold mb-4">Sales Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}
