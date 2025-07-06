"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import Image from "next/image";
import {
  ArrowRight,
  Star,
  ShoppingCart,
  Heart,
  Eye,
  Truck,
  Shield,
  Headphones,
  RotateCcw,
  Zap,
  Globe,
  Award,
  Users,
  ChevronLeft,
  ChevronRight,
  Play,
  Quote,
  Package,
  Home,
  Coffee,
  Lightbulb,
  Camera,
  Lock,
  Speaker,
  Wind,
  Grid3X3,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
interface AnimatedCounterProps {
  value: number;
  suffix?: string;
}
interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  products: any[];
  categories: any[];
  isLoading: boolean;
}
interface Product {
  id: string;
  name: string;
  description: string;
  brand: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  discountPercentage?: number;
  // add any other fields you use
}

export default function HomePage({
  onNavigate,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  products,
  categories,
  isLoading,
}: HomePageProps) {
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [testimonialSlide, setTestimonialSlide] = useState(0);
  const [statsAnimated, setStatsAnimated] = useState(false);

  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    if (products.length > 0) {
      const featured = products.filter((p) => p.isFeatured).slice(0, 8);
      setFeaturedProducts(featured);
    }
  }, [products]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setStatsAnimated(true);
          }
        });
      },
      { threshold: 0.5 }
    );

    const statsElement = document.getElementById("stats-section");
    if (statsElement) {
      observer.observe(statsElement);
    }

    return () => {
      if (statsElement) {
        observer.unobserve(statsElement);
      }
    };
  }, []);

  const heroSlides = [
    {
      id: 1,
      title: "Revolutionary 3D Technology",
      subtitle: "Experience the Future of Design",
      description:
        "Discover our premium collection of 3D printed products and smart electronics",
      image:
        "https://images.pexels.com/photos/6476808/pexels-photo-6476808.jpeg?auto=compress&cs=tinysrgb&w=1600",
      cta: "Shop Now",
      features: ["Free Shipping", "30-Day Returns", "Premium Quality"],
    },
    {
      id: 2,
      title: "Smart Home Revolution",
      subtitle: "Transform Your Living Space",
      description: "Cutting-edge smart devices that adapt to your lifestyle",
      image:
        "https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg?auto=compress&cs=tinysrgb&w=1600",
      cta: "Explore Collection",
      features: ["Voice Control", "App Integration", "Energy Efficient"],
    },
    {
      id: 3,
      title: "Premium Electronics",
      subtitle: "Innovation at Its Finest",
      description:
        "High-performance electronics designed for the modern lifestyle",
      image:
        "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1600",
      cta: "Discover More",
      features: ["Latest Technology", "Warranty Included", "Expert Support"],
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Product Designer",
      content:
        "Absolutely love the quality and innovation of Rashford3D products. The smart home integration is seamless!",
      avatar:
        "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200",
      rating: 5,
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Tech Enthusiast",
      content:
        "The 3D printed components are incredibly durable and beautifully designed. Highly recommended!",
      avatar:
        "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200",
      rating: 5,
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      role: "Home Owner",
      content:
        "Best purchase I've made this year. The customer service is outstanding and the products exceed expectations.",
      avatar:
        "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=200",
      rating: 5,
    },
  ];

  const stats = [
    { id: 1, value: 50000, label: "Happy Customers", suffix: "+" },
    { id: 2, value: 1200, label: "Products Sold", suffix: "+" },
    { id: 3, value: 98, label: "Customer Satisfaction", suffix: "%" },
    { id: 4, value: 24, label: "Countries Served", suffix: "+" },
  ];

  const features = [
    {
      id: 1,
      icon: Truck,
      title: "Free Shipping",
      description: "Free shipping on all orders over $100",
    },
    {
      id: 2,
      icon: Shield,
      title: "Secure Payment",
      description: "100% secure payment processing",
    },
    {
      id: 3,
      icon: RotateCcw,
      title: "30-Day Returns",
      description: "Easy returns within 30 days",
    },
    {
      id: 4,
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support",
    },
  ];

  const icons: Record<string, LucideIcon> = {
    electronics: Zap,
    "smart-home": Home,
    accessories: Headphones,
    lighting: Lightbulb,
    security: Shield,
    audio: Speaker,
    house: Home,
    kitchen: Coffee,
    climate: Wind,
    "air-quality": Wind,
  };

  const getCategoryIcon = (categoryId: string): LucideIcon => {
    return icons[categoryId] || Grid3X3;
  };

  const AnimatedCounter = ({ value, suffix = "" }: AnimatedCounterProps) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (statsAnimated) {
        const timer = setInterval(() => {
          setCount((prev) => {
            const increment = Math.ceil(value / 100);
            return prev + increment >= value ? value : prev + increment;
          });
        }, 30);

        return () => clearInterval(timer);
      }
    }, [value, statsAnimated]);

    return (
      <span>
        {count.toLocaleString()}
        {suffix}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-300 rounded-lg mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-300 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHeroSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${heroSlides[currentHeroSlide].image})`,
              }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.div
            key={currentHeroSlide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-shadow">
              {heroSlides[currentHeroSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-rashford-gold font-semibold">
              {heroSlides[currentHeroSlide].subtitle}
            </p>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              {heroSlides[currentHeroSlide].description}
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {heroSlides[currentHeroSlide].features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
                >
                  <Star className="w-4 h-4 text-rashford-gold mr-2" />
                  <span className="text-sm font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate("shop")}
                className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2"
              >
                {heroSlides[currentHeroSlide].cta}
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Shop With Us
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Hero Navigation */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentHeroSlide ? "bg-rashford-gold" : "bg-white/50"
              }`}
            />
          ))}
        </div>

        {/* Hero Navigation Arrows */}
        <button
          onClick={() =>
            setCurrentHeroSlide(
              (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
            )
          }
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() =>
            setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length)
          }
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Rashford3D?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We&#39;re committed to providing the best shopping experience with
              premium products and exceptional service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="feature-icon mx-auto mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our diverse range of products across different categories.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              const Icon = getCategoryIcon(category.id);
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    onCategoryChange(category.id);
                    onNavigate("shop");
                  }}
                  className="relative group cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-w-16 aspect-h-9">
                    <Image
                      src={category.image}
                      alt={category.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center mb-2">
                      <Icon className="w-6 h-6 text-rashford-gold mr-2" />
                      <h3 className="text-2xl font-bold">{category.name}</h3>
                    </div>
                    <p className="text-gray-200 mb-2">{category.description}</p>
                    <p className="text-sm text-rashford-gold">
                      {category.productCount} products
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium products that combine
              innovation with style.
            </p>
          </motion.div>

          <div className="product-grid">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden card-hover group relative"
              >
                {/* Product Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="product-badge new">New</span>
                  )}
                  {product.isOnSale && (
                    <span className="product-badge sale">
                      -{product.discountPercentage}%
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="product-badge featured">Featured</span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className="wishlist-button"
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isInWishlist(product.id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>

                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-64 object-cover product-image"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      onClick={() => onNavigate("product-details", product)}
                      className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Quick View
                    </motion.button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 uppercase tracking-wide">
                      {product.brand}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">
                        {product.rating} ({product.reviewCount})
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-rashford-red">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                        isInCart(product.id)
                          ? "bg-green-100 text-green-700"
                          : "bg-rashford-red text-white hover:bg-rashford-red/90"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {isInCart(product.id) ? "Added" : "Add to Cart"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate("shop")}
              className="btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 mx-auto"
            >
              View All Products
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" className="py-20 bg-rashford-dark text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Numbers that speak to our commitment to excellence and customer
              satisfaction.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-rashford-gold mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-xl text-gray-300">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real feedback from real customers who love our products.
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialSlide}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="testimonial-card"
              >
                <div className="flex items-center mb-6">
                  <Image
                    src={testimonials[testimonialSlide].avatar}
                    alt={testimonials[testimonialSlide].name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">
                      {testimonials[testimonialSlide].name}
                    </h4>
                    <p className="text-gray-600">
                      {testimonials[testimonialSlide].role}
                    </p>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(testimonials[testimonialSlide].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                        />
                      )
                    )}
                  </div>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {testimonials[testimonialSlide].content}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setTestimonialSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === testimonialSlide
                      ? "bg-rashford-red"
                      : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-signup">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl mb-8">
              Subscribe to our newsletter and be the first to know about new
              products, exclusive deals, and special offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rashford-red"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-rashford-red text-white rounded-lg font-semibold hover:bg-rashford-red/90 transition-colors"
              >
                Subscribe
              </motion.button>
            </div>
            <p className="text-sm mt-4 opacity-80">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="trust-indicators">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="trust-indicator"
            >
              <Shield className="trust-indicator-icon" />
              <h4 className="font-semibold">Secure Shopping</h4>
              <p className="text-sm">SSL encrypted checkout</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="trust-indicator"
            >
              <Award className="trust-indicator-icon" />
              <h4 className="font-semibold">Quality Guaranteed</h4>
              <p className="text-sm">Premium products only</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="trust-indicator"
            >
              <Users className="trust-indicator-icon" />
              <h4 className="font-semibold">Trusted by Thousands</h4>
              <p className="text-sm">50,000+ happy customers</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="trust-indicator"
            >
              <Globe className="trust-indicator-icon" />
              <h4 className="font-semibold">Worldwide Shipping</h4>
              <p className="text-sm">24+ countries served</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
