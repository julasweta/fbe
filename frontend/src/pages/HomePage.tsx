
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
// Import Swiper styles
import 'swiper/css';
import "swiper/css/navigation";
import Card from "../modules/products/Card";
import { useProductStore } from "../store";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/Buttons/Button";
import CategoryCarusel from "../components/Category/CategoryCarusel";


const HomePage = () => {
  const { products, fetchProducts } = useProductStore();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const loadProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
          await fetchProducts(); 
          console.log("Products loaded successfully from store");
        } catch (err) {
          console.error("Failed to load products:", err);
          setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
          setIsLoading(false);
        }
      };
  
      loadProducts();
    }, [fetchProducts]); 
  

  if (isLoading) {
    return (
      <div >
        <h2>Продукти</h2>
        <div >
          <p>Завантаження продуктів...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Продукти</h2>
        <div>
          <p>Помилка завантаження: {error}</p>
          <Button
            onClick={() => window.location.reload()}
            
          >
            Спробувати знову
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="pages">
      <div style={{ padding: "20px 0" }}>
        <Swiper
          modules={[Navigation]}
          spaceBetween={16} // відстань між карточками
          slidesPerView="auto" // автоматично по ширині
          navigation
          style={{ paddingBottom: "20px" }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} style={{ width: "250px" }}>
              <Card product={product} isMainPage={true} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <CategoryCarusel/>
    </div>
  )
}

export default HomePage