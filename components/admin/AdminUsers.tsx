"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Users,
  Mail,
  Phone,
  Calendar,
  Shield,
  Ban,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock users data
  const [users] = useState([
    {
      id: "user_1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+234 801 234 5678",
      status: "active",
      role: "customer",
      joinDate: new Date("2023-06-15"),
      lastLogin: new Date("2024-01-20"),
      totalOrders: 5,
      totalSpent: 450000,
      avatar:
        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2",
    },
    {
      id: "user_2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+234 802 345 6789",
      status: "active",
      role: "customer",
      joinDate: new Date("2023-08-22"),
      lastLogin: new Date("2024-01-19"),
      totalOrders: 3,
      totalSpent: 280000,
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2",
    },
    {
      id: "user_3",
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+234 803 456 7890",
      status: "active",
      role: "customer",
      joinDate: new Date("2023-11-10"),
      lastLogin: new Date("2024-01-18"),
      totalOrders: 8,
      totalSpent: 720000,
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2",
    },
    {
      id: "user_4",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+234 804 567 8901",
      status: "suspended",
      role: "customer",
      joinDate: new Date("2023-12-05"),
      lastLogin: new Date("2024-01-15"),
      totalOrders: 1,
      totalSpent: 150000,
      avatar:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2",
    },
    {
      id: "user_5",
      name: "David Brown",
      email: "david@example.com",
      phone: "+234 805 678 9012",
      status: "active",
      role: "customer",
      joinDate: new Date("2024-01-02"),
      lastLogin: new Date("2024-01-21"),
      totalOrders: 2,
      totalSpent: 320000,
      avatar:
        "https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2",
    },
  ]);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery);
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "suspended":
        return <Ban className="w-4 h-4 text-red-600" />;
      default:
        return <Shield className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusToggle = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    // In a real app, this would make an API call
    toast.success(
      `User ${newStatus === "active" ? "activated" : "suspended"} successfully`
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      // In a real app, this would make an API call
      toast.success("User deleted successfully");
    }
  };

  const userStats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    newThisMonth: users.filter((u) => {
      const now = new Date();
      const userDate = new Date(u.joinDate);
      return (
        userDate.getMonth() === now.getMonth() &&
        userDate.getFullYear() === now.getFullYear()
      );
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div>
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-600">Manage customer accounts and user data</p>
      </div> */}

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {userStats.total}
              </p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {userStats.active}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Suspended Users
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {userStats.suspended}
              </p>
            </div>
            <div className="p-3 rounded-full bg-red-100">
              <Ban className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                New This Month
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {userStats.newThisMonth}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <UserPlus className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
          >
            <option value="all">All Users</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-table">
        <div className="admin-table-header">
          <h3 className="text-lg font-semibold text-gray-900">Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  User
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Contact
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Orders
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Total Spent
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Join Date
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Last Login
                </th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="admin-table-row"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <Image
                        width={40}
                        height={40}
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500 capitalize">
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {user.email}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {user.phone}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(user.status)}
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {user.totalOrders}
                  </td>
                  <td className="py-4 px-6 font-medium text-gray-900">
                    ₦{user.totalSpent.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {user.joinDate.toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    {user.lastLogin.toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                        title="View User"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleStatusToggle(user.id, user.status)}
                        className={`p-2 rounded-lg ${
                          user.status === "active"
                            ? "text-red-600 hover:bg-red-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                        title={
                          user.status === "active"
                            ? "Suspend User"
                            : "Activate User"
                        }
                      >
                        {user.status === "active" ? (
                          <Ban className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Users will appear here when they register"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
