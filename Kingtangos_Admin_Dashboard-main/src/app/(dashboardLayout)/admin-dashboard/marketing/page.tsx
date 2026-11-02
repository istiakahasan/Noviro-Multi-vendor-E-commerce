"use client";

import { useUserRole } from "@/hooks/useUserRole";
import { useSendEmailMutation } from "@/redux/features/marketing/marketingApi";
import { Send } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

type TargetType = "ALL" | "CUSTOMER" | "SELLER" | "SPECIALIST";

const Page = () => {
  const [sendEmail, { isLoading }] = useSendEmailMutation();
  const {role, isRoleLoading} = useUserRole();
  console.log(role, isRoleLoading);

  const [formData, setFormData] = useState<{
    subject: string;
    body: string;
    message: string;
    selectedUser: TargetType;
  }>({
    subject: "",
    body: "",
    message: "",
    selectedUser: "ALL",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await sendEmail({
        subject: formData.subject,
        message: formData.message || formData.body,
        target: formData.selectedUser,
      }).unwrap();

      toast.success("Promotion email sent successfully!");

      setFormData({
        subject: "",
        body: "",
        message: "",
        selectedUser: "ALL",
      });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send email");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Marketing & Announcements
          </h1>
          <p className="text-gray-600">
            Send notifications and announcements to users
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center gap-2 mb-8">
            <Send className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">
              Send New Notification
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Enter notification title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body
              </label>
              <input
                type="text"
                name="body"
                value={formData.body}
                onChange={handleChange}
                placeholder="Short summary..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* Select User */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select User
              </label>
              <select
                name="selectedUser"
                value={formData.selectedUser}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
              {
                role === "STAFF" ?(
                    <option value="CUSTOMER">Customer</option>

                ):(<>
                    <option value="ALL">All Users</option>
                <option value="CUSTOMER">Customers</option>
                <option value="SELLER">Sellers</option>
                <option value="SPECIALIST">Specialists</option>
 </>
                )
              }
              </select>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                required
                placeholder="Enter your message here..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-800 hover:bg-gray-900 disabled:opacity-60 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {isLoading ? "Sending..." : "Send Notification"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
