"use client";

import { CalendarPlus, Loader2, Video } from "lucide-react";
import ScheduleMeetingModal from "./(components)/ScheduleMeetingModal";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Logo from "@/assets/logo.png";

export default function MeetingLandingPage() {
  const router = useRouter();
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [joinChannel, setJoinChannel] = useState(""); // for join input
  const [error, setError] = useState<string | null>(null);

  function generateRandomChannelName() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const getPart = (length: number) =>
      Array.from(
        { length },
        () => chars[Math.floor(Math.random() * chars.length)],
      ).join("");

    return `${getPart(4)}-${getPart(5)}-${getPart(3)}`;
  }

  const createMeeting = () => {
    setIsCreating(true);
    setError(null);
    try {
      const channelName = generateRandomChannelName();
      // console.log("Creating meeting channel:", channelName);
      const startTime = new Date().toISOString();
      router.push(`/meeting/${channelName}?start=${startTime}`);
    } catch (err: unknown) {
      console.error("Create meeting error:", err);
      setError("Failed to create meeting. Please try again.");
      setIsCreating(false);
    }
  };

  const joinMeeting = () => {
    if (!joinChannel.trim()) {
      setError("Please enter a valid channel name.");
      return;
    }
    router.push(`/meeting/${joinChannel.trim()}`);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-10">
          <Link
            href={"/"}
            className="inline-flex items-center justify-center "
          >
            <Image
              src={Logo}
              alt="Logo"
              className="p-2"
              width={200}
              height={100}
            />
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="max-w-md mx-auto space-y-4">
          {/* Start New Meeting */}
          <button
            onClick={createMeeting}
            disabled={isCreating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Meeting...
              </>
            ) : (
              <>
                <Video className="w-5 h-5" />
                Start New Meeting
              </>
            )}
          </button>

          {/* Schedule Meeting */}
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition"
          >
            <CalendarPlus className="w-5 h-5" />
            Schedule Meeting
          </button>

          {/* Join Meeting */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter channel name"
              value={joinChannel}
              onChange={(e) => setJoinChannel(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={joinMeeting}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 rounded-lg transition"
            >
              Join
            </button>
          </div>
        </div>
      </div>
      <ScheduleMeetingModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />
    </div>
  );
}
