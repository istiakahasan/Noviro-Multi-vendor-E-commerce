"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Eye, Pencil, Trash2 } from "lucide-react"

// Sample service data
const serviceData = [
  {
    id: 1,
    name: "Hair Cut",
    icon: "💇",
    category: "Personal Care & Wellness",
    duration: "30 Mins",
    status: "Active",
    slotsAvailable: "20 sets available",
    price: "$2,742.00",
  },
  {
    id: 2,
    name: "Property Build",
    icon: "🏗️",
    category: "Retail & Fashion",
    duration: "1 Hour",
    status: "Active",
    slotsAvailable: "No set available",
    price: "$2,742.00",
  },
  {
    id: 3,
    name: "Massage",
    icon: "💆",
    category: "Retail & Fashion",
    duration: "25 Mins",
    status: "Inactive",
    slotsAvailable: "05 set available",
    price: "$2,742.00",
  },
  {
    id: 4,
    name: "Pet Care",
    icon: "🐕",
    category: "Tech & Automotive",
    duration: "10 Mins",
    status: "Active",
    slotsAvailable: "20 sets available",
    price: "$2,742.00",
  },
  {
    id: 5,
    name: "Facial",
    icon: "🧖",
    category: "Sell Product",
    duration: "10 Mins",
    status: "Inactive",
    slotsAvailable: "05 set available",
    price: "$2,742.00",
  },
  {
    id: 6,
    name: "Pet Care",
    icon: "🐾",
    category: "Retail & Fashion",
    duration: "10 Mins",
    status: "Active",
    slotsAvailable: "No set available",
    price: "$2,742.00",
  },
  {
    id: 7,
    name: "Joga",
    icon: "🧘",
    category: "Business & Industry",
    duration: "10 Mins",
    status: "Inactive",
    slotsAvailable: "20 sets available",
    price: "$2,742.00",
  },
  {
    id: 8,
    name: "Gardening",
    icon: "🌱",
    category: "Retail & Fashion",
    duration: "10 Mins",
    status: "Active",
    slotsAvailable: "05 set available",
    price: "$2,742.00",
  },
  {
    id: 9,
    name: "Therapy",
    icon: "🧠",
    category: "Home & Pets",
    duration: "10 Mins",
    status: "Inactive",
    slotsAvailable: "No set available",
    price: "$2,742.00",
  },
  {
    id: 10,
    name: "Event Organization",
    icon: "🎉",
    category: "Home & Pets",
    duration: "10 Mins",
    status: "Active",
    slotsAvailable: "05 set available",
    price: "$2,742.00",
  },
]

export default function ServiceManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-600"
      case "Inactive":
        return "bg-gray-100 text-gray-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const getSlotColor = (slot: string) => {
    if (slot.includes("20 sets available")) {
      return "bg-green-50 text-green-600"
    } else if (slot.includes("No set available")) {
      return "bg-red-50 text-red-600"
    } else if (slot.includes("05 set available")) {
      return "bg-orange-50 text-orange-600"
    }
    return "bg-gray-100 text-gray-600"
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto container">
        {/* Header */}
        <div className="mb-6 flex items-center lg:justify-between justify-center flex-col gap-4 md:flex-row">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Service management</h1>
            <p className="mt-1 text-sm text-gray-500">Dashboard &gt; Service</p>
          </div>
          <Button className="bg-gray-900 text-white hover:bg-gray-800">Add New Service</Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search service by name or type"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>
        </div>

        {/* Table Container with Horizontal Scroll */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-6 py-3">
                    <Checkbox />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Slot Available
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {serviceData.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Checkbox />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-xl">
                          {service.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{service.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{service.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{service.duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-md px-3 py-1 text-xs font-medium ${getStatusColor(service.status)}`}
                      >
                        {service.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-md px-3 py-1 text-xs font-medium ${getSlotColor(service.slotsAvailable)}`}
                      >
                        {service.slotsAvailable}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.price}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="rounded p-1.5 text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
