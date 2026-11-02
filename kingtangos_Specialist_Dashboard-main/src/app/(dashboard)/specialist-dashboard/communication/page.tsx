// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import Image from 'next/image';
// import { MdEmojiEmotions, MdOutlineAttachFile } from 'react-icons/md';

// interface Message {
//   id: string;
//   sender: string;
//   content: string;
//   timestamp: string;
//   isOwn: boolean;
//   type?: 'text' | 'image' | 'file';
//   fileUrl?: string;
// }

// interface Chat {
//   id: string;
//   name: string;
//   avatar: string;
//   lastMessage: string;
//   timestamp: string;
// }

// const mockChats: Chat[] = [
//   {
//     id: '1',
//     name: 'Monkey D. Luffy',
//     avatar: 'https://i.ibb.co.com/PyXSVMn/Ellipse-3.png',
//     lastMessage: 'Historically, philosophy encompassed',
//     timestamp: '2 min',
//   },
//   {
//     id: '2',
//     name: 'Nico Robin',
//     avatar: 'https://i.ibb.co.com/tPkRmdmZ/Background-1.png',
//     lastMessage: 'What are your thoughts on it?',
//     timestamp: '4 min',
//   },
//   {
//     id: '3',
//     name: 'Nefetari Vivi',
//     avatar: 'https://i.ibb.co.com/prLBzvB1/Portrait-Placeholder.png',
//     lastMessage: 'Let\'s go on an adventure!',
//     timestamp: '7 min',
//   },
//   {
//     id: '4',
//     name: 'Boa Hancock',
//     avatar: 'https://i.ibb.co.com/ZzcCMzNx/3.webp',
//     lastMessage: 'I\'m the best!',
//     timestamp: '9 min',
//   },
//   {
//     id: '5',
//     name: 'Sanji Vinsmoke',
//     avatar: 'https://i.ibb.co.com/YMtFSLy/Note-Ninja.png',
//     lastMessage: 'Dinner is ready.',
//     timestamp: '12 min',
//   },
//   {
//     id: '6',
//     name: 'Roronoa Zoro',
//     avatar: 'https://i.ibb.co.com/WvkR3w9T/484508907-643383828437987-5139746355470782214-n.jpg',
//     lastMessage: 'Where\'s the way again?',
//     timestamp: '15 min',
//   },
// ];

// const initialMessages: Message[] = [
//   { id: '1', sender: 'Other', content: 'Hello!', timestamp: '12 July', isOwn: false },
//   { id: '2', sender: 'Other', content: 'What do you think about this?', timestamp: '12 July', isOwn: false },
//   { id: '3', sender: 'You', content: 'Looks great! 👍', timestamp: '12 July', isOwn: true },
//   { id: '4', sender: 'Other', content: 'Lorem ipsum dolor sit amet consectetur. Ipsum aliquet nibh sit congue netus.', timestamp: '12 July', isOwn: false },
//   { id: '5', sender: 'You', content: 'Yes, totally agree 💪', timestamp: '12 July', isOwn: true },
//   { id: '6', sender: 'You', content: 'Also, here\'s a reference.', timestamp: '12 July', isOwn: true },
// ];

// const emojis = ['😀', '😂', '❤️', '👍', '🔥', '🎉', '🤔', '😎', '🙌', '👏'];

// const ChatPage = () => {
//   const [selectedChatId, setSelectedChatId] = useState('3');
//   const [messages, setMessages] = useState(initialMessages);
//   const [newMessage, setNewMessage] = useState('');
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(true);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const emojiPickerRef = useRef<HTMLDivElement>(null);
//   const chatEndRef = useRef<HTMLDivElement>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);

//   const selectedChat = mockChats.find(c => c.id === selectedChatId);

//   // Auto scroll to bottom
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages, selectedChatId]);

//   // Close emoji picker on outside click
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
//         setShowEmojiPicker(false);
//       }
//     };
//     if (showEmojiPicker) document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [showEmojiPicker]);

//   const handleSendMessage = () => {
//     if (!newMessage.trim()) return;
//     const msg: Message = {
//       id: Date.now().toString(),
//       sender: 'You',
//       content: newMessage,
//       timestamp: 'Now',
//       isOwn: true,
//     };
//     setMessages(prev => [...prev, msg]);
//     setNewMessage('');
//     setShowEmojiPicker(false);
//     textareaRef.current?.focus();
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const handleEmojiClick = (emoji: string) => {
//     setNewMessage(prev => prev + emoji);
//     textareaRef.current?.focus();
//   };

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const fileUrl = URL.createObjectURL(file);
//     const msg: Message = {
//       id: Date.now().toString(),
//       sender: 'You',
//       content: file.name,
//       timestamp: 'Now',
//       isOwn: true,
//       type: file.type.startsWith('image/') ? 'image' : 'file',
//       fileUrl,
//     };
//     setMessages(prev => [...prev, msg]);
//   };

//   const handleChatSelect = (chatId: string) => {
//     setSelectedChatId(chatId);
//     setShowSidebar(false); // Hide sidebar on mobile after selecting
//   };

//   // Auto grow textarea
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = 'auto';
//       textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//     }
//   }, [newMessage]);

//   return (
//     <div className="flex h-screen md:h-[calc(100vh-145px)] overflow-hidden">
//       {/* Sidebar - Hidden on mobile when chat is selected */}
//       <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex w-full md:w-1/4 rounded-none md:rounded-2xl m-0 md:m-2 shadow-sm border-r md:border border-gray-100 flex-col`}>
//         <div className="p-5 border-b border-gray-200">
//           <h1 className="text-lg font-semibold">Chatting List</h1>
//         </div>

//         <div className="p-3 border-b border-gray-200">
//           <input
//             type="text"
//             placeholder="Search"
//             className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
//           />
//         </div>

//         <div className="px-5 pt-3 pb-2 text-sm text-gray-500 font-medium">Messages</div>

//         <div className="flex-1 overflow-y-auto">
//           {mockChats.map(chat => (
//             <div
//               key={chat.id}
//               onClick={() => handleChatSelect(chat.id)}
//               className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${
//                 selectedChatId === chat.id ? 'bg-blue-100/70 rounded-lg ' : ''
//               }`}
//             >
//               <Image src={chat.avatar} alt={chat.name} width={40} height={40} className="rounded-full" />
//               <div className="ml-3 flex-1 min-w-0">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-sm font-medium truncate">{chat.name}</h3>
//                   <span className="text-xs text-gray-500">{chat.timestamp}</span>
//                 </div>
//                 <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Chat Area - Full screen on mobile when chat is selected */}
//       <div className={`${!showSidebar ? 'flex' : 'hidden'} md:flex flex-1 flex-col rounded-none md:rounded-2xl m-0 md:m-2 border-l md:border border-gray-100 shadow-sm bg-blue-50/20`}>
//         {selectedChat ? (
//           <>
//             {/* Header */}
//             <div className="p-4 flex items-center space-x-3 border-b border-gray-200 bg-blue-50 rounded-t-2xl">
//               {/* Back button for mobile */}
//               <button 
//                 onClick={() => setShowSidebar(true)}
//                 className="md:hidden text-gray-600 mr-2"
//               >
//                 ← Back
//               </button>
//               <Image src={selectedChat.avatar} alt={selectedChat.name} width={40} height={40} className="rounded-full" />
//               <div>
//                 <h2 className="font-medium text-sm">{selectedChat.name}</h2>
//                 <p className="text-xs text-gray-500">Last seen 43 minutes ago</p>
//               </div>
//             </div>

//             {/* Messages - Fixed height with proper overflow */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: 'calc(100vh - 200px)' }}>
//               <div className="text-center text-xs text-gray-400">12 July</div>
//               {messages.map(msg => (
//                 <div key={msg.id} className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
//                   <div
//                     className={`rounded-2xl px-4 py-2 text-sm max-w-xs md:max-w-md ${
//                       msg.isOwn
//                         ? 'bg-[#7e3af2] text-white rounded-br-none'
//                         : 'bg-gray-100 text-gray-900 rounded-bl-none'
//                     }`}
//                   >
//                     {msg.type === 'image' && msg.fileUrl ? (
//                       <Image src={msg.fileUrl} alt="image" width={200} height={200} className="rounded-lg" />
//                     ) : msg.type === 'file' ? (
//                       <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer" className="underline">
//                         {msg.content}
//                       </a>
//                     ) : (
//                       msg.content
//                     )}
//                   </div>
//                 </div>
//               ))}
//               <div ref={chatEndRef} />
//             </div>

//             {/* Input Area - Sticky at bottom */}
//             <div className="p-4 border-t border-gray-100 flex items-end space-x-2 md:space-x-3 relative bg-blue-50/70 rounded-b-2xl">
//               <button
//                 onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                 className="text-xl cursor-pointer text-gray-500 hover:text-gray-700 flex-shrink-0"
//               >
//                 <MdEmojiEmotions />
//               </button>
//               <button
//                 onClick={() => fileInputRef.current?.click()}
//                 className="text-xl cursor-pointer text-gray-500 hover:text-gray-700 flex-shrink-0"
//               >
//                <MdOutlineAttachFile />
//               </button>
//               <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

//               <textarea
//                 ref={textareaRef}
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 onKeyDown={handleKeyPress}
//                 placeholder="Send a message"
//                 rows={1}
//                 className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-1 focus:ring-gray-300 focus:outline-none max-h-32"
//               />

//               <button
//                 onClick={handleSendMessage}
//                 className="bg-[#7e3af2] text-white px-4 md:px-6 py-2 rounded-lg hover:bg-[#692de2] transition flex-shrink-0 text-sm"
//               >
//                 Send
//               </button>

//               {showEmojiPicker && (
//                 <div
//                   ref={emojiPickerRef}
//                   className="absolute bottom-14 left-4 md:left-12 bg-white border border-gray-200 rounded-lg shadow-lg p-2 grid grid-cols-5 md:grid-cols-6 gap-1 z-10"
//                 >
//                   {emojis.map((emoji, i) => (
//                     <button
//                       key={i}
//                       onClick={() => handleEmojiClick(emoji)}
//                       className="text-lg hover:bg-gray-100 rounded p-1"
//                     >
//                       {emoji}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex items-center justify-center text-gray-500">
//             Select a chat to start messaging
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;










// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import Image from "next/image";
// import { useEffect, useRef, useState, useCallback } from "react";
// import { io } from "socket.io-client";
// import pImage from "@/../public/Images/user.jpeg";

// import { useGetMyProfileQuery } from "@/lib/api/myProfile/settingsApi";
// import { useGetAllMessageQuery, useGetMyConversationQuery } from "@/lib/api/chat/chatApi";
// import PageLoading from "@/components/ui/Loading";


// interface Chat {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   profilePic: string;
//   conversationId: string;
//   lastMessage: {
//     id: string;
//     conversationId: string;
//     messages: string;
//     senderId: string;
//     receiverId: string;
//     deletedFor: string[];
//     createdAt: string;
//     updatedAt: string;
//   };
// }

// interface Message {
//   id: string;
//   messages: string | null;
//   senderId: string;
//   receiverId: string;
//   isDeleted?: boolean;
//   isOwn?: boolean;
//   type?: string;
//   fileUrl?: string;
//   content?: string;
//   createdAt?: string;
//   conversationId?: string;
// }

// const socket = io("https://api.ainoviro.com", {
//   autoConnect: false,
// });

// const ChatPage = () => {
//   const { data: userData, isLoading: userLoading } = useGetMyProfileQuery();

//   // console.log(" ==============================", userData );
//   const currentUserId = userData?.data?.userId;
  
//   const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [isSocketConnected, setIsSocketConnected] = useState(false);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const chatEndRef = useRef<HTMLDivElement>(null);
//   const { data, isLoading, isError } = useGetMyConversationQuery({});
  
//   const { 
//     data: previousMessagesData, 
//     refetch: refetchPreviousMessages,
//     isLoading: isLoadingPreviousMessages 
//   } = useGetAllMessageQuery(
//     selectedChat?.id, 
//     { skip: !selectedChat?.id }
//   );

//   // Track sent messages to prevent duplicates
//   const sentMessageIds = useRef<Set<string>>(new Set());

//   // Auto scroll to bottom when messages change
//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Create stable callback for socket events
//   const handleReceiveMessage = useCallback((msg: Message) => {
//     console.log("New message received from socket:", msg);
    
//     // Check if we've already processed this message ID
//     if (sentMessageIds.current.has(msg.id)) {
//       console.log("Duplicate message detected, skipping:", msg.id);
//       return;
//     }
    
//     // Only add message if it belongs to the current conversation
//     if (selectedChat && currentUserId) {
//       // Check if message is for this conversation
//       const isForThisConversation = 
//         (msg.senderId === currentUserId && msg.receiverId === selectedChat.id) ||
//         (msg.senderId === selectedChat.id && msg.receiverId === currentUserId);
      
//       if (isForThisConversation) {
//         // Mark this message ID as processed
//         sentMessageIds.current.add(msg.id);
        
//         setMessages(prev => {
//           // Check if this message already exists in the array
//           const messageExists = prev.some(m => m.id === msg.id);
//           if (messageExists) {
//             console.log("Message already in array, skipping:", msg.id);
//             return prev;
//           }
          
//           // Add the new message
//           return [...prev, { ...msg, isOwn: msg.senderId === currentUserId }];
//         });
//       }
//     }
//   }, [currentUserId, selectedChat]);

//   const handleMessageDeletedForMe = useCallback(({ messageId }: { messageId: string }) => {
//     console.log("Message deleted for me:", messageId);
//     setMessages(prev => prev.filter(m => m.id !== messageId));
//     // Also remove from sentMessageIds
//     sentMessageIds.current.delete(messageId);
//   }, []);

//   const handleMessageDeletedForEveryone = useCallback(({ messageId }: { messageId: string }) => {
//     console.log("Message deleted for everyone:", messageId);
//     setMessages(prev =>
//       prev.map(m =>
//         m.id === messageId ? { ...m, messages: null, isDeleted: true } : m
//       )
//     );
//     // Also remove from sentMessageIds
//     sentMessageIds.current.delete(messageId);
//   }, []);

//   // Initialize socket connection and listeners
//   useEffect(() => {
//     if (!currentUserId) return;

//     // Connect socket if not already connected
//     if (!socket.connected) {
//       socket.connect();
//     }

//     // Join room with current user ID
//     socket.emit("joinRoom", currentUserId);

//     socket.on("connect", () => {
//       console.log("Socket connected");
//       setIsSocketConnected(true);
//     });

//     socket.on("disconnect", () => {
//       console.log("Socket disconnected");
//       setIsSocketConnected(false);
//     });

//     socket.on("previousMessages", (msgs: Message[]) => {
//       console.log("Received previous messages from socket:", msgs);
      
//       // Clear the tracking set when loading previous messages
//       sentMessageIds.current.clear();
      
//       const formattedMsgs = msgs.map(msg => {
//         // Track these message IDs
//         sentMessageIds.current.add(msg.id);
//         return {
//           ...msg,
//           isOwn: msg.senderId === currentUserId
//         };
//       });
//       setMessages(formattedMsgs);
//     });

//     socket.on("receiveMessage", handleReceiveMessage);
//     socket.on("messageDeletedForMe", handleMessageDeletedForMe);
//     socket.on("messageDeletedForEveryone", handleMessageDeletedForEveryone);

//     // Cleanup on unmount
//     return () => {
//       socket.off("connect");
//       socket.off("disconnect");
//       socket.off("previousMessages");
//       socket.off("receiveMessage");
//       socket.off("messageDeletedForMe");
//       socket.off("messageDeletedForEveryone");
//     };
//   }, [currentUserId, handleReceiveMessage, handleMessageDeletedForMe, handleMessageDeletedForEveryone]);

//   // Fetch previous messages from API when a chat is selected
//   useEffect(() => {
//     if (selectedChat && currentUserId) {
//       // Clear previous messages and tracking
//       setMessages([]);
//       sentMessageIds.current.clear();
      
//       console.log(`Fetching previous messages for user: ${selectedChat.id}`);
      
//       // Request messages from API
//       refetchPreviousMessages();
      
//       // Also request messages from socket for real-time updates
//       if (socket.connected) {
//         socket.emit("getMessages", {
//           senderId: currentUserId,
//           receiverId: selectedChat.id,
//         });
//       }
//     }
//   }, [selectedChat, currentUserId, refetchPreviousMessages]);

//   // Process and display previous messages from API response
//   useEffect(() => {
//     if (previousMessagesData?.data?.success && previousMessagesData.data.data) {
//       console.log("Previous messages from API:", previousMessagesData.data.data);
      
//       // Clear the tracking set
//       sentMessageIds.current.clear();
      
//       // Map API response to match Message interface and mark own messages
//       const apiMessages: Message[] = previousMessagesData.data.data.map((msg: any) => {
//         // Track these message IDs
//         sentMessageIds.current.add(msg.id);
//         return {
//           id: msg.id,
//           messages: msg.messages,
//           senderId: msg.senderId,
//           receiverId: msg.receiverId,
//           conversationId: msg.conversationId,
//           createdAt: msg.createdAt,
//           isOwn: msg.senderId === currentUserId
//         };
//       });
      
//       // Set messages from API response
//       setMessages(apiMessages);
//     }
//   }, [previousMessagesData, currentUserId]);

//   const handleSelectChat = (chat: Chat) => {
//     setSelectedChat(chat);
//     console.log(`Selected chat with ${chat.firstName}`);
//   };

//   const handleSendMessage = () => {
//     if (!newMessage.trim() || !selectedChat || !currentUserId) {
//       console.error("Cannot send message: missing required data");
//       return;
//     }

//     const messageData = {
//       senderId: currentUserId,
//       receiverId: selectedChat.id,
//       messages: newMessage,
//     };

//     console.log("Sending message:", messageData);
//     socket.emit("sendMessage", messageData);
    
//     // DON'T add a temporary message - let the socket response handle it
//     // This prevents the duplicate message issue
//     setNewMessage("");
    
//     // Alternative: You can add a loading indicator here if needed
//     // Or use a different approach if you want instant feedback
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   // Helper function to format timestamp
//   const formatTime = (dateString?: string) => {
//     if (!dateString) return "";
//     return new Date(dateString).toLocaleTimeString([], { 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     });
//   };

//   // Show loading while fetching user data
//   if (userLoading) {
//     return (
//       // <div className="flex flex-col md:flex-row h-[calc(100vh-150px)]">
//       //   <div className="flex items-center justify-center w-full h-full">
//       //     <p className="text-gray-500">Loading user data...</p>
//       //   </div>
//       // </div>
//       <PageLoading/>
//     );
//   }

//   return (
//     <div className="flex flex-col md:flex-row h-[calc(100vh-150px)]">
//       {/* Left Sidebar - Chat List */}
//       <div className="w-full md:w-1/4 rounded-2xl m-2 shadow-sm border border-gray-100 flex flex-col">
//         <div className="p-5 border-b border-gray-200">
//           <h1 className="text-lg font-semibold">Chatting List</h1>
//           <div className="text-xs text-gray-500 mt-1">
//             Socket: {isSocketConnected ? " Connected" : " Disconnected"}
//           </div>
//         </div>

//         <div className="px-5 pt-3 pb-2 text-sm text-gray-500 font-medium">
//           Messages
//         </div>

//         <div className="flex-1 overflow-y-auto scroll-smooth">
//           {isLoading ? (
//             <div className="flex items-center justify-center p-4 text-sm text-gray-500">
//               Loading conversations...
// {/* <p className="text-5xl text-red-400"> hello</p> */}
//             </div>
//           ) : isError ? (
//             <div className="flex items-center justify-center p-4 text-sm text-red-500">
//               Error loading conversations
//             </div>
//           ) : !data?.data || data.data.length === 0 ? (
//             <div className="flex items-center justify-center p-4 text-sm text-gray-500">
//               No conversations yet
//             </div>
//           ) : (
//             data.data.map((chat: Chat) => (
//               <div
//                 key={chat.id}
//                 onClick={() => handleSelectChat(chat)}
//                 className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${
//                   selectedChat?.id === chat.id ? "bg-gray-100" : ""
//                 }`}
//               >
//                 <div className="relative">
//                   <Image
//                     src={chat.profilePic || pImage.src}
//                     alt={chat.firstName}
//                     width={40}
//                     height={40}
//                     className="rounded-full"
//                   />
//                   {isSocketConnected && (
//                     <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
//                   )}
//                 </div>
//                 <div className="ml-3 flex-1 min-w-0">
//                   <div className="flex justify-between items-center">
//                     <h3 className="text-sm font-medium truncate">
//                       {chat.firstName} {chat.lastName}
//                     </h3>
//                     <span className="text-xs text-gray-500">
//                       {formatTime(chat.lastMessage?.createdAt)}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-500 truncate">
//                     {chat.lastMessage?.messages || "No messages yet"}
//                   </p>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Right Side - Chat Area */}
//       <div className="flex-1 flex flex-col rounded-2xl m-2 border border-gray-100 shadow-sm">
//         {selectedChat ? (
//           <>
//             {/* Chat Header */}
//             <div className="p-4 flex items-center space-x-3 border-b border-gray-200 sticky top-0 bg-white ">
//               <div className="relative">
//                 <Image
//                   src={selectedChat.profilePic || pImage.src}
//                   alt={selectedChat.firstName}
//                   width={40}
//                   height={40}
//                   className="rounded-full"
//                 />
//                 {isSocketConnected && (
//                   <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
//                 )}
//               </div>
//               <div>
//                 <h2 className="font-medium text-sm">
//                   {selectedChat.firstName} {selectedChat.lastName}
//                 </h2>
//                 <p className="text-xs text-gray-500">
//                   {isSocketConnected ? "Online • " : "Offline • "}
//                   <span className="text-gray-400">
//                     {selectedChat.email}
//                   </span>
//                 </p>
//               </div>
//             </div>

//             {/* Messages Area */}
//             <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
//               {isLoadingPreviousMessages ? (
//                 <div className="flex items-center justify-center h-full">
//                   <div className="text-center text-gray-500">
//                     <p>Loading messages...</p>
//                   </div>
//                 </div>
//               ) : messages.length === 0 ? (
//                 <div className="flex items-center justify-center h-full">
//                   <div className="text-center text-gray-500">
//                     <p className="mb-2">No messages yet</p>
//                     <p className="text-sm">Start the conversation!</p>
//                   </div>
//                 </div>
//               ) : (
//                 <>
//                   {messages.map((msg) => (
//                     <div
//                       key={msg.id}
//                       className={`flex ${
//                         msg.isOwn ? "justify-end" : "justify-start"
//                       }`}
//                     >
//                       <div
//                         className={`rounded-2xl px-4 py-2 text-sm max-w-xs md:max-w-md ${
//                           msg.isOwn
//                             ? "bg-[#7e3af2] text-white rounded-br-none"
//                             : "bg-gray-100 text-gray-900 rounded-bl-none"
//                         }`}
//                       >
//                         {msg.isDeleted ? (
//                           <span className="italic text-gray-500">
//                             This message was deleted
//                           </span>
//                         ) : msg.type === "image" && msg.fileUrl ? (
//                           <Image
//                             src={msg.fileUrl}
//                             alt="image"
//                             width={200}
//                             height={200}
//                             className="rounded-lg"
//                           />
//                         ) : msg.type === "file" ? (
//                           <a
//                             href={msg.fileUrl}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="underline"
//                           >
//                             {msg.content || msg.messages}
//                           </a>
//                         ) : (
//                           <div>
//                             <p>{msg.content || msg.messages}</p>
//                             {msg.createdAt && (
//                               <p className={`text-xs mt-1 ${msg.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
//                                 {formatTime(msg.createdAt)}
//                               </p>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                   <div ref={chatEndRef} />
//                 </>
//               )}
//             </div>

//             {/* Message Input Area */}
//             <div className="p-4 border-t border-gray-200 flex items-end space-x-3 bg-white">
//               <textarea
//                 ref={textareaRef}
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//                 onKeyDown={handleKeyPress}
//                 placeholder="Type your message here..."
//                 rows={1}
//                 className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-1 focus:ring-gray-300 focus:outline-none"
//               />
//               <button
//                 onClick={handleSendMessage}
//                 disabled={!newMessage.trim() || !isSocketConnected || !currentUserId}
//                 className={`px-6 py-2 rounded-lg transition ${
//                   newMessage.trim() && isSocketConnected && currentUserId
//                     ? "bg-[#7e3af2] text-white hover:bg-[#692de2]"
//                     : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                 }`}
//               >
//                 Send
//               </button>
//             </div>
//           </>
//         ) : (
//           <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
//             <h3 className="text-lg font-medium mb-2">Welcome to Chat</h3>
//             <p className="text-sm text-center max-w-md">
//               {currentUserId
//                 ? "Select a conversation from the left to start chatting"
//                 : "Please wait while loading user data..."}
//             </p>
//             {!currentUserId && !userLoading && (
//               <div className="mt-4 text-xs text-red-500">
//                 Unable to load user data. Please try again.
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;




// responsive one 









/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import pImage from "@/../public/Images/user.jpeg";
import { MdArrowBack } from "react-icons/md";

import { useGetMyProfileQuery } from "@/lib/api/myProfile/settingsApi";
import { useGetAllMessageQuery, useGetMyConversationQuery } from "@/lib/api/chat/chatApi";
import PageLoading from "@/components/ui/Loading";

interface Chat {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
  conversationId: string;
  lastMessage: {
    id: string;
    conversationId: string;
    messages: string;
    senderId: string;
    receiverId: string;
    deletedFor: string[];
    createdAt: string;
    updatedAt: string;
  };
}

interface Message {
  id: string;
  messages: string | null;
  senderId: string;
  receiverId: string;
  isDeleted?: boolean;
  isOwn?: boolean;
  type?: string;
  fileUrl?: string;
  content?: string;
  createdAt?: string;
  conversationId?: string;
}

const socket = io("https://api.ainoviro.com", {
  autoConnect: false,
});

const ChatPage = () => {
  const { data: userData, isLoading: userLoading } = useGetMyProfileQuery();
  const currentUserId = userData?.data?.userId;
  
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { data, isLoading, isError } = useGetMyConversationQuery({});
  
  const { 
    data: previousMessagesData, 
    refetch: refetchPreviousMessages,
    isLoading: isLoadingPreviousMessages 
  } = useGetAllMessageQuery(
    selectedChat?.id, 
    { skip: !selectedChat?.id }
  );

  const sentMessageIds = useRef<Set<string>>(new Set());

  // Auto scroll to bottom when messages change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedChat]);

  // Auto grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newMessage]);

  const handleReceiveMessage = useCallback((msg: Message) => {
    console.log("New message received from socket:", msg);
    
    if (sentMessageIds.current.has(msg.id)) {
      console.log("Duplicate message detected, skipping:", msg.id);
      return;
    }
    
    if (selectedChat && currentUserId) {
      const isForThisConversation = 
        (msg.senderId === currentUserId && msg.receiverId === selectedChat.id) ||
        (msg.senderId === selectedChat.id && msg.receiverId === currentUserId);
      
      if (isForThisConversation) {
        sentMessageIds.current.add(msg.id);
        
        setMessages(prev => {
          const messageExists = prev.some(m => m.id === msg.id);
          if (messageExists) {
            console.log("Message already in array, skipping:", msg.id);
            return prev;
          }
          
          return [...prev, { ...msg, isOwn: msg.senderId === currentUserId }];
        });
      }
    }
  }, [currentUserId, selectedChat]);

  const handleMessageDeletedForMe = useCallback(({ messageId }: { messageId: string }) => {
    console.log("Message deleted for me:", messageId);
    setMessages(prev => prev.filter(m => m.id !== messageId));
    sentMessageIds.current.delete(messageId);
  }, []);

  const handleMessageDeletedForEveryone = useCallback(({ messageId }: { messageId: string }) => {
    console.log("Message deleted for everyone:", messageId);
    setMessages(prev =>
      prev.map(m =>
        m.id === messageId ? { ...m, messages: null, isDeleted: true } : m
      )
    );
    sentMessageIds.current.delete(messageId);
  }, []);

  // Initialize socket connection and listeners
  useEffect(() => {
    if (!currentUserId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("joinRoom", currentUserId);

    socket.on("connect", () => {
      console.log("Socket connected");
      setIsSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsSocketConnected(false);
    });

    socket.on("previousMessages", (msgs: Message[]) => {
      console.log("Received previous messages from socket:", msgs);
      
      sentMessageIds.current.clear();
      
      const formattedMsgs = msgs.map(msg => {
        sentMessageIds.current.add(msg.id);
        return {
          ...msg,
          isOwn: msg.senderId === currentUserId
        };
      });
      setMessages(formattedMsgs);
    });

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("messageDeletedForMe", handleMessageDeletedForMe);
    socket.on("messageDeletedForEveryone", handleMessageDeletedForEveryone);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("previousMessages");
      socket.off("receiveMessage");
      socket.off("messageDeletedForMe");
      socket.off("messageDeletedForEveryone");
    };
  }, [currentUserId, handleReceiveMessage, handleMessageDeletedForMe, handleMessageDeletedForEveryone]);

  // Fetch previous messages from API when a chat is selected
  useEffect(() => {
    if (selectedChat && currentUserId) {
      setMessages([]);
      sentMessageIds.current.clear();
      
      console.log(`Fetching previous messages for user: ${selectedChat.id}`);
      
      refetchPreviousMessages();
      
      if (socket.connected) {
        socket.emit("getMessages", {
          senderId: currentUserId,
          receiverId: selectedChat.id,
        });
      }
    }
  }, [selectedChat, currentUserId, refetchPreviousMessages]);

  // Process and display previous messages from API response
  useEffect(() => {
    if (previousMessagesData?.data?.success && previousMessagesData.data.data) {
      console.log("Previous messages from API:", previousMessagesData.data.data);
      
      sentMessageIds.current.clear();
      
      const apiMessages: Message[] = previousMessagesData.data.data.map((msg: any) => {
        sentMessageIds.current.add(msg.id);
        return {
          id: msg.id,
          messages: msg.messages,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          conversationId: msg.conversationId,
          createdAt: msg.createdAt,
          isOwn: msg.senderId === currentUserId
        };
      });
      
      setMessages(apiMessages);
    }
  }, [previousMessagesData, currentUserId]);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
    setShowSidebar(false); // Mobile এ chat select করলে sidebar hide হবে
    console.log(`Selected chat with ${chat.firstName}`);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !currentUserId) {
      console.error("Cannot send message: missing required data");
      return;
    }

    const messageData = {
      senderId: currentUserId,
      receiverId: selectedChat.id,
      messages: newMessage,
    };

    console.log("Sending message:", messageData);
    socket.emit("sendMessage", messageData);
    
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (userLoading) {
    return <PageLoading/>;
  }

  return (
    <div className="flex h-screen md:h-[calc(100vh-150px)] overflow-hidden">
      {/* Sidebar - Mobile এ conditionally show/hide */}
      <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex w-full md:w-1/4 rounded-none md:rounded-2xl m-0 md:m-2 shadow-sm border-r md:border border-gray-100 flex-col bg-white`}>
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-lg font-semibold">Chatting List</h1>
          <div className="text-xs text-gray-500 mt-1">
            {isSocketConnected ? "🟢 Connected" : "🔴 Disconnected"}
          </div>
        </div>

        {/* <div className="p-3 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-1 focus:ring-gray-300 focus:outline-none"
          />
        </div> */}

        <div className="px-5 pt-3 pb-2 text-sm text-gray-500 font-medium">
          Messages
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-4 text-sm text-gray-500">
              Loading conversations...
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center p-4 text-sm text-red-500">
              Error loading conversations
            </div>
          ) : !data?.data || data.data.length === 0 ? (
            <div className="flex items-center justify-center p-4 text-sm text-gray-500">
              No conversations yet
            </div>
          ) : (
            data.data.map((chat: Chat) => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat)}
                className={`flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${
                  selectedChat?.id === chat.id ? "bg-blue-100/70 rounded-lg mx-2" : ""
                }`}
              >
                <div className="relative">
                  <Image
                    src={chat.profilePic || pImage.src}
                    alt={chat.firstName}
                    width={40}
                    height={40}
                    className="rounded-full h-10 w-10 object-cover"
                  />
                  {isSocketConnected && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium truncate">
                      {chat.firstName} {chat.lastName}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatTime(chat.lastMessage?.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {chat.lastMessage?.messages || "No messages yet"}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area - Mobile এ full screen */}
      <div className={`${!showSidebar ? 'flex' : 'hidden'} md:flex flex-1 flex-col rounded-none md:rounded-2xl m-0 md:m-2 border-l md:border border-gray-100 shadow-sm bg-blue-50/20`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 flex items-center space-x-3 border-b border-gray-200 bg-blue-50 rounded-t-none md:rounded-t-2xl">
              {/* Back button - শুধু mobile এ দেখাবে */}
              <button 
                onClick={() => setShowSidebar(true)}
                className="md:hidden text-gray-600 mr-2 hover:bg-white/50 p-2 rounded-full transition"
                aria-label="Back to conversations"
              >
                <MdArrowBack className="text-xl" />
              </button>
              
              <div className="relative">
                <Image
                  src={selectedChat.profilePic || pImage.src}
                  alt={selectedChat.firstName}
                  width={40}
                  height={40}
                  className="rounded-full h-10 w-10 object-cover"
                />
                {isSocketConnected && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-medium text-sm truncate">
                  {selectedChat.firstName} {selectedChat.lastName}
                </h2>
                <p className="text-xs text-gray-500 truncate">
                  {isSocketConnected ? "Online" : "Offline"} • {selectedChat.email}
                </p>
              </div>
            </div>

            {/* Messages Area - Responsive height */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-3" 
              style={{ maxHeight: 'calc(100vh - 200px)' }}
            >
              {isLoadingPreviousMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <div className="animate-pulse">Loading messages...</div>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <p className="mb-2 text-lg">💬</p>
                    <p className="mb-1">No messages yet</p>
                    <p className="text-sm">Start the conversation!</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-2 text-sm max-w-[85%] sm:max-w-xs md:max-w-md break-words ${
                          msg.isOwn
                            ? "bg-[#7e3af2] text-white rounded-br-none"
                            : "bg-gray-100 text-gray-900 rounded-bl-none"
                        }`}
                      >
                        {msg.isDeleted ? (
                          <span className="italic text-gray-500">
                            This message was deleted
                          </span>
                        ) : msg.type === "image" && msg.fileUrl ? (
                          <Image
                            src={msg.fileUrl}
                            alt="image"
                            width={200}
                            height={200}
                            className="rounded-lg"
                          />
                        ) : msg.type === "file" ? (
                          <a
                            href={msg.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            {msg.content || msg.messages}
                          </a>
                        ) : (
                          <div>
                            <p className="whitespace-pre-wrap">{msg.content || msg.messages}</p>
                            {msg.createdAt && (
                              <p className={`text-xs mt-1 ${msg.isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                                {formatTime(msg.createdAt)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </>
              )}
            </div>

            {/* Message Input Area - Sticky bottom */}
            <div className="p-3 md:p-4 border-t border-gray-100 flex items-end space-x-2 md:space-x-3 bg-blue-50/70 rounded-b-none md:rounded-b-2xl">
              <textarea
                ref={textareaRef}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:ring-1 focus:ring-gray-300 focus:outline-none max-h-32"
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isSocketConnected || !currentUserId}
                className={`px-4 md:px-6 py-2 rounded-lg transition flex-shrink-0 text-sm font-medium ${
                  newMessage.trim() && isSocketConnected && currentUserId
                    ? "bg-[#7e3af2] text-white hover:bg-[#692de2]"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-lg font-medium mb-2">Welcome to Chat</h3>
            <p className="text-sm text-center max-w-md">
              {currentUserId
                ? "Select a conversation from the left to start chatting"
                : "Please wait while loading user data..."}
            </p>
            {!currentUserId && !userLoading && (
              <div className="mt-4 text-xs text-red-500">
                Unable to load user data. Please try again.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;