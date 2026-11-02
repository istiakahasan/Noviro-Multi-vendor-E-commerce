

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";
import pImage from "@/../public/user.jpeg";
import { MdArrowBack } from "react-icons/md";
import { useGetAllMessageQuery, useGetMyConversationQuery } from "@/redux/features/chat/chatApi";
import PageLoading from "@/components/shared/PageLoading";
import { useGetUserQuery } from "@/redux/features/user/userApi";

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
  const { data: userData, isLoading: userLoading } = useGetUserQuery();
  const currentUserId = userData?.data?.id;
  
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const { data, isLoading, isError } = useGetMyConversationQuery();
  
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
                    className="rounded-full w-10 h-10 object-cover"
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
                  className="rounded-full w-10 h-10 object-cover"
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
                            className="rounded-lg "
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