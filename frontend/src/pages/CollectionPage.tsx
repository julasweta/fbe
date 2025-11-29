
import { useParams } from "react-router-dom";
import styles from "./pages.module.scss";
import Products from "../modules/products/Products";

const CollectionPage = () => {
  const { collectionSlug } = useParams<{ collectionSlug: string }>();

  return (
    <div className={styles.page}>
      <h2>{collectionSlug?.toUpperCase()}</h2>
      <Products collectionSlug={collectionSlug} />
    </div>
  );
};

export default CollectionPage;