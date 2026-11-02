/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
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
import { Search, Eye, Pencil, Trash2, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { CustomPagination } from "../shared/CustomPagination";
import {
  useDeleteSpecialistMutation,
  useGetMyAllSpecialistQuery,
} from "@/redux/api/specialistApi/specialistApi";
import Image from "next/image";

// Types based on updated API response
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
  Profile?: {
    id: string;
    userId: string;
    phone: string;
    gender: string;
    homeAddress: string;
    officeAddress: string;
    birthDate: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface Specialist {
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
  user: User;
}

export default function SpecialistManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSpecialist, setSelectedSpecialist] =
    useState<Specialist | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // RTK Query hooks
  const {
    data: specialistsResponse,
    isLoading,
    error,
  } = useGetMyAllSpecialistQuery({});
  const [deleteSpecialist, { isLoading: isDeleting }] =
    useDeleteSpecialistMutation();

  const specialists = useMemo(
    () => specialistsResponse?.data || [],
    [specialistsResponse?.data],
  );

  const getStatusColor = (status: string) => {
    return status === "Active" ? "text-green-600" : "text-gray-400";
  };

  const getAvailabilityText = (available: boolean) => {
    return available ? "Available" : "Not Available";
  };

  const getAvailabilityColor = (available: boolean) => {
    return available ? "text-green-600" : "text-red-600";
  };

  // Filter specialists by name, email, title, or phone
  const filteredSpecialists = useMemo(() => {
    return specialists.filter(
      (specialist: Specialist) =>
        `${specialist.firstName} ${specialist.lastName}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        specialist.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        specialist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (specialist.phoneNum?.toLowerCase() || "").includes(
          searchQuery.toLowerCase(),
        ),
    );
  }, [specialists, searchQuery]);

  // Pagination logic
  const totalItems = filteredSpecialists.length;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSpecialists.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const handleDeleteClick = (specialist: Specialist) => {
    setSelectedSpecialist(specialist);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedSpecialist) {
      try {
        await deleteSpecialist(selectedSpecialist.id).unwrap();
        setDeleteDialogOpen(false);
        toast.success("Specialist deleted successfully", {
          description: `${selectedSpecialist.firstName} ${selectedSpecialist.lastName} has been removed.`,
        });
      } catch (error: any) {
        console.error("Error deleting specialist:", error);
        toast.error("Failed to delete specialist", {
          description: error?.data?.message || "Please try again later.",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading specialists...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="p-8 flex items-center justify-center">
          <div className="mx-auto container">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Specialist</h1>
              </div>
              <Link href={"/seller-dashboard/specialist/add-specialist"}>
                <Button className="bg-gray-800 text-white hover:bg-gray-900">
                  Add New Specialist
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="m-40 text-center">
          <p className="text-red-600 text-lg">Error loading specialists</p>
          <p className="text-gray-600 mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="mx-auto container">
        {/* Header */}
        <div className="my-6 flex items-center justify-between flex-col md:flex-row gap-4">
          <div>
            <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-gray-900">
              Specialist
            </h1>
          </div>
          <Link href={"/seller-dashboard/specialist/add-specialist"}>
            <Button className="bg-gray-800 text-white hover:bg-gray-900">
              Add New Specialist
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search Specialist by name, email, title, or phone"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
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
                    Specialist
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Contact Info
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Service Type ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Availability
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Experience
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Gender
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentItems.map((specialist: Specialist) => (
                  <tr
                    key={specialist.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Profile Image */}
                        <div className="h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-200">
                          {specialist.user?.profilePic ? (
                            <Image
                              src={specialist.user.profilePic}
                              alt={`${specialist.firstName} ${specialist.lastName}`}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                // Fallback if image fails to load
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement?.classList.add('flex', 'items-center', 'justify-center');
                              }}
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gray-300 text-gray-600">
                              <UserIcon className="h-5 w-5" />
                            </div>
                          )}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-900 block">
                            {specialist.firstName} {specialist.lastName}
                          </span>
                          <span className="text-xs text-gray-500">
                            {specialist.title}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        <div>{specialist.email}</div>
                        <div className="text-xs text-gray-500">{specialist.phoneNum}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {specialist.serviceTypeId.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span
                        className={getAvailabilityColor(specialist.available)}
                      >
                        {getAvailabilityText(specialist.available)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {specialist.experience} {parseInt(specialist.experience) === 1 ? 'year' : 'years'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {specialist.gender}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-medium ${getStatusColor(
                        specialist.status,
                      )}`}
                    >
                      {specialist.status}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        ⭐ {specialist.averageRating || specialist.rating}
                        {specialist.totalReviews > 0 && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({specialist.totalReviews})
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/seller-dashboard/specialist/view-specialist/${specialist.id}`}
                        >
                          <button
                            className="rounded p-1.5 text-blue-600 hover:bg-blue-50 transition-colors"
                            title="View"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>
                        <Link
                          href={`/seller-dashboard/specialist/edit-specialist/${specialist.id}`}
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
                          onClick={() => handleDeleteClick(specialist)}
                          title="Delete"
                          disabled={isDeleting}
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

        {/* Empty State */}
        {currentItems.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No specialists found.</p>
          </div>
        )}

        {/* Pagination */}
        <CustomPagination
          totalItems={totalItems}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Specialist</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete{" "}
                <strong>
                  {selectedSpecialist?.firstName} {selectedSpecialist?.lastName}
                </strong>
                ? This action cannot be undone.
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
      </div>
    </div>
  );
}