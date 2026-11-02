"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CalendarDays, Clock, User, ShoppingCart, Copy } from 'lucide-react';
import { Coupon } from '@/types/storeAllCoupon.type';

interface CouponCardProps {
    coupon: Coupon;
}

const CouponBox: React.FC<CouponCardProps> = ({ coupon }: CouponCardProps) => {

    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (coupon?.couponCode) {
            navigator.clipboard.writeText(coupon.couponCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Format time to AM/PM format
    const formatTime = (timeString: string) => {
        if (!timeString) return '';

        // Parse time string (HH:mm)
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes);

        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const isCouponActive = () => {
        const now = new Date();
        const startDate = new Date(coupon.startDate);
        const expireDate = new Date(coupon.expireDate);
        return now >= startDate && now <= expireDate;
    };

    // Check for data inconsistencies
    const hasInconsistency = coupon?.minimumOrderAmount > coupon?.maximumOrderAmount;

    return (
        <Card className="w-full max-w-2xl overflow-hidden border shadow-lg hover:shadow-xl transition-all duration-300">
            {/* Card Header with Discount Highlight */}
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Badge
                                variant={isCouponActive() ? "default" : "secondary"}
                                className="font-semibold"
                            >
                                {isCouponActive() ? "Active" : "Inactive"}
                            </Badge>

                        </div>
                        <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                            {coupon.discount}
                            {coupon.discountType === 'PERCENTAGE' ? '% OFF' : '€ OFF'}
                        </CardTitle>
                        <CardDescription className="text-lg  font-medium text-gray-600 dark:text-gray-300 mt-1">
                            <div className=" rounded-lg ">
                                <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                    Coupon Code
                                </p>
                                <div className="flex items-center justify-between gap-2 sm:gap-3">
                                    <code className="text-lg sm:text-xl font-semi text-primary bg-white px-3 sm:px-3 py-1 sm:py-2 rounded border flex-1 text-center">
                                        {coupon.couponCode}
                                    </code>
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-1 sm:gap-2 bg-primary hover:bg-primary/90 text-white px-3 sm:px-3 py-1 sm:py-2 rounded font-medium transition-colors whitespace-nowrap"
                                    >
                                        <Copy className="h-4 w-4" />
                                        <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                                        <span className="sm:hidden">{copied ? '✓' : 'Copy'}</span>
                                    </button>
                                </div>
                            </div>
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <Separator />

            {/* Card Content */}
            <CardContent className="pt-6">

                <div className='mb-2'>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Order Requirements
                    </h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Min. Order:</span>
                            <span className="font-medium">€{coupon.minimumOrderAmount}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Max. Order:</span>
                            <span className={`font-medium €{hasInconsistency ? 'text-red-500' : ''}`}>
                                €{coupon.maximumOrderAmount}
                                {hasInconsistency && ''}
                            </span>
                        </div>
                        {coupon.maximumDiscountAmount && (
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Max. Discount:</span>
                                <span className="font-medium">€{coupon.maximumDiscountAmount}</span>
                            </div>
                        )}
                    </div>
                </div>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-2">
                    <div>
                        <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                            <CalendarDays className="h-4 w-4" />
                            Validity Period
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Start:</span>
                                <span className="font-medium">{formatDate(coupon.startDate)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Expire:</span>
                                <span className="font-medium">{formatDate(coupon.expireDate)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Validity Period */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Daily Timing
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">From:</span>
                                    <span className="font-medium">{formatTime(coupon.startTime)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">To:</span>
                                    <span className="font-medium">{formatTime(coupon.expireTime)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className='mt-2'>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <User className="h-4 w-4" />
                        User Limit
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Each user can use this coupon <span className="font-bold">{coupon.limitForSingleUser} time(s)</span>
                    </p>
                </div>

            </CardContent>

            <Separator />

        </Card>
    );
};

export default CouponBox;