'use client';

import React, {useState} from 'react';
import ShortService from '@/components/service/ShortService';

import BlogGridMain from './BlogGridMain';
import Posts from '@/data/Posts.json';
import HeaderFive from '@/components/header/HeaderFive';
import FooterThree from '@/components/footer/FooterThree';
import {useGetAllBlogsQuery} from '@/redux/features/blog/blogApi';
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';
import {IBlog} from '@/types/blog.types';
import BottomNav from '@/components/BottomNav/BottomNav';
import BottomCategory from '@/components/bottom-category/BottomCategory';
import DeskCategory from '@/components/bottom-category/DeskCategory';

export default function BlogGridPage() {
	const {data: Posts, isLoading} = useGetAllBlogsQuery(undefined);
	const [currentPage, setCurrentPage] = useState(1);
	const postsPerPage = 8;

	const totalPages = Math.ceil(Posts?.length / postsPerPage);
	const startIndex = (currentPage - 1) * postsPerPage;
	const currentPosts = Posts?.slice(startIndex, startIndex + postsPerPage);

	const pinnedBlogs = Array.isArray(currentPosts) ? currentPosts.filter((blog) => blog.pin) : [];
	const allBlogs = Array.isArray(currentPosts) ? currentPosts : [];
	// Combine pinned blogs first, then the rest, avoiding duplicates
	const combinedBlogs = [...pinnedBlogs, ...allBlogs.filter((blog) => !pinnedBlogs.includes(blog))];
	if (isLoading) {
		return <DashboardLoader />;
	}
	return (
		<div className="demo-one">
			{/* Header */}
			<HeaderFive />
			<BottomCategory />
			<DeskCategory />
			{/* Separator */}
			<div className="section-seperator bg_light-1">
				<div className="container">
					<hr className="section-seperator" />
				</div>
			</div>

			{/* Blog Grid Section */}
			<div className="rts-blog-area rts-section-gap bg_white bg_gradient-tranding-items">
				<div className="container">
					<div className="row g-5">
						{combinedBlogs?.map((post: IBlog, index: number) => (
							<div key={index} className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
								<div className="single-blog-style-card-border">
									<BlogGridMain
										Slug={post.slug}
										blogImage={post.cover_image}
										blogTitle={post.title}
										timestamp={post.created_at}
										b_title={post.b_title}
									/>
								</div>
							</div>
						))}
					</div>

					{/* Pagination */}
					<div className="row mt--50">
						<div className="col-lg-12">
							<div className="pagination-area-main-wrappper">
								<ul>
									{[...Array(totalPages)].map((_, i) => (
										<li key={i}>
											<button
												className={currentPage === i + 1 ? 'active' : ''}
												onClick={() => setCurrentPage(i + 1)}
											>
												{(i + 1).toString().padStart(2, '0')}
											</button>
										</li>
									))}
									{currentPage < totalPages && (
										<li>
											<button onClick={() => setCurrentPage(currentPage + 1)}>
												<i className="fa-regular fa-chevrons-right" />
											</button>
										</li>
									)}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
			<BottomNav />
			{/* Footer */}
			<ShortService />
			<FooterThree />
		</div>
	);
}
