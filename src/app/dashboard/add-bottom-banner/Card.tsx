import React, {ReactNode} from 'react';
import './Card.css';

interface CardProps {
	children: ReactNode;
	className?: string;
}

const Card: React.FC<CardProps> = ({children, className = ''}) => {
	return <div className={`card ${className}`}>{children}</div>;
};

interface CardContentProps {
	children: ReactNode;
	className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({children, className = ''}) => {
	return <div className={`card-content ${className}`}>{children}</div>;
};

export default Card;
