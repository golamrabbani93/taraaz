'use client';

import {useGetAllOrdersQuery} from '@/redux/features/order/orderApi';
import Link from 'next/link';
import React, {useState, useCallback, ChangeEvent} from 'react';
import DataTable, {TableColumn} from 'react-data-table-component';

interface DataRow {
	id: number;
	orderNo: string;
	customer: string;
	email: string;
	phone: string;
	address: string;
	date: string;
	amount: string;
	status: string;
	paymentStatus: string;
	paymentMethod: string;
	provider: string;
}
const DemoContent: React.FC = () => {
	const {
		data: orders,
		isLoading,
		isFetching,
	} = useGetAllOrdersQuery(undefined, {
		refetchOnMountOrArgChange: true,
		pollingInterval: 100000, // Refetch data every 100 seconds
	});
	const [filterText, setFilterText] = useState('');
	const [rowsPerPage, setRowsPerPage] = useState<number>(20);
	const [activeFilter, setActiveFilter] = useState<string>('All');

	const filteredOrders = orders?.filter((order: any) => {
		if (activeFilter === 'All') return true;
		return order.order_status.toLowerCase() === activeFilter.toLowerCase();
	});
	// ✅ Transform API orders into DataRow[]
	const data: DataRow[] =
		filteredOrders?.map((order: any) => ({
			id: order.id,
			orderNo: `#${order.id}`,
			customer: order.customer_name,
			email: order.customer_email,
			phone: order.customer_phone,
			address: order.delivery_address,
			date: new Date(order.created_at).toLocaleDateString(),
			amount: `${order.total_amount} ${order.payment_currency || 'BDT'}`,
			status: order.order_status,
			paymentStatus: order.payment_status,
			paymentMethod: order.payment_method,
			provider: order.provider,
		})) || [];

	const columns: TableColumn<DataRow>[] = [
		{
			name: 'Order No',
			selector: (row) => row.orderNo,
			sortable: true,
			cell: (row) => <p style={{color: 'var(--color-primary)', fontWeight: 600}}>{row.orderNo}</p>,
		},
		{
			name: 'Customer',
			selector: (row) => row.customer,
			sortable: true,
			cell: (row) => (
				<div>
					<p style={{fontWeight: 500}}>{row.customer}</p>
				</div>
			),
		},
		{
			name: 'Date',
			selector: (row) => row.date,
			sortable: true,
		},
		{
			name: 'Amount',
			selector: (row) => row.amount,
			sortable: true,
		},
		{
			name: 'Order Status',
			selector: (row) => row.status,
			sortable: true,
			cell: (row) => (
				<span
					style={{
						color:
							row.status === 'cancelled'
								? '#dc3545'
								: row.status === 'pending'
								? '#ffc107'
								: '#28a745',
						fontWeight: 600,
					}}
				>
					{row.status.toUpperCase()}
				</span>
			),
		},
		{
			name: 'Action',
			selector: (row) => row.status,
			sortable: true,
			cell: (row) => (
				<Link
					href={`/dashboard/order/${row.id}`}
					className="btn  btn-primary"
					style={{padding: '5px 10px', fontSize: '14px'}}
				>
					View Details
				</Link>
			),
		},
	];

	const handleFilter = (e: ChangeEvent<HTMLInputElement>) => {
		setFilterText(e.target.value);
	};

	const filteredItems = data.filter(
		(item) =>
			item.customer.toLowerCase().includes(filterText.toLowerCase()) ||
			item.orderNo.toLowerCase().includes(filterText.toLowerCase()) ||
			item.status.toLowerCase().includes(filterText.toLowerCase()) ||
			item.paymentStatus.toLowerCase().includes(filterText.toLowerCase()),
	);

	const handleRowsPerPageChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setRowsPerPage(parseInt(e.target.value, 10));
	};

	const handleFilterChange = (filter: string) => {
		setActiveFilter(filter);
	};

	return (
		<div className="body-root-inner">
			<div className="transection">
				<div className="title-right-actioin-btn-wrapper-product-list">
					<h3 className="title">Orders Overview</h3>
				</div>

				<div className="product-top-filter-area-l">
					<div className="left-area-button-fiulter order">
						{['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'].map((filter) => (
							<button
								key={filter}
								className={`signle-product-single-button ${
									activeFilter === filter ? 'active' : ''
								}`}
								onClick={() => handleFilterChange(filter)}
							>
								<span>{filter}</span>
							</button>
						))}
					</div>
				</div>

				<div className="vendor-list-main-wrapper product-wrapper">
					<div className="card-body table-product-select">
						<div className="table-responsive">
							<div id="example_wrapper" className="dataTables_wrapper no-footer">
								<div className="dataTables_length" id="example_length">
									<label>
										Show{' '}
										<select
											name="example_length"
											aria-controls="example"
											value={rowsPerPage}
											onChange={handleRowsPerPageChange}
										>
											{[5, 10, 15, 20, 25, 50, 'All'].map((option) => (
												<option key={option} value={option}>
													{option}
												</option>
											))}
										</select>{' '}
										entries
									</label>
								</div>
								<div id="example_filter" className="dataTables_filter">
									<label>
										Search:
										<input
											type="search"
											placeholder="Search orders..."
											aria-controls="example"
											value={filterText}
											onChange={handleFilter}
										/>
									</label>
								</div>

								<DataTable
									columns={columns}
									data={filteredItems.reverse()}
									pagination
									paginationPerPage={rowsPerPage}
									paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 50]}
									paginationComponentOptions={{
										rowsPerPageText: 'Show',
										rangeSeparatorText: 'of',
									}}
									noDataComponent="No orders found"
									className="table table-hover dataTable no-footer"
									progressPending={isLoading || isFetching}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DemoContent;
