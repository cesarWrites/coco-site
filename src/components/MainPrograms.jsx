// components/ProgramBannerSlider.js
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';

const bannerImages = [
  { src: 'https://backend.cocomedia.co.ke/wp-content/uploads/2026/04/COCO ASUBUHI.jpeg', alt: 'Morning Show' },
  { src: 'https://backend.cocomedia.co.ke/wp-content/uploads/2026/04/RHUMBA.jpeg', alt: 'RHUMBA' },
  { src: 'https://backend.cocomedia.co.ke/wp-content/uploads/2026/04/COCO SHAMBANI.jpeg', alt: 'News Hour' },
  { src: 'https://backend.cocomedia.co.ke/wp-content/uploads/2026/04/JUNGU.jpeg', alt: 'Evening Drive' },
  { src: 'https://backend.cocomedia.co.ke/wp-content/uploads/2026/04/KIPENGA.jpeg', alt: 'News Hour' },
  { src: 'https://backend.cocomedia.co.ke/wp-content/uploads/2026/04/MSERENGO.jpeg', alt: 'Weekend Vibes' },
  { src: 'https://backend.cocomedia.co.ke/wp-content/uploads/2026/04/REGGAE.jpeg', alt: 'News Hour' },
];

export default function ProgramBannerSlider() {
  return (
    <div className="program-banner-container">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{ delay: 5000 }}
        loop
        breakpoints={{
          768: {
            slidesPerView: 2,
          },
        }}
      >
        {bannerImages.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="program-banner-slide">
              <img
                src={img.src}
                alt={img.alt}
                // width={800}
                // height={800}
                className="banner-img"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
