import { motion } from "framer-motion";

const orderFeatures = [
  {
    title: "Create New Sales Orders",
    desc: "Quickly add orders linked to buyers and shades, setting delivery deadlines, realization targets, and production instructions.",
  },
  {
    title: "Order Status Tracking",
    desc: "Monitor real-time progress from Pending → In Progress → Completed automatically based on production updates and dispatches.",
  },
  {
    title: "Realization & Dispatch Management",
    desc: "Capture realization percentages, production quantities achieved, and generate dispatch notes seamlessly to fulfill orders.",
  },
  {
    title: "Order KPIs & Analytics",
    desc: "Access live dashboards showing pending orders, expected delivery risks, production delays, and overall order realization trends.",
  },
];

export default function OrderManagementSection() {
  return (
    <section id="order-management" className="px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto flex flex-col justify-center min-h-[calc(100vh-8rem)]"
      >
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-10">
          Managing Orders Effectively
        </h1>

        {/* Introduction */}
        <p className="text-lg text-center text-gray-700 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto mb-16">
          With Dhya SPIMS, you gain full control over sales orders, production milestones, realization tracking, and dispatch flows — all in a unified dashboard.
        </p>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {orderFeatures.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700 transition duration-300"
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

        {/* Final Note */}
        <div className="text-center text-xl font-semibold text-blue-600 dark:text-blue-400 mb-12">
          Manage orders with precision, deliver faster, and boost customer satisfaction.
        </div>

        {/* Prev/Next Navigation */}
        <div className="mt-8">
        </div>
      </motion.div>
    </section>
  );
}