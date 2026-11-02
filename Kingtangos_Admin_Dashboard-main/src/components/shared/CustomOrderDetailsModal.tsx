"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useGetSingleSpecialOfferQuery } from "@/redux/api/specialOfferApi";
import dayjs from "dayjs";
import { Skeleton } from "@/components/ui/skeleton";

interface CustomOrderDetailsModalProps {
  id: string | null;
  onClose: () => void;
}

export function CustomOrderDetailsModal({
  id,
  onClose,
}: CustomOrderDetailsModalProps) {
  const { data: detailsData, isLoading } = useGetSingleSpecialOfferQuery(
    id as string,
    {
      skip: !id,
    },
  );
  const offer = detailsData?.data;

  return (
    <Dialog open={!!id} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl bg-white">
        <div className="p-8">
          <DialogHeader className="mb-8 text-left border-b pb-6">
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Special Offer Details
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  ID: {id}
                </DialogDescription>
              </div>
              {offer && (
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold ${offer.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {offer.isActive ? "Active" : "Inactive"}
                </span>
              )}
            </div>
          </DialogHeader>

          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-24 w-full rounded-xl" />
              <div className="grid grid-cols-2 gap-6">
                <Skeleton className="h-16 w-full rounded-xl" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            </div>
          ) : offer ? (
            <div className="space-y-8">
              {/* Product & Store Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Product Information
                  </h4>
                  <p className="text-lg font-bold text-gray-900">
                    {offer.product?.name || "N/A"}
                  </p>
                  <p className="text-sm text-blue-600 font-medium mt-1">
                    Price: €{offer.product?.price || 0}
                  </p>
                </div>
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                    Store Details
                  </h4>
                  <p className="text-lg font-bold text-gray-900">
                    {offer.store?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {offer.store?.email}
                  </p>
                </div>
              </div>

              {/* Discount details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <DetailItem label="Discount Type" value={offer.discountType} />
                <DetailItem
                  label="Discount Value"
                  value={
                    offer.discountType === "PERCENTAGE"
                      ? `${offer.discountValue}%`
                      : `€${offer.discountValue}`
                  }
                />
                <DetailItem
                  label="Min. Order"
                  value={`€${offer.minimumOrderAmount}`}
                />
                <DetailItem
                  label="Max. Discount"
                  value={`€${offer.maximumDiscountAmount}`}
                />
              </div>

              {/* Dates & Usage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t">
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Start Date</span>
                    <span className="font-semibold text-gray-900">
                      {dayjs(offer.startDate).format("MMM DD, YYYY")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Expiry Date</span>
                    <span className="font-semibold text-red-600">
                      {dayjs(offer.expireDate).format("MMM DD, YYYY")}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Sent Count</span>
                    <span className="font-semibold text-gray-900">
                      {offer.sentCount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Limit per User</span>
                    <span className="font-semibold text-gray-900">
                      {offer.limitForSingleUser}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No offer details found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-sm font-bold text-gray-900">{value}</span>
    </div>
  );
}
