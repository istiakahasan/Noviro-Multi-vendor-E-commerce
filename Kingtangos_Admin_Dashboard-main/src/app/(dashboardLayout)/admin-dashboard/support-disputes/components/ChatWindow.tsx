// // src/components/ChatWindow.tsx

// import React, { useState } from 'react';
// import { ChatSession } from '@/types/global';
// import { ImageIcon, Link2, Smile } from 'lucide-react'; // example icons

// interface ChatWindowProps {
//   chat: ChatSession;
// }

// const ChatWindow: React.FC<ChatWindowProps> = ({ chat }) => {
//   const [input, setInput] = useState('');

//   const handleSend = () => {
//     if (!input.trim()) return;
//     console.log('Send message:', input);
//     setInput('');
//   };

//   return (
//     <div className="flex flex-col h-full border rounded-lg overflow-hidden">
//       {/* Header */}
//       <div className="flex items-center p-4 border-b">
//         <img src="/path/to/avatar.jpg" alt={chat.user} className="w-10 h-10 rounded-full mr-3" />
//         <div>
//           <div className="font-semibold">{chat.user}</div>
//           <div className="text-sm text-gray-500">Last seen {chat.time}</div>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 p-4 overflow-y-auto space-y-2 bg-gray-50">
//         {chat.messages.map((msg, idx) => {
//           const isUser = msg.sender === 'user';
//           return (
//             <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
//               <div
//                 className={`p-3 rounded-lg max-w-[70%] ${
//                   isUser ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-800'
//                 }`}
//               >
//                 {msg.text}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Date separator example */}
//       <div className="text-center text-gray-400 text-sm my-2">
//         {chat.date}
//       </div>

//       {/* Input */}
//       <div className="flex items-center border-t p-3 gap-2">
//         <button><ImageIcon /></button>
//         <button><Link2 /></button>
//         <button><Smile /></button>
//         <input
//           type="text"
//           className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
//           placeholder="Send a message"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//         />
//         <button
//           onClick={handleSend}
//           className="bg-purple-600 text-white px-4 py-2 rounded-full"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;



// src/components/ChatWindow.tsx

// src/components/ChatWindow.tsx
"use client";


import React, { useState } from 'react';
import { ChatSession } from '@/types/global';
import { Paperclip, Link2, Smile, Send } from 'lucide-react';
import Image from 'next/image';

interface ExtendedMessage {
  sender: 'agent' | 'user';
  text?: string;
  type?: 'text' | 'file';
  fileName?: string;
}

interface ChatWindowProps {
  chat: ChatSession;
  onUpdateMessages: (messages: ExtendedMessage[]) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, onUpdateMessages }) => {
  const [input, setInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleSend = () => {
    if (!input.trim() && !file) return;
    
    const newMessage: ExtendedMessage = {
      sender: 'user',
      text: input || undefined,
      ...(file && { type: 'file', fileName: file.name }),
    };

    onUpdateMessages([...(chat.messages as ExtendedMessage[]), newMessage]);
    setInput('');
    setFile(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-send file message
      const newMessage: ExtendedMessage = {
        sender: 'user',
        type: 'file',
        fileName: selectedFile.name,
      };
      onUpdateMessages([...(chat.messages as ExtendedMessage[]), newMessage]);
      setFile(null);
      e.target.value = ''; // Reset input
    }
  };

  const insertEmoji = (emoji: string) => {
    setInput(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const emojis = ['😊', '😂', '❤️', '👍', '🔥', '🎉', '😍', '🤔', '😢', '🙌', '👏', '⭐'];

  return (
    <div className="flex flex-col h-[600px] border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200">
        <div className="relative mr-3">
          <Image
            width={40}
            height={40} 
            src="https://i.ibb.co.com/tPkRmdmZ/Background-1.png" 
            alt={chat.user} 
            className="w-10 h-10 rounded-full" 
          />
          <span className="absolute -bottom-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
        </div>
        <div>
          <div className="font-semibold text-gray-900">{chat.user}</div>
          <div className="text-sm text-gray-500">Last seen {chat.time}</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        <div className="text-center text-xs text-gray-400 my-2">
          {chat.date}
        </div>
        {(chat.messages as ExtendedMessage[]).map((msg, idx) => {
          const isUser = msg.sender === 'user';
          return (
            <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser ? (
                <div className="flex items-end space-x-2">
                  <Image
                    width={24}
                    height={24} 
                    src="https://i.ibb.co.com/tPkRmdmZ/Background-1.png" 
                    alt="Agent" 
                    className="w-6 h-6 rounded-full flex-shrink-0" 
                  />
                  <div className="p-3 bg-gray-200 text-gray-900 rounded-2xl max-w-[70%]">
                    {msg.text}
                  </div>
                </div>
              ) : (
                <div className={`max-w-[70%] ${msg.type === 'file' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-purple-600 text-white'}`}>
                  {msg.type === 'file' ? (
                    <div className="p-3 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">📎 {msg.fileName}</span>
                        <button className="text-blue-600 hover:underline text-xs">Download</button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl">
                      {msg.text}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="flex items-center border-t border-gray-200 p-3 gap-2">
        {/* File Upload */}
        <label className="p-2 text-blue-500 hover:bg-gray-100 rounded cursor-pointer transition-colors">
          <Paperclip className="h-4 w-4" />
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,application/pdf,.doc,.docx"
          />
        </label>
        
        {/* Link Button */}
        <button className="p-2 text-emerald-500 hover:bg-gray-100 rounded transition-colors">
          <Link2 className="h-4 w-4" />
        </button>
        
        {/* Emoji Button */}
        <div className="relative">
          <button 
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-amber-500 hover:bg-gray-100 rounded transition-colors"
          >
            <Smile className="h-4 w-4" />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-14 left-0 w-64 bg-white border border-gray-200 rounded-xl shadow-xl p-3 grid grid-cols-6 gap-2 z-10 max-h-48 overflow-y-auto">
              {emojis.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => insertEmoji(emoji)}
                  className="text-3xl hover:bg-gray-100 rounded-lg p-2 w-full h-12 flex items-center justify-center transition-colors"
                  style={{ fontSize: '1.5rem' }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="Send a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() && !file}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;