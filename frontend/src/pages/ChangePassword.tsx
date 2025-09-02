import { useForm } from "react-hook-form";
import { useState } from "react";
import { authService } from "../services/AuthService";
import Input from "../components/ui/Inputs/Input";
import { Button } from "../components/ui/Buttons/Button";

interface IChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const { register, handleSubmit,  formState: { errors } } = useForm<IChangePasswordForm>();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  console.log('error', errorMessage);

  const onSubmit = async (data: IChangePasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      setErrorMessage("Новий пароль і підтвердження не збігаються");
      return;
    }

    try {
      await authService.changePassword(data.currentPassword, data.newPassword);
      setSuccessMessage("Пароль успішно змінено");
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err.message || "Помилка при зміні пароля");
      setSuccessMessage(null);
    }
  };

  return (
    <div className="page">
      <h2>Зміна пароля</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <Input
          type="password"
          placeholder="Поточний пароль"
          {...register("currentPassword", { required: "Поточний пароль обов'язковий" })}
        />
        {errors.currentPassword && <p className="error">{errors.currentPassword.message}</p>}

        <Input
          type="password"
          placeholder="Новий пароль"
          {...register("newPassword", {
            required: "Новий пароль обов'язковий",
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
              message: "Мін. 8 символів, 1 велика і 1 мала літера"
            }
          })}
        />
        {errors.newPassword && <p className="error">{errors.newPassword.message}</p>}

        <Input
          type="password"
          placeholder="Підтвердження нового пароля"
          {...register("confirmPassword", { required: "Підтвердження пароля обов'язкове" })}
        />
        {errors.confirmPassword && <p className="text-error-600">{errors.confirmPassword.message}</p>}

        {errorMessage && <p className="error">{errorMessage}</p>}
        {successMessage && <p className="green">{successMessage}</p>}

        <Button type="submit">Змінити пароль</Button>
      </form>
    </div>
  );
};

export default ChangePassword;
