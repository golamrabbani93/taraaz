'use client';

import React, {createContext, useContext, useEffect, useState} from 'react';

interface CartItem {
	id: number;
	image: string;
	title: string;
	price: number;
	quantity: number;
	active: boolean; // true = cart, false = wishlist
	b_name?: string;
	size?: string;
}

interface CartContextProps {
	cartItems: CartItem[];
	addToCart: (item: CartItem) => void;
	addToWishlist: (item: CartItem) => void;
	removeFromCart: (id: number, size?: string) => void;
	updateItemQuantity: (id: number, quantity: number, size?: string) => void;
	isCartLoaded: boolean;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) throw new Error('useCart must be used within a CartProvider');
	return context;
};

export const CartProvider = ({children}: {children: React.ReactNode}) => {
	const [cartItems, setCartItems] = useState<CartItem[]>([]);
	const [isCartLoaded, setIsCartLoaded] = useState(false);

	useEffect(() => {
		const storedCart = localStorage.getItem('cart');
		if (storedCart) {
			try {
				setCartItems(JSON.parse(storedCart));
			} catch {
				localStorage.removeItem('cart');
			}
		}
		setIsCartLoaded(true);
	}, []);

	useEffect(() => {
		if (isCartLoaded) {
			localStorage.setItem('cart', JSON.stringify(cartItems));
		}
	}, [cartItems, isCartLoaded]);

	// Add item to cart
	const addToCart = (item: CartItem) => {
		setCartItems((prev) => {
			const existing = prev.find(
				(i) =>
					i.id === item.id &&
					i.active === true &&
					(item.size ? i.size === item.size : i.size === undefined),
			);

			if (existing) {
				return prev.map((i) =>
					i.id === item.id &&
					i.active === true &&
					(item.size ? i.size === item.size : i.size === undefined)
						? {...i, quantity: i.quantity + item.quantity}
						: i,
				);
			} else {
				return [...prev, item];
			}
		});
	};

	// Add item to wishlist
	const addToWishlist = (item: CartItem) => {
		setCartItems((prev) => {
			const existing = prev.find(
				(i) =>
					i.id === item.id &&
					i.active === false &&
					(item.size ? i.size === item.size : i.size === undefined),
			);

			if (existing) {
				return prev.map((i) =>
					i.id === item.id &&
					i.active === false &&
					(item.size ? i.size === item.size : i.size === undefined)
						? {...i, quantity: i.quantity + item.quantity}
						: i,
				);
			} else {
				return [...prev, item];
			}
		});
	};

	// Remove item
	const removeFromCart = (id: number, size?: string) => {
		setCartItems((prev) =>
			// If size is provided, remove only the matching size variant.
			// If size is NOT provided, remove all items with the given id regardless of size.
			prev.filter((i) => !(i.id === id && (size ? i.size === size : true))),
		);
	};

	// Update quantity
	const updateItemQuantity = (id: number, quantity: number, size?: string) => {
		setCartItems((prev) =>
			// If size is provided, update only that size variant; otherwise update all items with the id
			prev.map((i) =>
				i.id === id && (size ? i.size === size : true)
					? {...i, quantity: Math.max(1, quantity)}
					: i,
			),
		);
	};

	return (
		<CartContext.Provider
			value={{
				cartItems,
				addToCart,
				addToWishlist,
				removeFromCart,
				updateItemQuantity,
				isCartLoaded,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};
