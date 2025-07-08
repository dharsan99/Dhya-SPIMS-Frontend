import { motion } from "framer-motion";

const masterSetupSteps = [
  {
    title: "Create Fiber Categories",
    desc: "Organize fibers into logical groups such as Cotton, Polyester, etc., enabling cleaner stock segmentation and easier reporting.",
  },
  {
    title: "Add Fibers",
    desc: "Maintain detailed records for every fiber material including stock quantity, properties, and tracking information.",
  },
  {
    title: "Define Blends",
    desc: "Build blends by combining different fibers with defined percentages to prepare for shade creation and production planning.",
  },
  {
    title: "Setup Shades",
    desc: "Configure shade numbers linked with fiber or blend compositions to manage inventory and fulfill order specifications accurately.",
  },
  {
    title: "Add Buyers and Suppliers",
    desc: "Manage key contacts across sales and procurement operations. Link buyers to orders and suppliers to procurement flows seamlessly.",
  },
  {
    title: "Map Yarn Requirements",
    desc: "Assign yarn composition and material requirements to shades or orders for automated production and procurement planning.",
  },
];

export default function MasterSetupSection() {
  return (
    <section id="master-setup" className="px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto flex flex-col justify-center min-h-[calc(100vh-8rem)]"
      >
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
          Setting Up Your Master Data
        </h1>

        {/* Introduction */}
        <p className="text-lg text-center text-gray-700 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto mb-12">
          A clean master setup is the foundation for smooth production, order tracking, and inventory management. Carefully setting up your initial data ensures operational consistency as you scale.
        </p>

        {/* Setup Steps */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {masterSetupSteps.map((step, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 250 }}
              className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-md hover:shadow-lg border border-gray-100 dark:border-gray-700 transition duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center text-xl font-semibold text-blue-600 dark:text-blue-400 mb-8">
          Once your master data is configured, you're ready to start managing orders and tracking production seamlessly.
        </div>

        {/* Prev/Next Navigation */}
      </motion.div>
    </section>
  );
}