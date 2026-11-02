"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Tag,
  Users,
  Gift,
  Percent,
  DollarSign,
  AlertCircle,
  RefreshCw,
  Package,
  Target,
  Store,
  Mail,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  ShoppingCart,
  BadgePercent,
  Hash,
} from 'lucide-react';
import { useGetSingleSpecialOfferByIdQuery } from '../../redux/api/specialOfferApi/specialOfferApi';
import { FaEuroSign } from 'react-icons/fa';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SpecialOffer {
  id: string;
  storeId: string;
  productId: string;
  discountType: 'PERCENTAGE' | 'FIXED';
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
  store: {
    name: string;
    email: string;
  };
  product: {
    name: string;
    price: number;
  };
}

type DiscountStatus = 'active' | 'upcoming' | 'expired';

interface OfferDetailsPageProps {
  offerViewId: string;
}

// ─── Sub Components ───────────────────────────────────────────────────────────

const InfoRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0">
    <div className="flex items-center gap-3 text-gray-500">
      <span className="shrink-0">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
    <div className="text-sm font-semibold text-gray-800 text-right">{value}</div>
  </div>
);

const SectionCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, icon, children }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
      <span className="text-gray-700">{icon}</span>
      <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wider">{title}</h3>
    </div>
    <div className="px-6 py-2">{children}</div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const OfferDetailsPage: React.FC<OfferDetailsPageProps> = ({ offerViewId }) => {
  const router = useRouter();

  const {
    data: offerData,
    isLoading,
    isError,
    error,
  } = useGetSingleSpecialOfferByIdQuery(offerViewId);

  const offer: SpecialOffer | undefined = (offerData as { data?: SpecialOffer })?.data;

  // ── Helpers ───────────────────────────────────────────────────────────────

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric',
    });

  const formatDateTime = (d: string) =>
    new Date(d).toLocaleString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const getStatus = (o: SpecialOffer): DiscountStatus => {
    const now = Date.now();
    if (now < new Date(o.startDate).getTime()) return 'upcoming';
    if (now > new Date(o.expireDate).getTime()) return 'expired';
    return 'active';
  };

  const getDaysRemaining = (expireDate: string): number =>
    Math.max(0, Math.ceil((new Date(expireDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  // ── Loading ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="relative">
            <RefreshCw className="w-16 h-16 animate-spin text-gray-900 mx-auto mb-6" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Gift className="w-7 h-7 text-gray-900 animate-pulse" />
            </div>
          </div>
          <p className="text-lg font-semibold text-gray-700">Loading offer details...</p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────

  if (isError || !offer) {
    const msg =
      error && 'data' in error
        ? (error.data as { message?: string })?.message ?? 'Something went wrong'
        : 'Failed to fetch offer details';
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="text-center bg-white p-10 rounded-2xl shadow-xl max-w-md border border-red-100">
          <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Failed to Load Offer</h3>
          <p className="text-gray-500 mb-6 text-sm">{msg}</p>
          <button
            onClick={() => router.back()}
            className="bg-black text-white px-6 py-2.5 rounded-xl hover:bg-gray-900 transition-all font-medium text-sm"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // ── Derived values ────────────────────────────────────────────────────────

  const status = getStatus(offer);
  const daysLeft = getDaysRemaining(offer.expireDate);

  const statusConfig = {
    active:   { label: 'Active',   bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-200',  dot: 'bg-green-500',  pulse: true  },
    upcoming: { label: 'Upcoming', bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', dot: 'bg-yellow-500', pulse: false },
    expired:  { label: 'Expired',  bg: 'bg-gray-100',   text: 'text-gray-600',   border: 'border-gray-200',   dot: 'bg-gray-400',   pulse: false },
  }[status];

  const discountDisplay = `${offer.discountValue}${offer.discountType === 'PERCENTAGE' ? '%' : '€'} OFF`;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6 group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Special Offers
        </button>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="h-2 bg-gradient-to-r from-gray-900 to-black" />

          <div className="p-8">
            {/* Top row: discount + status */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Discount hero */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center shadow-lg shrink-0">
                  {offer.discountType === 'PERCENTAGE'
                    ? <BadgePercent className="w-10 h-10 text-white" />
                    : <DollarSign className="w-10 h-10 text-white" />}
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-1">Discount Offer</p>
                  <h1 className="text-5xl font-black text-gray-900 leading-none">{discountDisplay}</h1>
                  <p className="text-gray-400 text-sm mt-2">
                    {offer.discountType === 'PERCENTAGE' ? 'Percentage discount' : 'Fixed amount discount'}
                  </p>
                </div>
              </div>

              {/* Status + active flag */}
              <div className="flex flex-col gap-3 md:items-end">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusConfig.dot} ${statusConfig.pulse ? 'animate-pulse' : ''}`} />
                  {statusConfig.label}
                </span>

                {status === 'active' && (
                  <p className="text-sm text-gray-500">
                    <span className="font-bold text-gray-800">{daysLeft}</span> days remaining
                  </p>
                )}

                <div className="flex items-center gap-2">
                  {offer.isActive ? (
                    <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-sm text-green-600 font-medium">Offer enabled</span></>
                  ) : (
                    <><XCircle className="w-4 h-4 text-red-400" /><span className="text-sm text-red-500 font-medium">Offer disabled</span></>
                  )}
                </div>
              </div>
            </div>

            {/* Quick stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100">
              {[
                { label: 'Min. Order',     value: `€${offer.minimumOrderAmount}`,    icon: <ShoppingCart className="w-4 h-4" /> },
                { label: 'Max Discount',   value: `€${offer.maximumDiscountAmount}`, icon: <Tag className="w-4 h-4" /> },
                { label: 'Per User Limit', value: `${offer.limitForSingleUser}x`,    icon: <Users className="w-4 h-4" /> },
                { label: 'Total Sent',     value: offer.sentCount,                   icon: <Gift className="w-4 h-4" /> },
              ].map(({ label, value, icon }) => (
                <div key={label} className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex justify-center mb-2 text-gray-500">{icon}</div>
                  <p className="text-2xl font-black text-gray-900">{value}</p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detail Section Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Schedule */}
          <SectionCard title="Schedule" icon={<Calendar className="w-4 h-4" />}>
            <InfoRow icon={<Clock className="w-4 h-4" />} label="Start Date"       value={formatDate(offer.startDate)} />
            <InfoRow icon={<Clock className="w-4 h-4" />} label="Expiry Date"      value={formatDate(offer.expireDate)} />
            <InfoRow
              icon={<Calendar className="w-4 h-4" />}
              label="Days Remaining"
              value={
                status === 'expired'   ? <span className="text-gray-400">Expired</span> :
                status === 'upcoming'  ? <span className="text-yellow-600">Not started yet</span> :
                                         <span className="text-green-600 font-bold">{daysLeft} days</span>
              }
            />
          </SectionCard>

          {/* Discount Details */}
          <SectionCard title="Discount Details" icon={<Percent className="w-4 h-4" />}>
            <InfoRow icon={<BadgePercent className="w-4 h-4" />} label="Discount Type"    value={offer.discountType === 'PERCENTAGE' ? 'Percentage (%)' : 'Fixed Amount (€)'} />
            <InfoRow icon={<Percent className="w-4 h-4" />}      label="Discount Value"   value={`${offer.discountValue}${offer.discountType === 'PERCENTAGE' ? '%' : '€'}`} />
            <InfoRow icon={<Tag className="w-4 h-4" />}          label="Max Discount Cap" value={`€${offer.maximumDiscountAmount}`} />
            <InfoRow icon={<ShoppingCart className="w-4 h-4" />} label="Min. Order"       value={`€${offer.minimumOrderAmount}`} />
          </SectionCard>

          {/* Product */}
          <SectionCard title="Product" icon={<Package className="w-4 h-4" />}>
            <InfoRow icon={<Package className="w-4 h-4" />}    label="Product Name"  value={offer.product.name} />
            <InfoRow icon={<FaEuroSign className="w-4 h-4" />} label="Product Price" value={`€${offer.product.price}`} />
            <InfoRow icon={<Hash className="w-4 h-4" />}       label="Product ID"    value={<span className="font-mono text-xs text-gray-400">{offer.productId.slice(0, 20)}…</span>} />
          </SectionCard>

          {/* Store */}
          <SectionCard title="Store" icon={<Store className="w-4 h-4" />}>
            <InfoRow icon={<Store className="w-4 h-4" />}  label="Store Name"  value={offer.store.name} />
            <InfoRow icon={<Mail className="w-4 h-4" />}   label="Store Email" value={offer.store.email} />
            <InfoRow icon={<Hash className="w-4 h-4" />}   label="Store ID"    value={<span className="font-mono text-xs text-gray-400">{offer.storeId.slice(0, 20)}…</span>} />
          </SectionCard>

          {/* Target & Usage */}
          <SectionCard title="Target & Usage" icon={<Target className="w-4 h-4" />}>
            <InfoRow icon={<Target className="w-4 h-4" />} label="Target Customer ID" value={<span className="font-mono text-xs text-gray-400">{offer.targetCustomerId.slice(0, 20)}…</span>} />
            <InfoRow icon={<Users className="w-4 h-4" />}  label="Per User Limit"     value={`${offer.limitForSingleUser} use${offer.limitForSingleUser > 1 ? 's' : ''}`} />
            <InfoRow icon={<Gift className="w-4 h-4" />}   label="Total Sent"         value={offer.sentCount} />
          </SectionCard>

          {/* System Info */}
          <SectionCard title="System Info" icon={<Hash className="w-4 h-4" />}>
            <InfoRow icon={<Hash className="w-4 h-4" />}  label="Offer ID"     value={<span className="font-mono text-xs text-gray-400">{offer.id.slice(0, 20)}…</span>} />
            <InfoRow icon={<Clock className="w-4 h-4" />} label="Created At"   value={formatDateTime(offer.createdAt)} />
            <InfoRow icon={<Clock className="w-4 h-4" />} label="Last Updated" value={formatDateTime(offer.updatedAt)} />
          </SectionCard>

        </div>
      </div>
    </div>
  );
};

export default OfferDetailsPage;