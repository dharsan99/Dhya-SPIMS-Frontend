import { motion } from "framer-motion";
import { FaBoxes, FaWarehouse, FaClipboardList, FaBarcode } from "react-icons/fa";

export default function InventoryManagementSection() {
  const features = [
    {
      icon: <FaBoxes className="w-8 h-8 text-blue-600" />,
      title: "Real-Time Stock Tracking",
      description: "Monitor inventory levels across all materials and locations",
      details: [
        "Live stock updates for fibers and yarns",
        "Multi-location inventory tracking",
        "Batch-wise stock management",
        "Quality grade segregation"
      ]
    },
    {
      icon: <FaWarehouse className="w-8 h-8 text-blue-600" />,
      title: "Material Movement",
      description: "Track all material movements and transfers",
      details: [
        "Production floor transfers",
        "Inter-location transfers",
        "Quality inspection movements",
        "Return and rejection handling"
      ]
    },
    {
      icon: <FaClipboardList className="w-8 h-8 text-blue-600" />,
      title: "Stock Analysis",
      description: "Analyze inventory patterns and trends",
      details: [
        "Consumption analysis",
        "Stock aging reports",
        "Turnover ratios",
        "Value analysis"
      ]
    },
    {
      icon: <FaBarcode className="w-8 h-8 text-blue-600" />,
      title: "Stock Verification",
      description: "Conduct physical stock verification",
      details: [
        "Scheduled stock counts",
        "Random verification",
        "Variance analysis",
        "Reconciliation reports"
      ]
    }
  ];

  const processes = [
    {
      title: "Stock Receipt",
      steps: [
        "Verify delivery documents",
        "Check material specifications",
        "Record quality parameters",
        "Update stock ledger"
      ]
    },
    {
      title: "Stock Issue",
      steps: [
        "Validate issue request",
        "Check stock availability",
        "Process material issue",
        "Update inventory records"
      ]
    },
    {
      title: "Stock Transfer",
      steps: [
        "Initiate transfer request",
        "Verify source and destination",
        "Process physical movement",
        "Update both locations"
      ]
    },
    {
      title: "Stock Adjustment",
      steps: [
        "Identify adjustment need",
        "Document reason for adjustment",
        "Process quantity changes",
        "Update financial records"
      ]
    }
  ];

  const reports = [
    {
      title: "Stock Status",
      items: [
        "Current stock levels",
        "Stock value",
        "Age-wise analysis",
        "Location-wise summary"
      ]
    },
    {
      title: "Movement Reports",
      items: [
        "Receipt summary",
        "Issue analysis",
        "Transfer history",
        "Adjustment records"
      ]
    },
    {
      title: "Analysis Reports",
      items: [
        "Consumption trends",
        "Stock turnover",
        "Value analysis",
        "Quality metrics"
      ]
    }
  ];

  return (
    <section id="inventory-management" className="px-6 bg-white">
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
            Inventory Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive inventory management system for tracking, analyzing, and optimizing your spinning mill's material resources.
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

        {/* Inventory Processes */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Inventory Processes
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
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
                <ol className="space-y-3">
                  {process.steps.map((step, idx) => (
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

        {/* Reports & Analytics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Reports & Analytics
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
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

        {/* Best Practices */}
        <div className="bg-blue-50 p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Stock Management</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Maintain minimum stock levels</li>
                <li>• Regular stock verification</li>
                <li>• FIFO/FEFO implementation</li>
                <li>• Quality-based segregation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Process Optimization</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Standardize movement procedures</li>
                <li>• Document all transactions</li>
                <li>• Regular process audits</li>
                <li>• Train staff on procedures</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}