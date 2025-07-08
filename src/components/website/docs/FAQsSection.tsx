import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How do I create my first order?",
    answer:
      "Navigate to the Orders module, click 'Create Order', select the Buyer, assign Yarn/Shade details, and enter the required quantity. Once saved, track production and dispatch seamlessly.",
  },
  {
    question: "Can I edit Fiber or Shade details after creating them?",
    answer:
      "Yes. Dhya SPIMS allows you to modify master data — including Fibers, Shades, Yarns, and Buyers — at any point from their respective management panels.",
  },
  {
    question: "Is Dhya SPIMS accessible from mobile devices?",
    answer:
      "Currently, SPIMS is optimized for desktop and tablet use. Mobile-optimized dashboards are part of our upcoming roadmap.",
  },
  {
    question: "How do I track production status?",
    answer:
      "Each order includes a Production Panel where you can update daily outputs, monitor pending quantities, and view delivery schedules in real-time.",
  },
  {
    question: "Is my data safe and secure?",
    answer:
      "Absolutely. Dhya SPIMS uses encrypted communication, secure cloud storage, and strict access control policies to safeguard your operational data.",
  },
];

export default function FAQsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="px-6 bg-white dark:bg-gray-900 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto flex flex-col justify-center min-h-[calc(100vh-8rem)]" 
        // 👆 Full height - 8rem (top/bottom padding gap avoided)
      >
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
          Frequently Asked Questions
        </h2>

        {/* Subtitle */}
        <p className="text-lg text-center text-gray-600 dark:text-gray-400 mb-12">
          Find quick answers about setting up and using Dhya SPIMS effectively.
        </p>

        {/* FAQ Accordion */}
        <div className="space-y-6 mb-12">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all"
            >
              {/* Question Button */}
              <button
                className="flex items-center justify-between w-full text-left text-lg font-semibold text-gray-800 dark:text-white"
                onClick={() => toggleFAQ(index)}
              >
                <span>{faq.question}</span>
                <span className="text-2xl">{openIndex === index ? "−" : "+"}</span>
              </button>

              {/* Answer */}
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    key="answer"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden mt-4"
                  >
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* 🔥 Prev / Next Navigation */}
      </motion.div>
    </section>
  );
}