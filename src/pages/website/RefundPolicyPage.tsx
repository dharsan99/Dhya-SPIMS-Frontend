import { motion } from "framer-motion";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function RefundPolicyPage() {
  usePageTitle({
    title: "Refund & Cancellation Policy | Dhya SPIMS",
    description: "Understand Dhya SPIMS' policies regarding subscription refunds and service cancellations."
  });

  return (
    <section className="max-w-6xl mx-auto py-16 px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-12 text-gray-700 dark:text-gray-300"
      >
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Refund & Cancellation Policy
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Understand our policies regarding subscription refunds, cancellations, and billing practices for Dhya SPIMS.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-10">

          {/* 1. Subscription Services */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              1. Subscription Services
            </h2>
            <p className="leading-relaxed">
              Dhya SPIMS operates on a subscription model. Payments are billed upfront based on your chosen billing cycle (monthly or annually).
            </p>
          </div>

          {/* 2. Refund Eligibility */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              2. Refund Eligibility
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>All subscription payments are generally non-refundable.</li>
              <li>Refunds are considered under exceptional circumstances like:
                <ul className="list-disc list-inside ml-5 space-y-1">
                  <li>Duplicate payments</li>
                  <li>Platform access failures due to our system</li>
                  <li>Non-delivery of subscribed services</li>
                </ul>
              </li>
              <li>Refund requests must be raised within <strong>7 days</strong> of payment date.</li>
            </ul>
          </div>

          {/* 3. Cancellation Policy */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              3. Cancellation Policy
            </h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You may cancel your subscription at any time via account settings or support request.</li>
              <li>Access continues until the end of the billing period.</li>
              <li>No partial or prorated refunds for unused time will be issued.</li>
            </ul>
          </div>

          {/* 4. Refund Request Procedure */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              4. Refund Request Procedure
            </h2>
            <p className="leading-relaxed mb-4">
              To request a refund, please email us at 
              <a href="mailto:support@dhya.in" className="text-blue-600 hover:underline ml-1">support@dhya.in</a> 
              with the following details:
            </p>
            <ul className="list-disc list-inside ml-5 space-y-2">
              <li>Registered Email Address</li>
              <li>Transaction ID</li>
              <li>Date of Payment</li>
              <li>Reason for Refund Request</li>
            </ul>
            <p className="mt-4">
              Valid refund requests are processed within <strong>7-10 business days</strong>.
            </p>
          </div>

          {/* 5. Changes to This Policy */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              5. Changes to This Policy
            </h2>
            <p className="leading-relaxed">
              We reserve the right to modify this policy at any time. 
              Updates will be reflected on this page. Continued use after changes constitutes acceptance of the revised terms.
            </p>
          </div>

          {/* 6. Contact Information */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              6. Contact Information
            </h2>
            <p className="leading-relaxed">
              For any questions about this Refund & Cancellation Policy, please contact:
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