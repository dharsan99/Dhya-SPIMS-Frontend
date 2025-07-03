import { motion } from "framer-motion";

export default function MobileAppGuideSection() {
  return (
    <section id="mobile-app-guide" className="px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto flex flex-col justify-center min-h-[calc(100vh-8rem)] text-center"
      >
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-8">
          Mobile App Guide
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
          Manage production, inventory, and orders seamlessly from your mobile device — enabling full operational control from anywhere.
        </p>

        {/* Animated "Coming Soon" Tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="inline-block px-6 py-3 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-semibold text-xl tracking-wide shadow-md mb-8"
        >
          Coming Soon
        </motion.div>

        {/* Subtext */}
        <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed">
          The Dhya SPIMS mobile experience is under active development.
          Stay tuned for powerful mobile-first production and inventory management workflows.
        </p>

        {/* Prev/Next Navigation */}
        <div className="mt-12">
        </div>
      </motion.div>
    </section>
  );
}