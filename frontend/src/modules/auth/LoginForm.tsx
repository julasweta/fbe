import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import classNames from "classnames";
import styles from "./LoginForm.module.scss";
import { authService } from "../../services/AuthService";
import Input from "../../components/ui/Inputs/Input";
import { Button } from "../../components/ui/Buttons/Button";

interface IAuth {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const { user } = useAuthStore();
  const [form, setForm] = useState<IAuth>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Будь ласка, заповніть всі поля");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Введіть коректний email");
      return;
    }

    setError(null);

    try {
      console.log("LoginForm: Starting login process for:", form.email);
      await authService.login(form);
      console.log("LoginForm: Login successful, redirecting...");
      navigate("/");
    } catch (error) {
      console.error("LoginForm: Login failed:", error);
      console.error("LoginForm: Error details:", {
        type: typeof error,
        constructor: error?.constructor?.name,
        message: error instanceof Error ? error.message : error,
        string: String(error)
      });

      let errorMessage = "Помилка входу. Спробуйте ще раз.";

      // Правильна обробка різних типів помилок
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error && typeof error === 'object') {
        // Якщо це об'єкт - спробуємо витягти повідомлення
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        } else if ('error' in error && typeof error.error === 'string') {
          errorMessage = error.error;
        } else {
          // Якщо нічого не знайдено - використовуємо JSON.stringify з обробкою помилок
          try {
            const errorStr = JSON.stringify(error);
            if (errorStr && errorStr !== '{}' && errorStr !== '[object Object]') {
              errorMessage = errorStr;
            }
          } catch (e) {
            console.error("Failed to stringify error:", e);
          }
        }
      }

      console.log("LoginForm: Final error message:", errorMessage);
      setError(errorMessage);
    }
  };




  return (
    <div className={classNames(styles.loginContainer)}>
      <h1 className={styles.title}>Вхід</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Введіть ваш email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Пароль"
          name="password"
          type="password"
          placeholder="Введіть ваш пароль"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && (
          <div className={styles.errorContainer}>
            <p className={styles.error}>{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={!form.email || !form.password}
          className={""} // Видалено styles.loading, оскільки loading більше не використовується
        >
          Увійти
        </Button>
        <p className={styles.registerPrompt}>
           <Link to="/forgot-password">Забули пароль</Link>
        </p>

        <p className={styles.registerPrompt}>
          Немає аккаунта? <Link to="/register">Зареєструйтесь тут</Link>
        </p>

      </form>
    </div>
  );
};

export default LoginForm