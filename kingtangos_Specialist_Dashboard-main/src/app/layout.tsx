
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";

// Load Roboto font
const roboto = Roboto({
  weight: ["400", "500", "700"], // regular, medium, bold
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Noviro Specialist",
  description: "Ai noviro Specialist Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} font-sans antialiased`}>
          {/* <ProtectedWrapper> */}
        <Providers>

        {children}
        <Toaster 
          position="top-right" 
          richColors 
          closeButton 
          />
        </Providers>
          {/* </ProtectedWrapper> */}
      </body>
    </html>
  );
}
