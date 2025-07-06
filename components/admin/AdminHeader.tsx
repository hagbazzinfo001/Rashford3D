'use client';

import { Menu, Bell, Search, User } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';

interface AdminHeaderProps {
  setSidebarOpen: (open: boolean) => void;
  currentTab: string;
}

export default function AdminHeader({ setSidebarOpen, currentTab }: AdminHeaderProps) {
  const { adminUser } = useAdmin();

  const getPageTitle = (tab: string) => {
    const titles = {
      overview: 'Dashboard Overview',
      products: 'Product Management',
      orders: 'Order Management',
      users: 'User Management',
      categories: 'Category Management',
      analytics: 'Sales Analytics',
      settings: 'System Settings',
    };
    return titles[tab] || 'Admin Dashboard';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle(currentTab)}</h1>
            <p className="text-sm text-gray-600">
              Welcome back, {adminUser?.name}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-rashford-red rounded-full flex items-center justify-center text-white text-sm font-bold">
              {adminUser?.name?.charAt(0) || 'A'}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {adminUser?.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}