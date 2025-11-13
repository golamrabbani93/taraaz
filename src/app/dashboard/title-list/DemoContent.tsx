'use client';

import DeleteModal from '@/components/DeleteModal/DeleteModal';
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';
import {
	useDeleteWebsiteTitleMutation,
	useGetAllWebsiteTitlesQuery,
} from '@/redux/features/companyTitle/companyTitle';

import Link from 'next/link';
import React, {useState, useEffect} from 'react';
import DataTable, {TableColumn} from 'react-data-table-component';

interface Company {
	id: number;
	page_name: string;
	title: string;
}

const CompanyTable = () => {
	// Get all company contacts
	const {data: companyData, isLoading, isError} = useGetAllWebsiteTitlesQuery('');

	const [companies, setCompanies] = useState<Company[]>([]);
	const [filterText, setFilterText] = useState('');
	const [isModalOpen, setModalOpen] = useState(false);
	const [deleteCompany, {isLoading: isDeleting}] = useDeleteWebsiteTitleMutation();
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
			name: 'Page Name',
			selector: (row) => row.page_name,
			sortable: true,
		},
		{
			name: 'Title',
			selector: (row) => row.title,
		},

		{
			name: 'Action',
			cell: (row) => (
				<>
					<Link href={`/dashboard/edit-title/${row.id}`}>
						<button
							className="edit-button btn btn-primary"
							style={{height: '36px', width: '50px', fontSize: '14px'}}
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

	const filteredItems = companies.filter((item) =>
		item?.page_name?.toLowerCase().includes(filterText.toLowerCase()),
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
						<h3 className="title">Website Titles</h3>
						<span className="d-block">Do Not Delete Only Update</span>
					</div>
					<div className="button-wrapper d-block">
						<Link href="/dashboard/add-title">
							<button className="rts-btn btn-primary">+ Add Title</button>
						</Link>
					</div>
				</div>
				<div className="product-top-filter-area-l">
					<div className="left-area-button-fiulter">
						<div className="signle-product-single-button">
							<span>All {companies.length}</span>
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
						<DataTable columns={columns} data={filteredItems} noDataComponent="No items found" />
					</div>
				</div>
			</div>
			<DeleteModal
				isOpen={isModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDelete}
				itemName="this Item"
				loader={isDeleting}
			/>
		</div>
	);
};

export default CompanyTable;
