// "use client";

// import { useEffect, useState } from "react";
// import { LineSpinner } from "ldrs/react"; // React wrapper

// export default function PageLoading() {
//   const [loadingText, setLoadingText] = useState("Loading");

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setLoadingText((prev) =>
//         prev === "Loading..." ? "Loading" :
//         prev === "Loading.." ? "Loading..." :
//         prev === "Loading." ? "Loading.." : "Loading."
//       );
//     }, 500);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="fixed inset-0 flex flex-col items-center justify-center bg-background">
//       <div className="w-24 h-24 md:w-28 md:h-28 grid place-items-center text-primary">
//         {/* ✅ Just use the React component */}
//         <LineSpinner size="40" stroke="3" speed="1" color="black" />
//       </div>

//       <p className="text-xl font-medium mt-4 text-primary min-w-[100px] text-center">
//         {loadingText}
//       </p>
//     </div>
//   );
// }











"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

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
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white text-center">
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
          src="/logo-without-name.png"
          alt="Noviro Logo"
          width={140}
          height={140}
          className="relative object-contain z-10"
          priority
        />
      </motion.div>

      {/* 🟢 Animated Loading Text with Color Transition */}
      {/* <motion.p
        className="text-lg font-semibold mt-6 tracking-wide"
        animate={{ color: ["#9E9E9E", "#EEEEEE"] }} // dark → light
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
        }}
      >
        {loadingText}
      </motion.p> */}
    </div>
  );
}
