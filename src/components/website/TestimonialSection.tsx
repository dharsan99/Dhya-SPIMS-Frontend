import { useState, useRef, useEffect } from "react";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const testimonials = [
  {
    quote: "TexIntelli has transformed how we manage our spinning operations. The real-time tracking and analytics have significantly improved our efficiency.",
    author: "Rajesh Kumar",
    position: "Production Manager",
    company: "ABC Spinning Mills"
  },
  {
    quote: "The inventory management system is exceptional. We've reduced stock discrepancies by 95% since implementing TexIntelli.",
    author: "Priya Sharma",
    position: "Operations Director",
    company: "XYZ Textiles"
  },
  {
    quote: "TexIntelli has streamlined our entire production process. The order management system is particularly impressive.",
    author: "Mohammed Ali",
    position: "CEO",
    company: "Global Yarns Ltd"
  },
  {
    quote: "TexIntelli has transformed how we manage our spinning operations. The real-time tracking and analytics have significantly improved our efficiency.",
    author: "Anita Patel",
    position: "Plant Manager",
    company: "Elite Spinning Co"
  }
];

const TestimonialSection = () => {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance every 4 seconds
  const resetTimeout = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () => setIndex((prev) => (prev + 1) % testimonials.length),
      4000
    );
    return () => resetTimeout();
  }, [index]);

  const goTo = (i: number) => setIndex(i);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trusted by leading spinning mills across India for comprehensive production and inventory management.
          </p>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${index * 100}%)` }}>
            {testimonials.map((t, i) => (
              <div key={i} className="min-w-full px-6">
                <div className="bg-white p-8 rounded-xl shadow-md h-[320px] flex flex-col items-center">
                  <FaQuoteLeft className="text-blue-600 text-3xl mb-6" />
                  <p className="text-gray-600 mb-6 leading-relaxed flex-grow text-center">{t.quote}</p>
                  <div className="mt-auto pt-4 border-t border-gray-100 text-center">
                    <h4 className="font-semibold text-gray-900">{t.author}</h4>
                    <p className="text-sm text-gray-600">{t.position}</p>
                    <p className="text-sm text-blue-600">{t.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Navigation */}
          <button
            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white rounded-full shadow p-2 text-blue-600 hover:bg-blue-50"
            onClick={prev}
            aria-label="Previous"
          >
            <FaChevronLeft />
          </button>
          <button
            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white rounded-full shadow p-2 text-blue-600 hover:bg-blue-50"
            onClick={next}
            aria-label="Next"
          >
            <FaChevronRight />
          </button>
          {/* Dots */}
          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                className={`w-3 h-3 rounded-full ${i === index ? "bg-blue-600" : "bg-gray-300"}`}
                onClick={() => goTo(i)}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection; 