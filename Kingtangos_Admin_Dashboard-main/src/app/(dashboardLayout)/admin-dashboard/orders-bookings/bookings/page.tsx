"use client";

import PageLoader from "@/app/loading";
import { useGetAllBookingsQuery } from "@/redux/features/order-bookings/orderBookingsApi";
import { ArrowDown, Eye, Filter } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

// === Types ===
interface TransformedBooking {
  id: string;
  bookingId: string;
  type: "Service" | "Consultation";
  specialist: string;
  customer: string;
  service: string;
  date: string;
  timeSlot: string;
  amount: string;
  status: string;
  statusColor: string;
}

// === Component ===
const Page = () => {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState("Bookings");
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  >("All");
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const typeOptions = ["Bookings", "Products","Custom Orders"] as const;
  const statusOptions = [
    "All",
    "PENDING",
    "CONFIRMED",
    "CANCELLED",
    "COMPLETED",
  ] as const;

  const {
    data: bookingsData,
    isLoading,
    isError,
  } = useGetAllBookingsQuery(undefined);

  // Navigation for type filter
  const handleTypeChange = (option: (typeof typeOptions)[number]) => {
    setTypeFilter(option);
    if (option === "Products") {
      router.push(`/admin-dashboard/orders-bookings`);
    } else {
      router.push(`/admin-dashboard/orders-bookings/${option.toLowerCase()}`);
    }
    setShowTypeMenu(false);
  };

  const handleStatusChange = (status: (typeof statusOptions)[number]) => {
    setStatusFilter(status);
    setShowStatusMenu(false);
  };

  // SAFE DATA TRANSFORMATION
  const transformedBookings = useMemo((): TransformedBooking[] => {
    if (!bookingsData?.data) return [];

    return bookingsData.data.map((booking: any): TransformedBooking => {
      const bookingDate = booking.bookingDate
        ? new Date(booking.bookingDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "N/A";

      const startTime = booking.startTime
        ? new Date(booking.startTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A";

      const endTime = booking.endTime
        ? new Date(booking.endTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "N/A";

      const detailData = booking.service || booking.consultation;
      const typeLabel = booking.service ? "Service" : "Consultation";

      let specialistName = "N/A";
      if (booking.specialist) {
        specialistName = `${booking.specialist.firstName} ${booking.specialist.lastName}`;
      } else if (booking.isProvidedByOwner && detailData?.store) {
        specialistName = `Owner (${detailData.store.name})`;
      }

      return {
        id: booking.id,
        bookingId: `#${booking.id.slice(-6).toUpperCase()}`, // Using short ID for display
        type: typeLabel,
        specialist: specialistName,
        customer: booking.user
          ? `${booking.user.firstName} ${booking.user.lastName}`
          : "Unknown Customer",
        service: detailData?.name ?? "Unknown",
        date: bookingDate,
        timeSlot: `${startTime} - ${endTime}`,
        amount: `€ ${(booking.amount || detailData?.price || 0).toLocaleString()}`,
        status: booking.status,
        statusColor:
          booking.status === "COMPLETED"
            ? "bg-green-100 text-green-800"
            : booking.status === "PENDING"
              ? "bg-orange-100 text-orange-800"
              : booking.status === "CANCELLED"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800",
      };
    });
  }, [bookingsData]);

  // Frontend filtering
  const filteredBookings = useMemo(() => {
    let result = transformedBookings;

    if (statusFilter !== "All") {
      result = result.filter((b) => b.status === statusFilter);
    }

    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.customer.toLowerCase().includes(query) ||
          b.specialist.toLowerCase().includes(query) ||
          b.service.toLowerCase().includes(query) ||
          b.bookingId.toLowerCase().includes(query) ||
          b.type.toLowerCase().includes(query),
      );
    }

    return result;
  }, [transformedBookings, statusFilter, searchTerm]);

  if (isLoading) return <PageLoader />;

  return (
    <div className="rounded-xl container mx-auto shadow-sm p-6 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Order & Booking Management
        </h2>
        <p className="text-gray-600">
          Monitor and manage all product orders, service bookings and
          subscription activities.
        </p>
      </div>

      {/* --- Filters --- */}
      <div className="flex items-center mb-6 gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search by name, service or booking ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg min-w-64"
        />

        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 flex items-center gap-1"
          >
            {statusFilter}
            <ArrowDown size={16} />
          </button>
          {showStatusMenu && (
            <ul className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
              {statusOptions.map((status) => (
                <li key={status}>
                  <button
                    onClick={() => handleStatusChange(status)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    {status}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Type Filter */}
        <div className="relative">
          <button
            onClick={() => setShowTypeMenu(!showTypeMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg"
          >
            <Filter size={16} />
            {typeFilter}
          </button>
          {showTypeMenu && (
            <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
              {typeOptions.map((option) => (
                <li key={option}>
                  <button
                    onClick={() => handleTypeChange(option)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* --- Table --- */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs text-gray-500">
                Booking ID
              </th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">
                Specialist
              </th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">
                Service
              </th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">
                Booking Date
              </th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">
                Time Slot
              </th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs text-gray-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {isError ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-red-500">
                  Error loading bookings. Please try again.
                </td>
              </tr>
            ) : filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No bookings found.
                </td>
              </tr>
            ) : (
              filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm font-medium">
                    {booking.bookingId}
                  </td>
                  <td className="px-4 py-4 text-sm">{booking.specialist}</td>
                  <td className="px-4 py-4 text-sm">{booking.customer}</td>
                  <td className="px-4 py-4 text-sm">{booking.service}</td>
                  <td className="px-4 py-4 text-sm">{booking.date}</td>
                  <td className="px-4 py-4 text-sm">{booking.timeSlot}</td>
                  <td className="px-4 py-4 text-sm">{booking.amount}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${booking.statusColor}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 flex items-center gap-2">
                    <Link
                      href={`/admin-dashboard/orders-bookings/bookings/${booking.id}`}
                    >
                      <Eye className="w-4 h-4 text-blue-500 cursor-pointer" />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
