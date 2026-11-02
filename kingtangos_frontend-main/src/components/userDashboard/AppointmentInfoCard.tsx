import React from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { LuCalendarDays } from "react-icons/lu"

interface AppointmentInfoCardProps {
  infoImage: string
  confirmationStatus: string
  dateLabel: string
  duration: string
  serviceName: string
  servicePrice: string
  totalPrice: string
  importantInfo: string
  onManageClick: () => void
}

const AppointmentInfoCard: React.FC<AppointmentInfoCardProps> = ({
  infoImage,
  confirmationStatus,
  dateLabel,
  duration,
  serviceName,
  servicePrice,
  totalPrice,
  importantInfo,
  onManageClick,
}) => {
  return (
    <div className="bg-white rounded-2xl max-w-xl">
      <Image src={infoImage} alt="Important Info" height={349} width={580} />

      <div className="p-10">
        <Button className="bg-[#0066FF] hover:bg-[#0066FF]/85 px-7">
          {confirmationStatus}
        </Button>

        <h3 className="font-semibold py-3 text-3xl text-primary">{dateLabel}</h3>
        <p className="text-primary">{duration}</p>

        <div
          className="flex items-center my-5 gap-3 bg-text/15 p-5 rounded-xl cursor-pointer"
          onClick={onManageClick}
        >
          <LuCalendarDays className="text-2xl text-[#0066FF]" />
          <div>
            <p className="text-primary font-semibold">Manage booking</p>
            <p>Reschedule or cancel your appointment</p>
          </div>
        </div>

        <div className="flex justify-between border-b pb-4">
          <p className="text-primary font-semibold">{serviceName}</p>
          <p className="text-primary font-semibold">{servicePrice}</p>
        </div>

        <div className="flex justify-between border-t pt-4">
          <p className="text-primary font-semibold">Total</p>
          <p className="text-primary font-semibold">{totalPrice}</p>
        </div>

        <h4 className="text-2xl font-semibold text-primary pt-6">Important info</h4>
        <p className="text-text">{importantInfo}</p>
      </div>
    </div>
  )
}

export default AppointmentInfoCard
