import { motion } from "framer-motion";
import { usePageTitle } from "../../hooks/usePageTitle";
import ProductionTrackingSection from "../../components/website/features/ProductionTrackingSection";
import InventoryManagementSection from "../../components/website/features/InventoryManagementSection";
import OrderManagementSection from "../../components/website/features/OrderManagementSection";
import AnalyticsSection from "../../components/website/features/AnalyticsSection";
import TechnicalFeaturesSection from "../../components/website/features/TechnicalFeaturesSection";

export default function FeaturesPage() {
  usePageTitle({
    title: "Features | TexIntelli",
    description: "Discover the powerful features of TexIntelli - Smart Production & Inventory Management System for textile manufacturers.",
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
          >
            Powerful Features for Modern Textile Manufacturing
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            TexIntelli combines advanced technology with industry-specific features to streamline your production and inventory management.
          </motion.p>
        </div>
      </section>

      {/* Feature Sections */}
      <div className="max-w-7xl mx-auto px-6 pb-20 space-y-20">
        <ProductionTrackingSection />
        <InventoryManagementSection />
        <OrderManagementSection />
        <AnalyticsSection />
        <TechnicalFeaturesSection />
      </div>
    </div>
  );
} 