'use client';

import React, {useState, useEffect} from 'react';
import deleteModalStyles from '../DeleteModal/DeleteModal.module.css';
import {formatPrice} from '@/utils/formatPrice';

interface BarcodeModalProps {
	isOpen: boolean;
	onClose: () => void;
	product: {
		name: string;
		barcode?: string;
		original_price?: string | number;
		discount_price?: string | number;
	} | null;
	shopName?: string;
}

const BarcodeModal: React.FC<BarcodeModalProps> = ({isOpen, onClose, product, shopName}) => {
	const [printQuantity, setPrintQuantity] = useState<string>('');
	const [isPrinting, setIsPrinting] = useState(false);
	const [showWarning, setShowWarning] = useState(false);

	useEffect(() => {
		// Reset print quantity when modal opens
		if (isOpen) {
			setPrintQuantity('');
			setIsPrinting(false);
			setShowWarning(false);
		}
	}, [isOpen]);

	if (!isOpen) return null;

	// Validate quantity
	const validateAndPrint = (printFunction: () => void) => {
		const parsedQuantity = parseInt(printQuantity);

		if (!printQuantity.trim()) {
			setShowWarning(true);
			return;
		}

		if (isNaN(parsedQuantity) || parsedQuantity < 1) {
			setShowWarning(true);
			return;
		}

		setShowWarning(false);
		printFunction();
	};

	const handlePrintForSize = () => {
		setIsPrinting(true);

		// Use the print quantity from input
		const quantityToPrint = parseInt(printQuantity);

		const printWindow = window.open('', '_blank');
		if (!printWindow) {
			setIsPrinting(false);
			return;
		}

		const formattedPrice = formatPrice(
			Number(product?.discount_price as string) > 0
				? (product?.discount_price as string)
				: (product?.original_price as string) || '0',
		);

		// Calculate copies per page (thermal printers typically 1 per page)
		const stickersPerPage = 1; // Thermal printer usually 1 sticker per print

		// Calculate number of pages needed
		const pagesNeeded = Math.ceil(quantityToPrint / stickersPerPage);

		printWindow.document.write(`
<html>
<head>
  <title>Thermal Stickers</title>
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
      border-bottom: 1px dashed #ccc;
      page-break-after: always;
    }
    .sticker img {
      width: 90%;
      height: auto;
    }
    .sticker-text {
      font-size: 10px;
      font-weight: 500;
      margin-top: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 90%;
      margin-left: auto;
      margin-right: auto;
    }
    .sticker-price {
      font-size: 10px;
      margin-top: 2px;
      color: #000;
      font-weight: bold;
    }
    .sticker-counter {
      font-size: 8px;
      color: #666;
      margin-top: 3px;
    }
    @media print { 
      .no-print { display: none; } 
      body {
        width: 58mm !important;
      }
      .sticker {
        border-bottom: none;
      }
    }
  </style>
</head>
<body>
  ${Array.from({length: pagesNeeded})
		.map((_, pageIndex) => {
			const stickersOnThisPage = Math.min(
				quantityToPrint - pageIndex * stickersPerPage,
				stickersPerPage,
			);
			return Array.from({length: stickersOnThisPage})
				.map((_, stickerIndex) => {
					const stickerNumber = pageIndex * stickersPerPage + stickerIndex + 1;
					return `
            <div class="sticker">
              <img src="${product?.barcode}" alt="Barcode" onload="this.style.opacity='1'" 
                style="opacity:0; transition: opacity 0.3s;" />
              <div class="sticker-text">${product?.name || ''}</div>
              <div class="sticker-price">${formattedPrice}</div>
              
            </div>
          `;
				})
				.join('');
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
      // Wait for barcode image to load
      setTimeout(() => {
        // Auto-trigger print dialog
        window.print();
        
        // Close window after print
        setTimeout(() => {
          window.close();
        }, 500);
      }, 300);
    }
    
    // Handle print dialog cancel
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
		setIsPrinting(false);
	};

	// Direct thermal printer printing function (alternative method)
	const handleDirectThermalPrint = async () => {
		if (!product?.barcode) return;

		setIsPrinting(true);

		try {
			// Method 1: Try Web Serial API (for USB thermal printers)
			if ('serial' in navigator) {
				const port = await (navigator as any).serial.requestPort();
				await port.open({baudRate: 9600});

				const writer = port.writable.getWriter();

				// ESC/POS commands for thermal printer
				const escposCommands = `
					\x1B\x40
					\x1B\x61\x01
					${product.name}
					\x1B\x45\x01
					BARCODE: ${product.barcode}
					\x1B\x45\x00
					PRICE: ${formatPrice(product?.original_price || '')}
					\x1B\x61\x00
					\n\n\n
					\x1D\x56\x41\x00
				`;

				const encoder = new TextEncoder();
				const data = encoder.encode(escposCommands);

				// Print multiple copies
				const quantityToPrint = parseInt(printQuantity);
				for (let i = 0; i < quantityToPrint; i++) {
					await writer.write(data);
					await new Promise((resolve) => setTimeout(resolve, 500)); // Delay between prints
				}

				writer.releaseLock();
				await port.close();
			}
			// Method 2: Fallback to window printing
			else {
				handlePrintForSize();
			}
		} catch (error) {
			console.error('Direct print error:', error);
			// Fallback to regular print
			handlePrintForSize();
		} finally {
			setIsPrinting(false);
		}
	};

	// Handle input change
	const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		// Allow only numbers
		if (/^\d*$/.test(value)) {
			// Limit to 4 digits maximum
			if (value.length <= 4) {
				setPrintQuantity(value);
				setShowWarning(false); // Clear warning when user starts typing
			}
		}
	};

	// Parse quantity for display
	const parsedQuantity = parseInt(printQuantity);
	const isValidQuantity = !isNaN(parsedQuantity) && parsedQuantity > 0;
	const displayQuantity = isValidQuantity ? parsedQuantity : 0;

	return (
		<div
			className={deleteModalStyles.modalOverlay}
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-labelledby="barcode-modal-title"
		>
			<div className={deleteModalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
				<h2 id="barcode-modal-title">Barcode for {product?.name}</h2>

				<div style={{textAlign: 'center', marginBottom: '16px'}}>
					{product?.barcode ? (
						<img
							src={product.barcode}
							alt="Barcode"
							style={{
								maxWidth: '100%',
								height: 'auto',
								border: '1px solid #ddd',
								padding: '10px',
								backgroundColor: 'white',
							}}
						/>
					) : (
						<p style={{color: '#dc3545', padding: '20px'}}>
							⚠️ No barcode available. Please generate or upload one.
						</p>
					)}
				</div>

				{/* Print Quantity Input */}
				<div
					style={{
						margin: '20px 0',
						padding: '15px',
						backgroundColor: '#f8f9fa',
						borderRadius: '8px',
						border: '1px solid #dee2e6',
					}}
				>
					<label
						htmlFor="printQuantity"
						style={{
							display: 'block',
							marginBottom: '8px',
							fontWeight: 'bold',
							color: '#333',
						}}
					>
						🖨️ Number of Labels to Print:
					</label>

					<div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
						{/* Text input field - starts empty */}
						<input
							type="text"
							id="printQuantity"
							value={printQuantity}
							onChange={handleQuantityChange}
							style={{
								width: '100%',
								padding: '10px',
								border: `2px solid ${showWarning ? '#dc3545' : '#007bff'}`,
								borderRadius: '4px',
								fontSize: '16px',
								textAlign: 'center',
								backgroundColor: showWarning ? '#fff5f5' : 'white',
							}}
							placeholder="Enter quantity"
							onFocus={(e) => e.target.select()}
						/>

						{/* Quick quantity buttons */}
						<div style={{display: 'flex', gap: '5px'}}>
							{[1, 5, 10].map((num) => (
								<button
									type="button"
									key={num}
									onClick={() => {
										setPrintQuantity(num.toString());
										setShowWarning(false);
									}}
									style={{
										padding: '8px 12px',
										backgroundColor: printQuantity === num.toString() ? '#007bff' : '#6c757d',
										color: 'white',
										border: 'none',
										borderRadius: '4px',
										cursor: 'pointer',
										fontSize: '14px',
									}}
								>
									{num}
								</button>
							))}
						</div>
					</div>

					<small
						style={{
							display: 'block',
							marginTop: '8px',
							color: '#666',
							fontSize: '12px',
						}}
					>
						Enter number of barcode labels to print (Minimum: 1, Max: 9999)
					</small>
				</div>

				{/* Warning message */}
				{showWarning && (
					<div
						style={{
							marginTop: '10px',
							padding: '10px',
							backgroundColor: '#f8d7da',
							border: '1px solid #f5c6cb',
							borderRadius: '4px',
							color: '#721c24',
							fontSize: '13px',
							textAlign: 'center',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							gap: '8px',
						}}
					>
						<span style={{fontSize: '16px'}}>⚠️</span>
						<span>Please enter a valid quantity (minimum 1)</span>
					</div>
				)}

				{/* Printer Status */}
				{isPrinting && (
					<div
						style={{
							padding: '10px',
							backgroundColor: '#fff3cd',
							border: '1px solid #ffeaa7',
							borderRadius: '4px',
							marginBottom: '15px',
							textAlign: 'center',
						}}
					>
						<span style={{color: '#856404'}}>
							⏳ Printing {displayQuantity} label{displayQuantity > 1 ? 's' : ''}... Please check
							your printer.
						</span>
					</div>
				)}

				<div
					className={deleteModalStyles.modalButtons}
					style={{flexDirection: 'column', gap: '10px'}}
				>
					{/* Thermal Printer Button (Primary) */}

					{/* Alternative Print Button */}
					<button
						className={`${deleteModalStyles.btn}`}
						onClick={() => validateAndPrint(handlePrintForSize)}
						disabled={!product?.barcode || isPrinting || !isValidQuantity}
						style={{
							backgroundColor: '#007bff',
							color: 'white',
							width: '100%',
							padding: '10px',
							fontSize: '14px',
						}}
					>
						🖨️{' '}
						{isValidQuantity
							? `Print  (${displayQuantity} ${displayQuantity > 1 ? 'labels' : 'label'})`
							: 'Print'}
					</button>

					{/* Close Button */}
					<button
						className={`${deleteModalStyles.btn} ${deleteModalStyles.btnCancel}`}
						onClick={onClose}
						disabled={isPrinting}
						style={{
							width: '100%',
							padding: '10px',
						}}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default BarcodeModal;
