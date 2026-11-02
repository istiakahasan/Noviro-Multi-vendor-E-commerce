/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "../ui/input";
import { IoSearchOutline } from "react-icons/io5";
import { FaEye } from "react-icons/fa6";
import Link from "next/link";
import { useGetAllBookingQuery } from "@/redux/api/userDashbord/userDashbordApi";
import { Skeleton } from "@/components/ui/skeleton"; // Make sure you have a Skeleton component

export default function ConsultationTable() {
  const id = useId();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Fetch API data
  const { data, isLoading, isError } = useGetAllBookingQuery({
    page: currentPage,
    limit: itemsPerPage,
    bookingType: "consultation",
  });

  const bookingsData = data?.data || [];
  const totalPages = data?.meta?.totalPage || 1;

  return (
    <div className="w-full space-y-4 mt-5">
      <div className="p-5 bg-white rounded-xl shadow-sm">
        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={6}>
                  <div className="relative w-full">
                    <Input
                      id={id}
                      className="w-full ps-9 border-0 shadow-none focus-visible:border-0 focus-visible:ring-0"
                      placeholder="Start typing to search for orders"
                      type="text"
                    />
                    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                      <IoSearchOutline size={20} aria-hidden="true" />
                    </div>
                  </div>
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="text-primary pt-4 pb-3 text-xl font-medium">
                  Type
                </TableHead>
                <TableHead className="text-primary whitespace-nowrap pt-4 pb-3 text-xl font-medium">
                  Booking Date
                </TableHead>
                <TableHead className="text-primary whitespace-nowrap pt-4 pb-3 text-xl font-medium">
                  Schedule Date
                </TableHead>
                <TableHead className="text-primary pt-4 pb-3 text-xl font-medium">
                  Status
                </TableHead>
                <TableHead className="text-primary pt-4 pb-3 text-xl font-medium">
                  Price
                </TableHead>
                <TableHead className="text-primary pt-4 pb-3 text-right text-xl font-medium">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                // Skeleton loader for 4 rows
                Array.from({ length: 4 }).map((_, idx) => (
                  <TableRow key={idx} className="border-b">
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-10" />
                    </TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-5 text-red-500"
                  >
                    Failed to load bookings
                  </TableCell>
                </TableRow>
              ) : bookingsData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-5">
                    No bookings found
                  </TableCell>
                </TableRow>
              ) : (
                bookingsData.map((order: any) => (
                  <TableRow key={order.id} className="border-b">
                    <TableCell className="font-medium text-base text-text py-5">
                      {order.consultation?.type || "N/A"}
                    </TableCell>
                    <TableCell className="text-base whitespace-nowrap text-text py-5">
                      {new Date(order.bookingDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-base whitespace-nowrap text-primary py-5">
                      {new Date(order.startTime).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-base text-primary py-5">
                      {order.status}
                    </TableCell>
                    <TableCell className="text-base text-primary py-5">
                      {order.amount}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <div className="rounded-full bg-[#0066FF]/10 py-1 px-0.5">
                          <Link href={`/user/consultation/${order?.id}`}>
                            <Button
                              variant="link"
                              className="h-auto font-normal"
                            >
                              <FaEye className="text-[#0066FF]" />
                            </Button>
                          </Link>
                        </div>
                        {/* <div className="rounded-full bg-danger/10 py-1 px-0.5">
                          <Button variant="link" className="h-auto font-normal">
                            <BsFillTrash3Fill className="text-[#FB041B]" />
                          </Button>
                        </div> */}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="text-sm text-muted-foreground mt-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="min-w-[84px]"
          >
            Previous
          </Button>

          <div className="flex items-center justify-center gap-1 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-9 h-9"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage >= totalPages}
            className="min-w-[84px]"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
