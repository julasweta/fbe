import React from "react";
import { useForm } from "react-hook-form";
import styles from "./RegisterForm.module.scss";
import type { IUser } from "../../interfaces/IUser";
import Input from "../../components/ui/Inputs/Input";
import { authService } from "../../services/AuthService";
import { Button } from "../../components/ui/Buttons/Button";

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
      console.log("RegisterForm: Error during registration:", err);
      setError("email", {
        type: "server",
        message: err.response?.data?.error.message || "Помилка при реєстрації",
      });
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2>Реєстрація користувача</h2>

      <div className={styles.row}>
        <Input
          type="text"
          placeholder="Ім'я *"
          {...register("first_name", { required: "Ім'я обов'язкове" })}
        />
        {errors.first_name && <p className={styles.error}>{errors.first_name.message}</p>}

        <Input
          type="text"
          placeholder="Прізвище *"
          {...register("last_name", { required: "Прізвище обов'язкове" })}
        />
        {errors.last_name && <p className={styles.error}>{errors.last_name.message}</p>}
      </div>

      <Input
        type="email"
        placeholder="Email *"
        {...register("email", {
          required: "Email обов'язковий",
          pattern: { value: /\S+@\S+\.\S+/, message: "Некоректний email" },
        })}
      />
      {errors.email && <p className={styles.error}>{errors.email.message}</p>}

      <Input
        type="password"
        placeholder="Пароль *"
        {...register("password", {
          required: "Пароль обов'язковий",
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
            message: "Пароль має містити мін. 8 символів, 1 велику і 1 малу літеру"
          }
        })}
      />
      {errors.password && <p className={styles.error}>{errors.password.message}</p>}


      <Input type="tel" placeholder="Телефон *" {...register("phone", {
        required: "Телефон обов'язковий",
        pattern: { value: /^\+?[0-9\s\-()]+$/, message: "Некоректний номер телефону" },
      })} />

      <Input type="text" placeholder="Адреса" {...register("address")} />

      <div className={styles.row}>
        <Input type="text" placeholder="Місто" {...register("city")} />
        <Input type="text" placeholder="Країна" {...register("country")} />
      </div>

      <div className={styles.row}>
        <Input type="text" placeholder="Поштовий індекс" {...register("postalCode")} />
       
      </div>
      <span >Дата народження  <br></br>
        <Input type="date" placeholder="Дата народження" {...register("dateOfBirth")} /></span>

      {isSubmitSuccessful && (
        <p className={styles.success}>Реєстрація успішна! Перейдіть на сторінку авторизації</p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Реєстрація..." : "Зареєструватися"}
      </Button>
    </form>
  );
};

export default RegisterForm;

