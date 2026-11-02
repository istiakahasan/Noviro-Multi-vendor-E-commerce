/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FaEye } from "react-icons/fa6";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface BookingTableProps {
  bookings: any[];
  isLoading: boolean;
  isError: boolean;
  onDelete: (id: string) => void;
}

export default function BookingTable({
  bookings,
  isLoading,
  isError,
  //   onDelete,
}: BookingTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Type</TableHead>
          <TableHead>Booking Date</TableHead>
          <TableHead>Schedule Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {/* Loading Skeleton */}
        {isLoading ? (
          <>
            {[...Array(5)].map((_, idx) => (
              <TableRow key={idx} className="animate-pulse">
                <TableCell className="py-5">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </TableCell>
                <TableCell className="py-5">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </TableCell>
                <TableCell className="py-5">
                  <div className="h-4 w-32 bg-gray-200 rounded"></div>
                </TableCell>
                <TableCell className="py-5">
                  <div className="h-4 w-20 bg-gray-200 rounded"></div>
                </TableCell>
                <TableCell className="py-5">
                  <div className="h-4 w-16 bg-gray-200 rounded"></div>
                </TableCell>
                <TableCell className="py-5">
                  <div className="h-4 w-24 bg-gray-200 rounded ml-auto"></div>
                </TableCell>
              </TableRow>
            ))}
          </>
        ) : isError ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-red-600">
              Something went wrong!
            </TableCell>
          </TableRow>
        ) : bookings.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6">
              No bookings found.
            </TableCell>
          </TableRow>
        ) : (
          bookings.map((order: any) => (
            <TableRow key={order.id} className="border-b">
              <TableCell>{order.consultation?.type || "N/A"}</TableCell>
              <TableCell>
                {new Date(order.bookingDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(order.startTime).toLocaleString()}
              </TableCell>
              <TableCell>{order.status}</TableCell>
              <TableCell>{order.amount} $</TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/user/all-booking/${order.id}`}>
                    <Button variant="link" className="h-auto font-normal">
                      <FaEye className="text-[#0066FF]" />
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
