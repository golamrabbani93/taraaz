'use client';

import React from 'react';
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
}

const SizeWiseBarcodeModal: React.FC<BarcodeModalProps> = ({
	isOpen,
	onClose,
	stocks_size,
	productName,
	price,
}) => {
	if (!isOpen || !stocks_size) return null;

	const stickerCount = 24;
	const stickerHeight = 20; // mm

	const handlePrintForSize = (size: string, barcode: string | number) => {
		const printWindow = window.open('', '_blank');
		if (!printWindow) return;

		const formattedPrice = formatPrice(price);

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
        font-weight: semi-bold;
        margin-top: 3px;
      }
      .sticker-price {
        font-size: 10px;
        margin-top: 2px;
        color: #000;
      }
      @media print { .no-print { display: none; } }
    </style>
  </head>
  <body>
    ${Array.from({length: 1})
			.map(
				() => `
      <div class="sticker">
        <img src="${generateBarcodeImage(String(barcode))}" />
        <div class="sticker-text">${productName} - ${size}</div>
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
				<h2 id="barcode-modal-title">Size-Wise Barcodes for {productName}</h2>

				<div style={{maxHeight: '400px', overflowY: 'auto'}}>
					{stocks_size.map((item) => (
						<div
							key={item.size}
							style={{
								padding: '10px',
								borderBottom: '1px solid #ddd',
								marginBottom: '8px',
							}}
						>
							<strong>Size: {item.size}</strong>
							<br />
							<img
								src={generateBarcodeImage(item.barcode.toString())}
								alt="Barcode"
								style={{maxWidth: '300px', marginTop: '6px'}}
							/>

							<br />
							<button
								className={`${deleteModalStyles.btn} ${deleteModalStyles.btnDelete}`}
								style={{marginTop: '10px'}}
								onClick={() => handlePrintForSize(item.size, item.barcode)}
							>
								Print {item.size} Stickers
							</button>
						</div>
					))}
				</div>

				<div className={deleteModalStyles.modalButtons}>
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

export default SizeWiseBarcodeModal;
