"use client";

import PageLoader from "@/app/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Eye, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  useCreateStaffMutation,
  useDeleteStaffMutation,
  useGetAllStaffsQuery,
  useUpdateStaffMutation,
} from "@/redux/features/staff-management/staffManagementApi";

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profilePic: string;
  Profile: any;
  createdAt: string;
  updatedAt: string;
}

interface DeleteModalState {
  isOpen: boolean;
  staffId: string;
  staffName: string;
}

interface EditModalState {
  isOpen: boolean;
  staff: Staff | null;
}

// Zod schema for CREATE staff
const createStaffSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  gender: z.string().min(1, "Gender is required"),
});

type CreateStaffFormData = z.infer<typeof createStaffSchema>;

// Zod schema for UPDATE staff (only editable fields)
const updateStaffSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
});

type UpdateStaffFormData = z.infer<typeof updateStaffSchema>;

const StaffPage = () => {
  const { data, isLoading, isError } = useGetAllStaffsQuery();
  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();
  const [createStaff, { isLoading: isCreating }] = useCreateStaffMutation();
  const [updateStaff, { isLoading: isUpdating }] = useUpdateStaffMutation();

  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    staffId: "",
    staffName: "",
  });

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<EditModalState>({
    isOpen: false,
    staff: null,
  });

  const staffs: Staff[] = data?.data || [];

  // ─── CREATE FORM ───
  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    formState: { errors: createErrors },
    reset: resetCreate,
    control: createControl,
  } = useForm<CreateStaffFormData>({
    resolver: zodResolver(createStaffSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
    },
  });

  // ─── UPDATE FORM ───
  const {
    register: registerUpdate,
    handleSubmit: handleUpdateSubmit,
    formState: { errors: updateErrors },
    reset: resetUpdate,
  } = useForm<UpdateStaffFormData>({
    resolver: zodResolver(updateStaffSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const openDeleteModal = (id: string, firstName: string, lastName: string) => {
    setDeleteModal({
      isOpen: true,
      staffId: id,
      staffName: `${firstName} ${lastName}`,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, staffId: "", staffName: "" });
  };

  const handleDelete = async () => {
    try {
      await deleteStaff(deleteModal.staffId).unwrap();
      toast.success(
        `Staff member ${deleteModal.staffName} deleted successfully!`,
      );
      closeDeleteModal();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete staff member");
    }
  };

  // Create submit
  const onCreateSubmit = async (formData: CreateStaffFormData) => {
    try {
      await createStaff(formData).unwrap();
      toast.success("Staff member created successfully!");
      setCreateModalOpen(false);
      resetCreate();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to create staff member");
      console.error("Create staff error:", err);
    }
  };

  // Open edit modal with pre-filled data
  const openEditModal = (staff: Staff) => {
    setEditModal({ isOpen: true, staff });
    resetUpdate({
      firstName: staff.firstName || "",
      lastName: staff.lastName || "",
      email: staff.email || "",
    });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, staff: null });
    resetUpdate();
  };

  // Update submit
  const onUpdateSubmit = async (formData: UpdateStaffFormData) => {
    if (!editModal.staff) return;

    try {
      await updateStaff({
        id: editModal.staff.id,
        body: formData,
      }).unwrap();

      toast.success("Staff updated successfully!");
      closeEditModal();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update staff");
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-600">
        Failed to load staff members.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
          Staff Management
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          View and manage all staff members
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm mb-2">Total Staff</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {staffs.length}
          </p>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600 text-sm mb-2">Active</p>
          <p className="text-2xl sm:text-3xl font-bold text-green-600">
            {staffs.length}
          </p>
        </div>
      </div>

      {/* Create Staff Button */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogTrigger asChild>
          <Button className="mb-6 flex items-center gap-2">
            <Plus size={18} />
            Create Staff
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Staff Member</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleCreateSubmit(onCreateSubmit)}
            className="space-y-4 mt-4"
          >
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  {...registerCreate("firstName")}
                  placeholder="Enter first name"
                />
                {createErrors.firstName && (
                  <p className="text-red-600 text-sm mt-1">
                    {createErrors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  {...registerCreate("lastName")}
                  placeholder="Enter last name"
                />
                {createErrors.lastName && (
                  <p className="text-red-600 text-sm mt-1">
                    {createErrors.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...registerCreate("email")}
                  placeholder="Enter email address"
                />
                {createErrors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {createErrors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  {...registerCreate("phone")}
                  placeholder="Enter phone number"
                />
                {createErrors.phone && (
                  <p className="text-red-600 text-sm mt-1">
                    {createErrors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <Controller
                  name="gender"
                  control={createControl}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {createErrors.gender && (
                  <p className="text-red-600 text-sm mt-1">
                    {createErrors.gender.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Staff"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="text-xs sm:text-sm font-semibold text-gray-700">
                  Profile
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-gray-700">
                  Name
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-gray-700">
                  Email
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-gray-700">
                  Role
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-gray-700">
                  Created Date
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-gray-700">
                  Updated Date
                </TableHead>
                <TableHead className="text-xs sm:text-sm font-semibold text-gray-700">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No staff members found.
                  </TableCell>
                </TableRow>
              ) : (
                staffs.map((staff) => (
                  <TableRow
                    key={staff.id}
                    className="hover:bg-gray-50 border-b border-gray-200 last:border-b-0"
                  >
                    {/* Profile Picture */}
                    <TableCell className="px-4 py-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                        {staff.profilePic ? (
                          <Image
                            src={staff.profilePic}
                            alt={`${staff.firstName} ${staff.lastName}`}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600">
                            {staff.firstName.charAt(0)}
                            {staff.lastName.charAt(0)}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Name */}
                    <TableCell className="px-4 py-4">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        {staff.firstName} {staff.lastName}
                      </p>
                    </TableCell>

                    {/* Email */}
                    <TableCell className="px-4 py-4">
                      <p className="text-xs sm:text-sm text-gray-600 break-all">
                        {staff.email}
                      </p>
                    </TableCell>

                    {/* Role */}
                    <TableCell className="px-4 py-4">
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        {staff.role}
                      </Badge>
                    </TableCell>

                    {/* Created Date */}
                    <TableCell className="px-4 py-4">
                      <p className="text-xs sm:text-sm text-gray-600">
                        {format(new Date(staff.createdAt), "MMM dd, yyyy")}
                      </p>
                    </TableCell>

                    {/* Updated Date */}
                    <TableCell className="px-4 py-4">
                      <p className="text-xs sm:text-sm text-gray-600">
                        {format(new Date(staff.updatedAt), "MMM dd, yyyy")}
                      </p>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-4 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin-dashboard/staff-management/${staff.id}`}
                        >
                          <button className="p-2 hover:bg-blue-100 rounded transition-colors text-blue-600">
                            <Eye size={18} />
                          </button>
                        </Link>

                        <button
                          onClick={() => openEditModal(staff)}
                          className="p-2 hover:bg-green-100 rounded transition-colors text-green-600"
                        >
                          <Pencil size={18} />
                        </button>

                        <button
                          onClick={() =>
                            openDeleteModal(
                              staff.id,
                              staff.firstName,
                              staff.lastName,
                            )
                          }
                          className="p-2 hover:bg-red-100 rounded transition-colors text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={isDeleting}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Staff Member
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{deleteModal.staffName}</span>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={closeDeleteModal}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Staff Modal */}
      <Dialog
        open={editModal.isOpen}
        onOpenChange={(open) => {
          if (!open) closeEditModal();
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleUpdateSubmit(onUpdateSubmit)}
            className="space-y-4 mt-4"
          >
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="edit-firstName">First Name</Label>
                <Input
                  id="edit-firstName"
                  {...registerUpdate("firstName")}
                  placeholder="Enter first name"
                />
                {updateErrors.firstName && (
                  <p className="text-red-600 text-sm mt-1">
                    {updateErrors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input
                  id="edit-lastName"
                  {...registerUpdate("lastName")}
                  placeholder="Enter last name"
                />
                {updateErrors.lastName && (
                  <p className="text-red-600 text-sm mt-1">
                    {updateErrors.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  {...registerUpdate("email")}
                  placeholder="Enter email address"
                />
                {updateErrors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {updateErrors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={closeEditModal}>
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Staff"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StaffPage;
