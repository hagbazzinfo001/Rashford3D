'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdmin } from '@/contexts/AdminContext';
import AdminDashboard from '@/components/admin/AdminDashboard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { isAdminAuthenticated, isLoading } = useAdmin();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAdminAuthenticated) {
      router.push('/admin/login');
    }
  }, [mounted, isLoading, isAdminAuthenticated, router]);

  if (!mounted || isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAdminAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AnimatePresence mode="wait">
        <motion.div
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AdminDashboard />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}