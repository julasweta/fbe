import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import styles from "./ContactForm.module.scss";
import Input from "../ui/Inputs/Input";
import { Button } from "../ui/Buttons/Button";
import { userService } from "../../services/UserService";
import type { sendMessage } from "../../interfaces/IUser";

interface ContactFormInputs {
  name: string;
  email: string;
  message: string;
  imageUrl?: string;
}

const ContactForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInputs>();

  const onSubmit = async (data: sendMessage) => {
    try {
      await userService.sendMessageFromContact(data)
      alert("Повідомлення успішно відправлено!");
      reset();
    } catch (err) {
      console.error("❌ Помилка відправки", err);
      alert("Сталася помилка. Спробуйте пізніше.");
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={styles.title}>Зв'яжіться з нами</h2>

      <div className={styles.field}>
        <Input
          type="text"
          label="Ім’я"
          {...register("name", { required: "Ім’я обов’язкове" })}
        />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      <div className={styles.field}>
        <Input
          type="email"
        label="Email"
          {...register("email", {
            required: "Email обов’язковий",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Некоректний email",
            },
          })}
        />
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>

      <div className={styles.field}>
        <label>Повідомлення</label>
        <textarea
          rows={4}
          {...register("message", { required: "Повідомлення обов’язкове" })}
        />
        {errors.message && (
          <span className={styles.error}>{errors.message.message}</span>
        )}
      </div>

      

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Відправка..." : "Відправити"}
      </Button>
    </form>
  );
};

export default ContactForm;
