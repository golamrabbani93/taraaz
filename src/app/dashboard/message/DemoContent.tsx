'use client';

import DeleteModal from '@/components/DeleteModal/DeleteModal';
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';
import {
	useDeleteMessageMutation,
	useGetAllMessagesQuery,
} from '@/redux/features/message/messageApi';
import React, {useState} from 'react';
import DataTable, {TableColumn} from 'react-data-table-component';
import MessageModal from './MessageModal';

interface Message {
	id: number;
	name: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
	created_at: string;
}

const MessageTable = () => {
	const {
		data: messagesData,
		isLoading,
		isError,
	} = useGetAllMessagesQuery(undefined, {
		refetchOnMountOrArgChange: true,
		pollingInterval: 100000,
	});

	const [filterText, setFilterText] = useState('');
	const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
	const [deleteMessage, {isLoading: isDeleting}] = useDeleteMessageMutation();
	const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);

	const [isModalOpen, setModalOpen] = useState(false);
	const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

	// Delete modal handlers
	const openDeleteModal = (id: string) => {
		setDeleteModalOpen(true);
		setSelectedMessageId(id);
	};
	const closeDeleteModal = () => setDeleteModalOpen(false);
	const confirmDelete = () => {
		if (!selectedMessageId) return;
		deleteMessage(selectedMessageId);
		if (!isDeleting) closeDeleteModal();
	};

	// View message modal handlers
	const openMessageModal = (message: Message) => {
		setSelectedMessage(message);
		setModalOpen(true);
	};
	const closeMessageModal = () => {
		setSelectedMessage(null);
		setModalOpen(false);
	};

	const columns: TableColumn<Message>[] = [
		{name: 'Name', selector: (row) => row.name, sortable: true},
		{name: 'Email', selector: (row) => row.email},
		{name: 'Subject', selector: (row) => row.subject},
		{name: 'Created At', selector: (row) => new Date(row.created_at).toLocaleString()},
		{
			name: 'Action',
			cell: (row) => (
				<>
					<button
						className="btn btn-primary me-4"
						style={{height: '36px', width: '150px', fontSize: '14px'}}
						onClick={() => openMessageModal(row)}
					>
						View
					</button>
					{/* <button
						onClick={() => openDeleteModal(row.id.toString())}
						className="delete-button btn btn-danger"
						style={{height: '36px', fontSize: '14px'}}
					>
						Delete
					</button> */}
				</>
			),
		},
	];

	const filteredItems = messagesData?.filter(
		(item: Message) =>
			item.name.toLowerCase().includes(filterText.toLowerCase()) ||
			item.email.toLowerCase().includes(filterText.toLowerCase()) ||
			item.subject.toLowerCase().includes(filterText.toLowerCase()),
	);

	if (isLoading) return <DashboardLoader />;
	if (isError) return <div>Error loading messages.</div>;

	return (
		<div className="body-root-inner">
			<div className="transection">
				<div className="title-right-actioin-btn-wrapper-product-list">
					<h3 className="title">Messages</h3>
				</div>

				<div className="product-top-filter-area-l">
					<div className="left-area-button-fiulter">
						<div className="signle-product-single-button">
							<span>All {messagesData?.length}</span>
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
						<DataTable columns={columns} data={filteredItems} noDataComponent="No messages found" />
					</div>
				</div>
			</div>

			{/* Delete modal */}
			<DeleteModal
				isOpen={isDeleteModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDelete}
				itemName="this message"
				loader={isDeleting}
			/>

			{/* View message modal */}
			{selectedMessage && (
				<MessageModal
					isOpen={isModalOpen}
					onClose={closeMessageModal}
					messageData={selectedMessage}
				/>
			)}
		</div>
	);
};

export default MessageTable;
