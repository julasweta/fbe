import React from "react";
import { useForm } from "react-hook-form";
import styles from "./RegisterForm.module.scss";
import type { IUser } from "../../interfaces/IUser";
import Input from "../../components/ui/Inputs/Input";
import { authService } from "../../services/AuthService";

const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    setError,
  } = useForm<IUser>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
      dateOfBirth: "",
    },
  });

  const onSubmit = async (data: IUser) => {
    try {
      await authService.register(data);
      reset();
    } catch (err: any) {
      setError("email", {
        type: "server",
        message: err.response?.data?.message || "Помилка при реєстрації",
      });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2>Реєстрація користувача</h2>

      <div className={styles.row}>
        <Input
          type="text"
          placeholder="Ім'я"
          {...register("first_name", { required: "Ім'я обов'язкове" })}
        />
        {errors.first_name && <p className={styles.error}>{errors.first_name.message}</p>}

        <Input
          type="text"
          placeholder="Прізвище"
          {...register("last_name", { required: "Прізвище обов'язкове" })}
        />
        {errors.last_name && <p className={styles.error}>{errors.last_name.message}</p>}
      </div>

      <Input
        type="email"
        placeholder="Email"
        {...register("email", {
          required: "Email обов'язковий",
          pattern: { value: /\S+@\S+\.\S+/, message: "Некоректний email" },
        })}
      />
      {errors.email && <p className={styles.error}>{errors.email.message}</p>}

      <Input
        type="password"
        placeholder="Пароль"
        {...register("password", { required: "Пароль обов'язковий" })}
      />
      {errors.password && <p className={styles.error}>{errors.password.message}</p>}

      <Input type="tel" placeholder="Телефон" {...register("phone")} />

      <Input type="text" placeholder="Адреса" {...register("address")} />

      <div className={styles.row}>
        <Input type="text" placeholder="Місто" {...register("city")} />
        <Input type="text" placeholder="Країна" {...register("country")} />
      </div>

      <div className={styles.row}>
        <Input type="text" placeholder="Поштовий індекс" {...register("postalCode")} />
        <Input type="date" {...register("dateOfBirth")} />
      </div>

      {isSubmitSuccessful && (
        <p className={styles.success}>Реєстрація успішна!</p>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Реєстрація..." : "Зареєструватися"}
      </button>
    </form>
  );
};

export default RegisterForm;

