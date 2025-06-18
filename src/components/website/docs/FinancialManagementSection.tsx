import { motion } from "framer-motion";
import { FaMoneyBillWave, FaReceipt, FaPiggyBank } from "react-icons/fa";

export default function FinancialManagementSection() {
  const features = [
    {
      icon: <FaMoneyBillWave className="w-8 h-8 text-blue-600" />,
      title: "Financial Overview",
      description: "Real-time financial insights",
      details: [
        "Revenue tracking",
        "Expense management",
        "Profit analysis",
        "Cash flow monitoring"
      ]
    },
    {
      icon: <FaReceipt className="w-8 h-8 text-blue-600" />,
      title: "Invoice Management",
      description: "Streamlined billing process",
      details: [
        "Invoice generation",
        "Payment tracking",
        "Due date monitoring",
        "Payment reminders"
      ]
    },
    {
      icon: <FaPiggyBank className="w-8 h-8 text-blue-600" />,
      title: "Cost Control",
      description: "Optimize your expenses",
      details: [
        "Cost analysis",
        "Budget tracking",
        "Expense categorization",
        "Cost optimization"
      ]
    }
  ];

  const processes = [
    {
      title: "Accounts Receivable",
      items: [
        "Customer invoicing",
        "Payment tracking",
        "Credit management",
        "Collection follow-up"
      ]
    },
    {
      title: "Accounts Payable",
      items: [
        "Vendor payments",
        "Payment scheduling",
        "Expense tracking",
        "Payment approval"
      ]
    },
    {
      title: "Financial Planning",
      items: [
        "Budget planning",
        "Cost forecasting",
        "Financial projections",
        "Resource allocation"
      ]
    }
  ];

  const reports = [
    {
      title: "Financial Reports",
      items: [
        "Profit & loss statements",
        "Balance sheets",
        "Cash flow statements",
        "Financial ratios"
      ]
    },
    {
      title: "Analytics",
      items: [
        "Revenue analysis",
        "Cost analysis",
        "Profitability metrics",
        "Trend analysis"
      ]
    }
  ];

  return (
    <section id="financial-management" className="px-6 bg-white">
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
            Financial Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take control of your financial operations with TexIntelli. From invoicing to financial reporting, manage your spinning mill's finances efficiently.
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

        {/* Processes */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Financial Processes
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {processes.map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{process.title}</h3>
                <ul className="space-y-2">
                  {process.items.map((item, idx) => (
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

        {/* Reports */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Reports & Analytics
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {reports.map((report, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{report.title}</h3>
                <ul className="space-y-2">
                  {report.items.map((item, idx) => (
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

        {/* Benefits */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The TexIntelli Advantage</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Traditional Systems</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Manual calculations</li>
                <li>• Paper-based records</li>
                <li>• Delayed reporting</li>
                <li>• Error-prone processes</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">With TexIntelli</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Automated calculations</li>
                <li>• Digital records</li>
                <li>• Real-time reporting</li>
                <li>• Accurate tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
} 