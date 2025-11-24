import React from 'react';
import deleteModalStyles from '../DeleteModal/DeleteModal.module.css'; // Adjust path

interface ModalErrorProps {
	isOpen: boolean;
	onClose: () => void;
	message: string;
}

const ModalError: React.FC<ModalErrorProps> = ({isOpen, onClose, message}) => {
	if (!isOpen) return null;

	return (
		<div
			className={deleteModalStyles.modalOverlay}
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-labelledby="error-modal-title"
		>
			<div className={deleteModalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
				<h2 id="error-modal-title">Error</h2>
				<p>{message}</p>
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

export default ModalError;
