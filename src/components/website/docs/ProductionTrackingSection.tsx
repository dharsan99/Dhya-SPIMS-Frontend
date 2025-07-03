import { motion } from "framer-motion";
import { FaIndustry, FaChartLine, FaRobot, FaTachometerAlt } from "react-icons/fa";

export default function ProductionTrackingSection() {
  const features = [
    {
      icon: <FaIndustry className="w-8 h-8 text-blue-600" />,
      title: "Real-Time Production Monitoring",
      description: "Live tracking of production metrics",
      details: [
        "Machine-wise production tracking",
        "Shift-wise performance metrics",
        "Operator efficiency monitoring",
        "Real-time production status"
      ]
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-blue-600" />,
      title: "Advanced Analytics",
      description: "Comprehensive production insights",
      details: [
        "Production trend analysis",
        "Efficiency metrics",
        "Quality performance tracking",
        "Resource utilization reports"
      ]
    },
    {
      icon: <FaRobot className="w-8 h-8 text-blue-600" />,
      title: "AI-Powered Insights",
      description: "Smart production optimization",
      details: [
        "Predictive maintenance alerts",
        "Production bottleneck detection",
        "Resource optimization suggestions",
        "Quality prediction models"
      ]
    },
    {
      icon: <FaTachometerAlt className="w-8 h-8 text-blue-600" />,
      title: "Performance Metrics",
      description: "Comprehensive KPI tracking",
      details: [
        "Machine efficiency scores",
        "Operator productivity metrics",
        "Quality compliance rates",
        "Resource utilization stats"
      ]
    }
  ];

  const monitoringFeatures = [
    {
      title: "Production Tracking",
      items: [
        "Real-time machine status",
        "Production quantity tracking",
        "Quality parameter monitoring",
        "Waste and efficiency metrics"
      ]
    },
    {
      title: "Quality Control",
      items: [
        "Quality checkpoints",
        "Parameter monitoring",
        "Defect tracking",
        "Compliance verification"
      ]
    },
    {
      title: "Resource Management",
      items: [
        "Material consumption tracking",
        "Machine utilization",
        "Operator allocation",
        "Energy consumption"
      ]
    }
  ];

  const analytics = [
    {
      title: "Production Analytics",
      items: [
        "Daily production trends",
        "Machine-wise analysis",
        "Shift performance comparison",
        "Efficiency metrics"
      ]
    },
    {
      title: "Quality Analytics",
      items: [
        "Quality trend analysis",
        "Defect pattern detection",
        "Parameter compliance",
        "Quality improvement insights"
      ]
    },
    {
      title: "Resource Analytics",
      items: [
        "Resource utilization",
        "Cost analysis",
        "Efficiency optimization",
        "Capacity planning"
      ]
    }
  ];

  const alerts = [
    {
      title: "Production Alerts",
      items: [
        "Machine downtime alerts",
        "Production target alerts",
        "Efficiency threshold alerts",
        "Resource shortage alerts"
      ]
    },
    {
      title: "Quality Alerts",
      items: [
        "Quality parameter alerts",
        "Defect threshold alerts",
        "Compliance violation alerts",
        "Process deviation alerts"
      ]
    }
  ];

  return (
    <section id="production-tracking" className="px-6 bg-white">
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
            Production Tracking & Monitoring
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time production monitoring and analytics platform for spinning mills. Track, analyze, and optimize your production processes with AI-powered insights.
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

        {/* Monitoring Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Production Monitoring
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {monitoringFeatures.map((feature, index) => (
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

        {/* Analytics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Advanced Analytics
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {analytics.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <ul className="space-y-2">
                  {item.items.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-600">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Smart Alerts
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {alerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-blue-50 p-6 rounded-xl"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{alert.title}</h3>
                <ul className="space-y-2">
                  {alert.items.map((item, idx) => (
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

        {/* Benefits */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The TexIntelli Advantage</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Traditional Systems</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Manual production tracking</li>
                <li>• Delayed reporting</li>
                <li>• Reactive problem solving</li>
                <li>• Limited analytics</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">With TexIntelli</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Real-time monitoring</li>
                <li>• Predictive analytics</li>
                <li>• Proactive alerts</li>
                <li>• AI-powered insights</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}