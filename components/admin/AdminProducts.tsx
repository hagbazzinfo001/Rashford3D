"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Upload,
  Save,
  X,
  Package,
  DollarSign,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import { toast } from "react-hot-toast";
import { useDropzone } from "react-dropzone";
type ProductFormErrors = Partial<Record<keyof ProductFormType, string>>;

interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  brand: string;
  stockQuantity: number;
  sku: string;
  tags: string[];
  features: string[];
  specifications: Record<string, any>;
  images: string[];
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  discountPercentage?: number;
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  reviews: any[];
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
}

interface ProductFormType {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  subcategory: string;
  brand: string;
  stockQuantity: string;
  sku: string;
  tags: string;
  features: string;
  specifications: string;
  images: string[];
  isFeatured: boolean;
  isNew: boolean;
  isOnSale: boolean;
  discountPercentage: string;
}

// interface ProductFormType {
//   name: string;
//   description: string;
//   price: string;
//   originalPrice: string;
//   category: string;
//   subcategory: string;
//   brand: string;
//   stockQuantity: string;
//   sku: string;
//   tags: string;
//   features: string;
//   specifications: string;
//   images: string[];
//   isFeatured: boolean;
//   isNew: boolean;
//   isOnSale: boolean;
//   discountPercentage: string;
// }
export default function AdminProducts() {
  const { products, categories, addProduct, updateProduct, deleteProduct } =
    useProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // const [productForm, setProductForm] = useState<ProductFormType>({
  //   name: "",
  //   description: "",
  //   price: "",
  //   originalPrice: "",
  //   category: "",
  //   subcategory: "",
  //   brand: "",
  //   stockQuantity: "",
  //   sku: "",
  //   tags: "",
  //   features: "",
  //   specifications: "",
  //   images: [],
  //   isFeatured: false,
  //   isNew: false,
  //   isOnSale: false,
  //   discountPercentage: "",
  // });
  const [productForm, setProductForm] = useState<ProductFormType>({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    subcategory: "",
    brand: "",
    stockQuantity: "",
    sku: "",
    tags: "",
    features: "",
    specifications: "",
    images: [],
    isFeatured: false,
    isNew: false,
    isOnSale: false,
    discountPercentage: "",
  });

  const [errors, setErrors] = useState<ProductFormErrors>({});

  // Filter products
  const filteredProducts = products.filter((product: Product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
    onDrop: (acceptedFiles: File[]) => {
      // In a real app, you would upload to Cloudinary/Firebase here
      const imageUrls = acceptedFiles.map((file) => URL.createObjectURL(file));
      setProductForm((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }));
      toast.success(`${acceptedFiles.length} image(s) uploaded successfully`);
    },
  });

  const validateForm = () => {
    const newErrors: ProductFormErrors = {};

    if (!productForm.name.trim()) newErrors.name = "Product name is required";
    if (!productForm.description.trim())
      newErrors.description = "Description is required";
    if (!productForm.price || isNaN(Number(productForm.price)))
      newErrors.price = "Valid price is required";
    if (!productForm.category) newErrors.category = "Category is required";
    if (!productForm.brand.trim()) newErrors.brand = "Brand is required";
    if (!productForm.stockQuantity || isNaN(Number(productForm.stockQuantity)))
      newErrors.stockQuantity = "Valid stock quantity is required";
    if (!productForm.sku.trim()) newErrors.sku = "SKU is required";
    if (productForm.images.length === 0)
      newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const productData = {
        ...productForm,
        price: Number(productForm.price),
        originalPrice: productForm.originalPrice
          ? Number(productForm.originalPrice)
          : undefined,
        stockQuantity: Number(productForm.stockQuantity),
        discountPercentage: productForm.discountPercentage
          ? Number(productForm.discountPercentage)
          : undefined,
        tags: productForm.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        features: productForm.features
          .split("\n")
          .map((feature) => feature.trim())
          .filter(Boolean),
        specifications: productForm.specifications
          ? JSON.parse(productForm.specifications)
          : {},
        rating: 0,
        reviewCount: 0,
        inStock: Number(productForm.stockQuantity) > 0,
        reviews: [],
        shipping: {
          weight: 1,
          dimensions: { length: 10, width: 10, height: 10 },
          freeShipping: Number(productForm.price) > 40000, // Free shipping over ₦40,000
          estimatedDelivery: "2-4 business days",
        },
      };

      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, productData);
        toast.success("Product updated successfully");
        setShowEditModal(false);
      } else {
        await addProduct(productData);
        toast.success("Product added successfully");
        setShowAddModal(false);
      }

      resetForm();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to save product");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || "",
      category: product.category,
      subcategory: product.subcategory || "",
      brand: product.brand,
      stockQuantity: product.stockQuantity.toString(),
      sku: product.sku,
      tags: product.tags.join(", "),
      features: product.features.join("\n"),
      specifications: JSON.stringify(product.specifications, null, 2),
      images: product.images,
      isFeatured: product.isFeatured,
      isNew: product.isNew,
      isOnSale: product.isOnSale,
      discountPercentage: product.discountPercentage?.toString() || "",
    });
    setShowEditModal(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(productId);
        toast.success("Product deleted successfully");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to save product");
        }
      }
    }
  };

  const resetForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "",
      subcategory: "",
      brand: "",
      stockQuantity: "",
      sku: "",
      tags: "",
      features: "",
      specifications: "",
      images: [],
      isFeatured: false,
      isNew: false,
      isOnSale: false,
      discountPercentage: "",
    });
    setErrors({});
    setEditingProduct(null);
  };

  const removeImage = (index: number) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Product Management
          </h2>
          <p className="text-gray-600">
            Manage your product catalog and inventory
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="btn-admin flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </motion.button>
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
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="admin-grid">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="admin-card group"
          >
            <div className="relative">
              <Image
                src={product.images[0]}
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                {product.isFeatured && (
                  <span className="product-badge featured">Featured</span>
                )}
                {product.isNew && (
                  <span className="product-badge new">New</span>
                )}
                {product.isOnSale && (
                  <span className="product-badge sale">Sale</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-rashford-red">
                    ₦{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through ml-2">
                      ₦{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    product.inStock ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {product.inStock
                    ? `${product.stockQuantity} in stock`
                    : "Out of stock"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>SKU: {product.sku}</span>
                <span className="capitalize">{product.category}</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(product)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="admin-card text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery || selectedCategory !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Get started by adding your first product"}
          </p>
          <button onClick={() => setShowAddModal(true)} className="btn-admin">
            Add Product
          </button>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <div className="modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="modal-content max-w-4xl"
            >
              <div className="modal-header">
                <h3 className="text-lg font-semibold">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-body space-y-6">
                {/* Basic Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">
                    Basic Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Product Name *</label>
                      <input
                        type="text"
                        value={productForm.name}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className={`form-input ${
                          errors.name ? "border-red-500" : ""
                        }`}
                        placeholder="Enter product name"
                      />
                      {errors.name && (
                        <p className="form-error">{errors.name}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">SKU *</label>
                      <input
                        type="text"
                        value={productForm.sku}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            sku: e.target.value,
                          }))
                        }
                        className={`form-input ${
                          errors.sku ? "border-red-500" : ""
                        }`}
                        placeholder="Enter SKU"
                      />
                      {errors.sku && <p className="form-error">{errors.sku}</p>}
                    </div>

                    <div className="form-group md:col-span-2">
                      <label className="form-label">Description *</label>
                      <textarea
                        value={productForm.description}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className={`form-textarea ${
                          errors.description ? "border-red-500" : ""
                        }`}
                        rows={3}
                        placeholder="Enter product description"
                      />
                      {errors.description && (
                        <p className="form-error">{errors.description}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Brand *</label>
                      <input
                        type="text"
                        value={productForm.brand}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            brand: e.target.value,
                          }))
                        }
                        className={`form-input ${
                          errors.brand ? "border-red-500" : ""
                        }`}
                        placeholder="Enter brand name"
                      />
                      {errors.brand && (
                        <p className="form-error">{errors.brand}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Category *</label>
                      <select
                        value={productForm.category}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        className={`form-select ${
                          errors.category ? "border-red-500" : ""
                        }`}
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="form-error">{errors.category}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">
                    Pricing
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="form-group">
                      <label className="form-label">Price (₦) *</label>
                      <input
                        type="number"
                        value={productForm.price}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                        className={`form-input ${
                          errors.price ? "border-red-500" : ""
                        }`}
                        placeholder="0.00"
                        step="0.01"
                      />
                      {errors.price && (
                        <p className="form-error">{errors.price}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Original Price (₦)</label>
                      <input
                        type="number"
                        value={productForm.originalPrice}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            originalPrice: e.target.value,
                          }))
                        }
                        className="form-input"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Discount %</label>
                      <input
                        type="number"
                        value={productForm.discountPercentage}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            discountPercentage: e.target.value,
                          }))
                        }
                        className="form-input"
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>

                {/* Inventory */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">
                    Inventory
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Stock Quantity *</label>
                      <input
                        type="number"
                        value={productForm.stockQuantity}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            stockQuantity: e.target.value,
                          }))
                        }
                        className={`form-input ${
                          errors.stockQuantity ? "border-red-500" : ""
                        }`}
                        placeholder="0"
                        min="0"
                      />
                      {errors.stockQuantity && (
                        <p className="form-error">{errors.stockQuantity}</p>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tags</label>
                      <input
                        type="text"
                        value={productForm.tags}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            tags: e.target.value,
                          }))
                        }
                        className="form-input"
                        placeholder="tag1, tag2, tag3"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Separate tags with commas
                      </p>
                    </div>
                  </div>
                </div>

                {/* Product Features */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">
                    Features
                  </h4>
                  <div className="form-group">
                    <label className="form-label">Product Features</label>
                    <textarea
                      value={productForm.features}
                      onChange={(e) =>
                        setProductForm((prev) => ({
                          ...prev,
                          features: e.target.value,
                        }))
                      }
                      className="form-textarea"
                      rows={4}
                      placeholder="Enter each feature on a new line"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter each feature on a new line
                    </p>
                  </div>
                </div>

                {/* Images */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">
                    Product Images
                  </h4>
                  <div
                    {...getRootProps()}
                    className={`file-upload-area ${
                      isDragActive ? "dragover" : ""
                    } ${errors.images ? "border-red-500" : ""}`}
                  >
                    <input {...getInputProps()} />
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      {isDragActive
                        ? "Drop images here..."
                        : "Drag & drop images here, or click to select"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: JPG, PNG, WebP
                    </p>
                  </div>
                  {errors.images && (
                    <p className="form-error">{errors.images}</p>
                  )}

                  {productForm.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {productForm.images.map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image}
                            alt={`Product ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Status */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">
                    Product Status
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={productForm.isFeatured}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            isFeatured: e.target.checked,
                          }))
                        }
                        className="rounded border-gray-300 text-rashford-red focus:ring-rashford-red"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Featured Product
                      </span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={productForm.isNew}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            isNew: e.target.checked,
                          }))
                        }
                        className="rounded border-gray-300 text-rashford-red focus:ring-rashford-red"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        New Product
                      </span>
                    </label>

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={productForm.isOnSale}
                        onChange={(e) =>
                          setProductForm((prev) => ({
                            ...prev,
                            isOnSale: e.target.checked,
                          }))
                        }
                        className="rounded border-gray-300 text-rashford-red focus:ring-rashford-red"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        On Sale
                      </span>
                    </label>
                  </div>
                </div>
              </form>

              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  // onClick={handleSubmit}
                  disabled={isLoading}
                  className="btn-admin flex items-center gap-2"
                >
                  {isLoading ? (
                    <div className="loading-spinner" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
