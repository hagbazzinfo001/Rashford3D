'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  addedAt: Date;
  inStock: boolean;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  wishlistCount: number;
  addToWishlist: (product: any) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: any) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  useEffect(() => {
    // Load wishlist from localStorage
    const storedWishlist = localStorage.getItem('rashford3d_wishlist');
    if (storedWishlist) {
      try {
        const wishlistData = JSON.parse(storedWishlist);
        setWishlistItems(wishlistData);
      } catch (error) {
        console.error('Error parsing stored wishlist data:', error);
        localStorage.removeItem('rashford3d_wishlist');
      }
    }
  }, []);

  useEffect(() => {
    // Save wishlist to localStorage whenever it changes
    localStorage.setItem('rashford3d_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (product: any) => {
    const existingItem = wishlistItems.find(item => item.productId === product.id);
    
    if (existingItem) {
      toast.error('Already in wishlist!');
      return;
    }

    const newItem: WishlistItem = {
      id: `wishlist_${product.id}_${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image || product.images?.[0],
      addedAt: new Date(),
      inStock: product.inStock || true,
    };

    setWishlistItems(prev => [...prev, newItem]);
    toast.success('Added to wishlist!');
  };

  const removeFromWishlist = (productId: string) => {
    setWishlistItems(prev => prev.filter(item => item.productId !== productId));
    toast.success('Removed from wishlist!');
  };

  const clearWishlist = () => {
    setWishlistItems([]);
    toast.success('Wishlist cleared!');
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.productId === productId);
  };

  const toggleWishlist = (product: any) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    toggleWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};