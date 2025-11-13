'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {useWishlist} from './WishlistContext';
import {useCart} from '@/components/header/CartContext';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WishList: React.FC = () => {
	const {wishlistItems, removeFromWishlist} = useWishlist();

	const total = wishlistItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const freeShippingThreshold = 125;
	const remaining = freeShippingThreshold - total;

	return (
		<a href="/wishlist">
			<div className="btn-border-only cart category-hover-header">
				<i className="fa-regular fa-heart" />
				{/* <span className="text">Wishlist</span> */}
				<span className="number">{wishlistItems.length}</span>
			</div>
		</a>
	);
};

export default WishList;
