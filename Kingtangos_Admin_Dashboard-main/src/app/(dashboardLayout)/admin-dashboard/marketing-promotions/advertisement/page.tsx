"use client";

import React, { useState } from "react";
import { Eye, Filter, Search, Trash2, VerifiedIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const MarketingPromotionsPage = () => {
  const router = useRouter();

  type Banner = {
    id: string;
    bannerName: string;
    seller: string;
    placement: string;
    duration: string;
    status: "Pending" | "Approved" | "Cancelled" | "Success" | string;
    image: string;
  };

  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("Advertisement");
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);

  const statusOptions = ["All", "Pending", "Approved", "Cancelled", "Success"];
  
  const banners = [
    {
      id: "BAN-001",
      bannerName: "#TX-9045",
      seller: "Glam Beauty Studio",
      placement: "Homepage Hero",
      duration: "7 days",
      status: "Pending",
      image:
        "https://i.ibb.co.com/fdpnnBG4/woman-sitting-clinic-near-special-beauty-equipments-1.png",
    },
    {
      id: "BAN-002",
      bannerName: "#TX-9046",
      seller: "Tech Haven",
      placement: "Sidebar Ad",
      duration: "14 days",
      status: "Approved",
      image:
        "https://i.ibb.co.com/fdpnnBG4/woman-sitting-clinic-near-special-beauty-equipments-1.png",
    },
    {
      id: "BAN-003",
      bannerName: "#TX-9047",
      seller: "Travelicious",
      placement: "Footer Section",
      duration: "10 days",
      status: "Cancelled",
      image:
        "https://i.ibb.co.com/fdpnnBG4/woman-sitting-clinic-near-special-beauty-equipments-1.png",
    },
    {
      id: "BAN-004",
      bannerName: "#TX-9048",
      seller: "Urban Outfit",
      placement: "Homepage Hero",
      duration: "5 days",
      status: "Success",
      image:
        "https://i.ibb.co.com/fdpnnBG4/woman-sitting-clinic-near-special-beauty-equipments-1.png",
    },
    {
      id: "BAN-005",
      bannerName: "#TX-9049",
      seller: "Food Fiesta",
      placement: "Promo Banner",
      duration: "9 days",
      status: "Pending",
      image:
        "https://i.ibb.co/jL5bgLr/pexels-ella-olsson-1640777.jpg",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      case "Success":
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleView = (banner: Banner) => {
    setSelectedBanner(banner as Banner);
    setIsModalOpen(true);
  };

  const handleStatusChange = (option: string) => {
    setStatusFilter(option);
    setShowStatusMenu(false);
  };

  // ✅ Navigation added here
const typeOptions = ["Coupons", "Advertisement"];

const handleTypeChange = (option: string) => {
  setTypeFilter(option);

  if (option === "Coupons") {
    router.push("/admin-dashboard/marketing-promotions");
  } else if (option === "Advertisement") {
    router.push("/admin-dashboard/marketing-promotions/advertisement");
  }

  setShowTypeMenu(false);
};

  const handleApprove = () => {
    if (selectedBanner) {
      selectedBanner.status = "Approved";
      setSelectedBanner({ ...selectedBanner });
      setIsModalOpen(false);
    }
  };

  const handleReject = () => {
    if (selectedBanner) {
      selectedBanner.status = "Cancelled";
      setSelectedBanner({ ...selectedBanner });
      setIsModalOpen(false);
    }
  };

  const getStatusDisplay = () =>
    statusFilter === "All" ? "Filter by Status" : statusFilter;

  const filteredBanners = banners.filter((b) => {
    const matchesSearch =
      b.seller.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bannerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ? true : b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 container mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold">Marketing & Promotions</h2>
        <p className="text-sm text-gray-500">
          Manage platform-wide promotional campaigns, discount codes, and featured listings.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-4 mt-6">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
        <div className="flex items-center">
          {/* Status Filter Dropdown */}
          <div className="ml-4 relative">
            <button
              onClick={() => setShowStatusMenu(!showStatusMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Filter size={16} />
              {getStatusDisplay()}
            </button>
            {showStatusMenu && (
              <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                {statusOptions.map((option) => (
                  <li key={option}>
                    <button
                      onClick={() => handleStatusChange(option)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Type Filter Dropdown */}
          <div className="ml-4 relative">
            <button
              onClick={() => setShowTypeMenu(!showTypeMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Filter size={16} />
              {typeFilter}
            </button>
            {showTypeMenu && (
              <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                {typeOptions.map((option) => (
                  <li key={option}>
                    <button
                      onClick={() => handleTypeChange(option)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Banner Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Banner List</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left text-sm text-gray-600 border-b">
                <th className="p-3">Banner Name</th>
                <th className="p-3">Seller</th>
                <th className="p-3">Placement Area</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBanners.map((banner) => (
                <tr key={banner.id} className="border-b text-sm">
                  <td className="p-3">{banner.bannerName}</td>
                  <td className="p-3">{banner.seller}</td>
                  <td className="p-3">{banner.placement}</td>
                  <td className="p-3">{banner.duration}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(
                        banner.status
                      )}`}
                    >
                      {banner.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleView(banner)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Banner Preview - {selectedBanner?.id}
            </DialogTitle>
          </DialogHeader>

          {selectedBanner && (
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <Image
                  src={selectedBanner.image}
                  alt={selectedBanner.bannerName}
                  width={600}
                  height={300}
                  className="w-full h-48 object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Seller</p>
                  <p className="font-medium">{selectedBanner.seller}</p>
                </div>
                <div>
                  <p className="text-gray-500">Placement</p>
                  <p className="font-medium">{selectedBanner.placement}</p>
                </div>
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-medium">{selectedBanner.duration}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(
                      selectedBanner.status
                    )}`}
                  >
                    {selectedBanner.status}
                  </span>
                </div>
              </div>

              {/* Approve & Reject Buttons */}
              <div className="flex justify-start gap-2 mt-4">
                <Button
                  onClick={handleApprove}
                  className="bg-green-100 text-green-700 border border-green-400 hover:bg-green-200"
                >
                  <VerifiedIcon /> Approve Banner
                </Button>
                <Button
                  onClick={handleReject}
                  className="bg-red-100 text-red-700 border border-red-400 hover:bg-red-200"
                >
                  <Trash2 /> Reject Banner
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MarketingPromotionsPage;
