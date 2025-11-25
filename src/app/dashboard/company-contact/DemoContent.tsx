'use client';

import DeleteModal from '@/components/DeleteModal/DeleteModal';
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';
import {
	useDeleteCompanyContactMutation,
	useGetAllCompanyContactsQuery,
} from '@/redux/features/companyContact/companyContact';

import Link from 'next/link';
import React, {useState, useEffect} from 'react';
import DataTable, {TableColumn} from 'react-data-table-component';

interface Company {
	id: number;
	company_name: string;
	phone: string;
	email: string;
	address: string;
	city: string;
	country: string;
}

const CompanyTable = () => {
	// Get all company contacts
	const {data: companyData, isLoading, isError} = useGetAllCompanyContactsQuery('');

	const [companies, setCompanies] = useState<Company[]>([]);
	const [filterText, setFilterText] = useState('');
	const [isModalOpen, setModalOpen] = useState(false);
	const [deleteCompany, {isLoading: isDeleting}] = useDeleteCompanyContactMutation();
	const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

	// Update companies state when data changes
	useEffect(() => {
		if (companyData && Array.isArray(companyData)) {
			setCompanies(companyData);
		}
	}, [companyData]);

	const openDeleteModal = (id: string) => {
		setModalOpen(true);
		setSelectedCompanyId(id);
	};
	const closeDeleteModal = () => {
		setModalOpen(false);
	};
	const confirmDelete = () => {
		if (!selectedCompanyId) return;
		deleteCompany(selectedCompanyId);
		if (!isDeleting) {
			closeDeleteModal();
		}
	};

	const columns: TableColumn<Company>[] = [
		{
			name: 'Company Name',
			selector: (row) => row.company_name,
			sortable: true,
		},
		{
			name: 'Phone',
			selector: (row) => row.phone,
		},
		{
			name: 'Email',
			selector: (row) => row.email,
		},
		{
			name: 'Address',
			cell: (row) => <>{row.address}</>,
		},
		{
			name: 'Action',
			cell: (row) => (
				<>
					<Link href={`/dashboard/edit-company/${row.id}`}>
						<button
							className="edit-button btn btn-primary"
							style={{height: '36px', width: '50px', fontSize: '14px'}}
						>
							Edit
						</button>
					</Link>
					{/* <button
						onClick={() => openDeleteModal(row.id.toString())}
						className="delete-button btn btn-danger ms-3"
						style={{height: '36px', width: '100px', fontSize: '14px'}}
					>
						Delete
					</button> */}
				</>
			),
		},
	];

	const filteredItems = companies.filter((item) =>
		item.company_name.toLowerCase().includes(filterText.toLowerCase()),
	);

	if (isLoading) {
		return <DashboardLoader />;
	}

	if (isError) {
		return <div>Error loading companies.</div>;
	}

	return (
		<div className="body-root-inner">
			<div className="transection">
				<div className="title-right-actioin-btn-wrapper-product-list">
					<div>
						<h3 className="title">Company Contacts</h3>
					</div>
					{/* <div className="button-wrapper d-block">
						<Link href="/dashboard/add-company">
							<button className="rts-btn btn-primary">+ Add Company</button>
						</Link>
					</div> */}
				</div>
				<div className="product-top-filter-area-l">
					{/* <div className="left-area-button-fiulter">
						<div className="signle-product-single-button">
							<span>All {companies.length}</span>
						</div>
					</div> */}
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
						<DataTable
							columns={columns}
							data={filteredItems}
							noDataComponent="No companies found"
						/>
					</div>
				</div>
			</div>
			<DeleteModal
				isOpen={isModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDelete}
				itemName="this company"
				loader={isDeleting}
			/>
		</div>
	);
};

export default CompanyTable;
