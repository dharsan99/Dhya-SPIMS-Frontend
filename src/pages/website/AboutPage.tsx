import { motion, useScroll, useSpring } from "framer-motion";
import TimelineSection from "../../components/website/TimelineSection";

const AboutPage = () => {
  // Scroll progress (for tiny top bar)
  const { scrollYProgress } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 20 });

  return (
    <div className="flex flex-col min-h-screen relative bg-white dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden">

      {/* 📈 Scroll Progress Bar */}
      <motion.div
        style={{ scaleX: scrollProgress }}
        className="fixed top-0 left-0 right-0 h-[3px] origin-left bg-blue-600 z-50"
      />

      {/* 🧩 Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center pt-32 pb-24 px-6 overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Noise Background Layer */}
        <div className="absolute inset-0 bg-[url('/noise.png')] bg-repeat opacity-10 dark:opacity-20 pointer-events-none" />

        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white z-10"
        >
          Building Smart Platforms for Modern Industries
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mt-6 z-10"
        >
          We’re a growing team passionate about solving real-world operational challenges using tech, data, and design.
        </motion.p>
      </section>

      {/* 🛠 What We Do Section */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            { title: "Simplify Operations", desc: "We streamline workflows for industries like textiles, aquaculture, and manufacturing, helping them work smarter." },
            { title: "Enable Real-time Decisions", desc: "Our platforms turn raw data into live, actionable insights — driving better day-to-day and strategic decisions." },
            { title: "Make Tech Accessible", desc: "We build intuitive tools that feel simple, even when the technology underneath is complex." },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-8 rounded-3xl bg-white/70 dark:bg-gray-800/70 shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-800 backdrop-blur-md border border-gray-200 dark:border-gray-700 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 📜 Our Story Section */}
      <section className="py-20 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-8"
          >
            Our Story
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6"
          >
            Dhya Innovations started in Coimbatore with one simple goal: solve operational chaos using smart, scalable systems. 
            We didn’t start with millions in funding — we started with real problems faced by real businesses.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
          >
            Today, we’re helping industries across sectors manage operations, automate insights, and move faster. And we’re still just getting started.
          </motion.p>
        </div>
      </section>

      {/* 🚀 Future Vision */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-8"
          >
            Where We’re Headed
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed"
          >
            We believe connected industries are the future. 
            Our focus is on scaling our platforms, expanding into new verticals, and staying obsessed with making complex operations simple, powerful, and beautiful.
          </motion.p>
        </div>
      </section>

      {/* 🧵 Animated Timeline */}
      <section className="pt-20 pb-28 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <TimelineSection />
        </div>
      </section>

    </div>
  );
};

export default AboutPage;