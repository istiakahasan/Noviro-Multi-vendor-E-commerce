"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from "lucide-react";
import Image from "next/image";

type FormValues = {
  shopId: string;
  shopName: string;
  phone: string;
  email: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  tags: string;
  description: string;
  features: string[];
  terms: boolean;
  logo: FileList;
  cover: FileList;
};

export default function EditAccountForm() {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      console.log("Form Data:", data);

      await new Promise((r) => setTimeout(r, 1000));

      toast.success("Form submitted successfully!");
      reset();
      setLogoPreview(null);
      setCoverPreview(null);
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Edit Your Account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="border rounded-md p-4">
          <h3 className="font-semibold mb-3">Shop Information</h3>

          {/* Upload Logo */}
          <div className="mb-4">
            <Label className="block mb-2">Upload Logo</Label>
            <div className="border-2 border-dashed border-blue-300 bg-blue-50 p-6 rounded-lg text-center relative">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Logo Preview"
                  width={150}
                  height={150}
                  className="mx-auto rounded-md object-cover"
                />
              ) : (
                <div>
                  <Upload className="mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-gray-500">Upload your store logo</p>
                  <p className="text-xs text-gray-400">Image size max 2MB</p>
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                {...register("logo")}
                onChange={handleLogoChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Upload Cover Photo */}
          <div className="mb-4">
            <Label className="block mb-2">Upload Cover Photo</Label>
            <div className="border-2 border-dashed border-blue-300 bg-blue-50 p-6 rounded-lg text-center relative">
              {coverPreview ? (
                <Image
                  src={coverPreview}
                  alt="Cover Preview"
                  width={300}
                  height={150}
                  className="mx-auto rounded-md object-cover"
                />
              ) : (
                <div>
                  <Upload className="mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-gray-500">Upload your store cover photo</p>
                  <p className="text-xs text-gray-400">Image size max 2MB</p>
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                {...register("cover")}
                onChange={handleCoverChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Text Fields */}
          <div className="grid grid-cols-1 gap-3">
            <Input placeholder="Shop ID" {...register("shopId")} />
            <Input placeholder="Shop Name" {...register("shopName")} />
            <Input placeholder="Phone" {...register("phone")} />
            <Input placeholder="Email" {...register("email")} />
            <Input placeholder="Address" {...register("address")} />
            <Input placeholder="Facebook URL" {...register("facebookUrl")} />
            <Input placeholder="Instagram URL" {...register("instagramUrl")} />
            <Input placeholder="YouTube URL" {...register("youtubeUrl")} />
            <Input placeholder="Tags" {...register("tags")} />
            <Textarea placeholder="Description" {...register("description")} />
          </div>
        </div>

        {/* Features */}
        <div className="border rounded-md p-4">
          <h3 className="font-semibold mb-3">Select Feature&apos;s</h3>
          <div className="space-y-2">
            {["Sell Product", "Provide Service", "Provide Consultation", "Sell Subscription"].map(
              (feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox value={feature} {...register("features")} />
                  <Label>{feature}</Label>
                </div>
              )
            )}
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-center space-x-2">
          <Checkbox {...register("terms")} />
          <Label className="text-sm">
            I agree with the{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms & Conditions
            </a>
          </Label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => reset()}>
            Back
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
