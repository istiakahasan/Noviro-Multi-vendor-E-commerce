// import { baseApi } from "../../api/baseApi";

// // Withdraw Status Types
// export type WithdrawStatus =
//   | "PENDING"
//   | "APPROVED"
//   | "REJECTED"
//   | "PROCESSING"
//   | "COMPLETED"
//   | "FAILED";

// // Single Withdraw Request Type

// // Transaction History Interface
// export interface Transaction {
//   id: string;
//   sellerStripeId: string;
//   stripeTransferId: string;
//   amount: string;
//   currency: string;
//   sellerAmount: string;
//   paymentStatus: string;
//   transferStatus: string;
//   description: string;
//   transferDate: string;
//   createdAt: string;
// }

// // Transaction History Response
// export interface GetTransactionHistoryResponse {
//   success: boolean;
//   message: string;
//   data: Transaction[];
// }
// export interface WithdrawRequest {
//   id: string;
//   walletId: string;
//   amount: string;
//   status: WithdrawStatus;
//   accountName: string;
//   accountNumber: string;
//   bankName: string;
//   branchName: string | null;
//   routingNumber: string | null;
//   reviewedBy: string | null;
//   reviewedAt: string | null;
//   rejectionNote: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// // API Meta Type
// export interface WithdrawMeta {
//   page: number;
//   limit: number;
//   total: number;
//   totalPage: number;
// }

// // API Response Type
// export interface GetPayoutResponse {
//   success: boolean;
//   message: string;
//   meta: WithdrawMeta;
//   data: WithdrawRequest[];
// }

// // Single Withdraw Response
// export interface GetSingleWithdrawResponse {
//   success: boolean;
//   message: string;
//   data: WithdrawRequest;
// }

// // Top Seller Types
// export interface TopSeller {
//   id: string;
//   name: string;
//   logo: string;
//   revenue: number;
//   orders: number;
//   rating: number;
//   growth: number;
// }

// // Top Seller Response
// export interface GetTopSellerResponse {
//   success: boolean;
//   message: string;
//   data: TopSeller[];
// }

// export const withdrawalApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // GET Withdrawal Requests (Admin)
//     getPayoutRequests: builder.query<
//       GetPayoutResponse,
//       { page?: number; limit?: number }
//     >({
//       query: ({ page = 1, limit = 10 }) => ({
//         url: `/withdrawals/admin/get-request?page=${page}&limit=${limit}`,
//         method: "GET",
//       }),
//       providesTags: ["withdrawals"],
//     }),

//     // GET Single Withdraw Request
//     getSingleWithdraw: builder.query<GetSingleWithdrawResponse, string>({
//       query: (id) => ({
//         url: `/withdrawals/admin/get-request/${id}`,
//         method: "GET",
//       }),
//       providesTags: ["withdrawals"],
//     }),

//     // PATCH Approve Withdraw Request
//     approveWithdraw: builder.mutation<
//       { success: boolean; message: string },
//       { id: string; note: string }
//     >({
//       query: ({ id, note }) => ({
//         url: `/withdrawals/admin/approve/${id}`,
//         method: "PATCH",
//         body: { note },
//       }),
//       invalidatesTags: ["withdrawals"],
//     }),

//     // PATCH Reject Withdraw Request
//     rejectWithdraw: builder.mutation<
//       { success: boolean; message: string },
//       { id: string; note: string }
//     >({
//       query: ({ id, note }) => ({
//         url: `/withdrawals/admin/reject/${id}`,
//         method: "PATCH",
//         body: { note },
//       }),
//       invalidatesTags: ["withdrawals"],
//     }),
//     getTransactionHistory: builder.query<GetTransactionHistoryResponse, void>({
//       query: () => ({
//         url: "/stripe/payout/transaction-histroy",
//         method: "GET",
//       }),
//       providesTags: ["transactions"],
//     }),

//     // GET Top Sellers Analytics
//     getTopSeller: builder.query<GetTopSellerResponse, void>({
//       query: () => ({
//         url: `/withdrawals/admin/analytics`,
//         method: "GET",
//       }),
//       providesTags: ["analytics"],
//     }),
//   }),
// });

// export const {
//   useGetPayoutRequestsQuery,
//   useGetSingleWithdrawQuery,
//   useApproveWithdrawMutation,
//   useRejectWithdrawMutation,
//   useGetTopSellerQuery,
//   useGetTransactionHistoryQuery,
// } = withdrawalApi;

import { baseApi } from "../../api/baseApi";

// Withdraw Status Types
export type WithdrawStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PROCESSING"
  | "COMPLETED"
  | "FAILED";

// Single Withdraw Request Type
// Transaction History Interface
export interface Transaction {
  id: string;
  sellerStripeId: string;
  stripeTransferId: string;
  amount: string;
  currency: string;
  sellerAmount: string;
  paymentStatus: string;
  transferStatus: string;
  description: string;
  transferDate: string;
  createdAt: string;
  sellerStripe?: {
    id: string;
    storeId: string;
    vendorId: string;
    stripeAccountId: string;
    stripeStatus: string;
    chargesEnabled: boolean;
    payoutsEnabled: boolean;
    pendingBalance: string;
    totalEarnings: string;
    store: {
      id: string;
      name: string;
      location: string;
      description: string;
      logo: string;
      banner: string;
      email: string;
      phone: string;
      shopStatus: string;
    };
  };
}

// Transaction History Response
export interface GetTransactionHistoryResponse {
  success: boolean;
  message: string;
  data: Transaction[];
}

export interface WithdrawRequest {
  id: string;
  walletId: string;
  amount: string;
  status: WithdrawStatus;
  accountName: string;
  accountNumber: string;
  bankName: string;
  branchName: string | null;
  routingNumber: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionNote: string | null;
  createdAt: string;
  updatedAt: string;
}

// API Meta Type
export interface WithdrawMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

// API Response Type
export interface GetPayoutResponse {
  success: boolean;
  message: string;
  meta: WithdrawMeta;
  data: WithdrawRequest[];
}

// Single Withdraw Response
export interface GetSingleWithdrawResponse {
  success: boolean;
  message: string;
  data: WithdrawRequest;
}

// Top Seller Types
export interface TopSeller {
  id: string;
  name: string;
  logo: string;
  revenue: number;
  orders: number;
  rating: number;
  growth: number;
}

// Top Seller Response
export interface GetTopSellerResponse {
  success: boolean;
  message: string;
  data: TopSeller[];
}

// ───────────────────────────────────────────────────────────────
// NEW: Refund Types
// ───────────────────────────────────────────────────────────────

export type RefundStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "PROCESSING"
  | "COMPLETED";

export interface RefundUser {
  firstName: string;
  lastName: string;
  email: string;
}

export interface RefundProduct {
  name: string;
  storeId: string; // kept as is (from your original)
  store?: {
    id: string;
    userId: string;
    name: string;
    location: string;
    tags: string[];
    description: string;
    logo: string;
    banner: string;
    phone: string;
    email: string;
    facebookUrl: string;
    instagramUrl: string;
    youtubeUrl: string;
    shopStatus: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    stripeAccountId: string;
    stripeAccountStatus: string;
  };
}

export interface RefundOrder {
  id: string;
  userId: string;
  shippingId: string;
  totalAmount: number;
  shippingCost: number;
  paymentMethod: string;
  couponId: string | null;
  stripePaymentId: string;
  orderStatus: string;
  paymentStatus: string;
  commissionAmount: string;
  commissionPaid: boolean;
  commissionPercent: string;
  vendorAmount: string;
  commissionPaidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RefundItem {
  id: string;
  orderId: string;
  bookingId: string | null;
  subscriptionId: string | null;
  userId: string;
  productId: string;
  quantity: number;
  customerReason: string;
  sellerReason: string | null;
  adminReason: string | null;
  sellerApproved: boolean | null;
  adminApproved: boolean | null;
  status: RefundStatus;
  refundAmount: number;
  createdAt: string;
  updatedAt: string;
  user: RefundUser;
  product: RefundProduct;
  order: RefundOrder;
  booking: any | null;
  subscription: any | null;
}

export interface RefundMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface GetRefundRequestsResponse {
  success: boolean;
  message: string;
  meta: RefundMeta;
  data: RefundItem[];
}

// Single Transaction Response
export interface GetSingleTransactionResponse {
  success: boolean;
  message: string;
  data: Transaction;
}

// ───────────────────────────────────────────────────────────────
// API Endpoints
// ───────────────────────────────────────────────────────────────

export const withdrawalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET Withdrawal Requests (Admin)
    getPayoutRequests: builder.query<
      GetPayoutResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/withdrawals/admin/get-request?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["withdrawals"],
    }),

    // GET Single Withdraw Request
    getSingleWithdraw: builder.query<GetSingleWithdrawResponse, string>({
      query: (id) => ({
        url: `/withdrawals/admin/get-request/${id}`,
        method: "GET",
      }),
      providesTags: ["withdrawals"],
    }),

    // PATCH Approve Withdraw Request
    approveWithdraw: builder.mutation<
      { success: boolean; message: string },
      { id: string; note: string }
    >({
      query: ({ id, note }) => ({
        url: `/withdrawals/admin/approve/${id}`,
        method: "PATCH",
        body: { note },
      }),
      invalidatesTags: ["withdrawals"],
    }),

    // PATCH Reject Withdraw Request
    rejectWithdraw: builder.mutation<
      { success: boolean; message: string },
      { id: string; note: string }
    >({
      query: ({ id, note }) => ({
        url: `/withdrawals/admin/reject/${id}`,
        method: "PATCH",
        body: { note },
      }),
      invalidatesTags: ["withdrawals"],
    }),

    getTransactionHistory: builder.query<GetTransactionHistoryResponse, void>({
      query: () => ({
        url: "/stripe/payout/transaction-histroy",
        method: "GET",
      }),
      providesTags: ["transactions"],
    }),
    getSingleTransaction: builder.query<GetSingleTransactionResponse, string>({
      query: (id) => ({
        url: `/stripe/single/transaction-histroy/${id}`,
        method: "GET",
      }),
      providesTags: ["transactions"],
    }),

    // GET Top Sellers Analytics
    getTopSeller: builder.query<GetTopSellerResponse, void>({
      query: () => ({
        url: `/withdrawals/admin/analytics`,
        method: "GET",
      }),
      providesTags: ["analytics"],
    }),

    // ── NEW: Get All Refund Requests (paginated) ──────────────────
    getRefundRequests: builder.query<
      GetRefundRequestsResponse,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `/refunds?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["refunds"],
    }),
    getSingleRefund: builder.query<
      { success: boolean; message: string; data: RefundItem },
      string
    >({
      query: (id) => ({
        url: `/refunds/single/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "refunds", id }],
    }),
    adminRespondToRefund: builder.mutation<
      { success: boolean; message: string; data: RefundItem },
      { id: string; adminApproved: boolean; adminReason: string }
    >({
      query: ({ id, adminApproved, adminReason }) => ({
        url: `/refunds/admin-response/${id}`,
        method: "PATCH",
        body: {
          adminApproved,
          adminReason,
        },
      }),
      invalidatesTags: (result, error, { id }) => [
        "refunds",
        { type: "refunds", id }, // optional: invalidate single item
      ],
    }),
    generateTransactionPDF: builder.mutation<Blob, string>({
      query: (id) => ({
        url: `/stripe/generated-pdf/${id}`,
        method: "POST",
        body: {},
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetPayoutRequestsQuery,
  useGetSingleWithdrawQuery,
  useApproveWithdrawMutation,
  useRejectWithdrawMutation,
  useGetTopSellerQuery,
  useGetTransactionHistoryQuery,
  useGetSingleTransactionQuery,
  useGetRefundRequestsQuery,
  useGetSingleRefundQuery,
  useAdminRespondToRefundMutation,
  useGenerateTransactionPDFMutation,
} = withdrawalApi;
