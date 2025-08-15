import Cart from "../modules/cart/Cart"
import styles from "./pages.module.scss"

const CartPage = () => {
  return (
    <div className={styles.page}>
      <Cart />
    </div>
  )
}

export default CartPage