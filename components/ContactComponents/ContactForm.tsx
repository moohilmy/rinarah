"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";

import { z } from "zod";
import InputField from "./InputField";
import { toast } from "react-toastify";
import styles from './styles.module.css'
import { useEffect, useState } from "react";
const validationSchema = z.object({
  name: z.string().min(3).max(50),
  email: z.string().email({ message: "Please enter a valid email" }),
  message: z.string().min(10).max(500),
});

interface IContactForm {
  name: string;
  email: string;
  message: string;
}

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IContactForm>({
    defaultValues: { name: "", email: "", message: "" },
    resolver: zodResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<IContactForm> = async (data) => {
    try {
      const response = await fetch("/api/email/req-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Email sent successfully!");
      } else {
        toast.error("Failed to send email.");
      }
    } catch (error: unknown) {
      console.error("Error sending email:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };
   const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);
  if(!hydrated){
    return(
      <div className={styles.fromSecton}>
        <div className={styles.inputFieldContainerSkeleton}></div>
        <div className={styles.inputFieldContainerSkeleton}></div>
        <div>
          <div className={styles.inputFieldInfoSkeleton}></div>
  
        </div>
        <div className={`rinarahBtn w-full ${styles.btnSkeleton}`}></div>
      </div>
    )
  }
  return (
    <form
      className={`${styles.fromSecton} `}
      onSubmit={handleSubmit(onSubmit)}
    >
      <InputField
        name="name"
        label="Your Name:"
        error={errors?.name?.message}
        register={register}
        placeholderField="What's your name?"
      />
      <InputField
        name="email"
        label="Your Email:"
        error={errors?.email?.message}
        register={register}
        placeholderField="What's your email?"
      />
      <div>
        <div className={styles.inputFieldInfo}>
          <label htmlFor="message">Your Message:</label>
          <span className="text-red-600 text-xs">
            {errors?.message?.message}
          </span>
        </div>
        <textarea
          rows={6}
          {...register("message")}
          placeholder="What's your message?"
          id="message"
          className={styles.textareaField}
        />
      </div>
      <button
        type="submit"
        className={'rinarahBtn w-full'}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Loading..." : "Send Message"}
      </button>
    </form>
  );
};

export default ContactForm;
