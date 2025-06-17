import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { FaQuoteLeft } from 'react-icons/fa';
import { useRef, useEffect } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const testimonials = [
  {
    quote: "SPIMS has transformed how we manage our spinning operations. The real-time tracking and analytics have significantly improved our efficiency.",
    author: "Rajesh Kumar",
    position: "Production Manager",
    company: "Textile Solutions Ltd"
  },
  {
    quote: "The inventory management system is exceptional. We've reduced stock discrepancies by 95% since implementing SPIMS.",
    author: "Priya Sharma",
    position: "Inventory Controller",
    company: "Modern Spinning Mills"
  },
  {
    quote: "The production tracking features have given us unprecedented visibility into our operations. Highly recommended!",
    author: "Vikram Singh",
    position: "Operations Director",
    company: "Quality Yarns Inc"
  },
  {
    quote: "SPIMS has streamlined our entire production process. The order management system is particularly impressive.",
    author: "Anita Patel",
    position: "Plant Manager",
    company: "Elite Spinning Co"
  }
];

const TestimonialSection = () => {
  const swiperRef = useRef(null);

  useEffect(() => {
    if (swiperRef.current) {
      const swiper = swiperRef.current.swiper;
      swiper.on('slideChange', () => {
        swiper.navigation.enable();
        swiper.navigation.update();
      });
    }
  }, []);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trusted by leading spinning mills across India for comprehensive production and inventory management.
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative px-8 md:px-12">
          <Swiper
            ref={swiperRef}
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            loop={true}
            loopedSlides={4}
            watchSlidesProgress={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
              waitForTransition: true,
            }}
            speed={800}
            grabCursor={true}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={{
              prevEl: '.swiper-button-prev',
              nextEl: '.swiper-button-next',
              disabledClass: 'swiper-button-disabled',
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            className="pb-16"
            onSlideChange={(swiper) => {
              swiper.navigation.enable();
              swiper.navigation.update();
            }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-md hover:shadow-lg transition-all h-[320px] flex flex-col">
                  <FaQuoteLeft className="text-blue-600 text-3xl mb-6 flex-shrink-0" />
                  <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                    {testimonial.quote}
                  </p>
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <h4 className="font-semibold text-gray-900">
                      {testimonial.author}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {testimonial.position}
                    </p>
                    <p className="text-sm text-blue-600">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Buttons */}
          <div className="swiper-button-prev !w-10 !h-10 !bg-white !rounded-full !shadow-md after:!text-blue-600 after:!text-lg hover:!bg-blue-50 transition-colors !opacity-100 !-left-2 md:!-left-4"></div>
          <div className="swiper-button-next !w-10 !h-10 !bg-white !rounded-full !shadow-md after:!text-blue-600 after:!text-lg hover:!bg-blue-50 transition-colors !opacity-100 !-right-2 md:!-right-4"></div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection; 