import { useEffect } from "react";
import { Button } from "../../../components/ui/Buttons/Button";
import { useProductStore } from "../../../store";
import Card from "../../products/Card";
import type { IProduct } from "../../../interfaces/IProduct";

const Dashboard = () => {
  const { products, fetchProducts } = useProductStore();
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  console.log(products);

  const handleDelete = (product: IProduct) => {
    if (window.confirm(`Are you sure you want to delete product ${product.translations && product.translations[0].name}?`)) {
      useProductStore.getState().deleteProduct(product.id);
      console.log(`Deleting product with id: ${product.translations && product.translations[0].name}`);
      // Тут має бути виклик до API для видалення продукту
      // Наприклад: await deleteProduct(id);
    }

    // Логіка видалення продукту    
  }
  return (
    <div>Dashboard

      <h1>Dashboard</h1>
      <p>Total Products: {products.length}</p>
      <ul>
        {products && products.map(product => (
          <div>
            <Card key={product.id} product={product} />
            <Button onClick={() => handleDelete(product)} title="Видалити"/ >
          </div>
        ))}
      </ul>
    </div>
  )
}

export default Dashboard