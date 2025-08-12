import Product from "../modules/products/Product"


function ProductPage() {

  const productId = window.location.pathname.split("/").pop();
  if (!productId) {
    return <div>Продукт не знайдено</div>;
  } 
  return (
    <div><Product productId={productId } /></div>
  )
}

export default ProductPage