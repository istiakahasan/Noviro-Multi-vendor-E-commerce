/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
 
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import logo from "@/assets/logo-without-name.png"
 
export default function PageLoading() {
  const [loadingText, setLoadingText] = useState("Loading.");
 
  // Animate dots
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === "Loading.....") return "Loading.";
        return prev + ".";
      });
    }, 400);
 
    return () => clearInterval(interval);
  }, []);
 
  return (
    <div className="fixed inset-0 flex z-40  flex-col items-center justify-center bg-background text-center">
      {/* 🔵 Logo Pulse Animation */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{
          duration: 1.8,
          ease: "easeInOut",
          repeat: Infinity,
        }}
        className="relative"
      >
        <motion.div
          className="absolute inset-0 rounded-full blur-2xl bg-primary/30"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <Image
          src={logo}
          alt="Noviro Logo"
          width={140}
          height={140}
          className="relative object-contain z-10"
          priority
        />
      </motion.div>


    </div>
  );
}