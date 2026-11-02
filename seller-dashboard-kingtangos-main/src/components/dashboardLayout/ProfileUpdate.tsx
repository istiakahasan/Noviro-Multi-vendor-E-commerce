"use client";

import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { useGetMeQuery, useUpdateUserMutation } from "@/redux/api/authApi";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  phone: string;
  gender: "MALE" | "FEMALE" | "CUSTOM";
  homeAddress: string;
  officeAddress: string;
  birthDate: string;
}

const formatDateForInput = (iso?: string): string => {
  if (!iso) return "";
  return iso.split("T")[0];
};

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
    {children}
  </h3>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-slate-300 rounded-xl ${className}`} />
);

const ProfileSkeleton = () => (
  <div className="space-y-6">
    <div className="bg-gray-100 border border-gray-300 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
      <Skeleton className="w-24 h-24 !rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-3 w-full">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-6 w-24 rounded-lg" />
      </div>
    </div>
    {[4, 3, 2].map((cols, i) => (
      <div key={i} className="bg-gray-100 border border-gray-300 rounded-2xl p-6 space-y-5">
        <Skeleton className="h-3 w-32" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[...Array(cols)].map((_, j) => <Skeleton key={j} className="h-12" />)}
        </div>
      </div>
    ))}
  </div>
);

const ProfileSetting = () => {
  const { data: meData, isLoading: isFetching, isError } = useGetMeQuery(undefined);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const user = meData?.data;

  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      gender: "MALE",
      homeAddress: "",
      officeAddress: "",
      birthDate: "",
    },
  });

  // Sync form + preview once user data arrives
  useEffect(() => {
    if (user) {
      setPreview(user.profilePic || "");
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.Profile?.phone || "",
        gender: user.Profile?.gender || "MALE",
        homeAddress: user.Profile?.homeAddress || "",
        officeAddress: user.Profile?.officeAddress || "",
        birthDate: formatDateForInput(user.Profile?.birthDate),
      });
    }
  }, [user, reset]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFileError("Image must be under 5MB.");
      return;
    }
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setFileError("");
  };

  const onSubmit = async (data: ProfileFormData) => {
    setServerError("");

    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("phone", data.phone);
    formData.append("gender", data.gender);
    formData.append("homeAddress", data.homeAddress);
    formData.append("officeAddress", data.officeAddress);
    if (data.birthDate) {
      formData.append("birthDate", new Date(data.birthDate).toISOString());
    }
    if (imageFile) {
      formData.append("file", imageFile);
    }

    try {
      await updateUser(formData).unwrap();
      setSuccessMsg(true);
      setImageFile(null);
      setTimeout(() => setSuccessMsg(false), 3000);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setServerError(error?.data?.message || "Something went wrong. Please try again.");
    }
  };

  // ── Loading ──
  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 space-y-2">
            <Skeleton className="h-9 w-52" />
            <Skeleton className="h-4 w-80" />
          </div>
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  // ── Error ──
  if (isError || !user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-slate-300 font-semibold">Failed to load profile</p>
          <p className="text-slate-500 text-sm">Please refresh the page and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto bg-gray-100 md:py-12 md:px-12 p-3 rounded-lg">

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-black tracking-tight">
            Profile Settings
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your personal info, address and profile photo.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          <div className="bg-white border border-gray-300 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2 ring-offset-gray-100">
                {preview ? (
                  <Image
                    src={preview}
                    alt={`${user.firstName} ${user.lastName}`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-primary flex items-center justify-center text-black text-2xl font-bold">
                    {user.firstName?.[0]?.toUpperCase()}
                    {user.lastName?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary hover:bg-primary/80 rounded-full flex items-center justify-center shadow-lg transition-colors duration-200 cursor-pointer"
                aria-label="Upload new photo"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Identity */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-black">
                  {user.firstName} {user.lastName}
                </h2>
                {user.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary/15 text-primary border border-primary/30 px-2 py-0.5 rounded-full">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-slate-400">{user.email}</p>
              <span className="mt-2 inline-block text-[11px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg">
                {user.role?.replace(/_/g, " ")}
              </span>
              <div className="mt-3">
                {fileError ? (
                  <p className="text-xs text-red-400">{fileError}</p>
                ) : (
                  <p className="text-xs text-slate-500">
                    JPG, PNG or WEBP · Max 5 MB
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ── Personal Information (Now editable) ── */}
          <div className="bg-white border border-gray-300 rounded-2xl p-6">
            <SectionTitle>Personal Information</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* First Name - Editable */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="firstName" className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  {...register("firstName", {
                    required: "First name is required",
                    minLength: { value: 2, message: "First name is too short" },
                  })}
                  className={`bg-slate-100 border rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-100 outline-none focus:ring-2 transition-all duration-200 w-full
                    ${errors.firstName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 focus:border-primary focus:ring-indigo-500/20"
                    }`}
                />
                {errors.firstName && (
                  <span className="text-xs text-red-400">{errors.firstName.message}</span>
                )}
              </div>

              {/* Last Name - Editable */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lastName" className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  {...register("lastName", {
                    required: "Last name is required",
                    minLength: { value: 2, message: "Last name is too short" },
                  })}
                  className={`bg-slate-100 border rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-100 outline-none focus:ring-2 transition-all duration-200 w-full
                    ${errors.lastName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 focus:border-primary focus:ring-indigo-500/20"
                    }`}
                />
                {errors.lastName && (
                  <span className="text-xs text-red-400">{errors.lastName.message}</span>
                )}
              </div>

              {/* Email - Read Only */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Email Address
                </label>
                <div className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-400 select-none">
                  {user.email}
                </div>
              </div>

              {/* Role - Read Only */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="role" className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Role
                </label>
                <div className="bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-400 select-none">
                  {user.role?.replace(/_/g, " ")}
                </div>
              </div>
            </div>
            <p className="mt-4 text-xs text-slate-600">
              Email and role cannot be changed here. Contact support if needed.
            </p>
          </div>

          {/* ── Contact Details ── */}
          <div className="bg-white border border-gray-300 rounded-2xl p-6">
            <SectionTitle>Contact Details</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Phone Number */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="phone" className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="e.g. 01712345678"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^[0-9+\s\-()]{7,15}$/,
                      message: "Enter a valid phone number",
                    },
                  })}
                  className={`bg-slate-100 border rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-100 outline-none focus:ring-2 transition-all duration-200 w-full
                    ${errors.phone
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 focus:border-primary focus:ring-indigo-500/20"
                    }`}
                />
                {errors.phone && (
                  <span className="text-xs text-red-400">{errors.phone.message}</span>
                )}
              </div>

              {/* Gender */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="gender" className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Gender
                </label>
                <select
                  id="gender"
                  {...register("gender", {
                    required: "Please select a gender",
                  })}
                  className={`bg-slate-100 border rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:ring-2 transition-all duration-200 w-full appearance-none cursor-pointer
                    ${errors.gender
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 focus:border-primary focus:ring-indigo-500/20"
                    }`}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="CUSTOM">Custom</option>
                </select>
                {errors.gender && (
                  <span className="text-xs text-red-400">{errors.gender.message}</span>
                )}
              </div>

              {/* Date of Birth */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="birthDate" className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Date of Birth
                </label>
                <input
                  id="birthDate"
                  type="date"
                  {...register("birthDate", {
                    required: "Date of birth is required",
                    validate: (val) =>
                      new Date(val) < new Date() || "Date must be in the past",
                  })}
                  className={`bg-slate-100 border rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:ring-2 transition-all duration-200 w-full
                    ${errors.birthDate
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 focus:border-primary focus:ring-indigo-500/20"
                    }`}
                />
                {errors.birthDate && (
                  <span className="text-xs text-red-400">{errors.birthDate.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* ── Address ── */}
          <div className="bg-white border border-gray-300 rounded-2xl p-6">
            <SectionTitle>Address</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Home Address */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="homeAddress" className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Home Address
                </label>
                <input
                  id="homeAddress"
                  type="text"
                  placeholder="e.g. Dhaka, Bangladesh"
                  {...register("homeAddress", {
                    required: "Home address is required",
                    minLength: { value: 5, message: "Address is too short" },
                  })}
                  className={`bg-slate-100 border rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-100 outline-none focus:ring-2 transition-all duration-200 w-full
                    ${errors.homeAddress
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 focus:border-primary focus:ring-indigo-500/20"
                    }`}
                />
                {errors.homeAddress && (
                  <span className="text-xs text-red-400">{errors.homeAddress.message}</span>
                )}
              </div>

              {/* Office Address */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="officeAddress" className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Office Address
                </label>
                <input
                  id="officeAddress"
                  type="text"
                  placeholder="e.g. Gulshan, Dhaka"
                  {...register("officeAddress", {
                    required: "Office address is required",
                    minLength: { value: 5, message: "Address is too short" },
                  })}
                  className={`bg-slate-100 border rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-100 outline-none focus:ring-2 transition-all duration-200 w-full
                    ${errors.officeAddress
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                      : "border-slate-200 focus:border-primary focus:ring-indigo-500/20"
                    }`}
                />
                {errors.officeAddress && (
                  <span className="text-xs text-red-400">{errors.officeAddress.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* ── Feedback ── */}
          {serverError && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {serverError}
            </div>
          )}

          {successMsg && (
            <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm rounded-xl px-4 py-3">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Profile updated successfully!
            </div>
          )}

          {/* ── Submit ── */}
          <div className="flex justify-end pb-4">
            <button
              type="submit"
              disabled={isUpdating}
              className="inline-flex items-center gap-2.5 bg-primary hover:bg-primary/80 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-7 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-primary/30 cursor-pointer"
            >
              {isUpdating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetting;