'use client';

import React, {useState, useEffect} from 'react';
import deleteModalStyles from '../DeleteModal/DeleteModal.module.css';
import {generateBarcodeImage} from '@/utils/generateBarcodeImage';
import {formatPrice} from '@/utils/formatPrice';

interface StockSize {
	size: string;
	stock: number;
	barcode: string | number;
}

interface BarcodeModalProps {
	isOpen: boolean;
	onClose: () => void;
	stocks_size: StockSize[] | null; // FULL SIZE WISE DATA
	productName: string;
	price: string | number;
	discount_price?: string | number;
}

const SizeWiseBarcodeModal: React.FC<BarcodeModalProps> = ({
	isOpen,
	onClose,
	stocks_size,
	productName,
	price,
	discount_price,
}) => {
	// State for quantity input for each size
	const [quantityInputs, setQuantityInputs] = useState<{[key: string]: string}>({});
	const [isPrinting, setIsPrinting] = useState<string | null>(null);
	const [showWarnings, setShowWarnings] = useState<{[key: string]: boolean}>({});

	useEffect(() => {
		if (isOpen && stocks_size) {
			// Initialize empty quantity inputs for each size
			const initialInputs: {[key: string]: string} = {};
			stocks_size.forEach((item) => {
				initialInputs[item.size] = '';
			});
			setQuantityInputs(initialInputs);
			setShowWarnings({});
			setIsPrinting(null);
		}
	}, [isOpen, stocks_size]);

	if (!isOpen || !stocks_size) return null;

	// Validate quantity for a specific size
	const validateQuantity = (size: string) => {
		const quantity = quantityInputs[size] || '';
		const parsedQuantity = parseInt(quantity);

		if (!quantity.trim()) {
			return {valid: false, message: 'Please enter quantity'};
		}

		if (isNaN(parsedQuantity) || parsedQuantity < 1) {
			return {valid: false, message: 'Minimum quantity is 1'};
		}

		if (parsedQuantity > 1000) {
			return {valid: false, message: 'Maximum quantity is 1000'};
		}

		return {valid: true, quantity: parsedQuantity};
	};

	const handlePrintForSize = (size: string, barcode: string | number) => {
		const validation = validateQuantity(size);

		if (!validation.valid) {
			setShowWarnings((prev) => ({...prev, [size]: true}));
			return;
		}

		setShowWarnings((prev) => ({...prev, [size]: false}));
		setIsPrinting(size);

		const quantityToPrint = validation.quantity || 1;

		const printWindow = window.open('', '_blank');
		if (!printWindow) {
			setIsPrinting(null);
			return;
		}

		const formattedPrice = formatPrice(
			Number(discount_price as string) > 0 ? (discount_price as string) : (price as string) || '0',
		);

		// Calculate number of pages needed (1 sticker per page for thermal)
		const pagesNeeded = Math.ceil(quantityToPrint);

		printWindow.document.write(`
<html>
<head>
  <title>Thermal Stickers - ${size}</title>
  <style>
    @page { 
      size: 58mm auto; 
      margin: 0; 
    }
    body {
      margin: 0;
      padding: 0;
      width: 58mm;
      font-family: Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .sticker {
      width: 54mm;
      padding: 3mm 0;
      text-align: center;
      page-break-after: always;
    }
    .sticker img {
      width: 90%;
      height: auto;
    }
    .sticker-text {
      font-size: 10px;
      font-weight: 600;
      margin-top: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 90%;
      margin-left: auto;
      margin-right: auto;
    }
    .sticker-size {
      font-size: 11px;
      font-weight: bold;
      margin-top: 2px;
      color: #d9534f;
    }
    .sticker-price {
      font-size: 10px;
      margin-top: 2px;
      color: #000;
      font-weight: bold;
    }
    @media print { 
      .no-print { display: none; } 
      body {
        width: 58mm !important;
      }
    }
  </style>
</head>
<body>
  ${Array.from({length: pagesNeeded})
		.map((_, index) => {
			const stickerNumber = index + 1;
			return `
      <div class="sticker">
        <img src="${generateBarcodeImage(String(barcode))}" alt="Barcode" 
          onload="this.style.opacity='1'" style="opacity:0; transition: opacity 0.3s;" />
        <div class="sticker-text">${productName}</div>
        <div class="sticker-price">${size}-${formattedPrice}</div>
      </div>
    `;
		})
		.join('')}

  <div class="no-print" style="text-align: center; margin: 20px;">
    <button onclick="window.print()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">
      Print Now
    </button>
    <button onclick="window.close()" style="padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
      Close Window
    </button>
  </div>

  <script>
    window.onload = function() {
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          window.close();
        }, 500);
      }, 300);
    }
    
    window.addEventListener('afterprint', function(event) {
      setTimeout(() => {
        window.close();
      }, 300);
    });
  </script>
</body>
</html>
`);

		printWindow.document.close();
		setIsPrinting(null);
	};

	// Handle quantity input change for specific size
	const handleQuantityChange = (size: string, value: string) => {
		// Allow only numbers
		if (/^\d*$/.test(value)) {
			// Limit to 4 digits maximum
			if (value.length <= 4) {
				setQuantityInputs((prev) => ({...prev, [size]: value}));
				// Clear warning when user starts typing
				if (showWarnings[size]) {
					setShowWarnings((prev) => ({...prev, [size]: false}));
				}
			}
		}
	};

	// Quick set quantity for specific size
	const quickSetQuantity = (size: string, quantity: number) => {
		setQuantityInputs((prev) => ({...prev, [size]: quantity.toString()}));
		if (showWarnings[size]) {
			setShowWarnings((prev) => ({...prev, [size]: false}));
		}
	};

	return (
		<div
			className={deleteModalStyles.modalOverlay}
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-labelledby="barcode-modal-title"
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<div
				className={deleteModalStyles.modalContent}
				onClick={(e) => e.stopPropagation()}
				style={{
					maxWidth: '95vw',
					width: '1100px',
					maxHeight: '95vh',
					height: 'auto',
					padding: '30px',
					margin: 'auto',
					scrollbarWidth: 'thin',
					scrollbarColor: '#ced4da transparent',
					display: 'flex',
					flexDirection: 'column',
				}}
			>
				<h2 id="barcode-modal-title" style={{marginBottom: '10px'}}>
					Barcodes for {productName}
				</h2>
				<p style={{color: '#666', marginBottom: '25px'}}>
					Print barcode labels for each size separately
				</p>

				<div
					style={{
						display: 'grid',
						gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
						gap: '20px',
						maxHeight: 'calc(95vh - 180px)',
						overflowY: 'auto',
						paddingRight: '10px',
						flex: '1',
					}}
				>
					{stocks_size.map((item) => {
						const validation = validateQuantity(item.size);
						const parsedQuantity = parseInt(quantityInputs[item.size] || '0');
						const isValidQuantity = validation.valid;
						const displayQuantity = isValidQuantity ? parsedQuantity : 0;
						const isCurrentPrinting = isPrinting === item.size;

						return (
							<div
								key={item.size}
								style={{
									padding: '20px',
									backgroundColor: '#f8f9fa',
									borderRadius: '12px',
									border: '1px solid #e9ecef',
									display: 'flex',
									flexDirection: 'column',
									height: 'fit-content',
								}}
							>
								<div
									style={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										marginBottom: '15px',
									}}
								>
									<strong style={{fontSize: '18px', fontWeight: '600'}}>Size: {item.size}</strong>
									<span style={{fontSize: '15px', color: '#28a745', fontWeight: '500'}}>
										Stock: {item.stock}
									</span>
								</div>

								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										marginBottom: '20px',
										flex: '1',
									}}
								>
									<img
										src={generateBarcodeImage(item.barcode.toString())}
										alt={`Barcode for size ${item.size}`}
										style={{
											width: '100%',
											height: 'auto',
											maxHeight: '140px',
											border: '1px solid #ddd',
											padding: '15px',
											backgroundColor: 'white',
											borderRadius: '8px',
											objectFit: 'contain',
										}}
									/>
								</div>

								{/* Quantity Input Section */}
								<div style={{marginBottom: '20px'}}>
									<label
										style={{
											display: 'block',
											marginBottom: '8px',
											fontWeight: 'bold',
											color: '#333',
											fontSize: '15px',
										}}
									>
										🖨️ Number of Labels:
									</label>

									<div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
										<input
											type="text"
											value={quantityInputs[item.size] || ''}
											onChange={(e) => handleQuantityChange(item.size, e.target.value)}
											style={{
												flex: '1',
												padding: '12px',
												border: `2px solid ${showWarnings[item.size] ? '#dc3545' : '#007bff'}`,
												borderRadius: '6px',
												fontSize: '16px',
												textAlign: 'center',
												backgroundColor: showWarnings[item.size] ? '#fff5f5' : 'white',
												minWidth: '0',
											}}
											placeholder="Enter quantity"
											onFocus={(e) => e.target.select()}
										/>

										{/* Quick quantity buttons */}
										<div style={{display: 'flex', gap: '6px'}}>
											{[1, 5, 10].map((num) => (
												<button
													type="button"
													key={num}
													onClick={() => quickSetQuantity(item.size, num)}
													style={{
														padding: '10px 14px',
														backgroundColor:
															quantityInputs[item.size] === num.toString() ? '#007bff' : '#6c757d',
														color: 'white',
														border: 'none',
														borderRadius: '6px',
														cursor: 'pointer',
														fontSize: '14px',
														fontWeight: '500',
														minWidth: '44px',
													}}
													disabled={isCurrentPrinting}
												>
													{num}
												</button>
											))}
										</div>
									</div>

									{/* Warning message */}
									{showWarnings[item.size] && (
										<div
											style={{
												marginTop: '10px',
												padding: '8px',
												backgroundColor: '#f8d7da',
												border: '1px solid #f5c6cb',
												borderRadius: '6px',
												color: '#721c24',
												fontSize: '13px',
												textAlign: 'center',
											}}
										>
											⚠️ {validation.valid ? '' : validation.message}
										</div>
									)}
								</div>

								{/* Print Button */}
								<button
									className={`${deleteModalStyles.btn} ${deleteModalStyles.btnDelete}`}
									style={{
										width: '100%',
										padding: '14px',
										fontSize: '16px',
										fontWeight: '600',
										backgroundColor: isCurrentPrinting
											? '#6c757d'
											: isValidQuantity
											? '#28a745'
											: '#6c757d',
										opacity: !isValidQuantity ? 0.6 : 1,
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										gap: '10px',
										borderRadius: '8px',
										border: 'none',
										cursor: isValidQuantity && !isCurrentPrinting ? 'pointer' : 'not-allowed',
										transition: 'all 0.2s ease',
										marginTop: 'auto',
									}}
									onClick={() => handlePrintForSize(item.size, item.barcode)}
									disabled={isCurrentPrinting || !isValidQuantity}
									onMouseOver={(e) => {
										if (isValidQuantity && !isCurrentPrinting) {
											e.currentTarget.style.transform = 'translateY(-2px)';
											e.currentTarget.style.boxShadow = '0 4px 12px rgba(40, 167, 69, 0.3)';
										}
									}}
									onMouseOut={(e) => {
										if (isValidQuantity && !isCurrentPrinting) {
											e.currentTarget.style.transform = 'translateY(0)';
											e.currentTarget.style.boxShadow = 'none';
										}
									}}
								>
									{isCurrentPrinting ? (
										<>
											⏳ Printing {displayQuantity} Label{displayQuantity > 1 ? 's' : ''}...
										</>
									) : (
										<>
											🖨️{' '}
											{isValidQuantity
												? `Print ${displayQuantity} Label${displayQuantity > 1 ? 's' : ''}`
												: 'Print Labels'}
										</>
									)}
								</button>

								{/* Print Status */}
								{isCurrentPrinting && (
									<div
										style={{
											marginTop: '12px',
											padding: '10px',
											backgroundColor: '#fff3cd',
											border: '1px solid #ffeaa7',
											borderRadius: '6px',
											textAlign: 'center',
											color: '#856404',
											fontSize: '13px',
											fontWeight: '500',
										}}
									>
										⏳ Printing {displayQuantity} label{displayQuantity > 1 ? 's' : ''} for size{' '}
										{item.size}...
									</div>
								)}
							</div>
						);
					})}
				</div>

				<div
					className={deleteModalStyles.modalButtons}
					style={{marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #dee2e6'}}
				>
					<button
						className={`${deleteModalStyles.btn} ${deleteModalStyles.btnCancel}`}
						onClick={onClose}
						disabled={!!isPrinting}
						style={{
							width: '100%',
							padding: '14px',
							fontSize: '16px',
							fontWeight: '600',
							borderRadius: '8px',
						}}
					>
						{isPrinting ? 'Close (Printing in progress...)' : 'Close Modal'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default SizeWiseBarcodeModal;
