"use client"
import React, { useState } from 'react'
import CancelModal from './CancelModal'
// import ManageBookingModal from './ManageBookingModal'
import AppointmentInfoCard from './AppointmentInfoCard'

interface AppointmentDetailsCardProps {
    infoImage: string
    confirmationStatus: string
    dateLabel: string
    duration: string
    serviceName: string
    servicePrice: string
    totalPrice: string
    importantInfo: string
}

export default function ServiceAppointmentDetailsCard({
    infoImage,
    confirmationStatus,
    dateLabel,
    duration,
    serviceName,
    servicePrice,
    totalPrice,
    importantInfo,
}: AppointmentDetailsCardProps) {
    const [, setIsManageModalOpen] = useState(false)
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)

    const openManageModal = () => setIsManageModalOpen(true)
    // const closeManageModal = () => setIsManageModalOpen(false)

    // const openCancelModal = () => {
    //     closeManageModal()
    //     setIsCancelModalOpen(true)
    // }
    const closeCancelModal = () => setIsCancelModalOpen(false)

    const handleCancelConfirm = () => {
        // Your cancel booking logic here
        alert('Booking cancelled!')
    }

    const handleBackFromCancel = () => {
        setIsCancelModalOpen(false)
        setIsManageModalOpen(true)
    }

    return (
        <>
            {/* Main Card */}

            <AppointmentInfoCard
                infoImage={infoImage}
                confirmationStatus={confirmationStatus}
                dateLabel={dateLabel}
                duration={duration}
                serviceName={serviceName}
                servicePrice={servicePrice}
                totalPrice={totalPrice}
                importantInfo={importantInfo}
                onManageClick={openManageModal}
            />


            {/* Manage Booking Modal */}
            {/* <ManageBookingModal
                isOpen={isManageModalOpen}
                infoImage={infoImage}
                onClose={closeManageModal}
                onReschedule={() => alert("Reschedule clicked!")}
                onCancel={openCancelModal}
            /> */}

            {/* Cancel Confirmation Modal */}
            <CancelModal
                isOpen={isCancelModalOpen}
                onClose={closeCancelModal}
                onConfirm={handleCancelConfirm}
                onBack={handleBackFromCancel} // <-- pass onBack callback here
            />
        </>
    )
}
