"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Link from "next/link";
import { IoSearchOutline } from "react-icons/io5";
import { FaEye } from "react-icons/fa6";
import { useId, useState } from "react";
import { Order } from "@/types/userDashbord/order.types";
import { Skeleton } from "@/components/ui/skeleton";
import { MdMoreVert } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../dialog";
import { useProductRefundsRequestMutation } from "@/redux/api/userDashbord/userDashbordApi";
import { toast } from "sonner";
// import { useProductRefundsRequestMutation } from "@/redux/api/userDashbord/userDashbordApi";

interface Props {
  orders: Order[];
  isLoading: boolean;
}

export default function OrdersTable({ orders, isLoading }: Props) {
  console.log(orders);
  const id = useId();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [productRefundsRequest, { isLoading: isRefundLoading }] =
    useProductRefundsRequestMutation();

  const handleSubmit = async () => {
    if (!selectedOrder) return;

    try {
      for (const item of selectedOrder.orderItems) {
        const data = {
          orderId: selectedOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          customerReason: reason,
          refundAmount: item.totalPrice,
        };
        await productRefundsRequest(data).unwrap();
      }
      setOpen(false);
      setReason("");
      setSelectedOrder(null);
      toast.success("Refund request submitted successfully");
      // Optionally, add toast notification for success
    } catch (err) {
      // Handle error, e.g., show toast
      console.error("Refund request failed:", err);
    }
  };

  /* ----------------- LOADING SKELETON VIEW ------------------ */
  if (isLoading) {
    return (
      <div className="p-5 bg-white rounded-xl shadow-sm">
        <div className="rounded-lg border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead colSpan={5}>
                  <div className="relative w-full">
                    <Skeleton className="w-full h-10 rounded-md" />
                  </div>
                </TableHead>
              </TableRow>

              <TableRow>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-6 w-24" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {[1, 2, 3, 4, 5].map((i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Skeleton className="h-5 w-5" />
                      <Skeleton className="h-5 w-5" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  /* ----------------- MAIN TABLE VIEW ------------------ */
  return (
    <div className="p-5 bg-white rounded-xl shadow-sm">
      <div className="rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={5}>
                <div className="relative w-full">
                  <Input
                    id={id}
                    className="w-full ps-9 border-0 shadow-none"
                    placeholder="Start typing to search for orders"
                    type="text"
                  />
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3 text-muted-foreground/80">
                    <IoSearchOutline size={20} aria-hidden="true" />
                  </div>
                </div>
              </TableHead>
            </TableRow>

            <TableRow>
              <TableHead className="text-primary text-xl">Order</TableHead>
              <TableHead className="text-primary text-xl">Date</TableHead>
              <TableHead className="text-primary text-xl">Status</TableHead>
              <TableHead className="text-primary text-xl">Total</TableHead>
              <TableHead className="text-primary text-right text-xl">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  #{order.id.slice(0, 8)}
                </TableCell>

                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>

                <TableCell className="text-primary">
                  {order.orderStatus}
                </TableCell>

                <TableCell>${order.totalAmount.toFixed(2)}</TableCell>

                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/user/all-orders/${order.id}`}>
                      <Button variant="link">
                        <FaEye className="text-blue-600" />
                      </Button>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-0">
                          <MdMoreVert />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setSelectedOrder(order); setOpen(true); }}>
                          Refund
                        </DropdownMenuItem>
                        {/* Add other menu items if needed, e.g., Cancel, View Details */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to Refund?
            </DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={isRefundLoading || !reason}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}