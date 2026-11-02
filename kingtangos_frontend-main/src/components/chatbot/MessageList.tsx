"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useRef } from "react";

export function MessageList() {
  const messages = useSelector((state: RootState) => state.chatbot.messages);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function formatBotText(text: string) {
    return (
      text
        // bold **text**
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        // bold text inside quotes
        .replace(/"([^"]+)"/g, "<strong>$1</strong>")
        // bold prices like $667 or $667.00
        .replace(/\$[0-9]+(\.[0-9]{1,2})?/g, "<strong>$&</strong>")
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 text-sm py-8">
          <p className="font-medium mb-2">Hi There</p>
          <p className="text-xs">
            Hello. I&apos;m Noviro Bot. What can I do for your today?
          </p>
          <p className="text-xs mt-1">You can click the common FAQs below.</p>
          <p className="text-xs mt-1">Or ask us short question directly.</p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {/* <p className="text-sm">{message.text}</p> */}

                <p
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html:
                      message.sender === "bot"
                        ? formatBotText(message.text)
                        : message.text,
                  }}
                ></p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
