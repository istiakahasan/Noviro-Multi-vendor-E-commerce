/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { useGetAllStoreProductQuery } from "@/redux/api/productApi/productApi";
import { useGetMyConversationQuery } from "@/redux/api/messageApi/messageApi";
import { useCreateSpecialOfferMutation } from "@/redux/api/specialOfferApi/specialOfferApi";


// Types
interface Product {
  id: string;
  name: string;
  price: number;
  finalPrice: number;
  discount: number;
  storeId: string;
  status: string;
  images?: string[];
  variants?: Array<{ image: string }>;
  category?: { name: string };
}

interface Conversation {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic?: string;
}

interface OfferForm {
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: string;
  minimumOrderAmount: string;
  maximumDiscountAmount: string;
  startDate: Date | undefined;
  expireDate: Date | undefined;
}

interface CreateOfferPayload {
  storeId: string;
  productId: string;
  targetCustomerId: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  startDate: string;
  expireDate: string;
}

interface FormErrors {
  product?: string;
  customer?: string;
  discountValue?: string;
  startDate?: string;
  expireDate?: string;
  submit?: string;
}

interface CreateOfferModalProps {
  onSubmit?: (payload: CreateOfferPayload) => Promise<void>;
}

// Helper: strips time so we compare dates only
const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export default function CreateOfferModal({ onSubmit }: CreateOfferModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Conversation | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState(false);

  // Use the RTK Query mutation
  const [createSpecialOffer, { isLoading: loading }] = useCreateSpecialOfferMutation();

  const [form, setForm] = useState<OfferForm>({
    discountType: "PERCENTAGE",
    discountValue: "",
    minimumOrderAmount: "",
    maximumDiscountAmount: "",
    startDate: undefined,
    expireDate: undefined,
  });

  // RTK Query hooks
  const { data: productsData, isLoading: productsLoading } =
    useGetAllStoreProductQuery({}, { skip: !open });

  const { data: conversationsData, isLoading: convsLoading } =
    useGetMyConversationQuery(undefined, { skip: !open });

  const allProducts = (productsData?.data?.data as Product[]) || [];

  // Get storeId from the first product (all belong to the same store)
  const selectedStoreId = allProducts[0]?.storeId;

  // Filter: only approved products from the owner's store
  const products = allProducts.filter(
    (p) => p.storeId === selectedStoreId && p.status === "approved"
  );

  const conversations = (conversationsData?.data as Conversation[]) || [];

  // Handlers
  const handleChange = <K extends keyof OfferForm>(
    key: K,
    value: OfferForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!selectedProduct) errs.product = "Please select a product";
    if (!selectedCustomer) errs.customer = "Please select a customer";
    if (!form.discountValue || isNaN(Number(form.discountValue)) || Number(form.discountValue) <= 0)
      errs.discountValue = "Enter a valid discount value";
    if (!form.startDate) errs.startDate = "Start date is required";
    if (!form.expireDate) errs.expireDate = "Expiry date is required";
    if (
      form.startDate &&
      form.expireDate &&
      form.expireDate <= form.startDate
    )
      errs.expireDate = "Expiry must be after start date";
    return errs;
  };

  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (!selectedProduct || !selectedCustomer || !form.startDate || !form.expireDate) {
      return;
    }

    // Validate that dates are valid
    if (isNaN(form.startDate.getTime()) || isNaN(form.expireDate.getTime())) {
      setErrors({ submit: "Invalid date format" });
      return;
    }

    const payload: CreateOfferPayload = {
      storeId: selectedProduct.storeId,
      productId: selectedProduct.id,
      targetCustomerId: selectedCustomer.id,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minimumOrderAmount: form.minimumOrderAmount
        ? Number(form.minimumOrderAmount)
        : undefined,
      maximumDiscountAmount: form.maximumDiscountAmount
        ? Number(form.maximumDiscountAmount)
        : undefined,
      startDate: form.startDate.toISOString(),
      expireDate: form.expireDate.toISOString(),
    };

    try {
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        // Use RTK Query mutation
        const result = await createSpecialOffer(payload).unwrap();
        console.log("Offer created successfully:", result);
      }
      
      setSuccess(true);
      
      // Close modal after success
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        resetForm();
      }, 1500);
    } catch (err: any) {
      console.error("Error creating offer:", err);
      setErrors({ 
        submit: err?.data?.message || err?.message || "Something went wrong" 
      });
    }
  };

  const resetForm = () => {
    setForm({
      discountType: "PERCENTAGE",
      discountValue: "",
      minimumOrderAmount: "",
      maximumDiscountAmount: "",
      startDate: undefined,
      expireDate: undefined,
    });
    setSelectedProduct(null);
    setSelectedCustomer(null);
    setErrors({});
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  // Render
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Create an offer
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            Create an Offer
            {success && (
              <Badge variant="default" className="ml-2 bg-green-500">
                ✓ Sent!
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Send a personalised discount offer to a customer
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Product Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Product <span className="text-destructive">*</span>
            </Label>

            {productsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : products.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No approved products found
              </p>
            ) : (
              <ScrollArea className="h-[200px] rounded-md border p-2">
                <RadioGroup
                  value={selectedProduct?.id}
                  onValueChange={(value) => {
                    const product = products.find((p) => p.id === value);
                    setSelectedProduct(product || null);
                    if (errors.product) {
                      setErrors((prev) => ({ ...prev, product: undefined }));
                    }
                  }}
                >
                  <div className="space-y-2">
                    {products.map((product) => {
                      const thumbnail =
                        product.images?.[0] || product.variants?.[0]?.image;

                      return (
                        <div key={product.id}>
                          <RadioGroupItem
                            value={product.id}
                            id={product.id}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={product.id}
                            className={cn(
                              "flex items-center gap-3 rounded-lg border p-3 cursor-pointer",
                              "hover:bg-accent hover:text-accent-foreground",
                              "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                            )}
                          >
                            <div className="flex items-center">
                              <div
                                className={cn(
                                  "flex h-4 w-4 items-center justify-center rounded-full border",
                                  selectedProduct?.id === product.id
                                    ? "border-primary bg-primary"
                                    : "border-muted-foreground"
                                )}
                              >
                                {selectedProduct?.id === product.id && (
                                  <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                                )}
                              </div>
                            </div>

                            {thumbnail ? (
                              <Image
                                src={thumbnail}
                                alt={product.name}
                                className="h-10 w-10 rounded-md object-cover"
                                width={40}
                                height={40}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                <span className="text-lg">🛍️</span>
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {product.name}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="font-semibold text-foreground">
                                  ৳{product.finalPrice}
                                </span>
                                {product.discount > 0 && (
                                  <>
                                    <span className="line-through">
                                      ৳{product.price}
                                    </span>
                                    <Badge variant="outline" className="text-xs">
                                      -{product.discount}%
                                    </Badge>
                                  </>
                                )}
                                <span>· {product.category?.name}</span>
                              </div>
                            </div>
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </ScrollArea>
            )}
            {errors.product && (
              <p className="text-sm text-destructive">{errors.product}</p>
            )}
          </div>

          {/* Customer Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Target Customer <span className="text-destructive">*</span>
            </Label>

            {convsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : conversations.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No conversations found
              </p>
            ) : (
              <ScrollArea className="h-[200px] rounded-md border p-2">
                <RadioGroup
                  value={selectedCustomer?.id}
                  onValueChange={(value) => {
                    const customer = conversations.find((c) => c.id === value);
                    setSelectedCustomer(customer || null);
                    if (errors.customer) {
                      setErrors((prev) => ({ ...prev, customer: undefined }));
                    }
                  }}
                >
                  <div className="space-y-2">
                    {conversations.map((customer) => (
                      <div key={customer.id}>
                        <RadioGroupItem
                          value={customer.id}
                          id={customer.id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={customer.id}
                          className={cn(
                            "flex items-center gap-3 rounded-lg border p-3 cursor-pointer",
                            "hover:bg-accent hover:text-accent-foreground",
                            "peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                          )}
                        >
                          <div className="flex items-center">
                            <div
                              className={cn(
                                "flex h-4 w-4 items-center justify-center rounded-full border",
                                selectedCustomer?.id === customer.id
                                  ? "border-primary bg-primary"
                                  : "border-muted-foreground"
                              )}
                            >
                              {selectedCustomer?.id === customer.id && (
                                <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                              )}
                            </div>
                          </div>

                          <Avatar className="h-8 w-8">
                            <AvatarImage src={customer.profilePic} />
                            <AvatarFallback>
                              {customer.firstName?.[0]}
                              {customer.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {customer.firstName} {customer.lastName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {customer.email}
                            </p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </ScrollArea>
            )}
            {errors.customer && (
              <p className="text-sm text-destructive">{errors.customer}</p>
            )}
          </div>

          {/* Discount Type and Value */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountType">
                Discount Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.discountType}
                onValueChange={(value: "PERCENTAGE" | "FIXED") =>
                  handleChange("discountType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                  <SelectItem value="FIXED">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountValue">
                Discount Value <span className="text-destructive">*</span>
              </Label>
              <Input
                id="discountValue"
                type="number"
                placeholder={form.discountType === "PERCENTAGE" ? "e.g. 20" : "e.g. 50"}
                value={form.discountValue}
                onChange={(e) => handleChange("discountValue", e.target.value)}
                min="0"
                step={form.discountType === "PERCENTAGE" ? "1" : "0.01"}
              />
              {errors.discountValue && (
                <p className="text-sm text-destructive">{errors.discountValue}</p>
              )}
            </div>
          </div>

          {/* Min Order and Max Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minimumOrderAmount">Min. Order Amount</Label>
              <Input
                id="minimumOrderAmount"
                type="number"
                placeholder="e.g. 100"
                value={form.minimumOrderAmount}
                onChange={(e) => handleChange("minimumOrderAmount", e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maximumDiscountAmount">Max. Discount Amount</Label>
              <Input
                id="maximumDiscountAmount"
                type="number"
                placeholder="e.g. 50"
                value={form.maximumDiscountAmount}
                onChange={(e) => handleChange("maximumDiscountAmount", e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                Start Date <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.startDate ? (
                      format(form.startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.startDate}
                    onSelect={(date) => handleChange("startDate", date)}
                    initialFocus
                    disabled={(date) => date < startOfDay(new Date())}
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expireDate">
                Expiry Date <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !form.expireDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.expireDate ? (
                      format(form.expireDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={form.expireDate}
                    onSelect={(date) => handleChange("expireDate", date)}
                    initialFocus
                    disabled={(date) =>
                      form.startDate
                        ? date < startOfDay(form.startDate)
                        : date < startOfDay(new Date())
                    }
                  />
                </PopoverContent>
              </Popover>
              {errors.expireDate && (
                <p className="text-sm text-destructive">{errors.expireDate}</p>
              )}
            </div>
          </div>

          {/* Submit error */}
          {errors.submit && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {errors.submit}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Send Offer
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}