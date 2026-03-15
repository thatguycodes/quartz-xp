import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
}

export function Button({
  children,
  variant = 'primary',
  size = 'medium',
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const buttonClass = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={buttonClass} {...props}>
      {children}
    </button>
  );
}

export default Button;
