"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  User,
  Package,
  Heart,
  Settings,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Star,
  Truck,
  Calendar,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  Filter,
  Search,
  ChevronDown,
  Award,
  Gift,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
  ShoppingBag,
  DollarSign,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "react-hot-toast";

interface UserDashboardProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
  wishlistItems: any[];
  products: any[];
}
interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
}
export default function UserDashboard({
  user,
  onNavigate,
  wishlistItems,
  products,
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [orderFilter, setOrderFilter] = useState("all");
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  });

  const { updateProfile } = useAuth();
  const { addToCart } = useCart();
  const { removeFromWishlist } = useWishlist();

  // Mock data for demonstration
  const [orders] = useState([
    {
      id: "ORD-001",
      date: "2024-01-20",
      status: "delivered",
      total: 299.99,
      items: 3,
      trackingNumber: "TRK123456789",
      estimatedDelivery: "2024-01-25",
      items_detail: [
        {
          name: "3D Printed Smart Home Hub",
          price: 299.99,
          quantity: 1,
          image:
            "https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg?auto=compress&cs=tinysrgb&w=200",
        },
      ],
    },
    {
      id: "ORD-002",
      date: "2024-01-18",
      status: "shipped",
      total: 189.98,
      items: 2,
      trackingNumber: "TRK987654321",
      estimatedDelivery: "2024-01-23",
      items_detail: [
        {
          name: "Wireless Charging Pad 3D",
          price: 89.99,
          quantity: 1,
          image:
            "https://images.pexels.com/photos/163016/cellular-phone-charge-charging-163016.jpeg?auto=compress&cs=tinysrgb&w=200",
        },
        {
          name: "Smart Kitchen Scale Pro",
          price: 99.99,
          quantity: 1,
          image:
            "https://images.pexels.com/photos/6195129/pexels-photo-6195129.jpeg?auto=compress&cs=tinysrgb&w=200",
        },
      ],
    },
    {
      id: "ORD-003",
      date: "2024-01-15",
      status: "processing",
      total: 449.97,
      items: 3,
      trackingNumber: null,
      estimatedDelivery: "2024-01-28",
      items_detail: [
        {
          name: "LED Smart Bulb Set",
          price: 199.99,
          quantity: 1,
          image:
            "https://images.pexels.com/photos/1095814/pexels-photo-1095814.jpeg?auto=compress&cs=tinysrgb&w=200",
        },
        {
          name: "Smart Thermostat Touch",
          price: 249.98,
          quantity: 1,
          image:
            "https://images.pexels.com/photos/11489846/pexels-photo-11489846.jpeg?auto=compress&cs=tinysrgb&w=200",
        },
      ],
    },
  ]);

  const [addresses] = useState([
    {
      id: 1,
      type: "home",
      name: "Home Address",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "United States",
      isDefault: true,
    },
    {
      id: 2,
      type: "work",
      name: "Work Address",
      street: "456 Business Ave",
      city: "New York",
      state: "NY",
      zipCode: "10002",
      country: "United States",
      isDefault: false,
    },
  ]);

  const [paymentMethods] = useState([
    {
      id: 1,
      type: "credit",
      brand: "Visa",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: 2,
      type: "credit",
      brand: "Mastercard",
      last4: "8888",
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
    },
  ]);

  const filteredOrders = orders.filter((order) => {
    if (orderFilter === "all") return true;
    return order.status === orderFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "shipped":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "processing":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-600" />;
    }
  };
  type OrderStatus = "delivered" | "shipped" | "processing" | "cancelled";

  const getStatusColor = (status: OrderStatus | string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      setShowEditProfile(false);
    } catch (error) {
      // Error handled in context
    }
  };

  const handleMoveToCart = (item: WishlistItem) => {
    const product = products.find((p) => p.id === item.productId);
    if (product) {
      addToCart(product);
      removeFromWishlist(item.productId);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "orders", label: "Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "payment", label: "Payment Methods", icon: CreditCard },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const stats = [
    {
      id: 1,
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      id: 2,
      title: "Total Spent",
      value: `₦${orders
        .reduce((sum, order) => sum + order.total, 0)
        .toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      id: 3,
      title: "Wishlist Items",
      value: wishlistItems.length,
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      id: 4,
      title: "Loyalty Points",
      value: user?.loyaltyPoints || 0,
      icon: Award,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-rashford-red rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name || "User"}!
              </h1>
              <p className="text-gray-600">
                Manage your account and track your orders
              </p>
            </div>
          </div>
          {/* Membership Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-rashford-gold to-yellow-400 text-rashford-dark px-4 py-2 rounded-full">
            <Award className="w-4 h-4" />
            <span className="font-semibold capitalize">
              {user?.membershipTier || "Bronze"} Member
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="dashboard-sidebar p-6">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`dashboard-menu-item w-full text-left flex items-center space-x-3 ${
                          activeTab === tab.id ? "active" : ""
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* Overview Tab */}
              {activeTab === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <motion.div
                          key={stat.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white rounded-lg shadow-lg p-6"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600">
                                {stat.title}
                              </p>
                              <p className="text-2xl font-bold text-gray-900">
                                {stat.value}
                              </p>
                            </div>
                            <div className={`p-3 rounded-full ${stat.bgColor}`}>
                              <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Recent Orders
                      </h2>
                      <button
                        onClick={() => setActiveTab("orders")}
                        className="text-rashford-red hover:text-rashford-red/80 font-medium"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(order.status)}
                            <div>
                              <p className="font-medium text-gray-900">
                                Order {order.id}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              ₦{order.total}
                            </p>
                            <span
                              className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Wishlist Preview */}
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">
                        Wishlist
                      </h2>
                      <button
                        onClick={() => setActiveTab("wishlist")}
                        className="text-rashford-red hover:text-rashford-red/80 font-medium"
                      >
                        View All
                      </button>
                    </div>
                    {wishlistItems.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {wishlistItems.slice(0, 3).map((item) => (
                          <div
                            key={item.id}
                            className="border border-gray-200 rounded-lg p-4"
                          >
                            <Image
                              width={200}
                              height={200}
                              src={item.image}
                              alt={item.name}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                              {item.name}
                            </h3>
                            <p className="text-lg font-bold text-rashford-red">
                              ₦{item.price}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Your wishlist is empty</p>
                        <button
                          onClick={() => onNavigate("shop")}
                          className="mt-4 btn-primary"
                        >
                          Start Shopping
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
              {/* Orders Tab */}
              {activeTab === "orders" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Order History
                    </h2>
                    <div className="flex items-center space-x-4">
                      <select
                        value={orderFilter}
                        onChange={(e) => setOrderFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
                      >
                        <option value="all">All Orders</option>
                        <option value="delivered">Delivered</option>
                        <option value="shipped">Shipped</option>
                        <option value="processing">Processing</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            {getStatusIcon(order.status)}
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                Order {order.id}
                              </h3>
                              <p className="text-sm text-gray-600">
                                Placed on{" "}
                                {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-gray-900">
                              ₦{order.total}
                            </p>
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-3 mb-4">
                          {order.items_detail.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
                            >
                              <Image
                                width={64}
                                height={64}
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {item.name}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                              <p className="font-semibold text-gray-900">
                                ₦{item.price}
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Order Actions */}
                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-4">
                            {order.trackingNumber && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Tracking:</span>{" "}
                                {order.trackingNumber}
                              </div>
                            )}
                            {order.estimatedDelivery && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">
                                  Est. Delivery:
                                </span>{" "}
                                {new Date(
                                  order.estimatedDelivery
                                ).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="btn-secondary text-sm px-4 py-2">
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                            {order.status === "delivered" && (
                              <button className="btn-primary text-sm px-4 py-2">
                                <Download className="w-4 h-4 mr-2" />
                                Download Invoice
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {filteredOrders.length === 0 && (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No orders found
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {orderFilter === "all"
                          ? "You haven't placed any orders yet."
                          : `No orders with status "${orderFilter}" found.`}
                      </p>
                      <button
                        onClick={() => onNavigate("shop")}
                        className="btn-primary"
                      >
                        Start Shopping
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
              {/* Wishlist Tab */}
              {activeTab === "wishlist" && (
                <motion.div
                  key="wishlist"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      My Wishlist
                    </h2>
                    <p className="text-gray-600">
                      {wishlistItems.length} items
                    </p>
                  </div>

                  {wishlistItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlistItems.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                        >
                          <div className="relative">
                            <Image
                              width={200}
                              height={200}
                              src={item.image}
                              alt={item.name}
                              className="w-full h-48 object-cover"
                            />
                            <button
                              onClick={() => removeFromWishlist(item.productId)}
                              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                              {item.name}
                            </h3>
                            <p className="text-lg font-bold text-rashford-red mb-3">
                              ${item.price}
                            </p>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleMoveToCart(item)}
                                className="flex-1 btn-primary text-sm py-2"
                              >
                                Add to Cart
                              </button>
                              <button
                                onClick={() =>
                                  onNavigate("product-details", {
                                    id: item.productId,
                                  })
                                }
                                className="btn-secondary text-sm py-2 px-4"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Your wishlist is empty
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Save items you love for later by adding them to your
                        wishlist.
                      </p>
                      <button
                        onClick={() => onNavigate("shop")}
                        className="btn-primary"
                      >
                        Browse Products
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Profile Information
                    </h2>
                    <button
                      onClick={() => setShowEditProfile(!showEditProfile)}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  </div>

                  {!showEditProfile ? (
                    <div className="space-y-6">
                      <div className="flex items-center space-x-6">
                        <div className="w-24 h-24 bg-rashford-red rounded-full flex items-center justify-center text-white text-3xl font-bold">
                          {user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {user?.name}
                          </h3>
                          <p className="text-gray-600">{user?.email}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Award className="w-4 h-4 text-rashford-gold" />
                            <span className="text-sm font-medium text-rashford-gold capitalize">
                              {user?.membershipTier} Member
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Personal Information
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Full Name
                              </label>
                              <p className="text-gray-900">
                                {user?.name || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Email
                              </label>
                              <p className="text-gray-900">
                                {user?.email || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Phone
                              </label>
                              <p className="text-gray-900">
                                {user?.phone || "Not provided"}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Member Since
                              </label>
                              <p className="text-gray-900">
                                {user?.createdAt
                                  ? new Date(
                                      user.createdAt
                                    ).toLocaleDateString()
                                  : "Not available"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">
                            Account Stats
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Total Orders
                              </label>
                              <p className="text-gray-900">{orders.length}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Total Spent
                              </label>
                              <p className="text-gray-900">
                                ₦
                                {orders
                                  .reduce((sum, order) => sum + order.total, 0)
                                  .toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Loyalty Points
                              </label>
                              <p className="text-gray-900">
                                {user?.loyaltyPoints || 0} points
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-gray-600">
                                Membership Tier
                              </label>
                              <p className="text-gray-900 capitalize">
                                {user?.membershipTier || "Bronze"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                email: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={profileData.phone}
                            onChange={(e) =>
                              setProfileData((prev) => ({
                                ...prev,
                                phone: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <button type="submit" className="btn-primary">
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowEditProfile(false)}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
              {/* Other tabs would be implemented similarly */}
              {activeTab === "addresses" && (
                <motion.div
                  key="addresses"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Saved Addresses
                    </h2>
                    <button className="btn-primary flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Address
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="border border-gray-200 rounded-lg p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold text-gray-900">
                            {address.name}
                          </h3>
                          {address.isDefault && (
                            <span className="bg-rashford-red text-white px-2 py-1 rounded-full text-xs font-medium">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="text-gray-600 space-y-1">
                          <p>{address.street}</p>
                          <p>
                            {address.city}, {address.state} {address.zipCode}
                          </p>
                          <p>{address.country}</p>
                        </div>
                        <div className="flex items-center space-x-2 mt-4">
                          <button className="btn-secondary text-sm px-3 py-1">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </button>
                          <button className="text-red-600 hover:text-red-800 text-sm px-3 py-1">
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              {activeTab === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Payment Methods
                    </h2>
                    <button className="btn-primary flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Payment Method
                    </button>
                  </div>

                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="border border-gray-200 rounded-lg p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <CreditCard className="w-6 h-6 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {method.brand} ending in {method.last4}
                              </p>
                              <p className="text-sm text-gray-600">
                                Expires {method.expiryMonth}/{method.expiryYear}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {method.isDefault && (
                              <span className="bg-rashford-red text-white px-2 py-1 rounded-full text-xs font-medium">
                                Default
                              </span>
                            )}
                            <button className="btn-secondary text-sm px-3 py-1">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-800 text-sm px-3 py-1">
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                    Account Settings
                  </h2>

                  <div className="space-y-6">
                    {/* Notifications */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Notifications
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700">
                            Email notifications
                          </span>
                          <input
                            type="checkbox"
                            defaultChecked={user?.preferences?.notifications}
                            className="rounded border-gray-300 text-rashford-red focus:ring-rashford-red"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700">
                            Marketing emails
                          </span>
                          <input
                            type="checkbox"
                            defaultChecked={user?.preferences?.marketing}
                            className="rounded border-gray-300 text-rashford-red focus:ring-rashford-red"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700">Order updates</span>
                          <input
                            type="checkbox"
                            defaultChecked={true}
                            className="rounded border-gray-300 text-rashford-red focus:ring-rashford-red"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Privacy */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Privacy
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700">
                            Make profile public
                          </span>
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-rashford-red focus:ring-rashford-red"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-gray-700">
                            Share purchase history
                          </span>
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-rashford-red focus:ring-rashford-red"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Preferences
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Currency
                          </label>
                          <select
                            defaultValue={user?.preferences?.currency || "₦"}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
                          >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="NGN">NGN (₦)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Language
                          </label>
                          <select
                            defaultValue={user?.preferences?.language || "en"}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-red-600 mb-4">
                        Danger Zone
                      </h3>
                      <div className="space-y-3">
                        <button className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-red-600">
                                Delete Account
                              </h4>
                              <p className="text-sm text-red-500">
                                Permanently delete your account and all data
                              </p>
                            </div>
                            <Trash2 className="w-5 h-5 text-red-500" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
