"use client";

import {
  useGetNotificationsQuery,
  useReadNotificationMutation,
  useGetSingleNotificationQuery,
} from "@/redux/api/notificationApi";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";

dayjs.extend(relativeTime);

interface NotificationDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationDrawer({
  open,
  onOpenChange,
}: NotificationDrawerProps) {
  const { data: notificationsData, isLoading } = useGetNotificationsQuery();
  const [readNotification] = useReadNotificationMutation();
  const [selectedNotificationId, setSelectedNotificationId] = useState<
    string | null
  >(null);

  const notifications = notificationsData?.data || [];

  const handleNotificationClick = async (id: string) => {
    setSelectedNotificationId(id);
    await readNotification(id);
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      // Reset state when closing
      setTimeout(() => setSelectedNotificationId(null), 300);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="p-4 border-b flex flex-row items-center gap-2 space-y-0">
          <SheetTitle className="text-xl">Notifications</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {notifications.length > 0 ? (
              notifications.map((notification: any) => (
                <div
                  key={notification.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${!notification.isRead ? "bg-blue-50/40" : ""}`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h4
                      className={`text-sm ${!notification.isRead ? "font-bold text-gray-900" : "font-medium text-gray-700"}`}
                    >
                      {notification.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                      {dayjs(notification.createdAt).fromNow()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {notification.message}
                  </p>
                  {!notification.isRead && (
                    <div className="mt-2 w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </div>
              ))
            ) : (
              <div className="p-10 text-center text-gray-400 text-sm">
                {isLoading
                  ? "Loading notifications..."
                  : "No notifications found"}
              </div>
            )}
          </div>
        </div>
      </SheetContent>

      <Dialog
        open={!!selectedNotificationId}
        onOpenChange={(open) => !open && setSelectedNotificationId(null)}
      >
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-none shadow-2xl">
          {selectedNotificationId && (
            <NotificationDetails id={selectedNotificationId} />
          )}
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}

function NotificationDetails({ id }: { id: string }) {
  const { data: detailsData, isLoading } = useGetSingleNotificationQuery(id);
  const notification = detailsData?.data;

  if (isLoading) {
    return (
      <div className="p-10 text-center text-gray-400 text-sm">
        Loading details...
      </div>
    );
  }

  if (!notification) {
    return (
      <div className="p-10 text-center text-gray-400 text-sm">
        Notification not found
      </div>
    );
  }

  return (
    <div className="p-6">
      <DialogHeader className="mb-6 text-left">
        <DialogTitle className="text-xl font-bold text-gray-900 mb-1">
          {notification.title}
        </DialogTitle>
        <DialogDescription className="text-xs text-gray-400">
          {dayjs(notification.createdAt).format("MMMM D, YYYY at h:mm A")}
        </DialogDescription>
      </DialogHeader>

      <div className="bg-gray-50/50 border border-gray-100 p-5 rounded-xl">
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
          {notification.message}
        </p>
      </div>
    </div>
  );
}
