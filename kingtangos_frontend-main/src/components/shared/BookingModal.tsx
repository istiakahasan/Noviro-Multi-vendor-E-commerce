/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Service } from "@/types/serviceDetails.type";
import { MdOutlineBusinessCenter, MdOutlineTimer } from "react-icons/md";
import { useAuth } from "@/redux/hooks/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  service: Service | null;
}

export default function BookingModal({
  open,
  onClose,
  service,
}: BookingModalProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const specialistId = service?.specialists.map((specialist) => specialist.id);

  if (!service) return null;

  const handleAddBooking = () => {
    if (!isAuthenticated) {
      const currentPath = window.location.pathname;
      sessionStorage.setItem("redirectAfterLogin", currentPath);
      toast.error("Please login to book a service");
      router.push("/login");
      return;
    }
    window.location.href = `/service/${service.id}/service-professional`;
  };

  const fullText = service.description || "";
  const shortText =
    fullText.length > 120 ? fullText.slice(0, 120) + "..." : fullText;

  const toggleDescription = () => setIsExpanded(!isExpanded);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-primary">{service.name}</DialogTitle>

          {fullText && (
            <DialogDescription className="text-text">
              {isExpanded ? fullText : shortText}
              {fullText.length > 120 && (
                <button
                  onClick={toggleDescription}
                  className="text-primary underline text-sm ml-1"
                >
                  {isExpanded ? "Show less" : "Show more"}
                </button>
              )}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-primary text-2xl font-semibold">
            ${service.price}
          </p>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <MdOutlineBusinessCenter className="text-xl text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Service Mode</p>
              <p className="text-gray-900 font-medium">
                {service?.serviceMode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <MdOutlineTimer className="text-xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="text-gray-900 font-medium">{service.duration}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleAddBooking} className="py-5 bg-primary">
            Add Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
