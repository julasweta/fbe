import Product from "../modules/products/Product"
import styles from "./pages.module.scss";


function ProductPage() {

  const productId = window.location.pathname.split("/").pop();
  if (!productId) {
    return <div>Продукт не знайдено</div>;
  } 
  return (
    <div className={styles.page}>
      <Product productId={productId} />
    </div>
  )
}

export default ProductPage