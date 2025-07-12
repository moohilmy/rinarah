type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  error?: { message?: string };
};
export function TextInput({ id, label,type, error, placeholder, autoComplete, ...rest }: TextInputProps) {
  return (
    <div className="rinarah-checkout-box flex-1">
      <input type={type} autoComplete={autoComplete} placeholder={placeholder} id={id} className="rinarah-checkout-input" {...rest} />
      <label htmlFor={id} className="rinarah-checkout-label">
        {label}
      </label>
      {error && <span className="rinarah-error-message">{error.message}</span>}
    </div>
  );
}