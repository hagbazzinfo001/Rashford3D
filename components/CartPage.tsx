'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Heart,
  Package,
  Truck,
  Shield,
  Tag,
  Gift,
  CreditCard,
  Lock,
  Star,
  Eye,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';

interface CartPageProps {
  onNavigate: (page: string, data?: any) => void;
  cartItems: any[];
  cartTotal: number;
  products: any[];
}

export default function CartPage({ 
  onNavigate, 
  cartItems, 
  cartTotal, 
  products 
}: CartPageProps) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [showPromoInput, setShowPromoInput] = useState(false);

  const { 
    updateQuantity, 
    removeFromCart, 
    getCartSubtotal, 
    getCartTax, 
    getCartShipping,
    addToCart 
  } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const subtotal = getCartSubtotal();
  const tax = getCartTax();
  const shipping = getCartShipping();
  const discount = appliedPromo ? subtotal * 0.1 : 0; // 10% discount example
  const total = subtotal + tax + shipping - discount;

  const handlePromoCode = () => {
    // Mock promo code validation
    const validCodes = ['SAVE10', 'WELCOME', 'FIRST20'];
    if (validCodes.includes(promoCode.toUpperCase())) {
      setAppliedPromo({
        code: promoCode.toUpperCase(),
        discount: subtotal * 0.1,
        type: 'percentage',
      });
      setShowPromoInput(false);
      setPromoCode('');
    } else {
      alert('Invalid promo code');
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // Get recommended products (excluding items already in cart)
  const recommendedProducts = products
    .filter(product => !cartItems.some(item => item.productId === product.id))
    .filter(product => product.isFeatured || product.rating >= 4.5)
    .slice(0, 4);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
              <p className="text-xl text-gray-600 mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('shop')}
                className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 mx-auto"
              >
                Start Shopping
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>

            {/* Recommended Products */}
            {recommendedProducts.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Like</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recommendedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-lg shadow-lg overflow-hidden card-hover group relative"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-48 object-cover product-image"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ opacity: 1, scale: 1 }}
                            onClick={() => onNavigate('product-details', product)}
                            className="bg-white text-gray-900 px-3 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </motion.button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-rashford-red">
                            ${product.price}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addToCart(product)}
                            className="btn-primary text-sm px-3 py-1"
                          >
                            Add to Cart
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="breadcrumbs mb-8">
          <button onClick={() => onNavigate('home')} className="breadcrumb-item">
            Home
          </button>
          <span className="breadcrumb-separator">/</span>
          <button onClick={() => onNavigate('shop')} className="breadcrumb-item">
            Shop
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="text-rashford-red">Shopping Cart</span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">
            {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-lg shadow-lg p-6 cart-item"
                >
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                        {item.variant && <span>Variant: {item.variant}</span>}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-rashford-red">
                          ${item.price}
                        </span>
                        <span className="text-sm text-gray-500">each</span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="quantity-btn"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleWishlist({ 
                          id: item.productId, 
                          name: item.name, 
                          price: item.price, 
                          image: item.image 
                        })}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Move to Wishlist"
                      >
                        <Heart className={`w-5 h-5 ${
                          isInWishlist(item.productId) ? 'fill-red-500 text-red-500' : ''
                        }`} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Remove from Cart"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue Shopping */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('shop')}
              className="w-full mt-6 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-rashford-red hover:text-rashford-red transition-colors flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              Continue Shopping
            </motion.button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              {/* Promo Code */}
              <div className="mb-6">
                {!appliedPromo && !showPromoInput && (
                  <button
                    onClick={() => setShowPromoInput(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg text-gray-600 hover:border-rashford-red hover:text-rashford-red transition-colors"
                  >
                    <Tag className="w-4 h-4" />
                    Add Promo Code
                  </button>
                )}

                {showPromoInput && !appliedPromo && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-3"
                  >
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter promo code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
                      />
                      <button
                        onClick={handlePromoCode}
                        className="btn-primary px-4 py-2"
                      >
                        Apply
                      </button>
                    </div>
                    <button
                      onClick={() => setShowPromoInput(false)}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                  </motion.div>
                )}

                {appliedPromo && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        {appliedPromo.code}
                      </span>
                    </div>
                    <button
                      onClick={removePromoCode}
                      className="text-green-600 hover:text-green-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Order Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {appliedPromo && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromo.code})</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    {shipping === 0 ? 'Free Shipping!' : 'Shipping Available'}
                  </span>
                </div>
                <p className="text-xs text-blue-600">
                  {shipping === 0 
                    ? 'Your order qualifies for free shipping!'
                    : `Add $${(100 - subtotal).toFixed(2)} more for free shipping`
                  }
                </p>
              </div>

              {/* Security Badges */}
              <div className="mb-6 space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span>SSL encrypted</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span>Multiple payment options</span>
                </div>
              </div>

              {/* Checkout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('checkout')}
                className="w-full btn-primary text-lg py-4 flex items-center justify-center gap-2"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              {/* Payment Methods */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 mb-2">We accept</p>
                <div className="flex justify-center space-x-2">
                  {['Visa', 'Mastercard', 'PayPal', 'Apple Pay'].map((method) => (
                    <div
                      key={method}
                      className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-600"
                    >
                      {method}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden card-hover group relative"
                >
                  {/* Product Badges */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {product.isNew && (
                      <span className="product-badge new">New</span>
                    )}
                    {product.isOnSale && (
                      <span className="product-badge sale">
                        -{product.discountPercentage}%
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className="wishlist-button"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                      }`}
                    />
                  </button>

                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-48 object-cover product-image"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        onClick={() => onNavigate('product-details', product)}
                        className="bg-white text-gray-900 px-3 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </motion.button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        {product.brand}
                      </span>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <span className="text-lg font-bold text-rashford-red">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="btn-primary text-xs px-3 py-1"
                      >
                        Add to Cart
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="mt-16 py-12 bg-white rounded-lg shadow-sm">
          <div className="trust-indicators">
            <div className="trust-indicator">
              <Truck className="trust-indicator-icon" />
              <h4 className="font-semibold">Free Shipping</h4>
              <p className="text-sm">On orders over $100</p>
            </div>
            <div className="trust-indicator">
              <Shield className="trust-indicator-icon" />
              <h4 className="font-semibold">Secure Payment</h4>
              <p className="text-sm">100% secure checkout</p>
            </div>
            <div className="trust-indicator">
              <Gift className="trust-indicator-icon" />
              <h4 className="font-semibold">Easy Returns</h4>
              <p className="text-sm">30-day return policy</p>
            </div>
            <div className="trust-indicator">
              <Package className="trust-indicator-icon" />
              <h4 className="font-semibold">Quality Guarantee</h4>
              <p className="text-sm">Premium products only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}