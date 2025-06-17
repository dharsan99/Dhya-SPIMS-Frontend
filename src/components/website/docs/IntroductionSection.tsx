import { motion } from "framer-motion";
import { FaIndustry, FaChartLine, FaMobileAlt, FaShieldAlt, FaUsers, FaCogs } from "react-icons/fa";

export default function IntroductionSection() {
  const features = [
    {
      icon: <FaIndustry className="w-8 h-8 text-blue-600" />,
      title: "Industry-Specific Design",
      description: "Built exclusively for spinning mills and textile production workflows, with deep understanding of industry processes."
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-blue-600" />,
      title: "Real-Time Visibility",
      description: "Monitor production, stock, and sales orders across locations instantly with intuitive dashboards."
    },
    {
      icon: <FaMobileAlt className="w-8 h-8 text-blue-600" />,
      title: "Mobile-First Approach",
      description: "Access critical information and perform key operations from anywhere using our mobile app."
    },
    {
      icon: <FaShieldAlt className="w-8 h-8 text-blue-600" />,
      title: "End-to-End Traceability",
      description: "Track every fiber batch from purchase to production to dispatch with comprehensive audit trails."
    },
    {
      icon: <FaUsers className="w-8 h-8 text-blue-600" />,
      title: "Role-Based Access",
      description: "Customized views and permissions for different user roles, from floor managers to executives."
    },
    {
      icon: <FaCogs className="w-8 h-8 text-blue-600" />,
      title: "Scalable Architecture",
      description: "Expand from a single unit to multiple plants with ease, maintaining consistent operations."
    }
  ];

  const modules = [
    {
      title: "Master Setup",
      description: "Configure fibers, yarns, blends, and shades with detailed specifications and quality parameters.",
      features: ["Material Management", "Quality Parameters", "Cost Centers", "Machine Setup"]
    },
    {
      title: "Order Management",
      description: "Manage buyers, sales orders, and track order realization with automated notifications.",
      features: ["Order Processing", "Buyer Management", "Delivery Tracking", "Payment Follow-up"]
    },
    {
      title: "Production Monitoring",
      description: "Track machine-wise and shift-wise production with real-time efficiency metrics.",
      features: ["Machine Monitoring", "Shift Management", "Efficiency Tracking", "Quality Control"]
    },
    {
      title: "Inventory Management",
      description: "Maintain real-time stock ledger and analyze usage patterns for optimal inventory levels.",
      features: ["Stock Tracking", "Material Movement", "Wastage Control", "Inventory Forecasting"]
    },
    {
      title: "Reports & Analytics",
      description: "Generate comprehensive reports on order progress, machine efficiency, and wastage insights.",
      features: ["Performance Metrics", "Cost Analysis", "Quality Reports", "Trend Analysis"]
    },
    {
      title: "Settings & Access Control",
      description: "Configure user roles, permissions, and notifications for secure and efficient operations.",
      features: ["User Management", "Role Configuration", "System Settings", "Notification Setup"]
    }
  ];

  return (
    <section id="introduction" className="px-6 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto py-12"
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Introduction to Dhya SPIMS
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive solution designed to transform spinning mill operations through intelligent production and inventory management.
          </p>
        </div>

        {/* Problem & Solution */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-red-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-red-700 mb-4">The Challenge</h2>
            <p className="text-gray-700 leading-relaxed">
              Spinning mills face significant challenges with disconnected processes, manual tracking, and delayed reporting. These inefficiencies lead to:
            </p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li>• Production bottlenecks and delays</li>
              <li>• Excess inventory and storage costs</li>
              <li>• Missed delivery timelines</li>
              <li>• Inefficient resource utilization</li>
              <li>• Limited visibility across operations</li>
            </ul>
          </div>
          <div className="bg-blue-50 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-blue-700 mb-4">Our Solution</h2>
            <p className="text-gray-700 leading-relaxed">
              Dhya SPIMS addresses these challenges by providing:
            </p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li>• Centralized process management</li>
              <li>• Real-time production tracking</li>
              <li>• Automated inventory control</li>
              <li>• Comprehensive reporting</li>
              <li>• End-to-end traceability</li>
            </ul>
          </div>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Core Modules */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Core Functional Modules
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {modules.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">{module.title}</h3>
                <p className="text-gray-600 mb-4">{module.description}</p>
                <div className="flex flex-wrap gap-2">
                  {module.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}