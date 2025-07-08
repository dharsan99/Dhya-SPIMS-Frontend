import { motion } from "framer-motion";

const analyticsFeatures = [
  {
    title: "Production Reports",
    desc: "Daily, weekly, and monthly summaries categorized by orders, machines, shifts, and shades. Improve operational efficiency with historical comparisons.",
  },
  {
    title: "Inventory Insights",
    desc: "Track fiber consumption, current stock, shortages, and aging inventory automatically — with smart alerts for reorder planning.",
  },
  {
    title: "Order Progress Monitoring",
    desc: "View realisation percentages, order completion status, shade-wise dispatches, and pending fulfillment balances at a glance.",
  },
  {
    title: "Flexible Data Export",
    desc: "Export any report as Excel (.xlsx) or CSV files for financial auditing, operational reviews, or offline analysis.",
  },
];

export default function ReportsAnalyticsSection() {
  return (
    <section id="reports-analytics" className="px-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto flex flex-col justify-center min-h-[calc(100vh-8rem)]"
      >
        {/* Section Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-10">
          Powerful Reports & Business Analytics
        </h1>

        {/* Intro */}
        <p className="text-lg text-gray-700 dark:text-gray-400 leading-relaxed text-center max-w-3xl mx-auto mb-16">
          Dhya SPIMS transforms raw production and inventory data into live dashboards, actionable reports, and smart forecasting tools — helping you make faster, smarter decisions.
        </p>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {analyticsFeatures.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 transition"
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
          Gain full operational transparency — from fiber stock to customer delivery.
        </div>

        {/* Prev / Next Navigation */}
        <div className="mt-8">
        </div>
      </motion.div>
    </section>
  );
}