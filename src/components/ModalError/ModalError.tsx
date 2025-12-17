import React, {useEffect, useRef} from 'react';
import deleteModalStyles from '../DeleteModal/DeleteModal.module.css';

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
			style={{
				backgroundColor: 'rgba(0, 0, 0, 0.85)',
				backdropFilter: 'blur(5px)',
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
						'0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.2)',
					background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
					animation: 'shakeError 0.5s ease-out, scaleIn 0.3s ease-out',
					position: 'relative',
					overflow: 'hidden',
				}}
			>
				{/* Error Icon Background */}
				<div
					style={{
						position: 'absolute',
						top: '-50px',
						right: '-50px',
						width: '150px',
						height: '150px',
						background:
							'radial-gradient(circle, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.05) 70%, transparent 100%)',
						borderRadius: '50%',
						zIndex: '0',
					}}
				/>

				{/* Error X Icon */}
				<div
					style={{
						width: '80px',
						height: '80px',
						background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
						borderRadius: '50%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						margin: '0 auto 30px',
						boxShadow: '0 10px 30px rgba(220, 38, 38, 0.4)',
						position: 'relative',
						zIndex: '1',
						animation: 'pulseError 2s infinite',
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
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
				</div>

				<h2
					id="error-modal-title"
					style={{
						color: '#ef4444',
						fontSize: '2.5rem',
						fontWeight: '700',
						textAlign: 'center',
						marginBottom: '10px',
						textShadow: '0 2px 10px rgba(239, 68, 68, 0.3)',
						position: 'relative',
						zIndex: '1',
					}}
				>
					Error!
				</h2>

				<p
					className="py-5"
					style={{
						whiteSpace: 'pre-wrap',
						fontSize: '22px',
						textAlign: 'center',
						color: '#f3f4f6',
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

				<div className={deleteModalStyles.modalButtons} style={{marginTop: '20px'}}>
					<button
						className={`${deleteModalStyles.btn} ${deleteModalStyles.btnCancel}`}
						onClick={onClose}
						style={{
							fontSize: '18px',
							fontWeight: '600',
							borderRadius: '12px',
							background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
							color: 'white',
							border: 'none',
							cursor: 'pointer',
							transition: 'all 0.3s ease',
							boxShadow: '0 10px 20px rgba(220, 38, 38, 0.3)',
							minWidth: '180px',
						}}
						onMouseOver={(e) => {
							e.currentTarget.style.transform = 'translateY(-2px)';
							e.currentTarget.style.boxShadow = '0 15px 30px rgba(220, 38, 38, 0.4)';
						}}
						onMouseOut={(e) => {
							e.currentTarget.style.transform = 'translateY(0)';
							e.currentTarget.style.boxShadow = '0 10px 20px rgba(220, 38, 38, 0.3)';
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

				@keyframes shakeError {
					0%,
					100% {
						transform: translateX(0);
					}
					10%,
					30%,
					50%,
					70%,
					90% {
						transform: translateX(-5px);
					}
					20%,
					40%,
					60%,
					80% {
						transform: translateX(5px);
					}
				}

				@keyframes pulseError {
					0%,
					100% {
						box-shadow: 0 10px 30px rgba(220, 38, 38, 0.4);
					}
					50% {
						box-shadow: 0 10px 30px rgba(220, 38, 38, 0.6), 0 0 40px rgba(220, 38, 38, 0.3);
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

export default ModalError;
