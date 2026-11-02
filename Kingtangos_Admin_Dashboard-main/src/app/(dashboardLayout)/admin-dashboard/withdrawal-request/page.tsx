
import { MatrixCardWithdraw } from './components/MatrixCardWithdraw';
import WithdrawHistoryTable from './components/WithdrawHistoryTable';

const page = () => {
  return (
    <div className="min-h-screen md:container mx-auto">
      <div className="">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Withdrawal Request Management </h1>
          <p className="text-gray-600 text-sm mt-2">Monitor and manage all product orders, service bookings, and subscription activities.</p>
        </div>
      </div>
      <div className='my-5 p-4'>

        <MatrixCardWithdraw />
      </div>
      {/* Navigation Tabs */}
      <div className="">
        <div className="px-6 py-4">

        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <WithdrawHistoryTable />
      </div>
    </div>
  );
};

export default page;