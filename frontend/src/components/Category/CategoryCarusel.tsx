import { Swiper, SwiperSlide } from "swiper/react";
import { useCategoryStore } from "../../store/useCategoryStore";
import { Navigation, EffectCoverflow } from "swiper/modules";
import styles from "./Category.module.scss";
import 'swiper/css';
import "swiper/css/navigation";
import { Link } from "react-router-dom";

const CategoryCarusel = () => {
  const { categories } = useCategoryStore();

  return (
    <div className={styles.caruselBox}>
      <h2>Обирайте за категорією</h2>
      <Swiper
        effect={'coverflow'}
        grabCursor={true}
        pagination={true}
       
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        modules={[Navigation, EffectCoverflow]}
        spaceBetween={16}
        navigation={{
          enabled: true,   // завжди ввімкнено
          hideOnClick: false, // не ховати при кліку
        }}
        watchOverflow={false} // не відключати навігацію при малої кількості слайдів
        breakpoints={{
          320: { slidesPerView: 1 },
          480: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView:4 },
        }}
      >
        {categories.filter(cat => cat.parentId === null).map((category) => (
          <SwiperSlide key={category.id} className={styles.wrapper} >
            <Link to={`/category/${category.slug}`}>
              <div className={styles.categoryBox}>
                <h3>{category.name}</h3>
                <div className={styles.imgBox}>
                  <img src={category.imageUrl} alt={category.name} />
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  )
}

export default CategoryCarusel