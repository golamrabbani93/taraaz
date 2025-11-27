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
import {use, useEffect, useState} from 'react';
export default function Home() {
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

	const [selectedCategories, setSelectedCategories] = useState<Array<string>>([]);

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
	if (selectedCategories.length > 0) {
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
				<div className="rts-contact-main-wrapper-banner bg_image">
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
				</div>
				{/* rts contact main wrapper end */}

				{isLoading ? (
					<BestPickSkeleton />
				) : (
					<div className="">
						<div className="m-3 m-md-5">
							<button className="filter-toggle-btn " onClick={() => setOpenSidebar(!openSidebar)}>
								{openSidebar ? 'Close Filters' : 'Open Filters'}
							</button>
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
