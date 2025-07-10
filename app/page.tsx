"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useProducts } from "@/contexts/ProductContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomePage from "@/components/HomePage";
import ShopPage from "@/components/ShopPage";
import ProductDetails from "@/components/ProductDetails";
import CartPage from "@/components/CartPage";
import CheckoutPage from "@/components/CheckoutPage";
import UserDashboard from "@/components/UserDashboard";
import AuthModal from "@/components/AuthModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import { toast } from "react-hot-toast";
type OrderConfirmation = {
  orderId: string;
  total: number;
  itemCount: number;
};

export default function Home() {
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  // const [authMode, setAuthMode] = useState("login");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [sortBy, setSortBy] = useState("featured");
  const [orderConfirmation, setOrderConfirmation] =
    useState<OrderConfirmation | null>(null);

  const { user, isAuthenticated, logout } = useAuth();
  const { cartItems, cartCount, getCartTotal } = useCart();
  const { wishlistItems, wishlistCount } = useWishlist();
  const {
    products,
    categories,
    isLoading: productsLoading,
    error,
  } = useProducts();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigation = (page: string, data: any = null) => {
    setCurrentPage(page);
    if (page === "product-details" && data) {
      setSelectedProduct(data);
    }
    if (page === "order-confirmation" && data) {
      setOrderConfirmation(data);
    }
  };

  // const handleAuthClick = (mode: string) => {
  //   setAuthMode(mode);
  //   setShowAuthModal(true);
  // };
  const handleAuthClick = (mode: "login" | "register") => {
    setAuthMode(mode);
    setShowAuthModal(true); // show the modal
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    toast.success("Authentication successful!");
  };

  const handleLogout = () => {
    logout();
    setCurrentPage("home");
    toast.success("Logged out successfully!");
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <HomePage
            onNavigate={handleNavigation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            products={products}
            categories={categories}
            isLoading={productsLoading}
          />
        );
      case "shop":
        return (
          <ShopPage
            onNavigate={handleNavigation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            products={products}
            categories={categories}
            isLoading={productsLoading}
          />
        );
      case "product-details":
        return (
          <ProductDetails
            product={selectedProduct}
            onNavigate={handleNavigation}
            onClose={() => setCurrentPage("shop")}
            relatedProducts={products}
          />
        );
      case "cart":
        return (
          <CartPage
            onNavigate={handleNavigation}
            cartItems={cartItems}
            cartTotal={getCartTotal()}
            products={products}
          />
        );
      case "checkout":
        return (
          <CheckoutPage
            onNavigate={handleNavigation}
            cartItems={cartItems}
            cartTotal={getCartTotal()}
            user={user}
            onOrderComplete={(orderData) => {
              setOrderConfirmation(orderData);
              setCurrentPage("order-confirmation");
            }}
          />
        );
      case "dashboard":
        return (
          <UserDashboard
            user={user}
            onNavigate={handleNavigation}
            wishlistItems={wishlistItems}
            products={products}
          />
        );
      case "order-confirmation":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen bg-gray-50 py-20"
          >
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Order Confirmed!
                  </h1>
                  <p className="text-gray-600">
                    Thank you for your purchase. Your order has been
                    successfully placed.
                  </p>
                </div>

                {orderConfirmation && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h2 className="font-semibold text-gray-900 mb-2">
                      Order Details
                    </h2>
                    <p className="text-gray-600">
                      Order ID: {orderConfirmation.orderId}
                    </p>
                    <p className="text-gray-600">
                      Total: ₦{orderConfirmation.total}
                    </p>
                    <p className="text-gray-600">
                      Items: {orderConfirmation.itemCount}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  <button
                    onClick={() => handleNavigation("dashboard")}
                    className="w-full btn-primary"
                  >
                    View Order History
                  </button>
                  <button
                    onClick={() => handleNavigation("shop")}
                    className="w-full btn-secondary"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        );
      default:
        return (
          <HomePage
            onNavigate={handleNavigation}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            products={products}
            categories={categories}
            isLoading={productsLoading}
          />
        );
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigation}
        onAuthClick={handleAuthClick}
        onLogout={handleLogout}
        isAuthenticated={isAuthenticated}
        user={user}
        cartCount={cartCount}
        wishlistCount={wishlistCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        products={products}
      />
      {/* {renderCurrentPage()} */}

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          onSwitchMode={(mode) => setAuthMode(mode)}
        />
      )}

      <main className="pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer onNavigate={handleNavigation} />

      <AnimatePresence>
        {showAuthModal && (
          <AuthModal
            mode={authMode}
            onClose={() => setShowAuthModal(false)}
            onSuccess={handleAuthSuccess}
            onSwitchMode={setAuthMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
