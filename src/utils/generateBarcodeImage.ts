import JsBarcode from 'jsbarcode';

export const generateBarcodeImage = (code: string, options?: {width?: number; height?: number}) => {
	// Create a canvas element
	const canvas = document.createElement('canvas');

	// Generate barcode
	JsBarcode(canvas, code, {
		format: 'CODE128', // Barcode type
		width: options?.width || 3, // Make lines slightly thicker for printing
		height: options?.height || 120, // Taller for better clarity
		displayValue: true, // Show the number under barcode
		fontSize: 20, // Make text readable
		// margin: 5, // Small margin for printing
		background: '#fff', // White background
		lineColor: '#000', // Black lines
	});

	// Convert canvas to high-resolution PNG
	return canvas.toDataURL('image/png');
};
