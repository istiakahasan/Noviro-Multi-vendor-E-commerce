// "use client";

// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/store";
// import { Send } from "lucide-react";
// import { addMessage, setLoading } from "@/store/chatbotSlice";
// import { useCreateAiSendMessageMutation } from "@/redux/api/chat/aiChatApi";
// // import { useAuth } from "@/redux/hooks/useAuth";
// // import { toast } from "sonner";

// export function MessageInput() {
//   const [input, setInput] = useState("");
//   const dispatch = useDispatch();
//   const isLoading = useSelector((state: RootState) => state.chatbot.isLoading);
//   // const { isAuthenticated } = useAuth();

//   const [createAiSendMessage] = useCreateAiSendMessageMutation();

//   const handleSendMessage = async () => {
//     // if (!isAuthenticated) {
//     //   toast.error("You are not authorized. Please login first.");
//     //   return;
//     // }

//     if (!input.trim()) return;

//     const userMessage = {
//       id: `msg-${Date.now()}`,
//       text: input,
//       sender: "user" as const,
//       timestamp: Date.now(),
//     };

//     dispatch(addMessage(userMessage));
//     setInput("");
//     dispatch(setLoading(true));

//     try {
//       const res = await createAiSendMessage({ message: input }).unwrap();

//       const botMessage = {
//         id: `msg-${Date.now()}-bot`,
//         text:
//           res?.data?.botMessage ||
//           "Thank you for your message. We will get back to you soon.",
//         sender: "bot" as const,
//         timestamp: Date.now(),
//       };

//       dispatch(addMessage(botMessage));
//     } catch (error) {
//       console.error("AI error:", error);

//       dispatch(
//         addMessage({
//           id: `msg-${Date.now()}-bot`,
//           text: "Sorry, something went wrong. Please try again.",
//           sender: "bot" as const,
//           timestamp: Date.now(),
//         }),
//       );
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="p-4 bg-white border-t border-gray-200">
//       <div className="flex items-center gap-2">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyPress={handleKeyPress}
//           placeholder="Enter your message"
//           disabled={isLoading}
//           className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/90 disabled:bg-gray-100"
//         />

//         {/* <button className="p-2 text-gray-500">
//           <Smile className="w-5 h-5" />
//         </button>

//         <button className="p-2 text-gray-500">
//           <Paperclip className="w-5 h-5" />
//         </button> */}

//         {/* <button
//           onClick={handleSendMessage}
//           disabled={isLoading || !input.trim()}
//           className="p-2 text-blue-500 hover:text-blue-700 disabled:text-gray-300"
//         >
//           <Send className="w-5 h-5" />
//         </button> */}

//         <button
//           type="button"
//           onClick={handleSendMessage}
//           disabled={isLoading || !input.trim()}
//           className="p-2 text-blue-500 hover:text-blue-700 disabled:text-gray-300"
//         >
//           <Send className="w-5 h-5" />
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { addMessage, setLoading } from "@/store/chatbotSlice";
// import { addMessage, setLoading } from "@/redux/slices/chatbotSlice";

export function MessageInput() {
  const [input, setInput] = useState("");
  const dispatch = useDispatch();
  const isLoading = useSelector((state: RootState) => state.chatbot.isLoading);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      text: input,
      sender: "user" as const,
      timestamp: Date.now(),
    };

    dispatch(addMessage(userMessage));
    setInput("");
    dispatch(setLoading(true));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_AI_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const data = await res.json();
      console.log("AI response:", data);

      const botText =
        data?.response ||
        "Thank you for your message. We will get back to you soon.";

      const botMessage = {
        id: `msg-${Date.now()}-bot`,
        text: botText,
        sender: "bot" as const,
        timestamp: Date.now(),
      };

      // console.log("botMessage:", data?.data?.botMessage);

      dispatch(addMessage(botMessage));
    } catch (error) {
      console.error("AI error:", error);

      dispatch(
        addMessage({
          id: `msg-${Date.now()}-bot`,
          text: "Sorry, something went wrong. Please try again.",
          sender: "bot" as const,
          timestamp: Date.now(),
        }),
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your message"
          disabled={isLoading}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/90 disabled:bg-gray-100"
        />

        <button
          type="button"
          onClick={handleSendMessage}
          disabled={isLoading || !input.trim()}
          className="p-2 text-blue-500 hover:text-blue-700 disabled:text-gray-300"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
