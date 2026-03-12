import React from 'react';
import Link from 'next/link';

type LinkProps = {
  href: string;
  children: React.ReactNode;
  underline?: boolean;
  color?: string;
  fontSize?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
};

export const CustomLink: React.FC<LinkProps> = ({
  href,
  children,
  underline = true,
  color = 'blue-500',
  fontSize = 'text-base',
  onClick,
  variant = 'primary',
}) => {
  const baseStyles = `cursor-pointer inline-block ${fontSize} transition-all duration-300`;

  const variantStyles = {
    primary: `text-${color} hover:text-${color} hover:underline`,
    secondary: `text-${color} hover:text-${color} hover:underline opacity-80`,
    danger: `text-red-500 hover:text-red-700 hover:underline`,
  };

  const finalStyles = `${baseStyles} ${variantStyles[variant]} ${underline ? 'underline' : ''}`;

  return (
    <Link href={href} className={finalStyles} onClick={onClick}>
      {children}
    </Link>
  );
};
