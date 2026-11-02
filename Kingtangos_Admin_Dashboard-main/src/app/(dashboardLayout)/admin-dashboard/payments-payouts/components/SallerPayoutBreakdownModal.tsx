// components/SellerPayoutBreakdownModal.tsx
import React from 'react';
import { CheckCircle2, Pause, WalletIcon, X } from 'lucide-react';

interface SellerPayoutBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SellerPayoutBreakdownModal: React.FC<SellerPayoutBreakdownModalProps> = ({ isOpen, onClose }) => {
  // Hardcoded data
  const sellerName = 'Glam Beauty Studio';
  const dateRange = 'Sep 1-30, 2025';
  const status = 'Pending';
  const totalOrders = 8;
  const totalSales = '$670.00';
  const platformCommission = '$67.00';
  const commissionPercentage = '10% of sales';
  const finalPayout = '$603.00';
  const payoutDate = 'Oct 5, 2025';

  const transactionDetails = [
    { orderId: 'ORD-1012', type: 'Product', amount: '$50.00', commission: '$5.00', netSeller: '$45.00', date: 'Sep 2, 2025' },
    { orderId: 'ORD-1028', type: 'Service', amount: '$80.00', commission: '$8.00', netSeller: '$72.00', date: 'Sep 5, 2025' },
    { orderId: 'ORD-1045', type: 'Consultation', amount: '$40.00', commission: '$4.00', netSeller: '$36.00', date: 'Sep 6, 2025' },
    { orderId: 'ORD-1091', type: 'Subscription', amount: '$25.00', commission: '$2.50', netSeller: '$22.50', date: 'Sep 10, 2025' },
    { orderId: 'ORD-1156', type: 'Service', amount: '$95.00', commission: '$9.50', netSeller: '$85.50', date: 'Sep 18, 2025' },
    { orderId: 'ORD-2078', type: 'Consultation', amount: '$60.00', commission: '$6.00', netSeller: '$54.00', date: 'Sep 22, 2025' },
    { orderId: 'ORD-1234', type: 'Product', amount: '$70.00', commission: '$7.00', netSeller: '$63.00', date: 'Sep 25, 2025' },
    { orderId: 'ORD-1301', type: 'Subscription', amount: '$250.00', commission: '$25.00', netSeller: '$225.00', date: 'Sep 30, 2025' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      case 'Processing': return 'bg-blue-100 text-blue-800 border border-blue-300';
      case 'Paid': return 'bg-green-100 text-green-800 border border-green-300';
      default: return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Product': return 'bg-blue-100 text-blue-800';
      case 'Service': return 'bg-green-100 text-green-800';
      case 'Consultation': return 'bg-purple-100 text-purple-800';
      case 'Subscription': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleMarkAsPaid = () => {
    console.log('Mark as paid clicked');
    onClose();
  };

  const handleHoldPayment = () => {
    console.log('Hold payment clicked');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span><WalletIcon /></span>
                Seller Payout Breakdown</h2>
              <p className="text-gray-600 mt-1">Detailed view of earnings and commissions for this payout period.</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">{sellerName}</h3>
              <p className="text-sm text-gray-600">{dateRange}</p>
            </div>
            <div className="flex justify-end">
              <span className={` px-3 py-1 h-fit text-xs font-semibold rounded-md ${getStatusColor(status)}`}>
                {status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              <p className="text-xs text-gray-500">orders</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Platform Commission</p>
              <p className="text-2xl font-bold text-gray-900">{platformCommission}</p>
              <p className="text-xs text-gray-500">{commissionPercentage}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Final Payout</p>
              <p className="text-2xl font-bold text-gray-900">{finalPayout}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium text-gray-600">Order ID</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-600">Type</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-600">Amount</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-600">Commission</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-600">Net to Seller</th>
                    <th className="px-4 py-3 text-xs font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactionDetails.map((tx, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">#{tx.orderId}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(tx.type)}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-medium">{tx.amount}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{tx.commission}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-medium">{tx.netSeller}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{tx.date}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-bold">
                    <td className="px-4 py-3 text-sm text-gray-700">Total</td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-sm text-gray-700">{totalSales}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{platformCommission}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{finalPayout}</td>
                    <td className="px-4 py-3"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="shadow rounded-2xl p-4  text-sm text-gray-400 mb-6 flex items-center justify-center gap-2">
            <span><WalletIcon /></span>
            Payout will be processed via Stripe on {payoutDate}.
          </div>

          <div className="flex justify-start gap-3">
            <button
              onClick={handleMarkAsPaid}
              className="px-4 py-2 bg-[#333333] text-white rounded-md hover:bg-black transition-colors flex items-center gap-2"
            >
                <CheckCircle2 />
              Mark as Paid
            </button>
            <button
              onClick={handleHoldPayment}
              className="px-4 py-2 border border-black flex items-center gap-2 text-black rounded-md hover:bg-gray-200 transition-colors"
            >
                <Pause/>
              Hold Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerPayoutBreakdownModal;