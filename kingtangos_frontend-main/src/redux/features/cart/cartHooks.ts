import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/redux/store'
import {
  selectCartItems,
  selectTotalItems,
  selectSubtotal,
} from './cartSlice'
import {
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  updateQuantity as updateQuantityAction,
  incrementQuantity as incrementQuantityAction,
  decrementQuantity as decrementQuantityAction,
  clearCart as clearCartAction,
  CartItem,
} from './cartSlice'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export const useCart = () => {
  const dispatch = useAppDispatch()
  
  const items = useAppSelector(selectCartItems)
  const totalItems = useAppSelector(selectTotalItems)
  const subtotal = useAppSelector(selectSubtotal)

  return {
    items,
    totalItems,
    subtotal,
    addToCart: (product: CartItem) => dispatch(addToCartAction(product)),
    removeFromCart: (id: string) => dispatch(removeFromCartAction(id)),
    updateQuantity: (id: string, quantity: number) => 
      dispatch(updateQuantityAction({ id, quantity })),
    incrementQuantity: (id: string) => dispatch(incrementQuantityAction(id)),
    decrementQuantity: (id: string) => dispatch(decrementQuantityAction(id)),
    clearCart: () => dispatch(clearCartAction()),
  }
}