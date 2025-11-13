'use client';

import DeleteModal from '@/components/DeleteModal/DeleteModal';
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';
import {
	useDeleteCategoryMutation,
	useGetAllCategoriesQuery,
} from '@/redux/features/category/categoryApi';

import Link from 'next/link';
import React, {useState, useEffect} from 'react';
import DataTable, {TableColumn} from 'react-data-table-component';

interface Company {
	id: number;
	name: string;
	value: string;
}

const CompanyTable = () => {
	// Get all company contacts
	const {data: companyData, isLoading, isError} = useGetAllCategoriesQuery('');

	const [companies, setCompanies] = useState<Company[]>([]);
	const [filterText, setFilterText] = useState('');
	const [isModalOpen, setModalOpen] = useState(false);
	const [deleteCompany, {isLoading: isDeleting}] = useDeleteCategoryMutation();
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
			name: 'Category Name',
			selector: (row) => row.name,
			sortable: true,
		},
		{
			name: 'Category Value',
			selector: (row) => row.value,
		},

		{
			name: 'Action',
			cell: (row) => (
				<>
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
		item?.name?.toLowerCase().includes(filterText.toLowerCase()),
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
						<h3 className="title">Product Categories</h3>
						<span className="d-block">Do Not Delete Only Update</span>
					</div>
					<div className="button-wrapper d-block">
						<Link href="/dashboard/add-category">
							<button className="rts-btn btn-primary">+ Add Category</button>
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
