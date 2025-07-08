// src/components/website/TimelineSection.tsx

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

const milestones = [
  { year: "2019", title: "Founded in Coimbatore", description: "Started with a mission to digitize operational workflows for traditional industries." },
  { year: "2021", title: "First SaaS Launch", description: "Released the first version of SPIMS - Smart Production & Inventory Management System." },
  { year: "2022", title: "Cross-Industry Adoption", description: "Expanded into aquaculture and fisheries sectors beyond textiles." },
  { year: "2024", title: "Scaling Up", description: "Serving 500+ businesses across multiple sectors, and expanding internationally." },
];

export default function TimelineSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-noise opacity-10 pointer-events-none z-0" />

      <div className="relative max-w-5xl mx-auto text-center z-10">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-16">
          Our Journey So Far
        </h2>

        {/* Vertical timeline container */}
        <div ref={ref} className="relative flex flex-col items-center">
          
          {/* Scroll Progress Line */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute top-12 w-1 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"
          />

          {/* Timeline Items */}
          <div className="flex flex-col gap-20 mt-12">
            {milestones.map((milestone, index) => (
              <TimelineItem key={index} milestone={milestone} index={index} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

function TimelineItem({ milestone, index }: { milestone: any, index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      className="relative flex flex-col items-center"
    >
      {/* Floating Dot */}
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -5, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
        className="absolute top-0 w-6 h-6 rounded-full bg-blue-500 dark:bg-blue-400 shadow-lg dark:shadow-blue-400/50 ring-4 ring-white dark:ring-gray-900"
      />

      {/* Card */}
      <div className="mt-10 p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl w-full max-w-md text-left">
        <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
          {milestone.year}
        </span>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          {milestone.title}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-3">
          {milestone.description}
        </p>
      </div>
    </motion.div>
  );
}