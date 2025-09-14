import { useEffect, useState, useCallback, useRef } from "react";
import { useAuthStore } from "../../store";
import { useOrderStore } from "../../store/useOrderStore";
import { Role } from "../../interfaces/IRegister";
import { OrderStatus } from "../../interfaces/IOrder";
import { Button } from "../../components/ui/Buttons/Button";
import Input from "../../components/ui/Inputs/Input";
import "./Orders.scss";
import { OrderItem } from "./OrderItem";



// Дебаунс хук
const useDebounce = (value: string, delay: number) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

const Orders = () => {
  const { user } = useAuthStore();
  const { orders, loading, fetchOrders, updateOrderStatus, error } = useOrderStore();
  const [orderIdFilter, setOrderIdFilter] = useState("");
  const [dateFromFilter, setDateFromFilter] = useState("");
  const [dateToFilter, setDateToFilter] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  const orderIdInputRef = useRef<HTMLInputElement>(null);
  const dateFromInputRef = useRef<HTMLInputElement>(null);
  const dateToInputRef = useRef<HTMLInputElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const clearButtonRef = useRef<HTMLButtonElement>(null);

  const [activeElementType, setActiveElementType] = useState<string | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  const isAdmin = user?.role === Role.ADMIN;
  const debouncedOrderId = useDebounce(orderIdFilter, 1000);

  // Фокус
  const saveFocus = () => {
    const active = document.activeElement;
    if (active === orderIdInputRef.current) setActiveElementType("orderId");
    else if (active === dateFromInputRef.current) setActiveElementType("dateFrom");
    else if (active === dateToInputRef.current) setActiveElementType("dateTo");
    else if (active === filterButtonRef.current) setActiveElementType("filterButton");
    else if (active === clearButtonRef.current) setActiveElementType("clearButton");
    else setActiveElementType(null);
  };

  const restoreFocus = useCallback(() => {
    if (!activeElementType) return;
    setTimeout(() => {
      switch (activeElementType) {
        case "orderId":
          orderIdInputRef.current?.focus();
          orderIdInputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
          break;
        case "dateFrom":
          dateFromInputRef.current?.focus();
          break;
        case "dateTo":
          dateToInputRef.current?.focus();
          break;
        case "filterButton":
          filterButtonRef.current?.focus();
          break;
        case "clearButton":
          clearButtonRef.current?.focus();
          break;
      }
      setActiveElementType(null);
    }, 50);
  }, [activeElementType, cursorPosition]);

  const loadOrders = useCallback(() => {
    if (!user) return;
    saveFocus();
    const filters = {
      orderId: debouncedOrderId ? +debouncedOrderId : undefined,
      dateFrom: dateFromFilter || undefined,
      dateTo: dateToFilter || undefined
    };
    fetchOrders(isAdmin, filters, page, limit);
  }, [user, debouncedOrderId, dateFromFilter, dateToFilter, page, limit, fetchOrders, isAdmin]);

  useEffect(() => loadOrders(), [loadOrders]);
  useEffect(() => { if (!loading) restoreFocus(); }, [loading, restoreFocus]);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await updateOrderStatus(orderId, newStatus);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleClearFilters = () => {
    setActiveElementType("clearButton");
    setOrderIdFilter("");
    setDateFromFilter("");
    setDateToFilter("");
    setPage(1);
  };

  return (
    <div className="orders-container">
      <h1>{isAdmin ? "Всі замовлення" : "Мої замовлення"}</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="filters  boxLine">
        <Input
          ref={orderIdInputRef}
          type="number"
          label="Номер замовлення"
          placeholder="Номер замовлення"
          value={orderIdFilter}
          onChange={(e) => { setCursorPosition(e.target.selectionStart || 0); setOrderIdFilter(e.target.value); }}
          onFocus={() => setActiveElementType("orderId")}
        />
        <Input
          ref={dateFromInputRef}
          type="date"
          label="Дата від"
          value={dateFromFilter}
          onChange={(e) => setDateFromFilter(e.target.value)}
          onFocus={() => setActiveElementType("dateFrom")}
        />
        <Input
          ref={dateToInputRef}
          type="date"
          label="Дата до"
          value={dateToFilter}
          onChange={(e) => setDateToFilter(e.target.value)}
          onFocus={() => setActiveElementType("dateTo")}
        />
        <div className="boxLine">
          <Button ref={filterButtonRef} onClick={loadOrders} variant="link">Фільтрувати</Button>
          <Button ref={clearButtonRef} onClick={handleClearFilters} variant="secondary">Очистити</Button>
        </div>
      </div>

      {debouncedOrderId !== orderIdFilter && <div className="search-indicator">Пошук замовлення #{orderIdFilter}...</div>}

      <ul className="orders-list">
        {orders.length ? orders.map(order => (
          <OrderItem
            key={order.id}
            order={order} // це IOrderResponse
            isAdmin={isAdmin}
            updatingOrderId={updatingOrderId}
            onStatusChange={handleStatusChange}
          />
        )) : <li>Немає замовлень</li>}

      </ul>

      <div className="pagination">
        <Button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} variant="link">Попередня</Button>
        <span>Сторінка {page}</span>
        <Button onClick={() => setPage(p => p + 1)} disabled={orders.length < limit} variant="link">Наступна</Button>
      </div>

      {loading && !updatingOrderId && <div className="loading">Завантаження...</div>}
    </div>
  );
};

export default Orders;
