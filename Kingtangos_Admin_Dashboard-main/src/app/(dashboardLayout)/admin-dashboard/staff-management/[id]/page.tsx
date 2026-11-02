// "use client";
// import { useGetSingleStaffQuery } from "@/redux/features/staff-management/staffManagementApi";
// import { useParams } from "next/navigation";

// const page = () => {
//   const { id } = useParams();
//   console.log(id);
//   const {data, isLoading, isError} = useGetSingleStaffQuery(id as string);
//   console.log(data);

//   return <div>hello from staff details {id}</div>;
// };

// export default page;

"use client";

import { useGetSingleStaffQuery, useResendSetPassEmailMutation } from "@/redux/features/staff-management/staffManagementApi";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import PageLoader from "@/app/loading";
import { format } from "date-fns";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
  role: string;
  status: string;
  isVerified: boolean;
  isResetPassword: boolean;
  canResetPassword: boolean;
  isResentOtp: boolean;
  isSubscribed: boolean;
  passwordChangedAt: string | null;
  planExpiration: string | null;
  resetPasswordOTP: string | null;
  resetPasswordOTPExpiresAt: string | null;
  sellerBalanceId: string | null;
  createdAt: string;
  updatedAt: string;
}

const StaffDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading, isError } = useGetSingleStaffQuery(id as string);
  const staff: any | undefined = data?.data;

  const [resendEmail, { isLoading: resendEmailIsLoading }] = useResendSetPassEmailMutation();

  const handleResendEmail = async (email: string) => {
    try {
      await resendEmail(email).unwrap();
      toast.success("Password reset email resent successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to resend password email");
      console.error("Resend error:", err);
    }
  };

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !staff) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center py-10 text-red-600">
          Failed to load staff details.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft size={20} />
          <span className="text-sm">Back</span>
        </button>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
          Staff Details
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          View detailed information about this staff member
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-4 sm:p-8">
          {/* Profile Header */}
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-8 pb-8 border-b border-gray-200">
              {/* Profile Picture */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center flex-shrink-0">
                {staff.profilePic ? (
                  <Image
                    src={staff.profilePic}
                    alt={`${staff.firstName} ${staff.lastName}`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl font-bold text-white">
                    {staff.firstName.charAt(0)}
                    {staff.lastName.charAt(0)}
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  {staff.firstName} {staff.lastName}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base mb-3">
                  {staff.email}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className={staff.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {staff.status}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-800">
                    {staff.role}
                  </Badge>
                  {staff.isVerified && (
                    <Badge className="bg-purple-100 text-purple-800">
                      Verified
                    </Badge>
                  )}
                </div>

                {!staff.isVerified && (
                  <Button
                    onClick={() => handleResendEmail(staff.email)}
                    variant="outline"
                    disabled={resendEmailIsLoading}
                    className="gap-2 mt-3 border-gray-300 text-xs sm:text-sm"
                  >
                    {resendEmailIsLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Resend Set Password Email"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Account Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Staff ID</span>
                  <span className="text-sm font-medium text-gray-900 text-right">{staff.id}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">First Name</span>
                  <span className="text-sm font-medium text-gray-900">{staff.firstName}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Last Name</span>
                  <span className="text-sm font-medium text-gray-900">{staff.lastName}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="text-sm font-medium text-gray-900 text-right break-all">{staff.email}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Role</span>
                  <span className="text-sm font-medium text-gray-900">{staff.role}</span>
                </div>
              </div>
            </div>

            {/* Status Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Status Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Account Status</span>
                  <span className="text-sm font-medium">
                    <Badge className={staff.status === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {staff.status}
                    </Badge>
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Is Verified</span>
                  <span className="text-sm font-medium">
                    <Badge className={staff.isVerified ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {staff.isVerified ? "Yes" : "No"}
                    </Badge>
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Password Changed</span>
                  <span className="text-sm font-medium">
                    <Badge className={staff.passwordChangedAt ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
                      {staff.passwordChangedAt ? format(new Date(staff.passwordChangedAt), "MMM dd, yyyy") : "Never"}
                    </Badge>
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Reset Password</span>
                  <span className="text-sm font-medium">
                    <Badge className={staff.isResetPassword ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}>
                      {staff.isResetPassword ? "Yes" : "No"}
                    </Badge>
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Can Reset Password</span>
                  <span className="text-sm font-medium">
                    <Badge className={staff.canResetPassword ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {staff.canResetPassword ? "Yes" : "No"}
                    </Badge>
                  </span>
                </div>
              </div>
            </div>

            {/* Subscription Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Subscription Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Is Subscribed</span>
                  <span className="text-sm font-medium">
                    <Badge className={staff.isSubscribed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                      {staff.isSubscribed ? "Yes" : "No"}
                    </Badge>
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Plan Expiration</span>
                  <span className="text-sm font-medium text-gray-900">
                    {staff.planExpiration ? format(new Date(staff.planExpiration), "MMM dd, yyyy") : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Reset Password Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Reset Password Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Resent OTP</span>
                  <span className="text-sm font-medium">
                    <Badge className={staff.isResentOtp ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}>
                      {staff.isResentOtp ? "Yes" : "No"}
                    </Badge>
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Reset Password OTP</span>
                  <span className="text-sm font-medium text-gray-900">
                    {staff.resetPasswordOTP ? "Set" : "Not Set"}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">OTP Expires At</span>
                  <span className="text-sm font-medium text-gray-900">
                    {staff.resetPasswordOTPExpiresAt ? format(new Date(staff.resetPasswordOTPExpiresAt), "MMM dd, yyyy HH:mm") : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Information
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Seller Balance ID</span>
                  <span className="text-sm font-medium text-gray-900">
                    {staff.sellerBalanceId || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Timestamps
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Created At</span>
                  <span className="text-sm font-medium text-gray-900">
                    {format(new Date(staff.createdAt), "MMM dd, yyyy HH:mm")}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-sm text-gray-600">Updated At</span>
                  <span className="text-sm font-medium text-gray-900">
                    {format(new Date(staff.updatedAt), "MMM dd, yyyy HH:mm")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetailsPage;