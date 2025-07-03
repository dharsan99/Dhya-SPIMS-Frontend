

const services = [
  {
    title: "Software Development",
    description: "Custom web applications, platforms, and backend solutions crafted to meet unique business needs using the latest technologies.",
  },
  {
    title: "IoT Solutions",
    description: "Smart hardware integration for industries such as aquaculture and agriculture — combining sensor networks, real-time data, and cloud dashboards.",
  },
  {
    title: "AI & ML Integrations",
    description: "Deploy intelligent models for image recognition, predictive analysis, and automation. Specialized in fisheries and smart farm solutions.",
  },
  {
    title: "Digital Transformation",
    description: "We help traditional industries modernize operations with automation, workflow optimization, and cloud-native systems.",
  },
  {
    title: "Consulting & Strategy",
    description: "Technology consulting for startups and enterprises — solution architecture, scaling, security, and cloud migration strategies.",
  },
];

const ServicesPage = () => {
  return (
    <>

      <div className="min-h-[calc(100vh-200px)] bg-gray-50 dark:bg-gray-900 py-12 px-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Our Services</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mb-10">
          At Dhya Innovations, we offer a wide range of services combining deep industry expertise with cutting-edge technology to drive sustainable growth.
        </p>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">{service.title}</h3>
              <p className="text-gray-700 dark:text-gray-300">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

    </>
  );
};

export default ServicesPage;