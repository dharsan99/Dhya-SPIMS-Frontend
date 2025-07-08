import { FaChartLine, FaWarehouse, FaUserShield, FaIndustry } from 'react-icons/fa'; // ✅ Using real icons

const features = [
  {
    title: "Real-Time Production Tracking",
    description:
      "Monitor live production progress with batch-level insights, shift performance tracking, and operator efficiency metrics.",
    icon: <FaIndustry className="w-10 h-10 text-blue-600" />,
  },
  {
    title: "Smart Inventory Management",
    description:
      "Stay in control of fiber, yarn, and shade stocks with automatic inward, outward, and consumption monitoring.",
    icon: <FaWarehouse className="w-10 h-10 text-blue-600" />,
  },
  {
    title: "Analytics and Reporting",
    description:
      "Gain powerful insights with dynamic charts, stock trends, fiber consumption analysis, and shade usage breakdowns.",
    icon: <FaChartLine className="w-10 h-10 text-blue-600" />,
  },
  {
    title: "Custom Role and Access Control",
    description:
      "Manage user access precisely with tenant-specific roles, feature-based permissions, and security control.",
    icon: <FaUserShield className="w-10 h-10 text-blue-600" />,
  },
];

const FeatureSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-gray-900" id="features">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4" data-aos="fade-up">
            Powerful Tools for Modern Production
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Simplify your operations, boost productivity, and scale faster with Dhya SPIMS — your smart production partner.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-4" data-aos="fade-up" data-aos-delay="200">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-8 rounded-xl bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-2"
              data-aos="zoom-in"
              data-aos-delay={200 + idx * 100}
            >
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;