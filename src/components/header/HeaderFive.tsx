'use client';
import {useState, useEffect, useRef} from 'react';
import Cart from './Cart';
import WishList from './WishList';
import BackToTop from '@/components/common/BackToTop';
import Sidebar from './Sidebar';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {clearUser, selectUser} from '@/redux/features/user/userSlice';
import {useGetAllProductsQuery} from '@/redux/features/product/productApi';
import {IProduct} from '@/types/product.types';
import {selectLanguage, toggleLanguage} from '@/redux/features/language/languageSlice';
import LanguageDropdown from './LanguageDropdown';
import {toast} from 'react-toastify';
import {removeToken} from '@/services/token/getToken';
import LanguageSwitcher from './LanguageSwitcher';
import {useGetSingleCompanyContactQuery} from '@/redux/features/companyContact/companyContact';

function HeaderFive() {
	const [user, setUser] = useState<any>(null);
	const userdata = useAppSelector(selectUser);
	const {data: products} = useGetAllProductsQuery(undefined);
	const router = useRouter();
	const [searchTerm, setSearchTerm] = useState('');
	type Product = (typeof products)[number];
	const [suggestions, setSuggestions] = useState<Product[]>([]);
	const [showSuggestions, setShowSuggestions] = useState(false);
	const dispatch = useAppDispatch();
	const language = useAppSelector(selectLanguage);
	const inputRef = useRef<HTMLInputElement>(null);
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

	// filter search action js start

	useEffect(() => {
		if (searchTerm.trim().length > 0) {
			const filtered = products.filter(
				(item: IProduct) =>
					item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.b_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.b_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
					item.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
			);
			setSuggestions(filtered.slice(0, 5).map((item: IProduct) => item));
			setShowSuggestions(true);
		} else {
			setSuggestions([]);
			setShowSuggestions(false);
		}
	}, [searchTerm]);

	const handleSuggestionClick = () => {
		setShowSuggestions(false);
	};

	// filter search action js end
	const handleLogOut = async () => {
		dispatch(clearUser());
		await removeToken();
		router.push('/');
		toast.success('Logged out successfully');
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
												{/* <Link className="me-3" href="/faq">
													{language === 'en' ? 'FAQ' : 'প্রশ্নাবলী'}
												</Link> */}
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

												{/* <Link href="#" className="ms-3" onClick={() => dispatch(toggleLanguage())}>
													<span className="px-4 py-2 rounded bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium hover:opacity-90 transition">
														{language === 'en' ? 'Switch to বাংলা' : 'Switch to English'}
													</span>
												</Link> */}
											</p>
											{/* <LanguageDropdown /> */}
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
																<form className="search-header" autoComplete="off">
																	<input
																		ref={inputRef}
																		type="text"
																		placeholder={
																			language === 'en'
																				? 'Search in Taraaz'
																				: 'তারাজে অনুসন্ধান করুন'
																		}
																		required
																		value={searchTerm}
																		onChange={(e) => setSearchTerm(e.target.value)}
																		onFocus={() =>
																			searchTerm.length > 0 && setShowSuggestions(true)
																		}
																	/>
																	<button
																		type="submit"
																		className="rts-btn btn-primary radious-sm with-icon border-0"
																	>
																		{/* <div className="btn-text">Search</div> */}
																		<div className="arrow-icon">
																			<i className="fa-light fa-magnifying-glass" />
																		</div>
																	</button>
																	{/* Autocomplete dropdown */}
																	{showSuggestions && suggestions.length > 0 && (
																		<ul
																			className="autocomplete-suggestions"
																			style={{
																				position: 'absolute',
																				backgroundColor: '#fff',
																				border: '1px solid #ccc',
																				marginTop: '4px',
																				width: '100%',
																				maxHeight: '350px',
																				overflowY: 'auto',
																				zIndex: 7000,
																				listStyleType: 'none',
																				padding: 0,
																				borderRadius: '4px',
																			}}
																		>
																			{suggestions.map((suggestion, index) => (
																				<Link
																					href={`/shop/${suggestion.slug}`}
																					key={index}
																					className="d-flex align-items-center p-2 text-decoration-none text-dark"
																					style={{
																						cursor: 'pointer',
																					}}
																					onClick={() => handleSuggestionClick()}
																				>
																					{/* Product Image */}
																					<img
																						src={suggestion.image1}
																						alt={suggestion.name}
																						className="me-2 rounded"
																						style={{
																							width: '50px',
																							height: '50px',
																							objectFit: 'cover',
																						}}
																					/>

																					{/* Product Name */}
																					<span
																						className="text-truncate flex-grow-1"
																						// style={{fontSize: '0.9rem'}}
																					>
																						{language === 'en'
																							? suggestion.name
																							: suggestion.b_name}
																					</span>
																				</Link>
																			))}
																		</ul>
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
																		{/* Account */}
																	</Link>
																)}

																{/* <a
																	href="/shop-compare"
																	className="btn-border-only account compare-number"
																>
																	<i className="fa-regular fa-code-compare"></i>
																	<span className="number">{compareItems.length}</span>
																</a> */}

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
								{/* <div className="col-lg-12"> */}
								<form className="searchForm">
									<span className="icon">
										<i className="fa-light fa-magnifying-glass" />
									</span>
									<input
										className="mobile-search-input"
										ref={inputRef}
										type="text"
										placeholder={language === 'en' ? 'Search in Taraaz' : 'তারাজে অনুসন্ধান করুন'}
										required
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										onFocus={() => searchTerm.length > 0 && setShowSuggestions(true)}
									/>
									{/* <LanguageSwitcher /> */}
									{showSuggestions && suggestions.length > 0 && (
										<ul
											className="autocomplete-suggestions"
											style={{
												position: 'absolute',
												top: '100%',
												left: 0,
												right: 0,
												backgroundColor: '#fff',
												border: '1px solid #ccc',
												marginTop: '4px',
												width: '100%',
												maxHeight: '300px',
												overflowY: 'auto',
												zIndex: 7000,
												listStyleType: 'none',
												padding: 0,
												borderRadius: '4px',
												boxSizing: 'border-box',
											}}
										>
											{suggestions.map((suggestion, index) => (
												<Link
													href={`/shop/${suggestion.slug}`}
													key={index}
													className="d-flex align-items-center p-2 text-decoration-none text-dark"
													style={{
														cursor: 'pointer',
													}}
													onClick={() => handleSuggestionClick()}
												>
													{/* Product Image */}
													<img
														src={suggestion.image1}
														alt={suggestion.name}
														className="me-2 rounded"
														style={{
															width: '50px',
															height: '50px',
															objectFit: 'cover',
														}}
													/>

													{/* Product Name */}
													<span className="text-truncate flex-grow-1" style={{fontSize: '13px'}}>
														{language === 'en' ? suggestion.name : suggestion.b_name}
													</span>
												</Link>
											))}
										</ul>
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
