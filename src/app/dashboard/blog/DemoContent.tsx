'use client';

import DeleteModal from '@/components/DeleteModal/DeleteModal';
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';
import {
	useDeleteBlogMutation,
	useGetAllBlogsQuery,
	useUpdateBlogMutation,
} from '@/redux/features/blog/blogApi';
import Link from 'next/link';
import React, {useState, useEffect} from 'react';
import DataTable, {TableColumn} from 'react-data-table-component';

interface Blog {
	id: number;
	title: string;
	slug: string;
	cover_image: string;
	author_name: string;
	meta_title: string;
	pin?: boolean;
	content: string;
}

const BlogTable = () => {
	// Get all blogs from API
	const {data: blogsData, isLoading, isError} = useGetAllBlogsQuery('');
	const [blogs, setBlogs] = useState<Blog[]>([]);
	const [filterText, setFilterText] = useState('');
	const [isModalOpen, setModalOpen] = useState(false);
	const [deleteBlog, {isLoading: isDeleting}] = useDeleteBlogMutation();
	const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

	const [updateBlog, {isLoading: blogUpdating}] = useUpdateBlogMutation();
	const [id, setId] = useState<number | null>(null);
	const handlePinBlog = (row: Blog) => {
		// Implement pin blog logic here
		setId(row.id);
		updateBlog({
			id: row.id,
			data: {pin: row?.pin ? false : true, title: row.title, content: row.content},
		});
	};
	useEffect(() => {
		if (blogsData && Array.isArray(blogsData)) {
			setBlogs(blogsData);
		}
	}, [blogsData]);

	// Modal handlers
	const openDeleteModal = (id: string) => {
		setModalOpen(true);
		setSelectedBlogId(id);
	};
	const closeDeleteModal = () => {
		setModalOpen(false);
	};
	const confirmDelete = () => {
		if (!selectedBlogId) return;
		deleteBlog(selectedBlogId);
		closeDeleteModal();
	};

	// Table columns
	const columns: TableColumn<Blog>[] = [
		{
			name: 'Blog Title',
			selector: (row) => row.title,
			cell: (row) => (
				<div className="item-image-and-name editable">
					<img
						src={row.cover_image}
						alt="blog cover"
						style={{width: '80px', height: '80px', objectFit: 'cover'}}
					/>
					<p>{row.title}</p>
				</div>
			),
		},
		// {
		// 	name: 'Author',
		// 	selector: (row) => row.author_name,
		// 	cell: (row) => <span>{row.author_name}</span>,
		// },
		{
			name: 'Meta Title',
			selector: (row) => row.meta_title,
			cell: (row) => <span>{row.meta_title}</span>,
		},
		{
			name: 'Action',
			cell: (row) => (
				<>
					<button
						onClick={() => handlePinBlog(row)}
						className="edit-button btn btn-primary"
						style={{height: '36px', width: '140px', fontSize: '14px', marginRight: '8px'}}
					>
						{row?.pin
							? id === row.id && blogUpdating
								? 'Unpinning...'
								: 'Unpin Blog'
							: id === row.id && blogUpdating
							? 'Pinning...'
							: 'Pin Blog'}
					</button>
					<Link href={`/dashboard/edit-blog/${row.id}`}>
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

	// Filter blogs
	const filteredItems = blogs.filter((item) =>
		item.title.toLowerCase().includes(filterText.toLowerCase()),
	);

	if (isLoading) {
		return <DashboardLoader />;
	}

	if (isError) {
		return <div>Error loading blogs.</div>;
	}

	return (
		<div className="body-root-inner">
			<div className="transection">
				<div className="title-right-actioin-btn-wrapper-product-list">
					<h3 className="title">Blogs</h3>
					<div className="button-wrapper">
						<Link href="/dashboard/add-blog">
							<button className="rts-btn btn-primary">+ Add Blog</button>
						</Link>
					</div>
				</div>

				<div className="product-top-filter-area-l">
					<div className="left-area-button-fiulter">
						<div className="signle-product-single-button">
							<span>All {blogs.length}</span>
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
						<DataTable columns={columns} data={filteredItems} noDataComponent="No blogs found" />
					</div>
				</div>
			</div>

			{/* Delete Modal */}
			<DeleteModal
				isOpen={isModalOpen}
				onClose={closeDeleteModal}
				onConfirm={confirmDelete}
				itemName="this blog"
				loader={isDeleting}
			/>
		</div>
	);
};

export default BlogTable;
