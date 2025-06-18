import { motion } from "framer-motion";
import { useState } from "react";
import { FaMobileAlt, FaBell, FaQrcode, FaSync } from "react-icons/fa";
import MobileAppNotificationModal from "./MobileAppNotificationModal";

export default function MobileAppGuideSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    {
      icon: <FaMobileAlt className="w-8 h-8 text-blue-600" />,
      title: "Mobile Dashboard",
      description: "Real-time access to key metrics",
      details: [
        "Production overview",
        "Order status",
        "Stock levels",
        "Performance metrics"
      ]
    },
    {
      icon: <FaBell className="w-8 h-8 text-blue-600" />,
      title: "Smart Notifications",
      description: "Instant alerts and updates",
      details: [
        "Order updates",
        "Stock alerts",
        "Production notifications",
        "Quality alerts"
      ]
    },
    {
      icon: <FaQrcode className="w-8 h-8 text-blue-600" />,
      title: "QR Code Scanning",
      description: "Quick data capture",
      details: [
        "Stock verification",
        "Material tracking",
        "Quality checks",
        "Process validation"
      ]
    },
    {
      icon: <FaSync className="w-8 h-8 text-blue-600" />,
      title: "Offline Mode",
      description: "Work without internet",
      details: [
        "Data synchronization",
        "Local storage",
        "Auto-sync when online",
        "Conflict resolution"
      ]
    }
  ];

  const securityFeatures = [
    {
      title: "Mobile Security",
      items: [
        "Biometric authentication",
        "Device management",
        "Secure data storage",
        "Encrypted communication"
      ]
    },
    {
      title: "Access Control",
      items: [
        "Role-based access",
        "Location-based restrictions",
        "Time-based access",
        "Device restrictions"
      ]
    },
    {
      title: "Data Protection",
      items: [
        "End-to-end encryption",
        "Secure file sharing",
        "Data backup",
        "Remote wipe capability"
      ]
    }
  ];

  const upcomingFeatures = [
    {
      title: "Production Management",
      items: [
        "Real-time production tracking",
        "Machine monitoring",
        "Quality control",
        "Process optimization"
      ]
    },
    {
      title: "Inventory Control",
      items: [
        "Stock scanning",
        "Material tracking",
        "Inventory alerts",
        "Stock transfers"
      ]
    },
    {
      title: "Order Management",
      items: [
        "Order creation",
        "Status updates",
        "Delivery tracking",
        "Customer communication"
      ]
    }
  ];

  const integrationFeatures = [
    {
      title: "Cloud Integration",
      items: [
        "Real-time sync",
        "Cross-device access",
        "Data backup",
        "Version control"
      ]
    },
    {
      title: "Third-party Apps",
      items: [
        "ERP integration",
        "CRM connection",
        "Analytics tools",
        "Communication apps"
      ]
    }
  ];

  return (
    <section id="mobile-app" className="px-6 bg-white">
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
            Mobile App (Coming Soon)
        </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take TexIntelli on the go with our upcoming mobile application. Manage your spinning mill operations from anywhere with real-time access to critical data and features.
          </p>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-600">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Security Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Security Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <ul className="space-y-2">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-600">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Upcoming Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {upcomingFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <ul className="space-y-2">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-600">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Integration Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Integration Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {integrationFeatures.map((feature, index) => (
        <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-blue-50 p-6 rounded-xl"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <ul className="space-y-2">
                  {feature.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
        </motion.div>
            ))}
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
          <p className="text-lg mb-6">
            The TexIntelli mobile app is currently in development. Stay tuned for updates and be among the first to experience mobile management of your spinning mill operations.
          </p>
          <div className="flex justify-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition"
            >
              Get Notified
            </button>
          </div>
        </div>

        {/* Notification Modal */}
        <MobileAppNotificationModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </motion.div>
    </section>
  );
}