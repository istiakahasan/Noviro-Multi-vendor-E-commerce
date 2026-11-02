// "use client";
// import { useGetAllMessageAdminQuery } from "@/redux/features/chat/chatApi";

    

// const page = () => {
//  const { data, isLoading, isError } = useGetAllMessageAdminQuery({}, {});
//     console.log(data);
//     return (
//         <div>
//             here will be all chating 

//         </div>
//     );
// };

// export default page;





















"use client";

import { useState } from "react";
import { useGetAllMessageAdminQuery } from "@/redux/features/chat/chatApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import PageLoader from "@/app/loading";


const ChatMonitoring = () => {
  const { data, isLoading } = useGetAllMessageAdminQuery();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const router = useRouter();

  const conversations = data?.data ?? [];

  const handleClick = (convId: string) => {
    setSelectedId(convId);
    router.push(`/admin-dashboard/monitor-chat/${convId}`);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Chat Monitoring</h1>
        <p className="text-gray-600 text-sm">
          Monitor user conversations across the platform
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <PageLoader/>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {conversations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No conversations found
            </div>
          ) : (
            <ul className="divide-y">
              {conversations.map((conv: any) => {
                const userA = conv?.users?.[0];
                const userB = conv?.users?.[1];
                const isSelected = conv.conversationId === selectedId;

                return (
                  <li
                    key={conv.conversationId}
                    onClick={() => handleClick(conv.conversationId)}
                    className={`cursor-pointer transition
                      ${isSelected ? "bg-blue-50" : "hover:bg-gray-50"}
                    `}
                  >
                    <div className="flex flex-col sm:flex-row gap-4 p-4">
                      {/* Left User */}
                      <div className="flex items-center gap-3 sm:w-1/3">
                        <Avatar src={userA?.avatar} />
                        <UserInfo user={userA} />
                      </div>

                      {/* Last Message */}
                      <div className="sm:w-1/3 text-sm text-gray-500">
                        <p className="text-xs uppercase tracking-wide mb-1">
                          Last message
                        </p>
                        <p className="line-clamp-2">
                          {conv?.lastMessage?.messages || "—"}
                        </p>
                      </div>

                      {/* Right User */}
                      <div className="flex items-center gap-3 sm:w-1/3 justify-end">
                        <UserInfo user={userB} alignRight />
                        <Avatar src={userB?.profilePic} />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMonitoring;

/* ---------------- Sub Components ---------------- */

const Avatar = ({ src }: { src?: string }) => (
  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
    <Image
      src={
        src || "/user.jpeg"}
      alt="User avatar"
      width={48}
      height={48}
      className="w-full h-full object-cover"
    />
  </div>
);

const UserInfo = ({
  user,
  alignRight = false,
}: {
  user?: any;
  alignRight?: boolean;
}) => (
  <div className={`${alignRight ? "text-right" : ""}`}>
    <p className="font-medium text-gray-900 text-sm">
      {user?.firstName} {user?.lastName || ""}
    </p>
    <p className="text-xs text-gray-400">
      {user?.role?.toLowerCase()}
    </p>
    <p className="text-xs text-gray-400 truncate max-w-[160px]">
      {user?.email}
    </p>
  </div>
);
