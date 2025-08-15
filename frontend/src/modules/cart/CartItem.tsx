import { Button } from "../../components/ui/Buttons/Button";
import Input from "../../components/ui/Inputs/Input";
import styles from "./CartItem.module.scss";
import type { ICartItem } from '../../interfaces/ICartItem';

interface CartItemProps {
  item: ICartItem;
  price: number;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
}

const CartItem = ({ item, price, updateQuantity, removeItem }: CartItemProps) => {
  return (
    <div className={styles.cartItem}>
      <img src={item.image} alt={item.name} className={styles.image} />
      <div className={styles.info}>
        <h2>{item.name}</h2>
        <p>Колір: {item.color}</p>
        <p>Розмір: {item.size}</p>
        <p>Ціна: ₴{price.toFixed(2)}</p>
        <div className={styles.quantity}>
          <Button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</Button>
          <Input
            type="number"
            min="1"
            max="99"
            value={item.quantity}
            onChange={e => updateQuantity(item.productId, Number(e.target.value))}
          />
          <Button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</Button>
        </div>
        <Button className={styles.remove} onClick={() => removeItem(item.productId)}>
          Видалити
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
