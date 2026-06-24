import React from 'react';

interface ActionButtonProps {
  variant: 'primary' | 'secondary' | 'destructive';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  size?: 'sm' | 'default';
}

const variantClasses: Record<ActionButtonProps['variant'], string> = {
  primary: 'bg-[#22c55e] text-black font-semibold rounded-full h-10 px-5 hover:bg-[#16a34a] active:scale-[0.97] transition-all disabled:opacity-50 disabled:pointer-events-none',
  secondary: 'bg-white/5 text-white font-semibold rounded-full h-10 px-5 border border-white/10 hover:bg-white/10 transition-all',
  destructive: 'bg-red-500/10 text-red-400 font-semibold rounded-full h-10 px-5 border border-red-500/20 hover:bg-red-500/20 transition-all',
};

const sizeClasses: Record<string, string> = {
  sm: 'h-8 px-4 text-xs',
  default: 'h-10 px-5 text-sm',
};

const ActionButton: React.FC<ActionButtonProps> = ({
  variant,
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  size = 'default',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};

export { ActionButton };
