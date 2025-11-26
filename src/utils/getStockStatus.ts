export const getStockStatus = (stocks_size: {size: string; stock: number; barcode: number}[]) => {
	// 1. Total stock by summing all sizes
	const totalStock = stocks_size.reduce((sum, item) => sum + Number(item.stock || 0), 0);

	// 2. Determine status
	let status = '';
	let badgeClass = '';

	if (totalStock === 0) {
		status = 'Out of Stock';
		badgeClass = 'bg-secondary';
	} else if (totalStock < 10) {
		status = 'Low Stock';
		badgeClass = 'bg-danger';
	} else if (totalStock < 20) {
		status = 'Medium Stock';
		badgeClass = 'bg-warning text-dark';
	} else {
		status = 'In Stock';
		badgeClass = 'bg-success';
	}

	return {
		totalStock,
		status,
		badgeClass,
	};
};
