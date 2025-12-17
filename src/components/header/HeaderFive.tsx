'use client';
import {useState, useEffect, useRef} from 'react';
import Cart from './Cart';
import WishList from './WishList';
import BackToTop from '@/components/common/BackToTop';
import {useRouter, useSearchParams} from 'next/navigation';
import Link from 'next/link';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {clearUser, selectUser} from '@/redux/features/user/userSlice';
import {useGetAllProductsQuery} from '@/redux/features/product/productApi';
import {IProduct} from '@/types/product.types';
import {selectLanguage, toggleLanguage} from '@/redux/features/language/languageSlice';
import {toast} from 'react-toastify';
import {removeToken} from '@/services/token/getToken';
import {useGetSingleCompanyContactQuery} from '@/redux/features/companyContact/companyContact';

function HeaderFive() {
	const [user, setUser] = useState<any>(null);
	const userdata = useAppSelector(selectUser);
	const {data: products} = useGetAllProductsQuery(undefined);
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState('');
	const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);
	const [productSuggestions, setProductSuggestions] = useState<IProduct[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const [isInputFocused, setIsInputFocused] = useState(false); // Track input focus state
	const dispatch = useAppDispatch();
	const language = useAppSelector(selectLanguage);
	const inputRef = useRef<HTMLInputElement>(null);
	const suggestionsRef = useRef<HTMLDivElement>(null);
	const {data: companyContact} = useGetSingleCompanyContactQuery('1');

	// Countdown setup
	useEffect(() => {
		setUser(userdata);
	}, [userdata]);

	// header sticky
	const [isSticky, setIsSticky] = useState(false);
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 150) {
				setIsSticky(true);
			} else {
				setIsSticky(false);
			}
		};

		window.addEventListener('scroll', handleScroll);

		// Clean up the event listener on component unmount
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	// Get all unique tags from products
	const getAllTags = () => {
		if (!products) return [];
		const allTags: string[] = [];
		products.forEach((product: IProduct) => {
			if (product.tags && Array.isArray(product.tags)) {
				product.tags.forEach((tag) => {
					if (!allTags.includes(tag)) {
						allTags.push(tag);
					}
				});
			}
		});
		return allTags;
	};

	// filter search action js start
	useEffect(() => {
		if (searchTerm.trim().length > 0 && isInputFocused) {
			// Filter products for product suggestions
			const filteredProducts = products.filter(
				(item: IProduct) =>
					item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.b_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.b_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
			);
			setProductSuggestions(filteredProducts.slice(0, 6).map((item: IProduct) => item));

			// Filter tags for tag suggestions
			const allTags = getAllTags();
			const filteredTags = allTags.filter((tag) =>
				tag.toLowerCase().includes(searchTerm.toLowerCase()),
			);
			setTagSuggestions(filteredTags.slice(0, 10));

			setShowSuggestions(true);
		} else {
			setProductSuggestions([]);
			setTagSuggestions([]);
			setShowSuggestions(false);
		}
	}, [searchTerm, products, isInputFocused]);

	// Handle input focus
	const handleInputFocus = () => {
		setIsInputFocused(true);
		if (searchTerm.trim().length > 0) {
			setShowSuggestions(true);
		}
	};

	// Handle input blur
	const handleInputBlur = () => {
		// Delay hiding to allow clicking on suggestions
		setTimeout(() => {
			setIsInputFocused(false);
			setShowSuggestions(false);
		}, 300); // Increased from 200 to 300
	};

	const handleSuggestionClick = () => {
		setShowSuggestions(false);
		setIsInputFocused(false);
	};

	// filter search action js end
	const handleLogOut = async () => {
		dispatch(clearUser());
		await removeToken();
		router.push('/');
		toast.success('Logged out successfully');
	};

	const searchParams = useSearchParams();
	const category = searchParams.get('category');
	const subcategory = searchParams.get('subcategory');
	const searchQuery = searchParams.get('q');

	// Sync search term with URL query
	useEffect(() => {
		if (searchQuery) {
			setSearchTerm(searchQuery);
		} else {
			setSearchTerm('');
		}
		// Hide suggestions when URL changes
		setShowSuggestions(false);
		setIsInputFocused(false);
	}, [searchQuery]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchTerm.trim()) {
			const params = new URLSearchParams();
			params.set('q', searchTerm.trim());
			// Clear category and subcategory when searching
			if (category) params.delete('category');
			if (subcategory) params.delete('subcategory');
			router.push(`/shop?${params.toString()}`);
		} else {
			// Clear search if input is empty
			const params = new URLSearchParams(window.location.search);
			params.delete('q');
			router.push(`/shop?${params.toString()}`);
		}
		setShowSuggestions(false);
		setIsInputFocused(false);
	};

	// Handle input change
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	};

	return (
		<div>
			<>
				{/* rts header area start */}
				<div className="rts-header-one-area-one">
					<div className="header-top-area">
						<div className="container">
							<div className="row">
								<div className="col-lg-12">
									<div
										className="bwtween-area-header-top"
										style={{position: 'relative', zIndex: '999'}}
									>
										<div className="contact-number-area d-flex align-items-center">
											<p>
												<Link className="me-3" href="/shop">
													{language === 'en' ? 'PRODUCTS' : 'পণ্যসমূহ'}
												</Link>
												<Link className="me-3" href="/videos">
													{language === 'en' ? 'VIDEOS' : 'ভিডিওসমূহ'}
												</Link>
												<Link
													className="me-3"
													href={companyContact?.whatsapp || '#'}
													target="_blank"
												>
													{language === 'en' ? 'WHATSAPP' : 'হোয়াটসঅ্যাপ'}
												</Link>
												<Link className="me-3" href="/contact">
													{language === 'en' ? 'SUPPORT' : 'যোগাযোগ'}
												</Link>

												<Link className="me-3" href="/blog">
													{language === 'en' ? 'BLOGS' : 'ব্লগ'}
												</Link>
												{user?.id ? (
													<Link className="me-3" href="#" onClick={() => handleLogOut()}>
														{language === 'en' ? 'LOGOUT' : 'লগআউট'}
													</Link>
												) : (
													<>
														<Link className="me-3" href="/login">
															{language === 'en' ? 'LOGIN' : 'লগইন'}
														</Link>
														<Link href="/register">{language === 'en' ? 'SIGNUP' : 'সাইন আপ'}</Link>
													</>
												)}
											</p>
										</div>
										<div className="discount-area">
											<p className="disc" suppressHydrationWarning>
												{language === 'en'
													? 'Order first, get special surprise on next 3 orders!'
													: ''}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div
						className={`rts-header-nav-area-one  header-four header--sticky  ${
							isSticky ? 'sticky' : ''
						}`}
					>
						<div className="search-header-area-main-1">
							<div className="container">
								<div className="row">
									<div className="col-lg-12">
										<div className="search-header-area-main bg_white without-category">
											<div className="container">
												<div className="row">
													<div className="col-lg-12">
														<div className="logo-search-category-wrapper style-five-call-us">
															<Link href="/" className="logo-area">
																<img
																	src="/assets/images/logo/tz-main-logo.png"
																	alt="logo-main"
																	className="logo"
																	style={{zIndex: '1000', position: 'relative'}}
																/>
															</Link>
															<div className="category-search-wrapper style-five">
																<form
																	className="search-header"
																	autoComplete="off"
																	onSubmit={handleSearch}
																>
																	<input
																		ref={inputRef}
																		type="text"
																		placeholder={
																			language === 'en'
																				? 'Search products or tags...'
																				: 'পণ্য বা ট্যাগ অনুসন্ধান করুন...'
																		}
																		required
																		value={searchTerm}
																		onChange={handleInputChange}
																		onFocus={handleInputFocus}
																		onBlur={handleInputBlur}
																	/>
																	<button
																		type="submit"
																		className="rts-btn btn-primary radious-sm with-icon border-0"
																	>
																		<div className="arrow-icon">
																			<i className="fa-light fa-magnifying-glass" />
																		</div>
																	</button>
																	{/* Autocomplete dropdown - Only show when input is focused AND has suggestions */}
																	{showSuggestions &&
																		isInputFocused &&
																		(productSuggestions.length > 0 ||
																			tagSuggestions.length > 0) && (
																			<div
																				ref={suggestionsRef}
																				className="autocomplete-suggestions"
																				style={{
																					position: 'absolute',
																					backgroundColor: '#fff',
																					border: '1px solid #ccc',
																					marginTop: '4px',
																					width: '100%',
																					maxHeight: '550px',
																					overflowY: 'auto',
																					zIndex: 1000,
																					padding: '10px',
																					borderRadius: '8px',
																					boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
																					scrollbarWidth: 'thin',
																					scrollbarColor: '#ccc transparent',
																				}}
																			>
																				{/* Tag Suggestions Section */}
																				{tagSuggestions.length > 0 && (
																					<div className="mb-3">
																						<h6
																							className="text-muted mb-2"
																							style={{fontSize: '12px', fontWeight: '600'}}
																						>
																							<i className="fas fa-tag me-1"></i> Popular Tags
																						</h6>
																						<div className="d-flex flex-wrap gap-2 ">
																							{tagSuggestions.map((tag, index) => (
																								<Link
																									href={`/shop?q=${encodeURIComponent(tag)}`}
																									key={index}
																									className="btn btn-sm btn-outline-primary"
																									onClick={handleSuggestionClick}
																									style={{
																										fontSize: '12px',
																										padding: '4px 8px',
																										borderRadius: '4px',
																										whiteSpace: 'nowrap',
																										textDecoration: 'none',
																									}}
																								>
																									{tag}
																								</Link>
																							))}
																						</div>
																					</div>
																				)}

																				{/* Product Suggestions Section */}
																				{productSuggestions.length > 0 && (
																					<div>
																						<h6
																							className="text-muted mb-2"
																							style={{fontSize: '12px', fontWeight: '600'}}
																						>
																							<i className="fas fa-box me-1"></i> Products
																						</h6>
																						{productSuggestions.map((suggestion, index) => (
																							<Link
																								href={`/shop/${suggestion.slug}`}
																								key={index}
																								className="d-flex align-items-center p-2 text-decoration-none text-dark suggestion-item"
																								style={{
																									cursor: 'pointer',
																									borderRadius: '4px',
																									marginBottom: '4px',
																								}}
																								onClick={handleSuggestionClick}
																								onMouseEnter={(e) =>
																									(e.currentTarget.style.backgroundColor =
																										'#f8f9fa')
																								}
																								onMouseLeave={(e) =>
																									(e.currentTarget.style.backgroundColor =
																										'transparent')
																								}
																							>
																								{/* Product Image */}
																								<img
																									src={suggestion.image1}
																									alt={suggestion.name}
																									className="me-2 rounded"
																									style={{
																										width: '40px',
																										height: '40px',
																										objectFit: 'cover',
																									}}
																								/>
																								{/* Product Name */}
																								<div className="flex-grow-1">
																									<div
																										className="fw-medium"
																										style={{fontSize: '14px'}}
																									>
																										{language === 'en'
																											? suggestion.name
																											: suggestion.b_name}
																									</div>
																									{/* Show tags if available */}
																									{suggestion.tags &&
																										suggestion.tags.length > 0 && (
																											<div className="d-flex flex-wrap gap-1 mt-1">
																												{suggestion.tags
																													.slice(0, 2)
																													.map((tag, idx) => (
																														<div
																															key={idx}
																															className="badge bg-light text-dark border"
																															style={{
																																fontSize: '10px',
																																padding: '2px 4px',
																															}}
																														>
																															{tag}
																														</div>
																													))}
																											</div>
																										)}
																								</div>
																							</Link>
																						))}
																					</div>
																				)}
																			</div>
																		)}
																</form>
															</div>
															<div className="accont-wishlist-cart-area-header">
																{user?.role === 'admin' ? (
																	<Link
																		className="btn-border-only account"
																		href="/dashboard"
																		target="_blank"
																	>
																		<i className="fas fa-user-cog"></i>
																	</Link>
																) : (
																	<Link href="/account" className="btn-border-only account">
																		<i className="fa-light fa-user" />
																	</Link>
																)}
																<WishList />
																<Cart />
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div
						className={`rts-header-nav-area-one  header-four header--sticky border-0  ${
							isSticky ? 'sticky' : ''
						}`}
					>
						<div className="container">
							<div className="row mt-1">
								<form className="searchForm" onSubmit={handleSearch}>
									<span className="icon">
										<i className="fa-light fa-magnifying-glass" />
									</span>
									<input
										className="mobile-search-input"
										ref={inputRef}
										type="text"
										placeholder={
											language === 'en'
												? 'Search products or tags...'
												: 'পণ্য বা ট্যাগ অনুসন্ধান করুন...'
										}
										required
										value={searchTerm}
										onChange={handleInputChange}
										onFocus={handleInputFocus}
										onBlur={handleInputBlur}
									/>
									{/* Mobile Suggestions */}
									{showSuggestions &&
										isInputFocused &&
										(productSuggestions.length > 0 || tagSuggestions.length > 0) && (
											<div
												ref={suggestionsRef}
												className="autocomplete-suggestions"
												style={{
													position: 'absolute',
													top: '100%',
													left: 0,
													right: 0,
													backgroundColor: '#fff',
													border: '1px solid #ccc',
													marginTop: '4px',
													maxHeight: '400px',
													overflowY: 'auto',
													zIndex: 999,
													padding: '10px',
													borderRadius: '8px',
													boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
													boxSizing: 'border-box',
													// scroll bar thinning
													scrollbarWidth: 'thin',
													scrollbarColor: '#ccc transparent',
												}}
											>
												{/* Tag Suggestions Section */}
												{tagSuggestions.length > 0 && (
													<div className="mb-3">
														<h6
															className="text-muted mb-2"
															style={{fontSize: '12px', fontWeight: '600'}}
														>
															<i className="fas fa-tag me-1"></i> Popular Tags
														</h6>
														<div className="d-flex flex-wrap gap-2">
															{tagSuggestions.map((tag, index) => (
																<Link
																	href={`/shop?q=${encodeURIComponent(tag)}`}
																	key={index}
																	className="btn btn-sm btn-outline-primary"
																	onClick={handleSuggestionClick}
																	style={{
																		fontSize: '12px',
																		padding: '4px 8px',
																		borderRadius: '4px',
																		whiteSpace: 'nowrap',
																		textDecoration: 'none',
																	}}
																>
																	{tag}
																</Link>
															))}
														</div>
													</div>
												)}

												{/* Product Suggestions Section */}
												{productSuggestions.length > 0 && (
													<div>
														<h6
															className="text-muted mb-2"
															style={{fontSize: '12px', fontWeight: '600'}}
														>
															<i className="fas fa-box me-1"></i> Products
														</h6>
														{productSuggestions.map((suggestion, index) => (
															<Link
																href={`/shop/${suggestion.slug}`}
																key={index}
																className="d-flex align-items-center p-2 text-decoration-none text-dark suggestion-item"
																style={{
																	cursor: 'pointer',
																	borderRadius: '4px',
																	marginBottom: '4px',
																}}
																onClick={handleSuggestionClick}
																onMouseEnter={(e) =>
																	(e.currentTarget.style.backgroundColor = '#f8f9fa')
																}
																onMouseLeave={(e) =>
																	(e.currentTarget.style.backgroundColor = 'transparent')
																}
															>
																{/* Product Image */}
																<img
																	src={suggestion.image1}
																	alt={suggestion.name}
																	className="me-2 rounded"
																	style={{
																		width: '40px',
																		height: '40px',
																		objectFit: 'cover',
																	}}
																/>
																{/* Product Name */}
																<div className="flex-grow-1">
																	<div className="fw-medium" style={{fontSize: '14px'}}>
																		{language === 'en' ? suggestion.name : suggestion.b_name}
																	</div>
																	{/* Show tags if available */}
																	{suggestion.tags && suggestion.tags.length > 0 && (
																		<div className="d-flex flex-wrap gap-1 mt-1">
																			{suggestion.tags.slice(0, 2).map((tag, idx) => (
																				<span
																					key={idx}
																					className="badge bg-light text-dark border"
																					style={{fontSize: '10px', padding: '2px 4px'}}
																				>
																					{tag}
																				</span>
																			))}
																		</div>
																	)}
																</div>
															</Link>
														))}
													</div>
												)}
											</div>
										)}
								</form>
							</div>
						</div>
					</div>
				</div>
				{/* rts header area end */}
			</>
			<BackToTop />
			{/* <Sidebar /> */}
		</div>
	);
}

export default HeaderFive;
