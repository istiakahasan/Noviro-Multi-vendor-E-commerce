


"use client";
import Image from "next/image";
import {
  MessageCircle,
  Package,
  Users,
  RefreshCw,
  Star,
  Trash2,
  MapPin,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductImage from "@/assets/images/Product1.png";
import shopImage from "@/assets/shopLogo.png"
import { FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaFacebookMessenger, FaYoutube } from "react-icons/fa";
import { useState } from "react";
import { useGetSingleStoreQuery, useApproveStoreMutation, useRejectStoreMutation } from "@/redux/features/store-content/storeContentApi";
import PageLoader from "@/app/loading";
import { toast } from "sonner";
import SendMessageButton from "@/app/(dashboardLayout)/admin-dashboard/chat/(component)/sendMessage";

interface Contact {
  type: string;
  value: string;
}

interface Feature {
  name: string;
  type?: string;
}

interface StoreManagementProps {
  storeId: string;
}
interface Error {
  message:string
}

const getFeatureColors = (name: string) => {
  switch (name) {
    case "Sell Product":
      return { bg: "bg-red-500", border: "border-red-300", container: "bg-red-50" };
    case "Provide Service":
      return { bg: "bg-blue-500", border: "border-blue-300", container: "bg-blue-50" };
    case "Provide Consultation":
      return { bg: "bg-orange-500", border: "border-orange-300", container: "bg-orange-50" };
    case "Sell Subscription":
      return { bg: "bg-green-500", border: "border-green-300", container: "bg-green-50" };
    default:
      return { bg: "bg-gray-500", border: "border-gray-300", container: "bg-gray-50" };
  }
};

const getContactColors = (type: string) => {
  switch (type) {
    case "Phone Number":
      return { bg: "bg-gray-800", border: "border-gray-300", container: "bg-gray-50" };
    case "Email Address":
      return { bg: "bg-red-500", border: "border-red-300", container: "bg-red-50" };
    case "Facebook":
      return { bg: "bg-blue-600", border: "border-blue-300", container: "bg-blue-50" };
    case "Instagram":
      return { bg: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500", border: "border-pink-300", container: "bg-pink-50" };
    case "YouTube":
      return { bg: "bg-red-600", border: "border-red-300", container: "bg-red-50" };
    default:
      return { bg: "bg-gray-500", border: "border-gray-300", container: "bg-gray-50" };
  }
};

export default function ManageStores({ storeId }: StoreManagementProps) {
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  // const [rejectReason, setRejectReason] = useState("");

  // Fetch store data using Redux RTK Query
  const { data: response, isLoading, isError } = useGetSingleStoreQuery(storeId);
  
  // Mutations for approve and reject
  const [approveStore, { isLoading: isApproving }] = useApproveStoreMutation();
  const [rejectStore, { isLoading: isRejecting }] = useRejectStoreMutation();
  
  const storeData = response?.data;

  const getFeatureIcon = (name: string) => {
    switch (name) {
      case "Sell Product": return Package;
      case "Provide Service": return MessageCircle;
      case "Provide Consultation": return Users;
      case "Sell Subscription": return RefreshCw;
      default: return Package;
    }
  };

  const getContactIcon = (type: string) => {
    switch (type) {
      case "Phone Number": return FaPhone;
      case "Email Address": return FaEnvelope;
      case "Facebook": return FaFacebook;
      case "Instagram": return FaInstagram;
      case "YouTube": return FaYoutube;
      default: return FaPhone;
    }
  };

  const handleApprove = async () => {
    try {
      const response = await approveStore(storeId).unwrap();
      toast.success(response?.message || "Store approved successfully");
      setShowApproveModal(false);
    } catch (error: unknown) {
      let errMsg = "Failed to approve store";
      if (typeof error === "object" && error !== null && "message" in error && typeof (error as Error).message === "string") {
        errMsg = (error as Error).message;
      } else if (typeof error === "string") {
        errMsg = error;
      }
      toast.error(errMsg);
      console.error("Failed to approve store:", error);
    }
  };

  const handleReject = async () => {
    try {
      const response = await rejectStore(storeId).unwrap();
      toast.warning(response?.message || "Store rejected successfully");
      setShowRejectModal(false);
    } catch (error: unknown) {
      let errMsg = "Failed to reject store";
      if (typeof error === "object" && error !== null && "message" in error && typeof (error as Error).message === "string") {
        errMsg = (error as Error).message;
      } else if (typeof error === "string") {
        errMsg = error;
      }
      toast.error(errMsg);
      console.error("Failed to reject store:", error);
    }
  };

  // Transform contacts data
  const contacts: Contact[] = storeData ? [
    storeData.phone && { type: "Phone Number", value: storeData.phone },
    storeData.email && { type: "Email Address", value: storeData.email },
    storeData.facebookUrl && { type: "Facebook", value: storeData.facebookUrl },
    storeData.instagramUrl && { type: "Instagram", value: storeData.instagramUrl },
    storeData.youtubeUrl && { type: "YouTube", value: storeData.youtubeUrl },
  ].filter(Boolean) as Contact[] : [];

  // Transform features data from storeCategories
  const features: Feature[] = storeData?.storeCategories?.map((sc) => ({
    name: sc.category.name,
    type: sc.category.type
  })) || [];
  const statusPending  = storeData?.shopStatus === 'PENDING';
  const statusApproved = storeData?.shopStatus === 'APPROVED';
  const statusRejected = storeData?.shopStatus === 'REJECTED';
// console.log(statusPending, statusApproved, statusRejected);

  if (isLoading) {
    return (
     <PageLoader/>
    );
  }

  if (isError || !storeData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600">Failed to load store data</p>
      </div>
    );
  }

  return (
    <div className="">
      {/* Hero Banner */}
      <div className="relative w-full h-48 md:h-64">
        <Image
          src={storeData.banner || ProductImage}
          alt="Store banner showing clothing collection"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 bg-gradient-to-t from-black/60 to-transparent">
          <h2 className="text-lg sm:text-2xl font-semibold text-white mb-1">{storeData.name}</h2>
          <p className="text-white/90 text-xs sm:text-sm">Overview</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-5">
       
     {/* profile section  */}
     <div className=" p-6 border-b border-gray-200">

      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        {/* LEFT SECTION */}
        <div className="flex items-start gap-4 flex-1">
          {/* Store Logo */}
          <div className="w-28 h-28 rounded-full mr-8 bg-green-700 overflow-hidden flex-shrink-0">
            <Image
              src={storeData.logo || shopImage}
              alt="Store logo"
              width={112}
              height={112}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>

          {/* Store Info */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              {storeData.name}
            </h1>
            <p className="text-sm text-gray-600 mb-2">Shop ID: {storeData.id}</p>
            <p className="text-sm text-gray-600 mb-2">User ID: {storeData.userId}</p>
            <p className="text-sm text-gray-600 mb-2">
              Status: <span className={`font-semibold ${
                storeData.shopStatus === 'PENDING' ? 'text-yellow-600' : 
                storeData.shopStatus === 'APPROVED' ? 'text-green-600' : 
                'text-red-600'
              }`}>
                {storeData.shopStatus}
              </span> | <span className={`font-semibold ${storeData.status === 'OFFLINE' ? 'text-gray-600' : 'text-green-600'}`}>
                {storeData.status}
              </span>
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 text-yellow-500 fill-yellow-500"
                />
              ))}
              <span className="text-sm text-gray-600 ml-2">
                150 Reviews
              </span>
            </div>

            {/* Address */}
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <p className="text-sm">{storeData.location}</p>
            </div>

            {/* Message Button */}
            <div className="mt-4">
              <SendMessageButton userType="seller" receiverId={storeData.userId} className="ml-2" nextUrl={`/admin-dashboard/chat`} />
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="min-w-[260px]">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>

          <div className="space-y-2 text-md font-semibold text-gray-800">
            <p>
              <span className="font-normal">Total Products:</span>{" "}
              {storeData._count.products}
            </p>
            <p>
              <span className="font-normal">Total Services:</span>{" "}
              {storeData._count.services}
            </p>
            <p>
              <span className="font-normal">Total Specialists:</span>{" "}
              {storeData._count.specialists}
            </p>
            <p>
              <span className="font-normal">Total Consultations:</span>{" "}
              {storeData._count.consultations}
            </p>
          </div>
        </div>
      </div>
    </div>

        {/* Description Section */}
        <div className="my-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2 px-6">
            Description
          </h2>
          <p className="text-sm px-6 text-gray-600 leading-relaxed">
            {storeData.description}
          </p>
        </div>

        {/* Active Feature Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Active Categories
          </h2>
          {features.length > 0 ? (
            <div className="space-y-3">
              {features.map((feature, index) => {
                const colors = getFeatureColors(feature.name);
                const Icon = getFeatureIcon(feature.name);
                return (
                  <div key={index} className={`flex items-center gap-3 p-4 ${colors.container} border ${colors.border} rounded-lg`}>
                    <div className={`w-8 h-8 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">
                        {feature.name}
                      </span>
                      {feature.type && (
                        <span className="text-xs text-gray-500 ml-2">({feature.type})</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No categories available</p>
          )}
        </div>

        {/* Contact Information Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            Contact Information:
          </h2>
          {contacts.length > 0 ? (
            <div className="space-y-2 sm:space-y-3 mb-4">
              {contacts.map((contact, index) => {
                const colors = getContactColors(contact.type);
                const Icon = getContactIcon(contact.type);
                return (
                  <div key={index} className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border ${colors.border} rounded-lg`}>
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 mb-0.5">{contact.type}</p>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {contact.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-4">No contact information available</p>
          )}
        </div>
          {/* Approve/Reject Buttons - Only show if status is PENDING */}
          
            <div className="flex justify-end items-center gap-3 border-gray-200">
              <Button 
                className="bg-white border border-green-500 text-green-500 hover:text-white hover:bg-green-600" 
                onClick={() => setShowApproveModal(true)}
                disabled={isApproving || isRejecting || statusApproved}
              >
                <BadgeCheck className="w-4 h-4 mr-1" />
                {isApproving ? "Approving..." : "Approve Request"}
              </Button>
              <Button 
                className="border-red-500 hover:text-white text-red-500 hover:bg-red-500" 
                variant="outline" 
                onClick={() => setShowRejectModal(true)}
                disabled={isApproving || isRejecting || statusRejected}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {isRejecting ? "Rejecting..." : "Reject Request"}
              </Button>
            </div>
          

          {/* Approve Modal */}
          {showApproveModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center">
                <h3 className="text-green-500 font-bold text-lg mb-2">Are you sure!</h3>
                <p className="text-gray-600 mb-6">You Want to Approve Request of This Seller?</p>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    className="px-4 py-2"
                    onClick={() => setShowApproveModal(false)}
                    disabled={isApproving}
                  >
                    No
                  </Button>
                  <Button
                    className="px-4 py-2 bg-green-500 hover:bg-green-600"
                    onClick={handleApprove}
                    disabled={isApproving}
                  >
                    {isApproving ? "Approving..." : "Yes"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Reject Modal */}
         {showRejectModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center">
      <h3 className="text-red-500 font-bold text-lg mb-2">Are You Sure!</h3>
      <p className="text-gray-600 mb-4">
        You Want to Reject Request of This Store?
      </p>

      {/* Reason Input Field - COMMENTED */}
      {/* <textarea
        placeholder="Write the Reason"
        className="w-full border border-gray-300 rounded-md p-2 text-sm mb-6 focus:ring-2 focus:ring-red-400 focus:outline-none"
        rows={3}
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
      /> */}

      <div className="flex justify-center gap-3 mt-6">
        <Button
          variant="outline"
          className="px-4 py-2 border-gray-400 text-gray-700 hover:bg-gray-100"
          onClick={() => setShowRejectModal(false)}
          disabled={isRejecting}
        >
          No
        </Button>
        <Button
          variant="destructive"
          className="px-4 py-2 bg-red-500 hover:bg-red-600"
          onClick={handleReject}
          disabled={isRejecting}
        >
          {isRejecting ? "Rejecting..." : "Yes"}
        </Button>
      </div>
    </div>
  </div>
)}

      </div>
    </div>
  );
}