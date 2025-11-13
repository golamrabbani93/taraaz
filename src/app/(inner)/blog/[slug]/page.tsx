'use client';

import ShortService from '@/components/service/ShortService';

import {useParams} from 'next/navigation';
import {useGetAllBlogsQuery} from '@/redux/features/blog/blogApi';
import DashboardLoader from '@/components/Loader/DashboardLoader/DashboardLoader';
import {IBlog} from '@/types/blog.types';
import HeaderFive from '@/components/header/HeaderFive';
import FooterThree from '@/components/footer/FooterThree';
import Link from 'next/link';
import {useAppSelector} from '@/redux/hooks';
import {selectLanguage} from '@/redux/features/language/languageSlice';
import BottomNav from '@/components/BottomNav/BottomNav';
import BottomCategory from '@/components/bottom-category/BottomCategory';
import DeskCategory from '@/components/bottom-category/DeskCategory';

export default function Home() {
	const {slug} = useParams(); // Get the slug from URL parameters
	const {data: Posts, isLoading} = useGetAllBlogsQuery(undefined);
	const blogPost = Posts?.find((post: IBlog) => post.slug === slug);
	const language = useAppSelector(selectLanguage);
	if (isLoading) {
		return <DashboardLoader />;
	}

	return (
		<div className="demo-one">
			<HeaderFive />
			<BottomCategory />
			<DeskCategory />
			<div className="blog-sidebar-area rts-section-gap">
				<div className="container">
					<div className="row">
						{/* Blog Content */}
						<div className="col-lg-8 order-lg-1 order-md-1 order-sm-1 order-1">
							<div className="blog-details-area-1">
								<div className="thumbnail m-auto">
									<img
										src={blogPost.cover_image}
										alt={blogPost.title}
										style={{
											width: '300px',
											height: 'auto',
											objectFit: 'cover',
											margin: 'auto',
											display: 'block',
										}}
									/>
								</div>
								<div className="body-content-blog-details">
									<div className="top-tag-time">
										<div className="single">
											<i className="fa-solid fa-clock" />
											<span>
												{language === 'en'
													? new Date(blogPost.created_at).toLocaleDateString('en-US', {
															year: 'numeric',
															month: 'long',
															day: 'numeric',
													  })
													: new Date(blogPost.created_at).toLocaleDateString('bn-BD', {
															year: 'numeric',
															month: 'long',
															day: 'numeric',
													  })}
											</span>
										</div>
									</div>
									<h1 className="title">{language === 'en' ? blogPost.title : blogPost.b_title}</h1>
									<p className="disc">
										{language === 'en'
											? blogPost.content
											: blogPost.b_content || 'No description available.'}
									</p>

									{/* Author Info */}
									<div className="blog-details-author">
										<div className="thumbnail">
											<img
												src={blogPost.author_image}
												alt=""
												style={{width: '100px', height: '100px', objectFit: 'cover'}}
											/>
										</div>
										<div className="author-information">
											<span>Author</span>
											<h5 className="title">{blogPost.author_name}</h5>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Sidebar */}
						<div className="col-lg-4 pl--60 order-lg-2 order-md-2 order-sm-2 order-2 pl_md--10 pl_sm--10 rts-sticky-column-item">
							<div className="blog-sidebar-single-wized with-title">
								<h4 className="title">{language === 'en' ? 'Latest Post' : 'সর্বশেষ পোস্ট'}</h4>
								<div className="latest-post-small-area-wrapper">
									{[...Posts]?.reverse()?.map((post: IBlog, idx: number) => (
										<div className="single-latest-post-area" key={idx}>
											<Link href={`/blog/${post.slug}`} className="thumbnail">
												<img
													src={post.cover_image}
													alt="thumbnail"
													style={{width: '100px', height: '100px', objectFit: 'cover'}}
												/>
											</Link>
											<div className="inner-content-area">
												<div className="icon-top-area">
													<i className="fa-light fa-clock" />
													<span>
														{language === 'en'
															? new Date(post.created_at).toLocaleDateString('en-US', {
																	year: 'numeric',
																	month: '2-digit',
																	day: 'numeric',
															  })
															: new Date(post.created_at).toLocaleDateString('bn-BD', {
																	year: 'numeric',
																	month: '2-digit',
																	day: 'numeric',
															  })}
													</span>
												</div>
												<Link href={`/blog/${post.slug}`}>
													<h5 className="title-sm-blog">
														{language === 'en' ? post.title : post.b_title}
													</h5>
												</Link>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<BottomNav />
			<ShortService />
			<FooterThree />
		</div>
	);
}
