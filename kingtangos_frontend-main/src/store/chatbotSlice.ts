import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: number
}

interface ChatbotState {
  isOpen: boolean
  messages: Message[]
  isLoading: boolean
  isOnline: boolean
}

const initialState: ChatbotState = {
  isOpen: false,
  messages: [],
  isLoading: false,
  isOnline: true,
}

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    toggleChatbot: (state) => {
      state.isOpen = !state.isOpen
    },
    openChatbot: (state) => {
      state.isOpen = true
    },
    closeChatbot: (state) => {
      state.isOpen = false
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload
    },
    clearMessages: (state) => {
      state.messages = []
    },
  },
})

export const {
  toggleChatbot,
  openChatbot,
  closeChatbot,
  addMessage,
  setLoading,
  setOnlineStatus,
  clearMessages,
} = chatbotSlice.actions

export default chatbotSlice.reducer
