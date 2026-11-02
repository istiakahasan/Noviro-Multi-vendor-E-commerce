"use client";
import React from 'react';
import ManageStores from './components/ManageStores';
import { useParams } from 'next/navigation';

const Page = () => {
    const {id} =useParams();
    console.log(id);
    return (
        <div>
          <ManageStores storeId={`${id}`} />
        </div>
    );
};

export default Page;