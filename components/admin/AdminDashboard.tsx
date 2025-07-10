// "use client";

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import AdminSidebar from "./AdminSidebar";
// import AdminHeader from "./AdminHeader";
// import AdminOverview from "./AdminOverview";
// import AdminProducts from "./AdminProducts";
// import AdminOrders from "./AdminOrders";
// import AdminUsers from "./AdminUsers";
// import AdminCategories from "./AdminCategories";
// import AdminAnalytics from "./AdminAnalytics";
// import AdminSettings from "./AdminSettings";
// type AdminTab =
//   | "overview"
//   | "products"
//   | "orders"
//   | "users"
//   | "categories"
//   | "analytics"
//   | "settings";

// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState<AdminTab>("overview");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const renderContent = () => {
//     switch (activeTab) {
//       case "overview":
//         return <AdminOverview />;
//       case "products":
//         return <AdminProducts />;
//       case "orders":
//         return <AdminOrders />;
//       case "users":
//         return <AdminUsers />;
//       case "categories":
//         return <AdminCategories />;
//       case "analytics":
//         return <AdminAnalytics />;
//       case "settings":
//         return <AdminSettings />;
//       default:
//         return <AdminOverview />;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <AdminSidebar
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         sidebarOpen={sidebarOpen}
//         setSidebarOpen={setSidebarOpen}
//       />

//       <div className="lg:ml-64">
//         <AdminHeader setSidebarOpen={setSidebarOpen} currentTab={activeTab} />

//         <main className="p-6">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={activeTab}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//             >
//               {renderContent()}
//             </motion.div>
//           </AnimatePresence>
//         </main>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminOverview from "./AdminOverview";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminUsers from "./AdminUsers";
import AdminCategories from "./AdminCategories";
import AdminAnalytics from "./AdminAnalytics";
import AdminSettings from "./AdminSettings";

type AdminTab =
  | "overview"
  | "products"
  | "orders"
  | "users"
  | "categories"
  | "analytics"
  | "settings";
interface AdminSidebarProps {
  activeTab: AdminTab;
  // setActiveTab: (tab: AdminTab) => void;
  setActiveTab: React.Dispatch<React.SetStateAction<AdminTab>>;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <AdminOverview />;
      case "products":
        return <AdminProducts />;
      case "orders":
        return <AdminOrders />;
      case "users":
        return <AdminUsers />;
      case "categories":
        return <AdminCategories />;
      case "analytics":
        return <AdminAnalytics />;
      case "settings":
        return <AdminSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="lg:ml-64">
        <AdminHeader setSidebarOpen={setSidebarOpen} currentTab={activeTab} />

        <main className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
