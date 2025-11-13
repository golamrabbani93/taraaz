'use client';

import DeleteModal from '@/components/DeleteModal/DeleteModal';
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';
import {
	useDeleteProductMutation,
	useGetAllProductsQuery,
	useUpdateProductMutation,
} from '@/redux/features/product/productApi';
import {IProduct} from '@/types/product.types';
import Link from 'next/link';
import React, {useState, useEffect} from 'react';
import DataTable, {TableColumn} from 'react-data-table-component';
import {toast} from 'react-toastify';

interface Product {
	id: number;
	name: string;
	original_price: string;
	image1: string;
	pin?: boolean;
}

const ProductTable = () => {
	// Get all product data from database
	const {data: productsData, isLoading, isError} = useGetAllProductsQuery('');

	const [products, setProducts] = useState<Product[]>([]);
	const [filterText, setFilterText] = useState('');
	const [isModalOpen, setModalOpen] = useState(false);
	const [deleteProduct, {isLoading: isDeleting}] = useDeleteProductMutation();
	const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
	const [updateProduct, {isLoading: videoUpdating}] = useUpdateProductMutation();
	const [id, setId] = useState<number | null>(null);
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

	const handlePinVideo = async (row: Product) => {
		// Implement pin video logic here
		setId(row.id);
		const res = await updateProduct({
			id: row.id,
			data: {pin: row?.pin ? false : true, name: row.name},
		}).unwrap();
		if (res?.id) {
			toast.success(`Product ${row?.pin ? 'unpinned' : 'pinned'} successfully`);
		}
	};
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
			name: 'Action',
			cell: (row) => (
				<>
					{/* add edit button  */}
					<button
						onClick={() => handlePinVideo(row)}
						className="edit-button btn btn-success"
						style={{height: '36px', width: '150px', fontSize: '12px', marginRight: '8px'}}
					>
						{row?.pin
							? id === row.id && videoUpdating
								? 'Unpinning...'
								: 'Unpin Product'
							: id === row.id && videoUpdating
							? 'Pinning...'
							: 'Pin Product'}
					</button>
					<Link href={`/dashboard/edit-product/${row.id}`}>
						<button
							className="edit-button btn btn-primary"
							style={{height: '36px', width: '100px', fontSize: '14px'}}
						>
							Edit
						</button>
					</Link>
					<button
						onClick={() => openDeleteModal(row.id.toString())}
						className="delete-button btn btn-danger ms-3"
						style={{height: '36px', width: '100px', fontSize: '14px'}}
					>
						Delete
					</button>
				</>
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
					<div className="right-area-search">
						<input
							type="text"
							placeholder="Search..."
							value={filterText}
							onChange={(e) => setFilterText(e.target.value)}
						/>
					</div>
				</div>
				<div className="vendor-list-main-wrapper product-wrapper">
					<div className="table-responsive">
						<DataTable columns={columns} data={filteredItems} noDataComponent="No products found" />
					</div>
				</div>
			</div>
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
