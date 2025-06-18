import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePageTitle } from "../../hooks/usePageTitle";
import { sections } from "../../components/website/docs/sectionsData";

// Section Components
import IntroductionSection from "../../components/website/docs/IntroductionSection";
import GettingStartedSection from "../../components/website/docs/GettingStartedSection";
import MasterSetupSection from "../../components/website/docs/MasterSetupSection";
import InventoryManagementSection from "../../components/website/docs/InventoryManagementSection";
import OrderManagementSection from "../../components/website/docs/OrderManagementSection";
import ProductionTrackingSection from "../../components/website/docs/ProductionTrackingSection";
import ReportsAnalyticsSection from "../../components/website/docs/ReportsAnalyticsSection";
import SettingsCustomizationSection from "../../components/website/docs/SettingsCustomizationSection";
import MobileAppGuideSection from "../../components/website/docs/MobileAppGuideSection";
import FAQsSection from "../../components/website/docs/FAQsSection";
import EmployeeManagementSection from "../../components/website/docs/EmployeeManagementSection";
import FinancialManagementSection from "../../components/website/docs/FinancialManagementSection";

export default function DocumentationPage() {
  usePageTitle({
    title: "Documentation | TexIntelli",
    description: "Learn everything about TexIntelli to streamline your production and inventory management.",
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeIndex]);

  const renderCurrentSection = () => {
    const currentId = sections[activeIndex]?.id;
    switch (currentId) {
      case "introduction": return <IntroductionSection />;
      case "getting-started": return <GettingStartedSection />;
      case "master-setup": return <MasterSetupSection />;
      case "inventory-management": return <InventoryManagementSection />;
      case "order-management": return <OrderManagementSection />;
      case "production-tracking": return <ProductionTrackingSection />;
      case "reports-analytics": return <ReportsAnalyticsSection />;
      case "settings-customization": return <SettingsCustomizationSection />;
      case "mobile-app-guide": return <MobileAppGuideSection />;
      case "faq": return <FAQsSection />;
      case "employee-management": return <EmployeeManagementSection />;
      case "financial-management": return <FinancialManagementSection />;
      default: return null;
    }
  };

  return (
    <div className="flex h-auto min-h-screen bg-white">

      {/* 🔵 Top Progress Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-blue-600 z-50 transition-all"
        style={{ width: `${((activeIndex + 1) / sections.length) * 100}%` }}
      />

      {/* 🧭 Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-50 p-6 border-r border-gray-200 sticky top-0 h-screen">
        <h2 className="text-xl font-bold mb-6 text-gray-900">Documentation</h2>
        <nav className="flex flex-col gap-4">
          {sections.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => setActiveIndex(idx)}
              className={`text-left transition hover:text-blue-600 ${
                activeIndex === idx
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600"
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* 📱 Mobile Menu Toggle */}
      <button
        className="fixed top-4 left-4 md:hidden z-50 bg-blue-600 text-white p-2 rounded-md shadow"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "Close" : "Menu"}
      </button>

      {/* 📱 Mobile Sidebar */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white p-8 z-40 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-900">Docs</h2>
          {sections.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveIndex(idx);
                setMenuOpen(false);
              }}
              className="text-left text-gray-700 text-lg"
            >
              {section.label}
            </button>
          ))}
        </div>
      )}

      {/* 📝 Main Content */}
      <main className="flex-1 p-6 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl w-full"
        >
          {renderCurrentSection()}

          {/* ⬅️➡️ Prev/Next Buttons */}
          <div className="mt-12 flex justify-between pt-6 border-t border-gray-200">
            <button
              onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
              disabled={activeIndex === 0}
              className={`px-6 py-2 rounded-full font-semibold ${
                activeIndex === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-300 text-gray-900 hover:bg-gray-400"
              }`}
            >
              Previous
            </button>

            <button
              onClick={() => setActiveIndex((prev) => Math.min(prev + 1, sections.length - 1))}
              disabled={activeIndex === sections.length - 1}
              className={`px-6 py-2 rounded-full font-semibold ${
                activeIndex === sections.length - 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {activeIndex < sections.length - 1 ? `Next: ${sections[activeIndex + 1].label}` : "Next"}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}