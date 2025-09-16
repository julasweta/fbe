import React, { useEffect, useState } from "react";
import { novaPoshtaService } from "../../services/NovaPostaService";
import type { INovaPoshtaOrder } from "../../interfaces/INovaPoshtaOrder";

interface TrackingInfoProps {
  trackingNumber: string;
  full?: boolean; // 👈 якщо true – показати всі поля
}

export const TrackingInfo: React.FC<TrackingInfoProps> = ({ trackingNumber, full = false }) => {
  const [tracking, setTracking] = useState<INovaPoshtaOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!trackingNumber) return;

    const fetchTracking = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await novaPoshtaService.getTracking(trackingNumber);
        setTracking(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Не вдалося завантажити інформацію");
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [trackingNumber]);

  if (!trackingNumber) {
    return <p>Номер посилки відсутній</p>;
  }

  if (loading) return <p>Завантаження інформації...</p>;
  if (error) return <p className="error">Помилка: {error}</p>;
  if (!tracking) return <p>Інформація відсутня</p>;

  return (
    <div className="tracking-info">
      <h4>Інформація про відправлення</h4>
      <ul>
        <li><strong>Номер ТТН:</strong> {tracking.Number}</li>
        <li><strong>Статус:</strong> {tracking.Status}</li>
        <li><strong>Дата створення:</strong> {tracking.DateCreated}</li>
        <li><strong>Місто отримувача:</strong> {tracking.CityRecipient}</li>
        <li><strong>Відділення отримувача:</strong> {tracking.WarehouseRecipient}</li>
        <li><strong>Оголошена вартість:</strong> {tracking.DocumentCost} ₴</li>
        <li><strong>Вага:</strong> {tracking.FactualWeight} кг</li>
        {tracking.ScheduledDeliveryDate && (
          <li><strong>Планова дата доставки:</strong> {tracking.ScheduledDeliveryDate}</li>
        )}
      </ul>

      {full && (
        <div className="tracking-details">
          <h5>Детальна інформація:</h5>
          <table>
            <tbody>
              {Object.entries(tracking).map(([key, value]) => (
                <tr key={key}>
                  <td><strong>{key}</strong></td>
                  <td>{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

