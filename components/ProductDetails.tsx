'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star,
  Heart,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Share2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Check,
  X,
  Eye,
  Package,
  Zap,
  Award,
  Users,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  Info,
  Globe,
  CreditCard,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'react-hot-toast';

interface ProductDetailsProps {
  product: any;
  onNavigate: (page: string, data?: any) => void;
  onClose: () => void;
  relatedProducts: any[];
}

export default function ProductDetails({ 
  product, 
  onNavigate, 
  onClose, 
  relatedProducts 
}: ProductDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [activeTab, setActiveTab] = useState('description');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
  });
  const [expandedReviews, setExpandedReviews] = useState(new Set());
  const [showAllSpecs, setShowAllSpecs] = useState(false);

  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button onClick={onClose} className="btn-primary">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants);
  };

  const handleImageChange = (direction) => {
    if (direction === 'next') {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const handleVariantChange = (type, value) => {
    setSelectedVariants(prev => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would submit to an API
    toast.success('Review submitted successfully!');
    setShowReviewForm(false);
    setReviewForm({ rating: 5, title: '', comment: '' });
  };

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const relatedProductsFiltered = relatedProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const tabs = [
    { id: 'description', label: 'Description', icon: Info },
    { id: 'specifications', label: 'Specifications', icon: Package },
    { id: 'reviews', label: `Reviews (${product.reviewCount})`, icon: MessageCircle },
    { id: 'shipping', label: 'Shipping & Returns', icon: Truck },
  ];

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
          <span className="text-rashford-red">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={product.images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Image Navigation */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageChange('prev')}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleImageChange('next')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Product Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <span className="product-badge new">New</span>
                )}
                {product.isOnSale && (
                  <span className="product-badge sale">
                    -{product.discountPercentage}%
                  </span>
                )}
                {product.isFeatured && (
                  <span className="product-badge featured">Featured</span>
                )}
              </div>

              {/* Wishlist & Share */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => toggleWishlist(product)}
                  className="bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    }`}
                  />
                </button>
                <button
                  onClick={shareProduct}
                  className="bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Thumbnail Images */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-rashford-red'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                  {product.brand}
                </span>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-gray-500">({product.reviewCount} reviews)</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-rashford-red">${product.price}</span>
              {product.originalPrice && (
                <span className="text-2xl text-gray-500 line-through">
                  ${product.originalPrice}
                </span>
              )}
              {product.isOnSale && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`stock-indicator ${
                product.inStock 
                  ? product.stockQuantity > 10 ? 'in-stock' : 'low-stock'
                  : 'out-of-stock'
              }`}>
                <div className="stock-dot"></div>
                <span className="font-medium">
                  {product.inStock 
                    ? product.stockQuantity > 10 
                      ? 'In Stock' 
                      : `Only ${product.stockQuantity} left in stock`
                    : 'Out of Stock'
                  }
                </span>
              </div>
            </div>

            {/* Variants */}
            {product.variants && (
              <div className="space-y-4">
                {product.variants.colors && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Color</h3>
                    <div className="flex space-x-2">
                      {product.variants.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handleVariantChange('color', color)}
                          className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                            selectedVariants.color === color
                              ? 'border-rashford-red bg-rashford-red text-white'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.variants.sizes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Size</h3>
                    <div className="flex space-x-2">
                      {product.variants.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => handleVariantChange('size', size)}
                          className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                            selectedVariants.size === size
                              ? 'border-rashford-red bg-rashford-red text-white'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.variants.materials && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Material</h3>
                    <div className="flex space-x-2">
                      {product.variants.materials.map((material) => (
                        <button
                          key={material}
                          onClick={() => handleVariantChange('material', material)}
                          className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all ${
                            selectedVariants.material === material
                              ? 'border-rashford-red bg-rashford-red text-white'
                              : 'border-gray-300 text-gray-700 hover:border-gray-400'
                          }`}
                        >
                          {material}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="quantity-input"
                  min="1"
                  max={product.stockQuantity}
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="quantity-btn"
                  disabled={quantity >= product.stockQuantity}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full py-4 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
                  !product.inStock
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isInCart(product.id)
                    ? 'bg-green-600 text-white'
                    : 'bg-rashford-red text-white hover:bg-rashford-red/90'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                {!product.inStock 
                  ? 'Out of Stock'
                  : isInCart(product.id) 
                  ? 'Added to Cart' 
                  : `Add to Cart - $${(product.price * quantity).toFixed(2)}`
                }
              </motion.button>

              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    handleAddToCart();
                    onNavigate('checkout');
                  }}
                  disabled={!product.inStock}
                  className="btn-secondary py-3 flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Buy Now
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleWishlist(product)}
                  className="border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
                </motion.button>
              </div>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-8 h-8 text-rashford-red mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Free Shipping</p>
                <p className="text-xs text-gray-500">On orders over $100</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-rashford-red mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Warranty</p>
                <p className="text-xs text-gray-500">2-year coverage</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-8 h-8 text-rashford-red mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Returns</p>
                <p className="text-xs text-gray-500">30-day policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-16">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="tab-content active"
              >
                {activeTab === 'description' && (
                  <div className="prose max-w-none">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                    
                    {product.features && (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Features & Benefits</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {product.features.map((feature, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'specifications' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(product.specifications || {}).map(([key, value], index) => (
                        <div key={index} className="border-b border-gray-200 pb-3">
                          <dt className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            {key}
                          </dt>
                          <dd className="text-lg text-gray-900 mt-1">{value}</dd>
                        </div>
                      ))}
                    </div>

                    {product.shipping && (
                      <div className="mt-8">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-medium text-gray-900 mb-2">Weight</h5>
                            <p className="text-gray-700">{product.shipping.weight} kg</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-medium text-gray-900 mb-2">Dimensions</h5>
                            <p className="text-gray-700">
                              {product.shipping.dimensions.length} × {product.shipping.dimensions.width} × {product.shipping.dimensions.height} cm
                            </p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h5 className="font-medium text-gray-900 mb-2">Delivery</h5>
                            <p className="text-gray-700">{product.shipping.estimatedDelivery}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
                      <button
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="btn-primary"
                      >
                        Write a Review
                      </button>
                    </div>

                    {/* Review Summary */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-8">
                      <div className="flex items-center space-x-6">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-gray-900">{product.rating}</div>
                          <div className="flex items-center justify-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-5 h-5 ${
                                  i < Math.floor(product.rating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Based on {product.reviewCount} reviews
                          </p>
                        </div>
                        <div className="flex-1">
                          {[5, 4, 3, 2, 1].map((rating) => {
                            const count = Math.floor(Math.random() * 20) + 1;
                            const percentage = (count / product.reviewCount) * 100;
                            return (
                              <div key={rating} className="flex items-center space-x-2 mb-1">
                                <span className="text-sm text-gray-600 w-8">{rating}★</span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-yellow-400 h-2 rounded-full"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-gray-600 w-8">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Review Form */}
                    <AnimatePresence>
                      {showReviewForm && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-gray-50 rounded-lg p-6 mb-8"
                        >
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Write Your Review</h4>
                          <form onSubmit={handleReviewSubmit} className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rating
                              </label>
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <button
                                    key={rating}
                                    type="button"
                                    onClick={() => setReviewForm(prev => ({ ...prev, rating }))}
                                    className="p-1"
                                  >
                                    <Star
                                      className={`w-6 h-6 ${
                                        rating <= reviewForm.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Review Title
                              </label>
                              <input
                                type="text"
                                value={reviewForm.title}
                                onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
                                placeholder="Summarize your experience"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Review
                              </label>
                              <textarea
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
                                placeholder="Share your thoughts about this product"
                              />
                            </div>
                            <div className="flex space-x-3">
                              <button type="submit" className="btn-primary">
                                Submit Review
                              </button>
                              <button
                                type="button"
                                onClick={() => setShowReviewForm(false)}
                                className="btn-secondary"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Reviews List */}
                    <div className="space-y-6">
                      {product.reviews && product.reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-rashford-red rounded-full flex items-center justify-center text-white font-semibold">
                                {review.userName.charAt(0)}
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">{review.userName}</h5>
                                <div className="flex items-center space-x-2">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 ${
                                          i < review.rating
                                            ? 'text-yellow-400 fill-current'
                                            : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500">
                                    {new Date(review.date).toLocaleDateString()}
                                  </span>
                                  {review.verified && (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                      Verified Purchase
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button className="text-gray-400 hover:text-green-600">
                                <ThumbsUp className="w-4 h-4" />
                              </button>
                              <button className="text-gray-400 hover:text-red-600">
                                <ThumbsDown className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Shipping & Returns</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h4>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <Truck className="w-5 h-5 text-rashford-red mt-1" />
                            <div>
                              <h5 className="font-medium text-gray-900">Free Standard Shipping</h5>
                              <p className="text-gray-600">On orders over $100. Delivery in 3-7 business days.</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Zap className="w-5 h-5 text-rashford-red mt-1" />
                            <div>
                              <h5 className="font-medium text-gray-900">Express Shipping</h5>
                              <p className="text-gray-600">$15.99. Delivery in 1-2 business days.</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Globe className="w-5 h-5 text-rashford-red mt-1" />
                            <div>
                              <h5 className="font-medium text-gray-900">International Shipping</h5>
                              <p className="text-gray-600">Available to 24+ countries. Rates calculated at checkout.</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Returns & Exchanges</h4>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <RotateCcw className="w-5 h-5 text-rashford-red mt-1" />
                            <div>
                              <h5 className="font-medium text-gray-900">30-Day Returns</h5>
                              <p className="text-gray-600">Return items within 30 days for a full refund.</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <Shield className="w-5 h-5 text-rashford-red mt-1" />
                            <div>
                              <h5 className="font-medium text-gray-900">Quality Guarantee</h5>
                              <p className="text-gray-600">All products are quality checked before shipping.</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <CreditCard className="w-5 h-5 text-rashford-red mt-1" />
                            <div>
                              <h5 className="font-medium text-gray-900">Easy Refunds</h5>
                              <p className="text-gray-600">Refunds processed within 3-5 business days.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Return Policy Details</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li>• Items must be in original condition with tags attached</li>
                        <li>• Electronics must include all original accessories and packaging</li>
                        <li>• Custom or personalized items cannot be returned</li>
                        <li>• Return shipping is free for defective items</li>
                        <li>• Customer pays return shipping for change of mind returns</li>
                      </ul>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Related Products */}
        {relatedProductsFiltered.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProductsFiltered.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-lg shadow-lg overflow-hidden card-hover group relative"
                >
                  {/* Product Badges */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {relatedProduct.isNew && (
                      <span className="product-badge new">New</span>
                    )}
                    {relatedProduct.isOnSale && (
                      <span className="product-badge sale">
                        -{relatedProduct.discountPercentage}%
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(relatedProduct);
                    }}
                    className="wishlist-button"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isInWishlist(relatedProduct.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'
                      }`}
                    />
                  </button>

                  {/* Product Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-48 object-cover product-image"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        onClick={() => onNavigate('product-details', relatedProduct)}
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
                        {relatedProduct.brand}
                      </span>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600 ml-1">
                          {relatedProduct.rating}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <span className="text-lg font-bold text-rashford-red">
                          ${relatedProduct.price}
                        </span>
                        {relatedProduct.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${relatedProduct.originalPrice}
                          </span>
                        )}
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(relatedProduct);
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
      </div>
    </div>
  );
}