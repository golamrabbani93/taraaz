import React, {useState, useRef, useCallback} from 'react';

import './ImageUploader.css';
import Button from './Button';
import Card, {CardContent} from './Card';

export interface UploadedImage {
	id: string;
	file: File | null;
	previewUrl: string;
	name: string;
}

interface ImageUploaderProps {
	uploadedImages: UploadedImage[];
	setUploadedImages: React.Dispatch<React.SetStateAction<UploadedImage[]>>;
	maxImages?: number;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
	uploadedImages,
	setUploadedImages,
	maxImages,
}) => {
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = useCallback((files: FileList | null) => {
		if (!files) return;

		const newImages: UploadedImage[] = [];

		Array.from(files).forEach((file) => {
			if (!file.type.startsWith('image/')) {
				alert('Please select only image files');
				return;
			}

			const previewUrl = URL.createObjectURL(file);
			newImages.push({
				id: Math.random().toString(36).substr(2, 9),
				file,
				previewUrl,
				name: file.name,
			});
		});

		setUploadedImages((prev) => [...prev, ...newImages]);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
			handleFileSelect(e.dataTransfer.files);
		},
		[handleFileSelect],
	);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const removeImage = useCallback((id: string) => {
		setUploadedImages((prev) => {
			const imageToRemove = prev.find((img) => img.id === id);
			if (imageToRemove) {
				URL.revokeObjectURL(imageToRemove.previewUrl);
			}
			return prev.filter((img) => img.id !== id);
		});
	}, []);

	const handleFileInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			handleFileSelect(e.target.files);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		},
		[handleFileSelect],
	);

	const triggerFileInput = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	return (
		<div className="image-uploader-container">
			{maxImages && uploadedImages.length >= maxImages ? (
				''
			) : (
				<div
					className={`upload-area ${isDragging ? 'dragging' : ''}`}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onClick={triggerFileInput}
					role="button"
					tabIndex={0}
					onKeyDown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							triggerFileInput();
						}
					}}
				>
					<div className="upload-icon" aria-hidden="true">
						{/* Simple upload SVG icon */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="lucide lucide-upload-icon lucide-upload"
						>
							<path d="M12 3v12" />
							<path d="m17 8-5-5-5 5" />
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
						</svg>
					</div>
					<p className="upload-text">Drag & drop images here</p>
					<p className="upload-subtext">or click to browse your files</p>
					<Button
						variant="primary"
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							triggerFileInput();
						}}
					>
						Select Images
					</Button>
					<input
						ref={fileInputRef}
						type="file"
						multiple
						accept="image/*"
						onChange={handleFileInputChange}
						className="file-input"
					/>
				</div>
			)}

			{uploadedImages.length > 0 ? (
				<>
					<h3 className="uploaded-title">Uploaded Images ({uploadedImages.length})</h3>
					<div className="images-grid">
						{uploadedImages.map((image) => (
							<Card key={image.id} className="image-card">
								<CardContent className="card-content">
									<div className="image-wrapper">
										<img src={image.previewUrl} alt={image?.file?.name} className="image-preview" />
										<button
											className="remove-btn"
											onClick={() => removeImage(image.id)}
											aria-label={`Remove ${image?.file?.name}`}
											type="button"
										>
											&times;
										</button>
									</div>
									<div className="image-info">
										<p className="image-name" title={image?.file?.name}>
											{image?.file?.name || image.name}
										</p>
										{/* <p className="image-size">{(image?.file?.size / 1024).toFixed(1)} KB</p> */}
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</>
			) : (
				<div className="empty-state">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="64"
						height="64"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="lucide lucide-image-icon lucide-image"
					>
						<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
						<circle cx="9" cy="9" r="2" />
						<path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
					</svg>
					<p className="empty-text">No images uploaded yet</p>
					<p className="empty-subtext">Upload some images to get started</p>
				</div>
			)}
		</div>
	);
};

export default ImageUploader;
