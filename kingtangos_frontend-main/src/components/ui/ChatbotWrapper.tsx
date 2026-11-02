'use client'

import { ChatbotPopup } from "../chatbot/ChatbotPopup"
import { ChatbotTrigger } from "../chatbot/ChatbotTrigger"




export function ChatbotWrapper() {
  return (
    <>
      <ChatbotTrigger />
      <ChatbotPopup />
    </>
  )
}
