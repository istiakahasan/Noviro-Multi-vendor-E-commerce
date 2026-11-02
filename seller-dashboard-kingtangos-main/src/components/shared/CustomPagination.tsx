"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type React from "react";

interface PaginationProps {
  totalItems: number;
  itemsPerPageOptions?: number[];
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  currentPage: number;
  itemsPerPage: number;
}

export const CustomPagination = ({
  totalItems,
  itemsPerPageOptions = [10, 25, 50, 100, 200, 300, 500],
  onPageChange,
  onItemsPerPageChange,
  currentPage,
  itemsPerPage,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newItemsPerPage = Number(e.target.value);
    onItemsPerPageChange(newItemsPerPage);
    onPageChange(1);
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`min-w-[32px] md:min-w-[40px] h-[32px] md:h-[40px] text-sm font-medium rounded-lg transition-colors ${
              currentPage === i
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-white border border-gray-200"
            }`}
          >
            {i}
          </button>
        );
      }
    } else {
      // Always show first page
      pages.push(
        <button
          key={1}
          onClick={() => goToPage(1)}
          className={`min-w-[32px] md:min-w-[40px] h-[32px] md:h-[40px] text-sm font-medium rounded-lg transition-colors ${
            currentPage === 1
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-gray-700 hover:bg-white border border-gray-200"
          }`}
        >
          1
        </button>
      );

      // Show ellipsis if current page is far from start
      if (currentPage > 3) {
        pages.push(
          <span
            key="start-ellipsis"
            className="min-w-[32px] md:min-w-[40px] h-[32px] md:h-[40px] flex items-center justify-center text-sm text-gray-400"
          >
            ...
          </span>
        );
      }

      // Show current page and neighbors
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);

      for (let i = startPage; i <= endPage; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => goToPage(i)}
            className={`min-w-[32px] md:min-w-[40px] h-[32px] md:h-[40px] text-sm font-medium rounded-lg transition-colors ${
              currentPage === i
                ? "bg-primary text-white shadow-sm"
                : "bg-white text-gray-700 hover:bg-white border border-gray-200"
            }`}
          >
            {i}
          </button>
        );
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 2) {
        pages.push(
          <span
            key="end-ellipsis"
            className="min-w-[32px] md:min-w-[40px] h-[32px] md:h-[40px] flex items-center justify-center text-sm text-gray-400"
          >
            ...
          </span>
        );
      }

      // Always show last page
      pages.push(
        <button
          key={totalPages}
          onClick={() => goToPage(totalPages)}
          className={`min-w-[32px] md:min-w-[40px] h-[32px] md:h-[40px] text-sm font-medium rounded-lg transition-colors ${
            currentPage === totalPages
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-gray-700 hover:bg-white border border-gray-200"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="py-4 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg">
      {/* Left side - Showing info with dropdown */}
      <div className="flex items-center gap-2 text-gray-500">
        <span className="text-sm">Showing</span>
        <select
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
          className="bg-primary text-white text-sm font-medium px-2 md:px-3 py-1 rounded border-none outline-none cursor-pointer"
        >
          {itemsPerPageOptions.map((option) => (
            <option
              key={option}
              value={option}
              className="bg-white text-gray-900"
            >
              {option}
            </option>
          ))}
        </select>
        <span className="text-sm whitespace-nowrap">
          out of {totalItems.toLocaleString()}
        </span>
      </div>

      {/* Right side - Navigation */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-2 md:px-3 py-1 md:py-2 text-sm font-medium rounded-lg transition-colors flex justify-center items-center gap-1 ${
            currentPage === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-white border border-gray-200"
          }`}
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-1">{renderPageNumbers()}</div>

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-2 md:px-3 py-1 md:py-2 text-sm font-medium rounded-lg transition-colors flex justify-center items-center gap-1 ${
            currentPage === totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-white border border-gray-200"
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );
};
