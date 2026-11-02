"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "../ui/input"
import { useId } from "react"
import { IoSearchOutline } from "react-icons/io5"
import { FaEye } from "react-icons/fa6"
import { BsFillTrash3Fill } from "react-icons/bs"
import { orders } from "@/types/orderData.type"

export default function CompleteOrderTable() {

    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 7

    const pendingOrders = orders.filter(order => order.status === "Complete")

    const totalItems = pendingOrders.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentData = pendingOrders.slice(startIndex, endIndex)

    const id = useId()


    return (
        <div className="w-full space-y-4 mt-5">
            <div className="p-5 bg-white rounded-xl shadow-sm">
                <div className="rounded-lg border bg-card overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-primary text-xl font-medium">
                                    <div className="relative">
                                        <Input id={id} className="peer ps-9 border-0 shadow-none focus-visible:border-0 focus-visible:ring-0" placeholder="Start typing to search for orders" type="email" />
                                        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
                                            <IoSearchOutline size={20} aria-hidden="true" />
                                        </div>
                                    </div>
                                </TableHead>
                            </TableRow>
                            <TableRow className="">
                                <TableHead className="text-primary pt-4 pb-3 text-xl font-medium">Order</TableHead>
                                <TableHead className="text-primary pt-4 pb-3 text-xl font-medium">Date</TableHead>
                                <TableHead className="text-primary pt-4 pb-3 text-xl font-medium">Status</TableHead>
                                <TableHead className="text-primary pt-4 pb-3 text-xl font-medium">Total</TableHead>
                                <TableHead className="text-primary pt-4 pb-3 text-right text-xl font-medium">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentData.map((order) => (
                                <TableRow key={order.id} className="border-b">
                                    <TableCell className="font-medium text-base text-text py-5">{order.orderNumber}</TableCell>
                                    <TableCell className="text-base text-text py-5">{order.date}</TableCell>
                                    <TableCell className="text-base text-primary py-5">{order.status}</TableCell>
                                    <TableCell className="text-base text-text py-5">{order.total}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="rounded-full bg-[#0066FF]/10 py-1 px-0.5">
                                                <Button variant="link" className=" h-auto font-normal">
                                                    <FaEye className="text-[#0066FF]" />
                                                </Button>
                                            </div>
                                            <div className="rounded-full bg-danger/10 py-1 px-0.5">
                                                <Button variant="link" className=" h-auto font-normal">
                                                    <BsFillTrash3Fill className="text-[#FB041B]" />
                                                </Button>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <div className="flex text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3].map((page) => (
                            <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                className={currentPage === page ? "" : ""}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </Button>
                        ))}
                        <span className="px-2">...</span>
                        <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages, 16))}>
                            16
                        </Button>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage >= totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    )
}
