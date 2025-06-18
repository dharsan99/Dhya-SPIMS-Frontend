import { motion } from "framer-motion";
import { FaUsers, FaUserClock, FaUserShield, FaTasks } from "react-icons/fa";

export default function EmployeeManagementSection() {
  const features = [
    {
      icon: <FaUsers className="w-8 h-8 text-blue-600" />,
      title: "Employee Profiles",
      description: "Comprehensive employee information management",
      details: [
        "Personal information",
        "Employment details",
        "Skills and qualifications",
        "Document management"
      ]
    },
    {
      icon: <FaUserClock className="w-8 h-8 text-blue-600" />,
      title: "Attendance Tracking",
      description: "Automated attendance management",
      details: [
        "Shift management",
        "Time tracking",
        "Leave management",
        "Overtime calculation"
      ]
    },
    {
      icon: <FaTasks className="w-8 h-8 text-blue-600" />,
      title: "Performance Management",
      description: "Employee performance tracking",
      details: [
        "KPI monitoring",
        "Performance reviews",
        "Goal setting",
        "Training tracking"
      ]
    },
    {
      icon: <FaUserShield className="w-8 h-8 text-blue-600" />,
      title: "Access Control",
      description: "Role-based access management",
      details: [
        "Permission settings",
        "Department access",
        "Feature restrictions",
        "Security levels"
      ]
    }
  ];

  const processes = [
    {
      title: "Employee Onboarding",
      items: [
        "Document collection",
        "Profile creation",
        "Access setup",
        "Training assignment"
      ]
    },
    {
      title: "Attendance Management",
      items: [
        "Shift scheduling",
        "Time tracking",
        "Leave requests",
        "Overtime management"
      ]
    },
    {
      title: "Performance Tracking",
      items: [
        "KPI monitoring",
        "Performance reviews",
        "Training records",
        "Career development"
      ]
    }
  ];

  const reports = [
    {
      title: "Employee Reports",
      items: [
        "Attendance reports",
        "Performance metrics",
        "Training status",
        "Leave balance"
      ]
    },
    {
      title: "Analytics",
      items: [
        "Workforce analytics",
        "Productivity metrics",
        "Training effectiveness",
        "Resource utilization"
      ]
    }
  ];

  return (
    <section id="employee-management" className="px-6 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-5xl mx-auto py-12"
      >
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            Employee Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Streamline your workforce management with TexIntelli. From employee profiles to performance tracking, manage your entire workforce efficiently.
          </p>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-600">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Processes */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Employee Processes
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {processes.map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{process.title}</h3>
                <ul className="space-y-2">
                  {process.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-600">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Reports */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Reports & Analytics
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {reports.map((report, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">{report.title}</h3>
                <ul className="space-y-2">
                  {report.items.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-600">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">The TexIntelli Advantage</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Traditional Systems</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Manual record keeping</li>
                <li>• Paper-based processes</li>
                <li>• Limited analytics</li>
                <li>• Time-consuming tasks</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">With TexIntelli</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Automated workflows</li>
                <li>• Digital documentation</li>
                <li>• Advanced analytics</li>
                <li>• Time-saving automation</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
} 