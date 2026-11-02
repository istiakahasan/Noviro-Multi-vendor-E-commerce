// src/app/(dashboardLayout)/admin-dashboard/platform-settings/components/NotificationPreferences.tsx

import React, { useState } from 'react';
import { NotificationChannel, NotificationRecipient } from '@/types/global';

const NotificationPreferences: React.FC = () => {
  const [channels, setChannels] = useState<NotificationChannel[]>([
    { id: '1', name: 'Email Notifications', description: 'Send notifications via email', enabled: true },
    { id: '2', name: 'SMS Notifications', description: 'Send notifications via SMS', enabled: true },
    { id: '3', name: 'Push Notifications', description: 'Send push notifications to mobile apps', enabled: true },
  ]);

  const [recipients, setRecipients] = useState<NotificationRecipient[]>([
    { id: '1', name: 'Admin Alerts', description: 'Receive alerts about platform activity', enabled: true },
    { id: '2', name: 'Vendor Notifications', description: 'Send notifications to vendors', enabled: true },
    { id: '3', name: 'Customer Notifications', description: 'Send notifications to customers', enabled: true },
  ]);

  const toggleChannel = (id: string) => {
    setChannels((prev) =>
      prev.map((channel) =>
        channel.id === id ? { ...channel, enabled: !channel.enabled } : channel
      )
    );
  };

  const toggleRecipient = (id: string) => {
    setRecipients((prev) =>
      prev.map((recipient) =>
        recipient.id === id ? { ...recipient, enabled: !recipient.enabled } : recipient
      )
    );
  };

  return (
    <div className="space-y-8">
        <h2 className='p-4 text-xl font-bold'>Notification Preferences</h2>
      {/* Notification Channels */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-6">
          Notification Channels
        </h3>
        <div className="space-y-4">
          {channels.map((channel) => (
            <div key={channel.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{channel.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{channel.description}</p>
              </div>
              <button
                onClick={() => toggleChannel(channel.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  channel.enabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    channel.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Recipients */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-6">
          Notification Recipients
        </h3>
        <div className="space-y-4">
          {recipients.map((recipient) => (
            <div key={recipient.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{recipient.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{recipient.description}</p>
              </div>
              <button
                onClick={() => toggleRecipient(recipient.id)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  recipient.enabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    recipient.enabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    


    {/* Buttons */}
      <div className="flex justify-start pt-6  space-x-3">
        <button
          type="submit"
          className="bg-[#333333] cursor-pointer text-white px-6 py-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2  focus:ring-offset-2 transition-colors"
        >
          Save Changes
        </button>
        <button
          type="button"
          
          className="bg-gray-50 text-gray-700 border border-gray-600 px-6 py-2 rounded-md cursor-pointer hover:bg-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NotificationPreferences;