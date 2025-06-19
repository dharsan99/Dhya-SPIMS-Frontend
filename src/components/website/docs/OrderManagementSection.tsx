import { motion } from "framer-motion";
import { FaShoppingCart, FaIndustry, FaRobot, FaCloud } from "react-icons/fa";

export default function OrderManagementSection() {
  const features = [
  {
      icon: <FaShoppingCart className="w-8 h-8 text-blue-600" />,
      title: "Intelligent Order Processing",
      description: "AI-powered order management system",
      details: [
        "AI-powered PO parsing (PDF/Image)",
        "Automated order creation",
        "Real-time stock visibility",
        "Multi-shade order support"
      ]
    },
    {
      icon: <FaIndustry className="w-8 h-8 text-blue-600" />,
      title: "Realization Management",
      description: "Advanced production planning",
      details: [
        "Realization percentage tracking",
        "Automated fiber calculations",
        "Stock sufficiency checks",
        "Production capacity planning"
      ]
  },
  {
      icon: <FaRobot className="w-8 h-8 text-blue-600" />,
      title: "AI-Powered Features",
      description: "Smart automation and insights",
      details: [
        "OCR-based PO parsing",
        "Production forecasting",
        "Delay prediction",
        "Resource optimization"
      ]
    },
    {
      icon: <FaCloud className="w-8 h-8 text-blue-600" />,
      title: "SaaS-Ready Platform",
      description: "Enterprise-grade scalability",
      details: [
        "Multi-factory support",
        "Role-based access",
        "API integrations",
        "Centralized monitoring"
      ]
    }
  ];

  const orderWorkflow = [
    {
      title: "Order Creation",
      steps: [
        "AI-powered PO parsing",
        "Buyer & shade selection",
        "Delivery scheduling",
        "Stock verification"
      ]
    },
    {
      title: "Production Planning",
      steps: [
        "Realization calculation",
        "Fiber allocation",
        "Machine assignment",
        "Capacity planning"
      ]
  },
  {
      title: "Production Execution",
      steps: [
        "Real-time monitoring",
        "Stock consumption",
        "Quality control",
        "Progress tracking"
      ]
    },
    {
      title: "Order Fulfillment",
      steps: [
        "Dispatch planning",
        "Documentation",
        "Quality verification",
        "Delivery tracking"
      ]
    }
  ];

  const aiFeatures = [
    {
      title: "PO Parsing",
      items: [
        "Multi-format support (PDF/Image)",
        "99% accuracy rate",
        "Automatic data extraction",
        "Validation pipeline"
      ]
    },
    {
      title: "Production Intelligence",
      items: [
        "Delay prediction",
        "Resource optimization",
        "Capacity forecasting",
        "Stock level prediction"
      ]
  },
  {
      title: "Analytics & Insights",
      items: [
        "Real-time dashboards",
        "Performance metrics",
        "Trend analysis",
        "Predictive alerts"
      ]
    }
  ];

  const traceability = [
    {
      title: "Digital Audit Trail",
      items: [
        "Complete order history",
        "User activity logs",
        "Approval workflows",
        "Change tracking"
      ]
    },
    {
      title: "Quality Assurance",
      items: [
        "Quality checkpoints",
        "Compliance records",
        "Documentation",
        "Traceability reports"
      ]
    }
  ];

  return (
    <section id="order-management" className="px-6 bg-white">
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
            Advanced Order Management System
        </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your textile manufacturing with AI-powered order management. From order creation to final dispatch, TexIntelli delivers complete automation and real-time visibility.
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

        {/* Order Workflow */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Complete Order Workflow
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {orderWorkflow.map((workflow, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{workflow.title}</h3>
                <ol className="space-y-3">
                  {workflow.steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {idx + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AI Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            AI-Powered Features
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {aiFeatures.map((feature, index) => (
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

        {/* Traceability */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Complete Traceability
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {traceability.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-blue-50 p-6 rounded-xl"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <ul className="space-y-2">
                  {item.items.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-700">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The TexIntelli Advantage</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Traditional Systems</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Manual data entry</li>
                <li>• Spreadsheet chaos</li>
                <li>• Inventory mismatch</li>
                <li>• Missed deadlines</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">With TexIntelli</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• AI-powered automation</li>
                <li>• Real-time dashboards</li>
                <li>• Stock reservation</li>
                <li>• Predictive alerts</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}