'use client';

import DeleteModal from '@/components/DeleteModal/DeleteModal';
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';
import {useGetAllOrdersQuery} from '@/redux/features/order/orderApi';
import {useDeleteUserMutation, useGetAllUsersQuery} from '@/redux/features/user/userApi';
import {IOrder} from '@/types/order.types';

import Link from 'next/link';
import React, {useState, useEffect} from 'react';
import DataTable, {TableColumn} from 'react-data-table-component';

interface User {
	id: number;
	name: string;
	email: string;
	phone: string;
	address: string;
	role: string;
	is_active: boolean;
	created_at: string;
	image: string | null;
	updated_at: string;
	total_orders?: number;
}

const UserList = () => {
	// Fetch all users
	const {data: usersData, isLoading, isError} = useGetAllUsersQuery(undefined);

	const [users, setUsers] = useState<User[]>([]);
	const [filterText, setFilterText] = useState('');
	const [isModalOpen, setModalOpen] = useState(false);
	const [deleteUser, {isLoading: isDeleting}] = useDeleteUserMutation();
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
	const {data: allOrdersData, isLoading: isLoadingOrders} = useGetAllOrdersQuery(undefined);
	// Update local state when API data changes
	useEffect(() => {
		if (usersData && Array.isArray(usersData)) {
			setUsers(usersData);
		}
	}, [usersData]);

	const openDeleteModal = (id: string) => {
		setModalOpen(true);
		setSelectedUserId(id);
	};
	const closeDeleteModal = () => {
		setModalOpen(false);
	};
	const confirmDelete = () => {
		if (!selectedUserId) return;
		deleteUser(selectedUserId);
		if (!isDeleting) {
			closeDeleteModal();
		}
	};

	const columns: TableColumn<User>[] = [
		{
			name: 'Name',
			selector: (row) => row.name,
			cell: (row) => (
				<div className="item-image-and-name editable">
					<p style={{marginLeft: '10px'}}>{row.name}</p>
				</div>
			),
		},
		{
			name: 'Email',
			selector: (row) => row.email,
		},
		{
			name: 'Phone',
			selector: (row) => row.phone || 'N/A',
		},
		{
			name: 'Total Orders',
			selector: (row) => row.total_orders || 0,
		},
		{
			name: 'Role',
			selector: (row) => row.role,
			cell: (row) => (
				<span style={{fontWeight: 600, color: row.role === 'admin' ? 'blue' : 'green'}}>
					{row.role.toUpperCase()}
				</span>
			),
		},

		// {
		// 	name: 'Action',
		// 	cell: (row) => (
		// 		<>
		// 			<button
		// 				onClick={() => openDeleteModal(row.id.toString())}
		// 				className="delete-button btn btn-danger ms-3"
		// 				style={{height: '36px', width: '100px', fontSize: '14px'}}
		// 			>
		// 				Delete
		// 			</button>
		// 		</>
		// 	),
		// },
	];

	// Filter users by name or email
	const filteredItems = users
		.filter((user) => {
			const matchText =
				user.name.toLowerCase().includes(filterText.toLowerCase()) ||
				user.email.toLowerCase().includes(filterText.toLowerCase());

			return matchText; // ✅ only filter by search text
		})
		.map((user) => {
			const totalOrders =
				allOrdersData?.filter((order: IOrder) => Number(order.user_id) === Number(user.id))
					.length || 0;

			return {
				...user,
				total_orders: totalOrders, // ✅ 0 will also show if no order
			} as User;
		});

	if (isLoading || isLoadingOrders) {
		return <DashboardLoader />;
	}

	if (isError) {
		return <div>Error loading users.</div>;
	}

	return (
		<div className="body-root-inner">
			<div className="transection">
				<div className="title-right-actioin-btn-wrapper-product-list">
					<h3 className="title">Users</h3>
					<div className="button-wrapper">
						{/* <Link href="/dashboard/add-user">
							<button className="rts-btn btn-primary">+ Add User</button>
						</Link> */}
					</div>
				</div>
				<div className="product-top-filter-area-l">
					<div className="left-area-button-fiulter">
						<div className="signle-product-single-button">
							<span>All {users.length}</span>
						</div>
					</div>
					<div className="right-area-search">
						<input
							type="text"
							placeholder="Search by name or email..."
							value={filterText}
							onChange={(e) => setFilterText(e.target.value)}
						/>
					</div>
				</div>
				<div className="vendor-list-main-wrapper product-wrapper">
					<div className="table-responsive">
						<DataTable columns={columns} data={filteredItems} noDataComponent="No users found" />
					</div>
				</div>
			</div>

			{/* Delete modal */}
			<DeleteModal
				isOpen={isModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDelete}
				itemName="this user"
				loader={isDeleting}
			/>
		</div>
	);
};

export default UserList;
