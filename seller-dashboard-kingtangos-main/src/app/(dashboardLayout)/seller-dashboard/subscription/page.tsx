
// import CancelledSubscriptionsHistory from '@/components/dashboardLayout/CancelledSubscriptionsHistory';
import SubscriptionManagement from '@/components/dashboardLayout/SubscriptionManagement';
import React from 'react';

const page = () => {
    return (
        <div>
          <SubscriptionManagement />  
          {/* <CancelledSubscriptionsHistory /> */}
        </div>
    );
};

export default page;