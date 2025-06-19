import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQsSection() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  const categories = [
    { id: "general", label: "General" },
    { id: "features", label: "Features" },
    { id: "technical", label: "Technical" },
    { id: "pricing", label: "Pricing & Plans" }
  ];

  const faqs: FAQItem[] = [
    // General Questions
    {
      category: "general",
      question: "What is TexIntelli?",
      answer: "TexIntelli (Smart Production & Inventory Management System) is a comprehensive SaaS solution designed specifically for spinning mills. It streamlines operations, manages inventory, tracks production, and provides real-time insights for better decision-making."
    },
    {
      category: "general",
      question: "How does TexIntelli benefit my spinning mill?",
      answer: "TexIntelli helps spinning mills by automating order management, optimizing production planning, tracking inventory in real-time, providing data-driven insights, and ensuring quality control. It reduces manual errors, improves efficiency, and helps in making informed business decisions."
    },
    {
      category: "general",
      question: "Is TexIntelli suitable for my mill size?",
      answer: "Yes, TexIntelli is designed to scale with your business. Whether you're a small, medium, or large spinning mill, the system can be customized to meet your specific needs and grow with your operations."
    },

    // Features Questions
    {
      category: "features",
      question: "What are the key features of TexIntelli?",
      answer: "Key features include AI-powered order management, real-time production tracking, inventory management, quality control, advanced analytics, mobile app access, and comprehensive reporting. The system also offers customization options to match your specific operational needs."
    },
    {
      category: "features",
      question: "How does the AI PO parsing work?",
      answer: "The AI PO parsing feature automatically extracts and processes purchase order information from various formats. It reduces manual data entry, minimizes errors, and speeds up the order processing workflow."
    },
    {
      category: "features",
      question: "Can I track production in real-time?",
      answer: "Yes, TexIntelli provides real-time production tracking with detailed insights into machine performance, production rates, quality metrics, and efficiency indicators. You can monitor production status from anywhere using the web interface or mobile app."
    },

    // Technical Questions
    {
      category: "technical",
      question: "How is data security handled?",
      answer: "TexIntelli implements enterprise-grade security measures including data encryption, role-based access control, regular backups, and secure cloud storage. We comply with industry standards and best practices for data protection."
    },
    {
      category: "technical",
      question: "What are the system requirements?",
      answer: "TexIntelli is a cloud-based solution that works on any modern web browser. For optimal performance, we recommend using the latest versions of Chrome, Firefox, or Safari. The system is also accessible through our mobile app."
    },
    {
      category: "technical",
      question: "How is the system updated?",
      answer: "TexIntelli is automatically updated with new features and improvements. Updates are deployed seamlessly without disrupting your operations. You'll be notified of major updates and new features in advance."
    },

    // Pricing Questions
    {
      category: "pricing",
      question: "What pricing plans are available?",
      answer: "TexIntelli offers flexible pricing plans based on your mill size and requirements. We provide different tiers with varying features and support levels. Contact our sales team for detailed pricing information and to find the best plan for your needs."
    },
    {
      category: "pricing",
      question: "Is there a free trial available?",
      answer: "Yes, we offer a free trial period to help you evaluate TexIntelli. During the trial, you'll have access to all features and can test the system with your actual data. Our team will provide full support to ensure you get the most out of the trial."
    },
    {
      category: "pricing",
      question: "What support is included?",
      answer: "All plans include basic support. Premium plans include dedicated account management, priority support, and additional training sessions. We also provide comprehensive documentation and regular webinars for all users."
    }
  ];

  const toggleItem = (index: number) => {
    setExpandedItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFAQs = faqs.filter(faq => faq.category === activeCategory);

  return (
    <section id="faq" className="px-6 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto py-12"
      >
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
          Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about TexIntelli and how it can help streamline your spinning mill operations.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-2 rounded-full font-semibold transition ${
                activeCategory === category.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition"
              >
                <span className="text-lg font-semibold text-gray-900">
                  {faq.question}
                </span>
                {expandedItems.includes(index) ? (
                  <FaChevronUp className="text-blue-600" />
                ) : (
                  <FaChevronDown className="text-blue-600" />
                )}
              </button>
              <AnimatePresence>
                {expandedItems.includes(index) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 py-4 bg-gray-50"
                  >
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Still have questions? Our team is here to help.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition">
            Contact Support
          </button>
        </div>
      </motion.div>
    </section>
  );
}