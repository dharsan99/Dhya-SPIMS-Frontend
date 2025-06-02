import { motion } from "framer-motion";

const productionFeatures = [
  {
    title: "Production Entry & Validation",
    desc: "Log production quantities against orders, machines, and shifts. Ensure correct linkage to shade codes and orders for precise tracking.",
  },
  {
    title: "Machine-Wise Output Monitoring",
    desc: "Analyze daily outputs per machine. Identify underperforming machines early and improve overall efficiency through shift-level insights.",
  },
  {
    title: "Fiber Consumption Calculation",
    desc: "Automatically track fiber consumption based on order realization percentages and blend compositions, ensuring raw material usage stays optimized.",
  },
  {
    title: "Real-Time Production Dashboard",
    desc: "Visualize live production progress, pending outputs, and production delays across all machines and orders in one consolidated view.",
  },
];

export default function ProductionTrackingSection() {
  return (
    <section id="production-tracking" className="px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto flex flex-col justify-center min-h-[calc(100vh-8rem)]"
      >
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-10">
          Tracking Production with Precision
        </h1>

        {/* Intro */}
        <p className="text-lg text-center text-gray-700 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto mb-16">
          Dhya SPIMS helps spinning mills monitor production in real-time, optimize machine efficiencies, track fiber usage, and meet delivery goals without chaos.
        </p>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {productionFeatures.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700 transition"
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
          Achieve higher output, better fiber utilization, and improved on-time order fulfillment.
        </div>

        {/* Prev/Next Navigation */}
        <div className="mt-8">
        </div>
      </motion.div>
    </section>
  );
}