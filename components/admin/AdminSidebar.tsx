
"use client";

import { motion } from "framer-motion";
import { Dispatch, SetStateAction } from "react"; // Add this at the top

import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Grid3X3,
  TrendingUp,
  Settings,
  LogOut,
  X,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
type AdminTab =
  | "overview"
  | "products"
  | "orders"
  | "users"
  | "categories"
  | "analytics"
  | "settings";

interface AdminSidebarProps {
  activeTab: AdminTab; // <- Use AdminTab here too if not already
  setActiveTab: Dispatch<SetStateAction<AdminTab>>;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}
export default function AdminSidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  isCollapsed,
  setIsCollapsed,
}: AdminSidebarProps) {
  const { adminUser, adminLogout } = useAdmin();

  const menuItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "products", label: "Products", icon: Package },
    { id: "categories", label: "Categories", icon: Grid3X3 },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "users", label: "Users", icon: Users },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Overlay - Only for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden "
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -300,
          width: isCollapsed ? 80 : 256,
        }}
        transition={{
          type: "spring",
          damping: 25,
          stiffness: 200,
          duration: 0.3,
        }}
        className={`fixed left-0 top-0  bg-rashford-dark text-white z-50 lg:translate-x-0 lg:static lg:z-auto ${
          isCollapsed ? "lg:w-20" : "lg:w-64"
        } w-64`}
      >
        {/* Header */}
        <div
          className={`p-6 border-b border-white/10 ${
            isCollapsed ? "lg:p-4" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-3"
              animate={{ opacity: isCollapsed ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-rashford-red to-rashford-gold rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                >
                  <h2 className="text-lg font-bold whitespace-nowrap">
                    Admin Panel
                  </h2>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    Rashford3D
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Mobile close button - Only for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Desktop collapse toggle - Only for desktop */}
            <button
              onClick={toggleCollapse}
              className="hidden lg:block p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Admin Info */}
        <div
          className={`p-6 border-b border-white/10 ${
            isCollapsed ? "lg:p-4" : ""
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-rashford-gold rounded-full flex items-center justify-center text-rashford-dark font-bold flex-shrink-0">
              {adminUser?.name?.charAt(0) || "A"}
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="overflow-hidden"
              >
                <p className="font-medium whitespace-nowrap">
                  {adminUser?.name}
                </p>
                <p className="text-xs text-gray-400 capitalize whitespace-nowrap">
                  {adminUser?.role}
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={`p-4 flex-1 ${isCollapsed ? "lg:p-2" : ""}`}>
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <li key={item.id}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveTab(item.id as AdminTab);
                      // Only close sidebar on mobile
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-rashford-red text-white"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    } ${isCollapsed ? "lg:justify-center lg:px-2" : ""}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div
          className={`p-4 border-t border-white/10 ${
            isCollapsed ? "lg:p-2" : ""
          }`}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={adminLogout}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all duration-200 ${
              isCollapsed ? "lg:justify-center lg:px-2" : ""
            }`}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Logout
              </motion.span>
            )}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
