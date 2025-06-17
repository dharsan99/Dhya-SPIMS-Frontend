import { motion, AnimatePresence } from "framer-motion";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useState } from "react";
import { 
  FaShieldAlt, 
  FaUserShield, 
  FaDatabase, 
  FaChartLine, 
  FaMoneyBillWave, 
  FaTools, 
  FaExclamationTriangle, 
  FaGavel, 
  FaEnvelope,
  FaChevronDown,
  FaUndo,
  FaCalendarAlt,
  FaCreditCard,
  FaFileInvoiceDollar,
  FaHandshake,
  FaQuestionCircle
} from "react-icons/fa";

export default function RefundPolicyPage() {
  usePageTitle({
    title: "Refund & Cancellation Policy | Dhya SPIMS",
    description: "Learn about our refund and cancellation policies for Dhya SPIMS subscriptions and services."
  });

  const [expandedSections, setExpandedSections] = useState<number[]>([]);

  const toggleSection = (index: number) => {
    setExpandedSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const sections = [
    {
      icon: <FaShieldAlt className="w-8 h-8 text-blue-600" />,
      title: "1. Overview",
      content: "This Refund and Cancellation Policy outlines the terms and conditions for refunds and cancellations of Dhya SPIMS subscriptions and services. By using our services, you agree to these terms.",
      subsections: [
        {
          title: "Policy Scope",
          content: "This policy applies to all subscriptions, services, and purchases made through Dhya SPIMS."
        },
        {
          title: "Updates",
          content: "We may update this policy from time to time. Any changes will be posted on this page with an updated revision date."
        }
      ]
    },
    {
      icon: <FaMoneyBillWave className="w-8 h-8 text-blue-600" />,
      title: "2. Subscription Refunds",
      content: "Our refund policy for subscription services is designed to be fair and transparent.",
      subsections: [
        {
          title: "Monthly Subscriptions",
          content: "Monthly subscriptions are non-refundable once the billing cycle has begun. Refunds may be considered on a case-by-case basis for technical issues preventing service usage."
        },
        {
          title: "Annual Subscriptions",
          content: "Annual subscriptions may be eligible for a prorated refund within the first 30 days of the subscription period. After 30 days, refunds will be considered on a case-by-case basis."
        }
      ]
    },
    {
      icon: <FaUndo className="w-8 h-8 text-blue-600" />,
      title: "3. Cancellation Policy",
      content: "You may cancel your subscription at any time. The cancellation will take effect at the end of your current billing period.",
      subsections: [
        {
          title: "Cancellation Process",
          content: "To cancel your subscription, please contact our support team or use the cancellation option in your account settings. Cancellations must be made at least 24 hours before the next billing cycle."
        },
        {
          title: "Post-Cancellation Access",
          content: "You will retain access to the service until the end of your current billing period. No refunds will be provided for unused portions of the current billing period."
        }
      ]
    },
    {
      icon: <FaCalendarAlt className="w-8 h-8 text-blue-600" />,
      title: "4. Billing Cycles",
      content: "Understanding our billing cycles and how they affect refunds and cancellations.",
      subsections: [
        {
          title: "Monthly Billing",
          content: "Monthly subscriptions are billed in advance for the upcoming month. The billing date is based on your initial subscription date."
        },
        {
          title: "Annual Billing",
          content: "Annual subscriptions are billed in advance for the full year. The billing date is based on your initial subscription date."
        }
      ]
    },
    {
      icon: <FaCreditCard className="w-8 h-8 text-blue-600" />,
      title: "5. Payment Methods",
      content: "Information about payment methods and refund processing.",
      subsections: [
        {
          title: "Accepted Payment Methods",
          content: "We accept various payment methods including credit cards, debit cards, and bank transfers."
        },
        {
          title: "Refund Processing",
          content: "Refunds will be processed using the original payment method. Processing times may vary depending on your payment provider."
        }
      ]
    },
    {
      icon: <FaFileInvoiceDollar className="w-8 h-8 text-blue-600" />,
      title: "6. Special Circumstances",
      content: "Policies for special circumstances and exceptions.",
      subsections: [
        {
          title: "Technical Issues",
          content: "If you experience significant technical issues preventing service usage, we may consider a refund or credit. Please contact our support team immediately."
        },
        {
          title: "Service Disruption",
          content: "In case of extended service disruption, we may provide credits or refunds at our discretion."
        }
      ]
    },
    {
      icon: <FaHandshake className="w-8 h-8 text-blue-600" />,
      title: "7. Enterprise Agreements",
      content: "Special terms for enterprise-level subscriptions and custom agreements.",
      subsections: [
        {
          title: "Custom Terms",
          content: "Enterprise customers may have custom refund and cancellation terms as specified in their individual agreements."
        },
        {
          title: "Volume Discounts",
          content: "Special considerations may apply to subscriptions with volume discounts or custom pricing."
        }
      ]
    },
    {
      icon: <FaQuestionCircle className="w-8 h-8 text-blue-600" />,
      title: "8. Contact Information",
      content: "For questions about refunds or cancellations, please contact us:",
      subsections: [
        {
          title: "Support",
          content: "Email: support@dhya.in"
        },
        {
          title: "Billing",
          content: "Email: billing@dhya.in"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
      <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Refund & Cancellation Policy
          </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Clear and transparent policies for refunds and cancellations of Dhya SPIMS subscriptions and services.
            </p>
          </motion.div>
          </div>
      </section>

      {/* Policy Sections */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-4">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(index)}
                  className="w-full p-8 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="flex-shrink-0">
                      {section.icon}
          </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {section.title}
            </h2>
          </div>
                  <motion.div
                    animate={{ rotate: expandedSections.includes(index) ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaChevronDown className="w-5 h-5 text-gray-500" />
                  </motion.div>
                </button>

                {/* Section Content */}
                <AnimatePresence>
                  {expandedSections.includes(index) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="p-8 pt-0">
                        <p className="text-gray-600 mb-6">
                          {section.content}
                        </p>
                        {section.subsections && (
                          <div className="space-y-4">
                            {section.subsections.map((subsection, subIndex) => (
                              <div key={subIndex} className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                  {subsection.title}
                                </h3>
                                <p className="text-gray-600">
                                  {subsection.content}
            </p>
          </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Last Updated */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
    </section>
    </div>
  );
}