import { useEffect, useState, useCallback, useRef } from "react";
import { useAuthStore } from "../../store";
import { useOrderStore } from "../../store/useOrderStore";
import { Role } from "../../interfaces/IRegister";
import "./Orders.scss";
import { Button } from "../../components/ui/Buttons/Button";
import Input from "../../components/ui/Inputs/Input";
import { OrderStatus } from "../../interfaces/IOrder";
import { Select } from "../../components/ui/Select/Select";

// Переклади статусів
const statusTranslations = {
  [OrderStatus.PENDING]: "Очікує обробки",
  [OrderStatus.PROCESSING]: "В обробці",
  [OrderStatus.COMPLETED]: "Виконано",
  [OrderStatus.CANCELED]: "Скасовано"
};

// Хук для debounce
const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Orders = () => {
  const { user } = useAuthStore();
  const { orders, loading, fetchOrders, updateOrderStatus, error } = useOrderStore();
  const [showAll] = useState(user?.role === Role.ADMIN);
  const [orderIdFilter, setOrderIdFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  // Refs для збереження фокусу
  const orderIdInputRef = useRef<HTMLInputElement>(null);
  const dateFromInputRef = useRef<HTMLInputElement>(null);
  const dateToInputRef = useRef<HTMLInputElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);

  // Стан для відстеження активного елемента
  const [activeElementType, setActiveElementType] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const isAdmin = user?.role === Role.ADMIN;

  // Використовуємо debounce для номера замовлення (затримка 1000мс)
  const debouncedOrderId = useDebounce(orderIdFilter, 1000);

  // Формуємо опції для Select компонента
  const statusOptions = Object.values(OrderStatus).map(status => ({
    value: status,
    label: statusTranslations[status]
  }));

  // Функція для збереження поточного фокусу
  const saveFocusState = () => {
    const activeElement = document.activeElement as HTMLElement;

    if (activeElement === orderIdInputRef.current) {
      setActiveElementType('orderId');
      setCursorPosition(orderIdInputRef.current?.selectionStart || 0);
    } else if (activeElement === dateFromInputRef.current) {
      setActiveElementType('dateFrom');
    } else if (activeElement === dateToInputRef.current) {
      setActiveElementType('dateTo');
    } else if (activeElement === filterButtonRef.current) {
      setActiveElementType('filterButton');
    } else if (activeElement === clearButtonRef.current) {
      setActiveElementType('clearButton');
    } else {
      setActiveElementType(null);
    }
  };

  // Функція для відновлення фокусу
  const restoreFocus = useCallback(() => {
    if (!activeElementType) return;

    setTimeout(() => {
      switch (activeElementType) {
        case 'orderId':
          orderIdInputRef.current?.focus();
          if (orderIdInputRef.current) {
            orderIdInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
          }
          break;
        case 'dateFrom':
          dateFromInputRef.current?.focus();
          break;
        case 'dateTo':
          dateToInputRef.current?.focus();
          break;
        case 'filterButton':
          filterButtonRef.current?.focus();
          break;
        case 'clearButton':
          clearButtonRef.current?.focus();
          break;
      }
      setActiveElementType(null);
    }, 100);
  }, [activeElementType, cursorPosition]);

  // Функція для отримання замовлень
  const loadOrders = useCallback(() => {
    if (!user) return;

    // Зберігаємо фокус перед запитом
    saveFocusState();

    const filters = {
      orderId: debouncedOrderId ? +debouncedOrderId : undefined,
      dateFrom: dateFromFilter,
      dateTo: dateToFilter,
    };

    if (user && user.id) {
      const showAllOrders = user.role === Role.ADMIN;
      fetchOrders(showAllOrders, filters, page, limit);
    }
  }, [user, debouncedOrderId, dateFromFilter, dateToFilter, page, limit, fetchOrders]);

  // Початкове завантаження
  useEffect(() => {
    if (!user) return;

    const filters = {
      orderId: debouncedOrderId ? +debouncedOrderId : undefined,
      dateFrom: dateFromFilter,
      dateTo: dateToFilter,
    };

    if (user && user.id) {
      const showAllOrders = user.role === Role.ADMIN;
      fetchOrders(showAllOrders, filters, page, limit);
    }
  }, [user, page, limit, fetchOrders]);

  // Завантаження при зміні фільтрів (з debounce)
  useEffect(() => {
    if (!user) return;

    saveFocusState();

    const filters = {
      orderId: debouncedOrderId ? +debouncedOrderId : undefined,
      dateFrom: dateFromFilter,
      dateTo: dateToFilter,
    };

    if (user && user.id) {
      const showAllOrders = user.role === Role.ADMIN;
      fetchOrders(showAllOrders, filters, page, limit);
    }
  }, [debouncedOrderId, dateFromFilter, dateToFilter]);

  // Відновлення фокусу після завантаження
  useEffect(() => {
    if (!loading && activeElementType) {
      restoreFocus();
    }
  }, [loading, restoreFocus]);

  // Окрема функція для ручного фільтрування (коли натискають кнопку)
  const handleFilter = () => {
    setActiveElementType('filterButton');
    setPage(1);
    const filters = {
      orderId: orderIdFilter ? +orderIdFilter : undefined,
      dateFrom: dateFromFilter,
      dateTo: dateToFilter,
    };

    if (user && user.id) {
      const showAllOrders = user.role === Role.ADMIN;
      fetchOrders(showAllOrders, filters, page, limit);
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error('Помилка при оновленні статусу:', error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Функція для очищення фільтрів
  const handleClearFilters = () => {
    setActiveElementType('clearButton');
    setOrderIdFilter("");
    setDateFromFilter("");
    setDateToFilter("");
    setPage(1);
  };

  // Обробники для відстеження фокусу на полях
  const handleOrderIdFocus = () => {
    setActiveElementType('orderId');
  };

  const handleOrderIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCursorPosition(e.target.selectionStart || 0);
    setOrderIdFilter(e.target.value);
  };

  if (loading && !updatingOrderId) return <div className="loading">Завантаження...</div>;

  return (
    <div className="orders-container">
      <h1 className="orders-title">
        {isAdmin ? "Всі замовлення" : "Мої замовлення"}
      </h1>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="filters">
        <Input
          ref={orderIdInputRef}
          type="number"
          placeholder="Номер замовлення"
          value={orderIdFilter}
          onChange={handleOrderIdChange}
          onFocus={handleOrderIdFocus}
          label="Номер замовлення"
        />
        <Input
          ref={dateFromInputRef}
          type="date"
          value={dateFromFilter}
          onChange={(e) => setDateFromFilter(e.target.value)}
          onFocus={() => setActiveElementType('dateFrom')}
          label="Дата від"
        />
        <Input
          ref={dateToInputRef}
          type="date"
          value={dateToFilter}
          onChange={(e) => setDateToFilter(e.target.value)}
          onFocus={() => setActiveElementType('dateTo')}
          label="Дата до"
        />
        <div className="boxLine">
          <Button
            ref={filterButtonRef}
            onClick={handleFilter}
            variant="link"
          >
            Фільтрувати
          </Button>
          <Button
            ref={clearButtonRef}
            onClick={handleClearFilters}
            variant="secondary"
          >
            Очистити
          </Button>
        </div>
      </div>

      {/* Індикатор того, що відбувається пошук */}
      {debouncedOrderId !== orderIdFilter && (
        <div className="search-indicator">
          Пошук замовлення #{orderIdFilter}...
        </div>
      )}

      <ul className="orders-list">
        {orders.length ? (
          orders.map((order) => (
            <li key={order.id} className="order-item">
              <div className="order-header-section">
                <h3 className="order-header">
                  Замовлення #{order.id} —{" "}
                  {new Date(order.createdAt).toLocaleDateString("uk-UA", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </h3>

                <div className="order-status-section">
                  <p className="order-status">
                    Статус:
                    {isAdmin ? (
                      <div className="status-select-wrapper">
                        <Select
                          options={statusOptions}
                          value={order.status}
                          onChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                          disabled={updatingOrderId === order.id}
                        />
                      </div>
                    ) : (
                      <span className={`status-badge status-${order.status.toLowerCase()}`}>
                        {statusTranslations[order.status] || order.status}
                      </span>
                    )}
                    {updatingOrderId === order.id && (
                      <span className="updating-status">Оновлюється...</span>
                    )}
                  </p>
                </div>
              </div>

              <p className="order-details">
                {order.guestName && <span>Ім'я: {order.guestName}</span>}
                {order.guestPhone && <span>, Телефон: {order.guestPhone}</span>}
                {order.guestEmail && <span>, Email: {order.guestEmail}</span>}
              </p>

              {order.novaPostCity && order.novaPostBranch && (
                <p className="order-delivery">
                  Доставка: Нова Пошта, {order.novaPostCity}, Відділення №
                  {order.novaPostBranch}
                </p>
              )}

              <p className="order-payment">
                Оплата: {order.paymentMethod === "COD" ? "Накладений платіж" : order.paymentMethod}
              </p>

              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.id} className="order-item-details">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="item-image"
                    />
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-specs">
                        {item.color && <span>Колір: {item.color}</span>}
                        {item.size && <span>, Розмір: {item.size}</span>}
                      </span>
                      <span className="item-quantity">
                        Кількість: {item.quantity}
                      </span>
                      <span className="item-price">
                        {item.priceSale ? (
                          <>
                            <span className="price-old">{item.price}₴</span>
                            <span className="price-sale">{item.priceSale}₴</span>
                          </>
                        ) : (
                          <span>{item.finalPrice}₴</span>
                        )}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <p className="order-total">
                Загальна сума: {order.items.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0)}₴
              </p>
            </li>
          ))
        ) : (
          <li className="no-orders">Немає замовлень</li>
        )}
      </ul>

      <div className="pagination">
        <Button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          variant="link"
        >
          Попередня
        </Button>
        <span>Сторінка {page}</span>
        <Button
          onClick={() => setPage((prev) => prev + 1)}
          disabled={orders.length < limit}
          variant="link"
        >
          Наступна
        </Button>
      </div>
    </div>
  );
};

export default Orders;