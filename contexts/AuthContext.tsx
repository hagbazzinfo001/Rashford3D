"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { toast } from "react-hot-toast";
import api from "@/lib/api"; // or the correct relative path if not using `@/`

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  emailVerified: boolean;
  preferences: {
    currency: string;
    language: string;
    notifications: boolean;
    marketing: boolean;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orders: any[];
  wishlist: string[];
  loyaltyPoints: number;
  membershipTier: "bronze" | "silver" | "gold" | "platinum";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  googleLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem("rashford3d_user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("rashford3d_user");
      }
    }
    setIsLoading(false);
  }, []);

  // const login = async (email: string, password: string) => {
  //   setIsLoading(true);
  //   try {
  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     // For demo purposes, create a mock user
  //     const mockUser: User = {
  //       id: "user_" + Date.now(),
  //       email,
  //       name: email.split("@")[0],
  //       avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2`,
  //       createdAt: new Date(),
  //       emailVerified: true,
  //       preferences: {
  //         currency: "NGN",
  //         language: "en",
  //         notifications: true,
  //         marketing: false,
  //       },
  //       orders: [],
  //       wishlist: [],
  //       loyaltyPoints: 150,
  //       membershipTier: "bronze",
  //     };

  //     setUser(mockUser);
  //     localStorage.setItem("rashford3d_user", JSON.stringify(mockUser));
  //     toast.success("Login successful!");
  //   } catch (error) {
  //     toast.error("Login failed. Please check your credentials.");
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post("/Auth/login", { email, password });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem("rashford3d_user", JSON.stringify(userData));
      toast.success("Login successful!");
    } catch (error: any) {
      toast.error("Login failed. Check credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // const register = async (email: string, password: string, name: string) => {
  //   setIsLoading(true);
  //   try {
  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     const mockUser: User = {
  //       id: "user_" + Date.now(),
  //       email,
  //       name,
  //       avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2`,
  //       createdAt: new Date(),
  //       emailVerified: false,
  //       preferences: {
  //         currency: "USD",
  //         language: "en",
  //         notifications: true,
  //         marketing: false,
  //       },
  //       orders: [],
  //       wishlist: [],
  //       loyaltyPoints: 50,
  //       membershipTier: "bronze",
  //     };

  //     setUser(mockUser);
  //     localStorage.setItem("rashford3d_user", JSON.stringify(mockUser));
  //     toast.success("Registration successful! Welcome to Rashford3D!");
  //   } catch (error) {
  //     toast.error("Registration failed. Please try again.");
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // const register = async (
  //   email: string,
  //   password: string,
  //   name: string,
  //   role: "user" | "Admin" = "Admin"
  // ) => {
  //   setIsLoading(true);
  //   try {
  //     const response = await api.post("/api/Auth/register", {
  //       username: name,
  //       email,
  //       password,
  //       role, // Use the passed role (default is 'user')
  //     });

  //     const userData = response.data;
  //     setUser(userData);
  //     localStorage.setItem("rashford3d_user", JSON.stringify(userData));
  //     toast.success("Registration successful!");
  //   } catch (error: any) {
  //     console.error(
  //       "Registration API Error:",
  //       error?.response?.data || error.message
  //     );
  //     toast.error("Registration failed.");
  //     throw error;
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const register = async (
    email: string,
    password: string,
    name: string,
    role: "user" | "Admin" = "Admin"
  ) => {
    setIsLoading(true);
    // const role = "Admin"; // since only "Admin" is accepted

    // 👇 Add this console log before making the API call
    console.log("Registering with:", {
      username: name,
      email,
      password,
      role,
    });

    try {
      const response = await api.post("/Auth/register", {
        username: name,
        email,
        password,
        role,
      });

      const registeredUser = response.data;
      const mockUser: User = {
        id: registeredUser?.id || "user_" + Date.now(),
        email,
        name,
        avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg`,
        createdAt: new Date(),
        emailVerified: true,
        preferences: {
          currency: "USD",
          language: "en",
          notifications: true,
          marketing: false,
        },
        orders: [],
        wishlist: [],
        loyaltyPoints: 0,
        membershipTier: "bronze",
      };

      setUser(mockUser);
      localStorage.setItem("rashford3d_user", JSON.stringify(mockUser));
      toast.success("Registration successful!");
    } catch (error: any) {
      toast.error(error.response?.data || "Registration failed.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("rashford3d_user");
    toast.success("Logged out successfully!");
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("rashford3d_user", JSON.stringify(updatedUser));
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
      toast.success("Password reset email sent!");
    } catch (error) {
      toast.error("Failed to send reset email.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (token: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedUser = { ...user, emailVerified: true };
      setUser(updatedUser);
      localStorage.setItem("rashford3d_user", JSON.stringify(updatedUser));
      toast.success("Email verified successfully!");
    } catch (error) {
      toast.error("Email verification failed.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = async () => {
    setIsLoading(true);
    try {
      // Simulate Google OAuth
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: "google_user_" + Date.now(),
        email: "user@gmail.com",
        name: "Google User",
        avatar: `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2`,
        createdAt: new Date(),
        emailVerified: true,
        preferences: {
          currency: "USD",
          language: "en",
          notifications: true,
          marketing: false,
        },
        orders: [],
        wishlist: [],
        loyaltyPoints: 100,
        membershipTier: "bronze",
      };

      setUser(mockUser);
      localStorage.setItem("rashford3d_user", JSON.stringify(mockUser));
      toast.success("Google login successful!");
    } catch (error) {
      toast.error("Google login failed.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    resetPassword,
    verifyEmail,
    googleLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
