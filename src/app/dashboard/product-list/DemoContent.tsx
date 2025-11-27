'use client';

import DeleteModal from '@/components/DeleteModal/DeleteModal';
import AddStockModal from '@/components/AddStockModal/AddStockModal'; // Adjust path
import BarcodeModal from '@/components/BarcodeModal/BarcodeModal'; // Adjust path
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';
import {
	useDeleteProductMutation,
	useGetAllProductsQuery,
	useUpdateProductMutation,
} from '@/redux/features/product/productApi';
import Link from 'next/link';
import React, {useState, useEffect, use} from 'react';
import DataTable, {TableColumn} from 'react-data-table-component';
import {toast} from 'react-toastify';
import {generateBarcodeImage} from '@/utils/generateBarcodeImage';
import {generateBarcode} from '@/utils/generateBarcode';
import {getStockStatus} from '@/utils/getStockStatus';
import AddSizeStockModal from '@/components/AddStockModal/AddSizeStockModal';
import SizeWiseBarcodeModal from '@/components/BarcodeModal/SizeBarcodeModal';

interface Product {
	id: number;
	name: string;
	original_price: string;
	image1: string;
	pin?: boolean;
	stocks: number;
	barcode?: string;
	isPublish?: boolean;
	stocks_size?: {size: string; stock: number; barcode: number}[];
	isSizeable?: boolean;
}

const ProductTable = () => {
	// Get all product data from database
	const {
		data: productsData,
		isLoading,
		isError,
	} = useGetAllProductsQuery('', {
		refetchOnMountOrArgChange: true,
		refetchOnFocus: true,
		pollingInterval: 10000,
	});

	const [products, setProducts] = useState<Product[]>([]);
	const [filterText, setFilterText] = useState('');
	const [isModalOpen, setModalOpen] = useState(false);
	const [deleteProduct, {isLoading: isDeleting}] = useDeleteProductMutation();
	const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
	const [updateProduct, {isLoading: videoUpdating}] = useUpdateProductMutation();
	const [id, setId] = useState<number | null>(null);
	const [rowsPerPage, setRowsPerPage] = useState<number | 'All'>(10);

	// New states for modals
	const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
	const [selectedProductForStock, setSelectedProductForStock] = useState<Product | null>(null);
	const [stockToAdd, setStockToAdd] = useState<string | number>('');
	const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState(false);
	const [selectedProductForBarcode, setSelectedProductForBarcode] = useState<Product | null>(null);

	const [publishedLoading, setPublishedLoading] = useState(false);
	const [pinLoader, setPinLoader] = useState(false);
	const [selectedSizeAbleProduct, setSelectedSizeAbleProduct] = useState<Product | null>(null);
	const [selectedSizeModalOpen, setSelectedSizeModalOpen] = useState(false);
	const [isSizeModalOpen, setIsSizeModalOpen] = useState(false);
	// Update products state when productsData changes
	useEffect(() => {
		if (productsData && Array.isArray(productsData)) {
			setProducts(productsData);
		}
	}, [productsData]);

	const openDeleteModal = (id: string) => {
		setModalOpen(true);
		setSelectedProductId(id);
	};
	const closeDeleteModal = () => {
		setModalOpen(false);
	};
	const confirmDelete = () => {
		if (!selectedProductId) return;
		deleteProduct(selectedProductId);
		if (!isDeleting) {
			closeDeleteModal();
		}
	};

	// useEffect(() => {
	// 	//update all products barcode

	// 	const updateBarcodes = async () => {
	// 		if (products.length === 0) return;
	// 		for (const product of products) {
	// 			const newBarcode = generateBarcode('11');
	// 			try {
	// 				await updateProduct({
	// 					id: product.id,
	// 					data: {barcode: newBarcode, name: product.name},
	// 				}).unwrap();
	// 				toast.success(`Barcode updated for product: ${product.name}`);
	// 			} catch (error) {
	// 				toast.error(`Failed to update barcode for product: ${product.name}`);
	// 			}
	// 		}
	// 	};
	// 	updateBarcodes();
	// }, [isLoading, products]);
	const handlePinVideo = async (row: Product) => {
		setPinLoader(true);
		// Implement pin video logic here
		setId(row.id);
		const res = await updateProduct({
			id: row.id,
			data: {pin: row?.pin ? false : true, name: row.name},
		}).unwrap();
		if (res?.id) {
			toast.success(`Product ${row?.pin ? 'unpinned' : 'pinned'} successfully`);
			setPinLoader(false);
		}
	};
	const handlePublishToggle = async (row: Product) => {
		setPublishedLoading(true);
		// Implement pin video logic here
		setId(row.id);
		const res = await updateProduct({
			id: row.id,
			data: {isPublish: row?.isPublish ? false : true, name: row.name},
		}).unwrap();
		if (res?.id) {
			toast.success(`Product ${row?.isPublish ? 'unpublished' : 'published'} successfully`);
			setPublishedLoading(false);
		}
	};

	const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFilterText(e.target.value);
	};

	const handleAddStock = (row: Product) => {
		setSelectedProductForStock(row);
		setStockToAdd(''); // Reset input
		setIsAddStockModalOpen(true);
	};

	//barcode modal
	const handleViewBarcode = (row: Product) => {
		const barcodeImage = generateBarcodeImage(row.barcode || '');

		setSelectedProductForBarcode({...row, barcode: barcodeImage});
		setIsBarcodeModalOpen(true);
	};

	const confirmAddStock = async () => {
		if (!selectedProductForStock || parseInt(stockToAdd as string) <= 0) return;
		try {
			const newStock = selectedProductForStock.stocks + parseInt(stockToAdd as string);
			const res = await updateProduct({
				id: selectedProductForStock.id,
				data: {stocks: newStock, name: selectedProductForStock.name},
			}).unwrap();
			if (res?.id) {
				toast.success(`Stock added successfully. New stock: ${newStock}`);
				setIsAddStockModalOpen(false);
			}
		} catch (error) {
			toast.error('Failed to add stock');
		}
	};

	// Define table columns
	const columns: TableColumn<Product>[] = [
		{
			name: 'Product Name',
			selector: (row) => row.name,
			cell: (row) => (
				<div className="item-image-and-name editable">
					<img
						src={row.image1}
						alt="grocery"
						style={{width: '80px', height: '80px', objectFit: 'cover'}}
					/>

					<p>{row.name}</p>
				</div>
			),
		},

		{
			name: 'Price',

			selector: (row) => parseFloat(row.original_price).toFixed(2).split('.')[0],
			cell: (row) => (
				<>
					<span style={{fontWeight: 'bold', fontSize: '16px'}}>
						{parseFloat(row.original_price).toFixed(2).split('.')[0]}
					</span>
					৳
				</>
			),
		},
		{
			name: 'Stocks',
			selector: (row) => row.stocks,
			sortable: true,
			cell: (row) => {
				const {totalStock, status, badgeClass} = getStockStatus(row.stocks_size ?? []);

				return (
					<>
						{row.isSizeable ? (
							<div className="d-flex flex-column align-items-start">
								<span className={`badge ${badgeClass} mb-1`} style={{fontSize: '16px'}}>
									{status} ({totalStock})
								</span>

								<button
									className="btn btn-sm btn-primary mt-2"
									style={{fontSize: '14px', padding: '4px 8px'}}
									title="Add Stock"
									data-bs-toggle="tooltip"
									data-bs-placement="top"
									onClick={() => {
										setSelectedSizeAbleProduct(row);
										setSelectedSizeModalOpen(true);
									}}
								>
									Add Stock
								</button>
							</div>
						) : (
							<div className="d-flex flex-column align-items-start">
								<span
									className={`badge ${
										row.stocks === 0
											? 'bg-secondary'
											: row.stocks < 10
											? 'bg-danger'
											: row.stocks < 20
											? 'bg-warning text-dark'
											: 'bg-success'
									} mb-1`}
									style={{fontSize: '16px'}}
								>
									{row.stocks === 0
										? 'Out of Stock'
										: row.stocks < 10
										? 'Low Stock'
										: row.stocks < 20
										? 'Medium Stock'
										: 'In Stock'}{' '}
									({row.stocks})
								</span>
								<button
									className="btn btn-sm btn-primary mt-2"
									style={{fontSize: '14px', padding: '4px 8px'}}
									title="Add Stock"
									data-bs-toggle="tooltip"
									data-bs-placement="top"
									onClick={() => handleAddStock(row)}
								>
									Add Stock
								</button>
							</div>
						)}
					</>
				);
			},
		},

		{
			name: 'Action',
			cell: (row) => (
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						gap: '8px',
						justifyContent: 'start',
						alignItems: 'start',
					}}
				>
					{row.isSizeable ? (
						<div className="d-flex justify-content-center align-items-center">
							<button
								className="btn btn-outline-info"
								style={{
									height: '36px',
									width: 'max-content',
									fontSize: '14px',
									border: '1px solid #17a2b8',
								}}
								onClick={() => {
									setSelectedSizeAbleProduct(row);
									setIsSizeModalOpen(true);
								}}
							>
								View Barcode
							</button>
							<button
								onClick={() => handlePinVideo(row)}
								className="btn btn-outline-success ms-4"
								type="button"
								style={{
									height: '36px',
									width: 'max-content',
									fontSize: '14px',
									border: '1px solid #28a745',
								}}
							>
								{row?.pin
									? id === row.id && pinLoader
										? 'Unpinning...'
										: 'Unpin Product'
									: id === row.id && pinLoader
									? 'Pinning...'
									: 'Pin Product'}
							</button>
							<button
								onClick={() => handlePublishToggle(row)}
								className="btn btn-outline-warning ms-4"
								type="button"
								style={{
									height: '36px',
									width: 'max-content',
									fontSize: '14px',
									border: '1px solid #ffc107',
								}}
							>
								{row?.isPublish
									? id === row.id && publishedLoading
										? 'Unpublishing...'
										: 'Unpublish'
									: id === row.id && publishedLoading
									? 'Publishing...'
									: 'Publish'}
							</button>
						</div>
					) : (
						<div className="d-flex justify-content-center align-items-center">
							<button
								className="btn btn-outline-info"
								style={{
									height: '36px',
									width: 'max-content',
									fontSize: '14px',
									border: '1px solid #17a2b8',
								}}
								onClick={() => handleViewBarcode(row)}
							>
								View Barcode
							</button>
							<button
								onClick={() => handlePinVideo(row)}
								className="btn btn-outline-success ms-4"
								type="button"
								style={{
									height: '36px',
									width: 'max-content',
									fontSize: '14px',
									border: '1px solid #28a745',
								}}
							>
								{row?.pin
									? id === row.id && pinLoader
										? 'Unpinning...'
										: 'Unpin Product'
									: id === row.id && pinLoader
									? 'Pinning...'
									: 'Pin Product'}
							</button>
							<button
								onClick={() => handlePublishToggle(row)}
								className="btn btn-outline-warning ms-4"
								type="button"
								style={{
									height: '36px',
									width: 'max-content',
									fontSize: '14px',
									border: '1px solid #ffc107',
								}}
							>
								{row?.isPublish
									? id === row.id && publishedLoading
										? 'Unpublishing...'
										: 'Unpublish'
									: id === row.id && publishedLoading
									? 'Publishing...'
									: 'Publish'}
							</button>
						</div>
					)}
					{/* add edit button  */}

					<div className="d-flex justify-content-center align-items-center">
						<Link href={`/dashboard/edit-product/${row.id}`}>
							<button
								className="edit-button btn btn-outline-primary"
								style={{
									height: '36px',
									width: '100px',
									fontSize: '14px',
									border: '1px solid #007bff',
								}}
							>
								Edit
							</button>
						</Link>
						<button
							onClick={() => openDeleteModal(row.id.toString())}
							className="delete-button btn btn-outline-danger ms-4"
							style={{
								height: '36px',
								width: '100px',
								fontSize: '14px',
								border: '1px solid #dc3545',
							}}
						>
							Delete
						</button>
					</div>
				</div>
			),
		},
	];

	const filteredItems = products.filter((item) =>
		item.name.toLowerCase().includes(filterText.toLowerCase()),
	);

	if (isLoading) {
		return <DashboardLoader />;
	}

	if (isError) {
		return <div>Error loading products.</div>;
	}

	return (
		<div className="body-root-inner">
			<div className="transection">
				<div className="title-right-actioin-btn-wrapper-product-list">
					<h3 className="title">Product</h3>
					<div className="button-wrapper">
						<Link href="/dashboard/add-product">
							<button className="rts-btn btn-primary">+ Add Product</button>
						</Link>
					</div>
				</div>
				<div className="product-top-filter-area-l">
					<div className="left-area-button-fiulter">
						<div className="signle-product-single-button">
							<span>All {products.length}</span>
						</div>
					</div>
				</div>
				<div className="vendor-list-main-wrapper product-wrapper">
					<div className="card-body table-product-select">
						<div className="table-responsive">
							<div id="example_wrapper" className="dataTables_wrapper no-footer">
								<div id="example_filter" className="dataTables_filter">
									<label>
										Search:
										<input
											type="search"
											placeholder="Search products..."
											aria-controls="example"
											value={filterText}
											onChange={handleFilter}
										/>
									</label>
								</div>

								<DataTable
									columns={columns}
									data={filteredItems}
									pagination
									paginationPerPage={rowsPerPage === 'All' ? filteredItems.length : rowsPerPage}
									paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 50]}
									paginationComponentOptions={{
										rowsPerPageText: 'Show',
										rangeSeparatorText: 'of',
									}}
									noDataComponent="No products found"
									className="table table-hover dataTable no-footer"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<AddSizeStockModal
				isOpen={selectedSizeModalOpen}
				onClose={() => setSelectedSizeModalOpen(false)}
				product={selectedSizeAbleProduct}
			/>
			<AddStockModal
				isOpen={isAddStockModalOpen}
				onClose={() => setIsAddStockModalOpen(false)}
				onConfirm={confirmAddStock}
				product={selectedProductForStock}
				stockToAdd={stockToAdd}
				setStockToAdd={setStockToAdd}
				loader={videoUpdating}
			/>

			<BarcodeModal
				isOpen={isBarcodeModalOpen}
				onClose={() => setIsBarcodeModalOpen(false)}
				product={selectedProductForBarcode}
			/>
			<SizeWiseBarcodeModal
				isOpen={isSizeModalOpen}
				onClose={() => setIsSizeModalOpen(false)}
				productName={selectedSizeAbleProduct?.name || ''}
				stocks_size={selectedSizeAbleProduct?.stocks_size ?? []}
				price={selectedSizeAbleProduct?.original_price ?? ''}
			/>

			<DeleteModal
				isOpen={isModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDelete}
				itemName="this product"
				loader={isDeleting}
			/>
		</div>
	);
};

export default ProductTable;
