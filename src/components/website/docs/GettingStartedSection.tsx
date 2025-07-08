import { motion } from "framer-motion";

export default function GettingStartedSection() {
  return (
    <section id="getting-started" className="px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto flex flex-col justify-center min-h-[calc(100vh-8rem)]"
        // 👆 Full height minus padding (clean top/bottom!)
      >
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8">
          Getting Started with Dhya SPIMS
        </h1>

        {/* Introduction */}
        <p className="text-lg text-gray-700 dark:text-gray-400 leading-relaxed mb-8">
          Dhya SPIMS is designed to help spinning mills digitalize production and inventory workflows quickly. Setting up the platform takes only a few key steps before your team can start operating smoothly.
        </p>

        {/* Setup Steps */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-6">
          Initial Setup Steps
        </h2>

        <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-4 mb-12">
          <li><span className="font-semibold">Configure Master Data:</span> Add essential entities like Fibers, Yarn Types, Shades, and Blends.</li>
          <li><span className="font-semibold">Register Buyers:</span> Set up your customers to whom orders will be assigned.</li>
          <li><span className="font-semibold">Create Sales Orders:</span> Define product, quantity, shade, and delivery timelines.</li>
          <li><span className="font-semibold">Track Production:</span> Update daily production data across machines and shifts.</li>
          <li><span className="font-semibold">Monitor Inventory:</span> Access real-time stock levels for fibers, yarns, and finished goods.</li>
          <li><span className="font-semibold">Analyze Reports:</span> View progress summaries, pending orders, and stock projections.</li>
        </ol>

        {/* Quick Setup Checklist */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-6">
          Quick Setup Checklist
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {[
            "Create Master Data (Fibers, Yarns, Blends)",
            "Register Buyer Details",
            "Set Up Initial Sales Orders",
            "Configure Production Monitoring",
            "Enable Reporting Dashboards",
          ].map((item, index) => (
            <div
              key={index}
              className="p-5 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <p className="text-gray-800 dark:text-white font-medium">{item}</p>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <p className="text-xl text-blue-600 dark:text-blue-400 font-semibold text-center mb-12">
          Your digital transformation journey starts here. Let’s build a smarter production floor.
        </p>

        {/* 🔥 Prev / Next Navigation */}
      </motion.div>
    </section>
  );
}