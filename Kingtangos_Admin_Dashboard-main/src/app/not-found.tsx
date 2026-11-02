"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-background text-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="space-y-6"
      >
        {/* Heading */}
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl">
          404 – Page Not Found
        </h1>

        {/* Subtext */}
        <p className="text-lg text-muted-foreground leading-relaxed">
          Oops! The page you’re looking for doesn’t exist or is currently under construction.  
          Let’s get you back on track.
        </p>

        {/* Animation (2x bigger now) */}
        <div className="flex justify-center">
          <iframe
            className="w-[400px] h-[400px] md:w-[500px] md:h-[500px] lg:w-[700px] lg:h-[700px]" // ← increased size here
            src="https://lottie.host/embed/f1e3ffdc-e9e7-4ca0-9061-40e7d85f9f37/1AxxteJXFw.lottie"
          ></iframe>
        </div>

        {/* Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="pt-4"
        >
          <Button asChild size="lg" className="rounded-full">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Back to Home
            </Link>
          </Button>
        </motion.div>

        {/* Footer message */}
        <p className="text-sm text-muted-foreground mt-8">
          © {new Date().getFullYear()}  <Image src="/logo-without-name.png" alt="Logo" className="inline" width={16} height={16} /> noviro. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
