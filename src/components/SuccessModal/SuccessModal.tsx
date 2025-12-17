import React, {useEffect, useRef} from 'react';
import deleteModalStyles from '../DeleteModal/DeleteModal.module.css';

interface SuccessModalProps {
	isOpen: boolean;
	onClose: () => void;
	message: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({isOpen, onClose, message}) => {
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (isOpen) {
			timerRef.current = setTimeout(() => {
				onClose();
			}, 1500);
		}

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div
			className={deleteModalStyles.modalOverlay}
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-labelledby="success-modal-title"
			style={{
				backgroundColor: 'rgba(0, 0, 0, 0.8)',
				backdropFilter: 'blur(4px)',
			}}
		>
			<div
				className={deleteModalStyles.modalContent}
				onClick={(e) => e.stopPropagation()}
				style={{
					maxWidth: '600px',
					width: '90vw',
					padding: '40px',
					borderRadius: '20px',
					border: 'none',
					boxShadow:
						'0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(74, 222, 128, 0.2), 0 0 30px rgba(74, 222, 128, 0.1)',
					background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
					animation: 'scaleIn 0.3s ease-out',
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				{/* Success Icon */}
				<div
					style={{
						position: 'absolute',
						top: '-50px',
						right: '-50px',
						width: '150px',
						height: '150px',
						background:
							'radial-gradient(circle, rgba(74, 222, 128, 0.1) 0%, rgba(74, 222, 128, 0.05) 70%, transparent 100%)',
						borderRadius: '50%',
						zIndex: '0',
					}}
				/>

				{/* Checkmark Icon */}
				<div
					style={{
						width: '80px',
						height: '80px',
						background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
						borderRadius: '50%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						margin: '0 auto 30px',
						boxShadow: '0 10px 30px rgba(16, 185, 129, 0.3)',
						position: 'relative',
						zIndex: '1',
						animation: 'pulseSuccess 2s infinite',
					}}
				>
					<svg
						width="40"
						height="40"
						viewBox="0 0 24 24"
						fill="none"
						stroke="white"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polyline points="20 6 9 17 4 12"></polyline>
					</svg>
				</div>

				<h2
					id="success-modal-title"
					style={{
						color: '#10b981',
						fontSize: '2.5rem',
						fontWeight: '700',
						textAlign: 'center',
						marginBottom: '10px',
						textShadow: '0 2px 10px rgba(16, 185, 129, 0.2)',
						position: 'relative',
						zIndex: '1',
					}}
				>
					Success!
				</h2>

				<p
					className="py-5"
					style={{
						whiteSpace: 'pre-wrap',
						fontSize: '22px',
						textAlign: 'center',
						color: '#1e293b',
						lineHeight: '1.6',
						margin: '20px 0',
						padding: '0 10px',
						position: 'relative',
						zIndex: '1',
						fontWeight: '500',
					}}
				>
					{message}
				</p>

				{/* Auto-close Timer Bar */}
				<div
					style={{
						width: '100%',
						height: '6px',
						background: 'rgba(16, 185, 129, 0.2)',
						borderRadius: '3px',
						margin: '30px 0 20px',
						overflow: 'hidden',
						position: 'relative',
					}}
				>
					<div
						style={{
							width: '100%',
							height: '100%',
							background: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)',
							borderRadius: '3px',
							animation: 'shrinkBar 1.5s linear forwards',
							transformOrigin: 'left center',
						}}
					/>
				</div>

				<div className={deleteModalStyles.modalButtons} style={{marginTop: '20px'}}>
					<button
						className={`${deleteModalStyles.btn} ${deleteModalStyles.btnCancel}`}
						onClick={onClose}
						style={{
							fontSize: '18px',
							fontWeight: '600',
							borderRadius: '12px',
							background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
							color: 'white',
							border: 'none',
							cursor: 'pointer',
							transition: 'all 0.3s ease',
							boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)',
							minWidth: '180px',
						}}
						onMouseOver={(e) => {
							e.currentTarget.style.transform = 'translateY(-2px)';
							e.currentTarget.style.boxShadow = '0 15px 30px rgba(16, 185, 129, 0.4)';
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.transform = 'translateY(0)';
							e.currentTarget.style.boxShadow = '0 10px 20px rgba(16, 185, 129, 0.3)';
						}}
					>
						Close
					</button>
				</div>
			</div>

			<style jsx global>{`
				@keyframes scaleIn {
					from {
						opacity: 0;
						transform: scale(0.9);
					}
					to {
						opacity: 1;
						transform: scale(1);
					}
				}

				@keyframes pulseSuccess {
					0%,
					100% {
						box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
					}
					50% {
						box-shadow: 0 10px 30px rgba(16, 185, 129, 0.5), 0 0 40px rgba(16, 185, 129, 0.2);
					}
				}

				@keyframes shrinkBar {
					from {
						transform: scaleX(1);
					}
					to {
						transform: scaleX(0);
					}
				}

				@media (max-width: 640px) {
					div[style*='max-width: 600px'] {
						width: 95vw !important;
						padding: 30px 20px !important;
					}

					h2[style*='font-size: 2.5rem'] {
						font-size: 2rem !important;
					}

					p[style*='font-size: 22px'] {
						font-size: 18px !important;
					}
				}
			`}</style>
		</div>
	);
};

export default SuccessModal;
