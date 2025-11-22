import React from 'react';

interface TextFieldProps {
  id: string;
  name?: string;
  type?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  id,
  name = id,
  type = 'text',
  label,
  value,
  onChange,
  required,
  autoComplete,
  placeholder,
  className = '',
  disabled
}) => {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-brandBlack">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        disabled={disabled}
        className={`mt-1 block w-full rounded-md border border-brandGreen/40 bg-white px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-brandGreen text-sm focus:border-brandGreen disabled:opacity-60 ${className}`}
      />
    </div>
  );
};

export default TextField;
