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
                <button className={`${style.navButton} prev`} id="prevBtn">
                    <FontAwesomeIcon icon={faChevronLeft} size="2x" color="black" />
                </button>
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
                        1280: { slidesPerView: 3, spaceBetween: 20 },
                        1024: { slidesPerView: 2, spaceBetween: 16 },
                        768: { slidesPerView: 1, spaceBetween: 12 },
                    }}
                >
                    {properties.map((property) => (
                        <SwiperSlide key={property.id} className={style.carouselItem}>
                            <Card property={property} slug={property.slug} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                <button className={`${style.navButton} next`} id="nextBtn">
                    <FontAwesomeIcon icon={faChevronRight} size="2x" color="black" />
                </button>

            </div>
        </div>
    );
};

export default Carousel;
