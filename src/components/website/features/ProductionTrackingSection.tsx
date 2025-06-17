import { motion } from "framer-motion";
import { FiActivity, FiBarChart2, FiDatabase } from "react-icons/fi";

const features = [
  {
    icon: FiActivity,
    title: "Production Entry & Validation",
    description: "Log production against orders, machines, and shifts with automatic validation",
    benefits: [
      "Auto-link shade codes and order IDs",
      "Track real-time production progress",
      "Validate production entries automatically"
    ]
  },
  {
    icon: FiBarChart2,
    title: "Machine-Wise Monitoring",
    description: "Monitor and analyze production efficiency at machine level",
    benefits: [
      "Daily machine-wise output analysis",
      "Shift-wise efficiency metrics",
      "Underperformance identification"
    ]
  },
  {
    icon: FiDatabase,
    title: "Fiber Consumption Automation",
    description: "Automatically calculate and track fiber consumption",
    benefits: [
      "Auto-calculate fiber consumption",
      "Realization based blend composition",
      "Consumption optimization tracking"
    ]
  }
];

export default function ProductionTrackingSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Real-Time Production Tracking
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Monitor and optimize your production process with real-time tracking and automated calculations.
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
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-blue-600" />
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
                    <span className="text-blue-600 mr-2">•</span>
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