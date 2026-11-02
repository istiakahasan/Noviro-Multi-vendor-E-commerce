import React from "react";
import WithdrawalEligibility from "./WithdrawalEligibility";
import WithdrawalsHistory from "./WithdrawalsHistory";
import WithdrawalRequestCard from "./WithdrawalRequestCard";
import StripeAccount from "./StripeAccount";

const WithdrawPage = () => {
  return (
    <div>
      <WithdrawalEligibility />
      <div className="py-4">
        <WithdrawalsHistory />
      </div>
      <div className="my-4 flex flex-col md:flex-row gap-4">
        <div className="md:flex-1">
          <WithdrawalRequestCard />
        </div>
        <div className="md:flex-1">
          <StripeAccount />
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;

// import React from "react";
// import WithdrawalEligibility from "./WithdrawalEligibility";
// import WithdrawalsHistory from "./WithdrawalsHistory";
// import WithdrawalRequestCard from "./WithdrawalRequestCard";

// const WithdrawPage = () => {
//   return (
//     <div>
//       <WithdrawalEligibility />
//       <div className="my-4">
//         <WithdrawalRequestCard />
//           <WithdrawalsHistory />
//       </div>
//     </div>
//   );
// };

// export default WithdrawPage;
