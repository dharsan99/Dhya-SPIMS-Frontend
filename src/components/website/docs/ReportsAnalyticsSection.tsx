import { motion } from "framer-motion";
import { FaChartLine, FaChartBar, FaChartPie, FaChartArea, FaRobot, FaFileAlt, FaDownload, FaFilter } from "react-icons/fa";

export default function ReportsAnalyticsSection() {
  const features = [
    {
      icon: <FaChartLine className="w-8 h-8 text-blue-600" />,
      title: "Real-Time Analytics",
      description: "Live insights and performance tracking",
      details: [
        "Production efficiency metrics",
        "Machine performance analysis",
        "Quality parameter tracking",
        "Resource utilization stats"
      ]
    },
    {
      icon: <FaChartBar className="w-8 h-8 text-blue-600" />,
      title: "Custom Reports",
      description: "Flexible reporting capabilities",
      details: [
        "Configurable report templates",
        "Multi-format export options",
        "Scheduled report generation",
        "Automated distribution"
      ]
    },
    {
      icon: <FaRobot className="w-8 h-8 text-blue-600" />,
      title: "AI-Powered Insights",
      description: "Smart analytics and predictions",
      details: [
        "Trend analysis and forecasting",
        "Anomaly detection",
        "Performance optimization",
        "Predictive maintenance"
      ]
    },
    {
      icon: <FaChartPie className="w-8 h-8 text-blue-600" />,
      title: "Business Intelligence",
      description: "Comprehensive business analytics",
      details: [
        "Financial performance metrics",
        "Operational efficiency analysis",
        "Cost optimization insights",
        "Strategic decision support"
      ]
    }
  ];

  const reportTypes = [
    {
      title: "Production Reports",
      items: [
        "Daily production summary",
        "Machine-wise output",
        "Shift performance analysis",
        "Efficiency metrics"
      ]
    },
    {
      title: "Quality Reports",
      items: [
        "Quality parameter trends",
        "Defect analysis",
        "Compliance reports",
        "Quality improvement metrics"
      ]
    },
    {
      title: "Inventory Reports",
      items: [
        "Stock level analysis",
        "Material consumption",
        "Waste tracking",
        "Stock movement"
      ]
    }
  ];

  const analytics = [
    {
      title: "Performance Analytics",
      items: [
        "Machine efficiency trends",
        "Operator productivity",
        "Resource utilization",
        "Cost per unit analysis"
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
      title: "Business Analytics",
      items: [
        "Financial performance",
        "Cost optimization",
        "Resource allocation",
        "Strategic insights"
      ]
    }
  ];

  const exportOptions = [
    {
      title: "Export Formats",
      items: [
        "PDF reports",
        "Excel spreadsheets",
        "CSV data files",
        "Custom formats"
      ]
    },
    {
      title: "Distribution Options",
      items: [
        "Email automation",
        "Cloud storage",
        "API integration",
        "Scheduled delivery"
      ]
    }
  ];

  return (
    <section id="reports-analytics" className="px-6 bg-white">
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
            Reports & Analytics
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive reporting and analytics platform for spinning mills. Transform your data into actionable insights with AI-powered analytics and customizable reports.
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

        {/* Report Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Report Types
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {reportTypes.map((type, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{type.title}</h3>
                <ul className="space-y-2">
                  {type.items.map((item, idx) => (
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

        {/* Export Options */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Export & Distribution
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {exportOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-blue-50 p-6 rounded-xl"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{option.title}</h3>
                <ul className="space-y-2">
                  {option.items.map((item, idx) => (
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The SPIMS Advantage</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Traditional Systems</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Manual report generation</li>
                <li>• Limited analytics</li>
                <li>• Static reports</li>
                <li>• Delayed insights</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">With SPIMS</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Real-time analytics</li>
                <li>• AI-powered insights</li>
                <li>• Customizable reports</li>
                <li>• Automated distribution</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}