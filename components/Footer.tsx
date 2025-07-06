"use client";

import { motion } from "framer-motion";
import {
  Package,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  ArrowRight,
  Heart,
  Shield,
  Truck,
  RotateCcw,
  CreditCard,
  Globe,
  Star,
} from "lucide-react";
import {
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaPaypal,
  FaApplePay,
  FaGooglePay,
} from "react-icons/fa"; // Font Awesome icons

const paymentMethods = [
  { name: "Visa", icon: <FaCcVisa className="w-6 h-6 text-blue-600" /> },
  {
    name: "Mastercard",
    icon: <FaCcMastercard className="w-6 h-6 text-red-600" />,
  },

  { name: "PayPal", icon: <FaPaypal className="w-6 h-6 text-blue-500" /> },
];

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: "About Us", href: "#" },
      { label: "Our Story", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
      { label: "Blog", href: "#" },
    ],
    support: [
      { label: "Help Center", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "Shipping Info", href: "#" },
      { label: "Returns", href: "#" },
      { label: "Size Guide", href: "#" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
      { label: "GDPR", href: "#" },
      { label: "Accessibility", href: "#" },
    ],
    categories: [
      { label: "Electronics", onClick: () => onNavigate("shop") },
      { label: "Smart Home", onClick: () => onNavigate("shop") },
      { label: "Kitchen", onClick: () => onNavigate("shop") },
      { label: "Lighting", onClick: () => onNavigate("shop") },
      { label: "Security", onClick: () => onNavigate("shop") },
    ],
  };

  const socialLinks = [
    {
      icon: Facebook,
      href: "#",
      label: "Facebook",
      color: "hover:text-blue-600",
    },
    {
      icon: Twitter,
      href: "#",
      label: "Twitter",
      color: "hover:text-blue-400",
    },
    {
      icon: Instagram,
      href: "#",
      label: "Instagram",
      color: "hover:text-pink-600",
    },
    // { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-red-600' },
    // { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:text-blue-700' },
  ];

  // Removed duplicate paymentMethods array of strings to avoid conflict

  const trustBadges = [
    { icon: Shield, text: "SSL Secure" },
    { icon: Truck, text: "Free Shipping" },
    { icon: RotateCcw, text: "30-Day Returns" },
    { icon: Star, text: "5-Star Rated" },
  ];

  return (
    <footer className="footer-gradient text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-700">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold mb-4">Stay in the Loop</h3>
              <p className="text-gray-300 mb-8 text-lg">
                Get exclusive deals, new product announcements, and tech
                insights delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-rashford-gold focus:border-transparent"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-rashford-gold text-rashford-dark rounded-lg font-semibold hover:bg-rashford-gold/90 transition-colors flex items-center justify-center gap-2"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Join 50,000+ subscribers. No spam, unsubscribe anytime.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-rashford-red to-rashford-gold rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Rashford3D</span>
              </div>
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                Pioneering the future of 3D technology and smart electronics. We
                create innovative products that enhance your lifestyle with
                cutting-edge design and premium quality.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-rashford-gold" />
                  <span className="text-gray-300">
                    123 Innovation Street, Tech City, TC 12345
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-rashford-gold" />
                  <span className="text-gray-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-rashford-gold" />
                  <span className="text-gray-300">hello@rashford3d.com</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`social-icon bg-white/10 ${social.color} transition-all duration-300`}
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-6">Company</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-rashford-gold transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Support */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold mb-6">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-300 hover:text-rashford-gold transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Categories */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="text-lg font-semibold mb-6">Categories</h4>
              <ul className="space-y-3">
                {footerLinks.categories.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={link.onClick}
                      className="text-gray-300 hover:text-rashford-gold transition-colors duration-200 text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-700"
        >
          <div className="container mx-auto px-4">
            <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
            <div className="flex flex-wrap gap-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.name}
                  className="flex items-center space-x-2 bg-white px-3 py-2 rounded shadow-sm"
                >
                  {method.icon}
                  <span className="text-sm font-medium text-gray-800">
                    {method.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           
          </div> */}

          {/* Payment Methods */}
        </motion.div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-2 text-gray-300"
            >
              <span>&copy; {currentYear} Rashford3D. All rights reserved.</span>
              <span className="hidden md:inline">|</span>
              <span className="hidden md:inline">Powered by</span>
              <span className="hidden md:inline"> ImaanSoft Solution</span>
            </motion.div>

            {/* Legal Links */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4 text-sm"
            >
              {footerLinks.legal.slice(0, 3).map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-rashford-gold transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="back-to-top"
        aria-label="Back to top"
      >
        <ArrowRight className="w-5 h-5 transform -rotate-90" />
      </motion.button>
    </footer>
  );
}
