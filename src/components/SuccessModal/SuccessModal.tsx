import React from 'react';
import deleteModalStyles from '../DeleteModal/DeleteModal.module.css'; // Adjust path

interface SuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({isOpen, onClose, message}) => {
	if (!isOpen) return null;

	return (
		<div
			className={deleteModalStyles.modalOverlay}
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-labelledby="success-modal-title"
		>
			<div className={deleteModalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
				<h2 id="success-modal-title">Success</h2>
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

export default SuccessModal;
