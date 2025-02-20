import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "bootstrap/dist/css/bootstrap.min.css";
import style from "./Carousel.module.css"; // Stile personalizzato
import Card from "./Card"; // Import del componente Card
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

const Carousel = ({ properties }) => {
    return (
        <div className={style.carouselContainer}>
            <div className={style.navWrapper}>
                {/* Bottone per lo slide precedente */}
                <button className={`${style.navButton} prev`} id="prevBtn">
                    <FontAwesomeIcon icon={faChevronLeft} size="2x" color="black" />
                </button>

                {/* Carosello Swiper */}
                <Swiper className={style.swiper}
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={3}
                    loop={true}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    navigation={{
                        nextEl: "#nextBtn",
                        prevEl: "#prevBtn",
                    }}
                    breakpoints={{
                        // Desktop grande (1600px in su)
                        1600: { slidesPerView: 3, spaceBetween: 50 },

                        // Desktop standard (1280px - 1599px)
                        1280: { slidesPerView: 3, spaceBetween: 40 },

                        // Laptop medio-grande (1200px - 1279px)
                        1200: { slidesPerView: 2, spaceBetween: 40 },

                        // **iPad Pro e schermi medi (1024px - 1199px)**
                        1024: { slidesPerView: 1, spaceBetween: 50 }, // 🔹 1 sola card, più spazio

                        // **iPad Mini (768px - 1023px)**
                        768: { slidesPerView: 1, spaceBetween: 50 }, // 🔹 1 sola card

                        // Smartphone grandi (600px - 767px)
                        600: { slidesPerView: 1, spaceBetween: 30 },

                        // Smartphone medi (480px - 599px)
                        480: { slidesPerView: 1, spaceBetween: 25 },

                        // Smartphone piccoli (360px - 479px)
                        360: { slidesPerView: 1, spaceBetween: 20 },

                        // iPhone 5 e altri smartphone piccoli (320px - 359px)
                        320: { slidesPerView: 1, spaceBetween: 15 }
                    }}




                >
                    {properties.map((property) => (
                        <SwiperSlide key={property.id} className={style.carouselItem}>
                            <Card property={property} slug={property.slug} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Bottone per lo slide successivo */}
                <button className={`${style.navButton} next`} id="nextBtn">
                    <FontAwesomeIcon icon={faChevronRight} size="2x" color="black" />
                </button>
            </div>
        </div>
    );
};

export default Carousel;
