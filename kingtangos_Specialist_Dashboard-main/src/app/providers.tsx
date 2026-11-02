// 'use client';

// import {  ReactNode } from 'react';
// import { store } from '@/store';
// import { Provider } from 'react-redux';

// interface ProvidersProps {
//   children: ReactNode;
// }

// export function Providers({ children }: ProvidersProps) {
//   return <Provider store={store}>{children}</Provider>;
// }



"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import Loading from "@/components/ui/Loading";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading/>} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
