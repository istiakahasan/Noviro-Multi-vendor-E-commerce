"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { IoEye } from "react-icons/io5";
import { CustomPagination } from "../shared/CustomPagination";
import Image from "next/image";
import {
  useDeleteProductMutation,
  useGetAllStoreProductQuery,
} from "@/redux/api/productApi/productApi";

// Updated Types based on new API response
interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  price: number;
  description: string;
  subCategoryId: string;
  type: string;
  hasVariants: boolean;
  stockQuantity: number;
  discount: number;
  finalPrice: number;
  averageRating: number;
  totalReviews: number;
  tags: string[];
  barcode: string;
  sponsored: boolean;
  createdAt: string;
  updatedAt: string;
  isTopDeal: boolean;
  topDealFrom: string | null;
  topDealUntil: string | null;
  status: string;
  images: string[];
  category: {
    id: string;
    name: string;
    description: string;
    type: string;
    comment: string;
    createdAt: string;
    updatedAt: string;
  };
  subcategory: {
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
  variants: Array<{
    id: string;
    productId: string;
    color: string;
    colorCode: string;
    image: string;
    createdAt: string;
    updatedAt: string;
    sizes: Array<{
      id: string;
      variantId: string;
      size: string;
      quantity: number;
      inStock: boolean;
      createdAt: string;
      updatedAt: string;
    }>;
  }>;
  store: {
    id: string;
    userId: string;
    name: string;
    location: string;
    tags: string[];
    description: string;
    logo: string;
    banner: string;
    phone: string;
    email: string;
    facebookUrl: string;
    instagramUrl: string;
    youtubeUrl: string;
    shopStatus: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    stripeAccountId: string;
    stripeAccountStatus: string;
  };
}

export default function ProductManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Use RTK Query hooks
  const {
    data: productsData,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useGetAllStoreProductQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  // Extract products and pagination from API response
  const products = productsData?.data?.data || [];
  const totalItems = productsData?.data?.meta?.total || 0;

  // Function to get product image based on hasVariants flag
  const getProductImage = (product: Product): string => {
    // If product has variants, get image from first variant
    if (product.hasVariants && product.variants && product.variants.length > 0) {
      // Check each variant for an image
      for (const variant of product.variants) {
        if (variant.image) {
          return variant.image;
        }
      }
    }
    
    // If product doesn't have variants or no variant images, check direct images array
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    
    // Return empty string if no image found
    return "";
  };

  const handleImageError = (productId: string) => {
    setImageErrors(prev => ({ ...prev, [productId]: true }));
  };

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      await deleteProduct(productToDelete).unwrap();
      setShowSuccessMessage(true);
      setShowDeleteModal(false);
      setProductToDelete(null);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

      // Refetch products to update the list
      refetch();
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const getStockColor = (stockQuantity: number): string => {
    if (stockQuantity > 20) {
      return "bg-green-50 text-green-600";
    } else if (stockQuantity === 0) {
      return "bg-red-50 text-red-600";
    } else if (stockQuantity <= 20) {
      return "bg-orange-50 text-orange-600";
    }
    return "bg-gray-100 text-gray-600";
  };

  const getStockText = (stockQuantity: number): string => {
    if (stockQuantity > 20) {
      return `${stockQuantity} In Stock`;
    } else if (stockQuantity === 0) {
      return "Out of Stock";
    } else if (stockQuantity <= 20) {
      return "Low Stock";
    }
    return `${stockQuantity} In Stock`;
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product: Product) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.type?.toLowerCase().includes(searchLower) ||
      product.category?.name?.toLowerCase().includes(searchLower) ||
      product.id.toLowerCase().includes(searchLower)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
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

  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading products</p>
          <Button onClick={refetch} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen md:p-8">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-in slide-in-from-top duration-300">
          Product has been deleted successfully!
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4 border border-gray-200 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={cancelDelete}
                className="bg-gray-300 text-gray-700 hover:bg-gray-400"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="bg-red-600 text-white hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto container">
        {/* Header */}
        <div className="mb-6 flex items-center lg:justify-between justify-center flex-col gap-4 md:flex-row">
          <div>
            <h1 className="lg:text-2xl text-xl font-semibold text-gray-900">
              Product management
            </h1>
            {isFetching && (
              <p className="text-sm text-gray-500 mt-1">Updating...</p>
            )}
          </div>
          <Link href={"/seller-dashboard/product/add-product"}>
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
              placeholder="Search product by name, type, category or ID"
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
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Stock
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
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      {searchQuery ? "No products match your search" : "No products found"}
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((product: Product, index: number) => {
                    const stockText = getStockText(product.stockQuantity);
                    const productImage = getProductImage(product);
                    const hasImageError = imageErrors[product.id];
                    const showImage = productImage && !hasImageError;

                    return (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {showImage ? (
                              <div className="h-10 w-10 flex-shrink-0 relative rounded-full overflow-hidden bg-gray-100">
                                <Image
                                  src={productImage}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                  onError={() => handleImageError(product.id)}
                                  priority={index < 10}
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                {product.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="text-sm font-medium text-gray-900">
                              {product.name}
                            </span>
                            {product.hasVariants && (
                              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                Variants
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {product.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {product.category?.name || "N/A"}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-md px-3 py-1 text-xs font-medium ${getStockColor(
                              product.stockQuantity
                            )}`}
                          >
                            {stockText}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          €{product.finalPrice.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-md px-3 py-1 text-xs font-medium ${
                              product.status === "approved"
                                ? "bg-green-50 text-green-600"
                                : product.status === "pending"
                                ? "bg-yellow-50 text-yellow-600"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/seller-dashboard/product/edit-product/${product.id}`}
                            >
                              <Button className="rounded p-1.5 text-white hover:bg-blue-50 bg-blue-600 hover:text-blue-600 border hover:border-blue-600 transition-colors">
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link
                              href={`/seller-dashboard/product/view-product/${product.id}`}
                            >
                              <Button className="rounded p-1.5 text-white hover:bg-blue-50 bg-blue-600 hover:text-blue-600 border hover:border-blue-600 transition-colors">
                                <IoEye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              onClick={() => handleDeleteClick(product.id)}
                              className="rounded p-1.5 text-red-600 bg-white hover:bg-red-50 transition-colors shadow-md"
                              disabled={isDeleting}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <CustomPagination
            totalItems={totalItems}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        )}
      </div>
    </div>
  );
}