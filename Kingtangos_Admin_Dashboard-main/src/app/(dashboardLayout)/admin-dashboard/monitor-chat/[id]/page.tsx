// "use client";

// import { useGetAdminSingleConversationQuery } from "@/redux/features/chat/chatApi";
// import { useParams } from "next/navigation";

// const page = () => {
//   const { id } = useParams();
//   const { data, isError, isLoading } = useGetAdminSingleConversationQuery(id);
//   console.log(data);
//   return <div>hello {id}</div>;
// };

// export default page;

"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useGetAdminSingleConversationQuery } from "@/redux/features/chat/chatApi";
import { AlertCircle, ArrowLeft, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import PageLoader from "@/app/loading";

const DEFAULT_AVATAR = "/user.jpeg";

const AdminConversationDetail = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useGetAdminSingleConversationQuery(id, {
    skip: !id,
  });

  const conv = data?.data;

  if (isLoading) {
    return <PageLoader />;
  }

  if (isError || !conv) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
        <div className="text-center max-w-md w-full">
          <AlertCircle className="h-12 sm:h-16 w-12 sm:w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
            Failed to load chat
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            {(error as any)?.data?.message || "Something went wrong."}
          </p>
          <Link
            href="/admin-dashboard/monitor-chat"
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            <ArrowLeft className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Back to Monitoring
          </Link>
        </div>
      </div>
    );
  }

  // Find admin (SUPER_ADMIN) and the other participant
  const admin = conv.participants.find((p: any) => p.role === "SUPER_ADMIN");
  const otherUser =
    conv.participants.find((p: any) => p.role !== "SUPER_ADMIN") ||
    conv.participants[0];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Top Bar - Avatars + Names */}
      <div className="bg-white/80 border-b sticky top-0 z-10">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left Section - Back + Avatars + Names */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Link
                href="/admin-dashboard/monitor-chat"
                className="text-gray-600 hover:text-gray-900 flex-shrink-0"
              >
                <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
              </Link>

              {/* Avatars */}
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                {/* First Participant Avatar */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                  <Image
                    src={conv?.participants[0]?.profilePic || DEFAULT_AVATAR}
                    alt={`${conv?.participants[0]?.firstName}`}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>

                {/* Second Participant Avatar */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-white shadow-sm -ml-2 sm:-ml-3 flex-shrink-0">
                  <Image
                    src={conv?.participants[1]?.profilePic || DEFAULT_AVATAR}
                    alt={`${conv?.participants[1]?.firstName}`}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Names and Info */}
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate">
                  <span className="hidden sm:inline">
                    {conv?.participants[0]?.firstName} {conv?.participants[0]?.lastName} ↔{" "}
                    {conv?.participants[1]?.firstName} {conv?.participants[1]?.lastName}
                  </span>
                  <span className="sm:hidden">
                    {conv?.participants[0]?.firstName?.charAt(0)}.{" "}
                    {conv?.participants[1]?.firstName?.charAt(0)}.
                  </span>
                </h1>
                <p className="text-xs text-gray-500 truncate">
                  {conv?.participants[0]?.role}
                </p>
              </div>
            </div>

            {/* Right Section - Conversation ID */}
            <div className="text-xs sm:text-sm text-gray-500 text-right flex-shrink-0 hidden sm:block">
              <p className="font-mono text-xs">{conv.id.substring(0, 8)}...</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
          {conv.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 py-12">
              <MessageCircle className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mb-4" />
              <p className="text-base sm:text-lg">No messages yet in this conversation.</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {conv.messages.map((msg: any) => {
                const isSentByAdmin = msg.sender.id === admin?.id;
                const sender = isSentByAdmin ? admin : otherUser;
                const bubbleClass = isSentByAdmin
                  ? "bg-purple-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none";

                return (
                  <div
                  key={msg.id}
                  className={`flex ${isSentByAdmin ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${bubbleClass}`}>
                    {/* Sender name + time */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium opacity-90">
                        {sender?.firstName} {sender?.lastName}
                      </span>
                      <span className="text-xs opacity-70">
                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                      </span>
                    </div>

                    {/* Message content */}
                    <p className="text-sm leading-relaxed">{msg.content}</p>

                    {/* Deleted note */}
                    {msg.isDeleted && (
                      <p className="text-xs italic mt-1 opacity-70">(Deleted)</p>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminConversationDetail;