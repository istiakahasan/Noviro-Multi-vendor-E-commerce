"use client";

import PageLoader from "@/app/loading";
import {
  useGetAllUsersQuery,
  useUpdateSellerStatusMutation,
} from "@/redux/features/userManagement/userManagementApi";
import { useDeleteSpecialistMutation, useDeleteUserMutation } from "@/redux/features/user/userApi";
import { Eye, Filter, MoreVertical, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner"; // assuming sonner is installed
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Seller = {
  id: string;
  storeName: string;
  owner: string;
  email: string;
  phone?: string;
  joined: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
};

const statusColors: Record<Seller["status"], string> = {
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-yellow-100 text-yellow-700",
  SUSPENDED: "bg-red-100 text-red-700",
};

const typeOptions = [
  { label: "Seller", link: "/admin-dashboard/user-management/seller" },
  {
    label: "Specialist",
    link: "/admin-dashboard/user-management/seller/specialist",
  },
  {
    label: "Customer",
    link: "/admin-dashboard/user-management/seller/customer",
  },
];

const Page = () => {
  const router = useRouter();

  const [sellers, setSellers] = useState<Seller[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("Specialist");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [specialistToDelete, setSpecialistToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const filterOptions = ["All", "Active", "Pending", "Suspended"];

  // APIs
  const { data, isLoading, isError } = useGetAllUsersQuery();
  const [updateSellerStatus, { isLoading: isUpdating }] =
    useUpdateSellerStatusMutation();
  const [deleteSpecialist, { isLoading: isDeleting }] =
    useDeleteUserMutation();
    // useDeleteSpecialistMutation();

  console.log("all users", data);

  // Build sellers when API loads
  useEffect(() => {
    if (data?.data) {
      const sellerUsers = data.data.filter((u) => u.role === "SPECIALIST");
      console.log(sellerUsers);
      const mapped: Seller[] = sellerUsers.map((u) => ({
        id: u.id,
        storeName: "Demo Store need data from backend",
        owner: `${u.firstName} ${u.lastName}`.trim(),
        email: u.email,
        joined: new Date(u.createdAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        status: u.status,
      }));

      setSellers(mapped);
    }
  }, [data]);

  console.log(sellers);

  const handleTypeSelect = (option: { label: string; link: string }) => {
    setTypeFilter(option.label);
    setShowTypeMenu(false);
    router.push(option.link);
  };

  // Real API calls for status change
  const handleSetActive = async (sellerId: string, sellerName: string) => {
    try {
      await updateSellerStatus({
        id: sellerId,
        status: "ACTIVE",
      }).unwrap();

      toast.success(`Seller ${sellerName} is now ACTIVE`);
      setShowActionMenu(null);
    } catch (err: any) {
      toast.error(
        "Failed to activate seller: " + (err?.data?.message || err.message),
      );
    }
  };

  const handleSetInactive = async (sellerId: string, sellerName: string) => {
    try {
      await updateSellerStatus({
        id: sellerId,
        status: "INACTIVE",
      }).unwrap();

      toast.success(`Seller ${sellerName} is now INACTIVE`);
      setShowActionMenu(null);
    } catch (err: any) {
      toast.error(
        "Failed to deactivate seller: " + (err?.data?.message || err.message),
      );
    }
  };

  const handleBanSeller = async (sellerId: string, sellerName: string) => {
    try {
      await updateSellerStatus({
        id: sellerId,
        status: "SUSPENDED",
      }).unwrap();

      toast.success(`Seller ${sellerName} has been SUSPENDED`);
      setShowActionMenu(null);
    } catch (err: any) {
      toast.error(
        "Failed to suspend seller: " + (err?.data?.message || err.message),
      );
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setSpecialistToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  const confirmDeleteSpecialist = async () => {
    if (!specialistToDelete) return;

    try {
      await deleteSpecialist(specialistToDelete.id).unwrap();
      toast.success(
        `Specialist ${specialistToDelete.name} has been deleted successfully`,
      );
      setDeleteModalOpen(false);
      setSpecialistToDelete(null);
    } catch (err: any) {
      toast.error(
        "Failed to delete specialist: " + (err?.data?.message || err.message),
      );
    }
  };

  // Filtering logic (unchanged)
  const filteredSellers = sellers
    .filter(
      (s) =>
        s.owner.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        s.storeName.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((s) => {
      const map: Record<string, (seller: Seller) => boolean> = {
        All: () => true,
        Active: (s) => s.status === "ACTIVE",
        Pending: (s) => s.status === "INACTIVE",
        Suspended: (s) => s.status === "SUSPENDED",
      };
      return map[filter]?.(s) ?? true;
    })
    .sort(
      (a, b) => new Date(b.joined).getTime() - new Date(a.joined).getTime(),
    );

  if (isLoading) return <PageLoader />;
  if (isError)
    return <div className="text-center text-red-600">Something went wrong</div>;

  return (
    <div className="p-4 sm:p-6 container mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Specialist Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all platform users including sellers, specialist and
            customers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-50 transition"
            >
              <Filter size={16} />
              {filter}
            </button>

            {showFilterMenu && (
              <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                {filterOptions.map((option) => (
                  <li key={option}>
                    <button
                      onClick={() => {
                        setFilter(option);
                        setShowFilterMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm transition"
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Type dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowTypeMenu(!showTypeMenu)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm shadow-sm hover:bg-gray-50 transition"
            >
              {typeFilter} ▼
            </button>

            {showTypeMenu && (
              <ul className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                {typeOptions.map((option) => (
                  <li key={option.label}>
                    <button
                      onClick={() => handleTypeSelect(option)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm transition"
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, email or store..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {filteredSellers.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No sellers found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredSellers.map((s, i) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-600">{i + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {s.owner}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {s.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {s.joined}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${statusColors[s.status]}`}
                      >
                        {s.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 flex items-center gap-3 relative">
                      <button
                        onClick={() =>
                          router.push(
                            `/admin-dashboard/user-management/seller/customer/${s.id}`,
                          )
                        }
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-blue-50 transition text-gray-600 hover:text-blue-600"
                        title="View Profile"
                      >
                        <Eye size={18} />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(s.id, s.owner)}
                        disabled={isDeleting}
                        className="p-1 rounded-full hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete Specialist"
                      >
                        <Trash size={18} color="red" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete specialist{" "}
              <span className="font-semibold text-gray-900">
                {specialistToDelete?.name}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={confirmDeleteSpecialist}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Specialist"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Page;
