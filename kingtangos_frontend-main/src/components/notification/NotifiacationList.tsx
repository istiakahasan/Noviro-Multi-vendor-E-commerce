'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
// import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
// import { Trash2 } from 'lucide-react';
// import { useUpdateNotificationStatusMutation } from '@/services/notificationApi';
import { Notification } from '@/types/notification.type';
import { useUpdateNotificationStatusMutation } from '@/redux/api/notificationApi';

interface NotificationListProps {
  notifications: Notification[];
  onNotificationClick: (notification: Notification) => void;
  onRemove: (id: string) => void;
  isLoading?: boolean;
}

export function NotificationList({
  notifications,
  onNotificationClick,
  // onRemove,
  isLoading = false,
}: NotificationListProps) {
  const [updateNotificationStatus] = useUpdateNotificationStatusMutation();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateNotificationStatus({ notificationId: id }).unwrap();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center p-4">
        <p className="text-sm text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center p-4">
        <p className="text-sm text-gray-500">No notifications yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {unreadCount > 0 && (
        <div className="px-4 py-3 bg-blue-50 border-b">
          <p className="text-sm font-medium text-blue-900">
            {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {notifications.map((notification, index) => (
            <div key={notification.id}>
              <div
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  !notification.isRead
                    ? 'bg-blue-50 hover:bg-blue-100'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => {
                  if (!notification.isRead) {
                    handleMarkAsRead(notification.id);
                  }
                  onNotificationClick(notification);
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <span className="inline-flex h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  {/* <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(notification.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-gray-400 hover:text-gray-600" />
                  </Button> */}
                </div>
              </div>
              {index < notifications.length - 1 && <Separator className="my-1" />}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}