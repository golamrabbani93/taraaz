'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useCart} from './CartContext';

const CartDropdown: React.FC = () => {
	const {cartItems} = useCart();

	const activeItems = cartItems.filter((item) => item.active);

	return (
		<a href="/cart">
			<div className="btn-border-only cart category-hover-header">
				<i className="fa-sharp fa-regular fa-cart-shopping" />
				{/* <span className="text">Cart</span> */}
				<span className="number">{activeItems.length}</span>
			</div>
		</a>
	);
};

export default CartDropdown;
