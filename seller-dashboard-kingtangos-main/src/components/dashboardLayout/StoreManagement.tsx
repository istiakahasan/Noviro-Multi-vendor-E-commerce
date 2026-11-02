"use client";

import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Edit,
  Package,
  MessageCircle,
  Users,
  RefreshCw,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetMyStoreQuery } from "@/redux/api/storeApi/storeApi";
import Link from "next/link";

export default function StoreManagement() {
  const { data: response, isLoading, error, refetch } = useGetMyStoreQuery({});

  // Extract store data from the response
  const storeData = response?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
            <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
            <div className="w-8 h-8 rounded-full animate-pulse bg-primary dark:bg-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !storeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            Error loading store information
            {/* {"status" in error ? error.status : "Unknown error"} */}
          </div>
          <Button onClick={refetch} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const store = storeData;

  // Determine active features based on store data
  const hasProducts = store.products && store.products.length > 0;
  const hasServices = store.services && store.services.length > 0;
  const hasSpecialists = store.specialists && store.specialists.length > 0;
  const hasConsultations = store._count?.consultations > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto">
        {/* Hero Banner */}
        <div className="relative w-full h-48 md:h-64">
          <Image
            src={store?.banner || "/default-banner.jpg"}
            alt="store banner"
            width={500}
            height={300}
            className="object-cover w-full h-[300px] md:h-[256px]"
            priority
          />
        </div>

        {/* Main Content */}
        <div className="w-full mx-auto mt-6 relative z-10">
          {/* Store Profile Card */}
          <div className="bg-white rounded-lg shadow-sm md:p-6 p-2 mb-6">
            <div className="flex items-start justify-between flex-col md:flex-row mb-4">
              <div className="flex items-start gap-4">
                {/* Store Logo */}
                <div className="w-30 h-30 rounded-full bg-white border border-white shadow-md flex-shrink-0 overflow-hidden">
                  <Image
                    src={store.logo}
                    alt="store logo"
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                    {store.name}
                  </h1>
                  <p className="text-sm text-gray-500">
                    Shop ID: {store.id.slice(0, 8)}
                  </p>
                </div>
              </div>

              <Link href={`/seller-dashboard/store/edit-store/${store.id}`} className="mt-8 md:mt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                >
                  <span className="text-sm">Edit</span>
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Address */}
            <div className="flex gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>{store.location}</p>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-lg shadow-sm md:p-6 p-2 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Description:
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {store.description || "No description available."}
            </p>
          </div>

          {/* Store Tags Section */}
          <div className="bg-white rounded-lg shadow-sm md:p-6 p-2 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Store Tags:
              {store.tags && store.tags.length > 0 && (
                <span className="ml-4 inline-flex items-center px-2 py-2 rounded text-sm font-medium bg-gray-100 text-gray-800">
                  {store.tags.join(", ")}
                </span>
              )}
            </h2>
          </div>
          {/* Active Feature Section */}
          <div className="bg-white rounded-lg shadow-sm md:p-6 p-2 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Active Feature:
            </h2>
            <div className="space-y-3">
              {/* Sell Product */}
              {hasProducts && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-lg">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Sell Product
                  </span>
                </div>
              )}

              {/* Provide Service */}
              {hasServices && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Provide Service
                  </span>
                </div>
              )}

              {/* Provide Consultation */}
              {hasSpecialists && (
                <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-100 rounded-lg">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Provide Consultation
                  </span>
                </div>
              )}

              {/* Sell Subscription */}
              {hasConsultations && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-lg">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <RefreshCw className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Sell Subscription
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-lg shadow-sm md:p-6 p-2 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information:
            </h2>
            <div className="space-y-3">
              {/* Phone Number */}
              {store.phone && (
                <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Phone Number</p>
                    <p className="text-sm font-medium text-gray-900">
                      {store.phone}
                    </p>
                  </div>
                </div>
              )}

              {/* Email Address */}
              {store.email && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-lg">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">
                      Email Address
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {store.email}
                    </p>
                  </div>
                </div>
              )}

              {/* Facebook */}
              {store.facebookUrl && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Facebook</p>
                    <p className="text-sm font-medium text-gray-900">
                      {store.facebookUrl}
                    </p>
                  </div>
                </div>
              )}

              {/* Instagram */}
              {store.instagramUrl && (
                <div className="flex items-center gap-3 p-4 bg-pink-50 border border-pink-100 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Instagram className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Instagram</p>
                    <p className="text-sm font-medium text-gray-900">
                      {store.instagramUrl}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
