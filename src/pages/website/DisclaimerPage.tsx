import { motion } from "framer-motion";
import { usePageTitle } from "../../hooks/usePageTitle";

export default function DisclaimerPage() {
  usePageTitle({
    title: "Disclaimer | Dhya SPIMS",
    description: "Read the legal disclaimer regarding the information and services provided by Dhya SPIMS."
  });

  return (
    <section className="max-w-6xl mx-auto py-16 px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="space-y-12 text-gray-700 dark:text-gray-300"
      >
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Disclaimer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Please read this disclaimer carefully before using the Dhya SPIMS platform operated by Dhya Innovations Private Limited.
          </p>
        </div>

        {/* Disclaimer Sections */}
        <div className="space-y-10">

          {/* 1. No Professional Advice */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              1. No Professional Advice
            </h2>
            <p className="leading-relaxed">
              The information, data, reports, and recommendations provided by Dhya SPIMS are intended for general informational purposes only.
              They do not constitute professional, financial, business, or legal advice. Users are encouraged to seek independent professional consultation where required.
            </p>
          </div>

          {/* 2. Accuracy of Information */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              2. Accuracy of Information
            </h2>
            <p className="leading-relaxed">
              While we strive to ensure the accuracy and reliability of data generated by Dhya SPIMS, 
              we do not guarantee that all content is always accurate, complete, or updated.
              Dhya Innovations is not responsible for any errors, omissions, or consequences arising from use of the platform.
            </p>
          </div>

          {/* 3. Limitation of Liability */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              3. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              Under no circumstances shall Dhya Innovations Private Limited, its directors, employees, or affiliates 
              be liable for any indirect, incidental, consequential, or special damages arising out of the use of Dhya SPIMS.
            </p>
          </div>

          {/* 4. External Links Disclaimer */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              4. External Links Disclaimer
            </h2>
            <p className="leading-relaxed">
              Dhya SPIMS may contain links to external websites or third-party resources. 
              We do not endorse or assume any responsibility for their content, accuracy, or practices.
              Users should exercise caution when visiting external sites.
            </p>
          </div>

          {/* 5. Changes to Disclaimer */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              5. Changes to This Disclaimer
            </h2>
            <p className="leading-relaxed">
              We reserve the right to modify this Disclaimer at any time without prior notice.
              It is your responsibility to review this page periodically.
              Continued use of Dhya SPIMS following changes indicates acceptance of the updated Disclaimer.
            </p>
          </div>

          {/* 6. Contact Us */}
          <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              6. Contact Information
            </h2>
            <p className="leading-relaxed">
              If you have any questions about this Disclaimer, please contact us:
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