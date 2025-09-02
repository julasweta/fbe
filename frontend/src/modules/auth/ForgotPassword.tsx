import { useForm } from "react-hook-form";
import Input from "../../components/ui/Inputs/Input";
import { Button } from "../../components/ui/Buttons/Button";
import { authService } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface IForgotPasswordForm {
  email: string;
}

const ForgotPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<IForgotPasswordForm>();
  const navigate = useNavigate();

  const forgotPassword = async (email: string) => {
    try {
      await authService.forgotPassword(email); // ❗ треба await
      alert('Для відновлення паролю перейдіть у поштову скриньку');
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Не вдалося відправити лист");
    }
  };


  const onSubmit = (data: IForgotPasswordForm) => {
    forgotPassword(data.email);
  };

  return (
    <div className="wrapper">
      <h2 className="title">Відновлення пароля</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <Input
          type="email"
          placeholder="Email *"
          {...register("email", {
            required: "Email обов'язковий",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Некоректний email"
            }
          })}
        />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}

        <Button type="submit">Надіслати посилання</Button>
      </form>
    </div>
  );
};

export default ForgotPassword;
