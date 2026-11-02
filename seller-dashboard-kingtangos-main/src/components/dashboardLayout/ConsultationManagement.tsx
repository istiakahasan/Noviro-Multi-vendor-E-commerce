/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Eye, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { CustomPagination } from "../shared/CustomPagination";
import Image from "next/image";
import {
  useDeleteConsultationMutation,
  useGetAllConsultationQuery,
} from "@/redux/api/consultationApi/consultationApi";

// Updated Types based on actual API response
interface Consultation {
  id: string;
  storeId: string;
  categoryId: string;
  subCategoryId: string;
  name: string;
  profilePic: string | null;
  price: number;
  description: string;
  duration: string;
  location: string;
  slotDuration: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  tags: string[];
  providerType: "BOTH" | "SPECIALIST_ONLY" | "OWNER_ONLY";
  type: "AUDIO" | "VIDEO" | "IN_PERSON";
  averageRating: number;
  totalReviews: number;
  totalSlot: number;
  status: "AVAILABLE" | "UNAVAILABLE";
  currentStatus: "pending" | "approved";
  consultationMode: "ONLINE" | "OFFLINE";
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    description: string;
    type: string;
    comment: string;
    createdAt: string;
    updatedAt: string;
  };
  subCategory: {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    slug: string;
    image: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
  };
  specialists: Array<{
    id: string;
    storeId: string;
    userId: string;
    serviceTypeId: string;
    firstName: string;
    lastName: string;
    title: string;
    email: string;
    gender: string;
    bio: string;
    phoneNum: string;
    available: boolean;
    rating: string;
    experience: string;
    status: string;
    specialistTime: string;
    createdAt: string;
    updatedAt: string;
    averageRating: number;
    totalReviews: number;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      profilePic: string;
    };
  }>;
}

interface ConsultationResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: Consultation[];
}

export default function ConsultationManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] =
    useState<Consultation | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Redux RTK Query hooks
  const {
    data: consultationResponse,
    isLoading,
    error,
  } = useGetAllConsultationQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
  });

  const [deleteConsultation, { isLoading: isDeleting }] =
    useDeleteConsultationMutation();

  // Memoize consultation data to prevent unnecessary re-renders
  const consultationData = useMemo(() => {
    return (consultationResponse as ConsultationResponse)?.data || [];
  }, [consultationResponse]);

  // Get specialist name for display
  const getSpecialistName = (consultation: Consultation) => {
    if (consultation.specialists && consultation.specialists.length > 0) {
      const specialist = consultation.specialists[0];
      return `${specialist.firstName} ${specialist.lastName}`;
    }
    return "Not assigned"; // Fallback when no specialist
  };

  // Get specialist title for display
  const getSpecialistTitle = (consultation: Consultation) => {
    if (consultation.specialists && consultation.specialists.length > 0) {
      return consultation.specialists[0].title;
    }
    return "Consultant"; // Default title
  };

  // Get specialist experience for display
  const getSpecialistExperience = (consultation: Consultation) => {
    if (consultation.specialists && consultation.specialists.length > 0) {
      return consultation.specialists[0].experience;
    }
    return "Not specified";
  };

  // Get type display name and styling
  const getTypeDisplay = (consultation: Consultation) => {
    switch (consultation.type) {
      case "VIDEO":
        return { text: "Video", className: "bg-blue-100 text-blue-700" };
      case "AUDIO":
        return { text: "Audio", className: "bg-purple-100 text-purple-700" };
      case "IN_PERSON":
        return { text: "In-person", className: "bg-green-100 text-green-700" };
      default:
        return { text: consultation.type, className: "bg-gray-100 text-gray-700" };
    }
  };

  // Get consultation mode display
  const getConsultationModeDisplay = (consultation: Consultation) => {
    switch (consultation.consultationMode) {
      case "ONLINE":
        return { text: "Online", className: "bg-blue-100 text-blue-700" };
      case "OFFLINE":
        return { text: "Offline", className: "bg-orange-100 text-orange-700" };
      default:
        return { text: consultation.consultationMode, className: "bg-gray-100 text-gray-700" };
    }
  };

  // Calculate next available slot based on start time
  const getNextSlot = (consultation: Consultation) => {
    if (consultation.status !== "AVAILABLE") {
      return "Not Available";
    }
    
    // Simple implementation - you might want to enhance this with actual slot calculation
    const startDate = new Date(consultation.startTime);
    return startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getNextSlotColor = (nextSlot: string) => {
    if (nextSlot === "Not Available") {
      return "bg-red-100 text-red-700";
    }
    return "bg-green-100 text-green-700";
  };

  // Filter consultations based on search query (client-side filtering as fallback)
  const filteredConsultations = useMemo(() => {
    if (!consultationData.length) return [];

    // If API handles search, return all data, otherwise filter client-side
    if (searchQuery) {
      return consultationData.filter(
        (item: Consultation) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.consultationMode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.category?.name && 
            item.category.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return consultationData;
  }, [consultationData, searchQuery]);

  // Calculate total items for pagination
  const totalItems =
    (consultationResponse as ConsultationResponse)?.meta?.total || 0;

  const handleDeleteClick = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedConsultation) {
      try {
        await deleteConsultation(selectedConsultation.id).unwrap();
        setDeleteDialogOpen(false);
        setSelectedConsultation(null);
        toast.success("Consultation deleted successfully", {
          description: `${selectedConsultation.name} has been removed.`,
        });
      } catch (error: any) {
        console.error("Error deleting consultation:", error);
        toast.error("Failed to delete consultation", {
          description: error?.data?.message || "Please try again",
        });
      }
    }
  };

  const handleViewClick = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setViewDialogOpen(true);
  };

  // Format price to currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price / 100); // Assuming price is in cents
  };

  // Handle API error
  useEffect(() => {
    if (error) {
      toast.error("Failed to load consultations", {
        description: "Please try again later",
      });
    }
  }, [error]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
            <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
            <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 md:p-8">
      <div className="mx-auto container">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between flex-col md:flex-row gap-4">
          <div>
            <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-gray-900">
              Consultation management
            </h1>
          </div>
          <Link href={"/seller-dashboard/consultation/add-consultation"}>
            <Button className="bg-gray-800 text-white hover:bg-gray-900">
              Add New Consultation
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search consultations by name, type, consultation mode, or category"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page when searching
              }}
              className="pl-10 bg-white border-gray-200"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Consultation Mode
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Experience
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Next Slot
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredConsultations.length > 0 ? (
                  filteredConsultations.map((consultation: Consultation) => {
                    const typeDisplay = getTypeDisplay(consultation);
                    const modeDisplay = getConsultationModeDisplay(consultation);
                    return (
                      <tr
                        key={consultation.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-200 overflow-hidden">
                              <Image
                                src={
                                  consultation.profilePic ||
                                  (consultation.specialists?.[0]?.user?.profilePic) ||
                                  "/placeholder-avatar.jpg"
                                }
                                alt={consultation.name}
                                className="h-full w-full object-cover"
                                width={40}
                                height={40}
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder-avatar.jpg";
                                }}
                              />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-gray-900 block">
                                {consultation.name}
                              </span>
                              <span className="text-xs text-gray-500">
                                {getSpecialistTitle(consultation)}
                              </span>
                              <span className="text-xs text-gray-400 block">
                                {consultation.category?.name}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${typeDisplay.className}`}>
                            {typeDisplay.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${modeDisplay.className}`}>
                            {modeDisplay.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {consultation.duration}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {getSpecialistExperience(consultation)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${getNextSlotColor(
                              getNextSlot(consultation)
                            )}`}
                          >
                            {getNextSlot(consultation)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {formatPrice(consultation.price)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            consultation.status === "AVAILABLE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {consultation.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                              onClick={() => handleViewClick(consultation)}
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <Link
                              href={`/seller-dashboard/consultation/edit-consultation/${consultation.id}`}
                            >
                              <button
                                className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Edit"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                            </Link>
                            <button
                              className="rounded p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                              onClick={() => handleDeleteClick(consultation)}
                              title="Delete"
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      {searchQuery
                        ? "No consultations found matching your search."
                        : "No consultations found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalItems > 0 && (
          <CustomPagination
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Consultation</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <strong>{selectedConsultation?.name}</strong>? This action
                cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                className="flex-1"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Consultation Details</DialogTitle>
            </DialogHeader>

            {selectedConsultation && (
              (() => {
                const typeDisplay = getTypeDisplay(selectedConsultation);
                const modeDisplay = getConsultationModeDisplay(selectedConsultation);
                
                return (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="h-16 w-16 flex-shrink-0 rounded-full bg-gray-200 overflow-hidden">
                        <Image
                          src={
                            selectedConsultation.profilePic ||
                            (selectedConsultation.specialists?.[0]?.user?.profilePic) ||
                            "/placeholder-avatar.jpg"
                          }
                          alt={selectedConsultation.name}
                          className="h-full w-full object-cover"
                          width={64}
                          height={64}
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-avatar.jpg";
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {selectedConsultation.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {getSpecialistTitle(selectedConsultation)}
                        </p>
                        <p className="text-sm text-gray-500">
                          Category: {selectedConsultation.category?.name}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${typeDisplay.className}`}>
                            {typeDisplay.text}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${modeDisplay.className}`}>
                            {modeDisplay.text}
                          </span>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            selectedConsultation.status === "AVAILABLE"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {selectedConsultation.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Duration
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedConsultation.duration}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Experience
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {getSpecialistExperience(selectedConsultation)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Next Slot
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {getNextSlot(selectedConsultation)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Price
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(selectedConsultation.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Category
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedConsultation.category?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Subcategory
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedConsultation.subCategory?.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Provider Type
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedConsultation.providerType.replace('_', ' ')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Total Slots
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedConsultation.totalSlot}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Current Status
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedConsultation.currentStatus}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase">
                          Slot Duration
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedConsultation.slotDuration} min
                        </p>
                      </div>
                    </div>

                    {selectedConsultation.specialists && selectedConsultation.specialists.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                          Specialist
                        </p>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-medium text-gray-900">
                            {getSpecialistName(selectedConsultation)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {getSpecialistTitle(selectedConsultation)} • {getSpecialistExperience(selectedConsultation)}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Email: {selectedConsultation.specialists[0].email} • Phone: {selectedConsultation.specialists[0].phoneNum}
                          </p>
                          {selectedConsultation.specialists[0].specialistTime && (
                            <p className="text-sm text-gray-500 mt-1">
                              Availability: {selectedConsultation.specialists[0].specialistTime}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                        Description
                      </p>
                      <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                        {selectedConsultation.description}
                      </p>
                    </div>

                    {selectedConsultation.tags && selectedConsultation.tags.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                          Tags
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedConsultation.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <DialogFooter className="flex gap-2 pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => setViewDialogOpen(false)}
                        className="flex-1"
                      >
                        Close
                      </Button>
                      <Link
                        href={`/seller-dashboard/consultation/edit-consultation/${selectedConsultation.id}`}
                        className="flex-1"
                      >
                        <Button className="w-full bg-gray-800 text-white hover:bg-gray-900">
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                    </DialogFooter>
                  </div>
                );
              })()
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}