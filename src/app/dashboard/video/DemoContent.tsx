'use client';

import DeleteModal from '@/components/DeleteModal/DeleteModal';
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';
import {
	useDeleteVideoMutation,
	useGetAllVideosQuery,
	useUpdateVideoMutation,
} from '@/redux/features/video/videoApi';
import React, {useState} from 'react';
import DataTable, {TableColumn} from 'react-data-table-component';

interface Video {
	id: number;
	title: string;
	slug: string;
	thumbnail: string;
	video_id: string;
	pin?: boolean;
}

const VideoTable = () => {
	// Example static data (replace with API query if you have one)
	const {data: videos, isLoading} = useGetAllVideosQuery(undefined);
	const [deleteVideo] = useDeleteVideoMutation();
	const [updateVideo, {isLoading: videoUpdating}] = useUpdateVideoMutation();
	const [id, setId] = useState<number | null>(null);
	const handlePinVideo = (row: Video) => {
		// Implement pin video logic here
		setId(row.id);
		updateVideo({id: row.id, pin: row?.pin ? false : true, title: row.title});
	};

	const [isModalOpen, setModalOpen] = useState(false);
	const [selectedVideoId, setSelectedVideoId] = useState<number | null>(null);

	const openDeleteModal = (id: number) => {
		setModalOpen(true);
		setSelectedVideoId(id);
	};

	const closeDeleteModal = () => {
		setModalOpen(false);
	};

	const confirmDelete = () => {
		if (!selectedVideoId) return;
		deleteVideo(selectedVideoId);
		closeDeleteModal();
	};

	const columns: TableColumn<Video>[] = [
		{
			name: 'Thumbnail',
			selector: (row) => row.title,
			cell: (row) => (
				<div className="item-image-and-name editable">
					<img
						src={row.thumbnail}
						alt={row.title}
						style={{width: '80px', height: '60px', objectFit: 'cover', marginRight: '8px'}}
					/>
				</div>
			),
		},
		{
			name: 'Title',
			selector: (row) => row.title,
			cell: (row) => <div className="item-image-and-name editable">{row.title}</div>,
		},
		{
			name: 'Action',
			cell: (row) => (
				<>
					{/* add edit button  */}
					<button
						onClick={() => handlePinVideo(row)}
						className="edit-button btn btn-primary"
						style={{height: '36px', width: '140px', fontSize: '14px', marginRight: '8px'}}
					>
						{row?.pin
							? id === row.id && videoUpdating
								? 'Unpinning...'
								: 'Unpin Video'
							: id === row.id && videoUpdating
							? 'Pinning...'
							: 'Pin Video'}
					</button>
					<button
						onClick={() => openDeleteModal(row.id)}
						className="delete-button btn btn-danger"
						style={{height: '36px', width: '100px', fontSize: '14px'}}
					>
						Delete
					</button>
				</>
			),
		},
	];

	if (isLoading) {
		return <DashboardLoader />;
	}

	return (
		<div className="body-root-inner">
			<div className="transection">
				<div className="title-right-actioin-btn-wrapper-product-list">
					<h3 className="title">Video List</h3>
				</div>
				<div className="vendor-list-main-wrapper product-wrapper">
					<div className="table-responsive">
						<DataTable columns={columns} data={videos} noDataComponent="No videos found" />
					</div>
				</div>
			</div>
			<DeleteModal
				isOpen={isModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDelete}
				itemName="this video"
				loader={false}
			/>
		</div>
	);
};

export default VideoTable;
