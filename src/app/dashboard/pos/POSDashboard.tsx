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
	discount_price?: string; // Fixed: consistent with getPrice function
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

	// Helper function to get price (use discount_price if > 0, otherwise original_price)
	const getPrice = (product: Product | CartItem): number => {
		const discountPrice = parseFloat(product.discount_price || '0'); // Fixed: changed to discount_price
		const originalPrice = parseFloat(product.original_price || '0');
		return discountPrice > 0 ? discountPrice : originalPrice;
	};

	// Load products
	useEffect(() => {
		if (productsData) setProducts(productsData);
	}, [productsData]);

	// Always focus input
	useEffect(() => {
		inputRef.current?.focus();
	});

	const isProcessingRef = useRef(false);
	const scanTimerRef = useRef<NodeJS.Timeout | null>(null);
	const barcodeDigitsRef = useRef('');

	const handleKeyPress = (e: any) => {
		const char = e.key;
		if (!/^[0-9]$/.test(char)) return;

		// Add to ref
		barcodeDigitsRef.current += char;
		setBarcode(barcodeDigitsRef.current);

		// Clear previous timer
		if (scanTimerRef.current) clearTimeout(scanTimerRef.current);

		// If we have exactly 12 digits, process immediately
		if (barcodeDigitsRef.current.length === 12) {
			handleScanBarcode(barcodeDigitsRef.current);
			return;
		}

		// Set timeout for scanner
		scanTimerRef.current = setTimeout(() => {
			if (barcodeDigitsRef.current.length >= 8) {
				handleScanBarcode(barcodeDigitsRef.current);
			}
		}, 80);
	};

	const handleScanBarcode = (code: string) => {
		// Prevent multiple processing
		if (isProcessingRef.current) {
			console.log('Already processing barcode, skipping:', code);
			return;
		}

		isProcessingRef.current = true;

		if (!code.trim() || code.length < 8) {
			isProcessingRef.current = false;
			return;
		}

		console.log('Processing barcode:', code);

		let product: Product | undefined;
		let stockItem: {size: string; stock: number; barcode: number} | undefined;
		const prefix = code.substring(0, 2);

		if (prefix === '11') {
			product = products.find((p) => String(p.barcode).trim() === code);
		} else if (prefix === '22') {
			for (let p of products) {
				if (p.stocks_size) {
					const found = p.stocks_size?.find((s) => String(s.barcode).trim() === code);
					if (found) {
						product = p;
						stockItem = found;
						break;
					}
				}
			}
		} else {
			product = products.find((p) => String(p.barcode).trim() === code);
			if (!product) {
				for (let p of products) {
					if (p.stocks_size) {
						const found = p.stocks_size?.find((s) => String(s.barcode).trim() === code);
						if (found) {
							product = p;
							stockItem = found;
							break;
						}
					}
				}
			}
		}

		if (!product) {
			console.log('❌ Product not found:', code);
			setErrorMessage(`❌ Product Not Found\nBarcode: ${code}`);
			setIsErrorModalOpen(true);
		} else {
			console.log('✅ Found product:', product.name);

			// Check stock before adding to cart
			if (stockItem) {
				// Check size-specific stock
				// if (stockItem.stock <= 0) {
				// 	setErrorMessage(
				// 		`❌ Out of Stock\n${product.name} - Size: ${stockItem.size}\nCurrent stock: ${stockItem.stock}`,
				// 	);
				// 	setIsErrorModalOpen(true);
				// } else {
				addToCartSize(product, stockItem);
				// }
			} else {
				// Check normal product stock
				// if (product.stocks <= 0) {
				// 	setErrorMessage(`❌ Out of Stock\n${product.name}\nCurrent stock: ${product.stocks}`);
				// 	setIsErrorModalOpen(true);
				// } else {
				addToCart(product);
				// }
			}
		}

		// Reset everything
		barcodeDigitsRef.current = '';
		setBarcode('');
		if (scanTimerRef.current) {
			clearTimeout(scanTimerRef.current);
			scanTimerRef.current = null;
		}

		// Allow new scans after a short delay
		setTimeout(() => {
			isProcessingRef.current = false;
		}, 100);
	};

	// Cleanup effect
	useEffect(() => {
		return () => {
			if (scanTimerRef.current) clearTimeout(scanTimerRef.current);
		};
	}, []);

	const addToCart = (product: Product) => {
		// Double-check stock before adding
		// if (product.stocks <= 0) {
		// 	setErrorMessage(`❌ Out of Stock\n${product.name}\nCurrent stock: ${product.stocks}`);
		// 	setIsErrorModalOpen(true);
		// 	return;
		// }

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
		// Double-check stock before adding
		// if (stockItem.stock <= 0) {
		// 	setErrorMessage(
		// 		`❌ Out of Stock\n${product.name} - Size: ${stockItem.size}\nCurrent stock: ${stockItem.stock}`,
		// 	);
		// 	setIsErrorModalOpen(true);
		// 	return;
		// }

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

		// Check stock before manual add
		if (product.stocks <= 0) {
			setErrorMessage(`❌ Out of Stock\n${product.name}\nCurrent stock: ${product.stocks}`);
			setIsErrorModalOpen(true);
			return;
		}

		addToCart(product);
		setShowManualList(false);
	};

	const changeQty = (id: number, type: 'inc' | 'dec', isSizeable?: boolean, size?: string) => {
		setCart((prev) =>
			prev.map((item) => {
				// For sizeable products
				if (isSizeable && size) {
					// Check if this is the exact sizeable item we want to update
					if (item.id !== id || !item.isSizeable || item.size !== size) {
						return item;
					}

					if (type === 'inc') {
						const stockItem = item.stocks_size?.find((s) => s.size === size);
						if (stockItem && stockItem.stock <= item.quantity) {
							setErrorMessage(
								`❌ Not enough stock for size ${size}\nCurrent stock: ${stockItem.stock}`,
							);
							setIsErrorModalOpen(true);
							return item;
						}
						return {...item, quantity: item.quantity + 1};
					}
					if (type === 'dec' && item.quantity > 1) {
						return {...item, quantity: item.quantity - 1};
					}
				}
				// For non-sizeable products
				else {
					// Check if this is the exact non-sizeable item we want to update
					if (item.id !== id || item.isSizeable) {
						return item;
					}

					if (type === 'inc') {
						if (item.stocks <= item.quantity) {
							setErrorMessage(
								`❌ Not enough stock for ${item.name}\nCurrent stock: ${item.stocks}`,
							);
							setIsErrorModalOpen(true);
							return item;
						}
						return {...item, quantity: item.quantity + 1};
					}
					if (type === 'dec' && item.quantity > 1) {
						return {...item, quantity: item.quantity - 1};
					}
				}

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
									<td>{getPrice(item)} ৳</td>
									{item?.isSizeable ? <td>{item.size ?? '-'}</td> : <td>-</td>}
									<td>
										<span className="d-flex gap-3 justify-content-between align-items-center">
											<button onClick={() => changeQty(item.id, 'dec', item.isSizeable, item.size)}>
												-
											</button>
											<span>{item.quantity}</span>
											<button onClick={() => changeQty(item.id, 'inc', item.isSizeable, item.size)}>
												+
											</button>
										</span>
									</td>
									<td>{getPrice(item) * item.quantity} ৳</td>
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
						<p>Total: {cart.reduce((s, i) => s + getPrice(i) * i.quantity, 0)} ৳</p>

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
