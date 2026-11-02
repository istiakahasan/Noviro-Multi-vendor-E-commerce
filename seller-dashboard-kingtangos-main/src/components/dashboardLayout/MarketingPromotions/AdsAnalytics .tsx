"use client";

import React, { useState } from "react";
import {
  TrendingUp, Eye, MousePointer, CheckCircle, Clock,
  XCircle, AlertCircle, Loader2, RefreshCw, Filter,
  Store, Ban, Timer, Wallet, Calendar, ChevronDown,
  ChevronUp,                                          // ← added
} from "lucide-react";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useGetSellerAdvertisementAnalyticsByIdQuery } from "@/redux/api/advertisementApi/advertisementApi";

interface Ad {
  id: string;
  status: string;
  totalDays: number;
  totalPrice: number;
  isPaid: boolean;
  impressions: number;
  clicks: number;
  startDate: string | null;
  endDate: string | null;
  product: { id: string; name: string };
}

interface Summary {
  totalAds: number;
  activeAds: number;
  pendingAds: number;
  paidPendingApproval: number;
  totalImpressions: number;
  totalClicks: number;
  totalSpent: string;
  ctr: string;
}

interface StoreInfo {
  id: string;
  name: string;
  location?: string;
  logo?: string;
  phone?: string;
  shopStatus: string;
  status: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
}

const PAGE_SIZE = 6;                                  // ← added

const STATUS_CONFIG: Record<string, { bg: string; text: string; icon: React.ElementType; label: string }> = {
  PENDING:         { bg: "bg-amber-50",   text: "text-amber-700",   icon: Clock,       label: "Pending Review"  },
  PAYMENT_PENDING: { bg: "bg-orange-50",  text: "text-orange-700",  icon: Wallet,      label: "Payment Pending" },
  PAID:            { bg: "bg-sky-50",     text: "text-sky-700",     icon: CheckCircle, label: "Paid"            },
  APPROVED:        { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle, label: "Approved"        },
  REJECTED:        { bg: "bg-red-50",     text: "text-red-700",     icon: XCircle,     label: "Rejected"        },
  CANCELLED:       { bg: "bg-slate-100",  text: "text-slate-600",   icon: Ban,         label: "Cancelled"       },
  EXPIRED:         { bg: "bg-purple-50",  text: "text-purple-700",  icon: Timer,       label: "Expired"         },
};

const STATUS_FILTER_OPTIONS = [
  { value: "ALL",             label: "All" },
  { value: "PENDING",         label: "Pending" },
  { value: "PAYMENT_PENDING", label: "Payment Pending" },
  { value: "PAID",            label: "Paid" },
  { value: "APPROVED",        label: "Approved" },
  { value: "REJECTED",        label: "Rejected" },
  { value: "CANCELLED",       label: "Cancelled" },
  { value: "EXPIRED",         label: "Expired" },
];

const DEFAULT_SUMMARY: Summary = {
  totalAds: 0, activeAds: 0, pendingAds: 0, paidPendingApproval: 0,
  totalImpressions: 0, totalClicks: 0, totalSpent: "0.00", ctr: "0%",
};

const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status] ?? { bg: "bg-gray-100", text: "text-gray-600", icon: AlertCircle, label: status };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
      <Icon className="w-3 h-3 flex-shrink-0" />
      {cfg.label}
    </span>
  );
};

const MetricCard = ({ label, value, icon: Icon, color, sub }: {
  label: string; value: string | number; icon: React.ElementType; color: string; sub?: string;
}) => (
  <div className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-3 shadow-sm">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
      <Icon className="w-4 h-4 text-white" />
    </div>
    <div>
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const CenteredMessage = ({ icon: Icon, color = "text-gray-400", title, message, action }: {
  icon: React.ElementType; color?: string; title: string; message: string; action?: React.ReactNode;
}) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center max-w-sm p-8 bg-white rounded-2xl shadow-sm border border-gray-100">
      <Icon className={`w-14 h-14 ${color} mx-auto mb-4`} />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6">{message}</p>
      {action}
    </div>
  </div>
);

const AdsAnalytics = () => {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showAll, setShowAll]           = useState(false);  // ← added

  const { data: userData, isLoading: userLoading, isError: userError } = useGetMeQuery({});

  const store: StoreInfo | undefined = userData?.data?.stores ?? userData?.data?.store;
  const storeId = store?.id;

  const {
    data: analyticsRaw,
    isLoading: analyticsLoading,
    isError: analyticsError,
    refetch,
  } = useGetSellerAdvertisementAnalyticsByIdQuery(
    { id: storeId },
    { skip: !storeId }
  );

  const summary: Summary = analyticsRaw?.data?.summary ?? DEFAULT_SUMMARY;
  const ads: Ad[]        = analyticsRaw?.data?.ads ?? [];

  const statusDistribution = ads.reduce<Record<string, number>>((acc, ad) => {
    acc[ad.status] = (acc[ad.status] ?? 0) + 1;
    return acc;
  }, {});

  const filteredAds  = statusFilter === "ALL" ? ads : ads.filter(ad => ad.status === statusFilter);
  const visibleAds   = showAll ? filteredAds : filteredAds.slice(0, PAGE_SIZE);  // ← added
  const hasMore      = filteredAds.length > PAGE_SIZE;                            // ← added
  const hiddenCount  = filteredAds.length - PAGE_SIZE;                            // ← added

  if (userLoading || (!!storeId && analyticsLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading analytics…</p>
        </div>
      </div>
    );
  }

  if (userError) return (
    <CenteredMessage icon={XCircle} color="text-red-500"
      title="Authentication Error" message="Failed to load user data. Please refresh."
      action={<button onClick={() => window.location.reload()}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
        <RefreshCw className="w-4 h-4" /> Reload
      </button>}
    />
  );

  if (!storeId) return (
    <CenteredMessage icon={Store}
      title="No Store Found" message="Create a store first to view advertisement analytics."
      action={<button onClick={() => (window.location.href = "/create-store")}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
        <Store className="w-4 h-4" /> Create Store
      </button>}
    />
  );

  if (analyticsError) return (
    <CenteredMessage icon={XCircle} color="text-red-500"
      title="Failed to Load Analytics" message="Could not fetch ad data. Please try again."
      action={<button onClick={refetch}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
        <RefreshCw className="w-4 h-4" /> Try Again
      </button>}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Page Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Advertisement Analytics</h1>
            <p className="text-sm text-gray-500 mt-0.5">Performance overview for <span className="font-medium text-gray-700">{store?.name}</span></p>
          </div>
          <button onClick={refetch} className="p-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors" title="Refresh">
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <MetricCard label="Total Ads"    value={summary.totalAds}                           icon={AlertCircle}  color="bg-blue-600" />
          <MetricCard label="Active Ads"   value={summary.activeAds}                          icon={CheckCircle}  color="bg-emerald-600" />
          <MetricCard label="Total Spent"  value={`€${summary.totalSpent}`}                   icon={Wallet}       color="bg-violet-600" />
          <MetricCard label="Impressions"  value={summary.totalImpressions.toLocaleString()}  icon={Eye}          color="bg-sky-600"   sub="Total views" />
          <MetricCard label="Clicks"       value={summary.totalClicks.toLocaleString()}        icon={MousePointer} color="bg-teal-600"  sub="Interactions" />
          <MetricCard label="CTR"          value={summary.ctr}                                 icon={TrendingUp}   color="bg-pink-600"  sub="Click-through rate" />
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Status Breakdown</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
              const Icon = cfg.icon;
              return (
                <div key={key} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.text}`}>
                  <Icon className="w-3.5 h-3.5" />
                  {cfg.label}
                  <span className="bg-white/70 px-1.5 py-0.5 rounded-full font-bold">{statusDistribution[key] ?? 0}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ads Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Advertisements</h2>
              <p className="text-xs text-gray-400 mt-0.5">{filteredAds.length} ad{filteredAds.length !== 1 ? "s" : ""}</p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={e => { setStatusFilter(e.target.value); setShowAll(false); }} // ← reset on filter change
                  className="appearance-none pl-3 pr-8 py-1.5 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {STATUS_FILTER_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">Product</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Duration</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th className="px-6 py-3 text-left">Payment</th>
                  <th className="px-6 py-3 text-left">Impressions</th>
                  <th className="px-6 py-3 text-left">Clicks</th>
                  <th className="px-6 py-3 text-left">CTR</th>
                  <th className="px-6 py-3 text-left">Date Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visibleAds.map(ad => {                           {/* ← visibleAds instead of filteredAds */}
                  const ctr = ad.impressions > 0
                    ? ((ad.clicks / ad.impressions) * 100).toFixed(2) + "%"
                    : "0%";
                  return (
                    <tr key={ad.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900">{ad.product.name}</p>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">{ad.product.id.slice(0, 8)}…</p>
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={ad.status} /></td>
                      <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{ad.totalDays} days</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">€{ad.totalPrice}</td>
                      <td className="px-6 py-4">
                        {ad.isPaid
                          ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"><CheckCircle className="w-3 h-3" /> Paid</span>
                          : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700"><XCircle className="w-3 h-3" /> Unpaid</span>
                        }
                      </td>
                      <td className="px-6 py-4 text-gray-700">{ad.impressions.toLocaleString()}</td>
                      <td className="px-6 py-4 text-gray-700">{ad.clicks.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${parseFloat(ctr) > 0 ? "text-emerald-600" : "text-gray-400"}`}>{ctr}</span>
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {ad.startDate && ad.endDate ? (
                          <div className="space-y-0.5 whitespace-nowrap">
                            <p>{new Date(ad.startDate).toLocaleDateString()}</p>
                            <p className="text-gray-400">{new Date(ad.endDate).toLocaleDateString()}</p>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Not started</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredAds.length === 0 && (
              <div className="text-center py-16">
                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-600">No advertisements found</p>
                <p className="text-xs text-gray-400 mt-1">
                  {statusFilter === "ALL" ? "No ads yet." : `No ${statusFilter.toLowerCase().replace(/_/g, " ")} ads.`}
                </p>
              </div>
            )}

            {/* ── See More / See Less ── */}
            {hasMore && (
              <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-center">
                <button
                  onClick={() => setShowAll(prev => !prev)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  {showAll ? (
                    <><ChevronUp className="w-4 h-4" /> See less</>
                  ) : (
                    <><ChevronDown className="w-4 h-4" /> See {hiddenCount} more ad{hiddenCount !== 1 ? "s" : ""}</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdsAnalytics;