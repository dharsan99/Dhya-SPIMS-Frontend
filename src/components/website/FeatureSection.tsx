import { FaChartLine, FaWarehouse, FaUserShield, FaIndustry, FaClipboardList, FaMoneyBillWave } from 'react-icons/fa';

const features = [
  {
    title: "Production Tracking",
    description:
      "Monitor live production progress with batch-level insights, shift performance tracking, and operator efficiency metrics for spinning operations.",
    icon: <FaIndustry className="w-10 h-10 text-blue-600" />,
  },
  {
    title: "Inventory Management",
    description:
      "Stay in control of fiber, yarn, and shade stocks with automatic inward, outward, and consumption monitoring for spinning mills.",
    icon: <FaWarehouse className="w-10 h-10 text-blue-600" />,
  },
  {
    title: "Order Management",
    description:
      "Streamline sales order processing, track order status, and manage realization & dispatch with comprehensive order management tools.",
    icon: <FaClipboardList className="w-10 h-10 text-blue-600" />,
  },
  {
    title: "Financial Management",
    description:
      "Track costs, manage invoices, and generate financial reports with integrated financial management tools for spinning operations.",
    icon: <FaMoneyBillWave className="w-10 h-10 text-blue-600" />,
  },
  {
    title: "Analytics & Reporting",
    description:
      "Gain powerful insights with dynamic charts, stock trends, fiber consumption analysis, and production efficiency metrics.",
    icon: <FaChartLine className="w-10 h-10 text-blue-600" />,
  },
  {
    title: "Role-Based Access",
    description:
      "Manage user access precisely with tenant-specific roles, feature-based permissions, and comprehensive security controls.",
    icon: <FaUserShield className="w-10 h-10 text-blue-600" />,
  },
];

const FeatureSection = () => {
  return (
    <section className="py-24 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4" data-aos="fade-up">
            Comprehensive Spinning Mill Management
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Streamline your spinning operations, boost productivity, and scale faster with TexIntelli — your smart production partner.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" data-aos="fade-up" data-aos-delay="200">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-8 rounded-xl bg-gradient-to-b from-blue-50 to-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-2"
              data-aos="zoom-in"
              data-aos-delay={200 + idx * 100}
            >
              <div className="mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
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