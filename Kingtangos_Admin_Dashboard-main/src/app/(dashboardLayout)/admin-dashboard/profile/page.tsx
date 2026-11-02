// "use client";
// import { useGetUserQuery } from '@/redux/features/user/userApi';

// const ProfilePage = () => {
//     const {data,isLoading,isError} = useGetUserQuery()
//     console.log(data);

//     return (
//         <div>
//             hello
//         </div>
//     );
// };

// export default ProfilePage;


"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, User, Camera, Save, X } from "lucide-react";
import Image from "next/image";

import {
  useGetUserQuery,
  useUpdateProfileMutation,
} from "@/redux/features/user/userApi";

// ────────────────────────────────────────────────
// Form validation schema
const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

// ────────────────────────────────────────────────
const ProfilePage = () => {
  const { data, isLoading, isError, error } = useGetUserQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const user = data?.data;

  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  // Load user data into form
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
      setPreviewImage(user.profilePic || null);
    }
  }, [user, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onSubmit = handleSubmit(async (formValues) => {
    try {
      // Build payload object
      const updateData = {
        firstName: formValues.firstName.trim(),
        lastName: formValues.lastName.trim(),
        email: formValues.email.trim(),
      };

      // Remove empty fields if you don't want to send them
      const cleanData = Object.fromEntries(
        Object.entries(updateData).filter(([_, v]) => v !== "")
      );

      // If no changes and no file → early exit
      if (Object.keys(cleanData).length === 0 && !selectedFile) {
        toast.info("No changes to save");
        return;
      }

      const formPayload = new FormData();

      // Backend expects 'data' to be a JSON string
      formPayload.append("data", JSON.stringify(cleanData));

      // Add profile picture if selected
      if (selectedFile) {
        formPayload.append("file", selectedFile);
      }

      // Debug output (remove in production)
      console.log("Submitting FormData:");
      console.log("data JSON:", JSON.stringify(cleanData, null, 2));
      if (selectedFile) {
        console.log("File:", selectedFile.name, `(${selectedFile.size} bytes)`);
      }

      await updateProfile({ formData: formPayload }).unwrap();

      toast.success("Profile updated successfully!");
      setIsEditing(false);
      setSelectedFile(null);
    } catch (err: any) {
      console.error("Update failed:", err);
      toast.error(err?.data?.message || "Failed to update profile");
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-600">
        <p className="text-lg font-medium">Failed to load profile</p>
        <p className="text-sm mt-2">
          {(error as any)?.data?.message || "Something went wrong"}
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500">
        No user data available
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow rounded-xl overflow-hidden">
        {/* Header gradient */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />

        <div className="relative px-6 pb-8">
          {/* Profile picture */}
          <div className="absolute -top-16 left-6 group">
            <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-100 shadow-lg">
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt={`${user.firstName} ${user.lastName}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}

              {isEditing && (
                <label
                  htmlFor="profile-upload"
                  className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Camera className="w-8 h-8 text-white" />
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Edit / Save controls */}
          <div className="absolute top-6 right-6 flex gap-3">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedFile(null);
                    setPreviewImage(user.profilePic || null);
                    reset();
                  }}
                  className="flex items-center gap-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium transition-colors"
                >
                  <X size={16} />
                  Cancel
                </button>

                <button
                  type="submit"
                  form="profile-form"
                  disabled={isUpdating}
                  className="flex items-center gap-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium disabled:opacity-60 transition-colors"
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Save Changes
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Content */}
          <div className="pt-20">
            {isEditing ? (
              // ─── Edit Form ───
              <form id="profile-form" onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      {...register("firstName")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    {errors.firstName && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      {...register("lastName")}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    {errors.lastName && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                  {errors.email && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </form>
            ) : (
              // ─── View Mode ───
              <>
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-lg text-indigo-600 font-medium mt-1">
                  {user.role.replace("_", " ")}
                </p>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1 text-gray-900">{user.email}</p>
                    </div>

                    {user.Profile && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Additional Profile
                        </h3>
                        <p className="mt-1 text-gray-900">
                          {JSON.stringify(user.Profile)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {user?.stores && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Stores
                        </h3>
                        <p className="mt-1 text-gray-900">
                          {JSON.stringify(user.stores)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Footer */}
            {/* <div className="mt-10 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
              
               Member since {new Date().toLocaleDateString()}
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;