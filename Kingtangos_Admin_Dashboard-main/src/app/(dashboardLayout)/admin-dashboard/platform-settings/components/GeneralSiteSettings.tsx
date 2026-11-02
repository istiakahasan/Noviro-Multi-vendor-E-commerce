// "use client";

// import React, { useState } from "react";
// import { CloudUpload } from "lucide-react";
// import { GeneralSettings } from "@/types/global";
// import Image from "next/image";
// import EditorClient from "@/app/test/components/client_sidde_custom_editor";

// interface ExtendedSettings extends GeneralSettings {
//   logo: Blob | string | File | null;
//   logoPreview: string | null;
// }

// const GeneralSiteSettings: React.FC = () => {
//   const [settings, setSettings] = useState<ExtendedSettings>({
//     platformName: "",
//     logo: null,
//     logoPreview: null,
//     supportEmail: "",
//     supportPhone: "",
//     termsOfServiceUrl: "",
//     privacyPolicyUrl: "",
//     refundPolicyUrl: "",
//   });

//   // 📝 Editor states
//   const [termsContent, setTermsContent] = useState("");
//   const [privacyContent, setPrivacyContent] = useState("");
//   const [refundContent, setRefundContent] = useState("");

//   const handleInputChange = (
//     field: keyof Omit<ExtendedSettings, "logo" | "logoPreview">,
//     value: string,
//   ) => {
//     setSettings((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (file) {
//       const previewUrl = URL.createObjectURL(file);
//       setSettings((prev) => ({
//         ...prev,
//         logo: file,
//         logoPreview: previewUrl,
//       }));
//     } else {
//       setSettings((prev) => ({
//         ...prev,
//         logo: null,
//         logoPreview: null,
//       }));
//     }
//   };

//   const handleSave = (e: React.FormEvent) => {
//     e.preventDefault();

//     const payload = {
//       ...settings,
//       termsOfServiceContent: termsContent,
//       privacyPolicyContent: privacyContent,
//       refundPolicyContent: refundContent,
//     };

//     console.log("Form Data:", payload);
//   };

//   const handleCancel = () => {
//     setSettings({
//       platformName: "",
//       logo: null,
//       logoPreview: null,
//       supportEmail: "",
//       supportPhone: "",
//       termsOfServiceUrl: "",
//       privacyPolicyUrl: "",
//       refundPolicyUrl: "",
//     } as ExtendedSettings);

//     setTermsContent("");
//     setPrivacyContent("");
//     setRefundContent("");

//     console.log("Form cancelled and reset");
//   };

//   return (
//     <form onSubmit={handleSave} className="space-y-6">
//       {/* Platform Name */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Platform Name
//         </label>
//         <input
//           type="text"
//           value={settings.platformName}
//           onChange={(e) => handleInputChange("platformName", e.target.value)}
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//           placeholder="Enter platform name"
//         />
//       </div>

//       {/* Upload Logo */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Upload Logo
//         </label>
//         <label className="block w-full cursor-pointer">
//           <div
//             className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
//               settings.logoPreview
//                 ? "border-blue-300 bg-blue-50"
//                 : "border-gray-300 bg-gray-50"
//             } hover:border-gray-400`}
//           >
//             {settings.logoPreview ? (
//               <div className="flex flex-col items-center justify-center">
//                 <Image
//                   width={200}
//                   height={200}
//                   src={settings.logoPreview}
//                   alt="Logo Preview"
//                   className="max-w-full max-h-32 object-contain mb-3 rounded"
//                 />
//                 <p className="text-green-600 text-sm">
//                   Logo selected:{" "}
//                   {settings.logo instanceof File ? settings.logo.name : ""}
//                 </p>
//                 <p className="text-gray-400 text-xs">Click to change</p>
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center">
//                 <div className="bg-gray-400 rounded-full p-2 mb-3">
//                   <CloudUpload className="w-6 h-6 text-white" />
//                 </div>
//                 <p className="text-gray-600 text-sm mb-1">
//                   Upload your store logo
//                 </p>
//                 <p className="text-gray-400 text-xs">Image Size: Max 2 MB</p>
//               </div>
//             )}
//           </div>
//           <input
//             type="file"
//             className="hidden"
//             accept="image/*"
//             onChange={handleFileChange}
//           />
//         </label>
//       </div>

//       {/* Support Email & Phone */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Support Email
//           </label>
//           <input
//             type="email"
//             value={settings.supportEmail}
//             onChange={(e) => handleInputChange("supportEmail", e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Support Phone
//           </label>
//           <input
//             type="tel"
//             value={settings.supportPhone}
//             onChange={(e) => handleInputChange("supportPhone", e.target.value)}
//             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       {/* Policy Pages – Editors */}
//       <div>
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">
//           Policy Pages
//         </h3>

//         <div className="flex flex-col gap-10">
//           <div>
//             <p className="py-4 text-lg"> Terms of Service</p>
//             <EditorClient
//               title="Terms of Service"
//               onDataChange={setTermsContent}
//             />
//           </div>
//           <div>
//             <p className="py-4 text-lg"> Privacy Policy</p>
//             <EditorClient
//               title="Privacy Policy"
//               onDataChange={setPrivacyContent}
//             />
//           </div>
//           <div>
//             <p className="py-4 text-lg"> Refund Policy</p>
//             <EditorClient
//               title="Refund Policy"
//               onDataChange={setRefundContent}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-start pt-6 border-t border-gray-200 space-x-3">
//         <button
//           type="submit"
//           className="bg-[#333333] text-white px-6 py-2 rounded-md hover:bg-gray-800"
//         >
//           Save Changes
//         </button>
//         <button
//           type="button"
//           onClick={handleCancel}
//           className="bg-gray-50 text-gray-700 border border-gray-600 px-6 py-2 rounded-md hover:bg-white"
//         >
//           Cancel
//         </button>
//       </div>
//     </form>
//   );
// };

// export default GeneralSiteSettings;

"use client";

import EditorClient from "@/app/test/components/client_sidde_custom_editor";
import { useCreatePlatformSettingsMutation } from "@/redux/features/setting/settingsApi";
import { GeneralSettings } from "@/types/global";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { optional, z } from "zod";
// ───────────────────────────────────────────────────────────────
// Zod Schema (for validation)
// ───────────────────────────────────────────────────────────────
const platformSettingsSchema = z.object({
  platformName: z.string().min(1, "Platform name is required"),
  supportEmail: z.string().email("Invalid email address"),
  supportPhone: z.string().optional(),
  termsOfService: z.string().min(10, "Terms content is required"),
  privacyPolicy: z.string().min(10, "Privacy policy is required"),
  refundPolicy: z.string().min(10, "Refund policy is required"),
  logo: z.any().optional(), // file is optional
});

type PlatformSettingsForm = z.infer<typeof platformSettingsSchema>;

// ───────────────────────────────────────────────────────────────
// Extended type for preview
// ───────────────────────────────────────────────────────────────
interface ExtendedSettings extends GeneralSettings {
  logoPreview: string | null;
}

const GeneralSiteSettings: React.FC = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PlatformSettingsForm>({
    resolver: zodResolver(platformSettingsSchema),
    defaultValues: {
      platformName: "",
      supportEmail: "",
      supportPhone: "",
      termsOfService: "",
      privacyPolicy: "",
      refundPolicy: "",
    },
  });

  const [createSettings, { isLoading }] = useCreatePlatformSettingsMutation();

  // File change handler (preview + set value)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
      setValue("logo", file, { shouldValidate: true });
    } else {
      setLogoPreview(null);
      setValue("logo", null);
    }
  };

  // Form submit handler
  const onSubmit = async (formData: PlatformSettingsForm) => {
    try {
      const payload = {
        platformName: formData.platformName,
        supportEmail: formData.supportEmail,
        supportPhone: formData.supportPhone || "",
        termsOfService: formData.termsOfService,
        privacyPolicy: formData.privacyPolicy,
        refundPolicy: formData.refundPolicy,
        file: formData.logo instanceof File ? formData.logo : undefined,
      };

      await createSettings(payload).unwrap();

      toast.success("Platform settings saved successfully!");
      reset(); // reset form
      setLogoPreview(null); // clear preview
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save settings");
    }
  };

  // Cancel / Reset
  const handleCancel = () => {
    reset();
    setLogoPreview(null);
    toast.info("Form reset");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Platform Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Platform Name
        </label>
        <input
          type="text"
          {...register("platformName")}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter platform name"
        />
        {errors.platformName && (
          <p className="text-red-600 text-sm mt-1">
            {errors.platformName.message}
          </p>
        )}
      </div>

      {/* Upload Logo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Logo
        </label>
        <label className="block w-full cursor-pointer">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              logoPreview
                ? "border-blue-300 bg-blue-50"
                : "border-gray-300 bg-gray-50"
            } hover:border-gray-400`}
          >
            {logoPreview ? (
              <div className="flex flex-col items-center justify-center">
                <Image
                  width={200}
                  height={200}
                  src={logoPreview}
                  alt="Logo Preview"
                  className="max-w-full max-h-32 object-contain mb-3 rounded"
                />
                <p className="text-green-600 text-sm">Logo selected</p>
                <p className="text-gray-400 text-xs">Click to change</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <div className="bg-gray-400 rounded-full p-2 mb-3">
                  <CloudUpload className="w-6 h-6 text-white" />
                </div>
                <p className="text-gray-600 text-sm mb-1">
                  Upload your store logo
                </p>
                <p className="text-gray-400 text-xs">Image Size: Max 2 MB</p>
              </div>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        {errors?.logo?.message && (
          <p className="text-red-600 text-sm mt-1">
            {typeof errors.logo === "string"
              ? errors.logo
              : "An error occurred"}
          </p>
        )}
      </div>

      {/* Support Email & Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Support Email
          </label>
          <input
            type="email"
            {...register("supportEmail")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.supportEmail && (
            <p className="text-red-600 text-sm mt-1">
              {errors.supportEmail.message}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Support Phone (optional)
          </label>
          <input
            type="tel"
            {...register("supportPhone")}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            
          />
          {errors.supportPhone && (
            <p className="text-red-600 text-sm mt-1">
              {errors.supportPhone.message}
            </p>
          )}
        </div>
      </div>

      {/* Policy Pages – Editors */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Policy Pages
        </h3>
        <div className="flex flex-col gap-10">
          <div>
            <p className="py-4 text-lg">Terms of Service</p>
            <EditorClient
              title="Terms of Service"
              onDataChange={(val) => setValue("termsOfService", val)}
            />
            {errors.termsOfService && (
              <p className="text-red-600 text-sm mt-1">
                {errors.termsOfService.message}
              </p>
            )}
          </div>
          <div>
            <p className="py-4 text-lg">Privacy Policy</p>
            <EditorClient
              title="Privacy Policy"
              onDataChange={(val) => setValue("privacyPolicy", val)}
            />
            {errors.privacyPolicy && (
              <p className="text-red-600 text-sm mt-1">
                {errors.privacyPolicy.message}
              </p>
            )}
          </div>
          <div>
            <p className="py-4 text-lg">Refund Policy</p>
            <EditorClient
              title="Refund Policy"
              onDataChange={(val) => setValue("refundPolicy", val)}
            />
            {errors.refundPolicy && (
              <p className="text-red-600 text-sm mt-1">
                {errors.refundPolicy.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-start pt-6 border-t border-gray-200 space-x-3">
        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="bg-[#333333] text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {isLoading || isSubmitting ? "Saving..." : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => {
            reset();
            setLogoPreview(null);
          }}
          className="bg-gray-50 text-gray-700 border border-gray-600 px-6 py-2 rounded-md hover:bg-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default GeneralSiteSettings;
