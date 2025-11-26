'use client';

import React from 'react';
import deleteModalStyles from '../DeleteModal/DeleteModal.module.css';
import {formatPrice} from '@/utils/formatPrice';

interface BarcodeModalProps {
	isOpen: boolean;
	onClose: () => void;
	product: {name: string; barcode?: string; original_price?: string | number} | null;
	shopName?: string;
}

const BarcodeModal: React.FC<BarcodeModalProps> = ({isOpen, onClose, product, shopName}) => {
	if (!isOpen) return null;

	const handlePrintForSize = () => {
		const printWindow = window.open('', '_blank');
		if (!printWindow) return;

		const formattedPrice = formatPrice(product?.original_price || '');

		printWindow.document.write(`
  <html>
  <head>
    <title>Thermal Stickers</title>
    <style>
      @page { size: 58mm auto; margin: 0; }
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
      }
      .sticker img {
        width: 90%;
        height: auto;
      }
      .sticker-text {
        font-size: 10px;
        font-weight: 500;
        margin-top: 3px;
      }
      .sticker-price {
        font-size: 10px;
        margin-top: 2px;
        color: #000;
        font-weight:bold;
      }
      @media print { .no-print { display: none; } }
    </style>
  </head>
  <body>
    ${Array.from({length: 1})
			.map(
				() => `
      <div class="sticker">
        <img src="${product?.barcode}" />
        <div class="sticker-text">${product?.name}</div>
        <div class="sticker-price">${formattedPrice}</div>
      </div>
    `,
			)
			.join('')}

    <script>
      window.onload = function() {
        window.print();
        setTimeout(() => window.close(), 300);
      }
    </script>
  </body>
  </html>
  `);

		printWindow.document.close();
	};

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
						<img src={product.barcode} alt="Barcode" style={{maxWidth: '100%', height: 'auto'}} />
					) : (
						<p>No barcode available. Generate or upload one.</p>
					)}
				</div>

				<div className={deleteModalStyles.modalButtons}>
					<button
						className={`${deleteModalStyles.btn} ${deleteModalStyles.btnDelete}`}
						onClick={() => handlePrintForSize()}
						disabled={!product?.barcode}
					>
						Print Barcodes
					</button>

					<button
						className={`${deleteModalStyles.btn} ${deleteModalStyles.btnCancel}`}
						onClick={onClose}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default BarcodeModal;
