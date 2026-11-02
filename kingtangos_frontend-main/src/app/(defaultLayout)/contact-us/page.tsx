import Image from 'next/image'
import React from 'react'
import chat from '@/assets/support/call.png'
import email from '@/assets/support/email.png'
import call from '@/assets/support/call.png'
import { Button } from '@/components/ui/button'
import AllTopic from '@/components/shared/AllTopic'

export default function ContactUs() {
    return (
        <div className='pt-20'>
            <div className="container mx-auto">
                <h1 className='xl:text-4xl lg:text-3xl text-2xl text-center font-semibold text-primary'>Do you need help with a recent item.Towhidul Islam?</h1>
                <p className='lg:text-lg text-base text-primary text-center mt-3'>You can quickly take of most things here, lf you already have an account.</p>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 py-10">
                    <div className='bg-white rounded-xl shadow-sm p-5 gap-2 flex flex-col justify-center items-center'>
                        <Image src={chat} alt='' height={48} width={48} />
                        <h2 className='text-2xl text-primary font-semibold'>Live Chat</h2>
                        <p className='text-primary'>24-hour Monday through Sunday</p>
                        <Button variant={'outline'} className='text-secondary border-secondary rounded-full text-lg py-5'>Start Live Chat</Button>
                    </div>
                    <div className='bg-white rounded-xl shadow-sm gap-2 p-5 flex flex-col justify-center items-center'>
                        <Image src={email} alt='' height={48} width={48} />
                        <h2 className='text-2xl text-primary font-semibold'>Email Us</h2>
                        <p className='text-primary'>24-hour Monday through Sunday</p>
                        <Button variant={'outline'} className='text-secondary border-secondary rounded-full text-lg py-5'>Email Us</Button>
                    </div>
                    <div className='bg-white rounded-xl shadow-sm gap-2 p-5 flex flex-col justify-center items-center'>
                        <Image src={call} alt='' height={48} width={48} />
                        <h2 className='text-2xl text-primary font-semibold'>Call Us</h2>
                        <p className='text-primary'>24-hour Monday through Sunday</p>
                        <Button variant={'outline'} className='w-fit  text-secondary border-secondary rounded-full text-lg py-5'>Call Us</Button>
                    </div>
                </div>

                <AllTopic />
            </div>
        </div>
    )
}
