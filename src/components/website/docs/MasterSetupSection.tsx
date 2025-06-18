import { motion } from "framer-motion";
import { FaBox, FaIndustry, FaUsers, FaCogs } from "react-icons/fa";

export default function MasterSetupSection() {
  const masterDataTypes = [
    {
      icon: <FaBox className="w-8 h-8 text-blue-600" />,
      title: "Material Master",
      description: "Configure raw materials, finished goods, and packaging materials",
      items: [
        {
          name: "Fibers",
          details: [
            "Material type (Cotton, Polyester, etc.)",
            "Grade and quality parameters",
            "Unit of measurement",
            "Standard specifications"
          ]
        },
        {
          name: "Yarns",
          details: [
            "Count and composition",
            "Twist and construction",
            "Quality parameters",
            "Packing specifications"
          ]
        },
        {
          name: "Blends",
          details: [
            "Component materials",
            "Blend ratios",
            "Quality standards",
            "Production parameters"
          ]
        }
      ]
    },
    {
      icon: <FaIndustry className="w-8 h-8 text-blue-600" />,
      title: "Production Master",
      description: "Set up production-related master data",
      items: [
        {
          name: "Machines",
          details: [
            "Machine type and model",
            "Capacity and specifications",
            "Maintenance schedule",
            "Performance parameters"
          ]
        },
        {
          name: "Processes",
          details: [
            "Process flow definition",
            "Quality check points",
            "Standard operating procedures",
            "Efficiency parameters"
          ]
        },
        {
          name: "Shifts",
          details: [
            "Shift timings",
            "Manpower allocation",
            "Production targets",
            "Break schedules"
          ]
        }
      ]
    },
    {
      icon: <FaUsers className="w-8 h-8 text-blue-600" />,
      title: "Business Partners",
      description: "Configure customer and supplier information",
      items: [
        {
          name: "Customers",
          details: [
            "Company details",
            "Contact information",
            "Credit terms",
            "Special requirements"
          ]
        },
        {
          name: "Suppliers",
          details: [
            "Material categories",
            "Payment terms",
            "Quality standards",
            "Delivery schedules"
          ]
        },
        {
          name: "Transporters",
          details: [
            "Vehicle details",
            "Route information",
            "Capacity and rates",
            "Documentation requirements"
          ]
        }
      ]
    },
    {
      icon: <FaCogs className="w-8 h-8 text-blue-600" />,
      title: "System Configuration",
      description: "Set up system-wide parameters and settings",
      items: [
        {
          name: "Units & Measures",
          details: [
            "Weight units",
            "Length units",
            "Conversion factors",
            "Standard formats"
          ]
        },
        {
          name: "Cost Centers",
          details: [
            "Department structure",
            "Cost allocation",
            "Budget parameters",
            "Reporting hierarchy"
          ]
        },
        {
          name: "Quality Parameters",
          details: [
            "Testing methods",
            "Acceptance criteria",
            "Sampling procedures",
            "Documentation standards"
          ]
        }
      ]
    }
  ];

  const setupSteps = [
    {
      title: "Initial Setup",
      steps: [
        "Define basic units of measurement",
        "Set up cost centers and departments",
        "Configure quality parameters",
        "Establish standard formats"
      ]
    },
    {
      title: "Material Configuration",
      steps: [
        "Create fiber specifications",
        "Define yarn parameters",
        "Set up blend combinations",
        "Configure packaging details"
      ]
    },
    {
      title: "Production Setup",
      steps: [
        "Register machines and equipment",
        "Define process flows",
        "Set up shift patterns",
        "Configure quality check points"
      ]
    },
    {
      title: "Partner Setup",
      steps: [
        "Add customer profiles",
        "Configure supplier details",
        "Set up transporter information",
        "Define credit and payment terms"
      ]
    }
  ];

  return (
    <section id="master-setup" className="px-6 bg-white">
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
            Master Data Setup
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Configure essential master data to streamline your spinning mill operations and ensure accurate tracking across all processes.
          </p>
        </div>

        {/* Setup Steps */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Setup Process
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {setupSteps.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.steps.map((step, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-600">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      {step}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Master Data Types */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Master Data Categories
          </h2>
          <div className="space-y-8">
            {masterDataTypes.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{category.icon}</div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-gray-600 mb-6">{category.description}</p>
                    <div className="grid md:grid-cols-3 gap-6">
                      {category.items.map((item, idx) => (
                        <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-3">{item.name}</h4>
                          <ul className="space-y-2">
                            {item.details.map((detail, detailIdx) => (
                              <li key={detailIdx} className="text-sm text-gray-600">
                                • {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="mt-16 bg-blue-50 p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Practices</h2>
          <ul className="space-y-3 text-gray-700">
            <li>• Start with essential master data and expand gradually</li>
            <li>• Maintain consistent naming conventions across all master data</li>
            <li>• Regularly review and update master data to ensure accuracy</li>
            <li>• Document all master data configurations for future reference</li>
            <li>• Train team members on master data management procedures</li>
          </ul>
        </div>
      </motion.div>
    </section>
  );
}