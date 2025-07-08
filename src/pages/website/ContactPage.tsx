import { FiMail, FiMapPin } from "react-icons/fi";

const ContactPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center pt-28 pb-12 px-6 bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          Get in Touch
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          We'd love to hear from you — whether it's a question, a demo request, or a partnership inquiry.
        </p>
      </section>

      {/* Contact Section */}
      <section className="py-14 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

          {/* Contact Form */}
          <form className="w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Message
              </label>
              <textarea
                placeholder="Tell us what you need..."
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition transform hover:-translate-y-1"
            >
              Send Message
            </button>
          </form>

          {/* Contact Information */}
          <div className="flex flex-col justify-center space-y-8 text-center md:text-left">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Contact Information
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Reach out to our team. We'll get back to you shortly!
              </p>
            </div>

            <div className="space-y-6 text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-3">
                <FiMail className="text-blue-600 w-5 h-5" />
                <a href="mailto:support@dhya.in" className="hover:underline">
                  support@dhya.in
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <FiMapPin className="text-blue-600 w-5 h-5" />
                <span>Coimbatore, Tamil Nadu, India</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Map Section */}
      <section className="px-6 pb-14">
        <div className="max-w-6xl mx-auto overflow-hidden rounded-xl shadow-md">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.0944958396076!2d76.97504247505186!3d11.031536754436317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859b0bd4b24b3%3A0x4210fddc92db7786!2sDhya%20Innovations%20Private%20Limited!5e0!3m2!1sen!2sin!4v1745670244441!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg"
          ></iframe>
        </div>
      </section>

    </div>
  );
};

export default ContactPage;