"use client";
import React from "react";

interface AddressCardProps {
  title: string;
  name: string;
  address: string;
  postal: string;
}

const AddressCard: React.FC<AddressCardProps> = ({ title, name, address, postal }) => {
  return (
    <div className=" rounded-xl shadow-sm border border-gray-100 p-4">
      <h3 className="font-semibold text-xl text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-800">{name}</p>
      <p className="text-gray-600 text-sm">{address}</p>
      <p className="text-gray-600 text-sm">{postal}</p>
    </div>
  );
};

export default AddressCard;
