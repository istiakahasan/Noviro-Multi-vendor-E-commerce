"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

type ResetValues = { password: string; confirm: string };

export default function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetValues>({
    defaultValues: { password: "", confirm: "" },
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = (data: ResetValues) => {
    if (data.password !== data.confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    console.log("RESET SUBMIT →", data);
    toast.success("Password updated!");
  };

  const password = watch("password");

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 text-center">
          <div className="text-xl font-semibold">Reset Your Password</div>
          <p className="mt-1 text-xs text-gray-500">Set a strong password</p>
        </div>

        {/* New Password */}
        <div className="mb-4">
          <label className="mb-1 block text-xs text-gray-600">New Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm outline-none focus:border-gray-900"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-rose-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="mb-6">
          <label className="mb-1 block text-xs text-gray-600">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm outline-none focus:border-gray-900"
              placeholder="••••••••"
              {...register("confirm", {
                required: "Confirm your password",
                validate: (v) => v === password || "Passwords do not match",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
              aria-label={showConfirm ? "Hide confirmation" : "Show confirmation"}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirm && (
            <p className="mt-1 text-xs text-rose-600">{errors.confirm.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-gray-900 py-2.5 text-sm font-medium text-white hover:opacity-95 disabled:opacity-60"
        >
          Save Change
        </button>
      </form>
    </div>
  );
}
