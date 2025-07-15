"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { toast } from "react-hot-toast";
interface AdminUser {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  department: string;
  role: "admin" | "super_admin" | "manager";
  avatar?: string;
  permissions: string[];
  lastLogin: Date;
  createdAt: Date;
  isActive: boolean;
}

interface AdminContextType {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  adminLogin: (email: string, password: string) => Promise<void>;
  adminRegister: (userData: any) => Promise<void>;
  adminLogout: () => void;
  updateAdminProfile: (updates: Partial<AdminUser>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored admin user data
    const storedAdmin = localStorage.getItem("rashford3d_admin");
    if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        setAdminUser(adminData);
      } catch (error) {
        console.error("Error parsing stored admin data:", error);
        localStorage.removeItem("rashford3d_admin");
      }
    }
    setIsLoading(false);
  }, []);

  // const adminLogin = async (email: string, password: string) => {
  //   setIsLoading(true);
  //   try {
  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     // Check admin credentials
  //     if (email === "admin@rashford3d.com" && password === "admin123") {
  //       const mockAdmin: AdminUser = {
  //         id: "admin_" + Date.now(),
  //         email,
  //         name: "Admin User",
  //         firstName: "Admin",
  //         lastName: "User",
  //         phone: "+234 800 000 0000",
  //         department: "IT & Technology",
  //         role: "super_admin",
  //         avatar:
  //           "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2",
  //         permissions: [
  //           "manage_products",
  //           "manage_orders",
  //           "manage_users",
  //           "view_analytics",
  //           "manage_categories",
  //           "upload_files",
  //           "manage_settings",
  //           "manage_admins",
  //           "view_reports",
  //           "manage_payments",
  //         ],
  //         lastLogin: new Date(),
  //         createdAt: new Date("2023-01-01"),
  //         isActive: true,
  //       };

  //       setAdminUser(mockAdmin);
  //       localStorage.setItem("rashford3d_admin", JSON.stringify(mockAdmin));
  //       toast.success("Admin login successful!");
  //     } else {
  //       throw new Error("Invalid credentials");
  //     }
  //   } catch (error) {
  //     toast.error("Invalid admin credentials");
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const adminLogin = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://rashroff3decommerce.somee.com/api/AdminAuth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const admin: AdminUser = {
        id: data.userId,
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || "",
        department: data.department || "",
        role: data.role || "admin",
        avatar: data.avatar || "",
        permissions: data.permissions || [], // Adjust if needed
        lastLogin: new Date(data.lastLogin || Date.now()),
        createdAt: new Date(data.createdAt || Date.now()),
        isActive: data.isActive ?? true,
      };

      localStorage.setItem("rashford3d_admin", JSON.stringify(admin));
      localStorage.setItem("rashford3d_token", data.token);
      setAdminUser(admin);
      toast.success("Admin login successful!");
    } catch (error: any) {
      toast.error(error.message || "Invalid login credentials");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // const adminRegister = async (userData: any) => {
  //   setIsLoading(true);
  //   try {
  //     // Simulate API call for registration request
  //     await new Promise((resolve) => setTimeout(resolve, 2000));

  //     // In a real app, this would send the registration request to the backend
  //     // For demo purposes, we'll just show a success message
  //     toast.success("Registration request submitted successfully!");
  //   } catch (error) {
  //     toast.error("Registration failed. Please try again.");
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const adminRegister = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://rashroff3decommerce.somee.com/api/AdminAuth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Registration request submitted successfully!");
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem("rashford3d_admin");
    localStorage.removeItem("rashford3d_token");
    toast.success("Admin logged out successfully!");
  };

  const updateAdminProfile = async (updates: Partial<AdminUser>) => {
    if (!adminUser) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedAdmin = { ...adminUser, ...updates };
      setAdminUser(updatedAdmin);
      localStorage.setItem("rashford3d_admin", JSON.stringify(updatedAdmin));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Password reset instructions sent to your email!");
    } catch (error) {
      toast.error("Failed to send reset email.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const hasPermission = (permission: string) => {
    return adminUser?.permissions.includes(permission) || false;
  };

  const value = {
    adminUser,
    isAdminAuthenticated: !!adminUser,
    isLoading,
    adminLogin,
    adminRegister,
    adminLogout,
    updateAdminProfile,
    resetPassword,
    hasPermission,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
