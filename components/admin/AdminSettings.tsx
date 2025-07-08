"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Save,
  Upload,
  Bell,
  Shield,
  Globe,
  Mail,
  Smartphone,
  CreditCard,
  Truck,
  Settings as SettingsIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Rashford3D",
    siteDescription: "Premium 3D Products & Electronics",
    siteUrl: "https://rashford3d.com",
    adminEmail: "admin@rashford3d.com",
    timezone: "Africa/Lagos",
    currency: "NGN",
    language: "en",

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    orderNotifications: true,
    stockAlerts: true,
    lowStockThreshold: 10,

    // Payment Settings
    stripePublicKey: "pk_test_...",
    stripeSecretKey: "sk_test_...",
    paystackPublicKey: "pk_test_...",
    paystackSecretKey: "sk_test_...",

    // Shipping Settings
    freeShippingThreshold: 40000,
    standardShippingRate: 2000,
    expressShippingRate: 5000,

    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordMinLength: 8,
    requirePasswordChange: false,

    // API Settings
    apiKey: "rsh_api_key_...",
    webhookUrl: "",
    rateLimitPerHour: 1000,
  });

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "security", label: "Security", icon: Shield },
    { id: "api", label: "API", icon: Globe },
  ];

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would save to API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Site Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Site Name</label>
                  <input
                    type="text"
                    value={settings.siteName}
                    onChange={(e) =>
                      handleInputChange("siteName", e.target.value)
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Site URL</label>
                  <input
                    type="url"
                    value={settings.siteUrl}
                    onChange={(e) =>
                      handleInputChange("siteUrl", e.target.value)
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group md:col-span-2">
                  <label className="form-label">Site Description</label>
                  <textarea
                    value={settings.siteDescription}
                    onChange={(e) =>
                      handleInputChange("siteDescription", e.target.value)
                    }
                    className="form-textarea"
                    rows={3}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Admin Email</label>
                  <input
                    type="email"
                    value={settings.adminEmail}
                    onChange={(e) =>
                      handleInputChange("adminEmail", e.target.value)
                    }
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={(e) =>
                      handleInputChange("timezone", e.target.value)
                    }
                    className="form-select"
                  >
                    <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                    <option value="UTC">UTC</option>
                    <option value="America/New_York">
                      America/New_York (EST)
                    </option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) =>
                      handleInputChange("currency", e.target.value)
                    }
                    className="form-select"
                  >
                    <option value="NGN">Nigerian Naira (₦)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) =>
                      handleInputChange("language", e.target.value)
                    }
                    className="form-select"
                  >
                    <option value="en">English</option>
                    <option value="yo">Yoruba</option>
                    <option value="ig">Igbo</option>
                    <option value="ha">Hausa</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="font-medium text-gray-900">
                        Email Notifications
                      </span>
                      <p className="text-sm text-gray-500">
                        Receive notifications via email
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) =>
                      handleInputChange("emailNotifications", e.target.checked)
                    }
                    className="rounded border-gray-300 text-rashford-red focus:ring-rashford-red"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="font-medium text-gray-900">
                        SMS Notifications
                      </span>
                      <p className="text-sm text-gray-500">
                        Receive notifications via SMS
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.smsNotifications}
                    onChange={(e) =>
                      handleInputChange("smsNotifications", e.target.checked)
                    }
                    className="rounded border-gray-300 text-rashford-red focus:ring-rashford-red"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="font-medium text-gray-900">
                        Order Notifications
                      </span>
                      <p className="text-sm text-gray-500">
                        Get notified about new orders
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.orderNotifications}
                    onChange={(e) =>
                      handleInputChange("orderNotifications", e.target.checked)
                    }
                    className="rounded border-gray-300 text-rashford-red focus:ring-rashford-red"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <SettingsIcon className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="font-medium text-gray-900">
                        Stock Alerts
                      </span>
                      <p className="text-sm text-gray-500">
                        Get notified when products are low in stock
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.stockAlerts}
                    onChange={(e) =>
                      handleInputChange("stockAlerts", e.target.checked)
                    }
                    className="rounded border-gray-300 text-rashford-red focus:ring-rashford-red"
                  />
                </label>

                <div className="form-group">
                  <label className="form-label">Low Stock Threshold</label>
                  <input
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={(e) =>
                      handleInputChange(
                        "lowStockThreshold",
                        parseInt(e.target.value)
                      )
                    }
                    className="form-input"
                    min="1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Alert when product stock falls below this number
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "payments":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payment Gateway Settings
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Stripe Configuration
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Stripe Public Key</label>
                      <input
                        type="text"
                        value={settings.stripePublicKey}
                        onChange={(e) =>
                          handleInputChange("stripePublicKey", e.target.value)
                        }
                        className="form-input"
                        placeholder="pk_test_..."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Stripe Secret Key</label>
                      <input
                        type="password"
                        value={settings.stripeSecretKey}
                        onChange={(e) =>
                          handleInputChange("stripeSecretKey", e.target.value)
                        }
                        className="form-input"
                        placeholder="sk_test_..."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Paystack Configuration
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-group">
                      <label className="form-label">Paystack Public Key</label>
                      <input
                        type="text"
                        value={settings.paystackPublicKey}
                        onChange={(e) =>
                          handleInputChange("paystackPublicKey", e.target.value)
                        }
                        className="form-input"
                        placeholder="pk_test_..."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Paystack Secret Key</label>
                      <input
                        type="password"
                        value={settings.paystackSecretKey}
                        onChange={(e) =>
                          handleInputChange("paystackSecretKey", e.target.value)
                        }
                        className="form-input"
                        placeholder="sk_test_..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "shipping":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Shipping Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">
                    Free Shipping Threshold (₦)
                  </label>
                  <input
                    type="number"
                    value={settings.freeShippingThreshold}
                    onChange={(e) =>
                      handleInputChange(
                        "freeShippingThreshold",
                        parseInt(e.target.value)
                      )
                    }
                    className="form-input"
                    min="0"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Orders above this amount get free shipping
                  </p>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Standard Shipping Rate (₦)
                  </label>
                  <input
                    type="number"
                    value={settings.standardShippingRate}
                    onChange={(e) =>
                      handleInputChange(
                        "standardShippingRate",
                        parseInt(e.target.value)
                      )
                    }
                    className="form-input"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Express Shipping Rate (₦)
                  </label>
                  <input
                    type="number"
                    value={settings.expressShippingRate}
                    onChange={(e) =>
                      handleInputChange(
                        "expressShippingRate",
                        parseInt(e.target.value)
                      )
                    }
                    className="form-input"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Security Settings
              </h3>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">
                      Two-Factor Authentication
                    </span>
                    <p className="text-sm text-gray-500">
                      Add an extra layer of security to admin accounts
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={(e) =>
                      handleInputChange("twoFactorAuth", e.target.checked)
                    }
                    className="rounded border-gray-300 text-rashford-red focus:ring-rashford-red"
                  />
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) =>
                        handleInputChange(
                          "sessionTimeout",
                          parseInt(e.target.value)
                        )
                      }
                      className="form-input"
                      min="5"
                      max="480"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Minimum Password Length
                    </label>
                    <input
                      type="number"
                      value={settings.passwordMinLength}
                      onChange={(e) =>
                        handleInputChange(
                          "passwordMinLength",
                          parseInt(e.target.value)
                        )
                      }
                      className="form-input"
                      min="6"
                      max="32"
                    />
                  </div>
                </div>

                <label className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">
                      Require Password Change
                    </span>
                    <p className="text-sm text-gray-500">
                      Force users to change passwords every 90 days
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.requirePasswordChange}
                    onChange={(e) =>
                      handleInputChange(
                        "requirePasswordChange",
                        e.target.checked
                      )
                    }
                    className="rounded border-gray-300 text-rashford-red focus:ring-rashford-red"
                  />
                </label>
              </div>
            </div>
          </div>
        );

      case "api":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                API Configuration
              </h3>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">API Key</label>
                  <div className="relative">
                    <input
                      type={showApiKey ? "text" : "password"}
                      value={settings.apiKey}
                      onChange={(e) =>
                        handleInputChange("apiKey", e.target.value)
                      }
                      className="form-input pr-10"
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showApiKey ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Use this key to authenticate API requests
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">Webhook URL</label>
                  <input
                    type="url"
                    value={settings.webhookUrl}
                    onChange={(e) =>
                      handleInputChange("webhookUrl", e.target.value)
                    }
                    className="form-input"
                    placeholder="https://your-site.com/webhook"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    URL to receive webhook notifications
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Rate Limit (requests per hour)
                  </label>
                  <input
                    type="number"
                    value={settings.rateLimitPerHour}
                    onChange={(e) =>
                      handleInputChange(
                        "rateLimitPerHour",
                        parseInt(e.target.value)
                      )
                    }
                    className="form-input"
                    min="100"
                    max="10000"
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-2">
                    API Documentation
                  </h4>
                  <p className="text-sm text-yellow-700">
                    View the complete API documentation at{" "}
                    <a href="#" className="underline">
                      https://docs.rashford3d.com/api
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-600">
            Configure your application settings and preferences
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={isLoading}
          className="btn-admin flex items-center gap-2"
        >
          {isLoading ? (
            <div className="loading-spinner" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Settings
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs Sidebar */}
        <div className="lg:col-span-1">
          <div className="admin-card p-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      activeTab === tab.id
                        ? "bg-rashford-red text-white hover:bg-rashford-red"
                        : "text-gray-700"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="admin-card">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
