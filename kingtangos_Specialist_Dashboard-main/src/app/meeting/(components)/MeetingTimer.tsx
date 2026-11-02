"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface MeetingTimerProps {
  startTime?: string | number;
  onEnd?: () => void;
}

export default function MeetingTimer({ startTime, onEnd }: MeetingTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = startTime
      ? typeof startTime === "string"
        ? new Date(startTime.replace("Z", "")).getTime()
        : new Date(startTime).getTime()
      : Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.floor((now - start) / 1000);
      setElapsed(diff > 0 ? diff : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hrs > 0 ? String(hrs).padStart(2, "0") : null,
      String(mins).padStart(2, "0"),
      String(secs).padStart(2, "0"),
    ]
      .filter(Boolean)
      .join(":");
  };

  return (
    <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
      <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500 animate-pulse" />
      <span className="text-xs md:text-sm font-mono font-black text-slate-900 tabular-nums">
        {formatTime(elapsed)}
      </span>
    </div>
  );
}
