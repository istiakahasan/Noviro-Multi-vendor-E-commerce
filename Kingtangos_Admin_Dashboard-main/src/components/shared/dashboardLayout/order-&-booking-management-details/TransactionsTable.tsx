"use client";
import React from "react";

interface Transaction {
  type: string;
  method: string;
  date: string;
  amount: number;
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {
  return (
    <div className="rounded-xl shadow-sm border border-gray-50 p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Transactions</h3>
      <table className="min-w-full border border-y-gray-200 text-sm text-left">
        <tbody>
          {transactions.map((tx, idx) => (
            <tr key={idx} className="border-b last:border-none">
              <td className="py-2 text-gray-800 font-medium">{tx.type}</td>
              <td className="py-2 text-gray-600">{tx.method}</td>
              <td className="py-2 text-gray-600">{tx.date}</td>
              <td
                className={`py-2 text-right font-medium ${
                  tx.amount < 0 ? "text-red-600" : "text-gray-900"
                }`}
              >
                {tx.amount < 0 ? `-€${Math.abs(tx.amount).toFixed(2)}` : `€${tx.amount.toFixed(2)}`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
