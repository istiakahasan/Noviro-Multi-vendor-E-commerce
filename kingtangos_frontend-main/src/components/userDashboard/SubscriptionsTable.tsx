// "use client"

// import { useId, useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
// import { Input } from "../ui/input"
// import { IoSearchOutline } from "react-icons/io5"
// import { FaEye } from "react-icons/fa6"
// import { BsFillTrash3Fill } from "react-icons/bs"
// import Link from "next/link"
// import { bookings } from "@/types/bookingData.type"


// export default function SubscriptionsTable() {
//     const [currentPage, setCurrentPage] = useState(1)
//     const totalItems = 1450
//     const itemsPerPage = 7

//     const startIndex = (currentPage - 1) * itemsPerPage
//     const endIndex = startIndex + itemsPerPage
//     const currentData = bookings.slice(startIndex, endIndex)
//     const totalPages = Math.ceil(totalItems / itemsPerPage)

//     const id = useId()

//     return (
//         <div className="w-full space-y-4 mt-5">
//             <div className="p-5 bg-white rounded-xl shadow-sm">
//                 <div className="rounded-lg border bg-card overflow-hidden">
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead colSpan={6}>
//                                     <div className="relative w-full">
//                                         <Input
//                                             id={id}
//                                             className="w-full ps-9 border-0 shadow-none focus-visible:border-0 focus-visible:ring-0"
//                                             placeholder="Start typing to search for orders"
//                                             type="text"
//                                         />
//                                         <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
//                                             <IoSearchOutline size={20} aria-hidden="true" />
//                                         </div>
//                                     </div>
//                                 </TableHead>
//                             </TableRow>
//                             <TableRow className="">
//                                 <TableHead className="text-primary pt-4 pb-3 text-xl font-medium">Type</TableHead>
//                                 <TableHead className="text-primary whitespace-nowrap pt-4 pb-3 text-xl font-medium">Booking Date</TableHead>
//                                 <TableHead className="text-primary whitespace-nowrap pt-4 pb-3 text-xl font-medium">Schedule Date</TableHead>
//                                 <TableHead className="text-primary pt-4 pb-3 text-xl font-medium">Status</TableHead>
//                                 <TableHead className="text-primary pt-4 pb-3 text-xl font-medium">Price</TableHead>
//                                 <TableHead className="text-primary pt-4 pb-3 text-right text-xl font-medium">Action</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {currentData.slice(0, 4).map((order) => (
//                                 <>
//                                     <TableRow key={order.id} className="border-b">
//                                         <TableCell className="font-medium text-base text-text py-5" >{order.type}</TableCell>
//                                         <TableCell className="text-base whitespace-nowrap text-text py-5" >{order.bookingDate}</TableCell>
//                                         <TableCell className="text-base whitespace-nowrap text-primary py-5" >{order.scheduleDate}</TableCell>
//                                         <TableCell className="text-base text-primary py-5" >{order.status}</TableCell>
//                                         <TableCell className="text-base text-primary py-5" >{order.price}</TableCell>
//                                         <TableCell>
//                                             <div className="flex items-center justify-end gap-2">
//                                                 <div className="rounded-full bg-[#0066FF]/10 py-1 px-0.5">


//                                                     <Link href={'/user/subscriptions/subscriptionsId'}>
//                                                         <Button variant="link" className=" h-auto font-normal">
//                                                             <FaEye className="text-[#0066FF]" />
//                                                         </Button>
//                                                     </Link>

//                                                 </div>
//                                                 <div className="rounded-full bg-danger/10 /10 py-1 px-0.5">
//                                                     <Link href={''}>
//                                                         <Button variant="link" className=" h-auto font-normal">
//                                                             <BsFillTrash3Fill className="text-[#FB041B]" />
//                                                         </Button>
//                                                     </Link>
//                                                 </div>
//                                             </div>
//                                         </TableCell>
//                                     </TableRow>
//                                 </>
//                             ))}
//                         </TableBody>
//                     </Table>
//                 </div>
//             </div>

//             <div className="text-sm text-muted-foreground mt-4">
//                 <div className="flex flex-col sm:flex-row items-center justify-center gap-3">

//                     {/* Small devices: Previous and Next buttons flexed together */}
//                     <div className="flex items-center justify-center gap-2 sm:hidden w-full">
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                             disabled={currentPage === 1}
//                             className="min-w-[84px]"
//                         >
//                             Previous
//                         </Button>
//                         <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                             disabled={currentPage >= totalPages || totalPages === 0}
//                             className="min-w-[84px]"
//                         >
//                             Next
//                         </Button>
//                     </div>

//                     {/* Larger devices: Previous Button - Left side */}
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//                         disabled={currentPage === 1}
//                         className="min-w-[84px] hidden sm:block"
//                     >
//                         Previous
//                     </Button>

//                     {/* Page Numbers - Middle */}
//                     <div className="flex items-center justify-center gap-1 flex-wrap order-3 sm:order-none">
//                         {[1, 2, 3].map((page) => (
//                             <Button
//                                 key={page}
//                                 variant={currentPage === page ? "default" : "outline"}
//                                 size="sm"
//                                 onClick={() => setCurrentPage(page)}
//                                 className="w-9 h-9"
//                             >
//                                 {page}
//                             </Button>
//                         ))}

//                         <span className="px-2 hidden sm:inline">...</span>

//                         <Button
//                             variant="outline"
//                             size="sm"
//                             className="hidden sm:inline w-9 h-9"
//                             onClick={() => setCurrentPage(totalPages || 1)}
//                             disabled={totalPages <= 1}
//                         >
//                             {totalPages || 1}
//                         </Button>
//                     </div>

//                     {/* Larger devices: Next Button - Right side */}
//                     <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//                         disabled={currentPage >= totalPages || totalPages === 0}
//                         className="min-w-[84px] hidden sm:block"
//                     >
//                         Next
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     )
// }
