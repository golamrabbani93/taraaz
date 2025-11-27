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
	stocks_size?: {size: string; stock: number; barcode: number}[];
	isSizeable?: boolean;
}

interface CartItem extends Product {
	quantity: number;
	size?: string;
}

const POSDashboard = () => {
	const {data: productsData, isLoading: isProductsLoading} = useGetAllProductsQuery('', {
		refetchOnMountOrArgChange: true,
		refetchOnFocus: true,
		pollingInterval: 15000,
	});
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

		let product: Product | undefined;
		let stockItem: {size: string; stock: number; barcode: number} | undefined;

		if (code.startsWith('11')) {
			// Normal product barcode
			product = products.find((p) => String(p.barcode) === code.trim());
		} else if (code.startsWith('22')) {
			// Size-specific barcode
			for (let p of products) {
				const found = p.stocks_size?.find((s) => String(s.barcode) === code.trim());
				if (found) {
					product = p;
					stockItem = found;
					break;
				}
			}
		}

		if (!product) {
			setErrorMessage('❌ Product Not Found');
			setIsErrorModalOpen(true);
			return;
		}

		if (stockItem) {
			addToCartSize(product, stockItem);
		} else {
			addToCart(product);
		}
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

	const addToCartSize = (
		product: Product,
		stockItem: {size: string; stock: number; barcode: number},
	) => {
		setCart((prev) => {
			const existing = prev.find((c) => c.id === product.id && c.size === stockItem.size);
			if (existing)
				return prev.map((c) =>
					c.id === product.id && c.size === stockItem.size ? {...c, quantity: c.quantity + 1} : c,
				);
			return [...prev, {...product, quantity: 1, size: stockItem.size}];
		});
		playSound('/assets/images/smoke-detector-beep.mp3');
	};

	const manualAddProduct = (product: Product) => {
		if (product.isSizeable) {
			setErrorMessage('❌ Please scan size-specific barcode for size-able products');
			setIsErrorModalOpen(true);
			return;
		}

		addToCart(product);
		setShowManualList(false);
	};

	const changeQty = (id: number, type: 'inc' | 'dec', isSizeable?: boolean) => {
		setCart((prev) =>
			prev.map((item) => {
				if (item.id !== id || item.isSizeable !== isSizeable) return item;

				if (type === 'inc') {
					return {...item, quantity: item.quantity + 1};
				}
				if (type === 'dec' && item.quantity > 1) return {...item, quantity: item.quantity - 1};

				return item;
			}),
		);
	};

	const removeFromCart = (id: number, size?: string) => {
		setCart((prev) => prev.filter((c) => c.id !== id || c.size !== size));
	};

	const completeSale = async () => {
		if (cart.length === 0) {
			setErrorMessage('❌ Cart is empty');
			setIsErrorModalOpen(true);
			return;
		}

		setLoadingText('complete');

		for (const item of cart) {
			// ------------------------------------
			// SIZE-WISE PRODUCT
			// ------------------------------------
			if (item.isSizeable) {
				const stockItem = item.stocks_size?.find((s) => s.size === item.size);

				// Check stock before update
				if (!stockItem || stockItem.stock < item.quantity) {
					setErrorMessage(
						`❌ Not enough stock for size ${item.size}---(current stock: ${stockItem?.stock})`,
					);
					setIsErrorModalOpen(true);
					setLoadingText('');
					return;
				}

				// Update stock for this size
				await updateProduct({
					id: item.id,
					data: {
						stocks_size: item.stocks_size?.map((s) =>
							s.size === item.size ? {...s, stock: s.stock - item.quantity} : s,
						),
						name: item.name,
					},
				});

				removeFromCart(item.id, item.size);
			}

			// ------------------------------------
			// NORMAL PRODUCT
			// ------------------------------------
			else {
				if (item.stocks < item.quantity) {
					setErrorMessage(
						`❌ Not enough stock for size ${item.name}---(current stock: ${item?.stocks || 0})`,
					);
					setIsErrorModalOpen(true);
					setLoadingText('');
					return;
				}

				// Update normal stock
				await updateProduct({
					id: item.id,
					data: {
						stocks: item.stocks - item.quantity,
						name: item.name,
					},
				});

				removeFromCart(item.id);
			}
		}

		// After all items processed
		setCart([]);
		setSuccessMessage('✅ Sale Completed');
		setIsSuccessModalOpen(true);
		setLoadingText('');
	};

	const handleReturn = async () => {
		if (cart.length === 0) {
			setErrorMessage('❌ Cart is empty');
			setIsErrorModalOpen(true);
			return;
		}
		setLoadingText('return');
		for (const item of cart) {
			if (item.isSizeable) {
				const stockItem = item.stocks_size?.find((s) => s.size === item.size);
				if (stockItem) {
					await updateProduct({
						id: item.id,
						data: {
							stocks_size: item.stocks_size?.map((s) =>
								s.size === item.size ? {...s, stock: s.stock + item.quantity} : s,
							),
							name: item.name,
						},
					});
				}
			} else {
				await updateProduct({
					id: item.id,
					data: {stocks: item.stocks + item.quantity, name: item.name},
				});
			}
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
								<th>Size</th>
								<th>Qty</th>
								<th>Total</th>
								<th></th>
							</tr>
						</thead>

						<tbody>
							{cart.map((item) => (
								<tr key={item.id + (item.size ?? '')} className="text-black">
									<td>{item.name}</td>
									<td>{parseInt(item.original_price)} ৳</td>
									{item?.isSizeable ? <td>{item.size ?? '-'}</td> : <td>-</td>}
									<td className="d-flex gap-3 justify-content-between align-items-center">
										<button onClick={() => changeQty(item.id, 'dec', item.isSizeable)}>-</button>
										<span>{item.quantity}</span>
										<button onClick={() => changeQty(item.id, 'inc', item.isSizeable)}>+</button>
									</td>
									<td>{parseInt(item.original_price) * item.quantity} ৳</td>
									<td>
										<button
											className="btn btn-danger"
											onClick={() => removeFromCart(item.id, item.size)}
										>
											✖
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>

					<div className={styles.checkout}>
						<p>Total: {cart.reduce((s, i) => s + parseInt(i.original_price) * i.quantity, 0)} ৳</p>

						<div className="d-flex gap-4 justify-content-between">
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

			{/* MANUAL PRODUCT POPUP */}
			{showManualList && (
				<div className={styles.manualPopup} onClick={() => setShowManualList(false)}>
					<div className={styles.manualBox} onClick={(e) => e.stopPropagation()}>
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
										<td>
											{p.isSizeable ? (
												<span
													style={{
														backgroundColor: '#28a745',
														color: 'white',
														padding: '2px 6px',
														borderRadius: '4px',
														fontSize: '16px',
														fontWeight: 'bold',
													}}
												>
													Sizeable
												</span>
											) : (
												<span style={{fontSize: '16px', fontWeight: 'bold'}}>{p.stocks}</span>
											)}
										</td>
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
			<button
				onClick={() => handleScanBarcode('229804092989')} // Replace "12345" with a real barcode from your products
			>
				Simulate Scan
			</button>
			<button
				onClick={() => handleScanBarcode('221605007722')} // Replace "12345" with a real barcode from your products
			>
				Simulate Scan
			</button>
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
