import { BookNowCard } from '@/components/shared/BookNowCard'
import VisitSpecialistBox from '@/components/shared/VisitSpecialistBox'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

// import { StaticImageData } from 'next/image'

// Before
// interface BookingCardProps {
//   image: string
// }




export default function ConfirmServiceBookingPage() {
    return (
        <div className='grid grid-cols-12 xl:gap-16 lg:gap-10 md:gap-7 container mx-auto py-16'>
            <div className="md:col-span-7 col-span-12">
                <VisitSpecialistBox />

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-primary">
                    Review and confirm
                </h2>

                <h3 className='md:text-2xl text-xl text-primary font-semibold mt-5'>Discount code</h3>
                <div className="flex w-full max-w-sm items-center mt-3 gap-2">
                    <Input type="email"
                        className='shadow-none py-5'
                        placeholder="enter your coupon code" />
                    <Button type="submit" className='bg-primary hover:bg-primary/85 text-white py-5 px-7' variant="outline">
                        Apply
                    </Button>
                </div>

                <div className='my-5'>
                    <h3 className='md:text-2xl text-xl text-primary font-semibold'>Important info</h3>
                    <p className='text-text mt-3'>If you arrive later than your appointment time, the next person on the waiting list will have to wait.</p>
                </div>

                <h3 className='md:text-2xl text-xl text-primary font-semibold'>Booking notes</h3>
                <div className="*:not-first:mt-2 mt-3">
                    <Textarea
                        className="[resize:none] shadow-none p-3"
                        placeholder="Include comments or requests about your booking"
                    />
                </div>
            </div>
            <div className="md:col-span-5 col-span-12">
                <BookNowCard />
            </div>
        </div>
    )
}
