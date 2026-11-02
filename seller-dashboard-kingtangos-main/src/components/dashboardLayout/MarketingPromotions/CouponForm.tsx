/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useGetMeQuery } from "@/redux/api/authApi";
import { useCreateCouponMutation } from "@/redux/api/couponApi/couponApi";
import { useRouter } from "next/navigation";

interface CouponFormData {
  couponCode: string;
  discountType: string;
  discount: string;
  limitPerUser: string;
  minOrderAmount: string;
  maxDiscountAmount: string;
  startDate: string;
  startTime: string;
  expireDate: string;
  expireTime: string;
}

export default function CouponForm() {
  const { register, handleSubmit, setValue, reset, watch, formState: { errors } } = useForm<CouponFormData>({
    defaultValues: {
      couponCode: "",
      discountType: "Amount",
      discount: "",
      limitPerUser: "",
      minOrderAmount: "",
      maxDiscountAmount: "",
      startDate: "",
      startTime: "",
      expireDate: "",
      expireTime: "",
    },
  });

    const router = useRouter();
  // Get storeId from user data
  const { data: userData, isLoading: userLoading } = useGetMeQuery({});
  const [createCoupon, { isLoading }] = useCreateCouponMutation();

  // Extract storeId from the response
  const storeId = userData?.data?.stores?.id;

  const onSubmit = async (data: CouponFormData) => {
    console.log("Form submitted with data:", data);
    
    try {
      if (!storeId) {
        toast.error("Store not found", {
          description: "Please make sure you have a store setup before creating coupons.",
        });
        return;
      }

      // Transform data to match API requirements dynamically
      const formData = {
        storeId: storeId,
        couponCode: data.couponCode,
        discountType: data.discountType.toUpperCase(),
        discount: Number(data.discount),
        minimumOrderAmount: Number(data.minOrderAmount),
        maximumOrderAmount: Number(data.maxDiscountAmount),
        limitForSingleUser: Number(data.limitPerUser),
        startDate: `${data.startDate}T00:00:00.000Z`,
        expireDate: `${data.expireDate}T23:59:59.999Z`,
        startTime: data.startTime,
        expireTime: data.expireTime,
        tags: ["general"]
      };

      console.log("Sending form data to API:", formData);

      const result = await createCoupon(formData).unwrap();
      
      if (result.success) {
        toast.success("Coupon created successfully!");
        console.log("Created coupon:", result.data);
        
        // Reset form after successful submission
        reset();
             router.push("/seller-dashboard/marketing-promotions");
      } else {
        toast.error(result.message || "Failed to create coupon");
      }
    } catch (error: any) {
      console.error("Error creating coupon:", error);
      toast.error(
        error?.data?.message || error?.message || "Failed to create coupon!"
      );
    }
  };

  const discountType = watch("discountType");

  if (userLoading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  // Check if user has a store
  if (!userLoading && !storeId) {
    return (
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Store Found</h3>
        <p className="text-gray-600 mb-4">
          You need to create a store before you can create coupons.
        </p>
        <Button className="bg-black text-white">
          Create Store
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg border border-gray-200 shadow-sm"
    >
      {/* Left Column */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Coupon Code</label>
          <Input 
            placeholder="SAVE23" 
            {...register("couponCode", { 
              required: "Coupon code is required",
              pattern: {
                value: /^[A-Z0-9]+$/,
                message: "Coupon code should contain only uppercase letters and numbers"
              }
            })} 
          />
          {errors.couponCode && (
            <p className="text-red-500 text-xs mt-1">{errors.couponCode.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Discount</label>
          <Input 
            placeholder="20" 
            type="number"
            min="0"
            {...register("discount", { 
              required: "Discount is required",
              min: { value: 0, message: "Discount cannot be negative" }
            })} 
          />
          {errors.discount && (
            <p className="text-red-500 text-xs mt-1">{errors.discount.message}</p>
          )}
          {discountType === "Percentage" && (
            <p className="text-xs text-gray-500 mt-1">Enter percentage value (e.g., 20 for 20%)</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Limit For Single User
          </label>
          <Input 
            placeholder="1" 
            type="number"
            min="1"
            {...register("limitPerUser", { 
              required: "Limit per user is required",
              min: { value: 1, message: "Limit must be at least 1" }
            })} 
          />
          {errors.limitPerUser && (
            <p className="text-red-500 text-xs mt-1">{errors.limitPerUser.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Start Date</label>
          <Input 
            type="date" 
            {...register("startDate", { required: "Start date is required" })} 
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Expire Date</label>
          <Input 
            type="date" 
            {...register("expireDate", { required: "Expire date is required" })} 
          />
          {errors.expireDate && (
            <p className="text-red-500 text-xs mt-1">{errors.expireDate.message}</p>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <Button 
            type="submit" 
            className="bg-black text-white"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Save"}
          </Button>
          <Button 
            variant="outline" 
            type="button"
            onClick={() => reset()}
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Discount Type
          </label>
          <Select
            onValueChange={(val) => setValue("discountType", val)}
            defaultValue="Amount"
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">Fixed</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Minimum Order Amount
          </label>
          <Input 
            placeholder="50" 
            type="number"
            min="0"
            {...register("minOrderAmount", { 
              required: "Minimum order amount is required",
              min: { value: 0, message: "Amount cannot be negative" }
            })} 
          />
          {errors.minOrderAmount && (
            <p className="text-red-500 text-xs mt-1">{errors.minOrderAmount.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Maximum Discount Amount
          </label>
          <Input 
            placeholder="500" 
            type="number"
            min="0"
            {...register("maxDiscountAmount", { 
              required: "Maximum discount amount is required",
              min: { value: 0, message: "Amount cannot be negative" }
            })} 
          />
          {errors.maxDiscountAmount && (
            <p className="text-red-500 text-xs mt-1">{errors.maxDiscountAmount.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <Input 
            type="time" 
            {...register("startTime", { required: "Start time is required" })} 
          />
          {errors.startTime && (
            <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Expire Time</label>
          <Input 
            type="time" 
            {...register("expireTime", { required: "Expire time is required" })} 
          />
          {errors.expireTime && (
            <p className="text-red-500 text-xs mt-1">{errors.expireTime.message}</p>
          )}
        </div>
      </div>
    </form>
  );
}