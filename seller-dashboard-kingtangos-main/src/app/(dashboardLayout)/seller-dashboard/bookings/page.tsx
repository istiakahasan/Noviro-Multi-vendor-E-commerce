/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

// import PageLoading from "@/components/shared/PageLoading";
// import PageLoading from "@/components/ui/Loading";
import { useGetMyBookingsAsStoreOwnerQuery } from "@/redux/api/bookings/bookingsApi";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

// Update types to match actual API response
interface BookingUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic?: string;
}

interface BookingService {
  id: string;
  name: string;
  price: number;
  slotDuration: number;
}

interface BookingConsultation {
  id: string;
  title?: string;
  description?: string;
  user?: BookingUser;
  service?: BookingService;
}

interface BookingData {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  serviceId: string | null;
  consultationId: string | null;
  user?: BookingUser | null;
  service?: BookingService | null;
  consultation?: BookingConsultation | null;
  // Add other fields your API returns
  [key: string]: any;
}

type BookingStatus =
  | "Scheduled"
  | "Completed"
  | "Cancelled"
  | "Pending"
  | "Confirmed";

const statusColors: Record<BookingStatus, string> = {
  Scheduled: "bg-green-100 text-green-700",
  Completed: "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-700",
  Pending: "bg-orange-100 text-orange-700",
  Confirmed: "bg-green-100 text-green-700",
};

const statusMap: Record<string, BookingStatus> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  SCHEDULED: "Scheduled",
};

export default function Page() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Bookings");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useGetMyBookingsAsStoreOwnerQuery(
    { page, limit: 10 },
    { refetchOnMountOrArgChange: true },
  );

  console.log("Raw API data ===========", data);

  // Transform API data with proper null checking
  const bookings = useMemo(() => {
    if (!data?.data) return [];

    return data.data
      .filter((item: BookingData) => {
        // Check if item has necessary data - be less strict
        // Item can have user directly OR through consultation
        const hasUser = item.user || item.consultation?.user;

        // Item can have service directly OR through consultation
        const hasService = item.service || item.consultation?.service;

        // Don't filter out items - try to extract data from nested structures
        return item.startTime && item.endTime;
      })
      .map((item: BookingData) => {
        const start = new Date(item.startTime);
        const end = new Date(item.endTime);

        // Extract user - check direct property first, then nested
        const userObj = item.user || item.consultation?.user;
        const customer = userObj
          ? `${userObj.firstName} ${userObj.lastName}`.trim()
          : "Unknown Customer";

        // Extract service - check direct property first, then nested
        const serviceObj = item.service || item.consultation?.service;
        const serviceName = serviceObj?.name || "Unknown Service";

        const dateTime =
          start.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }) +
          " at " +
          start.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });

        const minutes = Math.round((end.getTime() - start.getTime()) / 60000);
        const duration =
          minutes >= 60
            ? `${Math.floor(minutes / 60)}h ${minutes % 60 > 0 ? `${minutes % 60}m` : ""}`.trim()
            : `${minutes} min`;

        return {
          id: item.id,
          customer,
          serviceName,
          duration,
          dateTime,
          displayStatus: statusMap[item.status] || ("Pending" as BookingStatus),
          rawDate: start,
        };
      });
  }, [data?.data]);

  console.log("Transformed bookings ===========", bookings);

  const filteredBookings = useMemo(() => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return bookings
      .filter((b) => {
        const query = search.toLowerCase();
        return (
          b.id.toLowerCase().includes(query) ||
          b.customer.toLowerCase().includes(query) ||
          b.serviceName.toLowerCase().includes(query)
        );
      })
      .filter((b) => {
        const bookingDate = new Date(b.rawDate);
        bookingDate.setHours(0, 0, 0, 0);

        switch (filter) {
          case "Today":
            return bookingDate.getTime() === today.getTime();
          case "Upcoming":
            return (
              ["Confirmed", "Pending", "Scheduled"].includes(b.displayStatus) &&
              b.rawDate >= now
            );
          case "Completed":
            return b.displayStatus === "Completed";
          case "This Week":
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            return bookingDate >= weekAgo && bookingDate <= today;
          default:
            return true;
        }
      })
      .sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime());
  }, [bookings, search, filter]);

  console.log("Filtered bookings ===========", filteredBookings);

  const meta = data?.meta;
  const totalPages = meta?.totalPage || 1;
  const currentPage = meta?.page || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // if (isLoading) return <PageLoading />;
  if (error)
    return (
      <div className="p-8 text-center text-red-600">
        Failed to load bookings
      </div>
    );

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto bg-gray-50 min-h-[calc(100vh-150px)] rounded-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6  flex-col md:flex-row gap-4">
        <div>
          <h1 className="lg:text-3xl md:text-2xl text-xl font-bold text-gray-800">My Bookings</h1>
          <p className="text-gray-500 text-sm">
            Manage your appointments and consultations
          </p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-50"
          >
            {filter}
          </button>
          {showFilterMenu && (
            <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
              {[
                "All Bookings",
                "Today",
                "Upcoming",
                "Completed",
                "This Week",
              ].map((option) => (
                <li key={option}>
                  <button
                    onClick={() => {
                      setFilter(option);
                      setShowFilterMenu(false);
                    }}
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

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by ID, customer, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">
                  Booking ID
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">
                  Customer
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">
                  Service
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">
                  Duration
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">
                  Date & Time
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 text-xs font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">
                    {b.id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {b.customer}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {b.serviceName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {b.duration}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {b.dateTime}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[b.displayStatus]}`}
                    >
                      {b.displayStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {b.id && (
                        <button
                          onClick={() =>
                            router.push(
                              `/specialist-dashboard/bookings/${b.id}`,
                            )
                          }
                          className="text-blue-600 hover:bg-blue-50 p-1.5 rounded transition"
                          title="View"
                        >
                          <Eye size={16} />
                        </button>
                      )}
                      {/* <button
                        onClick={() => console.log("Delete:", b.id)}
                        className="text-red-600 hover:bg-red-50 p-1.5 rounded transition"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="p-8 text-center text-gray-500 text-sm">
            No bookings found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing page <span className="font-medium">{currentPage}</span> of{" "}
            <span className="font-medium">{totalPages}</span> ({meta?.total}{" "}
            total)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  p === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
