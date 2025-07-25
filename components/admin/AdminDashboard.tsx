"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminOverview from "./AdminOverview";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers";
import AdminCategories from "./AdminCategories";
import AdminAnalytics from "./AdminAnalytics";

import AdminSettings from "./AdminSettings";
// types/admin.ts
export type AdminTab =
  | "overview"
  | "products"
  | "orders"
  | "users"
  | "categories"
  | "analytics"
  | "settings";
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  // const [activeQuicLinks, setActiveQuickLinks] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview setActiveTab={setActiveTab} />;
      case "products":
        return <AdminProducts />;
      case "orders":
        return <AdminOrders />;
      case "users":
        return <AdminUsers />;
      case "categories":
        return <AdminCategories />;
      case "analytics":
        return <AdminAnalytics />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <div
        className={`transition-all duration-300 ${
          isCollapsed ? "lg:ml-1" : "lg:ml-full"
        }`}
      >
        <AdminHeader
          setSidebarOpen={setSidebarOpen}
          currentTab={activeTab}
          isCollapsed={isCollapsed}
        />

        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
