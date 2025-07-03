import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaLinkedin, FaTwitter, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ContactForm from '@/components/website/ContactForm';

const ContactPage = () => {
  const contactInfo = [
    {
      icon: <FaPhone className="w-6 h-6 text-blue-600" />,
      title: "Phone",
      details: [
        "+91 1234567890",
        "+91 9876543210"
      ],
      description: "Available Monday to Friday, 9 AM to 6 PM IST"
    },
    {
      icon: <FaEnvelope className="w-6 h-6 text-blue-600" />,
      title: "Email",
      details: [
        "support@dhya.in",
        "sales@dhya.in"
      ],
      description: "We'll respond within 24 hours"
    },
    {
      icon: <FaMapMarkerAlt className="w-6 h-6 text-blue-600" />,
      title: "Office",
      details: [
        "Dhya Innovations Private Limited",
        "Coimbatore, Tamil Nadu, India"
      ],
      description: "Visit us during business hours"
    },
    {
      icon: <FaClock className="w-6 h-6 text-blue-600" />,
      title: "Business Hours",
      details: [
        "Monday - Friday: 9:00 AM - 6:00 PM",
        "Saturday: 10:00 AM - 2:00 PM"
      ],
      description: "Closed on Sundays and Public Holidays"
    }
  ];

  const socialLinks = [
    {
      icon: <FaLinkedin className="w-6 h-6" />,
      url: "https://linkedin.com/company/dhya",
      label: "LinkedIn"
    },
    {
      icon: <FaTwitter className="w-6 h-6" />,
      url: "https://twitter.com/dhya",
      label: "Twitter"
    },
    {
      icon: <FaFacebook className="w-6 h-6" />,
      url: "https://facebook.com/dhya",
      label: "Facebook"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about TexIntelli? We're here to help. Choose your preferred way to reach us.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">{info.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{info.title}</h3>
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600">{detail}</p>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-gray-900">
                Send us a Message
              </h2>
              <p className="text-gray-600">
                Whether you have questions about our features, need a demo, or want to discuss your specific requirements, 
                our team is ready to assist you. Fill out the form and we'll get back to you shortly.
              </p>
              
              {/* Social Links */}
              <div className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Connect with us</h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                      aria-label={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.0945663715147!2d76.97274647771778!3d11.0315314611137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859b0bd4b24b3%3A0x4210fddc92db7786!2sDhya%20Innovations%20Private%20Limited!5e0!3m2!1sen!2sin!4v1750222908634!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Dhya Office Location"
              className="w-full"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;