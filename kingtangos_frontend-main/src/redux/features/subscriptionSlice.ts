// redux/features/subscriptionSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SubscriptionState {
  paymentIntentId: string | null;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  paymentMethodId: string | null;
  latest_invoice: string | null;
}

const initialState: SubscriptionState = {
  paymentIntentId: null,
  stripeSubscriptionId: null,
  stripeCustomerId: null,
  paymentMethodId: null,
  latest_invoice: null,
};

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState,
  reducers: {
    setSubscription: (
      state,
      action: PayloadAction<Partial<SubscriptionState>>,
    ) => {
      console.log("Redux: Setting subscription state:", action.payload);
      return { ...state, ...action.payload };
    },
    clearSubscription: () => {
      console.log("Redux: Clearing subscription state");
      return initialState;
    },
  },
});

export const { setSubscription, clearSubscription } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
