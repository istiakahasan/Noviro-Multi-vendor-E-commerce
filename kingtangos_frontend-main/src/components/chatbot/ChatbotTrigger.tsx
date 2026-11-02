"use client";

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@/store";
// import { MessageCircle } from "lucide-react";
import { toggleChatbot } from "@/store/chatbotSlice";
import Image from "next/image";
import bot from "@/assets/home/bot.png";

export function ChatbotTrigger() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.chatbot.isOpen);

  return (
    <button
      onClick={() => dispatch(toggleChatbot())}
      className={`fixed bottom-6 right-6 z-40 flex items-center justify-center w-16 h-16 rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
        isOpen
          ? "bg-gray-700 hover:bg-gray-800"
          : "bg-gray-800 hover:bg-gray-900"
      }`}
      aria-label="Toggle chatbot"
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center">
        <Image src={bot} alt="Bot" className="w-6 h-6 text-white" />
      </div>
    </button>
  );
}
