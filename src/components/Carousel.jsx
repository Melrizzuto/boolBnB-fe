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
                        1600: { slidesPerView: 3, spaceBetween: 40 },

                        // Desktop standard (1280px - 1599px)
                        1280: { slidesPerView: 3, spaceBetween: 35 },

                        // Laptop medio-grande (1200px - 1279px) 🔹 CORRETTO
                        1200: { slidesPerView: 2, spaceBetween: 30 }, // Aumento spazio tra le card

                        // Laptop e schermi medi (1024px - 1199px)
                        1024: { slidesPerView: 2, spaceBetween: 25 }, // Più spazio per evitare sovrapposizioni

                        // Tablet grandi (900px - 1023px)
                        900: { slidesPerView: 2, spaceBetween: 22 },

                        // Tablet piccoli (768px - 899px) 🔹 CORRETTO
                        768: { slidesPerView: 1, spaceBetween: 20 }, // Da 1.5 a 1 per evitare sovrapposizioni

                        // Smartphone grandi (600px - 767px)
                        600: { slidesPerView: 1.2, spaceBetween: 18 },

                        // Galaxy S20 (viewport ~412px)
                        412: { slidesPerView: 1.1, spaceBetween: 14 },

                        // Smartphone medi (480px - 599px)
                        480: { slidesPerView: 1, spaceBetween: 14 },

                        // Smartphone piccoli (360px - 479px)
                        360: { slidesPerView: 1, spaceBetween: 12 },

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
