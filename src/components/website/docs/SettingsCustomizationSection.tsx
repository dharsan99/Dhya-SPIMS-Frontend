import { motion } from "framer-motion";

const settingsFeatures = [
  {
    title: "Organization Profile",
    desc: "Manage your company's profile — update your Name, Logo, Contact Information, and Billing Address centrally for consistent visibility.",
  },
  {
    title: "User Roles & Access Control",
    desc: "Assign Admins, Managers, Operators, and customize granular access to modules like Orders, Inventory, Production, and Reports.",
  },
  {
    title: "Theme & Display Preferences",
    desc: "Select between Light, Dark, or Auto system themes. Customize layouts and default views for better accessibility and experience.",
  },
  {
    title: "Notifications & Alerts",
    desc: "Configure alerts for production targets, inventory shortages, or pending orders. Control Email, SMS, and in-app notification settings.",
  },
  {
    title: "Subscription & Billing",
    desc: "Monitor active plans, renewal dates, billing history, and usage limits. Easily upgrade or manage your subscription within SPIMS.",
  },
  {
    title: "Future Integrations",
    desc: "Prepare for upcoming integrations with Tally ERP, QuickBooks, IoT Sensors for live machine data syncing, and more.",
  },
];

export default function SettingsCustomizationSection() {
  return (
    <section id="settings-customization" className="px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto flex flex-col justify-center min-h-[calc(100vh-8rem)]"
      >
        {/* Section Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-10">
          Settings & Customization
        </h1>

        {/* Intro */}
        <p className="text-lg text-center text-gray-700 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto mb-16">
          Personalize every aspect of Dhya SPIMS to match your operational workflows, roles, security policies, and communication preferences — with simple, intuitive settings.
        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {settingsFeatures.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 transition"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Final Callout */}
        <div className="text-center text-xl font-semibold text-blue-600 dark:text-blue-400 mb-12">
          Customize Dhya SPIMS — create a system that works exactly the way your team works.
        </div>

        {/* Prev/Next Navigation */}
        <div className="mt-8">
        </div>
      </motion.div>
    </section>
  );
}