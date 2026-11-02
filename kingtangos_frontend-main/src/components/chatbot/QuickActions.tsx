"use client";

// import { useDispatch } from "react-redux";
// import { ChevronRight } from "lucide-react";
// import { addMessage } from "@/store/chatbotSlice";

// const QUICK_ACTIONS = [
//   { id: 1, label: "Track my order", icon: "📦" },
//   { id: 2, label: "Installation manual", icon: "📖" },
//   { id: 3, label: "Product specifications", icon: "⚙️" },
//   { id: 4, label: "Cancel my order", icon: "❌" },
//   { id: 5, label: "Damaged/Wrong item", icon: "⚠️" },
// ];

export function QuickActions() {
  // const dispatch = useDispatch();

  // const handleQuickAction = (label: string) => {
  //   const message = {
  //     id: `msg-${Date.now()}`,
  //     text: label,
  //     sender: "user" as const,
  //     timestamp: Date.now(),
  //   };
  //   dispatch(addMessage(message));

  //   // Simulate bot response
  //   setTimeout(() => {
  //     const botMessage = {
  //       id: `msg-${Date.now()}-bot`,
  //       text: `${label}. How can I help you with this?`,
  //       sender: "bot" as const,
  //       timestamp: Date.now(),
  //     };
  //     dispatch(addMessage(botMessage));
  //   }, 500);
  // };

  return (
    <div className="space-y-2 px-4 py-3 bg-white">
      {/* {QUICK_ACTIONS.map((action) => (
        <button
          key={action.id}
          onClick={() => handleQuickAction(action.label)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-800 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
        >
          <span>{action.label}</span>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      ))} */}
    </div>
  );
}
