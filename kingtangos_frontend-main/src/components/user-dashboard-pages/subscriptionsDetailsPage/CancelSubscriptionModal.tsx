import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa6";

interface CancelSubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void; // Keeps reason as argument, but now optional in UI
  onBack?: () => void;
  isLoading?: boolean;
}

export default function CancelSubscriptionModal({
  isOpen,
  onClose,
  onConfirm,
  onBack,
  isLoading = false,
}: CancelSubModalProps) {
  // const [reason, setReason] = useState(""); // State for cancellation reason (optional)
  const isConfirmDisabled = isLoading; // No longer disable if no reason

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!isConfirmDisabled) {
      onConfirm(""); // Pass empty string as reason since it's optional
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-modal-title"
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
            disabled={isLoading}
          >
            <FaArrowLeft />
          </button>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-normal"
          aria-label="Close cancel modal"
          disabled={isLoading}
        >
          ×
        </button>

        <div className="text-center mt-6 mb-6">
          <h2
            id="cancel-modal-title"
            className="text-xl md:text-2xl font-semibold text-gray-800 mb-4"
          >
            Cancel Subscription?
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="destructive"
            className="w-full py-6 text-base font-medium"
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
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
              "Yes, Cancel Subscription"
            )}
          </Button>

          <Button
            variant="outline"
            className="w-full py-6 text-base"
            onClick={onClose}
            disabled={isLoading}
          >
            No, Keep Subscription
          </Button>
        </div>
      </div>
    </div>
  );
}
