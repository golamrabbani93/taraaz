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
import AllCategories from '@/components/AllCategories/AllCategories ';
function Home() {
	const {data: products, isLoading} = useGetAllProductsQuery('');
	//get search params here
	const router = useRouter();
	const searchParams = useSearchParams();
	const category = searchParams.get('category');
	const subcategory = searchParams.get('subcategory'); // Add subcategory param
	const searchQuery = searchParams.get('q'); // Add search query param
	const [openSidebar, setOpenSidebar] = useState(false);

	const [minPrice, setMinPrice] = useState(0);
	const [maxPrice, setMaxPrice] = useState(40000);
	const [searchInput, setSearchInput] = useState(searchQuery || '');

	const publishedProducts = products?.filter((p: IProduct) => p.isPublish);
	// set Filtered Products Based on Category and removeed taraaz-fusion dash
	const [allCategories, setAllCategories] = useState<Array<string>>([]);
	const [selectedCategories, setSelectedCategories] = useState<Array<string>>([]);
	const [selectedSubcategories, setSelectedSubcategories] = useState<Array<string>>([]);
	// Only published products

	// ------------------------------
	// 1) Category from URL
	// ------------------------------
	let filteredProducts = publishedProducts;

	// ------------------------------
	// 1.5) Search Query from URL (ADDED)
	// ------------------------------
	if (searchQuery) {
		const cleanSearch = searchQuery.toLowerCase().trim();
		filteredProducts = filteredProducts?.filter((product: IProduct) => {
			// Search in name
			const nameMatch = product.name?.toLowerCase().includes(cleanSearch);
			// Search in description
			const descriptionMatch = product.description?.toLowerCase().includes(cleanSearch);
			// Search in category name
			const categoryMatch = product.categories?.value?.toLowerCase().includes(cleanSearch);
			// Search in subcategory name
			const subcategoryMatch = product.sub_categories?.value?.toLowerCase().includes(cleanSearch);
			// Search in tags
			const tagsMatch = product.tags?.some((tag: string) =>
				tag.toLowerCase().includes(cleanSearch),
			);
			// Search in material
			const materialMatch = product.materials?.toLowerCase().includes(cleanSearch);

			return (
				nameMatch ||
				descriptionMatch ||
				categoryMatch ||
				subcategoryMatch ||
				tagsMatch ||
				materialMatch
			);
		});
	}

	if (category) {
		const cleanCategory = category.toLowerCase().replace(/-/g, ' ');

		filteredProducts = publishedProducts?.filter((product: IProduct) => {
			// Check if product belongs to this category
			const productCategory = product.categories?.value?.toLowerCase() || '';
			return productCategory === cleanCategory;
		});
	}

	// ------------------------------
	// 2) Subcategory from URL
	// ------------------------------
	if (subcategory) {
		const cleanSubcategory = subcategory.toLowerCase().replace(/-/g, ' ');

		filteredProducts = (filteredProducts || publishedProducts)?.filter((product: IProduct) => {
			// Check if product belongs to this subcategory
			const productSubcategory = product.sub_categories?.value?.toLowerCase() || '';
			return productSubcategory === cleanSubcategory;
		});
	}

	// ------------------------------
	// 3) Category Sidebar Filters (Multiple)
	// ------------------------------
	let finalFilteredProducts = filteredProducts;

	useEffect(() => {
		// Reset search params when category/subcategory is selected from sidebar
		if (selectedCategories.length > 0 || selectedSubcategories.length > 0) {
			const params = new URLSearchParams(window.location.search);
			params.delete('category');
			params.delete('subcategory');
			params.delete('q'); // Also clear search when using sidebar filters
			const newUrl = `${window.location.pathname}?${params.toString()}`;
			window.history.replaceState({}, '', newUrl);
		}
	}, [selectedCategories, selectedSubcategories]);

	useEffect(() => {
		// Reset sidebar filters when URL params are present
		if (category || subcategory || searchQuery) {
			setSelectedCategories([]);
			setSelectedSubcategories([]);
		}
		// Update search input when query changes
		if (searchQuery) {
			setSearchInput(searchQuery);
		} else {
			setSearchInput('');
		}
	}, [category, subcategory, searchQuery]);

	// Filter by selected categories from sidebar
	if (selectedCategories.length > 0) {
		finalFilteredProducts = filteredProducts?.filter((product: IProduct) => {
			const productCategory = product.categories?.value?.toLowerCase() || '';
			return selectedCategories.map((c) => c.toLowerCase()).includes(productCategory);
		});
	}

	// Filter by selected subcategories from sidebar
	if (selectedSubcategories.length > 0) {
		finalFilteredProducts = (finalFilteredProducts || filteredProducts)?.filter(
			(product: IProduct) => {
				const productSubcategory = product.sub_categories?.value?.toLowerCase() || '';
				return selectedSubcategories.map((sc) => sc.toLowerCase()).includes(productSubcategory);
			},
		);
	}

	// Filter by price range
	finalFilteredProducts = finalFilteredProducts?.filter((product: IProduct) => {
		const price = parseFloat(product.original_price);
		return price >= minPrice && price <= maxPrice;
	});

	// Handle search form submission (ADDED)
	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (searchInput.trim()) {
			const params = new URLSearchParams();
			params.set('q', searchInput.trim());
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
	};

	// Clear search function (ADDED)
	const clearSearch = () => {
		setSearchInput('');
		const params = new URLSearchParams(window.location.search);
		params.delete('q');
		router.push(`/shop?${params.toString()}`);
	};

	// Log for debugging

	return (
		<div className="demo-one">
			<HeaderFive />
			<BottomCategory />
			<DeskCategory />

			<>
				{/* rts contact main wrapper */}
				{/* <div className="rts-contact-main-wrapper-banner"> */}

				{/* </div> */}
				{/* rts contact main wrapper end */}

				{isLoading ? (
					<BestPickSkeleton />
				) : (
					<div className="container my-5">
						<div className="d-flex justify-content-start align-items-center m-3 m-md-5 gap-3 flex-wrap">
							{/* LEFT — Filter Toggle (Small Button)
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
							</button> */}
							{/* CENTER/RIGHT — Additional Dropdowns */}
							{/* Sort by Price Dropdown */}
							<AllCategories />
						</div>
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
