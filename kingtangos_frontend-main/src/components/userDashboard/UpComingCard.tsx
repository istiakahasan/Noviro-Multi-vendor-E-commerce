import React from 'react';
import Image from 'next/image';
interface UpComingCardProps {
  image: string; // path to image
  title: string;
  time: string;
  price: string;
  items: string;
}
export default function UpComingCard({
  image,
  title,
  time,
  price,
  items,
}: UpComingCardProps) {
  return (
    <div className="w-fit rounded-xl border hover:border-[#0066FF] shadow-sm my-3 flex">
      <Image src={image} alt={title} height={128} width={220} className='rounded-l-lg' />
      <div className="p-5">
        <h3 className="text-primary font-semibold">{title}</h3>
        <p className="text-text">{time}</p>
        <p className="text-text pt-4">{price} • {items}</p>
      </div>
    </div>
  );
}