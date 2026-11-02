"use client";

import {
  useGetNotificationsQuery,
  useReadNotificationMutation,
  useGetSingleNotificationQuery,
} from "@/lib/api/notification/notificationApi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState, useEffect } from "react";
import { ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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

  // Prevent scroll when either drawer or modal is open
  useEffect(() => {
    if (open || selectedNotificationId) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open, selectedNotificationId]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/50 z-[9998] backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white shadow-2xl z-[9999] flex flex-col"
          >
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

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
          </motion.div>
        </>
      )}

      {/* Detail Modal */}
      {selectedNotificationId && (
        <NotificationDetailModal
          id={selectedNotificationId}
          onClose={() => setSelectedNotificationId(null)}
        />
      )}
    </AnimatePresence>
  );
}

function NotificationDetailModal({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const { data: detailsData, isLoading } = useGetSingleNotificationQuery(id);
  const notification = detailsData?.data;

  return (
    <>
      {/* Modal Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-[10000] backdrop-blur-md"
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto overflow-hidden flex flex-col"
        >
          <div className="p-4 border-b flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Notification Details</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[70vh]">
            {isLoading ? (
              <div className="p-10 text-center text-gray-400 text-sm">
                Loading details...
              </div>
            ) : notification ? (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {notification.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {dayjs(notification.createdAt).format(
                      "MMMM D, YYYY at h:mm A",
                    )}
                  </p>
                </div>
                <div className="bg-blue-50/30 border border-blue-100 p-5 rounded-xl">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {notification.message}
                  </p>
                </div>
              </>
            ) : (
              <div className="p-10 text-center text-gray-400 text-sm">
                Notification not found
              </div>
            )}
          </div>

          <div className="p-4 border-t bg-gray-50/50 flex justify-end">
            <Button onClick={onClose} variant="secondary" className="px-6">
              Close
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
