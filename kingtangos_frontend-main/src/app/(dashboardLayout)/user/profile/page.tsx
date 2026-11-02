/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAuthMeQuery,
  useUserProfileUpdateMutation,
} from "@/redux/api/userDashbord/userDashbordApi";
import { Home, Briefcase, Edit, Loader2, Calendar, Camera } from "lucide-react";
import { format, parse } from "date-fns";
import { toast } from "sonner";

enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  CUSTOM = "CUSTOM",
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  gender: Gender | "";
  birthDate: string;
  homeAddress: string;
  officeAddress: string;
}

const ProfilePage = () => {
  const {
    data: authData,
    isLoading: loadingUser,
    isError,
    refetch,
  } = useAuthMeQuery(undefined);
  const [updateProfile, { isLoading: isUpdating }] =
    useUserProfileUpdateMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [openEdit, setOpenEdit] = useState(false);

  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    gender: "",
    birthDate: "",
    homeAddress: "",
    officeAddress: "",
  });

  const user = authData?.data;
  const profile = user?.Profile;

  // Populate form when opening edit modal
  useEffect(() => {
    if (openEdit && user) {
      setForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || profile?.phone || "",
        gender: (profile?.gender as Gender) || "",
        birthDate: profile?.birthDate
          ? format(new Date(profile.birthDate), "dd/MM/yyyy")
          : "",
        homeAddress: profile?.homeAddress || "",
        officeAddress: profile?.officeAddress || "",
      });
      setImagePreview(user.profilePic || null);
      setSelectedFile(null);
    }
  }, [openEdit, user, profile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    toast.success("Image ready – save to upload");
  };

  const formatDateForAPI = (dateStr: string): string | undefined => {
    if (!dateStr.trim()) return undefined;
    try {
      const date = parse(dateStr, "dd/MM/yyyy", new Date());
      return isNaN(date.getTime()) ? undefined : date.toISOString();
    } catch {
      return undefined;
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    const payload: any = {};

    if (form.firstName.trim() && form.firstName !== user?.firstName)
      payload.firstName = form.firstName.trim();
    if (form.lastName.trim() && form.lastName !== user?.lastName)
      payload.lastName = form.lastName.trim();
    if (form.phone.trim() && form.phone !== (user?.phone || profile?.phone))
      payload.phone = form.phone.trim();
    if (form.gender && form.gender !== profile?.gender)
      payload.gender = form.gender;
    if (form.homeAddress.trim() !== (profile?.homeAddress || ""))
      payload.homeAddress = form.homeAddress.trim();
    if (form.officeAddress.trim() !== (profile?.officeAddress || ""))
      payload.officeAddress = form.officeAddress.trim();

    const isoDate = formatDateForAPI(form.birthDate);
    const currentDate = profile?.birthDate
      ? new Date(profile.birthDate).toISOString()
      : null;
    if (isoDate !== currentDate) payload.birthDate = isoDate || null;

    if (Object.keys(payload).length > 0) {
      formData.append("data", JSON.stringify(payload));
    }
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    if (!formData.has("data") && !formData.has("file")) {
      toast.info("No changes detected");
      setOpenEdit(false);
      return;
    }

    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
      refetch(); // This is critical: refresh latest data
      setOpenEdit(false);
      setSelectedFile(null);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-red-600 text-lg">Failed to load profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Profile Card */}
        <Card className="p-8 shadow-lg relative">
          <button
            onClick={() => setOpenEdit(true)}
            className="absolute top-6 right-6 flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </button>

          {/* Profile Display */}
          <div className="text-center">
            <Image
              src={user.profilePic || "/default-avatar.png"}
              alt="Profile"
              width={140}
              height={140}
              className="rounded-full object-cover mx-auto border-4 border-white shadow-xl"
            />
            <h2 className="mt-6 text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-500">{user.email}</p>
          </div>

          <div className="mt-8 space-y-5 text-sm">
            {(user.phone || profile?.phone) && (
              <div className="flex justify-between">
                <span className="font-medium">Phone</span>
                <span className="text-gray-600">
                  {user.phone || profile?.phone}
                </span>
              </div>
            )}
            {profile?.gender && (
              <div className="flex justify-between">
                <span className="font-medium">Gender</span>
                <span className="text-gray-600">{profile.gender}</span>
              </div>
            )}
            {profile?.birthDate && (
              <div className="flex justify-between">
                <span className="font-medium">Birth Date</span>
                <span className="text-gray-600">
                  {format(new Date(profile.birthDate), "dd/MM/yyyy")}
                </span>
              </div>
            )}
            {profile?.homeAddress && (
              <div className="flex items-start gap-3">
                <Home className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium">Home</p>
                  <p className="text-gray-600 text-sm">{profile.homeAddress}</p>
                </div>
              </div>
            )}
            {profile?.officeAddress && (
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Office</p>
                  <p className="text-gray-600 text-sm">
                    {profile.officeAddress}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Right: Addresses */}
        <Card className="lg:col-span-2 p-8">
          <h3 className="text-2xl font-bold mb-8">Saved Addresses</h3>
          <div className="space-y-6">
            {profile?.homeAddress && (
              <div className="flex items-center gap-5 p-5 bg-blue-50 rounded-lg">
                <div className="p-3 bg-blue-200 rounded-full">
                  <Home className="w-6 h-6 text-blue-700" />
                </div>
                <div>
                  <h4 className="font-semibold">Home</h4>
                  <p className="text-gray-600">{profile.homeAddress}</p>
                </div>
              </div>
            )}
            {profile?.officeAddress && (
              <div className="flex items-center gap-5 p-5 bg-green-50 rounded-lg">
                <div className="p-3 bg-green-200 rounded-full">
                  <Briefcase className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h4 className="font-semibold">Office</h4>
                  <p className="text-gray-600">{profile.officeAddress}</p>
                </div>
              </div>
            )}
            {!profile?.homeAddress && !profile?.officeAddress && (
              <p className="text-center text-gray-500 py-12">
                No addresses saved yet.
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Edit Modal */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Profile</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-6 py-4">
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src={imagePreview || user.profilePic || "/default-avatar.png"}
                  alt="Profile"
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-blue-600 p-3 rounded-full shadow-lg hover:bg-blue-700 text-white"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>First Name</Label>
                <Input
                  value={form.firstName}
                  onChange={(e) =>
                    setForm({ ...form, firstName: e.target.value })
                  }
                  placeholder="First Name"
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  value={form.lastName}
                  onChange={(e) =>
                    setForm({ ...form, lastName: e.target.value })
                  }
                  placeholder="Last Name"
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+88017..."
                />
              </div>
              <div>
                <Label>Gender</Label>
                <select
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.gender}
                  onChange={(e) =>
                    setForm({ ...form, gender: e.target.value as Gender })
                  }
                >
                  <option value="">Select Gender</option>
                  <option value={Gender.MALE}>Male</option>
                  <option value={Gender.FEMALE}>Female</option>
                  <option value={Gender.CUSTOM}>Custom</option>
                </select>
              </div>
              <div>
                <Label>Date of Birth</Label>
                <div className="relative">
                  <Input
                    value={form.birthDate}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "").slice(0, 8);
                      if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
                      if (v.length >= 6) v = v.slice(0, 5) + "/" + v.slice(5);
                      setForm({ ...form, birthDate: v });
                    }}
                    placeholder="DD/MM/YYYY"
                    maxLength={10}
                  />
                  <Calendar className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div>
                <Label>Home Address</Label>
                <Input
                  value={form.homeAddress}
                  onChange={(e) =>
                    setForm({ ...form, homeAddress: e.target.value })
                  }
                  placeholder="House, Road, City"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Office Address</Label>
                <Input
                  value={form.officeAddress}
                  onChange={(e) =>
                    setForm({ ...form, officeAddress: e.target.value })
                  }
                  placeholder="Office, Building, Area"
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenEdit(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfilePage;
