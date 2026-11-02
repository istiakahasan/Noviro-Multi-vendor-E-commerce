'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { X } from 'lucide-react';
import { format } from 'date-fns';
import { Notification } from '@/types/notification.type';

interface NotificationModalProps {
  notification: Notification | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NotificationModal({
  notification,
  open,
  onOpenChange,
}: NotificationModalProps) {
  if (!notification) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-left">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold">
                {notification.title}
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs text-gray-500">
                {format(new Date(notification.createdAt), 'PPpp')}
              </DialogDescription>
            </div>
            {/* <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button> */}
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-700">{notification.message}</p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {notification.isRead ? 'Read' : 'Unread'}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-gray-50 p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-600">Status:</span>
              <span className="text-gray-700">{notification.isRead ? 'Read' : 'Unread'}</span>
            </div>
            {/* <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-600">Created:</span>
              <span className="text-gray-700">{format(new Date(notification.createdAt), 'PPp')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-600">User ID:</span>
              <span className="text-gray-700 truncate text-xs">{notification.userId}</span>
            </div> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}