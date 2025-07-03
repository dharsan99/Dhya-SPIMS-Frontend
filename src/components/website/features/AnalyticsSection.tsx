import { motion } from "framer-motion";
import { FiBarChart2, FiPieChart, FiTrendingUp } from "react-icons/fi";

const features = [
  {
    icon: FiBarChart2,
    title: "Production Reports",
    description: "Comprehensive production analytics and reporting",
    benefits: [
      "Daily, weekly, monthly production summaries",
      "Order, machine, shift, and shade level analytics",
      "Year-on-year efficiency improvement tracking"
    ]
  },
  {
    icon: FiPieChart,
    title: "Inventory Insights",
    description: "Detailed inventory analytics and reporting",
    benefits: [
      "Fiber consumption reporting",
      "Aging inventory reports",
      "Shortage predictions & alerts"
    ]
  },
  {
    icon: FiTrendingUp,
    title: "Order Progress Reports",
    description: "Complete order progress tracking and analytics",
    benefits: [
      "Realization percentage trackers",
      "Order dispatch progress monitoring",
      "Pending quantity insights"
    ]
  }
];

export default function AnalyticsSection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Analytics & Reports
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Make data-driven decisions with comprehensive analytics and detailed reporting.
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
              className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {feature.description}
              </p>
              <ul className="space-y-3">
                {feature.benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start">
                    <span className="text-orange-600 dark:text-orange-400 mr-2">•</span>
                    <span className="text-gray-600 dark:text-gray-300">{benefit}</span>
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