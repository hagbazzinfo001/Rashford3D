"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  Filter,
} from "lucide-react";
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
  AreaChart,
  Area,
} from "recharts";
import { useOrders } from "@/contexts/OrderContext";
import { useProducts } from "@/contexts/ProductContext";

export default function AdminAnalytics() {
  const { orders, getOrderStats } = useOrders();
  const { products } = useProducts();

  const stats = getOrderStats();

  // Mock analytics data
  const salesData = [
    { month: "Jan", revenue: 450000, orders: 24, customers: 18 },
    { month: "Feb", revenue: 380000, orders: 18, customers: 15 },
    { month: "Mar", revenue: 620000, orders: 32, customers: 28 },
    { month: "Apr", revenue: 580000, orders: 28, customers: 24 },
    { month: "May", revenue: 750000, orders: 38, customers: 32 },
    { month: "Jun", revenue: 690000, orders: 35, customers: 29 },
    { month: "Jul", revenue: 820000, orders: 42, customers: 36 },
    { month: "Aug", revenue: 780000, orders: 39, customers: 33 },
    { month: "Sep", revenue: 920000, orders: 48, customers: 41 },
    { month: "Oct", revenue: 850000, orders: 44, customers: 38 },
    { month: "Nov", revenue: 980000, orders: 52, customers: 45 },
    { month: "Dec", revenue: 1100000, orders: 58, customers: 49 },
  ];

  const categoryData = [
    { name: "Electronics", value: 60, revenue: 4200000, color: "#811c18" },
    { name: "Home & Kitchen", value: 30, revenue: 2100000, color: "#f4c02c" },
    { name: "Accessories", value: 10, revenue: 700000, color: "#9c969b" },
  ];

  const topProducts = [
    { name: "3D Printed Smart Home Hub", sales: 156, revenue: 1872000 },
    { name: "LED Smart Bulb Set", sales: 142, revenue: 1136000 },
    { name: "Wireless Charging Pad 3D", sales: 128, revenue: 460800 },
    { name: "Smart Kitchen Scale Pro", sales: 98, revenue: 588000 },
    { name: "Modern Coffee Maker Pro", sales: 76, revenue: 1064000 },
  ];

  const recentActivity = [
    {
      type: "order",
      message: "New order #ORD-001 received",
      time: "2 minutes ago",
    },
    {
      type: "product",
      message: 'Product "Smart Bulb" stock updated',
      time: "15 minutes ago",
    },
    {
      type: "user",
      message: "New user registration: John Doe",
      time: "1 hour ago",
    },
    { type: "order", message: "Order #ORD-002 shipped", time: "2 hours ago" },
    {
      type: "product",
      message: 'New product "Coffee Maker" added',
      time: "3 hours ago",
    },
  ];

  const kpiCards = [
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
      title: "Average Order Value",
      value: `₦${Math.round(
        stats.totalRevenue / stats.total
      ).toLocaleString()}`,
      change: "+8.2%",
      changeType: "increase",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Conversion Rate",
      value: "3.2%",
      change: "+0.5%",
      changeType: "increase",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Customer Retention",
      value: "68%",
      change: "-2.1%",
      changeType: "decrease",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {/* <h2 className="text-2xl font-bold text-gray-900">Sales Analytics</h2> */}
          <p className="text-gray-600">
            Track your business performance and insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent">
            <option>Last 12 months</option>
            <option>Last 6 months</option>
            <option>Last 3 months</option>
            <option>This month</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-admin flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export Report
          </motion.button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="admin-stats-grid">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="admin-stat-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {kpi.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {kpi.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {kpi.changeType === "increase" ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        kpi.changeType === "increase"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {kpi.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">
                      vs last period
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                  <Icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="admin-card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Revenue Trend
            </h3>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-rashford-red rounded-full"></div>
                <span className="text-sm text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `₦${value / 1000}k`} />
              <Tooltip
                formatter={(value) => [`₦${value.toLocaleString()}`, "Revenue"]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#811c18"
                fill="#811c18"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orders Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="admin-card"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Orders & Customers
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Orders</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Customers</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="customers" fill="#10b981" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="admin-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Sales by Category
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
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
                <div className="text-right">
                  <div className="text-sm font-medium">{category.value}%</div>
                  <div className="text-xs text-gray-500">
                    ₦{category.revenue.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="admin-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Top Products
          </h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-500">{product.sales} sales</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ₦{product.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="admin-card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === "order"
                      ? "bg-blue-500"
                      : activity.type === "product"
                      ? "bg-green-500"
                      : "bg-purple-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="admin-card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Performance Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">2.4s</div>
            <div className="text-sm text-gray-600">Avg. Page Load Time</div>
            <div className="text-xs text-green-600 mt-1">
              ↓ 0.3s from last month
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">94.2%</div>
            <div className="text-sm text-gray-600">Uptime</div>
            <div className="text-xs text-green-600 mt-1">
              ↑ 1.2% from last month
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">1,234</div>
            <div className="text-sm text-gray-600">Total Visitors</div>
            <div className="text-xs text-green-600 mt-1">
              ↑ 15% from last month
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">67%</div>
            <div className="text-sm text-gray-600">Mobile Traffic</div>
            <div className="text-xs text-blue-600 mt-1">
              ↑ 3% from last month
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
