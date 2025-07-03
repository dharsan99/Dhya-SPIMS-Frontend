import { motion } from "framer-motion";
import { FiShoppingCart, FiActivity, FiTruck } from "react-icons/fi";

const features = [
  {
    icon: FiShoppingCart,
    title: "Sales Order Processing",
    description: "Streamlined order creation and management process",
    benefits: [
      "Full buyer & shade linked order creation",
      "Delivery deadlines and realization targets",
      "Production planning integration"
    ]
  },
  {
    icon: FiActivity,
    title: "Order Status Tracking",
    description: "Complete visibility into order lifecycle",
    benefits: [
      "Full order lifecycle monitoring",
      "Auto-updates from production data",
      "Real-time status tracking"
    ]
  },
  {
    icon: FiTruck,
    title: "Realization & Dispatch",
    description: "Efficient order fulfillment and dispatch management",
    benefits: [
      "Capture realization percentages",
      "Generate dispatch notes",
      "Complete order fulfillment monitoring"
    ]
  }
];

export default function OrderManagementSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Sales Order Management
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your order processing from creation to fulfillment with our comprehensive order management system.
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
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-purple-600" />
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
                    <span className="text-purple-600 mr-2">•</span>
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