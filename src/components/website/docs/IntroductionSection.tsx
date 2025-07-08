import { motion } from "framer-motion";

export default function IntroductionSection() {
  return (
    <section id="introduction" className="px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto flex flex-col justify-center min-h-[calc(100vh-8rem)]"
      >
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8">
          Introduction to Dhya SPIMS
        </h1>

        {/* Problem */}
        <p className="text-lg text-gray-700 dark:text-gray-400 leading-relaxed mb-6">
          Operational inefficiencies are common in spinning mills. Disconnected processes, manual tracking, and delayed reporting often lead to production bottlenecks, excess inventory, and missed delivery timelines.
        </p>

        {/* Solution */}
        <p className="text-lg text-gray-700 dark:text-gray-400 leading-relaxed mb-10">
          Dhya SPIMS is designed to streamline production and inventory management specifically for spinning mills. It centralizes critical operations, provides real-time visibility across departments, and ensures efficient scalable operations.
        </p>

        {/* Why Choose */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Why Choose Dhya SPIMS
        </h2>

        <ul className="list-disc list-inside text-gray-700 dark:text-gray-400 space-y-4 mb-12">
          <li><span className="font-semibold">Industry-Specific Design:</span> Built exclusively for spinning mills and textile production workflows.</li>
          <li><span className="font-semibold">Real-Time Visibility:</span> Monitor production, stock, and sales orders across locations instantly.</li>
          <li><span className="font-semibold">End-to-End Traceability:</span> Track every fiber batch from purchase to production to dispatch.</li>
          <li><span className="font-semibold">Scalable Architecture:</span> Expand from a single unit to multiple plants with ease.</li>
          <li><span className="font-semibold">User-Friendly Experience:</span> Simple dashboards and mobile-friendly access for all roles.</li>
        </ul>

        {/* Core Modules */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Core Functional Modules
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {[
            "Master Setup (Fibers, Yarns, Blends, Shades)",
            "Order Management (Buyers, Sales Orders, Realisation Tracking)",
            "Production Monitoring (Machine Wise, Shift Wise Production)",
            "Inventory Management (Real-Time Stock Ledger, Usage Patterns)",
            "Reporting & Analytics (Order Progress, Machine Efficiency, Wastage Insights)",
            "Settings & Access Control (User Roles, Permissions, Notifications)",
          ].map((item, index) => (
            <div
              key={index}
              className="p-5 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition"
            >
              <p className="text-gray-800 dark:text-white font-medium">{item}</p>
            </div>
          ))}
        </div>

        {/* Prev / Next Navigation */}
      </motion.div>
    </section>
  );
}