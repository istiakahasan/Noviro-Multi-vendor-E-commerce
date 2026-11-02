// app/manage-subcategories/page.tsx
"use client";

import { Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  useGetAllSubcategoriesQuery,
  useDeleteSubcategoryMutation,
} from "@/redux/features/subcategory/subcategoryApi";
import { toast } from "sonner";
import PageLoader from "@/app/loading";

// Reusable Subcategory Card Component
const SubcategoryCard = ({
  id,
  title = "Unnamed Subcategory",
  parentCategory = "Unknown Category",
  imageUrl = "/images/placeholder.jpg",
  isAddCard = false,
  onEdit,
  onDelete,
}: {
  id?: string;
  title?: string;
  parentCategory?: string;
  imageUrl?: string;
  isAddCard?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className={`
        relative rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300
        ${
          isAddCard
            ? "border-2 border-dashed border-gray-400 cursor-pointer"
            : "bg-white"
        }
      `}
    >
      {isAddCard ? (
        <Link href="subcategory-management/add" className="block h-full">
          {" "}
          {/* Adjust link to /add */}
          <div className="h-64 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Plus size={32} className="text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 text-center px-4">
              Add new Subcategory on your platform
            </h3>
            <p className="text-sm text-gray-500 mt-2">Click to create new</p>
          </div>
        </Link>
      ) : (
        <>
          {/* Image */}
          <div className="h-48 bg-gray-200 relative">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                No image
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 text-center">
            <h3 className="font-semibold text-gray-800 text-lg line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{parentCategory}</p>
          </div>

          {/* Three-dot menu */}
          {!isAddCard && (
            <div className="absolute top-2 right-2">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 rounded-full hover:bg-gray-200 transition"
              >
                <MoreVertical size={20} className="text-gray-600" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
                  <Link
                    href={`subcategory-management/add?id=${id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Pencil size={16} className="mr-2" />
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onDelete?.();
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Confirmation Modal Component
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this subcategory? This action cannot be undone.",
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <p className="text-sm text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
const ManageSubcategoriesPage = () => {
  // Fetch subcategories from API
  const { data, isLoading, isError, error, refetch } =
    useGetAllSubcategoriesQuery({ limit: 100 });

  const [deleteSubcategory] = useDeleteSubcategoryMutation();

  const subcategories = data?.data.subcategories ?? [];

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!selectedDeleteId) return;

    try {
      await deleteSubcategory(selectedDeleteId).unwrap();
      toast.success("Subcategory deleted successfully");
      setDeleteModalOpen(false);
      setSelectedDeleteId(null);
      refetch(); // Optional: since tags invalidate, but to be sure
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete subcategory");
    }
  };

  const openDeleteModal = (id: string) => {
    setSelectedDeleteId(id);
    setDeleteModalOpen(true);
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Manage your Subcategories
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage all Subcategories
          </p>
        </div>

        {/* Loading / Error states */}
        {isLoading && (
          <div className="text-center py-12 text-gray-600">
            Loading subcategories...
          </div>
        )}

        {isError && (
          <div className="text-center py-12 text-red-600">
            Error loading subcategories:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </div>
        )}

        {/* Content */}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {/* Add New Card - always first */}
            <SubcategoryCard isAddCard={true} />

            {/* Existing Subcategory Cards */}
            {subcategories.map((sub) => (
              <SubcategoryCard
                key={sub.id}
                id={sub.id}
                title={sub.name}
                parentCategory={sub.category?.name ?? "No category"}
                imageUrl={sub.image ?? undefined}
                onDelete={() => openDeleteModal(sub.id)}
              />
            ))}

            {/* Message when there are no subcategories */}
            {subcategories.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No subcategories found. Create your first one!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ManageSubcategoriesPage;
