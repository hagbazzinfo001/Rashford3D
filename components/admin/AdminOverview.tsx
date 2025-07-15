"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Eye,
  Calendar,
} from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import { useOrders } from "@/contexts/OrderContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
export type AdminTab =
  | "overview"
  | "products"
  | "orders"
  | "users"
  | "categories"
  | "analytics"
  | "settings";

interface AdminOverviewProps {
  setActiveTab: (tab: AdminTab) => void;
}

export default function AdminOverview({ setActiveTab }: AdminOverviewProps) {
  const { products } = useProducts();
  const { orders, getOrderStats } = useOrders();

  const stats = getOrderStats();

  const statsCards = [
    {
      title: "Total Revenue",
      value: `₦${stats.totalRevenue.toLocaleString()}`,
      change: "+12.5%",
      changeType: "increase",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Orders",
      value: stats.total.toString(),
      change: "+8.2%",
      changeType: "increase",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Products",
      value: products.length.toString(),
      change: "+3.1%",
      changeType: "increase",
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Active Users",
      value: "1,234",
      change: "-2.4%",
      changeType: "decrease",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  // Mock data for charts
  const salesData = [
    { name: "Jan", sales: 4000, orders: 24 },
    { name: "Feb", sales: 3000, orders: 18 },
    { name: "Mar", sales: 5000, orders: 32 },
    { name: "Apr", sales: 4500, orders: 28 },
    { name: "May", sales: 6000, orders: 38 },
    { name: "Jun", sales: 5500, orders: 35 },
  ];

  const categoryData = [
    { name: "Electronics", value: 60, color: "#811c18" },
    { name: "Home & Kitchen", value: 30, color: "#f4c02c" },
    { name: "Accessories", value: 10, color: "#9c969b" },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="admin-stats-grid">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="admin-stat-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {stat.changeType === "increase" ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === "increase"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      vs last month
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="admin-card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Sales Overview
            </h3>
            <select className="text-sm border border-gray-300 rounded-lg px-3 py-1">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value, name) => [
                  name === "sales" ? `₦${value.toLocaleString()}` : value,
                  name === "sales" ? "Sales" : "Orders",
                ]}
              />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#811c18"
                strokeWidth={2}
                dot={{ fill: "#811c18" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="admin-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Sales by Category
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{category.name}</span>
                </div>
                <span className="text-sm font-medium">{category.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="admin-card"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <button className="text-rashford-red hover:text-rashford-red/80 text-sm font-medium">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Customer
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Total
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{order.userName}</td>
                  <td className="py-3 px-4 font-medium text-gray-900">
                    ₦{order.total.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : order.status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {order.createdAt.toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <button className="text-rashford-red hover:text-rashford-red/80">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="admin-card text-center">
          <Package className="w-12 h-12 text-rashford-red mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">Add New Product</h4>
          <p className="text-sm text-gray-600 mb-4">Create and manage your product catalog</p>
          <button className="btn-admin">Add Product</button>
        </div>
        
        <div className="admin-card text-center">
          <ShoppingCart className="w-12 h-12 text-rashford-red mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">Process Orders</h4>
          <p className="text-sm text-gray-600 mb-4">Manage and fulfill customer orders</p>
          <button className="btn-admin">View Orders</button>
        </div>
        
        <div className="admin-card text-center">
          <TrendingUp className="w-12 h-12 text-rashford-red mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">View Analytics</h4>
          <p className="text-sm text-gray-600 mb-4">Track sales and performance metrics</p>
          <button className="btn-admin">View Reports</button>
        </div>
      </motion.div> */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="admin-card text-center">
          <Package className="w-12 h-12 text-rashford-red mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">Add New Product</h4>
          <p className="text-sm text-gray-600 mb-4">
            Create and manage your product catalog
          </p>
          <button
            className="btn-admin"
            onClick={() => setActiveTab("products")}
          >
            Add Product
          </button>
        </div>

        <div className="admin-card text-center">
          <ShoppingCart className="w-12 h-12 text-rashford-red mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">Process Orders</h4>
          <p className="text-sm text-gray-600 mb-4">
            Manage and fulfill customer orders
          </p>
          <button className="btn-admin" onClick={() => setActiveTab("orders")}>
            View Orders
          </button>
        </div>

        <div className="admin-card text-center">
          <TrendingUp className="w-12 h-12 text-rashford-red mx-auto mb-4" />
          <h4 className="font-semibold text-gray-900 mb-2">View Analytics</h4>
          <p className="text-sm text-gray-600 mb-4">
            Track sales and performance metrics
          </p>
          <button
            className="btn-admin"
            onClick={() => setActiveTab("analytics")}
          >
            View Reports
          </button>
        </div>
      </motion.div>
    </div>
  );
}
