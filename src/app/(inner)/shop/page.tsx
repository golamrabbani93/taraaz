'use client';
import ShortService from '@/components/service/ShortService';
import HeaderFive from '@/components/header/HeaderFive';
import FooterThree from '@/components/footer/FooterThree';
import {useAppSelector} from '@/redux/hooks';
import {selectLanguage} from '@/redux/features/language/languageSlice';
import BestSellingWrap from '@/components/product/BestSellingWrap';
import BottomNav from '@/components/BottomNav/BottomNav';
import {useGetAllProductsQuery} from '@/redux/features/product/productApi';
import BestPickSkeleton from '@/components/Loader/Skeleton/BestPickSkeleton/BestPickSkeleton';
import BottomCategory from '@/components/bottom-category/BottomCategory';
import DeskCategory from '@/components/bottom-category/DeskCategory';
import {useRouter, useSearchParams} from 'next/navigation';
import {IProduct} from '@/types/product.types';
import FilterBar from '@/components/FilterBar/FilterBar';
import {Suspense, use, useEffect, useState} from 'react';
import Link from 'next/link';
function Home() {
	const {data: products, isLoading} = useGetAllProductsQuery('');
	//get search params here
	const router = useRouter();
	const searchParams = useSearchParams();
	const category = searchParams.get('category');
	const [openSidebar, setOpenSidebar] = useState(false);

	const [minPrice, setMinPrice] = useState(0);
	const [maxPrice, setMaxPrice] = useState(40000);

	const publishedProducts = products?.filter((p: IProduct) => p.isPublish);
	// set Filtered Products Based on Category and removeed taraaz-fusion dash
	const [allCategories, setAllCategories] = useState<Array<string>>([]);
	const [selectedCategories, setSelectedCategories] = useState<Array<string>>([]);
	console.log('🚀🚀 ~ Home ~ selectedCategories:', selectedCategories);

	// Only published products

	// ------------------------------
	// 1) Category from URL
	// ------------------------------
	let filteredProducts = publishedProducts;

	if (category) {
		const cleanCategory = category.toLowerCase().replace(/-/g, ' ');

		filteredProducts = publishedProducts?.filter(
			(product: IProduct) => product.categories?.value?.toLowerCase() === cleanCategory,
		);
	}

	// ------------------------------
	// 2) Category Sidebar Filters (Multiple)
	// ------------------------------
	let finalFilteredProducts = filteredProducts;
	useEffect(() => {
		// Reset search params when category is selected from sidebar
		if (selectedCategories.length > 0) {
			const params = new URLSearchParams(window.location.search);
			params.delete('category');
			const newUrl = `${window.location.pathname}?${params.toString()}`;
			window.history.replaceState({}, '', newUrl);
		}
	}, [selectedCategories]);
	useEffect(() => {
		// Reset search params when category is selected from sidebar
		if (category) {
			setSelectedCategories([]);
		}
	}, [category]);
	if (selectedCategories.length > 0 && selectedCategories[0] !== '') {
		finalFilteredProducts = filteredProducts?.filter((product: IProduct) => {
			//clear searchparam when category is selected from sidebar

			const productCategory = product.categories?.value?.toLowerCase() || '';
			return selectedCategories.map((c) => c.toLowerCase()).includes(productCategory);
		});
	}
	// filter price range
	finalFilteredProducts = finalFilteredProducts?.filter((product: IProduct) => {
		const price = parseFloat(product.original_price);
		return price >= minPrice && price <= maxPrice;
	});
	//
	return (
		<div className="demo-one">
			<HeaderFive />
			<BottomCategory />
			<DeskCategory />

			<>
				{/* rts contact main wrapper */}
				{/* <div className="rts-contact-main-wrapper-banner">
					<div className="container">
						<div className="row">
							<div className="col-lg-12">
								<div className="contact-banner-content">
									<h1 className="title text-uppercase h2">
										{category ? category : 'All Products'}
									</h1>
								</div>
							</div>
						</div>
					</div>
				</div> */}
				{/* rts contact main wrapper end */}

				{isLoading ? (
					<BestPickSkeleton />
				) : (
					<div className="">
						<div className="d-flex justify-content-center align-items-center m-3 m-md-5 gap-3 flex-wrap">
							{/* LEFT — Filter Toggle (Small Button) */}
							<button
								className="filter-toggle-btn btn btn-outline-primary btn-sm"
								onClick={() => {
									setOpenSidebar(!openSidebar);
									// setSelectedCategories([]);
								}}
								style={{
									fontSize: '12px',
									padding: '4px 8px',
									width: '120px',
									borderRadius: '4px',
									height: '38px',
									zIndex: 2,
								}}
							>
								<i className={`fa ${openSidebar ? 'fa-times' : 'fa-filter'} me-2`}></i>
								{openSidebar ? 'Close Filters' : 'Open Filters'}
							</button>

							{/* CENTER/RIGHT — Additional Dropdowns */}

							{/* Sort by Price Dropdown */}
							<Link
								target="_self"
								href="/shop"
								className={`shop-category ${!category ? 'shop-category-active ' : ''}`}
								style={{
									textDecoration: 'none',
									fontWeight: 'bold',
									border: '2px solid #b4842d',
									padding: '5px 10px',
									borderRadius: '8px',
								}}
							>
								All
							</Link>
							<Link
								target="_self"
								href="/shop?category=taraaz-fusion"
								className={`shop-category ${
									category === 'taraaz-fusion' ? 'shop-category-active ' : ''
								}`}
								style={{
									textDecoration: 'none',
									fontWeight: 'bold',
									border: '2px solid #b4842d',
									padding: '5px 10px',
									borderRadius: '8px',
								}}
							>
								Taraaz Fusion
							</Link>

							{/* Size Dropdown */}
							<Link
								target="_self"
								href="/shop?category=designer's-choice"
								className={`shop-category ${
									category === "designer's-choice" ? 'shop-category-active ' : ''
								}`}
								style={{
									textDecoration: 'none',
									fontWeight: 'bold',
									border: '2px solid #b4842d',
									padding: '5px 10px',
									borderRadius: '8px',
								}}
							>
								Desinger's Choice
							</Link>

							{/* Color Dropdown */}
							<Link
								target="_self"
								href="/shop?category=pakistani-wear"
								className={`shop-category ${
									category === 'pakistani-wear' ? 'shop-category-active ' : ''
								}`}
								style={{
									textDecoration: 'none',
									fontWeight: 'bold',
									border: '2px solid #b4842d',
									padding: '5px 10px',
									borderRadius: '8px',
								}}
							>
								Pakistani Wear
							</Link>

							{/* Material Dropdown */}
							<Link
								target="_self"
								href="/shop?category=indian-wear"
								className={`shop-category ${
									category === 'indian-wear' ? 'shop-category-active ' : ''
								}`}
								style={{
									textDecoration: 'none',
									fontWeight: 'bold',
									border: '2px solid #b4842d',
									padding: '5px 10px',
									borderRadius: '8px',
								}}
							>
								Indian Wear
							</Link>
							<Link
								target="_self"
								href="/shop?category=saree"
								className={`shop-category ${category === 'saree' ? 'shop-category-active ' : ''}`}
								style={{
									textDecoration: 'none',
									fontWeight: 'bold',
									border: '2px solid #b4842d',
									padding: '5px 10px',
									borderRadius: '8px',
								}}
							>
								Saree
							</Link>

							{/* RIGHT — Category Dropdown (Big Select) */}
							<select
								className="form-select "
								value={selectedCategories[0] || ''}
								onChange={(e) => setSelectedCategories([e.target.value])}
								style={{
									fontSize: '16px',
									padding: '6px 12px',
									borderRadius: '8px',
									border: '2px solid #b4842d',
									backgroundColor: '#f8f9fa',
									fontWeight: 'bold',
									width: '200px',
								}}
							>
								<option value="">All Categories</option>
								{allCategories.map((cat: string, i: number) => (
									<option key={i} value={cat}>
										{cat}
									</option>
								))}
							</select>
						</div>

						<FilterBar
							isSidebarOpen={openSidebar}
							setIsSidebarOpen={setOpenSidebar}
							minPrice={minPrice}
							maxPrice={maxPrice}
							setMinPrice={setMinPrice}
							setMaxPrice={setMaxPrice}
							selectedCategories={selectedCategories}
							setSelectedCategories={setSelectedCategories}
							setAllCategories={setAllCategories}
						/>
						<BestSellingWrap head={false} data={finalFilteredProducts} />
					</div>
				)}
			</>
			<BottomNav />
			<ShortService />
			<FooterThree />
		</div>
	);
}
export default function Page() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Home />
		</Suspense>
	);
}
