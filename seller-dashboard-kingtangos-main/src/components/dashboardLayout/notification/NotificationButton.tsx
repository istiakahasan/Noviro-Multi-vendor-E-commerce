/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { NotificationModal } from './NotificationModal';
import { setSelectedNotification, clearSelectedNotification } from '@/redux/features/notificationSlice';
import { useAppDispatch } from '@/redux/hooks';
import { Notification } from '@/types/notification.type';
import { FaBell } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { useGetMyAllNotificationQuery, useUpdateNotificationStatusMutation } from '@/redux/api/notificationApi/notificationApi';
import { NotificationList } from './NotifiacationList';


export function NotificationButton() {
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  // RTK Query hooks
  const { data: notificationsData, isLoading } = useGetMyAllNotificationQuery();
  const [updateNotificationStatus] = useUpdateNotificationStatusMutation();
  
  const notifications = Array.isArray(notificationsData?.data) ? notificationsData.data : notificationsData?.data ? [notificationsData.data] : [];
  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      try {
        await updateNotificationStatus({ notificationId: notification.id }).unwrap();
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    
    dispatch(setSelectedNotification(notification));
    setIsModalOpen(true);
  };

  const handleRemove = (id: string) => {
    // You might want to implement a delete mutation here
    console.log('Remove notification:', id);
  };

  const selectedNotification = useSelector((state: any) => state.notifications.selectedNotification);

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative lg:w-10 h-10 w-4  rounded-full"
            aria-label="Notifications"
          >
            <FaBell size={16} />
            {unreadCount > 0 && (
              <Badge
                className="absolute -top-1 lg:-right-1 -right-3 h-5 w-5 p-0 flex items-center justify-center text-xs font-bold bg-red-500 hover:bg-red-600"
                variant="default"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-0 md:w-[420px]" align="end">
          <div className="flex flex-col h-96 overflow-hidden">
            <div className="px-4 py-3 border-b">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
            </div>
            <NotificationList
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
              onRemove={handleRemove}
              isLoading={isLoading}
            />
          </div>
        </PopoverContent>
      </Popover>

      <NotificationModal
        notification={selectedNotification}
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            dispatch(clearSelectedNotification());
          }
        }}
      />
    </>
  );
}