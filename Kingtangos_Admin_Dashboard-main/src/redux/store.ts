// import { configureStore } from "@reduxjs/toolkit";
// import { setupListeners } from "@reduxjs/toolkit/query";
// import { baseApi } from "./api/baseApi";
// import uiReducer from "@/lib/uiSlice";

// // Configure the Redux store
// export const store = configureStore({
//   reducer: {
  

//     // UI slice (sidebar, responsive flags)
//     ui: uiReducer,

//     // API slice
//     [baseApi.reducerPath]: baseApi.reducer,
//   },


//   // Enable Redux DevTools in development
//   devTools: process.env.NODE_ENV !== "production",
// });

// // Enable listener behavior for refetchOnFocus/refetchOnReconnect
// setupListeners(store.dispatch);

// // Export store types for TypeScript
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// // Store type for use in other files
// export type Store = typeof store;



import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "./api/baseApi";
import uiReducer from "@/lib/uiSlice";
import { storeContentApi } from "./features/store-content/storeContentApi";

// Configure the Redux store
export const store = configureStore({
  reducer: {
    // UI slice
    ui: uiReducer,

    // API slice
    [baseApi.reducerPath]: baseApi.reducer,
  },

  // ✅ RTK Query middleware যোগ করা
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),

  devTools: process.env.NODE_ENV !== "production",
});

// Enable listener behavior for refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch);

// Export store types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type Store = typeof store;
