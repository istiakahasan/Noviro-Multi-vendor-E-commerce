// "use client";

// import { Button } from "@/components/ui/button";
// import {
//     Category,
//     Subcategory,
//     useGetAllCategoriesQuery,
//     useGetSubcategoriesByCategoryQuery,
// } from "@/redux/features/subcategory/subcategoryApi"; // adjust path if needed
// import {
//     Briefcase,
//     ChevronDown,
//     ChevronRight,
//     Package,
//     Plus,
// } from "lucide-react";
// import Link from "next/link";
// import { useState } from "react";

// export default function CategoryPage() {
//   const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(
//     null,
//   );

//   const {
//     data: categoriesRes,
//     isLoading: categoriesLoading,
//     isError: categoriesError,
//   } = useGetAllCategoriesQuery({});

//   const categories = categoriesRes?.data ?? [];

//   const toggleExpand = (categoryId: string) => {
//     setExpandedCategoryId((prev) => (prev === categoryId ? null : categoryId));
//   };

//   if (categoriesError || (!categoriesLoading && !categoriesRes?.success)) {
//     return (
//       <div className="p-8 text-center text-red-600">
//         Failed to load categories. Please try again later.
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}

//         <div className="flex flex-col md:flex-row justify-between mb-4 md:items-center">
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900">
//               Manage your Categories
//             </h1>
//             <p className="mt-2 text-gray-600">
//               Monitor and manage all Categories
//             </p>
//           </div>
//           <div className="flex gap-4">
//             <Link href="/admin-dashboard/category-management/add">
//               <Button>
//                 <Plus className="mr-2" />
//                 Add Category
//               </Button>
//             </Link>

//             <Link href="/admin-dashboard/category-management/subcategory-management">
//               <Button>
//                 <Package className="mr-2" />
//                 see all subcategories
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {/* Categories List */}
//         <div className="space-y-5">
//           {categoriesLoading ? (
//             // Skeleton for categories
//             <>
//               {[...Array(5)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 animate-pulse"
//                 >
//                   <div className="px-6 py-5 flex items-center justify-between">
//                     <div className="flex items-center gap-4 flex-1">
//                       <div className="w-12 h-12 bg-gray-200 rounded-lg" />
//                       <div className="space-y-2">
//                         <div className="h-6 w-48 bg-gray-200 rounded" />
//                         <div className="h-4 w-72 bg-gray-200 rounded" />
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-6">
//                       <div className="h-6 w-20 bg-gray-200 rounded-full" />
//                       <div className="w-5 h-5 bg-gray-200 rounded-full" />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </>
//           ) : categories.length === 0 ? (
//             <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
//               No categories found.
//             </div>
//           ) : (
//             categories.map((category: Category) => {
//               const isExpanded = expandedCategoryId === category.id;

//               return (
//                 <div
//                   key={category.id}
//                   className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
//                 >
//                   {/* Category Header Row */}
//                   <button
//                     onClick={() => toggleExpand(category.id)}
//                     className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
//                   >
//                     <div className="flex items-center gap-4 flex-1">
//                       <div className="p-3 bg-blue-50 rounded-lg">
//                         {category.type === "PRODUCT" ? (
//                           <Package className="w-6 h-6" />
//                         ) : (
//                           <Briefcase className="w-6 h-6" />
//                         )}
//                       </div>

//                       <div>
//                         <h3 className="text-lg font-semibold text-gray-900">
//                           {category.name}
//                         </h3>
//                         <p className="text-sm text-gray-500 mt-0.5">
//                           {category.description || "No description provided"}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-6">
//                       <span
//                         className={`px-3 py-1 text-xs font-medium rounded-full ${
//                           category.type === "PRODUCT"
//                             ? "bg-blue-100 text-blue-700"
//                             : "bg-purple-100 text-purple-700"
//                         }`}
//                       >
//                         {category.type}
//                       </span>

//                       {isExpanded ? (
//                         <ChevronDown className="w-5 h-5 text-gray-500" />
//                       ) : (
//                         <ChevronRight className="w-5 h-5 text-gray-500" />
//                       )}
//                     </div>
//                   </button>

//                   {/* Subcategories Section */}
//                   {isExpanded && (
//                     <div className="border-t bg-gray-50 px-6 py-5">
//                       <SubcategoriesList categoryId={category.id} />
//                     </div>
//                   )}
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ────────────────────────────────────────────────
// // Subcategories sub-component with skeleton
// // ────────────────────────────────────────────────
// function SubcategoriesList({ categoryId }: { categoryId: string }) {
//   const {
//     data: subRes,
//     isLoading,
//     isError,
//   } = useGetSubcategoriesByCategoryQuery(categoryId, {
//     skip: !categoryId,
//   });

//   const subcategories = subRes?.data ?? [];

//   if (isLoading) {
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
//         {[...Array(6)].map((_, i) => (
//           <div
//             key={i}
//             className="bg-white border border-gray-200 rounded-lg p-4"
//           >
//             <div className="flex items-start gap-3">
//               <div className="w-10 h-10 bg-gray-200 rounded-md flex-shrink-0" />
//               <div className="flex-1 min-w-0 space-y-2">
//                 <div className="h-5 w-40 bg-gray-200 rounded" />
//                 <div className="h-4 w-full bg-gray-200 rounded" />
//                 <div className="h-4 w-3/4 bg-gray-200 rounded" />
//                 <div className="mt-2 flex gap-3">
//                   <div className="h-3 w-16 bg-gray-200 rounded" />
//                   <div className="h-3 w-3 bg-gray-200 rounded-full" />
//                   <div className="h-3 w-16 bg-gray-200 rounded" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (isError || !subRes?.success) {
//     return (
//       <div className="text-sm text-red-600 py-4">
//         Failed to load subcategories
//       </div>
//     );
//   }

//   if (subcategories.length === 0) {
//     return (
//       <div className="text-sm text-gray-500 py-4 italic">
//         No subcategories found for this category.
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//       {subcategories.map((sub: Subcategory) => (
//         <div
//           key={sub.id}
//           className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
//         >
//           <div className="flex items-start gap-3">
//             {sub.image ? (
//               <img
//                 src={sub.image}
//                 alt={sub.name}
//                 className="w-10 h-10 object-cover rounded-md flex-shrink-0"
//               />
//             ) : (
//               <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
//                 <span className="text-gray-400 text-xs">No img</span>
//               </div>
//             )}

//             <div className="flex-1 min-w-0">
//               <h4 className="font-medium text-gray-900 truncate">{sub.name}</h4>
//               <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//                 {sub.description || "No description"}
//               </p>
//               <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
//                 <span>Slug: {sub.slug}</span>
//                 <span>•</span>
//                 <span
//                   className={sub.isActive ? "text-green-600" : "text-red-600"}
//                 >
//                   {sub.isActive ? "Active" : "Inactive"}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }








"use client";

import { Button } from "@/components/ui/button";
import {
  Category,
  Subcategory,
  useGetAllCategoriesQuery,
  useGetSubcategoriesByCategoryQuery,
  useDeleteCategoryMutation,
} from "@/redux/features/subcategory/subcategoryApi";
import {
  Briefcase,
  ChevronDown,
  ChevronRight,
  Package,
  Plus,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

export default function CategoryPage() {
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const {
    data: categoriesRes,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useGetAllCategoriesQuery({});

  const categories = categoriesRes?.data ?? [];

  const toggleExpand = (categoryId: string) => {
    setExpandedCategoryId((prev) => (prev === categoryId ? null : categoryId));
  };

  const toggleMenu = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // ← very important
    setOpenMenuId((prev) => (prev === categoryId ? null : categoryId));
  };

  const openDeleteModal = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setDeleteModalOpen(true);
    setOpenMenuId(null);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategory(categoryToDelete).unwrap();
      toast.success("Category deleted successfully");
      closeDeleteModal();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete category");
    }
  };

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

  if (categoriesError || (!categoriesLoading && !categoriesRes?.success)) {
    return (
      <div className="p-8 text-center text-red-600">
        Failed to load categories. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage your Categories</h1>
            <p className="mt-2 text-gray-600">Monitor and manage all Categories</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin-dashboard/category-management/add">
              <Button className="whitespace-nowrap">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </Link>
            <Link href="/admin-dashboard/category-management/subcategory-management">
              <Button variant="outline" className="whitespace-nowrap">
                <Package className="mr-2 h-4 w-4" />
                see all subcategories
              </Button>
            </Link>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-5">
          {categoriesLoading ? (
            // Skeleton (unchanged)
            <>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 animate-pulse"
                >
                  <div className="px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                      <div className="space-y-2">
                        <div className="h-6 w-48 bg-gray-200 rounded" />
                        <div className="h-4 w-72 bg-gray-200 rounded" />
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="h-6 w-20 bg-gray-200 rounded-full" />
                      <div className="w-5 h-5 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : categories.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
              No categories found.
            </div>
          ) : (
            categories.map((category: Category) => {
              const isExpanded = expandedCategoryId === category.id;
              const isMenuOpen = openMenuId === category.id;

              return (
                <div
                  key={category.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200"
                >
                  <div className="relative px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between">
                    {/* Left + middle → expand toggle */}
                    <button
                      onClick={() => toggleExpand(category.id)}
                      className="flex items-center gap-4 text-left flex-1"
                    >
                      <div className="p-2.5 bg-blue-50 rounded-lg shrink-0">
                        {category.type === "PRODUCT" ? (
                          <Package className="w-6 h-6 " />
                        ) : (
                          <Briefcase className="w-6 h-6 " />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">
                          {category.description || "No description provided"}
                        </p>
                      </div>
                    </button>

                    {/* Right side controls – NOT part of expand button */}
                    <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                          category.type === "PRODUCT"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {category.type}
                      </span>

                      <button
                        onClick={() => toggleExpand(category.id)}
                        className="p-1 -mr-1"
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-gray-500" />
                        )}
                      </button>

                      {/* Three dots menu */}
                       <div
                        className="relative menu-container"
                        ref={(el: HTMLDivElement | null) => {
  if (el) {
    menuRefs.current[category.id] = el;
  }
}}
                      >
                        <button
                          className="p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
                          onClick={(e) => toggleMenu(category.id, e)}
                          aria-label="Category actions"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-600" />
                        </button>

                        {isMenuOpen && (
                          <div className="fixed bg-white border border-gray-200 rounded-lg shadow-xl z-30 w-44">
                            <div className="py-1">
                              <Link
                                href={`/admin-dashboard/category-management/add?categoryId=${category.id}`}
                                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                                onClick={() => setOpenMenuId(null)}
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => openDeleteModal(category.id)}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Subcategories */}
                  {isExpanded && (
                    <div className="border-t bg-gray-50 px-5 py-5 sm:px-6">
                      <SubcategoriesList categoryId={category.id} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Delete modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Delete Category
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this category? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeDeleteModal}
                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
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

// SubcategoriesList remains unchanged — paste your version here

// SubcategoriesList component (unchanged)
function SubcategoriesList({ categoryId }: { categoryId: string }) {
  const {
    data: subRes,
    isLoading,
    isError,
  } = useGetSubcategoriesByCategoryQuery(categoryId, {
    skip: !categoryId,
  });

  const subcategories = subRes?.data ?? [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-md flex-shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-5 w-40 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="mt-2 flex gap-3">
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                  <div className="h-3 w-3 bg-gray-200 rounded-full" />
                  <div className="h-3 w-16 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError || !subRes?.success) {
    return (
      <div className="text-sm text-red-600 py-4">
        Failed to load subcategories
      </div>
    );
  }

  if (subcategories.length === 0) {
    return (
      <div className="text-sm text-gray-500 py-4 italic">
        No subcategories found for this category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subcategories.map((sub: Subcategory) => (
        <div
          key={sub.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
        >
          <div className="flex items-start gap-3">
            {sub.image ? (
              <img
                src={sub.image}
                alt={sub.name}
                className="w-10 h-10 object-cover rounded-md flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                <span className="text-gray-400 text-xs">No img</span>
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{sub.name}</h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {sub.description || "No description"}
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                <span>Slug: {sub.slug}</span>
                <span>•</span>
                <span className={sub.isActive ? "text-green-600" : "text-red-600"}>
                  {sub.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}