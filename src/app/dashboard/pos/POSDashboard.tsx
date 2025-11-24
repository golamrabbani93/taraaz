'use client';

import React, {useState, useEffect, useRef} from 'react';
import {
	useGetAllProductsQuery,
	useUpdateProductMutation,
} from '@/redux/features/product/productApi';

import styles from './POSDashboard.module.css';
import playSound from '@/utils/playSound';
import SuccessModal from '@/components/SuccessModal/SuccessModal';
import ModalError from '@/components/ModalError/ModalError';
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';

interface Product {
	id: number;
	name: string;
	original_price: string;
	stocks: number;
	barcode: string | number;
}

interface CartItem extends Product {
	quantity: number;
}

const POSDashboard = () => {
	const {data: productsData, isLoading: isProductsLoading} = useGetAllProductsQuery('');
	const [updateProduct, {isLoading}] = useUpdateProductMutation();

	const [products, setProducts] = useState<Product[]>([]);
	const [cart, setCart] = useState<CartItem[]>([]);
	const [barcode, setBarcode] = useState('');
	const [showManualList, setShowManualList] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
	const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
	const [loadingText, setLoadingText] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	// Load products
	useEffect(() => {
		if (productsData) setProducts(productsData);
	}, [productsData]);

	// Always focus input
	useEffect(() => {
		inputRef.current?.focus();
	});

	// AUTO-SCANNER INPUT
	let scanTimer: NodeJS.Timeout | null = null;

	const handleKeyPress = (e: any) => {
		const char = e.key;

		if (!/^[0-9]$/.test(char)) return;

		setBarcode((prev) => {
			const newCode = prev + char;

			if (scanTimer) clearTimeout(scanTimer);

			scanTimer = setTimeout(() => {
				handleScanBarcode(newCode);
				setBarcode('');
			}, 120);

			return newCode;
		});
	};

	const handleScanBarcode = (code: string) => {
		if (!code.trim()) return;

		const product = products.find((p) => String(p.barcode) === code.trim());
		if (!product) {
			setErrorMessage('❌ Product Not Found');
			setIsErrorModalOpen(true);
			return;
		}

		if (product.stocks <= 0) {
			setErrorMessage('❌ Out of Stock');
			setIsErrorModalOpen(true);
			return;
		}

		addToCart(product);
	};

	const addToCart = (product: Product) => {
		setCart((prev) => {
			const existing = prev.find((c) => c.id === product.id);
			if (existing)
				return prev.map((c) => (c.id === product.id ? {...c, quantity: c.quantity + 1} : c));
			return [...prev, {...product, quantity: 1}];
		});
		playSound('/assets/images/smoke-detector-beep.mp3');
	};

	const manualAddProduct = (product: Product) => {
		addToCart(product);
		setShowManualList(false); // close popup
	};

	const changeQty = (id: number, type: 'inc' | 'dec') => {
		setCart((prev) =>
			prev.map((item) => {
				if (item.id !== id) return item;

				if (type === 'inc' && item.quantity < item.stocks)
					return {...item, quantity: item.quantity + 1};
				if (type === 'dec' && item.quantity > 1) return {...item, quantity: item.quantity - 1};

				return item;
			}),
		);
	};

	const removeFromCart = (id: number) => {
		setCart((prev) => prev.filter((c) => c.id !== id));
	};

	const completeSale = async () => {
		if (cart.length === 0) {
			setErrorMessage('❌ Cart is empty');
			setIsErrorModalOpen(true);
			return;
		}
		setLoadingText('complete');
		for (const item of cart) {
			await updateProduct({
				id: item.id,
				data: {stocks: item.stocks - item.quantity, name: item.name},
			});
		}
		setSuccessMessage('✅ Sale Completed');
		setIsSuccessModalOpen(true);
		setCart([]);
	};

	const handleReturn = async () => {
		if (cart.length === 0) {
			setErrorMessage('❌ Cart is empty');
			setIsErrorModalOpen(true);
			return;
		}
		setLoadingText('return');
		for (const item of cart) {
			await updateProduct({
				id: item.id,
				data: {stocks: item.stocks + item.quantity, name: item.name},
			});
		}
		setSuccessMessage('♻ Return Processed');
		setIsSuccessModalOpen(true);
		setCart([]);
	};
	if (isProductsLoading) return <DashboardLoader />;
	return (
		<div className={styles.dashboardMain} onKeyDown={handleKeyPress} tabIndex={0}>
			<div className={styles.header}>
				<h1>POS Dashboard</h1>
				<span>{new Date().toLocaleString()}</span>
			</div>

			<div className={styles.panels}>
				{/* LEFT PANEL */}
				<div className={styles.barcodePanel}>
					<h2>Scan Product</h2>

					<input ref={inputRef} type="text" value={barcode} placeholder="Scan barcode" readOnly />

					<button
						className="btn btn-secondary mt-3"
						onClick={() => setShowManualList(true)}
						style={{fontSize: '16px'}}
					>
						<i className="fas fa-plus"></i> Add Product Manually
					</button>
				</div>

				{/* RIGHT PANEL */}
				<div className={styles.cartPanel}>
					<h2>Cart</h2>

					<table className={styles.cartTable}>
						<thead>
							<tr>
								<th>Name</th>
								<th>Price</th>
								<th>Qty</th>
								<th>Total</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{cart.map((item) => (
								<tr key={item.id} className="text-black">
									<td>{item.name}</td>
									<td>{parseInt(item.original_price)} ৳</td>
									<td className="d-flex gap-3 justify-content-between align-items-center">
										<button onClick={() => changeQty(item.id, 'dec')}>-</button>
										<span>{item.quantity}</span>
										<button onClick={() => changeQty(item.id, 'inc')}>+</button>
									</td>
									<td>{parseInt(item.original_price) * item.quantity} ৳</td>
									<td>
										<button className="btn btn-danger" onClick={() => removeFromCart(item.id)}>
											✖
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<div className={styles.checkout}>
						<p>Total: {cart.reduce((s, i) => s + parseInt(i.original_price) * i.quantity, 0)} ৳</p>

						<div className="d-flex gap-4  justify-content-between">
							<button onClick={completeSale} className={styles.saleBtn} disabled={isLoading}>
								{isLoading && loadingText === 'complete' ? 'Processing...' : 'Complete Sale'}
							</button>
							<button
								onClick={handleReturn}
								className={styles.returnBtn}
								disabled={isLoading}
								style={{width: '150px'}}
							>
								{isLoading && loadingText === 'return' ? 'Processing...' : 'Return'}
							</button>
						</div>
					</div>
				</div>
			</div>
			<button
				onClick={() => handleScanBarcode('517313185963')} // Replace "12345" with a real barcode from your products
			>
				Simulate Scan
			</button>
			{/* MANUAL PRODUCT POPUP */}
			{showManualList && (
				<div
					className={styles.manualPopup}
					onClick={() => setShowManualList(false)} // click outside closes
				>
					<div
						className={styles.manualBox}
						onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
					>
						<h3>Select Product</h3>
						<button
							className="btn btn-danger mb-4 me-auto"
							onClick={() => setShowManualList(false)}
							style={{width: '40px', height: '40px', fontSize: '20px'}}
						>
							✖
						</button>

						<table className={styles.productTable}>
							<thead>
								<tr>
									<th>Name</th>
									<th>Price</th>
									<th>Stock</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{products.map((p) => (
									<tr key={p.id}>
										<td>{p.name}</td>
										<td>৳ {p.original_price}</td>
										<td>{p.stocks}</td>
										<td>
											<button
												className="btn btn-primary text-white"
												onClick={() => manualAddProduct(p)}
												style={{fontSize: '12px'}}
											>
												Add
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Modals */}
			<SuccessModal
				isOpen={isSuccessModalOpen}
				onClose={() => setIsSuccessModalOpen(false)}
				message={successMessage}
			/>
			<ModalError
				isOpen={isErrorModalOpen}
				onClose={() => setIsErrorModalOpen(false)}
				message={errorMessage}
			/>
		</div>
	);
};

export default POSDashboard;
