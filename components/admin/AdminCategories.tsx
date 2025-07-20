"use client";

import { ReactEventHandler, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

import {
  Plus,
  Search,
  Edit,
  Trash2,
  Grid3X3,
  Save,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { useProducts } from "@/contexts/ProductContext";
import { toast } from "react-hot-toast";
import { useDropzone } from "react-dropzone";
// types.ts
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  parentId?: string;
  productCount?: number;
}
// type CategoryForm = Omit<Category, "id" | "productCount">;

export default function AdminCategories() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    fetchedCategories,
  } = useProducts();

  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  type CategoryFormFields = {
    name: string;
    slug: string;
    description: string;
    imageUrl: string;
    parentId: string;
  };

  const [categoryForm, setCategoryForm] = useState<CategoryFormFields>({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
    parentId: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CategoryFormFields, string>>
  >({});

  const filteredCategories = fetchedCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle file upload using react-dropzone
  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    try {
      const uploadedUrl = await uploadToCloudinary(acceptedFiles[0]);

      setCategoryForm((prev) => ({
        ...prev,
        imageUrl: uploadedUrl, // use for category or product
      }));

      toast.success("Image uploaded to Cloudinary!");
    } catch (error) {
      console.error(error);
      toast.error("Image upload failed");
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: false,
  });

  const validateForm = () => {
    const newErrors: Partial<Record<keyof CategoryFormFields, string>> = {};

    if (!categoryForm.name.trim()) newErrors.name = "Category name is required";
    if (!categoryForm.slug.trim()) newErrors.slug = "Category slug is required";
    if (!categoryForm.description.trim())
      newErrors.description = "Description is required";
    if (!categoryForm.imageUrl)
      newErrors.imageUrl = "Category image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    setCategoryForm((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryForm);
        toast.success("Category updated successfully");
        setShowEditModal(false);
      } else {
        await addCategory(categoryForm);
        toast.success("Category added successfully");
        setShowAddModal(false);
      }

      resetForm();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.imageUrl,
      parentId: category.parentId || "",
    });
    setShowEditModal(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this category? This action cannot be undone."
      )
    ) {
      try {
        await deleteCategory(categoryId);
        toast.success("Category deleted successfully");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Failed to save category");
        }
      }
    }
  };

  const resetForm = () => {
    setCategoryForm({
      name: "",
      slug: "",
      description: "",
      imageUrl: "",
      parentId: "",
    });
    setErrors({});
    setEditingCategory(null);
  };

  return (
    <div className=" w-[100%] space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          {/* <h2 className="text-2xl font-bold text-gray-900">
            Category Management
          </h2>
          <p className="text-gray-600">
            Organize your products with categories
          </p> */}
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="btn-admin flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </motion.button>
      </div>

      {/* Search */}
      <div className="admin-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="admin-grid">
        {filteredCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="admin-card group"
          >
            <div className="relative">
              <Image
                width={300}
                height={300}
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="absolute top-2 right-2">
                <span className="bg-rashford-red text-white px-2 py-1 rounded-full text-xs font-medium">
                  {category.productCount} products
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {category.description}
              </p>
              <p className="text-xs text-gray-500">Slug: {category.slug}</p>

              <div className="flex items-center gap-2 pt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleEdit(category)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(category.id)}
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
      {filteredCategories.length === 0 && (
        <div className="admin-card text-center py-12">
          <Grid3X3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No categories found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? "Try adjusting your search criteria"
              : "Get started by adding your first category"}
          </p>
          <button onClick={() => setShowAddModal(true)} className="btn-admin">
            Add Category
          </button>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <div className="modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="modal-content max-w-2xl"
            >
              <div className="modal-header">
                <h3 className="text-lg font-semibold">
                  {editingCategory ? "Edit Category" : "Add New Category"}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Category Name *</label>
                    <input
                      type="text"
                      value={categoryForm.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      className={`form-input ${
                        errors.name ? "border-red-500" : ""
                      }`}
                      placeholder="Enter category name"
                    />
                    {errors.name && <p className="form-error">{errors.name}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Slug *</label>
                    <input
                      type="text"
                      value={categoryForm.slug}
                      onChange={(e) =>
                        setCategoryForm((prev) => ({
                          ...prev,
                          slug: e.target.value,
                        }))
                      }
                      className={`form-input ${
                        errors.slug ? "border-red-500" : ""
                      }`}
                      placeholder="category-slug"
                    />
                    {errors.slug && <p className="form-error">{errors.slug}</p>}
                    <p className="text-xs text-gray-500 mt-1">
                      URL-friendly version of the name
                    </p>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    value={categoryForm.description}
                    onChange={(e) =>
                      setCategoryForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className={`form-textarea ${
                      errors.description ? "border-red-500" : ""
                    }`}
                    rows={3}
                    placeholder="Enter category description"
                  />
                  {errors.description && (
                    <p className="form-error">{errors.description}</p>
                  )}
                </div>

                {/* Category Image */}
                <div className="form-group">
                  <label className="form-label">Category Image *</label>
                  <div
                    {...getRootProps()}
                    className={`file-upload-area ${
                      isDragActive ? "dragover" : ""
                    } ${errors.imageUrl ? "border-red-500" : ""}`}
                  >
                    <input {...getInputProps()} />
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      {isDragActive
                        ? "Drop image here..."
                        : "Drag & drop an image here, or click to select"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports: JPG, PNG, WebP
                    </p>
                  </div>
                  {errors.imageUrl && (
                    <p className="form-error">{errors.imageUrl}</p>
                  )}

                  {categoryForm.imageUrl && (
                    <div className="mt-4">
                      <Image
                        width={100}
                        height={100}
                        src={categoryForm.imageUrl}
                        alt="Category preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
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
                  onClick={(e) =>
                    handleSubmit(
                      e as unknown as React.FormEvent<HTMLFormElement>
                    )
                  }
                  disabled={isLoading}
                  className="btn-admin flex items-center gap-2"
                >
                  {isLoading ? (
                    <div className="loading-spinner" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editingCategory ? "Update Category" : "Add Category"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
