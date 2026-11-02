"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { X, Circle } from "lucide-react";
import { QuickActions } from "./QuickActions";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { closeChatbot } from "@/store/chatbotSlice";
import bot from "@/assets/home/bot.png";
import Image from "next/image";

export function ChatbotPopup() {
  const isOpen = useSelector((state: RootState) => state.chatbot.isOpen);
  //   const isOnline = useSelector((state: RootState) => state.chatbot.isOnline)
  const messages = useSelector((state: RootState) => state.chatbot.messages);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-sm h-[600px] flex flex-col bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
              {/* <div className="w-6 h-6 text-white">💬</div> */}
              <Image src={bot} alt="Bot" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Hi There</h3>
              <div className="flex items-center gap-1 text-xs text-gray-300">
                <Circle className="w-2 h-2 fill-green-500 text-green-500" />
                <span>We reply immediately</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => dispatch(closeChatbot())}
            className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close chatbot"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 overflow-y-auto">
              <div className="text-center text-gray-600 text-sm py-8 px-4">
                <p className="font-medium text-gray-800 mb-2">Hi There</p>
                <p className="text-xs mb-4">
                  Hello. I&apos;m Noviro Bot. What can I do for you today?
                </p>
                <p className="text-xs mb-2">
                  You can click the common FAQs below.
                </p>
                <p className="text-xs">Or ask us short question directly.</p>
              </div>
              <QuickActions />
            </div>
          ) : (
            <>
              <MessageList />
              <QuickActions />
            </>
          )}
        </div>

        {/* Input Area */}
        <MessageInput />
      </div>
    </div>
  );
}
