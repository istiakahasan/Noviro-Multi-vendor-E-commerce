import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import NextAuthSessionProvider from "@/lib/NextAuthSessionProvider";
import ReduxProvider from "@/redux/ReduxProvider";
import { ChatbotWrapper } from "@/components/ui/ChatbotWrapper";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  icons: "/icon.png",
  title: "Noviro",
  description: "Multi-vendor E-commerce website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>
        <Toaster position="bottom-right" richColors />
          <NextAuthSessionProvider>
            <ReduxProvider>{children}
              <ChatbotWrapper />
            </ReduxProvider>
            
          </NextAuthSessionProvider>
      </body>
    </html>
  );
}

