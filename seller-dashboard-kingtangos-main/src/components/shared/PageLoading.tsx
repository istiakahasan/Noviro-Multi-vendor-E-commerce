"use client";

import { useEffect, useState } from "react";
import { LineSpinner } from "ldrs/react"; // React wrapper

export default function PageLoading() {
  const [loadingText, setLoadingText] = useState("Loading");

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) =>
        prev === "Loading..." ? "Loading" :
        prev === "Loading.." ? "Loading..." :
        prev === "Loading." ? "Loading.." : "Loading."
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background">
      <div className="w-24 h-24 md:w-28 md:h-28 grid place-items-center text-primary">
        {/* ✅ Just use the React component */}
        <LineSpinner size="40" stroke="3" speed="1" color="black" />
      </div>

      <p className="text-xl font-medium mt-4 text-primary min-w-[100px] text-center">
        {loadingText}
      </p>
    </div>
  );
}
