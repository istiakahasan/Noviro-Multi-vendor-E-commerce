export interface ConsultationSlotResponse {
  data: {
    consultation: {
      id: string
      name: string
      price: number
      slotDuration: number
      type: string
    }
    date: string
    totalSlots: number
    availableSlots: AvailableSlot[]
    bookedSlots: number
  }
}

export interface AvailableSlot {
  startTime: string
  endTime: string
  availableSpecialists: Specialist[]
  totalAvailable: number
  isAvailable: boolean
}

export interface Specialist {
  id: string
  firstName: string
  lastName: string
  fullName: string
}
