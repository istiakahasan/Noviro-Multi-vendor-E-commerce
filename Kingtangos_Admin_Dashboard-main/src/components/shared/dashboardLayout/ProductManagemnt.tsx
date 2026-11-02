"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

// Sample consultant data
const consultantData = [
  {
    id: "C001",
    userName: "John Smith",
    email: "john.smith@example.com",
    expertise: "Personal Care & Wellness",
    status: "Active",
    stock: "25 In Stock",
  },
  {
    id: "C002",
    userName: "Sarah Johnson",
    email: "sarah.j@example.com",
    expertise: "Retail & Fashion",
    status: "Draft",
    stock: "Out of Stock",
  },
  {
    id: "C003",
    userName: "Michael Brown",
    email: "michael.b@example.com",
    expertise: "Retail & Fashion",
    status: "Disable",
    stock: "Low Stock",
  },
  {
    id: "C004",
    userName: "Emily Davis",
    email: "emily.d@example.com",
    expertise: "Tech & Automotive",
    status: "Draft",
    stock: "25 In Stock",
  },
  {
    id: "C005",
    userName: "David Wilson",
    email: "david.w@example.com",
    expertise: "Sell Product",
    status: "Active",
    stock: "Low Stock",
  },
  {
    id: "C006",
    userName: "Lisa Anderson",
    email: "lisa.a@example.com",
    expertise: "Business & Industry",
    status: "Disable",
    stock: "25 In Stock",
  },
  {
    id: "C007",
    userName: "James Taylor",
    email: "james.t@example.com",
    expertise: "Retail & Fashion",
    status: "Active",
    stock: "Out of Stock",
  },
  {
    id: "C008",
    userName: "Jennifer Martinez",
    email: "jennifer.m@example.com",
    expertise: "Retail & Fashion",
    status: "Disable",
    stock: "Low Stock",
  },
  {
    id: "C009",
    userName: "Robert Garcia",
    email: "robert.g@example.com",
    expertise: "Home & Pets",
    status: "Draft",
    stock: "Out of Stock",
  },
  {
    id: "C010",
    userName: "Maria Rodriguez",
    email: "maria.r@example.com",
    expertise: "Home & Pets",
    status: "Active",
    stock: "Low Stock",
  },
];

export default function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-50 text-green-600";
      case "Draft":
        return "bg-orange-50 text-orange-600";
      case "Disable":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStockColor = (stock: string) => {
    if (stock.includes("25 In Stock")) {
      return "bg-green-50 text-green-600";
    } else if (stock.includes("Out of Stock")) {
      return "bg-red-50 text-red-600";
    } else if (stock.includes("Low Stock")) {
      return "bg-orange-50 text-orange-600";
    }
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto container">
        {/* Header */}
        <div className="mb-6 flex items-center lg:justify-between justify-center flex-col gap-4 md:flex-row">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Product management
            </h1>
            <p className="mt-1 text-sm text-gray-500">Dashboard &gt; Product</p>
          </div>
          <Link href="/admin-dashboard/add-product">
            {" "}
            <Button className="bg-gray-900 text-white hover:bg-gray-800">
              Add New Products
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search product by name or type"
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
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    SKU/ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Stock
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
                {consultantData.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Checkbox />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
                        <span className="text-sm font-medium text-gray-900">
                          Organic Hair Oil
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      #PRD-1045
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {item.expertise}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-md px-3 py-1 text-xs font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-md px-3 py-1 text-xs font-medium ${getStockColor(
                          item.stock
                        )}`}
                      >
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      €2,742.00
                    </td>
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
  );
}
