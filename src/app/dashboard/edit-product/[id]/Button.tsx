import React, {ButtonHTMLAttributes, ReactNode} from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: ReactNode;
	variant?: 'primary' | 'secondary' | 'danger';
	className?: string;
}

const Button: React.FC<ButtonProps> = ({
	children,
	variant = 'primary',
	className = '',
	...props
}) => {
	return (
		<button className={`btn btn-${variant} ${className}`} {...props}>
			{children}
		</button>
	);
};

export default Button;
