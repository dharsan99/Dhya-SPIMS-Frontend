// src/components/website/TimelineSection.tsx

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

interface Milestone {
  year: string;
  title: string;
  description: string;
  impact?: string;
}

const milestones: Milestone[] = [
  {
    year: "2019",
    title: "TexIntelli Foundation",
    description: "Founded with a vision to revolutionize textile manufacturing through digital transformation.",
    impact: "Started with a mission to digitize operational workflows for traditional industries."
  },
  {
    year: "2021",
    title: "First SaaS Launch",
    description: "Released the first version of TexIntelli with core production tracking and inventory management features.",
    impact: "Enabled real-time production monitoring and automated inventory tracking."
  },
  {
    year: "2022",
    title: "Industry Expansion",
    description: "Expanded TexIntelli capabilities to serve diverse textile manufacturing sectors.",
    impact: "Successfully deployed across spinning mills, yarn manufacturers, and dyeing units."
  },
  {
    year: "2023",
    title: "Advanced Analytics",
    description: "Introduced comprehensive analytics and reporting features for data-driven decision making.",
    impact: "Helped clients reduce fiber wastage by 18% and improve dispatch accuracy to 96%."
  },
  {
    year: "2024",
    title: "Global Scale",
    description: "Expanding internationally with enhanced features and integrations.",
    impact: "Serving 500+ businesses with advanced production and inventory management solutions."
  }
];

export default function TimelineSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

      <div className="relative max-w-5xl mx-auto text-center z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-extrabold text-gray-900 mb-4"
        >
          Our Journey of Innovation
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto"
        >
          From a vision to transform textile manufacturing to a comprehensive SaaS solution serving hundreds of businesses.
        </motion.p>

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

function TimelineItem({ milestone, index }: { milestone: Milestone; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true,
    amount: 0.2,
    margin: "0px 0px -100px 0px"
  });

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
        className="absolute top-0 w-6 h-6 rounded-full bg-blue-500 shadow-lg ring-4 ring-white"
      />

      {/* Card */}
      <div className="mt-10 p-6 bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl w-full max-w-md text-left">
        <span className="text-blue-600 font-semibold text-sm">
          {milestone.year}
        </span>
        <h3 className="text-2xl font-bold text-gray-900 mt-2">
          {milestone.title}
        </h3>
        <p className="text-gray-600 leading-relaxed mt-3">
          {milestone.description}
        </p>
        {milestone.impact && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 italic">
              Impact: {milestone.impact}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}