import React from 'react'
import track from '@/assets/support/track.png'
import doc from '@/assets/support/modify.png'
import refund from '@/assets/support/refund.png'
import account from '@/assets/support/account.png'
import coupons from '@/assets/support/coupons.png'
import address from '@/assets/support/address.png'
import Image from 'next/image'
import { FaSearch } from 'react-icons/fa'
import AllTopic from '@/components/shared/AllTopic'
import { Button } from '@/components/ui/button'
import { BiSupport } from "react-icons/bi"
import Link from 'next/link'


export default function SupportPage() {
    return (
        <div className='pt-16'>
            <div className="container mx-auto">
                <h1 className='xl:text-4xl lg:text-3xl text-2xl font-semibold text-primary'>Do you need help with a recent item.Towhidul Islam?</h1>
                <p className='lg:text-lg text-base text-primary'>You can quickly take of most things here, lf you already have an account.</p>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 py-7">
                    <div className='bg-white rounded-xl shadow-sm p-5 flex flex-col justify-center items-center'>
                        <Image src={track} alt='' height={48} width={48} />
                        <p className='text-primary mt-1.5'>Track Order</p>
                    </div>
                    <div className='bg-white rounded-xl shadow-sm p-5 flex flex-col justify-center items-center'>
                        <Image src={doc} alt='' height={48} width={48} />
                        <p className='text-primary mt-1.5'>Modify [Cancel Order]</p>
                    </div>
                    <div className='bg-white rounded-xl shadow-sm p-5 flex flex-col justify-center items-center'>
                        <Image src={refund} alt='' height={48} width={48} />
                        <p className='text-primary mt-1.5'>Returns and refunds</p>
                    </div>
                    <div className='bg-white rounded-xl shadow-sm p-5 flex flex-col justify-center items-center'>
                        <Image src={account} alt='' height={48} width={48} />
                        <p className='text-primary mt-1.5'>Account Setting</p>
                    </div>
                    <div className='bg-white rounded-xl shadow-sm p-5 flex flex-col justify-center items-center'>
                        <Image src={coupons} alt='' height={48} width={48} />
                        <p className='text-primary mt-1.5'>View coupons</p>
                    </div>
                    <div className='bg-white rounded-xl shadow-sm p-5 flex flex-col justify-center items-center'>
                        <Image src={address} alt='' height={48} width={48} />
                        <p className='text-primary mt-1.5'>Change Address</p>
                    </div>
                </div>

                <h2 className='xl:text-4xl lg:text-3xl text-2xl font-semibold text-primary mb-4 mt-7'>Search our help library</h2>
                <div className=" lg:flex flex-1 max-w-sm mx-">

                    <div className="relative w-full">
                        <button className="absolute left-0 top-0 h-full px-4  text-primary/40 rounded-r-full h">
                            <FaSearch />
                        </button>
                        <input
                            type="text"
                            placeholder="Search topics"
                            className="w-full px-10 py-2 border border-gray-300 rounded-full focus:outline-none  focus:ring-2 focus:ring-gray-400"
                        />

                    </div>
                </div>

                <div className='pt-10'>
                    <AllTopic />
                </div>

                <div className="py-10 flex flex-col justify-center items-center gap-3">
                    <h3 className='font-bold'>Still cant solve the problem?</h3>
                    <Link href={'/contact-us'}>
                        <Button variant={'outline'} className='text-base font-bold shadow-none border border-primary bg-transparent rounded-full py-5 !px-7'>
                            <BiSupport className='!text-2xl' /> Contact Us
                        </Button>
                    </Link>
                </div>
            </div>


        </div>
    )
}
