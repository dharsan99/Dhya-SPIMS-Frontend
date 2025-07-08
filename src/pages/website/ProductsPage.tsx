

const products = [
  {
    title: "SPIMS",
    description: "Smart Production & Inventory Management System for textile industries. Manage orders, production, and inventory seamlessly.",
    link: "/login",  // can change later
  },
  {
    title: "Dhya FARMS",
    description: "Intelligent Aquaculture Management platform for real-time pond monitoring, predictive farming, and automation.",
    link: "#",  // placeholder, can update later
  },
  {
    title: "AquaIntelli Dashboard",
    description: "Live water quality monitoring and insights dashboard for fisheries. Real-time DO, pH, Temperature, and more.",
    link: "#",
  },
];

const ProductsPage = () => {
  return (
    <>

      <div className="min-h-[calc(100vh-200px)] bg-gray-50 dark:bg-gray-900 py-12 px-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Our Products</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-2xl mb-10">
          Empowering industries with powerful platforms designed for productivity, automation, and smart decision-making.
        </p>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">{product.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">{product.description}</p>
              </div>

              <a
                href={product.link}
                className="mt-auto inline-block text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
              >
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </div>

    </>
  );
};

export default ProductsPage;