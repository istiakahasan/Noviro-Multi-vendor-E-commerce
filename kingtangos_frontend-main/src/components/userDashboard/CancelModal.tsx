import React from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { Button } from '../ui/button';
interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void; // renamed from onConfirmCancel → clearer
  onBack?: () => void;
  isLoading?: boolean; // NEW: show loading state
}
export default function CancelModal({
  isOpen,
  onClose,
  onConfirm,
  onBack,
  isLoading = false,
}: CancelModalProps) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 md:p-8 w-full max-w-md shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Back button (optional) */}
        {onBack && (
          <button
            onClick={onBack}
            className="absolute top-5 left-5 text-gray-600 hover:text-gray-900 text-xl"
            aria-label="Go back"
          >
            <FaArrowLeft />
          </button>
        )}
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-normal"
          aria-label="Close"
          disabled={isLoading}
        >
          ×
        </button>
        <div className="text-center mt-6 mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
            Cancel Appointment?
          </h2>
          <p className="text-gray-600 mb-3">
            If you just want to change the time, consider rescheduling instead.
          </p>
          <p className="text-gray-600 font-medium">
            Are you sure you want to cancel this booking?
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Button
            variant="destructive" // ← use red/danger variant if your UI library has it
            className="w-full py-6 text-base font-medium"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Cancelling...
              </span>
            ) : (
              "Yes, Cancel Booking"
            )}
          </Button>
          <Button
            variant="outline"
            className="w-full py-6 text-base"
            onClick={onClose}
            disabled={isLoading}
          >
            No, Keep Booking
          </Button>
        </div>
      </div>
    </div>
  );
}