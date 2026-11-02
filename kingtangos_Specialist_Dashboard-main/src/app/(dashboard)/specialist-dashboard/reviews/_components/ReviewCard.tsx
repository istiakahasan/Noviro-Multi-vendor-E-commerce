"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { useCreateReplyMutation } from "@/lib/api/reviewsAndRatings/reviewsApi";
import { toast } from "sonner";

interface ReviewReply {
  id: string;
  comment: string;
  createdAt: string;
}

interface ReviewCardProps {
  id: string;
  user: {
    firstName: string;
    lastName: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  reviewReply: ReviewReply[];
}

export default function ReviewCard(props: ReviewCardProps) {
  const [editingReply, setEditingReply] = useState(false);
  const [replyText, setReplyText] = useState("");

  const [createReply, { isLoading: isReplying }] = useCreateReplyMutation();

  const replies = props.reviewReply || [];
  const hasReplies = replies.length > 0;

  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    try {
      await createReply({
        reviewId: props.id,
        comment: replyText,
      }).unwrap();

      toast.success("Reply sent successfully!");
      setReplyText("");
      setEditingReply(false);
    } catch (error) {
      toast.error("Failed to send reply.");
      console.error(error);
    }
  };

  const initials =
    `${props.user.firstName[0] || ""}${props.user.lastName[0] || ""}`.toUpperCase();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
      <div className="flex gap-5">
        <div className="shrink-0">
          <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {initials || "??"}
          </div>
        </div>

        <div className="flex-1 space-y-5">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-gray-900">
                {props.user.firstName} {props.user.lastName}
              </h4>
              <p className="text-sm text-gray-500">
                {new Date(props.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < props.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed">{props.comment}</p>

          {hasReplies && (
            <div className="space-y-3 border-l-4 border-indigo-500 pl-4">
              <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                Your Replies ({replies.length})
              </p>
              {[...replies]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .map((reply) => (
                  <div
                    key={reply.id}
                    className="bg-indigo-50 rounded-lg p-4 border border-indigo-100"
                  >
                    <p className="text-sm font-medium text-indigo-900 mb-1">
                      You replied
                    </p>
                    <p className="text-sm text-indigo-800 whitespace-pre-wrap">
                      {reply.comment}
                    </p>
                    <p className="text-xs text-indigo-600 mt-2">
                      {new Date(reply.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))}
            </div>
          )}

          {editingReply ? (
            <div className="space-y-3 border-t pt-4">
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none text-sm"
                rows={3}
                placeholder="Write your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                disabled={isReplying}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSendReply}
                  disabled={isReplying || !replyText.trim()}
                  className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition text-sm"
                >
                  {isReplying ? "Sending..." : "Send Reply"}
                </button>
                <button
                  onClick={() => {
                    setEditingReply(false);
                    setReplyText("");
                  }}
                  className="px-5 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setEditingReply(true)}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition"
            >
              {hasReplies ? "Reply again" : "Reply to review"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
