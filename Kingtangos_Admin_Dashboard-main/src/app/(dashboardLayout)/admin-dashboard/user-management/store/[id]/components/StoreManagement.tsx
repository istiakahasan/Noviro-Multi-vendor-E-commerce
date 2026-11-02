"use client";

import Image from "next/image";
import {
  MessageCircle,
  Package,
  Users,
  RefreshCw,
  Star,
  X,
  Trash2,
  MapPin,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FaPhone,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaFacebookMessenger,
} from "react-icons/fa";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useGetSingleUserQuery } from "@/redux/features/userManagement/userManagementApi";

import { toast } from "sonner";
import {
  useApproveStoreMutation,
  useRejectStoreMutation,
} from "@/redux/features/store-content/storeContentApi";
import SendMessageButton from "@/app/(dashboardLayout)/admin-dashboard/chat/(component)/sendMessage";

interface ContactItem {
  type: "Phone Number" | "Email Address" | "Facebook" | "Instagram";
  value: string;
  url?: string;
}

interface FeatureItem {
  name: string;
}

const getFeatureIcon = (name: string) => {
  switch (name) {
    case "Sell Product":
      return Package;
    case "Provide Service":
      return MessageCircle;
    case "Provide Consultation":
      return Users;
    case "Sell Subscription":
      return RefreshCw;
    default:
      return Package;
  }
};

const getFeatureColors = (name: string) => {
  switch (name) {
    case "Sell Product":
      return {
        bg: "bg-red-500",
        border: "border-red-300",
        container: "bg-red-50",
      };
    case "Provide Service":
      return {
        bg: "bg-blue-500",
        border: "border-blue-300",
        container: "bg-blue-50",
      };
    case "Provide Consultation":
      return {
        bg: "bg-orange-500",
        border: "border-orange-300",
        container: "bg-orange-50",
      };
    case "Sell Subscription":
      return {
        bg: "bg-green-500",
        border: "border-green-300",
        container: "bg-green-50",
      };
    default:
      return {
        bg: "bg-gray-500",
        border: "border-gray-300",
        container: "bg-gray-50",
      };
  }
};

const getContactColors = (type: string) => {
  switch (type) {
    case "Phone Number":
      return {
        bg: "bg-gray-800",
        border: "border-gray-300",
        container: "bg-gray-50",
      };
    case "Email Address":
      return {
        bg: "bg-red-500",
        border: "border-red-300",
        container: "bg-red-50",
      };
    case "Facebook":
      return {
        bg: "bg-blue-600",
        border: "border-blue-300",
        container: "bg-blue-50",
      };
    case "Instagram":
      return {
        bg: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500",
        border: "border-pink-300",
        container: "bg-pink-50",
      };
    default:
      return {
        bg: "bg-gray-500",
        border: "border-gray-300",
        container: "bg-gray-50",
      };
  }
};

const getContactIcon = (type: string) => {
  switch (type) {
    case "Phone Number":
      return FaPhone;
    case "Email Address":
      return FaEnvelope;
    case "Facebook":
      return FaFacebook;
    case "Instagram":
      return FaInstagram;
    default:
      return FaPhone;
  }
};

export default function StoreManagement() {
  const { id: userId } = useParams<{ id: string }>();
  const { data: response, isLoading, isError } = useGetSingleUserQuery(userId);

  // Extract Store ID (this fixes "Store not found!")
  const storeId = response?.data?.stores?.id;
  const store = response?.data?.stores;

  console.log(response);
  const [approveStore, { isLoading: approving }] = useApproveStoreMutation();
  const [rejectStore, { isLoading: rejecting }] = useRejectStoreMutation();

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-600">
        Loading store details...
      </div>
    );
  }

  if (isError || !response?.success || !store) {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        Failed to load store information.
      </div>
    );
  }

  const contacts: ContactItem[] = [];
  if (store.phone) contacts.push({ type: "Phone Number", value: store.phone });
  if (store.email) contacts.push({ type: "Email Address", value: store.email });
  if (store.facebookUrl)
    contacts.push({
      type: "Facebook",
      value: store.facebookUrl,
      url: store.facebookUrl,
    });
  if (store.instagramUrl)
    contacts.push({
      type: "Instagram",
      value: store.instagramUrl,
      url: store.instagramUrl,
    });

const features: FeatureItem[] = store.services?.length
  ? (store.services as any[]).map((s: any) => {
      // Handle both string and object formats
      const serviceStr = typeof s === 'string' ? s : s.name || s.type || JSON.stringify(s).toLowerCase();
      
      return {
        name: serviceStr.includes("product")
          ? "Sell Product"
          : serviceStr.includes("service")
            ? "Provide Service"
            : serviceStr.includes("consultation")
              ? "Provide Consultation"
              : serviceStr.includes("subscription")
                ? "Sell Subscription"
                : "Sell Product",
      };
    })
  : [{ name: "Sell Product" }, { name: "Provide Service" }];

  const stats = {
    rating: 4.9,
    reviews: 150,
    totalOrders: 296,
    cancelledOrders: 9,
    successfulOrders: 260,
    totalEarn: 20500,
  };

  const handleApprove = async () => {
    if (!storeId) return toast.error("Store ID missing");

    toast.promise(approveStore(storeId).unwrap(), {
      loading: "Approving store...",
      success: () => {
        setShowApproveModal(false);
        return "Store approved successfully!";
      },
      error: () => "Failed to approve store",
    });
  };

  const handleReject = async () => {
    if (!storeId) return toast.error("Store ID missing");

    toast.promise(rejectStore(storeId).unwrap(), {
      loading: "Rejecting store...",
      success: () => {
        setShowRejectModal(false);
        return "Store rejected";
      },
      error: () => "Failed to reject store",
    });
  };
  const rejected = store.shopStatus === "REJECTED";
  const approved = store.shopStatus === "APPROVED";


  return (
    <div className="">
      {/* Hero Banner */}
      <div className="relative w-full h-48 md:h-64">
        <Image
          src={store.banner}
          alt="Store banner showing clothing collection"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 bg-gradient-to-t from-black/60 to-transparent">
          <h2 className="text-lg sm:text-2xl font-semibold text-white mb-1">
            {store.name}
          </h2>
          <p className="text-white/90 text-xs sm:text-sm">Overview</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-5">
        {/* Profile Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            {/* LEFT SECTION */}
            <div className="flex items-start gap-4 flex-1">
              <div className="w-28 h-28 rounded-full mr-8 bg-green-700 overflow-hidden flex-shrink-0">
                <Image
                  src={store.logo}
                  alt="Store logo"
                  width={112}
                  height={112}
                  className="object-cover w-full h-full"
                />
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                  {store.name}
                </h1>
                <p> Status: <span className={store.shopStatus === "REJECTED" ? "text-red-600" : "text-green-600"}>{store.shopStatus}</span></p>
                <p className="text-sm text-gray-600 mb-2">
                  Shop ID: {store.id}
                </p>

                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {stats.reviews} Reviews
                  </span>
                </div>

                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <p className="text-sm">{store.location}</p>
                </div>

                <div className="mt-4">
                  {/* <Button variant="outline" className="gap-2 hover:bg-blue-50">
                    seller
                  </Button> */}
                  <SendMessageButton userType="seller" receiverId={userId} className="ml-2" nextUrl={`/admin-dashboard/chat`} />
                </div>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="min-w-[260px]">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Overview
              </h2>
              <div className="space-y-2 text-md font-semibold text-gray-800">
                <p>
                  <span className="font-normal">Total Orders:</span>{" "}
                  {stats.totalOrders}
                </p>
                <p>
                  <span className="font-normal">Successful Orders:</span>{" "}
                  {stats.successfulOrders}
                </p>
                <p>
                  <span className="font-normal">Cancelled Orders:</span>{" "}
                  {stats.cancelledOrders}
                </p>
                <p>
                  <span className="font-normal">Total Earn:</span>{" "}
                  {stats.totalEarn.toFixed(2)}$
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="my-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 border-b pb-2 px-6">
            Description
          </h2>
          <p className="text-sm px-6 text-gray-600 leading-relaxed">
            {store.description}
          </p>
        </div>

        {/* Active Feature */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Active Feature
          </h2>
          <div className="space-y-3">
            {features.map((feature, index) => {
              const colors = getFeatureColors(feature.name);
              const Icon = getFeatureIcon(feature.name);
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-4 ${colors.container} border ${colors.border} rounded-lg`}
                >
                  <div
                    className={`w-8 h-8 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900 flex-1">
                    {feature.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            Contact Information:
          </h2>
          <div className="space-y-2 sm:space-y-3 mb-4">
            {contacts.map((contact, index) => {
              const colors = getContactColors(contact.type);
              const Icon = getContactIcon(contact.type);
              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 border ${colors.border} rounded-lg`}
                >
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">
                      {contact.type}
                    </p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {contact.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Approve/Reject Buttons */}
        <div className="flex justify-end items-center gap-3 border-gray-200">
          <Button
            className="bg-white border border-green-500 text-green-500 hover:text-white hover:bg-green-600"
            onClick={() => setShowApproveModal(true)}
            disabled={approving || approved}
          >
            <BadgeCheck className="w-4 h-4 mr-1" />
            {approving ? "Approving..." : "Approve Request"}
          </Button>
          <Button
            variant="outline"
            className="border-red-500 hover:text-white text-red-500 hover:bg-red-500"
            onClick={() => setShowRejectModal(true)}
            disabled={rejecting || rejected}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            {rejecting ? "Rejecting..." : "Reject Request"}
          </Button>
        </div>

        {/* Approve Modal */}
        {showApproveModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center">
              <h3 className="text-green-500 font-bold text-lg mb-2">
                Are you sure!
              </h3>
              <p className="text-gray-600 mb-6">
                You Want to Approve Request of This Seller?
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowApproveModal(false)}
                >
                  No
                </Button>
                <Button
                  className="bg-green-500 hover:bg-green-600"
                  onClick={handleApprove}
                >
                  Yes
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 text-center">
              <h3 className="text-red-500 font-bold text-lg mb-2">
                Are you sure!
              </h3>
              <p className="text-gray-600 mb-6">
                You Want to Reject Request of This Seller?
              </p>
              <div className="flex justify-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRejectModal(false)}
                >
                  No
                </Button>
                <Button variant="destructive" onClick={handleReject}>
                  Yes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
