"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download } from "lucide-react";
import { CustomPagination } from "@/components/shared/CustomPagination";


  const paymentHistoryData = [
    {
      id: "*TXN-20SS",
      date: "Sep 20, 2025",
      type: "Order-Wellness Kit",
      customer: "John Smith",
      status: "Paid",
      amount: "$2,742.00",
    },
    {
      id: "Property Build",
      date: "Retail & Fashion",
      type: "Service-Hair Cut",
      customer: "John Smith",
      status: "Refunded",
      amount: "$2,742.00",
    },
    {
      id: "Massage",
      date: "Retail & Fashion",
      type: "Consultant-Economist",
      customer: "John Smith",
      status: "Pending",
      amount: "$2,742.00",
    },
    {
      id: "Facial",
      date: "Sell Product",
      type: "Subscription-Monthly dog food (5 packet)",
      customer: "John Smith",
      status: "Paid",
      amount: "$2,742.00",
    },
  ];

export default function PaymentHistoryTable() {
  const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalItems = paymentHistoryData.length; // Use the actual length of your data

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = paymentHistoryData.slice(indexOfFirstItem, indexOfLastItem);



  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-600";
      case "Pending":
        return "bg-orange-100 text-orange-600";
      case "Refunded":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredData = currentItems.filter(
    (item) =>
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm mt-12">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <Input
          placeholder="Search payment history by name or type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 w-12">
                <Checkbox />
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Type
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Customer Name
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Payment Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                Invoice
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <Checkbox />
                </td>
                <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                  {item.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{item.type}</td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {item.customer}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-4 py-1 rounded-md text-xs font-semibold ${getStatusStyle(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {item.amount}
                </td>
                <td className="px-6 py-4">
                  <Button
                    variant="ghost"
                    className="flex items-center text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Download className="h-4 w-4 mr-1 text-red-500" />
                    PDF
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* pagination */}
      <CustomPagination
        totalItems={totalItems} // Now using the actual data length
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
}
