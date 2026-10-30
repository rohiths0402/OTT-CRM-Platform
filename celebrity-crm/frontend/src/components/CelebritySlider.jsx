import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import { useReducedMotion } from "framer-motion";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { celebrities } from "../data/mock";

const tints = [
  "from-[#3a2a0b] to-[#14111a]",
  "from-[#1d2b3a] to-[#14111a]",
  "from-[#3a1d2b] to-[#14111a]",
  "from-[#173a33] to-[#14111a]",
  "from-[#2d2147] to-[#14111a]",
  "from-[#3a2a1d] to-[#14111a]",
];

function Slide({ celebrity, index }) {
  const [failed, setFailed] = useState(false);
  const initials = celebrity.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-ink-800 opacity-60 saturate-50 transition duration-500 [.swiper-slide-active_&]:border-gold-400/60 [.swiper-slide-active_&]:opacity-100 [.swiper-slide-active_&]:saturate-100 [.swiper-slide-active_&]:shadow-[0_24px_60px_-20px_rgba(217,162,43,0.55)]">
      {failed ? (
        <div
          className={`grid h-full w-full place-items-center bg-gradient-to-b ${tints[index % tints.length]}`}
        >
          <span className="gold-text font-display text-7xl">{initials}</span>
        </div>
      ) : (
        <img
          src={celebrity.image}
          alt={celebrity.name}
          onError={() => setFailed(true)}
          draggable={false}
          className="h-full w-full object-cover"
        />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent px-5 pb-5 pt-16">
        <p className="font-display text-xl text-ivory">{celebrity.name}</p>
        <p className="mt-0.5 text-xs text-gold-300">{celebrity.role}</p>
      </div>
    </div>
  );
}

export default function CelebritySlider() {
  const reduceMotion = useReducedMotion();

  return (
    <div aria-label="Talent on the platform" className="w-full">
      <Swiper
        modules={[Autoplay, EffectCoverflow, Pagination]}
        effect="coverflow"
        grabCursor
        centeredSlides
        loop
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 140,
          modifier: 2,
          slideShadows: false,
        }}
        autoplay={
          reduceMotion
            ? false
            : {
                delay: 2800,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
        }
        pagination={{ clickable: true }}
        style={{
          "--swiper-pagination-color": "#d9a22b",
          "--swiper-pagination-bullet-inactive-color": "#ffffff",
          "--swiper-pagination-bullet-inactive-opacity": "0.25",
          paddingTop: 16,
          paddingBottom: 48,
        }}
      >
        {celebrities.map((celebrity, index) => (
          <SwiperSlide
            key={celebrity.id}
            style={{
              width: "min(260px, 62vw)",
              height: "clamp(320px, 52vw, 380px)",
            }}
          >
            <Slide celebrity={celebrity} index={index} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
