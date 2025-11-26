export const formatPrice = (price: string | number) => {
	const num = Number(price);

	if (isNaN(num)) return price; // fallback if invalid

	return num.toLocaleString('en-US') + ' tk';
};
