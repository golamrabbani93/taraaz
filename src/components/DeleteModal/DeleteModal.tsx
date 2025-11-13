import React from 'react';
//module css file
import styles from './DeleteModal.module.css';
interface DeleteModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	itemName?: string; // Optional: name of the item to delete
	loader?: boolean; // Optional: loading state for async operations
}

const DeleteModal: React.FC<DeleteModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	itemName,
	loader,
}) => {
	if (!isOpen) return null;

	return (
		<div
			className={styles.modalOverlay}
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
		>
			<div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
				<h2 id="modal-title">Delete Confirmation</h2>
				<p>Are you sure you want to delete {itemName ? `"${itemName}"` : 'this item'}?</p>
				<div className={styles.modalButtons}>
					<button className={`${styles.btn} ${styles.btnCancel}`} onClick={onClose}>
						Cancel
					</button>
					<button className={`${styles.btn} ${styles.btnDelete}`} onClick={onConfirm}>
						{loader ? 'Deleting...' : 'Delete'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteModal;
