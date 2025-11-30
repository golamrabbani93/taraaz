import React from 'react';
import deleteModalStyles from '../DeleteModal/DeleteModal.module.css'; // Adjust path

interface SizeModalProps {
	data?: any;
	setSizeData?: (data: string) => void;
	isOpen: boolean;
	onClose: () => void;
	message?: string;
	sizeData?: string;
	setShowSizeModal?: (value: boolean) => void;
}

const SizeModal: React.FC<SizeModalProps> = ({
	data,
	setSizeData,
	isOpen,
	onClose,
	sizeData,
	setShowSizeModal,
}) => {
	if (!isOpen) return null;

	return (
		<div
			className={deleteModalStyles.modalOverlay}
			role="dialog"
			aria-modal="true"
			aria-labelledby="success-modal-title"
		>
			{/* add close icon */}

			<div className={deleteModalStyles.modalContent} onClick={(e) => e.stopPropagation()}>
				<div className="position-relative mb-5">
					<button
						className={'position-absolute top-0 end-0 btn-close m-3 '}
						onClick={() => setShowSizeModal && setShowSizeModal(false)}
						aria-label="Close Size Modal"
					></button>
				</div>
				<h2 id="success-modal-title" className="text-success">
					Please select a size
				</h2>
				<p className="py-5" style={{whiteSpace: 'pre-wrap', fontSize: '20px'}}>
					{data.map((item: any, index: number) => (
						<span
							key={index}
							className={`border mx-3 pt-1 px-3 productSize ${
								sizeData === item.value ? 'productSize-active' : ''
							}`}
							style={{fontSize: '20px', cursor: 'pointer'}}
							onClick={() => {
								if (setSizeData) {
									setSizeData(item.value);
								}
							}}
						>
							{item.value}
						</span>
					))}
				</p>
				<div className={deleteModalStyles.modalButtons}>
					<button className={`rts-btn btn-primary`} onClick={onClose} style={{fontSize: '18px'}}>
						Submit Size
					</button>
				</div>
			</div>
		</div>
	);
};

export default SizeModal;
