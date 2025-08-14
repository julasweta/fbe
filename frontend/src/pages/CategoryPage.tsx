
import { useParams } from "react-router-dom";
import styles from "./pages.module.scss";
import Products from "../modules/products/Products";

const CategoryPage = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  return (
    <div className={styles.page}>
      <h2>{categorySlug?.toUpperCase()}</h2>
      <Products categorySlug={ categorySlug} />
    </div>
  );
};

export default CategoryPage;
