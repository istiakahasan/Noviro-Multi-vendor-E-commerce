// import { combineReducers } from "@reduxjs/toolkit";
// import { baseApi } from "../api/baseApi";
// import authReducer from "@/redux/features/authSlice";

// const rootReducer = combineReducers({
//   [baseApi.reducerPath]: baseApi.reducer,
//   auth: authReducer,
// });

// export default rootReducer;

import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";

// Feature slices
import authReducer from "@/redux/features/authSlice";
import cartReducer from "@/redux/features/cart/cartSlice"; // Adjust path if needed
import subscriptionReducer from "@/redux/features/subscriptionSlice"; // 👈 NEW
import chatbotReducer from "@/store/chatbotSlice";
import notificationReducer from "@/redux/features/notificationSlice"

const rootReducer = combineReducers({
  // RTK Query API reducer
  [baseApi.reducerPath]: baseApi.reducer,

  // Feature reducers
  auth: authReducer,
  cart: cartReducer,
  subscription: subscriptionReducer, // 👈 Added subscription slice
  chatbot: chatbotReducer,
  notifications: notificationReducer,
});

export default rootReducer;
