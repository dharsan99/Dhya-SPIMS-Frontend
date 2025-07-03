import { motion } from "framer-motion";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function PrivacyPolicyPage() {
  usePageTitle({
    title: "Privacy Policy | Dhya SPIMS",
    description: "Understand how Dhya SPIMS collects, uses, and protects your information."
  });

  return (
    <section className="max-w-6xl mx-auto py-16 px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-12 text-gray-700 dark:text-gray-300"
      >
        {/* Title Block */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Learn how Dhya Innovations Private Limited collects, uses, protects, and shares your personal information when you use Dhya SPIMS.
          </p>
        </div>

        {/* Section Blocks */}
        <div className="space-y-10">

          {/* 1. Information We Collect */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              1. Information We Collect
            </h2>
            <p className="mb-4 leading-relaxed">
              We collect information necessary to provide and improve our services:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Personal Information: Name, Email Address, Phone Number, Company Details</li>
              <li>Login Credentials: Username, Encrypted Password</li>
              <li>Operational Data: Production entries, Inventory records, Order details</li>
              <li>Usage Data: Device information, IP address, Browser type, Activity logs</li>
            </ul>
          </div>

          {/* 2. How We Use Your Information */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Provide, maintain, and improve Dhya SPIMS functionalities</li>
              <li>Communicate important updates and alerts</li>
              <li>Respond to support requests and inquiries</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Protect the platform against fraud and ensure regulatory compliance</li>
            </ul>
          </div>

          {/* 3. Data Sharing and Disclosure */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              3. Data Sharing and Disclosure
            </h2>
            <p className="mb-4 leading-relaxed">
              We do not sell or rent personal information to third parties. 
              We may share information with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Trusted service providers (Hosting, Analytics, Communication)</li>
              <li>Regulatory authorities when legally obligated</li>
              <li>During business mergers, acquisitions, or restructurings (with prior notice)</li>
            </ul>
          </div>

          {/* 4. Data Security */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              4. Data Security
            </h2>
            <p className="leading-relaxed">
              We implement strict security protocols, including encryption, access controls, and secure servers. 
              However, no method of transmission over the internet is entirely secure. 
              You share data at your own risk.
            </p>
          </div>

          {/* 5. Cookies and Tracking */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              5. Cookies and Tracking
            </h2>
            <p className="leading-relaxed">
              Dhya SPIMS uses cookies and similar technologies to improve user experience.
              You can adjust cookie preferences via your browser settings at any time.
            </p>
          </div>

          {/* 6. Your Rights */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              6. Your Rights
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access, update, or delete your personal data</li>
              <li>Request a copy of the information we hold about you</li>
              <li>Withdraw consent for marketing communications</li>
            </ul>
          </div>

          {/* 7. Changes to This Policy */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              7. Changes to This Policy
            </h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy periodically. Significant changes will be notified via platform alerts or email.
              Continued use of Dhya SPIMS after changes indicates acceptance of the updated policy.
            </p>
          </div>

          {/* 8. Contact Information */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              8. Contact Information
            </h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, please contact:
            </p>
            <ul className="mt-4 space-y-2 text-blue-600 dark:text-blue-400">
              <li>Email: <a href="mailto:support@dhya.in" className="hover:underline">support@dhya.in</a></li>
            </ul>
          </div>

        </div>

      </motion.div>
    </section>
  );
}