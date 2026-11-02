import { CartItemResponse } from "@/types/cartItem.type";
import { baseApi } from "./baseApi";
import { MyCartResponse } from "@/types/myCart.type";
import { UpdateCartItemResponse } from "@/types/updateCartItem";

export const cartApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        addCart: builder.mutation<
            CartItemResponse,
            { productId: string; variantId?: string; sizeId?: string; size?: string; color?: string; quantity: number}
        >({
            query: ({ productId, variantId, sizeId, size, color, quantity }) => ({
                url: "/cart-item/add",
                method: "POST",
                body: {
                    productId,
                    quantity,
                    variantId,
                    sizeId,
                    size,
                    color,
                },
            }),
            invalidatesTags: ["Cart"],
        }),

        getAddToCart: builder.query<MyCartResponse, void>({
            query: () => ({
                url: "/cart-item/my",
                method: "GET",
            }),
            providesTags: ["Cart"],
        }),

        updateCart: builder.mutation<UpdateCartItemResponse, { cartItemId: string; quantity: number }>({
            query: (data) => ({
                url: `/cart-item/${data.cartItemId}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["Cart"],
        }),

        deleteToCartItem: builder.mutation({
            query: (cartItemId) => ({
                url: `/cart-item/${cartItemId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
        }),

        deleteAllCartItem: builder.mutation({
            query: () => ({
                url: "/cart-item/clear/cart",
                method: "DELETE",
            }),
            invalidatesTags: ["Cart"],
        }),

    }),
});



export const {
    useAddCartMutation,
    useGetAddToCartQuery,
    useUpdateCartMutation,
    useDeleteToCartItemMutation,
    useDeleteAllCartItemMutation,

} = cartApi;