// "use client";
// import React from "react";
// import Image from "next/image";

// interface Item {
//   name: string;
//   image: string;
//   quantity: number;
//   price: number;
//   total: number;
// }

// interface ItemsTableProps {
//   items: Item[];
//   shipping: number;
//   total: number;
// }

// const ItemsTable: React.FC<ItemsTableProps> = ({ items, shipping, total }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
//       <table className="min-w-full text-sm text-left">
//         <tbody>
//           {items.map((item, idx) => (
//             <tr key={idx} className="border-b last:border-none">
//               <td className="py-2 flex items-center gap-3">
//                 <Image src={item.image} alt={item.name} width={40} height={40} className="rounded-lg" />
//                 {item.name}
//               </td>
//               <td className="py-2 text-gray-700">{item.quantity} Items</td>
//               <td className="py-2 text-gray-700">${item.price.toFixed(2)}</td>
//               <td className="py-2 text-gray-900 font-medium">${item.total.toFixed(2)}</td>
//             </tr>
//           ))}
//           <tr>
//             <td colSpan={3} className="pt-3 text-right font-medium text-gray-700">
//               Shipping
//             </td>
//             <td className="pt-3 text-gray-900">${shipping.toFixed(2)}</td>
//           </tr>
//           <tr>
//             <td colSpan={3} className="pt-1 text-right font-semibold text-gray-900">
//               Total
//             </td>
//             <td className="pt-1 font-semibold text-gray-900">${total.toFixed(2)}</td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ItemsTable;



"use client";
import React from "react";
import Image from "next/image";

interface Item {
  name: string;
  image: string;
  quantity: number;
  price: number;
  total: number;
}

interface ItemsTableProps {
  items: Item[];
  shipping: number;
  total: number;
}

const ItemsTable: React.FC<ItemsTableProps> = ({ items, shipping, total }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.08)] p-5">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Items</h3>
      <div className="overflow-hidden  rounded-xl border border-y-gray-100">
        <table className="min-w-full text-sm text-left">
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={idx}
                className="border-b last:border-none hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 flex items-center gap-3">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={44}
                    height={44}
                    className="rounded-full border border-gray-100 object-cover"
                  />
                  <span className="font-medium text-gray-900">{item.name}</span>
                </td>
                <td className="py-3 px-4 text-gray-600">{item.quantity} Items</td>
                <td className="py-3 px-4 text-gray-600">€ {item.price.toFixed(2)}</td>
                <td className="py-3 px-4 text-gray-900 font-medium">
                  € {item.total.toFixed(2)}
                </td>
              </tr>
            ))}

            {/* Shipping */}
            <tr className="border-t ">
              <td colSpan={3} className="py-3 px-4 text-start font-medium text-gray-800">
                Shipping
              </td>
              <td className="py-3 px-4 text-gray-900 font-medium">
                € {shipping.toFixed(2)}
              </td>
            </tr>

            {/* Total */}
            <tr className="border-t">
              <td colSpan={3} className="py-3 px-4 text-start font-semibold text-gray-900">
                Total
              </td>
              <td className="py-3 px-4 text-gray-900 font-semibold">
                € {total.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ItemsTable;
