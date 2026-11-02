
import { PaymentEarningChart } from '@/components/dashboardLayout/PaymentsEarnings/PaymentEarningChart';
import { PaymentEarningMatrix } from '@/components/dashboardLayout/PaymentsEarnings/PaymentEarningMatrix';
import PaymentHistoryTable from '@/components/dashboardLayout/PaymentsEarnings/PaymentHistoryTable';
import React from 'react';

const page = () => {
    return (
        <div>
            <PaymentEarningMatrix />
            <PaymentEarningChart />
            <PaymentHistoryTable
             />
        </div>
    );
};

export default page;