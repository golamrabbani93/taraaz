import {selectLanguage} from '@/redux/features/language/languageSlice';
import {useAppSelector} from '@/redux/hooks';
import React, {useState} from 'react';
import Lottie from 'lottie-react'; // Import Lottie for React
import flowerAnimation from './Confetti.json'; // Replace with your Lottie JSON file path (e.g., a blooming flower or floating petals)

const fullScreenAnimationStyle: React.CSSProperties = {
	position: 'fixed',
	top: 0,
	left: 0,
	width: '100vw',
	height: '100vh',
	zIndex: 999, // High z-index to be above other page elements, but below modal
	pointerEvents: 'none', // Prevent interaction
	backgroundColor: 'rgba(0,0,0,0.9)', // Optional: light overlay to enhance visibility
};

const modalOverlayStyle: React.CSSProperties = {
	position: 'fixed',
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	// backgroundColor: 'rgba(0,0,0,0.9)',
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	zIndex: 1000, // Higher than animation to overlay on top
};

const modalStyle: React.CSSProperties = {
	backgroundColor: 'white',
	padding: '20px 30px',
	borderRadius: 8,
	maxWidth: 500,
	width: '90%',
	// boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
	position: 'relative',
};

const closeButtonStyle: React.CSSProperties = {
	position: 'absolute',
	top: 10,
	right: 15,
	fontSize: 20,
	fontWeight: 'bold',
	color: '#333',
	cursor: 'pointer',
	border: 'none',
	background: 'none',
};

interface ModalProps {
	onClose: () => void;
	children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({onClose, children}) => {
	// Prevent click inside modal from closing it
	const onModalClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	return (
		<div style={modalOverlayStyle} onClick={onClose}>
			<div style={modalStyle} onClick={onModalClick} className="success-modal">
				{/* <button style={closeButtonStyle} onClick={onClose} aria-label="Close modal">
					&times;
				</button> */}
				{children}
			</div>
		</div>
	);
};

const SuccessModal: React.FC = () => {
	const language = useAppSelector(selectLanguage);
	const [isModalOpen, setModalOpen] = useState(false);

	const closeModal = () => {
		setModalOpen(false);
		window.location.href = '/';
	};

	return (
		<>
			{/* Full-Screen Flower Animation Background */}
			{isModalOpen && (
				<div style={fullScreenAnimationStyle}>
					<Lottie
						animationData={flowerAnimation}
						loop={true} // Loop for continuous effect
						autoplay={true}
						style={{width: '100vw', height: '100vh'}}
						className="lottie"
					/>
				</div>
			)}

			<button id="open-modal" onClick={() => setModalOpen(true)} style={{display: 'none'}}>
				Open Modal
			</button>

			{isModalOpen && (
				<Modal onClose={() => closeModal()}>
					<h2 className="modal-header">
						{language === 'bn'
							? 'আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে!'
							: 'Your Order has been placed successfully!'}
					</h2>
					<p className="modal-message">
						{language === 'bn'
							? 'আমাদের সাথে কেনাকাটা করার জন্য ধন্যবাদ।'
							: 'Thank you for shopping with us.'}
					</p>
					<button className="rts-btn btn-primary ms-auto" onClick={() => closeModal()}>
						{language === 'bn' ? 'বন্ধ করুন' : 'Close'}
					</button>
				</Modal>
			)}
		</>
	);
};

export default SuccessModal;
