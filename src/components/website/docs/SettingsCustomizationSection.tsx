import { motion } from "framer-motion";
import { FaCogs, FaUsers, FaShieldAlt, FaChartLine, FaIndustry, FaBell, FaDatabase, FaCloud } from "react-icons/fa";

export default function SettingsCustomizationSection() {
  const features = [
    {
      icon: <FaCogs className="w-8 h-8 text-blue-600" />,
      title: "System Configuration",
      description: "Core system settings and preferences",
      details: [
        "Company profile setup",
        "Unit configuration",
        "System preferences",
        "Integration settings"
      ]
    },
    {
      icon: <FaUsers className="w-8 h-8 text-blue-600" />,
      title: "User Management",
      description: "Comprehensive user control",
      details: [
        "Role-based access control",
        "User permissions",
        "Department setup",
        "Access management"
      ]
    },
    {
      icon: <FaIndustry className="w-8 h-8 text-blue-600" />,
      title: "Production Settings",
      description: "Production workflow configuration",
      details: [
        "Machine configuration",
        "Shift management",
        "Process parameters",
        "Quality standards"
      ]
    },
    {
      icon: <FaCloud className="w-8 h-8 text-blue-600" />,
      title: "SaaS Configuration",
      description: "Multi-tenant setup",
      details: [
        "Tenant management",
        "Data isolation",
        "Resource allocation",
        "Service limits"
      ]
    }
  ];

  const securitySettings = [
    {
      title: "Access Control",
      items: [
        "Role-based permissions",
        "Feature access control",
        "Data access restrictions",
        "IP whitelisting"
      ]
    },
    {
      title: "Security Policies",
      items: [
        "Password policies",
        "Session management",
        "Two-factor authentication",
        "Audit logging"
      ]
    },
    {
      title: "Data Protection",
      items: [
        "Data encryption",
        "Backup policies",
        "Data retention",
        "Privacy controls"
      ]
    }
  ];

  const customizationOptions = [
    {
      title: "UI Customization",
      items: [
        "Theme selection",
        "Layout preferences",
        "Dashboard widgets",
        "Report templates"
      ]
    },
    {
      title: "Workflow Customization",
      items: [
        "Process configuration",
        "Approval workflows",
        "Notification rules",
        "Automation rules"
      ]
    },
    {
      title: "Integration Settings",
      items: [
        "API configuration",
        "Third-party integrations",
        "Data synchronization",
        "Webhook setup"
      ]
    }
  ];

  const notificationSettings = [
    {
      title: "Alert Configuration",
      items: [
        "Alert thresholds",
        "Notification channels",
        "Alert priorities",
        "Escalation rules"
      ]
    },
    {
      title: "Report Scheduling",
      items: [
        "Report frequency",
        "Delivery methods",
        "Recipient groups",
        "Format preferences"
      ]
    }
  ];

  return (
    <section id="settings-customization" className="px-6 bg-white">
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
            Settings & Customization
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive system configuration and customization platform for spinning mills. Tailor SPIMS to your specific operational needs with flexible settings and powerful customization options.
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

        {/* Security Settings */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Security Settings
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {securitySettings.map((setting, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{setting.title}</h3>
                <ul className="space-y-2">
                  {setting.items.map((item, idx) => (
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

        {/* Customization Options */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Customization Options
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {customizationOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{option.title}</h3>
                <ul className="space-y-2">
                  {option.items.map((item, idx) => (
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

        {/* Notification Settings */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Notification Settings
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {notificationSettings.map((setting, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-blue-50 p-6 rounded-xl"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{setting.title}</h3>
                <ul className="space-y-2">
                  {setting.items.map((item, idx) => (
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
                <li>• Limited customization</li>
                <li>• Basic security</li>
                <li>• Fixed workflows</li>
                <li>• Manual configuration</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">With SPIMS</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Flexible customization</li>
                <li>• Advanced security</li>
                <li>• Configurable workflows</li>
                <li>• Automated setup</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}