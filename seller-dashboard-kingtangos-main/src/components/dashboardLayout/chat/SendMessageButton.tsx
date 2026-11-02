/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
 
import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { FaFacebookMessenger } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useCreateSendMessageMutation } from "@/redux/api/messageApi/messageApi";

 
interface SendMessageButtonProps {
  receiverId: string;
  userType: string; // e.g. "seller", "buyer"
  className?: string;
  nextUrl?: string; // optional: redirect after send
}
 
export default function SendMessageButton({
  receiverId,
  userType,
  className = "",
  nextUrl = "",
}: SendMessageButtonProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className={`flex items-center px-4 py-2 text-white hover:text-blue-600 border cursor-pointer border-blue-600 bg-blue-600 rounded-lg gap-2 hover:bg-transparent transition-colors ${className}`}
      >
        <FaFacebookMessenger className="w-4 h-4 hover:text-blue-600" />
        Send message to {userType}
      </button>
 
      {/* Message Input Modal */}
      {isModalOpen && (
        <SendMessageModal
          receiverId={receiverId}
          userType={userType}
          nextUrl={nextUrl}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
 
// ───────────────────────────────────────────────────────────────
// Internal Modal Component (handles message input & API call)
// ───────────────────────────────────────────────────────────────
function SendMessageModal({
  receiverId,
  userType,
  nextUrl,
  onClose,
}: {
  receiverId: string;
  userType: string;
  nextUrl: string;
  onClose: () => void;
}) {
  const [message, setMessage] = useState("");
  const [sendMessage, { isLoading }] = useCreateSendMessageMutation();
  const router = useRouter();
 
  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
 
    try {
      await sendMessage({
        receiverId,
        messages: message.trim(),
      }).unwrap();
 
      toast.success(`Message sent to ${userType} successfully!`);
      setMessage("");
      onClose();
 
      // Redirect if nextUrl is provided
      if (nextUrl) {
        router.push(nextUrl);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send message");
    }
  };
 
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-bold">Send Message to {userType}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
 
        {/* Message Input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-6"
        />
 
        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isLoading || !message.trim()}
            className={`px-6 py-2.5 text-white rounded-lg transition-colors ${
              isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } disabled:opacity-50`}
          >
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
}