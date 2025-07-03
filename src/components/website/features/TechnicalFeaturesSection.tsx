import { motion } from "framer-motion";
import { FiDatabase, FiShield, FiSmartphone } from "react-icons/fi";

const features = [
  {
    icon: FiDatabase,
    title: "Data Management & Exports",
    description: "Comprehensive data management and export capabilities",
    benefits: [
      "Excel and CSV export functionality",
      "Custom report generation",
      "Offline reporting & backup"
    ]
  },
  {
    icon: FiShield,
    title: "Security Features",
    description: "Enterprise-grade security and access control",
    benefits: [
      "Role-based access control",
      "Secure user authentication",
      "Encrypted database layers"
    ]
  },
  {
    icon: FiSmartphone,
    title: "Responsive Design",
    description: "Fully responsive and mobile-friendly interface",
    benefits: [
      "Multi-device support",
      "Touch-friendly operations",
      "Optimized for all screen sizes"
    ]
  }
];

export default function TechnicalFeaturesSection() {
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
            Technical Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built with modern technology and enterprise-grade security for reliable performance.
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
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-indigo-600" />
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
                    <span className="text-indigo-600 mr-2">•</span>
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Future Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Future Integrations
          </h3>
          <p className="text-gray-600 max-w-3xl mx-auto">
            We're constantly expanding our integration capabilities to better serve your needs.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            {[
              "Tally ERP Integration",
              "QuickBooks Integration",
              "IoT Sensor Connectivity",
              "Live Machine Data Syncing"
            ].map((integration) => (
              <span
                key={integration}
                className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-full text-sm font-medium"
              >
                {integration}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 