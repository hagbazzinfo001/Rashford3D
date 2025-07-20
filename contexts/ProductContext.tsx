"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import axios from "axios";
type variants = {
  id?: string;
  productId?: string;
  size?: string;
  color?: string;
  price?: number;
  stock?: number;
  sku?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  materials?: string[];
};
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string[];
  category: string;
  subcategory?: string;
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  sku: string;
  tags: string[];
  features: string[];
  specifications: { [key: string]: string };
  variant?: variants[]; // Array of variants with size, color, etc.

  shipping: {
    weight: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
    };
    freeShipping: boolean;
    estimatedDelivery: string;
  };
  reviews: Array<{
    id: string;
    userId: string;
    userName: string;
    rating: number;
    comment: string;
    date: Date;
    verified: boolean;
  }>;
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  discountPercentage?: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  parentId?: string;
  subcategories?: Category[];
  productCount?: number;
}

interface ProductContextType {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  setFetchedCategories: (categories: Category[]) => void;
  error: string | null;
  fetchedCategories: Category[];
  searchProducts: (query: string) => Product[];
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
  getFeaturedProducts: () => Product[];
  getNewProducts: () => Product[];
  getOnSaleProducts: () => Product[];
  getRelatedProducts: (productId: string) => Product[];
  refreshProducts: () => Promise<void>;
  addProduct: (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  addCategory: (
    category: Omit<Category, "id" | "productCount">
  ) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

// Mock data for demonstration with Naira currency
const mockProducts: Product[] = [
  {
    id: "1",
    name: "3D Printed Smart Home Hub",
    description:
      "Revolutionary smart home hub with 3D printed components for maximum durability and style.",
    price: 119999.99, // ₦119,999.99
    originalPrice: 159999.99, // ₦159,999.99
    imageUrl: [
      "https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/5717899/pexels-photo-5717899.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    category: "electronics",
    subcategory: "smart-home",
    brand: "Rashford Tech",
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    stockQuantity: 45,
    sku: "RSH-SH-001",
    tags: ["smart-home", "3d-printed", "iot", "wireless"],
    features: [
      "Voice control compatible",
      "Wireless connectivity",
      "3D printed durable casing",
      "Easy setup and installation",
      "Smart device integration",
    ],
    specifications: {
      Connectivity: "Wi-Fi 6, Bluetooth 5.0",
      Dimensions: "15cm x 10cm x 8cm",
      Weight: "350g",
      Material: "ABS Plastic (3D Printed)",
      Power: "USB-C, 12V adapter",
      Compatibility: "iOS, Android, Amazon Alexa, Google Assistant",
    },
    variant: [
      {
        color: "Black",
        materials: ["ABS Plastic", "PETG", "Carbon Fiber"],
      },
    ],
    shipping: {
      weight: 0.5,
      dimensions: { length: 18, width: 13, height: 10 },
      freeShipping: true,
      estimatedDelivery: "2-4 business days",
    },
    reviews: [
      {
        id: "r1",
        userId: "u1",
        userName: "John D.",
        rating: 5,
        comment: "Amazing product! The 3D printed quality is outstanding.",
        date: new Date("2024-01-15"),
        verified: true,
      },
      {
        id: "r2",
        userId: "u2",
        userName: "Sarah M.",
        rating: 4,
        comment: "Great smart home hub, easy to set up and works perfectly.",
        date: new Date("2024-01-10"),
        verified: true,
      },
    ],
    isFeatured: true,
    isNew: false,
    isOnSale: true,
    discountPercentage: 25,
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "Wireless Charging Pad 3D",
    description:
      "Premium wireless charging pad with unique 3D textured surface for enhanced aesthetics.",
    price: 35999.99, // ₦35,999.99
    originalPrice: 47999.99, // ₦47,999.99
    imageUrl: [
      "https://images.pexels.com/photos/163016/cellular-phone-charge-charging-163016.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/6476809/pexels-photo-6476809.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/4792510/pexels-photo-4792510.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    category: "electronics",
    subcategory: "accessories",
    brand: "Rashford Tech",
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    stockQuantity: 78,
    sku: "RSH-WC-002",
    tags: ["wireless-charging", "3d-texture", "premium", "fast-charging"],
    features: [
      "Fast wireless charging",
      "3D textured surface",
      "Universal compatibility",
      "LED charging indicator",
      "Non-slip base",
    ],
    specifications: {
      Output: "15W, 10W, 7.5W, 5W",
      Input: "USB-C",
      Dimensions: "10cm diameter x 1.5cm thick",
      Weight: "200g",
      Material: "Aluminum with 3D printed texture",
      Compatibility: "Qi-enabled devices",
    },
    variant: [
      {
        color: "Rose Gold",
      },
    ],
    shipping: {
      weight: 0.3,
      dimensions: { length: 12, width: 12, height: 5 },
      freeShipping: false,
      estimatedDelivery: "3-5 business days",
    },
    reviews: [
      {
        id: "r3",
        userId: "u3",
        userName: "Mike R.",
        rating: 5,
        comment: "Love the texture and charging speed. Highly recommended!",
        date: new Date("2024-01-18"),
        verified: true,
      },
    ],
    isFeatured: true,
    isNew: true,
    isOnSale: true,
    discountPercentage: 25,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "3",
    name: "Smart Kitchen Scale Pro",
    description:
      "High-precision digital kitchen scale with 3D printed ergonomic design.",
    price: 59999.99, // ₦59,999.99
    imageUrl: [
      "https://images.pexels.com/photos/6195129/pexels-photo-6195129.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/4792511/pexels-photo-4792511.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    category: "house",
    subcategory: "kitchen",
    brand: "Rashford Home",
    rating: 4.7,
    reviewCount: 234,
    inStock: true,
    stockQuantity: 32,
    sku: "RSH-KS-003",
    tags: ["kitchen", "smart-scale", "precision", "app-connected"],
    features: [
      "High precision sensors",
      "App connectivity",
      "Nutritional tracking",
      "Multiple units",
      "Tare function",
    ],
    specifications: {
      Capacity: "5kg / 11lbs",
      Precision: "1g / 0.1oz",
      Display: "LCD with backlight",
      Connectivity: "Bluetooth 5.0",
      Power: "3 x AAA batteries",
      Dimensions: "23cm x 16cm x 3cm",
    },
    variant: [
      {
        color: "White",
      },
    ],
    shipping: {
      weight: 0.8,
      dimensions: { length: 25, width: 18, height: 5 },
      freeShipping: true,
      estimatedDelivery: "2-4 business days",
    },
    reviews: [
      {
        id: "r4",
        userId: "u4",
        userName: "Anna L.",
        rating: 5,
        comment: "Perfect for meal prep! The app is amazing.",
        date: new Date("2024-01-12"),
        verified: true,
      },
    ],
    isFeatured: false,
    isNew: false,
    isOnSale: false,
    createdAt: new Date("2023-11-15"),
    updatedAt: new Date("2024-01-12"),
  },
  {
    id: "4",
    name: "LED Smart Bulb Set",
    description:
      "Set of 4 smart LED bulbs with 16 million colors and voice control.",
    price: 79999.99, // ₦79,999.99
    originalPrice: 99999.99, // ₦99,999.99
    imageUrl: [
      "https://images.pexels.com/photos/1095814/pexels-photo-1095814.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/4792512/pexels-photo-4792512.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    category: "electronics",
    subcategory: "lighting",
    brand: "Rashford Lighting",
    rating: 4.9,
    reviewCount: 678,
    inStock: true,
    stockQuantity: 156,
    sku: "RSH-LED-004",
    tags: [
      "smart-lighting",
      "color-changing",
      "voice-control",
      "energy-efficient",
    ],
    features: [
      "16 million colors",
      "Voice control",
      "Energy efficient",
      "App control",
      "Scheduling",
    ],
    specifications: {
      Wattage: "9W (60W equivalent)",
      Lumens: "800lm",
      "Color Temperature": "2700K-6500K",
      Connectivity: "Wi-Fi 2.4GHz",
      Lifespan: "25,000 hours",
      Dimming: "Yes",
    },
    variant: [
      {
        color: "Standard",
      },
    ],
    shipping: {
      weight: 0.6,
      dimensions: { length: 20, width: 15, height: 10 },
      freeShipping: true,
      estimatedDelivery: "1-3 business days",
    },
    reviews: [
      {
        id: "r5",
        userId: "u5",
        userName: "David K.",
        rating: 5,
        comment: "Best smart bulbs I've ever used! Amazing color range.",
        date: new Date("2024-01-16"),
        verified: true,
      },
    ],
    isFeatured: true,
    isNew: false,
    isOnSale: true,
    discountPercentage: 20,
    createdAt: new Date("2023-10-01"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "5",
    name: "Modern Coffee Maker Pro",
    description:
      "Premium coffee maker with 3D printed components and smart brewing technology.",
    price: 139999.99, // ₦139,999.99
    imageUrl: [
      "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/4792513/pexels-photo-4792513.jpeg?auto=compress&cs=tinysrgb&w=800",
    ],
    category: "house",
    subcategory: "kitchen",
    brand: "Rashford Home",
    rating: 4.8,
    reviewCount: 145,
    inStock: true,
    stockQuantity: 23,
    sku: "RSH-CM-005",
    tags: ["coffee-maker", "smart-brewing", "premium", "programmable"],
    features: [
      "Smart brewing system",
      "Programmable timer",
      "12-cup capacity",
      "Auto shut-off",
      "Anti-drip design",
    ],
    specifications: {
      Capacity: "12 cups (1.8L)",
      "Brewing Time": "6-8 minutes",
      Power: "1200W",
      "Water Tank": "Removable",
      Filter: "Permanent gold-tone",
      Dimensions: "35cm x 25cm x 40cm",
    },
    variant: [
      {
        color: "Black",
      },
    ],
    shipping: {
      weight: 3.2,
      dimensions: { length: 40, width: 30, height: 45 },
      freeShipping: true,
      estimatedDelivery: "3-7 business days",
    },
    reviews: [
      {
        id: "r6",
        userId: "u6",
        userName: "Lisa P.",
        rating: 5,
        comment: "Makes the best coffee! Love the programmable features.",
        date: new Date("2024-01-14"),
        verified: true,
      },
    ],
    isFeatured: false,
    isNew: true,
    isOnSale: false,
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-14"),
  },
];

const mockCategories: Category[] = [
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
    description: "Latest electronic gadgets and devices",
    imageUrl:
      "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=800",
    productCount: 3,
    subcategories: [
      {
        id: "smart-home",
        name: "Smart Home",
        slug: "smart-home",
        description: "Smart home devices and automation",
        imageUrl:
          "https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg?auto=compress&cs=tinysrgb&w=800",
        // parentId: "electronics",
        productCount: 1,
      },
      {
        id: "accessories",
        name: "Accessories",
        slug: "accessories",
        description: "Electronic accessories and peripherals",
        imageUrl:
          "https://images.pexels.com/photos/163016/cellular-phone-charge-charging-163016.jpeg?auto=compress&cs=tinysrgb&w=800",
        // parentId: "electronics",
        productCount: 1,
      },
      {
        id: "lighting",
        name: "Lighting",
        slug: "lighting",
        description: "Smart lighting solutions",
        imageUrl:
          "https://images.pexels.com/photos/1095814/pexels-photo-1095814.jpeg?auto=compress&cs=tinysrgb&w=800",
        // parentId: "electronics",
        productCount: 1,
      },
    ],
  },
  {
    id: "house",
    name: "House & Home",
    slug: "house",
    description: "Home appliances and household items",
    imageUrl:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800",
    productCount: 2,
    subcategories: [
      {
        id: "kitchen",
        name: "Kitchen",
        slug: "kitchen",
        description: "Kitchen appliances and tools",
        imageUrl:
          "https://images.pexels.com/photos/6195129/pexels-photo-6195129.jpeg?auto=compress&cs=tinysrgb&w=800",
        // parentId: "house",
        productCount: 2,
      },
    ],
  },
];

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedCategories, setFetchedCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // const fetchProducts = async () => {
  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     // Try to fetch from the API first
  //     const response = await axios.get(
  //       "https://rashroff3decommerce.somee.com/api/ProductCategories",
  //       {
  //         timeout: 3000,
  //       }
  //     );

  //     // If API is available, process the response
  //     if (response.data && response.data.name) {
  //       setProducts(response.data.products);
  //       setCategories(response.data.name || mockCategories);
  //     } else {
  //       // Fallback to mock data
  //       setProducts(mockProducts);
  //       setCategories(mockCategories);
  //     }
  //   } catch (error) {
  //     console.warn("API not available, using mock data:", error);
  //     // Use mock data as fallback
  //     setProducts(mockProducts);
  //     setCategories(mockCategories);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  // Admin functions

  // const addProduct = async (
  //   productData: Omit<Product, "id" | "createdAt" | "updatedAt">
  // ) => {
  //   try {
  //     const newProduct: Product = {
  //       ...productData,
  //       id: "product_" + Date.now(),
  //       createdAt: new Date(),
  //       updatedAt: new Date(),
  //     };

  //     setProducts((prev) => [...prev, newProduct]);

  //     // Update category product count
  //     setCategories((prev) =>
  //       prev.map((cat) =>
  //         cat.id === newProduct.category
  //           ? {
  //               ...cat,
  //               productCount: (cat.productCount || 0) + 1,
  //             }
  //           : cat
  //       )
  //     );

  //     // In a real app, this would make an API call
  //     // await axios.post('/api/admin/products', newProduct);
  //   } catch (error) {
  //     throw new Error("Failed to add product");
  //   }
  // };
  // const updateProduct = async (id: string, updates: Partial<Product>) => {
  //   try {
  //     setProducts((prev) =>
  //       prev.map((product) =>
  //         product.id === id
  //           ? { ...product, ...updates, updatedAt: new Date() }
  //           : product
  //       )
  //     );

  //     // In a real app, this would make an API call
  //     // await axios.put(`/api/admin/products/${id}`, updates);
  //   } catch (error) {
  //     throw new Error("Failed to update product");
  //   }
  // };
  // const deleteProduct = async (id: string) => {
  //   try {
  //     const productToDelete = products.find((p) => p.id === id);
  //     if (!productToDelete) return;

  //     setProducts((prev) => prev.filter((product) => product.id !== id));

  //     // Update category product count
  //     if (productToDelete.category) {
  //       setCategories((prev) =>
  //         prev.map((cat) =>
  //           cat.id === productToDelete.category
  //             ? {
  //                 ...cat,
  //                 productCount: Math.max(0, (cat.productCount || 0) - 1),
  //               }
  //             : cat
  //         )
  //       );
  //     }

  //     // In a real app, this would make an API call
  //     // await axios.delete(`/api/admin/products/${id}`);
  //   } catch (error) {
  //     throw new Error("Failed to delete product");
  //   }
  // };
  // realapi
  // const fetchProducts = async () => {
  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     const response = await axios.get(
  //       "http://rashroff3decommerce.somee.com/api/Product/all",
  //       {
  //         timeout: 5000,
  //       }
  //     );

  //     setProducts(response.data); // Assuming response is an array of Product
  //   } catch (error) {
  //     setError("Failed to fetch products");
  //     console.warn("Error fetching products:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // Fetch products from API or use mock data
  // This function will try to fetch products from the API and fall back to mock data if the API is unavailable or returns an error.
  // It also handles the case where the API returns an unexpected response format.
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "https://rashroff3decommerce.somee.com/api/ProductCategories",
        {
          timeout: 3000,
        }
      );

      // Expecting response.data to be an array of categories
      if (Array.isArray(response.data)) {
        setCategories(response.data);
        setProducts(mockProducts);
      } else {
        setCategories(mockCategories);
      }
    } catch (error) {
      console.warn("API not available, using mock data:", error);
      setCategories(mockCategories);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProducts = async () => {
    await fetchProducts();
  };

  const searchProducts = (query: string) => {
    if (!query.trim()) return products;

    const lowercaseQuery = query.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.tags.some((tag) =>
          tag.toLowerCase().includes(lowercaseQuery)
        ) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        product.brand.toLowerCase().includes(lowercaseQuery)
    );
  };

  const getProductById = (id: string) => {
    return products.find((product) => product.id === id);
  };

  const getProductsByCategory = (categoryId: string) => {
    if (categoryId === "all") return products;
    return products.filter((product) => product.category === categoryId);
  };

  const getFeaturedProducts = () => {
    return products.filter((product) => product.isFeatured);
  };

  const getNewProducts = () => {
    return products.filter((product) => product.isNew);
  };

  const getOnSaleProducts = () => {
    return products.filter((product) => product.isOnSale);
  };

  const getRelatedProducts = (productId: string) => {
    const product = getProductById(productId);
    if (!product) return [];

    return products
      .filter((p) => p.id !== productId && p.category === product.category)
      .slice(0, 4);
  };

  // realapi
  const addProduct = async (
    productData: Omit<Product, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      const response = await axios.post(
        "http://rashroff3decommerce.somee.com/api/Products",
        productData
      );

      // Optionally refresh product list or optimistically add
      if (response.status === 201) {
        console.log("Product added successfully!");
        await fetchProducts();
      }
    } catch (error) {
      console.error("Add product failed:", error);
      throw new Error("Failed to add product");
    }
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      await axios.put(
        `http://rashroff3decommerce.somee.com/api/Products/${id}`,
        updates
      );

      await fetchProducts();
    } catch (error) {
      console.error("Update product failed:", error);
      throw new Error("Failed to update product");
    }
  };
  const deleteProduct = async (id: string) => {
    try {
      await axios.delete(
        `http://rashroff3decommerce.somee.com/api/Products/${id}`
      );
      await fetchProducts();
    } catch (error) {
      console.error("Delete product failed:", error);
      throw new Error("Failed to delete product");
    }
  };

  // real api for categories

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "https://rashroff3decommerce.somee.com/api/ProductCategories"
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch categories");
      }

      // Update local and context-based state
      setFetchedCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      // toast.error("Failed to load categories.");
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (
    categoryData: Omit<Category, "id" | "productCount">
  ): Promise<void> => {
    try {
      const payload = {
        ...categoryData,
        parentId: categoryData.parentId || null,
      };

      const response = await axios.post(
        "http://rashroff3decommerce.somee.com/api/ProductCategories",
        payload
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to add category");
      }

      // optionally update local state
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to add category"
        );
      }
      throw new Error("Failed to add category");
    }
  };

  const updateCategory = async (
    id: string,
    updates: Partial<Category>
  ): Promise<void> => {
    try {
      const response = await axios.put(
        `http://rashroff3decommerce.somee.com/api/ProductCategories/${id}`,
        updates
      );

      setCategories((prev) =>
        prev.map((category) =>
          category.id === id
            ? { ...response.data, productCount: category.productCount }
            : category
        )
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to update category"
        );
      }
      throw new Error("Failed to update category");
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    try {
      await axios.delete(
        `http://rashroff3decommerce.somee.com/api/ProductCategories/${id}`
      );
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Failed to delete category"
        );
      }
      throw new Error("Failed to delete category");
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [deleteCategory, addCategory, updateCategory]);

  const value = {
    products,
    categories,
    isLoading,
    error,
    fetchedCategories,
    setFetchedCategories,
    searchProducts,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    getNewProducts,
    getOnSaleProducts,
    getRelatedProducts,
    refreshProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
  };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
};
