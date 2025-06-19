import { motion, AnimatePresence } from "framer-motion";
import { usePageTitle } from "../../hooks/usePageTitle";
import { useState } from "react";
import { 
  FaShieldAlt, 
  FaDatabase, 
  FaEnvelope,
  FaChevronDown,
  FaLock,
  FaUserCog,
  FaCookieBite,
  FaEye,
  FaHandshake
} from "react-icons/fa";

export default function PrivacyPolicyPage() {
  usePageTitle({
    title: "Privacy Policy | TexIntelli",
    description: "Learn how we collect, use, and protect your personal information at TexIntelli."
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
      title: "1. Introduction",
      content: "At TexIntelli, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Smart Production & Inventory Management System.",
      subsections: [
        {
          title: "Scope",
          content: "This policy applies to all users of TexIntelli, including visitors, customers, and employees. By using our services, you agree to the collection and use of information in accordance with this policy."
        },
        {
          title: "Updates",
          content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last Updated' date."
        }
      ]
    },
    {
      icon: <FaDatabase className="w-8 h-8 text-blue-600" />,
      title: "2. Information We Collect",
      content: "We collect several types of information for various purposes to provide and improve our service to you.",
      subsections: [
        {
          title: "Personal Information",
          content: "This includes but is not limited to: name, email address, phone number, company details, and billing information."
        },
        {
          title: "Usage Data",
          content: "We collect information about how you use our service, including access times, pages viewed, and features used."
        },
        {
          title: "Production Data",
          content: "Information related to your production processes, inventory levels, and operational metrics."
        }
      ]
    },
    {
      icon: <FaUserCog className="w-8 h-8 text-blue-600" />,
      title: "3. How We Use Your Information",
      content: "We use the collected information for various purposes to provide and improve our service.",
      subsections: [
        {
          title: "Service Provision",
          content: "To provide and maintain our service, notify you about changes, and provide customer support."
        },
        {
          title: "Improvement",
          content: "To improve our service, develop new features, and enhance user experience."
        },
        {
          title: "Communication",
          content: "To communicate with you about updates, security alerts, and support messages."
        }
      ]
    },
    {
      icon: <FaLock className="w-8 h-8 text-blue-600" />,
      title: "4. Data Security",
      content: "We implement appropriate security measures to protect your personal information.",
      subsections: [
        {
          title: "Security Measures",
          content: "We use industry-standard encryption, secure servers, and regular security audits to protect your data."
        },
        {
          title: "Data Access",
          content: "Access to your data is restricted to authorized personnel only, and all access is logged and monitored."
        }
      ]
    },
    {
      icon: <FaCookieBite className="w-8 h-8 text-blue-600" />,
      title: "5. Cookies and Tracking",
      content: "We use cookies and similar tracking technologies to track activity on our service.",
      subsections: [
        {
          title: "Cookie Types",
          content: "We use essential cookies for site functionality and analytics cookies to improve our service."
        },
        {
          title: "Cookie Control",
          content: "You can control cookie settings through your browser preferences. However, disabling cookies may affect service functionality."
        }
      ]
    },
    {
      icon: <FaEye className="w-8 h-8 text-blue-600" />,
      title: "6. Data Sharing and Disclosure",
      content: "We may share your information with third parties in certain circumstances.",
      subsections: [
        {
          title: "Service Providers",
          content: "We may share data with third-party service providers who assist in operating our service."
        },
        {
          title: "Legal Requirements",
          content: "We may disclose your information if required by law or to protect our rights and safety."
        }
      ]
    },
    {
      icon: <FaHandshake className="w-8 h-8 text-blue-600" />,
      title: "7. Your Rights",
      content: "You have certain rights regarding your personal information.",
      subsections: [
        {
          title: "Access and Control",
          content: "You can access, update, or delete your personal information through your account settings."
        },
        {
          title: "Data Export",
          content: "You can request a copy of your data in a structured, commonly used format."
        }
      ]
    },
    {
      icon: <FaEnvelope className="w-8 h-8 text-blue-600" />,
      title: "8. Contact Us",
      content: "If you have any questions about this Privacy Policy, please contact us:",
      subsections: [
        {
          title: "Support",
          content: "Email: support@dhya.in"
        },
        {
          title: "Privacy Officer",
          content: "Email: privacy@dhya.in"
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
            Privacy Policy
          </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your privacy is important to us. This policy outlines how we collect, use, and protect your information 
              when you use TexIntelli.
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