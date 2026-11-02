"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { MoreVertical, Plus, AlertCircle, Play, Pause } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CustomPagination } from "@/components/shared/CustomPagination";

// API Hooks
import {
  useGetAllSellerAdvertisementByIdQuery,
  useResumeAdvertiseMutation,
  useStopAdvertiseMutation,
} from "@/redux/api/advertisementApi/advertisementApi";
import { useGetMeQuery } from "@/redux/api/authApi";

// Types
interface AdvertisingItem {
  id: string;
  storeId: string;
  productId: string;
  status: string; // This will be one of the enum values
  isActive: boolean;
  pricePerHour: number;
  totalDays: number;
  totalPrice: number;
  image: string;
  startDate: string | null;
  endDate: string | null;
  pausedAt: string | null;
  impressions: number;
  clicks: number;
  createdAt: string;
  updatedAt: string;
  product: {
    id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    discount: number;
    finalPrice: number;
  };
}

interface StatusConfig {
  color: string;
  text: string;
  textColor: string;
}

// Constants
const PLACEHOLDER_IMAGE = "/placeholder-image.png";

// Enum for Ad Status
enum AdStatus {
  PENDING = "PENDING",
  PAYMENT_PENDING = "PAYMENT_PENDING",
  PAID = "PAID",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

// Helper Functions
const getStatusConfig = (ad: AdvertisingItem): StatusConfig => {
  const currentDate = new Date();
  const endDate = ad.endDate ? new Date(ad.endDate) : null;
  const isExpired = endDate && endDate < currentDate;
  
  // Check for EXPIRED status first (overrides other statuses)
  if (isExpired || ad.status === AdStatus.EXPIRED) {
    return { color: "bg-gray-500", text: "EXPIRED", textColor: "text-gray-600" };
  }

  // Handle based on status enum
  switch (ad.status) {
    case AdStatus.PENDING:
      return { color: "bg-yellow-500", text: "PENDING", textColor: "text-yellow-600" };
    
    case AdStatus.PAYMENT_PENDING:
      return { color: "bg-orange-300", text: "PAYMENT PENDING", textColor: "text-orange-600" };
    
    case AdStatus.PAID:
      return { color: "bg-blue-500", text: "PAID", textColor: "text-blue-600" };
    
    case AdStatus.APPROVED:
      // For APPROVED status, check if it's active/paused
      if (ad.isActive && !ad.pausedAt) {
        return { color: "bg-green-500", text: "ACTIVE", textColor: "text-green-600" };
      } else if (!ad.isActive && ad.pausedAt) {
        return { color: "bg-orange-500", text: "PAUSED", textColor: "text-orange-600" };
      }
      return { color: "bg-green-500", text: "APPROVED", textColor: "text-green-600" };
    
    case AdStatus.REJECTED:
      return { color: "bg-red-500", text: "REJECTED", textColor: "text-red-600" };
    
    case AdStatus.CANCELLED:
      return { color: "bg-gray-500", text: "CANCELLED", textColor: "text-gray-600" };
    
    default:
      return { color: "bg-gray-500", text: ad.status, textColor: "text-gray-600" };
  }
};

export default function AdvertisingGrid() {
  // State
  const [stopDialogOpen, setStopDialogOpen] = useState(false);
  const [selectedAdId, setSelectedAdId] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [storeId, setStoreId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Hooks
  const { data: userData } = useGetMeQuery({});
  const { data: advertisingData, isLoading, refetch } = useGetAllSellerAdvertisementByIdQuery(
    { id: storeId, params: { page: currentPage, limit: itemsPerPage } },
    { skip: !storeId }
  );
  const [stopAdvertise, { isLoading: isStopping }] = useStopAdvertiseMutation();
  const [resumeAdvertise] = useResumeAdvertiseMutation();

  // Effects
  useEffect(() => {
    if (userData?.data?.stores?.id) {
      setStoreId(userData.data.stores.id);
    }
  }, [userData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  // Handlers
  const handleStopClick = (adId: string) => {
    setSelectedAdId(adId);
    setStopDialogOpen(true);
    setOpenDropdown(null);
  };

  const handleResumeClick = async (adId: string) => {
    try {
      await resumeAdvertise({ id: adId }).unwrap();
      toast.success("Advertisement resumed successfully");
      refetch();
    } catch {
      toast.error("Failed to resume advertisement");
    }
    setOpenDropdown(null);
  };

  const confirmStop = async () => {
    if (!selectedAdId) return;

    try {
      await stopAdvertise({ id: selectedAdId }).unwrap();
      toast.success("Advertisement paused successfully");
      setStopDialogOpen(false);
      setSelectedAdId(null);
      refetch();
    } catch {
      toast.error("Failed to pause advertisement");
    }
  };

  const handleImageError = (adId: string) => {
    setImageErrors(prev => ({ ...prev, [adId]: true }));
  };

  const shouldDisableDropdown = (ad: AdvertisingItem): boolean => {
    const status = getStatusConfig(ad);
    // Disable dropdown for these statuses
    const disabledStatuses = ["EXPIRED", "PENDING", "REJECTED", "CANCELLED", "PAYMENT PENDING"];
    return disabledStatuses.includes(status.text) || ad.status === AdStatus.PAID;
  };

  // Derived Data
  const advertisingItems = advertisingData?.data || [];
  const pagination = advertisingData?.meta;

  // Loading State
  if (isLoading) {
    return (
      <div className="rounded-lg overflow-hidden">
        <div className="flex items-center justify-between py-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800">All Advertisements</h3>
        </div>
        <div className="container mx-auto bg-white p-8">
          <div className="flex items-center justify-center min-h-[70vh]">
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full animate-pulse bg-primary" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (!advertisingData && !isLoading) {
    return (
      <div className="rounded-lg overflow-hidden">
         <div className="flex items-center justify-between flex-col lg:flex-row mb-8">
          <h1 className="lg:text-2xl text-xl font-semibold text-gray-900">
            All Advertisements
          </h1>
          <Link href="/seller-dashboard/marketing-promotions/add-advertise">
            <Button className="w-full lg:w-auto bg-black hover:bg-gray-800 text-white mt-3 md:mt-0">
              <Plus className="w-4 h-4 mr-1" />
              Add New Advertise
            </Button>
          </Link>
        </div>
        <div className="bg-white p-8 text-center text-red-500 font-medium">
          Failed to load advertisements. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 min-h-screen">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between flex-col lg:flex-row mb-8">
          <h1 className="lg:text-2xl text-xl font-semibold text-gray-900">
            All Advertisements
          </h1>
          <Link href="/seller-dashboard/marketing-promotions/add-advertise">
            <Button className="w-full lg:w-auto bg-black hover:bg-gray-800 text-white mt-3 md:mt-0">
              <Plus className="w-4 h-4 mr-1" />
              Add New Advertise
            </Button>
          </Link>
        </div>

        {/* Empty/Error States */}
        {!storeId && (
          <EmptyState message="No store found" />
        )}

        {storeId && advertisingItems.length === 0 && (
          <EmptyState message="No advertisements found" />
        )}

        {/* Advertisements Grid */}
        {storeId && advertisingItems.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {advertisingItems.map((ad: AdvertisingItem) => {
                const status = getStatusConfig(ad);
                const imageSrc = imageErrors[ad.id] ? PLACEHOLDER_IMAGE : ad.image || PLACEHOLDER_IMAGE;

                return (
                  <div
                    key={ad.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      {/* Status Indicator */}
                      <div
                        className={`absolute top-4 right-4 w-3 h-3 rounded-full z-10 ${status.color}`}
                        title={status.text}
                      />

                      {/* Image */}
                      <div className="lg:p-6 p-3">
                        <Image
                          src={imageSrc}
                          alt={ad.product?.name || "Advertisement"}
                          width={327}
                          height={450}
                          className="object-cover h-[450px] w-[327px] rounded-lg"
                          onError={() => handleImageError(ad.id)}
                          priority={false}
                        />
                      </div>
                    </div>

                    <CardContent className="p-4">
                      {/* Header with Menu */}
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium text-gray-900 truncate max-w-[200px]">
                          {ad.product?.name || "Advertisement"}
                        </h3>
                        
                        <DropdownMenu
                          open={openDropdown === ad.id}
                          onOpenChange={(open) => setOpenDropdown(open ? ad.id : null)}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              disabled={shouldDisableDropdown(ad)}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {status.text === "ACTIVE" && (
                              <DropdownMenuItem
                                onClick={() => handleStopClick(ad.id)}
                                className="text-orange-600"
                              >
                                <Pause className="w-4 h-4 mr-2" />
                                Pause
                              </DropdownMenuItem>
                            )}
                            {status.text === "PAUSED" && (
                              <DropdownMenuItem
                                onClick={() => handleResumeClick(ad.id)}
                                className="text-green-600"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Resume
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Details Grid */}
                      <AdDetails ad={ad} status={status} />
                    </CardContent>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination && pagination.total > itemsPerPage && (
              <div className="lg:px-4 xl:px-26 mt-6">
                <CustomPagination
                  totalItems={pagination.total}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                  onItemsPerPageChange={setItemsPerPage}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Pause Confirmation Dialog */}
      <PauseDialog
        open={stopDialogOpen}
        onOpenChange={setStopDialogOpen}
        onConfirm={confirmStop}
        isStopping={isStopping}
      />
    </div>
  );
}

// Sub-components
const EmptyState = ({ message }: { message: string }) => (
  <div className="flex justify-center items-center h-64">
    <div className="text-lg text-gray-500">{message}</div>
  </div>
);

const AdDetails = ({ ad, status }: { ad: AdvertisingItem; status: StatusConfig }) => (
  <div className="space-y-2 text-sm">
    <DetailRow label="Product" value={ad.product?.name || "N/A"} />
    <DetailRow 
      label="Price" 
      value={`$${ad.product?.finalPrice?.toFixed(2) || ad.totalPrice}`} 
    />
    <DetailRow label="Duration" value={`${ad.totalDays} Days`} />
    
    {ad.startDate && (
      <DetailRow 
        label="Start Date" 
        value={new Date(ad.startDate).toLocaleDateString()} 
      />
    )}
    
    {ad.endDate && (
      <DetailRow 
        label="End Date" 
        value={
          <span className={status.text === "EXPIRED" ? "text-red-500" : "text-gray-900"}>
            {new Date(ad.endDate).toLocaleDateString()}
            {status.text === "EXPIRED" && " (Expired)"}
          </span>
        }
      />
    )}
    
    <DetailRow label="Impressions" value={ad.impressions} />
    <DetailRow label="Clicks" value={ad.clicks} />
    <DetailRow label="Status" value={status.text} valueClassName={status.textColor} />
  </div>
);

const DetailRow = ({ 
  label, 
  value, 
  valueClassName = "text-gray-900" 
}: { 
  label: string; 
  value: React.ReactNode;
  valueClassName?: string;
}) => (
  <div className="flex justify-between">
    <span className="text-gray-600">{label}</span>
    <span className={`font-medium truncate max-w-[150px] ${valueClassName}`}>
      {value}
    </span>
  </div>
);

const PauseDialog = ({ 
  open, 
  onOpenChange, 
  onConfirm, 
  isStopping 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onConfirm: () => void; 
  isStopping: boolean;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader className="text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <DialogTitle className="text-lg font-medium text-gray-900">
          Are you sure you want to pause this advertisement?
        </DialogTitle>
        <p className="text-sm text-gray-500 mt-2">
          You can resume it anytime from the dropdown menu.
        </p>
      </DialogHeader>
      <DialogFooter className="flex gap-3 sm:gap-3">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="flex-1"
          disabled={isStopping}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
          disabled={isStopping}
        >
          {isStopping ? "Pausing..." : "Pause"}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);