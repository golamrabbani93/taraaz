'use client';

import React from 'react';

interface MessageModalProps {
	isOpen: boolean;
	onClose: () => void;
	messageData: {
		name: string;
		email: string;
		phone?: string;
		subject: string;
		message: string;
		created_at: string;
	};
}

const MessageModal: React.FC<MessageModalProps> = ({isOpen, onClose, messageData}) => {
	if (!isOpen) return null;

	return (
		<div className="modal fade show" style={{display: 'block', background: 'rgba(0,0,0,0.5)'}}>
			<div className="modal-dialog modal-lg">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">Message Details</h5>
						<button type="button" className="btn-close" onClick={onClose}></button>
					</div>
					<div className="modal-body">
						<p>
							<strong>Name:</strong> {messageData.name} <strong>Email:</strong> {messageData.email}
						</p>

						<p>
							<strong>Subject:</strong> {messageData.subject}
						</p>
						<p>
							<strong>Message:</strong> {messageData.message}
						</p>
						<p>
							<strong>Date:</strong> {new Date(messageData.created_at).toLocaleString()}
						</p>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-secondary"
							onClick={onClose}
							style={{height: '36px', fontSize: '14px'}}
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MessageModal;
