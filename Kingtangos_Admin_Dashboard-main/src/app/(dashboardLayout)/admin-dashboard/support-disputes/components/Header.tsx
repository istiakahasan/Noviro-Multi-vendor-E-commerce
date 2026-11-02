"use client";
// src/components/Layout/Header.tsx

import { HeaderProps } from '@/types/global';
import React from 'react';


const Header: React.FC<HeaderProps> = ({ title, description }) => {
  return (
    <div className="">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 text-sm mt-2">{description}</p>
      </div>
    </div>
  );
};

export default Header;