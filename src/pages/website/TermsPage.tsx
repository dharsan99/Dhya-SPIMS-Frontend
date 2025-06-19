import { motion, AnimatePresence } from "framer-motion";
import { usePageTitle } from "../../hooks/usePageTitle";
import { FaShieldAlt, FaUserShield, FaDatabase, FaChartLine, FaMoneyBillWave, FaTools, FaExclamationTriangle, FaGavel, FaEnvelope, FaChevronDown } from "react-icons/fa";
import { useState } from "react";

export default function TermsPage() {
  usePageTitle({
    title: "Terms of Service | TexIntelli",
    description: "Read our terms of service to understand your rights and responsibilities when using TexIntelli."
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
      title: "1. Acceptance of Terms",
      content: "By accessing or using TexIntelli, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
      subsections: [
        {
          title: "Account Registration",
          content: "Users must provide accurate and complete information during registration. You are responsible for maintaining the confidentiality of your account credentials."
        },
        {
          title: "Age Requirement",
          content: "You must be at least 18 years old to use TexIntelli. By using our services, you represent and warrant that you meet this requirement."
        }
      ]
    },
    {
      icon: <FaUserShield className="w-8 h-8 text-blue-600" />,
      title: "2. Use of Service",
      content: "TexIntelli provides digital tools to streamline production, inventory management, and reporting in textile and spinning industries.",
      subsections: [
        {
          title: "Authorized Use",
          content: "You may use TexIntelli only for lawful purposes and in accordance with these Terms. You agree not to use the service for any illegal or unauthorized purpose."
        },
        {
          title: "User Responsibilities",
          content: "You are responsible for all activities that occur under your account, including maintaining the security of your login credentials and ensuring compliance with these Terms."
        }
      ]
    },
    {
      icon: <FaMoneyBillWave className="w-8 h-8 text-blue-600" />,
      title: "3. Subscription & Payment",
      content: "Certain features of TexIntelli may require paid subscriptions. By subscribing, you agree to pay all applicable fees and charges.",
      subsections: [
        {
          title: "Billing Terms",
          content: "Subscription fees are billed in advance on a monthly or annual basis. All payments are non-refundable unless otherwise specified in our refund policy."
        },
        {
          title: "Price Changes",
          content: "We reserve the right to modify our pricing with 30 days' notice. Continued use of the service after price changes constitutes acceptance of the new pricing."
        }
      ]
    },
    {
      icon: <FaDatabase className="w-8 h-8 text-blue-600" />,
      title: "4. Data & Privacy",
      content: "We are committed to protecting your data and privacy. Please refer to our Privacy Policy for detailed information about data handling.",
      subsections: [
        {
          title: "Data Ownership",
          content: "You retain all rights to your business data. We process and store your data in accordance with our Privacy Policy and applicable data protection laws."
        },
        {
          title: "Data Security",
          content: "We implement industry-standard security measures to protect your data. However, you are responsible for maintaining the security of your account credentials."
        }
      ]
    },
    {
      icon: <FaChartLine className="w-8 h-8 text-blue-600" />,
      title: "5. Service Features",
      content: "TexIntelli offers various features for production tracking, inventory management, and analytics.",
      subsections: [
        {
          title: "Feature Availability",
          content: "Features may vary based on your subscription plan. We reserve the right to modify, add, or remove features at any time."
        },
        {
          title: "Service Updates",
          content: "We regularly update our services to improve functionality and security. Updates may be automatic or require user action."
        }
      ]
    },
    {
      icon: <FaTools className="w-8 h-8 text-blue-600" />,
      title: "6. Service Modifications",
      content: "We reserve the right to modify, suspend, or discontinue any aspect of TexIntelli at any time.",
      subsections: [
        {
          title: "Scheduled Maintenance",
          content: "We may perform scheduled maintenance that could temporarily affect service availability. We will provide advance notice when possible."
        },
        {
          title: "Service Changes",
          content: "We may modify or discontinue features or services with reasonable notice. We will notify users of significant changes via email or in-app notifications."
        }
      ]
    },
    {
      icon: <FaExclamationTriangle className="w-8 h-8 text-blue-600" />,
      title: "7. Limitation of Liability",
      content: "Dhya Innovations Private Limited is not liable for any indirect, incidental, special, or consequential damages.",
      subsections: [
        {
          title: "Service Availability",
          content: "We do not guarantee uninterrupted or error-free service. We are not liable for any losses resulting from service interruptions."
        },
        {
          title: "Data Loss",
          content: "While we implement robust backup systems, we are not liable for any data loss. Users are responsible for maintaining their own backups."
        }
      ]
    },
    {
      icon: <FaGavel className="w-8 h-8 text-blue-600" />,
      title: "8. Governing Law",
      content: "These Terms are governed by and construed in accordance with the laws of India.",
      subsections: [
        {
          title: "Jurisdiction",
          content: "Any disputes arising under these Terms shall be subject to the jurisdiction of courts located in Coimbatore, Tamil Nadu, India."
        },
        {
          title: "Dispute Resolution",
          content: "We encourage users to resolve disputes through direct communication. If resolution is not possible, disputes will be resolved through arbitration."
        }
      ]
    },
    {
      icon: <FaEnvelope className="w-8 h-8 text-blue-600" />,
      title: "9. Contact Information",
      content: "For any questions about these Terms of Service, please contact us:",
      subsections: [
        {
          title: "Support",
          content: "Email: support@dhya.in"
        },
        {
          title: "Legal",
          content: "Email: legal@dhya.in"
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
              Terms & Conditions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Welcome to TexIntelli. By accessing or using our platform, you agree to be bound by these terms and conditions. 
              Please read them carefully before using our services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Terms Sections */}
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

