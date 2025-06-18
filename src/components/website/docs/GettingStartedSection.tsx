import { motion } from "framer-motion";
import { FaUserPlus, FaCog, FaDatabase, FaChartLine, FaMobileAlt, FaShieldAlt } from "react-icons/fa";

export default function GettingStartedSection() {
  const steps = [
    {
      icon: <FaUserPlus className="w-8 h-8 text-blue-600" />,
      title: "Account Setup",
      description: "Create your account and configure your organization profile",
      details: [
        "Register with your business email",
        "Complete company profile information",
        "Set up primary contact details",
        "Choose your subscription plan"
      ]
    },
    {
      icon: <FaCog className="w-8 h-8 text-blue-600" />,
      title: "System Configuration",
      description: "Configure core system settings and preferences",
      details: [
        "Set up business units and locations",
        "Configure fiscal year and working days",
        "Define user roles and permissions",
        "Set up notification preferences"
      ]
    },
    {
      icon: <FaDatabase className="w-8 h-8 text-blue-600" />,
      title: "Master Data Setup",
      description: "Set up essential master data for operations",
      details: [
        "Configure fiber and yarn specifications",
        "Set up machine and production parameters",
        "Define quality parameters and standards",
        "Create customer and supplier profiles"
      ]
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-blue-600" />,
      title: "Production Setup",
      description: "Configure production workflows and processes",
      details: [
        "Set up production lines and machines",
        "Define shift patterns and schedules",
        "Configure quality check points",
        "Set up production targets"
      ]
    },
    {
      icon: <FaMobileAlt className="w-8 h-8 text-blue-600" />,
      title: "Mobile App Setup",
      description: "Configure mobile access for on-the-go operations",
      details: [
        "Download the TexIntelli mobile app",
        "Configure mobile notifications",
        "Set up offline capabilities",
        "Test mobile workflows"
      ]
    },
    {
      icon: <FaShieldAlt className="w-8 h-8 text-blue-600" />,
      title: "Security & Access",
      description: "Set up security measures and access controls",
      details: [
        "Configure two-factor authentication",
        "Set up IP restrictions if needed",
        "Define data access policies",
        "Configure audit logging"
      ]
    }
  ];

  const quickStart = [
    {
      title: "First Day Checklist",
      items: [
        "Complete account registration",
        "Set up organization profile",
        "Configure basic system settings",
        "Add essential master data",
        "Invite team members"
      ]
    },
    {
      title: "Essential Features",
      items: [
        "Production monitoring dashboard",
        "Inventory management",
        "Order tracking",
        "Quality control",
        "Basic reporting"
      ]
    },
    {
      title: "Next Steps",
      items: [
        "Configure advanced settings",
        "Set up custom workflows",
        "Integrate with other systems",
        "Train team members",
        "Schedule regular reviews"
      ]
    }
  ];

  return (
    <section id="getting-started" className="px-6 bg-white">
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
            Getting Started with TexIntelli
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Follow this comprehensive guide to set up and start using TexIntelli effectively in your spinning mill operations.
          </p>
        </div>

        {/* Quick Start Guide */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Quick Start Guide
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {quickStart.map((section, index) => (
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
                  {section.items.map((item, idx) => (
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

        {/* Detailed Setup Steps */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Detailed Setup Steps
          </h2>
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{step.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {step.details.map((detail, idx) => (
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

        {/* Support Note */}
        <div className="mt-16 text-center">
          <p className="text-gray-600">
            Need help? Contact our support team at{" "}
            <a href="mailto:support@dhya.in" className="text-blue-600 hover:underline">
              support@dhya.in
            </a>
          </p>
        </div>
      </motion.div>
    </section>
  );
}