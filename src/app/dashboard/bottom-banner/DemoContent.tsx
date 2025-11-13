'use client';

import DeleteModal from '@/components/DeleteModal/DeleteModal';
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';
import {
	useDeleteBottomBannerMutation,
	useGetAllBottomBannersQuery,
} from '@/redux/features/bottomBanner/bottomBannerApi';
import React, {useState} from 'react';
import DataTable, {TableColumn} from 'react-data-table-component';

interface Banner {
	id: number;
	name: string;
	slug: string;
	image: string | null;
	created_at: string;
	updated_at: string;
}

const BannerTable = () => {
	const {data: banners, isLoading} = useGetAllBottomBannersQuery(undefined);
	const [deleteBanner, {isLoading: isDeleting}] = useDeleteBottomBannerMutation();
	const [isModalOpen, setModalOpen] = useState(false);
	const [selectedBannerId, setSelectedBannerId] = useState<string | null>(null);

	const openDeleteModal = (id: string) => {
		setModalOpen(true);
		setSelectedBannerId(id);
	};
	const closeDeleteModal = () => setModalOpen(false);
	const confirmDelete = () => {
		if (!selectedBannerId) return;
		deleteBanner(selectedBannerId);
		if (!isDeleting) closeDeleteModal();
	};

	const columns: TableColumn<Banner>[] = [
		{
			name: 'Banner Name',
			selector: (row) => row.name,
			cell: (row) => (
				<div className="item-image-and-name editable">
					{row.image ? (
						<img
							src={row.image}
							alt={row.name}
							style={{width: '150px', height: '80px', objectFit: 'contain'}}
						/>
					) : (
						<div
							style={{
								width: '80px',
								height: '80px',
								backgroundColor: '#ddd',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
							No Image
						</div>
					)}
					<p>{row.name}</p>
				</div>
			),
		},
		{
			name: 'Created At',
			selector: (row) => new Date(row.created_at).toLocaleString(),
		},
		{
			name: 'Action',
			cell: (row) => (
				<button
					onClick={() => openDeleteModal(row.id.toString())}
					className="delete-button btn btn-danger"
					style={{height: '36px', width: '100px', fontSize: '14px'}}
				>
					Delete
				</button>
			),
		},
	];
	if (isLoading) return <DashboardLoader />;
	return (
		<div className="body-root-inner">
			<div className="transection">
				<div className="title-right-actioin-btn-wrapper-product-list">
					<h3 className="title">Bottom Banners</h3>
				</div>

				<div className="vendor-list-main-wrapper product-wrapper">
					<div className="table-responsive">
						<DataTable columns={columns} data={banners} noDataComponent="No banners found" />
					</div>
				</div>
			</div>

			{/* Delete modal */}
			<DeleteModal
				isOpen={isModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDelete}
				itemName="this banner"
				loader={isDeleting}
			/>
		</div>
	);
};

export default BannerTable;
