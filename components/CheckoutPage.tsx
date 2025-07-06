"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  CreditCard,
  Lock,
  Truck,
  MapPin,
  User,
  Mail,
  Phone,
  Building,
  Check,
  ArrowLeft,
  ArrowRight,
  Shield,
  Package,
  Calendar,
  Clock,
  Gift,
  AlertCircle,
  Info,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "react-hot-toast";

interface CheckoutPageProps {
  onNavigate: (page: string, data?: any) => void;
  cartItems: any[];
  cartTotal: number;
  user: any;
  onOrderComplete: (orderData: any) => void;
}
interface CheckoutFormData {
  // Shipping
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;

  // Billing
  billingDifferent: boolean;
  billingFirstName: string;
  billingLastName: string;
  billingAddress: string;
  billingCity: string;
  billingState: string;
  billingZipCode: string;
  billingCountry: string;

  // Payment
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;

  // Delivery
  shippingMethod: string;
  deliveryInstructions: string;
  giftMessage: string;
  isGift: boolean;
}

export default function CheckoutPage({
  onNavigate,
  cartItems,
  cartTotal,
  user,
  onOrderComplete,
}: CheckoutPageProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    // Shipping Information
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
    address: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zipCode: user?.address?.zipCode || "",
    country: user?.address?.country || "United States",

    // Billing Information
    billingDifferent: false,
    billingFirstName: "",
    billingLastName: "",
    billingAddress: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    billingCountry: "United States",

    // Payment Information
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",

    // Delivery Options
    shippingMethod: "standard",
    deliveryInstructions: "",
    giftMessage: "",
    isGift: false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof CheckoutFormData, string>>
  >({});

  const { getCartSubtotal, getCartTax, getCartShipping, clearCart } = useCart();

  const subtotal = getCartSubtotal();
  const tax = getCartTax();
  const shipping = getCartShipping();
  const total = subtotal + tax + shipping;

  const steps = [
    { id: 1, title: "Shipping", icon: Truck },
    { id: 2, title: "Payment", icon: CreditCard },
    { id: 3, title: "Review", icon: Check },
  ];

  const shippingMethods = [
    {
      id: "standard",
      name: "Standard Shipping",
      description: "5-7 business days",
      price: shipping,
      icon: Package,
    },
    {
      id: "express",
      name: "Express Shipping",
      description: "2-3 business days",
      price: 15.99,
      icon: Clock,
    },
    {
      id: "overnight",
      name: "Overnight Shipping",
      description: "Next business day",
      price: 29.99,
      icon: ArrowRight,
    },
  ];

  const handleInputChange = <K extends keyof CheckoutFormData>(
    field: K,
    value: CheckoutFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
    if (step === 1) {
      // Shipping validation
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email is invalid";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required";

      // Billing validation if different
      if (formData.billingDifferent) {
        if (!formData.billingFirstName.trim())
          newErrors.billingFirstName = "Billing first name is required";
        if (!formData.billingLastName.trim())
          newErrors.billingLastName = "Billing last name is required";
        if (!formData.billingAddress.trim())
          newErrors.billingAddress = "Billing address is required";
        if (!formData.billingCity.trim())
          newErrors.billingCity = "Billing city is required";
        if (!formData.billingState.trim())
          newErrors.billingState = "Billing state is required";
        if (!formData.billingZipCode.trim())
          newErrors.billingZipCode = "Billing ZIP code is required";
      }
    }

    if (step === 2) {
      // Payment validation
      if (!formData.cardNumber.trim())
        newErrors.cardNumber = "Card number is required";
      else if (formData.cardNumber.replace(/\s/g, "").length < 16)
        newErrors.cardNumber = "Card number is invalid";
      if (!formData.expiryDate.trim())
        newErrors.expiryDate = "Expiry date is required";
      if (!formData.cvv.trim()) newErrors.cvv = "CVV is required";
      else if (formData.cvv.length < 3) newErrors.cvv = "CVV is invalid";
      if (!formData.cardName.trim())
        newErrors.cardName = "Cardholder name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const orderData = {
        orderId: "ORD-" + Date.now(),
        total: total.toFixed(2),
        itemCount: cartItems.length,
        items: cartItems,
        shipping: formData,
        payment: {
          method: "Credit Card",
          last4: formData.cardNumber.slice(-4),
        },
        estimatedDelivery: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toLocaleDateString(),
      };

      clearCart();
      onOrderComplete(orderData);
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <button onClick={() => onNavigate("shop")} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="breadcrumbs mb-8">
          <button
            onClick={() => onNavigate("home")}
            className="breadcrumb-item"
          >
            Home
          </button>
          <span className="breadcrumb-separator">/</span>
          <button
            onClick={() => onNavigate("cart")}
            className="breadcrumb-item"
          >
            Cart
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="text-rashford-red">Checkout</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Secure Checkout
          </h1>
          <p className="text-gray-600">
            Complete your order in just a few steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`step-indicator ${isActive ? "active" : ""} ${
                      isCompleted ? "completed" : ""
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>
                  <span
                    className={`ml-2 font-medium ${
                      isActive
                        ? "text-rashford-red"
                        : isCompleted
                        ? "text-rashford-gold"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <div className="w-16 h-0.5 bg-gray-300 mx-4"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Shipping Information */}
                {currentStep === 1 && (
                  <motion.div
                    key="shipping"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center space-x-2 mb-6">
                      <Truck className="w-6 h-6 text-rashford-red" />
                      <h2 className="text-2xl font-bold text-gray-900">
                        Shipping Information
                      </h2>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            First Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="text"
                              value={formData.firstName}
                              onChange={(e) =>
                                handleInputChange("firstName", e.target.value)
                              }
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent ${
                                errors.firstName
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter first name"
                            />
                          </div>
                          {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.firstName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent ${
                              errors.lastName
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Enter last name"
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.lastName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent ${
                                errors.email
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter email address"
                            />
                          </div>
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent ${
                                errors.phone
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter phone number"
                            />
                          </div>
                          {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.phone}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Shipping Address
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address *
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="text"
                              value={formData.address}
                              onChange={(e) =>
                                handleInputChange("address", e.target.value)
                              }
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent ${
                                errors.address
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter street address"
                            />
                          </div>
                          {errors.address && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.address}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City *
                            </label>
                            <input
                              type="text"
                              value={formData.city}
                              onChange={(e) =>
                                handleInputChange("city", e.target.value)
                              }
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent ${
                                errors.city
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter city"
                            />
                            {errors.city && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.city}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State *
                            </label>
                            <input
                              type="text"
                              value={formData.state}
                              onChange={(e) =>
                                handleInputChange("state", e.target.value)
                              }
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent ${
                                errors.state
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter state"
                            />
                            {errors.state && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.state}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              ZIP Code *
                            </label>
                            <input
                              type="text"
                              value={formData.zipCode}
                              onChange={(e) =>
                                handleInputChange("zipCode", e.target.value)
                              }
                              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent ${
                                errors.zipCode
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="Enter ZIP code"
                            />
                            {errors.zipCode && (
                              <p className="text-red-500 text-sm mt-1">
                                {errors.zipCode}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Method */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Shipping Method
                      </h3>
                      <div className="space-y-3">
                        {shippingMethods.map((method) => {
                          const Icon = method.icon;
                          return (
                            <label
                              key={method.id}
                              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${
                                formData.shippingMethod === method.id
                                  ? "border-rashford-red bg-red-50"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              <input
                                type="radio"
                                name="shippingMethod"
                                value={method.id}
                                checked={formData.shippingMethod === method.id}
                                onChange={(e) =>
                                  handleInputChange(
                                    "shippingMethod",
                                    e.target.value
                                  )
                                }
                                className="sr-only"
                              />
                              <Icon className="w-5 h-5 text-rashford-red mr-3" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-gray-900">
                                    {method.name}
                                  </h4>
                                  <span className="font-semibold text-gray-900">
                                    {method.price === 0
                                      ? "Free"
                                      : `$${method.price}`}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">
                                  {method.description}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    {/* Gift Options */}
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.isGift}
                          onChange={(e) =>
                            handleInputChange("isGift", e.target.checked)
                          }
                          className="rounded border-gray-300 text-rashford-red focus:ring-rashford-red"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          This is a gift
                        </span>
                      </label>

                      {formData.isGift && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4"
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Gift Message (Optional)
                          </label>
                          <textarea
                            value={formData.giftMessage}
                            onChange={(e) =>
                              handleInputChange("giftMessage", e.target.value)
                            }
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent"
                            placeholder="Enter your gift message..."
                          />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Payment Information */}
                {currentStep === 2 && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center space-x-2 mb-6">
                      <CreditCard className="w-6 h-6 text-rashford-red" />
                      <h2 className="text-2xl font-bold text-gray-900">
                        Payment Information
                      </h2>
                    </div>

                    {/* Security Notice */}
                    <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-sm text-green-800">
                        Your payment information is encrypted and secure
                      </span>
                    </div>

                    {/* Payment Form */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={formData.cardNumber}
                            onChange={(e) =>
                              handleInputChange(
                                "cardNumber",
                                formatCardNumber(e.target.value)
                              )
                            }
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent ${
                              errors.cardNumber
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                          />
                        </div>
                        {errors.cardNumber && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.cardNumber}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="text"
                              value={formData.expiryDate}
                              onChange={(e) =>
                                handleInputChange(
                                  "expiryDate",
                                  formatExpiryDate(e.target.value)
                                )
                              }
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent ${
                                errors.expiryDate
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                          </div>
                          {errors.expiryDate && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.expiryDate}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                              type="text"
                              value={formData.cvv}
                              onChange={(e) =>
                                handleInputChange(
                                  "cvv",
                                  e.target.value.replace(/\D/g, "")
                                )
                              }
                              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent ${
                                errors.cvv
                                  ? "border-red-500"
                                  : "border-gray-300"
                              }`}
                              placeholder="123"
                              maxLength={4}
                            />
                          </div>
                          {errors.cvv && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.cvv}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                          <input
                            type="text"
                            value={formData.cardName}
                            onChange={(e) =>
                              handleInputChange("cardName", e.target.value)
                            }
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-rashford-red focus:border-transparent ${
                              errors.cardName
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Enter cardholder name"
                          />
                        </div>
                        {errors.cardName && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.cardName}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Billing Address */}
                    <div>
                      <label className="flex items-center space-x-2 mb-4">
                        <input
                          type="checkbox"
                          checked={formData.billingDifferent}
                          onChange={(e) =>
                            handleInputChange(
                              "billingDifferent",
                              e.target.checked
                            )
                          }
                          className="rounded border-gray-300 text-rashford-red focus:ring-rashford-red"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Billing address is different from shipping address
                        </span>
                      </label>

                      {formData.billingDifferent && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="space-y-4"
                        >
                          <h3 className="text-lg font-semibold text-gray-900">
                            Billing Address
                          </h3>
                          {/* Billing form fields would go here - similar to shipping */}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review Order */}
                {currentStep === 3 && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center space-x-2 mb-6">
                      <Check className="w-6 h-6 text-rashford-red" />
                      <h2 className="text-2xl font-bold text-gray-900">
                        Review Your Order
                      </h2>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Order Items
                      </h3>
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                          >
                            <Image
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {item.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Shipping Information
                      </h3>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">
                          {formData.firstName} {formData.lastName}
                        </p>
                        <p className="text-gray-600">{formData.address}</p>
                        <p className="text-gray-600">
                          {formData.city}, {formData.state} {formData.zipCode}
                        </p>
                        <p className="text-gray-600">{formData.email}</p>
                        <p className="text-gray-600">{formData.phone}</p>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Payment Information
                      </h3>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">
                          Credit Card ending in {formData.cardNumber.slice(-4)}
                        </p>
                        <p className="text-gray-600">{formData.cardName}</p>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <label className="flex items-start space-x-2">
                        <input
                          type="checkbox"
                          className="mt-1 rounded border-gray-300 text-rashford-red focus:ring-rashford-red"
                          required
                        />
                        <span className="text-sm text-gray-700">
                          I agree to the{" "}
                          <a
                            href="#"
                            className="text-rashford-red hover:underline"
                          >
                            Terms and Conditions
                          </a>{" "}
                          and{" "}
                          <a
                            href="#"
                            className="text-rashford-red hover:underline"
                          >
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t">
                <button
                  onClick={
                    currentStep === 1
                      ? () => onNavigate("cart")
                      : handlePrevious
                  }
                  className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{currentStep === 1 ? "Back to Cart" : "Previous"}</span>
                </button>

                {currentStep < 3 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center space-x-2 btn-primary px-6 py-3"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="flex items-center space-x-2 btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="loading-spinner" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Place Order</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Security Badges */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>SSL Secure Checkout</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span>256-bit Encryption</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-green-600" />
                  <span>PCI DSS Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
