"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, isBefore, startOfToday } from "date-fns"; // Added isBefore, startOfToday, parse for validation
import { ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";
interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (date: Date, time: string, reason: string) => void;
  onDateSelect: (date: Date) => void;
  isLoading?: boolean; // Added for loading state
}
export function AppointmentBookingCalendarUser({
  isOpen,
  onClose,
  onComplete,
  onDateSelect,
  isLoading = false,
}: CalendarModalProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = React.useState<string>("10:30");
  const [reason, setReason] = React.useState<string>("");
  const [popoverOpen, setPopoverOpen] = React.useState(false);
  const handleDateSelect = (date: Date | undefined) => {
    if (date && isBefore(date, startOfToday())) {
      toast.error("Cannot select past dates.");
      return;
    }
    setSelectedDate(date);
    setPopoverOpen(false);
    if (date) {
      onDateSelect(date);
    }
  };
  const handleConfirm = () => {
    if (!selectedDate || !selectedTime || !reason.trim()) {
      toast.error("Please select a date, time, and provide a reason.");
      return;
    }
    if (isBefore(selectedDate, startOfToday())) {
      toast.error("Cannot reschedule to a past date.");
      return;
    }
    onComplete(selectedDate, selectedTime, reason);
  };
  const isConfirmDisabled = !selectedDate || !selectedTime || !reason.trim() || isLoading;
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[400px] p-0 gap-0 bg-white rounded-3xl border-0 shadow-2xl max-w-[90vw]">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-primary">Reschedule Appointment</h2>
          <FieldGroup className="mx-auto max-w-xs flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-4">
              <Field className="flex-1">
                <FieldLabel htmlFor="date-picker">Date</FieldLabel>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      id="date-picker"
                      className="w-full justify-between font-normal"
                      aria-label="Select date"
                    >
                      {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                      <ChevronDownIcon data-icon="inline-end" className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto max-w-full overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      captionLayout="dropdown"
                      defaultMonth={selectedDate}
                      onSelect={handleDateSelect}
                      className="w-full"
                      disabled={(date) => isBefore(date, startOfToday())} // Disable past dates
                    />
                  </PopoverContent>
                </Popover>
              </Field>
              <Field className="flex-1">
                <FieldLabel htmlFor="time-picker">Time</FieldLabel>
                <Input
                  type="time"
                  id="time-picker"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none w-full"
                  aria-label="Select time"
                />
              </Field>
            </div>
            <Field className="flex-1">
              <FieldLabel htmlFor="reason">Reason for Reschedule</FieldLabel>
              <Input
                type="text"
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason here"
                className="w-full"
              />
            </Field>
          </FieldGroup>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="px-3 py-1 sm:px-4 sm:py-2" disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="px-3 py-1 sm:px-4 sm:py-2" disabled={isConfirmDisabled}>
              {isLoading ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}