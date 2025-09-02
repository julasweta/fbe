import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import Input from "../../components/ui/Inputs/Input";
import { Button } from "../../components/ui/Buttons/Button";
import type { IResetPasswordForm } from "../../interfaces/IAuth";
import { authService } from "../../services/AuthService";



const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<IResetPasswordForm>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const resetCode = searchParams.get("code");
  const email = searchParams.get("email");

  const onSubmit = (data: IResetPasswordForm) => {
    if (!resetCode || !email) {
      alert("Посилання недійсне або відсутні дані");
      return;
    }
    try {
      authService.resetPassword(email, resetCode, data.newPassword);
      alert('Дані oновлено');
      navigate('/login')
     }
    catch (err: any) {
      alert(err.response?.data?.message || "Не вдалося відновити дані");
    }
  
   
  };

  return (
    <div>
      <h2 >Скидання пароля</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <Input
          type="password"
          placeholder="Новий пароль *"
          {...register("newPassword", {
            required: "Пароль обов'язковий",
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
              message: "Мін. 8 символів, 1 велика і 1 мала літера",
            },
          })}
        />
        {errors.newPassword && (
          <p className="error">{errors.newPassword.message}</p>
        )}

        <Button type="submit">Змінити пароль</Button>
      </form>
    </div>
  );
};

export default ResetPassword;
