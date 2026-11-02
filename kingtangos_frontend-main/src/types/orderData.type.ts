type order = {
  id: number;
  orderNumber: string;
  date: string;
  status: "Pending" | "Return" | "Shipped" | "Complete";
  total: string; // e.g. "$1230 for 3 items"
};

export const orders: order[] = [
  {
    id: 1,
    orderNumber: "#13125",
    date: "March 30, 2025",
    status: "Pending",
    total: "$1230 for 3 items",
  },
  {
    id: 2,
    orderNumber: "#13126",
    date: "April 2, 2025",
    status: "Shipped",
    total: "$450 for 1 item",
  },
  {
    id: 3,
    orderNumber: "#13127",
    date: "April 5, 2025",
    status: "Complete",
    total: "$760 for 2 items",
  },
  {
    id: 4,
    orderNumber: "#13128",
    date: "April 10, 2025",
    status: "Return",
    total: "$980 for 4 items",
  },
  {
    id: 5,
    orderNumber: "#13129",
    date: "April 12, 2025",
    status: "Pending",
    total: "$1250 for 5 items",
  },

    {
    id: 6,
    orderNumber: "#13125",
    date: "March 30, 2025",
    status: "Pending",
    total: "$1230 for 3 items",
  },
  {
    id: 7,
    orderNumber: "#13126",
    date: "April 2, 2025",
    status: "Shipped",
    total: "$450 for 1 item",
  },
  {
    id: 8,
    orderNumber: "#13127",
    date: "April 5, 2025",
    status: "Complete",
    total: "$760 for 2 items",
  },
  {
    id: 9,
    orderNumber: "#13128",
    date: "April 10, 2025",
    status: "Return",
    total: "$980 for 4 items",
  },
  {
    id: 10,
    orderNumber: "#13129",
    date: "April 12, 2025",
    status: "Pending",
    total: "$1250 for 5 items",
  },
    {
    id: 11,
    orderNumber: "#13128",
    date: "April 10, 2025",
    status: "Return",
    total: "$980 for 4 items",
  },
  {
    id: 12,
    orderNumber: "#13129",
    date: "April 12, 2025",
    status: "Pending",
    total: "$1250 for 5 items",
  },
];