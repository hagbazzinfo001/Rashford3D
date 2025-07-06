"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Filter,
  Grid,
  List,
  ChevronDown,
  Star,
  Heart,
  ShoppingCart,
  Eye,
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Package,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

interface ShopPageProps {
  onNavigate: (page: string, data?: any) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  products: any[];
  categories: any[];
  isLoading: boolean;
}

export default function ShopPage({
  onNavigate,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
  products,
  categories,
  isLoading,
}: ShopPageProps) {
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Get unique brands from products
  const brands = useMemo(() => {
    const brandSet = new Set(products.map((p) => p.brand));
    return Array.from(brandSet);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          product.brand.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    // Rating filter
    if (selectedRating > 0) {
      filtered = filtered.filter((product) => product.rating >= selectedRating);
    }

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter((product) => product.inStock);
    }

    // Sale filter
    if (onSaleOnly) {
      filtered = filtered.filter((product) => product.isOnSale);
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // featured
        filtered.sort(
          (a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
        );
    }

    return filtered;
  }, [
    products,
    searchQuery,
    selectedCategory,
    priceRange,
    selectedBrands,
    selectedRating,
    inStockOnly,
    onSaleOnly,
    sortBy,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts.length]);

  const handleBrandToggle = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSelectedBrands([]);
    setSelectedRating(0);
    setInStockOnly(false);
    setOnSaleOnly(false);
    onCategoryChange("all");
    onPriceRangeChange([0, 10000]);
    onSearchChange("");
  };

  const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "name", label: "Name: A to Z" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="h-96 bg-gray-300 rounded-lg"></div>
              <div className="md:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="h-80 bg-gray-300 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
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
          <button
            onClick={() => onNavigate("home")}
            className="breadcrumb-item"
          >
            Home
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="text-rashford-red">Shop</span>
          {selectedCategory && selectedCategory !== "all" && (
            <>
              <span className="breadcrumb-separator">/</span>
              <span className="text-rashford-red capitalize">
                {categories.find((c) => c.id === selectedCategory)?.name ||
                  selectedCategory}
              </span>
            </>
          )}
        </div>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {selectedCategory && selectedCategory !== "all"
                ? categories.find((c) => c.id === selectedCategory)?.name ||
                  "Shop"
                : "All Products"}
            </h1>
            <p className="text-gray-600">
              {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""} found
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            {/* View Toggle */}
            <div className="view-toggle">
              <button
                onClick={() => setViewMode("grid")}
                className={`view-toggle-button ${
                  viewMode === "grid" ? "active" : ""
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`view-toggle-button ${
                  viewMode === "list" ? "active" : ""
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="sort-dropdown">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-primary flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div
            className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="search-filters">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-rashford-red hover:text-rashford-red/80"
                >
                  Clear All
                </button>
              </div>

              {/* Search */}
              <div className="filter-section">
                <h4>Search</h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="filter-section">
                <h4>Categories</h4>
                <div className="space-y-2">
                  <label className="filter-option">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === "all"}
                      onChange={() => onCategoryChange("all")}
                    />
                    <span>All Categories</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="filter-option">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => onCategoryChange(category.id)}
                      />
                      <span>
                        {category.name} ({category.productCount})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="filter-section">
                <h4>Price Range</h4>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) =>
                        onPriceRangeChange([
                          parseInt(e.target.value) || 0,
                          priceRange[1],
                        ])
                      }
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Min"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) =>
                        onPriceRangeChange([
                          priceRange[0],
                          parseInt(e.target.value) || 10000,
                        ])
                      }
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Max"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="50"
                    value={priceRange[1]}
                    onChange={(e) =>
                      onPriceRangeChange([
                        priceRange[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="price-slider w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>$0</span>
                    <span>$10,000+</span>
                  </div>
                </div>
              </div>

              {/* Brands */}
              <div className="filter-section">
                <h4>Brands</h4>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="filter-option">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandToggle(brand)}
                      />
                      <span>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div className="filter-section">
                <h4>Minimum Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="filter-option">
                      <input
                        type="radio"
                        name="rating"
                        checked={selectedRating === rating}
                        onChange={() => setSelectedRating(rating)}
                      />
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="ml-2">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div className="filter-section">
                <h4>Additional Filters</h4>
                <div className="space-y-2">
                  <label className="filter-option">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                    />
                    <span>In Stock Only</span>
                  </label>
                  <label className="filter-option">
                    <input
                      type="checkbox"
                      checked={onSaleOnly}
                      onChange={(e) => setOnSaleOnly(e.target.checked)}
                    />
                    <span>On Sale</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <Package className="empty-state-icon" />
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button onClick={clearFilters} className="mt-4">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div
                  // className={viewMode === "grid" ? "product-grid" : "space-y-4"}
                  className={`grid gap-4 ${
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-[auto-fill,minmax(250px,1fr)]"
                      : "space-y-4"
                  }`}
                >
                  {paginatedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`bg-white rounded-lg shadow-lg overflow-hidden card-hover group relative ${
                        viewMode === "list" ? "list-view" : ""
                      }`}
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
                        {product.isFeatured && (
                          <span className="product-badge featured">
                            Featured
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
                            isInWishlist(product.id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-400"
                          }`}
                        />
                      </button>

                      {/* Product Image */}
                      <div
                        className={`relative overflow-hidden ${
                          viewMode === "list" ? "w-48 h-48" : "h-64"
                        }`}
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover product-image"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ opacity: 1, scale: 1 }}
                            onClick={() =>
                              onNavigate("product-details", product)
                            }
                            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Quick View
                          </motion.button>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div
                        className={`py-6 px-4 ${
                          viewMode === "list" ? "flex-1" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-500 uppercase tracking-wide">
                            {product.brand}
                          </span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">
                              {product.rating} ({product.reviewCount})
                            </span>
                          </div>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.name}
                        </h3>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>

                        {/* Stock Status */}
                        <div className="flex items-center mb-4">
                          <div
                            className={`stock-indicator ${
                              product.inStock
                                ? product.stockQuantity > 10
                                  ? "in-stock"
                                  : "low-stock"
                                : "out-of-stock"
                            }`}
                          >
                            <div className="stock-dot"></div>
                            <span>
                              {product.inStock
                                ? product.stockQuantity > 10
                                  ? "In Stock"
                                  : `Only ${product.stockQuantity} left`
                                : "Out of Stock"}
                            </span>
                          </div>
                        </div>

                        <div className="flex  items-center justify-between ">
                          <div className="flex flex-col items-start ">
                            <span className="text-2xl font-bold text-rashford-red">
                              &#8358;{product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-lg text-gray-500 line-through">
                                &#8358;{product.originalPrice}
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
                            disabled={!product.inStock}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                              !product.inStock
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : isInCart(product.id)
                                ? "bg-green-100 text-green-700"
                                : "bg-rashford-red text-white hover:bg-rashford-red/90"
                            }`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            {!product.inStock
                              ? "Out of Stock"
                              : isInCart(product.id)
                              ? "Added"
                              : "Add to Cart"}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination ">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="pagination-button"
                    >
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const page = index + 1;
                      if (
                        page === 1 ||
                        page === totalPages ||
                        (page >= currentPage - 2 && page <= currentPage + 2)
                      ) {
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`pagination-button ${
                              currentPage === page ? "active" : ""
                            }`}
                          >
                            {page}
                          </button>
                        );
                      } else if (
                        page === currentPage - 3 ||
                        page === currentPage + 3
                      ) {
                        return (
                          <span key={page} className="px-2">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="pagination-button"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

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
              <RotateCcw className="trust-indicator-icon" />
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

      {/* Mobile Filter Overlay */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setShowFilters(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="bg-white h-full w-80 p-6 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Filter content would be the same as desktop */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
