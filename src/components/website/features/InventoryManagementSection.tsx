import { motion } from "framer-motion";
import { FiPackage, FiEye, FiAlertCircle } from "react-icons/fi";

const features = [
  {
    icon: FiPackage,
    title: "Fiber Stock Control",
    description: "Comprehensive fiber inventory management with automated tracking",
    benefits: [
      "Create new fiber entries with properties",
      "Real-time stock updates with auto-deduction",
      "Low-stock alerts and color-coded indicators"
    ]
  },
  {
    icon: FiEye,
    title: "Stock Visibility",
    description: "Complete visibility into your inventory levels and movements",
    benefits: [
      "Fiber availability dashboard",
      "Material planning visibility",
      "Shade-wise fiber utilization insights"
    ]
  },
  {
    icon: FiAlertCircle,
    title: "Smart Alerts",
    description: "Proactive alerts and notifications for inventory management",
    benefits: [
      "Low stock warnings",
      "Reorder point notifications",
      "Stock movement alerts"
    ]
  }
];

export default function InventoryManagementSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Smart Inventory Management
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take control of your inventory with real-time tracking, automated updates, and smart alerts.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {feature.description}
              </p>
              <ul className="space-y-3">
                {feature.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 