"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { toast } from "react-hot-toast";
interface VariantOptions {
  size?: string;
  color?: string;
  variant?: string;
}
interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
  size?: string;
  color?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: any, quantity?: number, variants?: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getCartTax: () => number;
  getCartShipping: () => number;
  isInCart: (productId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage
    const storedCart = localStorage.getItem("rashford3d_cart");
    if (storedCart) {
      try {
        const cartData = JSON.parse(storedCart);
        setCartItems(cartData);
      } catch (error) {
        console.error("Error parsing stored cart data:", error);
        localStorage.removeItem("rashford3d_cart");
      }
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem("rashford3d_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // const addToCart = (product: any, quantity = 1, variants = {}) => {
  //   const itemId = `${product.id}_${variants.size || ""}_${
  //     variants.color || ""
  //   }`;

  //   setCartItems((prev) => {
  //     const existingItem = prev.find((item) => item.id === itemId);

  //     if (existingItem) {
  //       toast.success("Cart updated!");
  //       return prev.map((item) =>
  //         item.id === itemId
  //           ? { ...item, quantity: item.quantity + quantity }
  //           : item
  //       );
  //     } else {
  //       const newItem: CartItem = {
  //         id: itemId,
  //         productId: product.id,
  //         name: product.name,
  //         price: product.price,
  //         quantity,
  //         image: product.image || product.images?.[0],
  //         variant: variants.variant,
  //         size: variants.size,
  //         color: variants.color,
  //       };

  //       toast.success("Added to cart!");
  //       return [...prev, newItem];
  //     }
  //   });
  // };
  const addToCart = (
    product: any,
    quantity = 1,
    variants: VariantOptions = {}
  ) => {
    const itemId = `${product.id}_${variants.size || ""}_${
      variants.color || ""
    }`;

    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === itemId);

      if (existingItem) {
        toast.success("Cart updated!");
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: itemId,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.image || product.images?.[0],
          variant: variants.variant,
          size: variants.size,
          color: variants.color,
        };

        toast.success("Item added to cart!");
        return [...prev, newItem];
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    toast.success("Removed from cart!");
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared!");
  };

  const getCartSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getCartTax = () => {
    return getCartSubtotal() * 0.08; // 8% tax
  };

  const getCartShipping = () => {
    const subtotal = getCartSubtotal();
    return subtotal > 100 ? 0 : 15; // Free shipping over $100
  };

  const getCartTotal = () => {
    return getCartSubtotal() + getCartTax() + getCartShipping();
  };

  const isInCart = (productId: string) => {
    return cartItems.some((item) => item.productId === productId);
  };

  const value = {
    cartItems,
    cartCount: cartItems.reduce((total, item) => total + item.quantity, 0),
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartSubtotal,
    getCartTax,
    getCartShipping,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
