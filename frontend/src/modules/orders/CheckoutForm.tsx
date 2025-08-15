import React from "react";
import styles from "./CheckoutForm.module.scss";

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  novaPoshtaBranch: string;
}

interface CheckoutFormProps {
  form: CheckoutFormData;
  setForm: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ form, setForm }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className={styles.form}>
      <input
        type="text"
        name="fullName"
        placeholder="Ім’я та прізвище"
        value={form.fullName}
        onChange={handleChange}
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="Телефон"
        value={form.phone}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        type="text"
        name="city"
        placeholder="Місто"
        value={form.city}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="novaPoshtaBranch"
        placeholder="Відділення Нової Пошти"
        value={form.novaPoshtaBranch}
        onChange={handleChange}
        required
      />
    </div>
  );
};

export default CheckoutForm;
