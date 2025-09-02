import { useAuthStore } from "../store";
import { useForm } from "react-hook-form";
import { authService } from "../services/AuthService";
import Input from "../components/ui/Inputs/Input";
import { Button } from "../components/ui/Buttons/Button";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { IUser } from "../interfaces/IUser";



const ProfilePage = () => {
  const { user, setUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm<IUser>({
    defaultValues: user ? {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      country: user.country,
      postalCode: user.postalCode,
      dateOfBirth: user.dateOfBirth
        ? user.dateOfBirth.toString().split('T')[0] // <--- тільки дата
        : undefined,
    } : {},
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!user) return <div>Ви не авторизовані</div>;

  const onSubmit = async (data: Partial<IUser>) => {
    try {
      if (user.id) {
        const updatedUser = await authService.updateUser(data, user.id); // реалізуй на фронті
        setUser(updatedUser); // оновлюємо локальний стан
        setSuccessMessage("Профіль оновлено успішно");
        setErrorMessage(null);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Помилка при оновленні профілю");
      setSuccessMessage(null);
    }
  };

  return (
    <div className="page">
      <h2 >Профіль користувача</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <Input
          placeholder="Ім’я"
          id="profile-firstname"
          autoComplete="given-name"
          {...register("first_name", { required: "Ім’я обов'язкове" })}
        />
        {errors.first_name && <p className="error">{errors.first_name.message}</p>}

        <Input
          placeholder="Прізвище"
          id="lastname"
          {...register("last_name", { required: "Прізвище обов'язкове" })}
        />
        {errors.last_name && <p className="error">{errors.last_name.message}</p>}

        <Input
          type="email"
          placeholder="Email"
          autoComplete="email"
        id="profile-email"
          {...register("email", {
            required: "Email обов'язковий",
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Некоректний email" }
          })}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <Input
          placeholder="Телефон"
          autoComplete="tel"
          {...register("phone")}
        />

        <Input
          placeholder="Адреса"
          autoComplete="street-address"
          {...register("address")}
        />

        <Input
          placeholder="Місто"
          autoComplete="address-level2"
          {...register("city")}
        />

        <Input
          placeholder="Країна"
          autoComplete="country"
          {...register("country")}
        />

        <Input
          placeholder="Поштовий індекс"
          autoComplete="postal-code"
          {...register("postalCode")}
        />

        <Input
          type="date"
          placeholder="Дата народження"
          autoComplete="bday"
          {...register("dateOfBirth")}
        />

        {successMessage && <p className="green">{successMessage}</p>}
        {errorMessage && <p className="error">{errorMessage}</p>}

        <Button type="submit">Оновити профіль</Button>
      </form>

      <Link to="/change-password" className="blue hover:underline">
        <Button>Змінити пароль</Button>
      </Link>
    </div>
  );
};

export default ProfilePage;

