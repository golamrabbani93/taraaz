import React from 'react';
import deleteModalStyles from '../DeleteModal/DeleteModal.module.css';

interface BarcodeModalProps {
	isOpen: boolean;
	onClose: () => void;
	product: {name: string; barcode?: string} | null;
	shopName?: string;
}

const BarcodeModal: React.FC<BarcodeModalProps> = ({isOpen, onClose, product, shopName}) => {
	if (!isOpen) return null;

	const stickerCount = 24;
	const stickerHeight = 20; // mm

	const handlePrintStickers = () => {
		if (!product?.barcode) return;

		const printWindow = window.open('', '_blank');
		if (!printWindow) return;

		printWindow.document.write(`
			<html>
			<head>
				<title>Print Stickers</title>
				<style>
					@page { size: A4; margin: 8mm; }
					body { margin: 0; font-family: Arial, sans-serif; }
					.a4-page {
						width: 210mm;
						min-height: 297mm;
						display: grid;
						grid-template-columns: repeat(3, 1fr);
						grid-template-rows: repeat(7, 1fr); /* 21 stickers = 3 x 7 */
						gap: 4mm;
						box-sizing: border-box;
						padding: 8mm;
					}
					.sticker {
						width: 100%;
						height: ${stickerHeight}mm;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						border: 1px dashed #bbb;
						padding: 2mm;
						box-sizing: border-box;
					}
					.sticker img {
						width: 100%;
						height: auto;
					}
					.sticker-text {
						font-size: 10px;
						margin-top: 3px;
						text-align: center;
					}
					.sticker-shop {
						font-size: 8px;
						margin-top: 1px;
						text-align: center;
						color: #555;
					}
					@media print {
						.print-btn { display: none; }
					}
				</style>
			</head>
			<body>
				<div class="a4-page">
					${Array.from({length: stickerCount})
						.map(
							() => `
						<div class="sticker">
							<img src="${product.barcode}" />
							<p class="sticker-text">${product.name}</p>
							${shopName ? `<p class="sticker-shop">${shopName}</p>` : ''}
						</div>
					`,
						)
						.join('')}
				</div>
				<script>
					window.onload = function() {
						window.print();
						setTimeout(() => window.close(), 500);
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
						onClick={handlePrintStickers}
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
