"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  Package,
  Star,
  Truck,
  Shield,
  Zap,
  Globe,
  ChevronDown,
  Home,
  Grid3X3,
  Headphones,
  Coffee,
  Lightbulb,
  Camera,
  Lock,
  Speaker,
  Wind,
} from "lucide-react";
import Image from "next/image";
type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  // add more fields as needed
};
interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, data?: any) => void;
  onAuthClick: (mode: "login" | "register") => void;
  onLogout: () => void;
  isAuthenticated: boolean;
  user: any;
  cartCount: number;
  wishlistCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  categories: any[];
  products: Product[];
}

export default function Navbar({
  currentPage,
  onNavigate,
  onAuthClick,
  onLogout,
  isAuthenticated,
  user,
  cartCount,
  wishlistCount,
  searchQuery,
  onSearchChange,
  categories,
  products,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results = products
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
        )
        .slice(0, 5);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, products]);
  const icons: Record<string, LucideIcon> = {
    electronics: Zap,
    "smart-home": Home,
    accessories: Headphones,
    lighting: Lightbulb,
    security: Shield,
    audio: Speaker,
    house: Home,
    kitchen: Coffee,
    climate: Wind,
    "air-quality": Wind,
  };
  const getCategoryIcon = (categoryId: string): LucideIcon => {
    return icons[categoryId] || Grid3X3;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate("shop");
      setIsSearchOpen(false);
    }
  };

  const handleProductClick = (product: any) => {
    onNavigate("product-details", product);
    setIsSearchOpen(false);
    setSearchResults([]);
    onSearchChange("");
  };

  const navItems = [
    // { id: "home", label: "Home", icon: Home },
    { id: "shop", label: "Shop", icon: Grid3X3 },
    { id: "categories", label: "Categories", icon: Grid3X3, hasDropdown: true },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white"
        }`}
      >
        {/* promo banner */}
        <div className="promo-banner overflow-hidden bg-gradient-to-r from-rashford-red to-yellow-400">
          <div className="container mx-auto px-4 marquee">
            <div className="relative w-full h-10 flex items-center">
              <div className="flex items-center gap-4 text-sm whitespace-nowrap animate-marquee">
                <Truck className="w-4 h-4" />
                <span>Free shipping on orders over $100</span>
                <span className="mx-4">|</span>
                <Shield className="w-4 h-4" />
                <span>30-day money-back guarantee</span>
                <span className="mx-4">|</span>
                <Truck className="w-4 h-4" />
                <span>Free shipping on orders over $100</span>
                <span className="mx-4">|</span>
                <Shield className="w-4 h-4" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
            <div className="relative w-full h-10 items-center hidden sm:flex">
              <div className="flex items-center gap-4 text-sm whitespace-nowrap animate-marquee">
                <span className="mx-4">|</span>

                <Truck className="w-4 h-4" />
                <span>Free shipping on orders over $100</span>
                <span className="mx-4">|</span>
                <Shield className="w-4 h-4" />
                <span>30-day money-back guarantee</span>
                <span className="mx-4">|</span>
                <Truck className="w-4 h-4" />
                <span>Free shipping on orders over $100</span>
                <span className="mx-4">|</span>
                <Shield className="w-4 h-4" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
        {/* Main Navigation */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => onNavigate("home")}
            >
              {/* <Package className="w-5 h-5 text-white" /> */}
              <Image
                src="/RR3logo2.svg"
                alt="Rashford3D Logo"
                width={80}
                height={80}
                className="w-[90px] h-[90px] md:w-[80px] md:h-[80px]"
              />
              <span className="text-xl font-bold gradient-text hidden  md:inline">
                Rashford3D
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.id} className="relative group">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => !item.hasDropdown && onNavigate(item.id)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                        currentPage === item.id
                          ? "bg-rashford-red text-white"
                          : "text-gray-700 hover:text-rashford-red hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{item.label}</span>
                      {item.hasDropdown && <ChevronDown className="w-3 h-3" />}
                    </motion.button>

                    {/* Categories Dropdown */}
                    {item.hasDropdown && (
                      <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-lg shadow-xl border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-3">
                            Categories
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {categories.map((category) => {
                              const Icon = getCategoryIcon(category.id);
                              return (
                                <motion.button
                                  key={category.id}
                                  whileHover={{ scale: 1.02 }}
                                  onClick={() => {
                                    onNavigate("shop");
                                    // Set category filter
                                  }}
                                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Icon className="w-4 h-4 text-rashford-red" />
                                  <span className="text-sm font-medium">
                                    {category.name}
                                  </span>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
              <form onSubmit={handleSearchSubmit} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </form>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border z-50"
                  >
                    <div className="p-2">
                      {searchResults.map((product) => (
                        <motion.div
                          key={product.id}
                          whileHover={{ backgroundColor: "#f8f9fa" }}
                          onClick={() => handleProductClick(product)}
                          className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer"
                        >
                          <Image
                            width={48}
                            height={48}
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {product.name}
                            </h4>
                            <p className="text-sm text-gray-500">
                              ${product.price}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              {/* Mobile Search */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSearchOpen(true)}
                className="md:hidden p-2 text-gray-700 hover:text-rashford-red transition-colors"
              >
                <Search className="w-5 h-5" />
              </motion.button>

              {/* Wishlist */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onNavigate("dashboard")}
                className="relative p-2 text-gray-700 hover:text-rashford-red transition-colors"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="notification-badge">{wishlistCount}</span>
                )}
              </motion.button>
              {/* Cart */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onNavigate("cart")}
                className="relative p-2 text-gray-700 hover:text-rashford-red transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="notification-badge">{cartCount}</span>
                )}
              </motion.button>

              {/* User Profile */}
              {isAuthenticated ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-rashford-red transition-colors"
                  >
                    {user?.avatar ? (
                      <Image
                        width={24}
                        height={24}
                        src={user.avatar}
                        alt={user.name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                    <ChevronDown className="w-3 h-3" />
                  </motion.button>

                  {/* Profile Dropdown */}
                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border z-50"
                      >
                        <div className="p-2">
                          <div className="px-3 py-2 border-b">
                            <p className="font-medium text-gray-900">
                              {user.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user.email}
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ backgroundColor: "#f8f9fa" }}
                            onClick={() => {
                              onNavigate("dashboard");
                              setIsProfileOpen(false);
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-700 hover:text-rashford-red transition-colors rounded-lg"
                          >
                            <User className="w-4 h-4" />
                            <span>Dashboard</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ backgroundColor: "#f8f9fa" }}
                            onClick={() => {
                              onLogout();
                              setIsProfileOpen(false);
                            }}
                            className="w-full flex items-center space-x-2 px-3 py-2 text-left text-gray-700 hover:text-red-600 transition-colors rounded-lg"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Logout</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-2 hidden md:flex">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onAuthClick("login")}
                      className="px-4 py-2 text-rashford-red hover:text-rashford-red/80 transition-colors"
                    >
                      Login
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onAuthClick("register")}
                      className="px-4 py-2 bg-rashford-red text-white rounded-lg hover:bg-rashford-red/90 transition-colors"
                    >
                      Sign Up
                    </motion.button>
                  </div>
                </>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-rashford-red transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t flex flex-col justify-center items-center space-y-4"
            >
              <div className="space-y-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onNavigate(item.id);
                        setIsMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        currentPage === item.id
                          ? "bg-rashford-red text-white"
                          : "text-gray-700 hover:text-rashford-red hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
              {/* Auth mobile */}
              <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center space-x-4 px-4 py-2 md:hidden">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAuthClick("login")}
                    className="px-4 py-2 text-rashford-red hover:text-rashford-red/80 transition-colors"
                  >
                    Login
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onAuthClick("register")}
                    className="px-4 py-2 bg-rashford-red text-white rounded-lg hover:bg-rashford-red/90 transition-colors"
                  >
                    Sign Up
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              className="bg-white p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3">
                <form onSubmit={handleSearchSubmit} className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => onSearchChange(e.target.value)}
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
                      autoFocus
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </form>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Mobile Search Results */}
              <AnimatePresence>
                {searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 space-y-2"
                  >
                    {searchResults.map((product) => (
                      <motion.div
                        key={product.id}
                        whileHover={{ backgroundColor: "#f8f9fa" }}
                        onClick={() => handleProductClick(product)}
                        className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer"
                      >
                        <Image
                          width={48}
                          height={48}
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            ${product.price}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for dropdowns */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsProfileOpen(false);
          }}
        />
      )}
    </>
  );
}
