"use client";

import { useGetAllPlatformDataQuery } from "@/redux/api/platform/platformApi";
import React from "react";

// TypeScript interfaces
interface PlatformData {
  id: string;
  platformName: string;
  logoUrl: string | null;
  supportEmail: string;
  supportPhone: string;
  termsOfService: string;
  privacyPolicy: string;
  refundPolicy: string;
  createdAt: string;
  updatedAt: string;
}

interface StoreResponse {
  success: boolean;
  message: string;
  data: PlatformData;
}

interface ApiError {
  status?: number;
  data?: {
    success?: boolean;
    message?: string;
    error?: string;
  };
  message?: string;
}

const PrivacyPolicy: React.FC = () => {
  const { data, isLoading, error } = useGetAllPlatformDataQuery("");

  // Type guard for error
  const isApiError = (err: unknown): err is ApiError => {
    return typeof err === "object" && err !== null;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
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

  // Show error state
  if (error) {
    const errorMessage = isApiError(error)
      ? error.data?.message || error.message || "Failed to load privacy policy"
      : "An unexpected error occurred";

    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-600 font-semibold">
            Error Loading Privacy Policy
          </p>
          <p className="text-sm text-gray-500 mt-2">{errorMessage}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Safely access data with optional chaining and null checks
  const responseData = data as StoreResponse | undefined;
  const platformData = responseData?.data;
  const privacyPolicy = platformData?.privacyPolicy ?? "";

  // Show message if no data is available
  if (!platformData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">No privacy policy data available.</p>
      </div>
    );
  }

  // Render the privacy policy with safe date formatting
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Privacy Policy
      </h1>

      {privacyPolicy ? (
        <div
          className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-li:text-gray-600"
          dangerouslySetInnerHTML={{ __html: privacyPolicy }}
        />
      ) : (
        <p className="text-center text-gray-500 py-8">
          Privacy policy content is not available at the moment.
        </p>
      )}

      {/* <footer className="mt-8 text-sm text-gray-500 text-center border-t pt-6">
                <p>
                    Last updated: {platformData.updatedAt 
                        ? new Date(platformData.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'N/A'
                    }
                </p>
                
                <p className="mt-1">
                    Platform: <span className="font-medium">{platformData.platformName || 'N/A'}</span>
                </p>
                

                <p className="mt-1">
                    Contact: {platformData.supportEmail ? (
                        <a href={`mailto:${platformData.supportEmail}`} className="text-blue-500 hover:underline">
                            {platformData.supportEmail}
                        </a>
                    ) : 'N/A'}
                </p>
                

                {platformData.supportPhone && (
                    <p className="mt-1">
                        Phone: <a href={`tel:${platformData.supportPhone}`} className="text-blue-500 hover:underline">
                            {platformData.supportPhone}
                        </a>
                    </p>
                )}
            </footer> */}
    </div>
  );
};

export default PrivacyPolicy;
