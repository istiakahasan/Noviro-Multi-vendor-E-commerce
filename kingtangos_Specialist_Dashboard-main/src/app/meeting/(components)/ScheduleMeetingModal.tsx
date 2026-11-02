"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScheduleMeetingModal({
  isOpen,
  onClose,
}: ScheduleMeetingModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  function generateRandomChannelName() {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    const getPart = (length: number) =>
      Array.from(
        { length },
        () => chars[Math.floor(Math.random() * chars.length)],
      ).join("");

    return `${getPart(4)}-${getPart(5)}-${getPart(3)}`;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) {
      toast.error("Please fill in all fields.");
      return;
    }

    setIsScheduling(true);
    try {
      const channelName = generateRandomChannelName();
      const startDate = new Date(`${date}T${time}`);
      const startTime = startDate.toISOString();

      const link = `${window.location.origin}/meeting/${channelName}?start=${startTime}`;
      setGeneratedLink(link);
      toast.success("Meeting link generated successfully!");
    } catch (err: any) {
      console.error("Schedule error:", err);
      toast.error("Failed to generate meeting link.");
    } finally {
      setIsScheduling(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  const resetAndClose = () => {
    setTitle("");
    setDate("");
    setTime("");
    setGeneratedLink("");
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter">
            Schedule Meeting
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">
            Set a time and title for your upcoming session.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {!generatedLink ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="title"
                  className="text-xs font-black uppercase tracking-widest text-slate-500"
                >
                  Meeting Title
                </Label>
                <Input
                  id="title"
                  placeholder="Project Sync / Client Consultation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="rounded-xl border-slate-200 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="date"
                    className="text-xs font-black uppercase tracking-widest text-slate-500"
                  >
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="rounded-xl border-slate-200"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="time"
                    className="text-xs font-black uppercase tracking-widest text-slate-500"
                  >
                    Time
                  </Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="rounded-xl border-slate-200"
                  />
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="rounded-xl border-slate-200 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isScheduling}
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs h-10 px-6"
                >
                  {isScheduling ? "Generating..." : "Generate Link"}
                </Button>
              </DialogFooter>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Generated Meeting Link
                </Label>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={generatedLink}
                    className="rounded-xl border-slate-200 bg-slate-50 text-xs"
                  />
                  <Button
                    onClick={copyToClipboard}
                    className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Share this link with participants. The meeting will start at the
                scheduled time.
              </p>
              <DialogFooter className="pt-4">
                <Button
                  onClick={resetAndClose}
                  className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs h-10"
                >
                  Done
                </Button>
              </DialogFooter>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
