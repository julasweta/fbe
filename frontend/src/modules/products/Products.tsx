import React from "react";
import Product from "./Product";
import styles from "./Products.module.scss";

interface ProductType {
  id: number;
  price: number;
  priceSale: number;
  images: { id: number; url: string; altText?: string }[];
  translation: { name: string; description?: string };
}

interface ProductsProps {
  products: ProductType[];
}

const Products: React.FC<ProductsProps> = ({ products }) => {
  return (
    <div className={styles.productsGrid}>
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  );
};

export default Products;
