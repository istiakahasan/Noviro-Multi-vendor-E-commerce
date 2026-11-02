"use client";

import React, { useState } from 'react';
import { useGetEligibilityQuery } from '@/redux/api/withdrawApi/withdrawApi';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import {
  // CheckCircle2,
  // XCircle,
  // RefreshCw,
  Info,
  Wallet,
  DollarSign,
  Clock,
  TrendingUp,
  AlertCircle,
  ArrowDownToLine,
  Calendar,
} from 'lucide-react';
import { FaEuroSign } from 'react-icons/fa';

// interface EligibilityParams {
//   // Add any required params here
// }

const WithdrawalEligibility: React.FC = () => {
  const [params] = useState({});

  const {
    data: eligibilityData,
    isLoading,
    isError,
    // refetch,
  } = useGetEligibilityQuery(params);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (isError || !eligibilityData?.data) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load withdrawal eligibility. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  const { 
    eligible,
    walletBalance,
    availableBalance,
    withdrawableAmount,
    pendingBalance,
    pendingWithdrawal,
    settings,
    limits,
    breakdown,
    // message
  } = eligibilityData.data;

  // Calculate percentage of available balance relative to minimum required
  const minRequirementPercent = Math.min((availableBalance / limits.minimumRequired) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="lg:text-3xl md:text-2xl text-xl font-bold tracking-tight">Withdrawal Eligibility</h1>
          <p className="text-muted-foreground">
            Check your eligibility to withdraw funds from your wallet
          </p>
        </div>
      </div>

      {/* Eligibility Status Alert */}
      {/* <Alert variant={eligible ? "default" : "destructive"} className={eligible ? "bg-green-50 border-green-200" : ""}>
        {eligible ? (
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        ) : (
          <XCircle className="h-4 w-4" />
        )}
        <AlertTitle className={eligible ? "text-green-800" : ""}>
          {eligible ? "You are eligible to withdraw" : "Not Eligible for Withdrawal"}
        </AlertTitle>
        <AlertDescription className={eligible ? "text-green-700" : ""}>
          {message}
        </AlertDescription>
      </Alert> */}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full md:grid-cols-3 grid-cols-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="breakdown">Balance Breakdown</TabsTrigger>
          <TabsTrigger value="settings">Settings & Limits</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-12 md:mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Wallet Balance */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Wallet Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€{walletBalance.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Your total wallet balance
                </p>
              </CardContent>
            </Card>

            {/* Available Balance */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                <FaEuroSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  €{availableBalance.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Available for withdrawal
                </p>
              </CardContent>
            </Card>

            {/* Withdrawable Amount */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Withdrawable Amount</CardTitle>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Maximum amount after fees</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€{withdrawableAmount.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  After €{settings.withdrawalFee.toFixed(2)} fee
                </p>
              </CardContent>
            </Card>

            {/* Pending Balance */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
                <Clock className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  €{pendingBalance.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Including pending withdrawal
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Progress towards minimum requirement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Minimum Requirement Progress
              </CardTitle>
              <CardDescription>
                You need €{limits.minimumRequired.toFixed(2)} to withdraw (€{settings.minWithdrawal.toFixed(2)} + €{settings.withdrawalFee.toFixed(2)} fee)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Available: €{availableBalance.toFixed(2)}</span>
                  <span>Required: €{limits.minimumRequired.toFixed(2)}</span>
                </div>
                <Progress value={minRequirementPercent} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{minRequirementPercent.toFixed(0)}% Complete</span>
                  <span>
                    €{Math.max(0, limits.minimumRequired - availableBalance).toFixed(2)} remaining
                  </span>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Maximum Allowed</h4>
                  <p className="text-2xl font-bold text-primary">
                    €{limits.maxAllowedWithdrawal.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Amount After Fee</h4>
                  <p className="text-2xl font-bold">
                    €{limits.maxAfterFee.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Balance Breakdown
              </CardTitle>
              <CardDescription>
                Detailed breakdown of where your funds come from
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {/* Available from Orders */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium text-green-800">Available from Orders</h4>
                    <p className="text-sm text-green-600">
                      Completed and cleared orders
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-800">
                      €{breakdown.availableFromOrders.toFixed(2)}
                    </p>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {breakdown.availableOrdersCount} order(s)
                    </Badge>
                  </div>
                </div>

                {/* Pending from Orders */}
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium text-amber-800">Pending from Orders</h4>
                    <p className="text-sm text-amber-600">
                      Orders in progress
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-amber-800">
                      €{breakdown.pendingFromOrders.toFixed(2)}
                    </p>
                    <Badge variant="outline" className="border-amber-300 text-amber-800">
                      {breakdown.pendingOrdersCount} order(s)
                    </Badge>
                  </div>
                </div>

                {/* Pending from Bookings */}
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="space-y-1">
                    <h4 className="font-medium text-amber-800">Pending from Bookings</h4>
                    <p className="text-sm text-amber-600">
                      Bookings not yet completed
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-amber-800">
                      €{breakdown.pendingFromBookings.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Pending Withdrawal</h4>
                  <p className="text-2xl font-bold text-amber-600">
                    €{pendingWithdrawal.toFixed(2)}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Total Pending</h4>
                  <p className="text-2xl font-bold text-amber-600">
                    €{(pendingBalance + pendingWithdrawal).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings & Limits Tab */}
        <TabsContent value="settings" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Withdrawal Settings
                </CardTitle>
                <CardDescription>
                  Platform withdrawal configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Minimum Withdrawal</p>
                    <p className="text-xl font-bold">€{settings.minWithdrawal.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Maximum Withdrawal</p>
                    <p className="text-xl font-bold">€{settings.maxWithdrawal.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Withdrawal Fee</p>
                    <p className="text-xl font-bold">€{settings.withdrawalFee.toFixed(2)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Commission</p>
                    <p className="text-xl font-bold">€{settings.commissionPercent}%</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Processing Time</p>
                    <p className="font-medium">{settings.processingDays} business days</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Limits Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Current Limits
                </CardTitle>
                <CardDescription>
                  Your current withdrawal limitations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>Meets Minimum Requirement</span>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>€{limits.minimumRequired.toFixed(2)} needed</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <Badge variant={limits.meetsMinimum ? "default" : "destructive"}>
                      {limits.meetsMinimum ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Can Withdraw Today</span>
                    <Badge variant={limits.canWithdrawToday ? "default" : "secondary"}>
                      {limits.canWithdrawToday ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium">Minimum Required Amount</h4>
                  <p className="text-2xl font-bold text-destructive">
                    €{limits.minimumRequired.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    €{settings.minWithdrawal.toFixed(2)} amount + €{settings.withdrawalFee.toFixed(2)} fee
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Important Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-primary mt-0.5" />
                  <span>Withdrawals are processed within <strong>{settings.processingDays} business days</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <DollarSign className="h-4 w-4 text-primary mt-0.5" />
                  <span>A fee of <strong>€{settings.withdrawalFee.toFixed(2)}</strong> will be deducted from each withdrawal</span>
                </li>
                <li className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-primary mt-0.5" />
                  <span>Available balance includes <strong>cleared payments only</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-primary mt-0.5" />
                  <span>Pending balances will become available after <strong>order completion</strong></span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Button */}
      <div className="sticky bottom-6 mt-8">
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold">Ready to Withdraw?</h3>
                <p className="text-sm text-muted-foreground">
                  {eligible && limits.canWithdrawToday 
                    ? "You can withdraw up to $" + limits.maxAfterFee.toFixed(2) + " after fees"
                    : "Check eligibility requirements above"}
                </p>
              </div>
              <Button 
                size="lg" 
                className="gap-2"
                disabled={!eligible || !limits.canWithdrawToday}
              >
                <ArrowDownToLine className="h-5 w-5" />
                Initiate Withdrawal
              </Button>
            </div>
            {(!eligible || !limits.canWithdrawToday) && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                {!eligible ? "You don't meet the minimum requirements" : "Withdrawal not available today"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WithdrawalEligibility;