'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
}

interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByUser: (userId: string) => Order[];
  getOrdersByStatus: (status: string) => Order[];
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  updatePaymentStatus: (id: string, status: Order['paymentStatus']) => Promise<void>;
  addTrackingNumber: (id: string, trackingNumber: string) => Promise<void>;
  addOrderNotes: (id: string, notes: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
  getOrderStats: () => {
    total: number;
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    totalRevenue: number;
  };
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: 'user_1',
    userName: 'John Doe',
    userEmail: 'john@example.com',
    items: [
      {
        id: 'item_1',
        productId: '1',
        name: '3D Printed Smart Home Hub',
        price: 119999.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg?auto=compress&cs=tinysrgb&w=200',
      },
    ],
    subtotal: 119999.99,
    tax: 9599.99,
    shipping: 0,
    total: 129599.98,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'Lagos',
      state: 'Lagos',
      zipCode: '100001',
      country: 'Nigeria',
      phone: '+234 801 234 5678',
    },
    trackingNumber: 'TRK123456789',
    estimatedDelivery: new Date('2024-01-25'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-24'),
    notes: 'Customer requested express delivery',
  },
  {
    id: 'ORD-002',
    userId: 'user_2',
    userName: 'Jane Smith',
    userEmail: 'jane@example.com',
    items: [
      {
        id: 'item_2',
        productId: '2',
        name: 'Wireless Charging Pad 3D',
        price: 35999.99,
        quantity: 2,
        image: 'https://images.pexels.com/photos/163016/cellular-phone-charge-charging-163016.jpeg?auto=compress&cs=tinysrgb&w=200',
      },
    ],
    subtotal: 71999.98,
    tax: 5759.99,
    shipping: 2000,
    total: 79759.97,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: {
      name: 'Jane Smith',
      street: '456 Business Ave',
      city: 'Abuja',
      state: 'FCT',
      zipCode: '900001',
      country: 'Nigeria',
      phone: '+234 802 345 6789',
    },
    trackingNumber: 'TRK987654321',
    estimatedDelivery: new Date('2024-01-28'),
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-23'),
  },
  {
    id: 'ORD-003',
    userId: 'user_3',
    userName: 'Mike Johnson',
    userEmail: 'mike@example.com',
    items: [
      {
        id: 'item_3',
        productId: '3',
        name: 'Smart Kitchen Scale Pro',
        price: 59999.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/6195129/pexels-photo-6195129.jpeg?auto=compress&cs=tinysrgb&w=200',
      },
      {
        id: 'item_4',
        productId: '4',
        name: 'LED Smart Bulb Set',
        price: 79999.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/1095814/pexels-photo-1095814.jpeg?auto=compress&cs=tinysrgb&w=200',
      },
    ],
    subtotal: 139999.98,
    tax: 11199.99,
    shipping: 0,
    total: 151199.97,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: {
      name: 'Mike Johnson',
      street: '789 Tech Street',
      city: 'Port Harcourt',
      state: 'Rivers',
      zipCode: '500001',
      country: 'Nigeria',
      phone: '+234 803 456 7890',
    },
    estimatedDelivery: new Date('2024-01-30'),
    createdAt: new Date('2024-01-24'),
    updatedAt: new Date('2024-01-24'),
  },
  {
    id: 'ORD-004',
    userId: 'user_4',
    userName: 'Sarah Wilson',
    userEmail: 'sarah@example.com',
    items: [
      {
        id: 'item_5',
        productId: '5',
        name: 'Modern Coffee Maker Pro',
        price: 139999.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=200',
      },
    ],
    subtotal: 139999.99,
    tax: 11199.99,
    shipping: 3000,
    total: 154199.98,
    status: 'pending',
    paymentStatus: 'pending',
    shippingAddress: {
      name: 'Sarah Wilson',
      street: '321 Coffee Lane',
      city: 'Kano',
      state: 'Kano',
      zipCode: '700001',
      country: 'Nigeria',
      phone: '+234 804 567 8901',
    },
    estimatedDelivery: new Date('2024-02-02'),
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
];

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // In a real app, this would fetch from API
      // const response = await axios.get('/api/admin/orders');
      // setOrders(response.data);
      
      // For now, use mock data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      setOrders(mockOrders);
    } catch (error) {
      setError('Failed to fetch orders');
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshOrders = async () => {
    await fetchOrders();
  };

  const getOrderById = (id: string) => {
    return orders.find(order => order.id === id);
  };

  const getOrdersByUser = (userId: string) => {
    return orders.filter(order => order.userId === userId);
  };

  const getOrdersByStatus = (status: string) => {
    if (status === 'all') return orders;
    return orders.filter(order => order.status === status);
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      setOrders(prev => prev.map(order =>
        order.id === id
          ? { ...order, status, updatedAt: new Date() }
          : order
      ));

      // In a real app, this would make an API call
      // await axios.put(`/api/admin/orders/${id}/status`, { status });
      
      toast.success(`Order status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update order status');
      throw error;
    }
  };

  const updatePaymentStatus = async (id: string, status: Order['paymentStatus']) => {
    try {
      setOrders(prev => prev.map(order =>
        order.id === id
          ? { ...order, paymentStatus: status, updatedAt: new Date() }
          : order
      ));

      // In a real app, this would make an API call
      // await axios.put(`/api/admin/orders/${id}/payment`, { status });
      
      toast.success(`Payment status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update payment status');
      throw error;
    }
  };

  const addTrackingNumber = async (id: string, trackingNumber: string) => {
    try {
      setOrders(prev => prev.map(order =>
        order.id === id
          ? { ...order, trackingNumber, updatedAt: new Date() }
          : order
      ));

      // In a real app, this would make an API call
      // await axios.put(`/api/admin/orders/${id}/tracking`, { trackingNumber });
      
      toast.success('Tracking number added successfully');
    } catch (error) {
      toast.error('Failed to add tracking number');
      throw error;
    }
  };

  const addOrderNotes = async (id: string, notes: string) => {
    try {
      setOrders(prev => prev.map(order =>
        order.id === id
          ? { ...order, notes, updatedAt: new Date() }
          : order
      ));

      // In a real app, this would make an API call
      // await axios.put(`/api/admin/orders/${id}/notes`, { notes });
      
      toast.success('Order notes updated successfully');
    } catch (error) {
      toast.error('Failed to update order notes');
      throw error;
    }
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, order) => sum + order.total, 0),
    };
    return stats;
  };

  const value = {
    orders,
    isLoading,
    error,
    getOrderById,
    getOrdersByUser,
    getOrdersByStatus,
    updateOrderStatus,
    updatePaymentStatus,
    addTrackingNumber,
    addOrderNotes,
    refreshOrders,
    getOrderStats,
  };

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};