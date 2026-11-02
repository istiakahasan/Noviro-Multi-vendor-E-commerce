/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
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
import {
  useGetAllServiceQuery,
  useDeleteServiceMutation,
} from "@/redux/api/serviceApi/serviceApi";
import Image from "next/image";

// Updated Types for API response
interface Service {
  id: string;
  name: string;
  profilePic: string | null;
  category: {
    id: string;
    name: string;
    description: string;
    type: string;
    comment: string;
    createdAt: string;
    updatedAt: string;
  };
  serviceType: {
    id: string;
    name: string;
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
  duration: string;
  totalSlot: number;
  price: number;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  location: string;
  slotDuration: number;
  averageRating: number;
  totalReviews: number;
  storeId: string;
  categoryId: string;
  serviceTypeId: string;
  subCategoryId: string;
  tags: string[];
  features: any;
  serviceMode: string;
  providerType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  store: {
    id: string;
    name: string;
    location: string;
  };
  specialists: Array<{
    id: string;
    firstName: string;
    lastName: string;
    title: string;
    email: string;
  }>;
}

export default function ServiceManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    data: serviceResponse,
    isLoading,
    error,
  } = useGetAllServiceQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery || undefined,
  });

  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const serviceData = serviceResponse?.data || [];
  const totalItems = serviceResponse?.meta?.total || 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  };


  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    // Check if it's a valid date (not the 1970-01-01 default)
    if (date.getFullYear() === 1970) {
      return "Not specified";
    }
    return date.toLocaleDateString();
  };

  const formatTime = (timeString: string) => {
    const time = new Date(timeString);
    // Check if it's a valid time (not the 1970-01-01 default)
    if (time.getFullYear() === 1970) {
      return "Not specified";
    }
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleDeleteClick = (service: Service) => {
    setSelectedService(service);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedService) {
      try {
        await deleteService(selectedService.id).unwrap();
        setDeleteDialogOpen(false);
        setSelectedService(null);
        toast.success("Service deleted successfully");
      } catch (error) {
        console.error("Failed to delete service:", error);
        toast.error("Failed to delete service");
      }
    }
  };

  const handleViewClick = (service: Service) => {
    setSelectedService(service);
    setViewDialogOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
          <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
          <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">
            Error loading services. Please try again.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-gray-900 text-white hover:bg-gray-800"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 md:p-8">
      <div className="mx-auto container">
        {/* Header */}
        <div className="mb-6 flex items-center md:justify-between justify-center flex-col gap-4 md:flex-row">
          <div>
            <h1 className="md:text-2xl text-xl font-semibold text-gray-900">
              Service management
            </h1>
          </div>
          <Link href={"/seller-dashboard/service/add-service"}>
            <Button className="bg-gray-900 text-white hover:bg-gray-800">
              Add New Service
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search service by name or category"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Service Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                    Service Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Sub Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                    Slot Available
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 whitespace-nowrap">
                    Slot Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {serviceData?.map((service: Service) => (
                  <tr
                    key={service.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="text-sm font-medium text-gray-900 block">
                            {service.name}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {service.serviceType?.name || "Standard"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <Image
                        src={service.profilePic || "placeholder.svg"}
                        alt={service.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {service.category?.name || "Uncategorized"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {service.subCategory?.name || "No Subcategory"}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {service.duration}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {service.location}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {service.totalSlot} slots
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {service.slotDuration} minutes
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(service.price)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        service.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : service.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {service.status.charAt(0).toUpperCase() + service.status.slice(1)}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                          onClick={() => handleViewClick(service)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <Link href={`/seller-dashboard/service/edit-service/${service.id}`}>
                          <button className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors">
                            <Pencil className="h-4 w-4" />
                          </button>
                        </Link>
                        <button
                          className="rounded p-1.5 text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => handleDeleteClick(service)}
                        >
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

        {/* No services found */}
        {serviceData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No services found.</p>
          </div>
        )}

        {/* Pagination */}
        {serviceData.length > 0 && (
          <CustomPagination
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Service</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <strong>{selectedService?.name}</strong>? This action cannot be
                undone.
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
                {isDeleting ? "Deleting..." : "Delete Service"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Service Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Service Details</DialogTitle>
            </DialogHeader>

            {selectedService && (
              <div className="space-y-6">
                {/* Header Section */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Image
                    src={selectedService.profilePic || "placeholder.svg"}
                    alt={selectedService.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {selectedService.name}
                    </h3>
                    <p className="text-gray-600">
                      Service Type:{" "}
                      {selectedService.serviceType?.name || "Standard"}
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      selectedService.status === 'approved' 
                        ? 'bg-green-100 text-green-800' 
                        : selectedService.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedService.status.charAt(0).toUpperCase() + selectedService.status.slice(1)}
                    </span>
                  </div>
                </div>

                {/* Main Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Category</h4>
                    <p className="text-gray-600">
                      {selectedService.category?.name || "Uncategorized"}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Sub Category</h4>
                    <p className="text-gray-600">
                      {selectedService.subCategory?.name || "No Subcategory"}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Duration</h4>
                    <p className="text-gray-600">{selectedService.duration}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Price</h4>
                    <p className="text-gray-600">
                      {formatPrice(selectedService.price)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Total Slots
                    </h4>
                    <p className="text-gray-600">
                      {selectedService.totalSlot} slots
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Location</h4>
                    <p className="text-gray-600">{selectedService.location}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Slot Duration
                    </h4>
                    <p className="text-gray-600">
                      {selectedService.slotDuration} minutes
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Store</h4>
                    <p className="text-gray-600">
                      {selectedService.store?.name || "Unknown Store"}
                    </p>
                  </div>
                </div>

                {/* Service Mode & Provider Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Service Mode</h4>
                    <p className="text-gray-600">
                      {selectedService.serviceMode === 'ONLINE' ? 'Online' : 'Offline'}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Provider Type</h4>
                    <p className="text-gray-600">
                      {selectedService.providerType === 'OWNER_ONLY' ? 'Owner Only' :
                       selectedService.providerType === 'SPECIALIST_ONLY' ? 'Specialist Only' :
                       selectedService.providerType === 'BOTH' ? 'Both Owner & Specialist' :
                       selectedService.providerType}
                    </p>
                  </div>
                </div>

                {/* Date & Time Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Service Period
                    </h4>
                    <div className="space-y-1 text-gray-600">
                      <p>
                        <span className="font-medium">Start:</span>{" "}
                        {formatDateTime(selectedService.startDate)}
                      </p>
                      <p>
                        <span className="font-medium">End:</span>{" "}
                        {formatDateTime(selectedService.endDate)}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Operating Hours
                    </h4>
                    <div className="space-y-1 text-gray-600">
                      <p>
                        <span className="font-medium">Start:</span>{" "}
                        {formatTime(selectedService.startTime)}
                      </p>
                      <p>
                        <span className="font-medium">End:</span>{" "}
                        {formatTime(selectedService.endTime)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {selectedService.tags && selectedService.tags.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedService.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specialists */}
                {selectedService.specialists && selectedService.specialists.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Assigned Specialists</h4>
                    <div className="space-y-2">
                      {selectedService.specialists.map((specialist) => (
                        <div key={specialist.id} className="text-gray-600">
                          {specialist.firstName} {specialist.lastName} - {specialist.title}
                          {specialist.email && (
                            <span className="text-sm text-gray-500 block">
                              {specialist.email}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rating & Reviews */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Rating & Reviews
                  </h4>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="flex items-center">
                      ⭐ {selectedService.averageRating.toFixed(1)}
                    </span>
                    <span>•</span>
                    <span>{selectedService.totalReviews} reviews</span>
                  </div>
                </div>

                {/* Description */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Description
                  </h4>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {selectedService.description}
                  </p>
                </div>

                {/* Created/Updated Info */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Created:</span>{" "}
                      {new Date(selectedService.createdAt).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium">Updated:</span>{" "}
                      {new Date(selectedService.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => setViewDialogOpen(false)}
                    className="border-gray-300"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}