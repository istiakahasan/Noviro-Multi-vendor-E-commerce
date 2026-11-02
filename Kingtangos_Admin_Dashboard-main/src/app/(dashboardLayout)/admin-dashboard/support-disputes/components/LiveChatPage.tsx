"use client";
// src/components/Pages/LiveChatPage.tsx


import { ChatSession } from '@/types/global';
import React, { useState } from 'react';
import ChatWindow from './ChatWindow';

interface ChatMessage {
  sender: string;
  text: string;
}

interface ExtendedMessage extends ChatMessage {
  type?: string;
  fileName?: string;
}

const LiveChatPage: React.FC = () => {
  const initialChats: ChatSession[] = [
    {
      user: 'Nefetari D. Vivi',
      time: '43 minutes ago',
      date: '12 July',
      messages: [
        { sender: 'agent', text: 'Hello' },
        { sender: 'user', text: 'What do you think about this?' },
        { sender: 'user', text: 'Lorem ipsum dolor sit amet consectetur. Ipsum aliquet nibh sit congue netus.' }
      ]
    },
    {
      user: 'Nefetari D. Vivi',
      time: '43 minutes ago',
      date: '12 July',
      messages: [
        { sender: 'agent', text: 'Hello' },
        { sender: 'user', text: 'What do you think about this?' },
        { sender: 'user', text: 'Lorem ipsum dolor sit amet consectetur. Ipsum aliquet nibh sit congue netus.' }
      ]
    }
  ];

  const [chats, setChats] = useState<ChatSession[]>(initialChats);

  const updateChatMessages = (index: number, newMessages: ChatSession['messages']) => {
    setChats(prev => prev.map((chat, i) => i === index ? { ...chat, messages: newMessages } : chat));
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-2 gap-6">
        {chats.map((chat, idx) => (
          <ChatWindow 
            key={idx} 
            chat={chat} 
            onUpdateMessages={(newMessages) => updateChatMessages(idx, newMessages as unknown as ChatSession['messages'])}
          />
        ))}
      </div>
    </div>
  );
};

export default LiveChatPage;