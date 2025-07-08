import { motion } from "framer-motion";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function TermsPage() {
  usePageTitle({
    title: "Terms & Conditions | Dhya SPIMS",
    description: "Review the Terms and Conditions for using Dhya SPIMS platform and services."
  });

  return (
    <section className="max-w-5xl mx-auto py-16 px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-8 text-gray-700 dark:text-gray-300"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Terms & Conditions
        </h1>

        <p>
          Welcome to Dhya SPIMS (Smart Production & Inventory Management System). 
          By accessing or using our platform, you agree to be bound by the following terms and conditions.
          Please read them carefully before using our services.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8">
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing, registering, or using Dhya SPIMS, you agree to comply with and be legally bound by these Terms. 
          If you do not agree to these Terms, you may not access or use the platform.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8">
          2. Use of Service
        </h2>
        <p>
          Dhya SPIMS provides digital tools to streamline production, inventory management, and reporting in textile and spinning industries.
          Users are responsible for maintaining the confidentiality of account information and for all activities under their account.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8">
          3. Subscription & Payment
        </h2>
        <p>
          Certain features of Dhya SPIMS may require paid subscriptions. 
          By subscribing, you agree to pay all applicable fees and charges in accordance with the pricing and billing terms in effect at the time of payment.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8">
          4. Intellectual Property
        </h2>
        <p>
          All content, software, logos, and trademarks on Dhya SPIMS are the exclusive property of Dhya Innovations Private Limited.
          Unauthorized copying, modification, or distribution is prohibited without prior written consent.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8">
          5. Data Protection
        </h2>
        <p>
          We are committed to protecting your data and privacy. 
          Please refer to our <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a> to understand how we collect, store, and use your information.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8">
          6. Service Modifications
        </h2>
        <p>
          Dhya Innovations Private Limited reserves the right to modify, suspend, or discontinue Dhya SPIMS at any time, 
          with or without notice. We are not liable to you or any third party for such changes.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8">
          7. Termination
        </h2>
        <p>
          We may terminate or suspend access to Dhya SPIMS immediately, without prior notice or liability, 
          if you breach any of these Terms or engage in prohibited activities.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8">
          8. Limitation of Liability
        </h2>
        <p>
          Dhya Innovations Private Limited is not liable for any indirect, incidental, special, or consequential damages 
          arising out of or in connection with the use or inability to use Dhya SPIMS.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8">
          9. Governing Law
        </h2>
        <p>
          These Terms are governed by and construed in accordance with the laws of India.
          Any disputes arising under these Terms shall be subject to the jurisdiction of courts located in Coimbatore, Tamil Nadu, India.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8">
          10. Contact Us
        </h2>
        <p>
          If you have any questions about these Terms, please contact us at: 
          <br />
          <strong>Email:</strong> <a href="mailto:support@dhya.in" className="text-blue-600 hover:underline">support@dhya.in</a>
        </p>

      </motion.div>
    </section>
  );
}