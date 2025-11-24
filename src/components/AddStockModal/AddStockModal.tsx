import React from 'react';
import deleteModalStyles from '../DeleteModal/DeleteModal.module.css';

interface AddStockModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	product: {name: string; stocks: number} | null;
	stockToAdd: number;
	setStockToAdd: (value: number) => void;
	loader?: boolean;
}

const AddStockModal: React.FC<AddStockModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	product,
	stockToAdd,
	setStockToAdd,
	loader,
}) => {
	if (!isOpen) return null;

	return (
		<div
			className={deleteModalStyles.modalOverlay}
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-labelledby="add-stock-modal-title"
		>
			<div className={deleteModalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
				<h2 id="add-stock-modal-title">Add Stock for {product?.name}</h2>
				<div style={{marginBottom: '16px'}}>
					<label htmlFor="stockInput" style={{display: 'block', marginBottom: '8px'}}>
						Quantity to Add
					</label>
					<input
						type="number"
						id="stockInput"
						value={stockToAdd}
						onChange={(e) => setStockToAdd(parseInt(e.target.value) || 0)}
						min="1"
						style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}
					/>
				</div>
				<p>Current Stock: {product?.stocks}</p>
				<div className={deleteModalStyles.modalButtons}>
					<button
						className={`${deleteModalStyles.btn} ${deleteModalStyles.btnCancel}`}
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						className={`${deleteModalStyles.btn} ${deleteModalStyles.btnDelete}`}
						onClick={onConfirm}
						disabled={stockToAdd <= 0}
					>
						{loader ? 'Adding...' : 'Add Stock'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddStockModal;
