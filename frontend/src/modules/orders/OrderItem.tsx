import React, { useState } from "react";
import { OrderStatus, type IOrderResponse } from "../../interfaces/IOrder";
import { Select } from "../../components/ui/Select/Select";
import { orderService } from "../../services/OrderService";
import { TrackingInfo } from "./TrackingInfo";

interface OrderItemProps {
  order: IOrderResponse;
  isAdmin: boolean;
  updatingOrderId: number | null;
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
}

const statusTranslations = {
  [OrderStatus.PENDING]: "Очікує обробки",
  [OrderStatus.PROCESSING]: "В обробці",
  [OrderStatus.COMPLETED]: "Виконано",
  [OrderStatus.CANCELED]: "Скасовано",
};

export const OrderItem: React.FC<OrderItemProps> = ({
  order,
  isAdmin,
  updatingOrderId,
  onStatusChange,
}) => {
  const statusOptions = Object.values(OrderStatus).map((status) => ({
    value: status,
    label: statusTranslations[status],
  }));

  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");

  const handleSaveTracking = () => {
    if (trackingNumber) {
      orderService.updateOrderItemTracking(order.id, trackingNumber);
    }
  };

  return (
    <li className="order-item">
      <div className="order-header-section">
        <h3>
          Замовлення #{order.id} —{" "}
          {new Date(order.createdAt).toLocaleDateString("uk-UA")}
        </h3>
        <div className="order-status-section">
          {isAdmin ? (
            <Select
              options={statusOptions}
              value={order.status}
              onChange={(v) => onStatusChange(order.id, v as OrderStatus)}
              disabled={updatingOrderId === order.id}
            />
          ) : (
            <span className={`status-badge status-${order.status.toLowerCase()}`}>
              {statusTranslations[order.status]}
            </span>
          )}
          {updatingOrderId === order.id && (
            <span className="updating-status">Оновлюється...</span>
          )}
        </div>
      </div>

      <p className="order-details">
        {order.guestName && <>Ім'я: {order.guestName}</>}
        {order.guestPhone && <>, Телефон: {order.guestPhone}</>}
        {order.guestEmail && <>, Email: {order.guestEmail}</>}
      </p>

      {order.novaPostCity && order.novaPostBranch && (
        <p>
          Доставка: Нова Пошта, {order.novaPostCity}, Відділення №
          {order.novaPostBranch}
        </p>
      )}

      <p>
        Оплата:{" "}
        {order.paymentMethod === "COD"
          ? "Накладений платіж"
          : order.paymentMethod}
      </p>

      {/* Блок для номера посилки */}
      <div className="order-tracking-section">
        {isAdmin ? (
          <div className="tracking-field">
            <input
              type="text"
              placeholder="Номер посилки"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
            />
            <button type="button" onClick={handleSaveTracking}>
              Зберегти
            </button>
          </div>
        ) : (
          order.trackingNumber && (
            <p>Номер посилки: {order.trackingNumber}</p>
          )
        )}

        {order.trackingNumber && (
          <div className="tracking-popover-wrapper">
            <div className="tracking-trigger">
              Номер посилки: {order.trackingNumber}
            </div>

            <div className="tracking-popover">
              <TrackingInfo trackingNumber={order.trackingNumber} />
            </div>
          </div>
        )}

      </div>

      <ul className="order-items">
        {order.items.map((item) => (
          <li key={item.id} className="order-item-row">
            <img src={item.image || ""} alt={item.name} className="item-image" />
            <div>
              <span>{item.name}</span>
              {item.color && <span>, Колір: {item.color}</span>}
              {item.size && <span>, Розмір: {item.size}</span>}
              <span>, Кількість: {item.quantity}</span>
              <span>
                , Ціна:{" "}
                {item.priceSale ? (
                  <>
                    <span className="price-old">{item.price}₴</span>{" "}
                    <span className="price-sale">{item.priceSale}₴</span>
                  </>
                ) : (
                  <>{item.finalPrice}₴</>
                )}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <p>
        Загальна сума:{" "}
        {order.items.reduce((sum, i) => sum + i.finalPrice * i.quantity, 0)}₴
      </p>
    </li>
  );
};

