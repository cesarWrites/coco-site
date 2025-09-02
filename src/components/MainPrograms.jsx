// components/ProgramBannerSlider.js
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import Image from 'next/image';
import 'swiper/css';

const bannerImages = [
  { src: 'https://cocomedia.co.ke/wp-content/uploads/2025/03/rauka-na-coco-banner-new-2.png', alt: 'Morning Show' },
  { src: 'https://cocomedia.co.ke/wp-content/uploads/2025/03/rauka-na-coco-banner-new-1.png', alt: 'News Hour' },
  { src: 'https://cocomedia.co.ke/wp-content/uploads/2025/03/rauka-na-coco-banner-new-1.png', alt: 'Evening Drive' },
  { src: 'https://cocomedia.co.ke/wp-content/uploads/2025/03/rauka-na-coco-banner-new-1.png', alt: 'Weekend Vibes' },
];

export default function ProgramBannerSlider() {
  return (
    <div className="program-banner-container">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={20}
        slidesPerView={1}
        autoplay={{ delay: 3000 }}
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
                height={400}
                className="banner-img"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
