// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import Image from "next/image";
// import { useEffect, useRef, useState, useCallback } from "react";
// import { io } from "socket.io-client";
// import pImage from "@/../public/Images/user.jpeg";

// import { useGetMyProfileQuery } from "@/lib/api/myProfile/settingsApi";
// import { useGetAllMessageQuery, useGetMyConversationQuery } from "@/lib/api/chat/chatApi";


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
//       <div className="flex flex-col md:flex-row h-[calc(100vh-150px)]">
//         <div className="flex items-center justify-center w-full h-full">
//           <p className="text-gray-500">Loading user data...</p>
//         </div>
//       </div>
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
//             <div className="p-4 flex items-center space-x-3 border-b border-gray-200 sticky top-0 bg-white z-10">
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



'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the specialist dashboard communication page
    router.push('/specialist-dashboard/communication');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
};

export default Page;