"use client"
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import styles from './styles.module.css'
type IInputProps<TFieldValue extends FieldValues> = {
  label: string;
  error?: string;
  placeholderField: string;
  register: UseFormRegister<TFieldValue>;
  name: Path<TFieldValue>;
};

const InputField = <TFieldValue extends FieldValues>({
  label,
  error,
  placeholderField,
  name,
  register,
}: IInputProps<TFieldValue>) => {
  return (
    <div className={styles.inputFieldContainer}>
      <div className={styles.inputFieldInfo}>
        <label htmlFor={name}>{label}</label>
        <span className="text-red-600 text-xs ">{error}</span>
      </div>
      <input
        className={styles.inputField}
        type="text"
        {...register(name)}
        id={name}
        placeholder={placeholderField}
      />
    </div>
  );
};

export default InputField;
