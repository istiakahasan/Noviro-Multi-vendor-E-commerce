"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar, Tag, Users, Clock, Gift, Percent,
  DollarSign, AlertCircle, RefreshCw, ChevronRight,
  Package, Target, Store, Trash2, X,
} from "lucide-react";

import { useGetAllSpecialOfferByIdQuery, useDeleteSpecialOfferMutation } from "../../redux/api/specialOfferApi/specialOfferApi";
import { useGetMeQuery } from "@/redux/api/authApi";
import { CustomPagination } from "../shared/CustomPagination";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SpecialOffer {
  id: string;
  storeId: string;
  productId: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscountAmount: number;
  limitForSingleUser: number;
  startDate: string;
  expireDate: string;
  isActive: boolean;
  targetCustomerId: string;
  sentCount: number;
  createdAt: string;
  updatedAt: string;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface OffersResponse {
  success?: boolean;
  data?: SpecialOffer[];
  meta?: Meta;
}

interface StatCard {
  label: string;
  val: number | string;
  icon: React.ReactNode;
  bg: string;
}

type DiscountStatus = "active" | "upcoming" | "expired";

// ─── Utils ────────────────────────────────────────────────────────────────────

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const getStatus = (offer: SpecialOffer): DiscountStatus => {
  const now = Date.now();
  if (now < new Date(offer.startDate).getTime()) return "upcoming";
  if (now > new Date(offer.expireDate).getTime()) return "expired";
  return "active";
};

const statusClass: Record<DiscountStatus, string> = {
  active:   "bg-green-100 text-green-800 border-green-200",
  upcoming: "bg-yellow-100 text-yellow-800 border-yellow-200",
  expired:  "bg-gray-100 text-gray-600 border-gray-200",
};

// ─── Stats Config ─────────────────────────────────────────────────────────────

const getStatsCards = (stats: {
  total: number; active: number; upcoming: number;
  expired: number; sent: number; avgDisc: number;
}): StatCard[] => [
  { label: "Total",    val: stats.total,         icon: <Tag className="w-5 h-5 text-gray-700" />,         bg: "bg-gray-100"   },
  { label: "Active",   val: stats.active,        icon: <Gift className="w-5 h-5 text-green-600" />,       bg: "bg-green-100"  },
  { label: "Upcoming", val: stats.upcoming,      icon: <Clock className="w-5 h-5 text-yellow-600" />,     bg: "bg-yellow-100" },
  { label: "Expired",  val: stats.expired,       icon: <AlertCircle className="w-5 h-5 text-gray-500" />, bg: "bg-gray-100"   },
  { label: "Sent",     val: stats.sent,          icon: <Users className="w-5 h-5 text-purple-600" />,     bg: "bg-purple-100" },
  { label: "Avg Disc", val: `${stats.avgDisc}%`, icon: <Percent className="w-5 h-5 text-orange-600" />,   bg: "bg-orange-100" },
];

// ─── Delete Confirmation Modal ────────────────────────────────────────────────

interface DeleteModalProps {
  offer: SpecialOffer;
  isDeleting: boolean;
  errorMessage: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ offer, isDeleting, errorMessage, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/50 backdrop-blur-sm"
      onClick={!isDeleting ? onCancel : undefined}
    />

    {/* Modal */}
    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200">
      {/* Close button */}
      <button
        onClick={onCancel}
        disabled={isDeleting}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Icon — switches to error state */}
      <div className={`flex items-center justify-center w-14 h-14 rounded-full mx-auto mb-4 ${errorMessage ? "bg-orange-50" : "bg-red-50"}`}>
        {errorMessage
          ? <AlertCircle className="w-7 h-7 text-orange-500" />
          : <Trash2 className="w-7 h-7 text-red-500" />}
      </div>

      {errorMessage ? (
        // ── Error state ──────────────────────────────────────────────────
        <>
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Cannot Delete Offer</h3>
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-6">
            <p className="text-orange-700 text-sm text-center font-medium">{errorMessage}</p>
          </div>
          <button
            onClick={onCancel}
            className="w-full px-4 py-2.5 rounded-xl bg-black text-white font-medium text-sm hover:bg-gray-900 transition-all"
          >
            Got it
          </button>
        </>
      ) : (
        // ── Confirm state ────────────────────────────────────────────────
        <>
          <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Offer?</h3>
          <p className="text-gray-500 text-center text-sm mb-1">
            You are about to delete a{" "}
            <span className="font-semibold text-gray-800">
              {offer.discountValue}{offer.discountType === "PERCENTAGE" ? "%" : "$"} OFF
            </span>{" "}
            offer.
          </p>
          <p className="text-gray-400 text-center text-xs mb-6">This action cannot be undone.</p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isDeleting
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Deleting...</>
                : <><Trash2 className="w-4 h-4" /> Delete</>}
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);

// ─── Guard State Components ───────────────────────────────────────────────────

const LoadingState: React.FC<{ isUserLoading: boolean }> = ({ isUserLoading }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="text-center">
      <div className="relative">
        <RefreshCw className="w-20 h-20 animate-spin text-gray-900 mx-auto mb-6" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Store className="w-8 h-8 text-gray-900 animate-pulse" />
        </div>
      </div>
      <p className="text-xl font-semibold text-gray-700 mb-2">Loading Special Offers</p>
      <p className="text-sm text-gray-500">
        {isUserLoading ? "Fetching user information..." : "Loading offers for your store..."}
      </p>
    </div>
  </div>
);

const ErrorState: React.FC<{ title: string; message: string }> = ({ title, message }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-md border border-red-100">
      <div className="bg-red-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-12 h-12 text-red-500" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <button
        onClick={() => window.location.reload()}
        className="bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-900 transition-all shadow-lg font-medium"
      >
        Reload Page
      </button>
    </div>
  </div>
);

const NoStoreState: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-md border border-yellow-100">
      <div className="bg-yellow-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
        <Store className="w-12 h-12 text-yellow-600" />
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-3">No Store Found</h3>
      <p className="text-gray-600 mb-6">No store is associated with your account.</p>
      <button className="bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-900 transition-all shadow-lg font-medium">
        Create Store
      </button>
    </div>
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
    <div className="bg-gray-100 rounded-full w-28 h-28 flex items-center justify-center mx-auto mb-6">
      <Gift className="w-14 h-14 text-gray-400" />
    </div>
    <h3 className="text-2xl font-bold text-gray-700 mb-3">No Special Offers Found</h3>
    <p className="text-gray-500 mb-8 max-w-md mx-auto">
      You haven&apos;t created any special offers for your store yet.
    </p>
    <button className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-900 transition-all shadow-md">
      Create Your First Offer
    </button>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const AllSpecialOffer: React.FC = () => {
  const [currentPage, setCurrentPage]     = useState<number>(1);
  const [itemsPerPage, setItemsPerPage]   = useState<number>(10);
  const [deleteTarget, setDeleteTarget] = useState<SpecialOffer | null>(null);
  const [deleteError, setDeleteError]   = useState<string | null>(null);

  const { data: userData, isLoading: isUserLoading, isError: isUserError } = useGetMeQuery(undefined);

  const storeId: string | undefined = userData?.data?.stores?.id;
  const storeName: string           = userData?.data?.stores?.name ?? "Your Store";

  const {
    data: offersData,
    isLoading: isOffersLoading,
    isError: isOffersError,
    error: offersError,
  } = useGetAllSpecialOfferByIdQuery(
    { id: storeId ?? "", page: currentPage, limit: itemsPerPage },
    { skip: !storeId },
  );

  const [deleteSpecialOffer, { isLoading: isDeleting }] = useDeleteSpecialOfferMutation();

  const isLoading = isUserLoading || (!!storeId && isOffersLoading);
  const offers    = (offersData as OffersResponse)?.data ?? [];
  const meta      = (offersData as OffersResponse)?.meta;

  const stats = {
    total:    offers.length,
    active:   offers.filter((o) => getStatus(o) === "active").length,
    upcoming: offers.filter((o) => getStatus(o) === "upcoming").length,
    expired:  offers.filter((o) => getStatus(o) === "expired").length,
    sent:     offers.reduce((a, o) => a + o.sentCount, 0),
    avgDisc:  offers.length > 0
      ? Math.round(offers.reduce((a, o) => a + o.discountValue, 0) / offers.length)
      : 0,
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteError(null);
    try {
      await deleteSpecialOffer(deleteTarget.id).unwrap();
      setDeleteTarget(null);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "data" in err
          ? (err as { data?: { message?: string } }).data?.message ?? "Failed to delete offer"
          : "Failed to delete offer";
      setDeleteError(msg);
    }
  };

  const handleDeleteClose = () => {
    setDeleteTarget(null);
    setDeleteError(null);
  };

  // ─── Guards ───────────────────────────────────────────────────────────────

  if (isUserError)   return <ErrorState title="Failed to Load User" message="Unable to fetch user information." />;
  if (isLoading)     return <LoadingState isUserLoading={isUserLoading} />;
  if (!storeId)      return <NoStoreState />;
  if (isOffersError) {
    const message = offersError && "data" in offersError
      ? (offersError.data as { message?: string })?.message ?? "Something went wrong"
      : "Failed to fetch special offers";
    return <ErrorState title="Failed to Load Offers" message={message} />;
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteModal
          offer={deleteTarget}
          isDeleting={isDeleting}
          errorMessage={deleteError}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteClose}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="md:text-4xl text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Special Offers
            </h1>
            {(offersData as OffersResponse)?.success && (
              <span className="px-3 py-1 bg-black text-white rounded-full text-sm font-medium">Live</span>
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-600 flex-wrap">
            <Store className="w-4 h-4" />
            <p className="text-sm">Store: <span className="font-semibold">{storeName}</span></p>
            <span className="w-2 h-2 bg-black rounded-full ml-2" />
            <p className="text-sm">
              {meta?.total ?? 0} offers • Page {meta?.page ?? 1} of {meta?.totalPage ?? 1}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {getStatsCards(stats).map(({ label, val, icon, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`${bg} p-2 rounded-lg`}>{icon}</div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{label}</p>
                  <p className="text-xl font-bold text-gray-800">{val}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Offers Grid */}
        {offers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => {
                const status = getStatus(offer);
                return (
                  <div
                    key={offer.id}
                    className="group bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Top bar */}
                    <div className="h-2 w-full bg-gradient-to-r from-gray-900 to-black" />

                    <div className="p-6">
                      {/* Discount + Status + Delete */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-3 rounded-xl bg-gray-100">
                            {offer.discountType === "PERCENTAGE"
                              ? <Percent className="w-6 h-6 text-gray-800" />
                              : <DollarSign className="w-6 h-6 text-gray-800" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-gray-900">
                                {offer.discountValue}{offer.discountType === "PERCENTAGE" ? "%" : "$"}
                              </span>
                              <span className="text-sm text-gray-500">OFF</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">ID: {offer.id.slice(0, 8)}…</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusClass[status]}`}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </span>
                          <button
                            onClick={() => setDeleteTarget(offer)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                            title="Delete offer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Product & Target */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Package className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="font-medium">Product:</span>
                          <span className="text-gray-500 truncate">{offer.productId.slice(0, 12)}…</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Target className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="font-medium">Target:</span>
                          <span className="text-gray-500 truncate">{offer.targetCustomerId.slice(0, 8)}…</span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                          <span>{formatDate(offer.startDate)} – {formatDate(offer.expireDate)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="w-4 h-4 text-gray-400 shrink-0" />
                          <span>Min. Order: <span className="font-medium text-gray-700">${offer.minimumOrderAmount}</span></span>
                        </div>
                        {offer.maximumDiscountAmount > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Tag className="w-4 h-4 text-gray-400 shrink-0" />
                            <span>Max Discount: <span className="font-medium text-gray-700">${offer.maximumDiscountAmount}</span></span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-gray-400 shrink-0" />
                          <span>Limit: <span className="font-medium text-gray-700">{offer.limitForSingleUser} per user</span></span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-900 px-3 py-1.5 rounded-lg">
                          <span className="text-xs font-semibold text-white">Sent: {offer.sentCount}</span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${offer.isActive ? "bg-green-500" : "bg-red-400"}`} />
                      </div>
                      <Link href={`/seller-dashboard/special-offers/view-offers/${offer.id}`}>
                        <button className="text-gray-900 hover:text-black font-medium text-sm transition-colors flex items-center gap-1 group">
                          View Details
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {meta && meta.totalPage > 1 && (
              <CustomPagination
                totalItems={meta.total}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                onPageChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                onItemsPerPageChange={(n) => { setItemsPerPage(n); setCurrentPage(1); }}
              />
            )}
          </>
        ) : (
          <EmptyState />
        )}

      </div>
    </div>
  );
};

export default AllSpecialOffer;