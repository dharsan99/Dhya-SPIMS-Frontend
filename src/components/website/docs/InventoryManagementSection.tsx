import { motion } from "framer-motion";

const inventoryFeatures = [
  {
    title: "Add New Fibers",
    desc: "Create fiber entries with stock quantity, category assignment, and important attributes to organize your warehouse efficiently.",
  },
  {
    title: "Update Stock Levels",
    desc: "Manually update fiber stock after procurement, audits, or manual consumption, keeping real-time accuracy in inventory data.",
  },
  {
    title: "Real-time Stock Monitoring",
    desc: "Get instant visibility into fiber availability with color-coded indicators, helping you make faster material planning decisions.",
  },
  {
    title: "Automatic Stock Usage",
    desc: "Fiber usage is automatically deducted during production entry, linked to order realization and production weights.",
  },
  {
    title: "Low Stock Alerts",
    desc: "System visually alerts you when fiber stock falls below minimum thresholds, minimizing production risks proactively.",
  },
];

export default function InventoryManagementSection() {
  return (
    <section id="inventory-management" className="px-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto flex flex-col justify-center min-h-[calc(100vh-8rem)]"
      >
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
          Managing Inventory Efficiently
        </h1>

        {/* Intro Paragraph */}
        <p className="text-lg text-center text-gray-700 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto mb-12">
          Dhya SPIMS provides a smart and visual system to manage your fiber inventory, ensuring materials are always available and traceable for production needs.
        </p>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {inventoryFeatures.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700 transition duration-300"
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

        {/* CTA */}
        <div className="text-center text-xl font-semibold text-blue-600 dark:text-blue-400 mb-8">
          Stay ahead of production needs with live inventory visibility and smart stock control.
        </div>

        {/* Prev / Next */}
      </motion.div>
    </section>
  );
}