import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../styles/home2.css";

import hb1 from "../assets/images/hb1.png";
import hb2 from "../assets/images/hb2.png";
import hb3 from "../assets/images/hb3.png";
import hb4 from "../assets/images/hb4.png";

const slides = [
  { id: 1, image:hb1},
  { id: 2, image:hb2},
  { id: 3, image:hb3}, 
  { id: 4, image:hb4}, 
];

// --- Custom Icon Components ---
const PrevIcon = () => (  
<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24">
  <path d="m8.732,13.768c-.472-.473-.732-1.101-.732-1.768s.26-1.295.734-1.77L18.026.852c.194-.196.193-.513-.003-.707-.197-.194-.513-.192-.707.004l-9.291,9.377c-.661.661-1.025,1.54-1.025,2.475s.364,1.813,1.024,2.473l9.292,9.379c.098.099.226.148.355.148.127,0,.254-.048.352-.145.196-.194.197-.511.003-.707l-9.294-9.381Z"/>
</svg>


);

const NextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="#fff" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24">
  <path d="m17,12c0,.935-.364,1.813-1.025,2.475l-9.291,9.377c-.098.099-.227.148-.355.148-.127,0-.255-.048-.352-.145-.196-.194-.198-.511-.004-.707l9.293-9.379c.475-.475.734-1.103.734-1.77s-.26-1.295-.732-1.768L5.973.852c-.194-.196-.192-.513.004-.707.195-.195.513-.191.707.004l9.293,9.379c.659.659,1.023,1.538,1.023,2.473Z"/>
</svg>
);

const HeroBanner = () => {
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const slidesBg = document.querySelectorAll(".ar-hero-bg");
          slidesBg.forEach((bg) => {
            bg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="ar-hero">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        slidesPerView={1}
        loop
        speed={1200}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          el: ".ar-hero-pagination",
          // Render custom bullet style if needed
          renderBullet: (index, className) => {
            return `<span class="${className}"></span>`;
          }
        }}
        navigation={{
          nextEl: ".ar-hero-next",
          prevEl: ".ar-hero-prev",
        }}
        className="ar-hero-swiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="ar-hero-slide">
              <div className="ar-hero-bg" style={{ backgroundImage: `url(${slide.image})` }} />
              <div className="ar-hero-overlay" />
              <div className="ar-hero-content">
                <h1>{slide.title}</h1>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* --- Updated Navigation with Custom Icons --- */}
      <div className="ar-hero-nav">
        <button className="ar-hero-prev">
          <PrevIcon />
        </button>
        <button className="ar-hero-next">
          <NextIcon />
        </button>
      </div>

      <div className="ar-hero-pagination" />
    </section>
  );
};

export default HeroBanner;