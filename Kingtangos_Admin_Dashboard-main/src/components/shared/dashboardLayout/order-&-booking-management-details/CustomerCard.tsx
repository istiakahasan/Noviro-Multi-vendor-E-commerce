"use client";
import React from "react";
import Image from "next/image";

interface CustomerCardProps {
  name: string;
  email: string;
  phone: string;
  image: string;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ name, email, phone, image }) => {
  return (
    <div className="rounded-2xl shadow-sm border border-gray-50 p-4">
        <h2 className="p-2 text-xl font-semibold">Customer</h2>
     <div className=" flex items-center gap-4">
      <Image src={image} alt={name} width={64} height={64} className="rounded-full object-cover" />
      <div>
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <p className="text-gray-600 text-sm">{email}</p>
        <p className="text-gray-800 text-sm">{phone}</p>
      </div>
      </div>
    </div>
  );
};

export default CustomerCard;
