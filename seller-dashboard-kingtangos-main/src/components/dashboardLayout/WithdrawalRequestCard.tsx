/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCreateWithdrawalMutation } from "@/redux/api/withdrawApi/withdrawApi";

export default function WithdrawalRequestCard() {
  const [amount, setAmount] = useState("");
  const [createWithdrawal, { isLoading, data }] = useCreateWithdrawalMutation();

  const handleSubmit = async () => {
    if (!amount) {
      toast.error("Please enter withdrawal amount");
      return;
    }

    try {
      await createWithdrawal({ amount: Number(amount) }).unwrap();
      toast.success("Withdrawal request submitted");
      setAmount("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  const info = data?.data;

  return (
    <Card className=" rounded-2xl shadow-sm">
      <CardContent className="p-6 space-y-5">
        <h2 className="text-xl font-semibold">Withdraw Balance</h2>

        <div className="space-y-2">
          <Label>Withdrawal Amount</Label>
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <Button
          className="w-full"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Request Withdrawal"}
        </Button>

        {info && (
          <div className="border rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Status</span>
              <span className="font-medium text-orange-600">{info.status}</span>
            </div>
            <div className="flex justify-between">
              <span>Requested Amount</span>
              <span>€{info.amount}</span>
            </div>
            <div className="flex justify-between">
              <span>Withdrawal Fee</span>
              <span>€{info.withdrawalFee}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total Deduction</span>
              <span>€{info.totalDeduction}</span>
            </div>
            <div className="flex justify-between">
              <span>Available Balance</span>
              <span>€{info.availableBalance}</span>
            </div>
            <div className="flex justify-between">
              <span>Withdrawable Amount</span>
              <span>€{info.withdrawableAmount}</span>
            </div>
            <div className="text-xs text-muted-foreground pt-2">
              Processing time: {info.processingDays} business days
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

