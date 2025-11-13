'use client';

import {useEffect, useState} from 'react';
import ShortService from '@/components/service/ShortService';
import RelatedProduct from '@/components/product/RelatedProduct';
import {useParams} from 'next/navigation';

import {useCart} from '@/components/header/CartContext';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HeaderFive from '@/components/header/HeaderFive';
import FooterThree from '@/components/footer/FooterThree';
import {useWishlist} from '@/components/header/WishlistContext';
import {useGetAllProductsQuery} from '@/redux/features/product/productApi';
import {IProduct} from '@/types/product.types';
import MainLoader from '@/components/Loader/MainLoader/MainLoader';
import {useAppSelector} from '@/redux/hooks';
import {selectLanguage} from '@/redux/features/language/languageSlice';
import FAQ from '@/components/FAQ/FAQ';
import BottomNav from '@/components/BottomNav/BottomNav';
import BottomCategory from '@/components/bottom-category/BottomCategory';
import DeskCategory from '@/components/bottom-category/DeskCategory';
import ProductVisitCount from '@/components/VisitorCount/ProductVisitCount';
import ProductFAQ from '@/components/FAQ/ProductFAQ';

const CompareElements: React.FC = () => {
	const {slug} = useParams(); // Get the slug from URL parameters
	const {data: products, isLoading} = useGetAllProductsQuery(undefined);
	const blogPost = products?.find((post: IProduct) => post.slug === slug);
	const [quantity, setQuantity] = useState(1);
	const {addToWishlist} = useWishlist();
	const [wishlisted, setWishlisted] = useState(false);
	const originalPrice = blogPost?.original_price?.split('.')[0] || '0'; // Default to '0' if undefined
	const {addToCart} = useCart();
	const [added, setAdded] = useState(false);
	const language = useAppSelector(selectLanguage);
	const handleAdd = () => {
		addToCart({
			id: blogPost?.id,
			image: `${blogPost.image1}`,
			title: blogPost?.name ?? 'Default Product Title',
			price: blogPost?.discount_price > 0 ? blogPost.discount_price : Number(originalPrice),
			quantity: quantity,
			b_name: blogPost?.b_name,
			active: true,
		});
		setAdded(true);
		toast(language === 'en' ? 'Successfully Add To Cart !' : 'কার্টে সফলভাবে যোগ করা হয়েছে !');
		setTimeout(() => setAdded(false), 5000);
	};

	const handleWishlist = () => {
		addToWishlist({
			id: blogPost.id,
			image: blogPost.image1,
			title: blogPost.name ?? 'Default Product Title',
			price: blogPost?.discount_price > 0 ? blogPost.discount_price : Number(originalPrice),
			quantity: quantity,
			b_name: blogPost?.b_name,
		});
		setWishlisted(true);
		setQuantity(1);
		setTimeout(() => setWishlisted(false), 3000);
	};
	const wishList = () =>
		toast(
			language === 'en'
				? 'Successfully Add To Wishlist !'
				: 'পছন্দের তালিকায় সফলভাবে যোগ করা হয়েছে !',
		);
	const [thumbnails, setThumbnails] = useState<{id: number; src: string; alt: string}[]>([]);

	const [activeImage, setActiveImage] = useState(blogPost?.image1);
	useEffect(() => {
		setActiveImage(blogPost?.image1);

		const thumbnails = Object.entries(blogPost ?? {})
			.filter(([key, value]) => /^image\d+$/.test(key) && value) // keys like image1, image2 with non-null value
			.map(([key, value], index) => ({
				id: index,
				src: value as string,
				alt: `Thumbnail ${index + 1}`,
			}));
		setThumbnails(thumbnails);
	}, [blogPost]);

	if (isLoading) {
		return <MainLoader />;
	}
	return (
		<div>
			<ProductVisitCount id={blogPost?.id} />
			<HeaderFive />
			<BottomCategory />
			<DeskCategory />
			<div className="section-seperator bg_light-1">
				<div className="container">
					<hr className="section-seperator" />
				</div>
			</div>

			<div className="rts-chop-details-area rts-section-gap bg_light-1">
				<div className="container">
					<div className="shopdetails-style-1-wrapper">
						<div className="row g-5">
							<div className="col-xl-8 col-lg-8 col-md-12">
								<div className="product-details-popup-wrapper in-shopdetails">
									<div className="rts-product-details-section rts-product-details-section2 product-details-popup-section">
										<div className="product-details-popup">
											<div className="details-product-area">
												<div className="product-thumb-area">
													<div className="cursor" />
													<div className="thumb-wrapper one filterd-items figure">
														<div className="product-thumb">
															<img src={activeImage} alt={blogPost?.name} />
														</div>
													</div>
													<div className="product-thumb-filter-group">
														{thumbnails?.map((thumb) => (
															<div
																key={thumb.id}
																className={`thumb-filter filter-btn ${
																	activeImage === thumb.src ? 'active' : ''
																}`}
																onClick={() => setActiveImage(thumb.src)}
																style={{cursor: 'pointer'}}
															>
																<img src={thumb.src} alt={thumb.alt} />
															</div>
														))}
													</div>
												</div>

												<div className="contents">
													<div className="product-status">
														{/* <span className="product-catagory">{blogPost?.type}</span> */}
														{/* <div className="rating-stars-group">
															<div className="rating-star">
																<i className="fas fa-star" />
															</div>
															<div className="rating-star">
																<i className="fas fa-star" />
															</div>
															<div className="rating-star">
																<i className="fas fa-star-half-alt" />
															</div>
															<span>{blogPost.reviews.length} Reviews</span>
														</div> */}
													</div>
													<h2 className="product-title">
														{language === 'en' ? blogPost.name : blogPost.b_name}
													</h2>
													<p className="mt--20 mb--20">
														{language === 'en' ? blogPost.description : blogPost.b_description}
													</p>
													<span
														className="product-price mb--15 d-block"
														style={{color: '#DC2626', fontWeight: 600}}
													>
														{blogPost.discount_price > 0
															? blogPost.discount_price
															: blogPost.original_price.split('.')[0]}{' '}
														<span className="tk">৳</span>
														{blogPost.discount_price > 0 && (
															<>
																<span className="old-price ml--15">
																	{blogPost.original_price.split('.')[0]}
																</span>
																<span className="tk" style={{color: '#cfcfcf'}}>
																	৳
																</span>
															</>
														)}
													</span>

													<div className="product-uniques">
														{/* <span className="sku product-unipue mb--10">
															<strong>ID:</strong> {blogPost.id}
														</span> */}
														{/* <span className="catagorys product-unipue mb--10">
															<strong>Categories:</strong> {blogPost.categories.join(', ')}
														</span> */}
														{/* <span className="tags product-unipue mb--10">
															<strong>Tags:</strong> {blogPost.tags.join(', ')}
														</span> */}
														<span className="tags product-unipue mb--10">
															<strong>Weight:</strong> {blogPost.weight}
														</span>
														<span className="tags product-unipue mb--10">
															<strong>Type:</strong> {blogPost.type}
														</span>
													</div>
													<div className="d-flex w-100 flex-wrap align-items-center gap-3 mb--20">
														<div className="product-bottom-action justify-content-start align-items-start m-0 d-block">
															<div className="d-flex w-auto  rounded quantity p-1 mb-3">
																<button
																	className="button minus p-0"
																	style={{width: '30px'}}
																	onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
																>
																	<i className="fa-regular fa-minus" />
																</button>
																<input
																	type="text"
																	className="input"
																	style={{width: '40px'}}
																	value={quantity}
																	onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
																/>
																<button
																	className="button plus p-0"
																	style={{width: '30px'}}
																	onClick={() => setQuantity((prev) => prev + 1)}
																>
																	<i className="fa-regular fa-plus" />
																</button>
															</div>
															<button
																className="rts-btn btn-primary radious-sm with-icon border-0 align-items-start m-0  addToCartFixed"
																onClick={(e) => {
																	e.preventDefault();
																	handleAdd();
																}}
															>
																<div className="btn-text">
																	{language === 'en' ? 'Add to Cart' : 'কার্টে যোগ করুন'}
																</div>
																<div className="arrow-icon">
																	<i className="fa-regular fa-cart-shopping" />
																</div>
															</button>
														</div>
														<div className="share-option-shop-details m-0">
															<button
																className="single-share-option border-0"
																onClick={() => {
																	handleWishlist();
																	wishList();
																}}
															>
																<div className="icon">
																	<i className="fa-regular fa-heart" />
																</div>
																<span>
																	{language === 'en'
																		? 'Add To Wishlist'
																		: 'পছন্দের তালিকায় যোগ করুন'}
																</span>
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="tab-content" id="myTabContent">
									<div>
										<div className="single-tab-content-shop-details md-mt-5 pt-5">
											<h2>{language === 'en' ? 'Description' : 'বিবরণ'}</h2>
											<p className="disc">
												{language === 'bn'
													? blogPost.b_meta_description
													: blogPost.meta_description}
											</p>
										</div>
									</div>
									<div className="container md-mt-5 pt-5">
										<h2>{language === 'en' ? 'Frequently Asked Questions' : 'সাধারণ জিজ্ঞাসা'}</h2>
										<ProductFAQ data={blogPost} />
									</div>
								</div>
							</div>

							<div className="col-xl-3 col-lg-4 col-md-12 offset-xl-1  rts-sticky-column-item">
								<div className="theiaStickySidebar">
									<div className="shop-sight-sticky-sidevbar mb--20">
										<h6 className="title">
											{language === 'en' ? 'Available offers' : 'উপলব্ধ অফারসমূহ'}
										</h6>
										<div className="single-offer-area">
											<div className="icon">
												<img src="/assets/images/shop/01.svg" alt="icon" />
											</div>
											<div className="details">
												<p>
													{language === 'en'
														? 'Use Nagad to pay and enjoy 5% off on your first order.'
														: 'নগদ ব্যবহার করে পেমেন্ট করুন এবং আপনার প্রথম অর্ডারে ৫% ছাড় উপভোগ করুন।'}
												</p>
											</div>
										</div>
										<div className="single-offer-area">
											<div className="icon">
												<img src="/assets/images/shop/02.svg" alt="icon" />
											</div>
											<div className="details">
												<p>
													{language === 'en'
														? 'Rocket users save 5% on their first order — place it now!'
														: 'রকেট ব্যবহারকারীরা তাদের প্রথম অর্ডারে ৫% সাশ্রয় করে — এখনই অর্ডার করুন!'}
												</p>
											</div>
										</div>
										<div className="single-offer-area">
											<div className="icon">
												<img src="/assets/images/shop/03.svg" alt="icon" />
											</div>
											<div className="details">
												<p>
													{language === 'en'
														? 'Make your first order using Upay and enjoy 5% off instantly.'
														: 'আপনার প্রথম অর্ডারটি আপয় ব্যবহার করে করুন এবং সাথে সাথে ৫% ছাড় উপভোগ করুন।'}
												</p>
											</div>
										</div>
									</div>
									{/* <div className="our-payment-method">
										<h5 className="title">Guaranteed Safe Checkout</h5>
										<img src="/assets/images/shop/03.png" alt="" />
									</div> */}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<RelatedProduct type={blogPost?.type} />
			<ShortService />
			<BottomNav />
			<FooterThree />
			<ToastContainer />
		</div>
	);
};

export default CompareElements;
