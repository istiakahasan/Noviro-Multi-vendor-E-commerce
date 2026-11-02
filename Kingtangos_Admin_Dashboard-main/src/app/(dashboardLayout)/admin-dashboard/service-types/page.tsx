"use client";

import {
  useGetAllServiceTypesQuery,
  useCreateServiceTypeMutation,
  useUpdateServiceTypeMutation,
  useDeleteServiceTypeMutation,
  ServiceType,
} from "@/redux/features/serviceTypeApi";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Briefcase,
  Calendar,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export default function ServiceTypesPage() {
  const { data, isLoading, isError } = useGetAllServiceTypesQuery();
  const [createServiceType, { isLoading: isCreating }] =
    useCreateServiceTypeMutation();
  const [updateServiceType, { isLoading: isUpdating }] =
    useUpdateServiceTypeMutation();
  const [deleteServiceType, { isLoading: isDeleting }] =
    useDeleteServiceTypeMutation();

  const serviceTypes = data?.data ?? [];

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [formName, setFormName] = useState("");
  const [editingServiceType, setEditingServiceType] =
    useState<ServiceType | null>(null);
  const [deletingServiceType, setDeletingServiceType] =
    useState<ServiceType | null>(null);

  // Menu state
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (openMenuId && menuRefs.current[openMenuId]) {
        if (!menuRefs.current[openMenuId]?.contains(target)) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  const toggleMenu = (serviceTypeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === serviceTypeId ? null : serviceTypeId));
  };

  const openCreateModal = () => {
    setFormName("");
    setIsCreateModalOpen(true);
  };

  const openEditModal = (serviceType: ServiceType) => {
    setEditingServiceType(serviceType);
    setFormName(serviceType.name);
    setIsEditModalOpen(true);
    setOpenMenuId(null);
  };

  const openDeleteModal = (serviceType: ServiceType) => {
    setDeletingServiceType(serviceType);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const closeAllModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setFormName("");
    setEditingServiceType(null);
    setDeletingServiceType(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      toast.error("Please enter a service type name");
      return;
    }

    try {
      const response = await createServiceType({
        name: formName.trim(),
      }).unwrap();
      toast.success(response.message || "Service type created successfully");
      closeAllModals();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create service type");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingServiceType || !formName.trim()) {
      toast.error("Please enter a service type name");
      return;
    }

    try {
      const response = await updateServiceType({
        id: editingServiceType.id,
        body: { name: formName.trim() },
      }).unwrap();
      toast.success(response.message || "Service type updated successfully");
      closeAllModals();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update service type");
    }
  };

  const handleDelete = async () => {
    if (!deletingServiceType) return;

    try {
      const response = await deleteServiceType(deletingServiceType.id).unwrap();
      toast.success(response.message || "Service type deleted successfully");
      closeAllModals();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete service type");
    }
  };

  if (isError || (!isLoading && !data?.success)) {
    return (
      <div className="p-8 text-center text-red-600">
        Failed to load service types. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Service Types</h1>
            <p className="mt-2 text-gray-600">
              Manage all service type categories
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button className="whitespace-nowrap" onClick={openCreateModal}>
              <Plus className="mr-2 h-4 w-4" />
              Add Service Type
            </Button>
          </div>
        </div>

        {/* Service Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {isLoading ? (
            // Loading Skeletons
            <>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 animate-pulse"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-5 w-32 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                      <div className="h-4 w-28 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : serviceTypes.length === 0 ? (
            <div className="col-span-full bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
              No service types found.
            </div>
          ) : (
            serviceTypes.map((serviceType) => (
              <div
                key={serviceType.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow relative"
              >
                <div className="p-6">
                  {/* Three dots menu */}
                  <div
                    className="absolute top-4 right-4"
                    ref={(el: HTMLDivElement | null) => {
                      if (el) {
                        menuRefs.current[serviceType.id] = el;
                      }
                    }}
                  >
                    <button
                      className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                      onClick={(e) => toggleMenu(serviceType.id, e)}
                      aria-label="Service type actions"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {openMenuId === serviceType.id && (
                      <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-30 w-44">
                        <div className="py-1">
                          <button
                            onClick={() => openEditModal(serviceType)}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => openDeleteModal(serviceType)}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Icon and Name */}
                  <div className="flex items-center gap-4 mb-4 pr-8">
                    <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {serviceType.name}
                      </h3>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-xs">
                        Created:{" "}
                        {new Date(serviceType.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-xs">
                        Updated:{" "}
                        {new Date(serviceType.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>

                  {/* ID Badge */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="inline-block px-2 py-1 text-xs font-mono bg-gray-100 text-gray-600 rounded truncate max-w-full">
                      ID: {serviceType.id.slice(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stats Footer */}
        {!isLoading && serviceTypes.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Service Types</p>
                <p className="text-2xl font-bold text-gray-900">
                  {serviceTypes.length}
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <Briefcase className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Create Service Type
            </h2>
            <form onSubmit={handleCreate}>
              <div className="mb-6">
                <label
                  htmlFor="create-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Service Type Name
                </label>
                <input
                  id="create-name"
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter service type name"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isCreating && (
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  )}
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && editingServiceType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Edit Service Type
            </h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-6">
                <label
                  htmlFor="edit-name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Service Type Name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  placeholder="Enter service type name"
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={closeAllModals}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
                >
                  {isUpdating && (
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  )}
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && deletingServiceType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Delete Service Type
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                {deletingServiceType.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeAllModals}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting && (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
