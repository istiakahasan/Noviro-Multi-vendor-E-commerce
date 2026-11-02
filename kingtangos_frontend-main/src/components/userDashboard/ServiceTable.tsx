"use client";

import { useId, useState } from "react";
import { Input } from "../ui/input";
import { IoSearchOutline } from "react-icons/io5";
import { useGetAllBookingQuery } from "@/redux/api/userDashbord/userDashbordApi";
import BookingTable from "../ui/tables/BookingTable";
import Pagination from "../ui/Pagination/Pagination";

export default function ServiceTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const id = useId();

  const { data, isLoading, isError } = useGetAllBookingQuery({
    page: currentPage,
    limit: 10,
    bookingType: "service",
  });

  const bookings = data?.data || [];
  const totalPages = data?.meta?.totalPage || 1;

  const handleDelete = (id: string) => {
    console.log("Delete booking:", id);
    // call delete API here
  };

  return (
    <div className="w-full space-y-4 mt-5">
      {/* Search Input */}
      <div className="p-5 bg-white rounded-xl shadow-sm">
        <div className="relative w-full">
          <Input
            id={id}
            className="w-full ps-9 border-0 shadow-none focus-visible:border-0 focus-visible:ring-0"
            placeholder="Start typing to search for orders"
            type="text"
          />
          <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80">
            <IoSearchOutline size={20} aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* Booking Table */}
      <div className="p-5 bg-white rounded-xl shadow-sm">
        <BookingTable
          bookings={bookings}
          isLoading={isLoading}
          isError={isError}
          onDelete={handleDelete}
        />
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
