"use client"

import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Mon", activeUser: 1200, newSignups: 700, renewal: 900, cancellations: 200 },
  { name: "Tue", activeUser: 1400, newSignups: 1000, renewal: 1200, cancellations: 250 },
  { name: "Wed", activeUser: 1600, newSignups: 900, renewal: 1100, cancellations: 300 },
  { name: "Thu", activeUser: 1800, newSignups: 1100, renewal: 1400, cancellations: 280 },
  { name: "Fri", activeUser: 2100, newSignups: 1300, renewal: 1600, cancellations: 320 },
  { name: "Sat", activeUser: 2200, newSignups: 1200, renewal: 1500, cancellations: 350 },
  { name: "Sun", activeUser: 2000, newSignups: 800, renewal: 1200, cancellations: 280 },
]

export function SubscriptionGrowthChart() {
  return (
    <Card className="p-6 rounded-xl border border-border">
      <h3 className="text-lg font-semibold mb-4">Subscription Growth</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="activeUser" stroke="#ef4444" strokeWidth={2} />
          <Line type="monotone" dataKey="newSignups" stroke="#3b82f6" strokeWidth={2} />
          <Line type="monotone" dataKey="renewal" stroke="#3b82f6" strokeWidth={2} />
          <Line type="monotone" dataKey="cancellations" stroke="#ef4444" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
