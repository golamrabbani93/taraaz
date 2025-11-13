'use client';

import {selectLanguage} from '@/redux/features/language/languageSlice';
import {useGetAllProductsQuery} from '@/redux/features/product/productApi';
import {useAppSelector} from '@/redux/hooks';
import {IProduct} from '@/types/product.types';
import Link from 'next/link';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

interface SidebarProps {
	collapsed: boolean;
	setCollapsed: (collapsed: boolean) => void;
	text: string;
}
const Sidebar = ({collapsed, setCollapsed, text}: SidebarProps) => {
	const language = useAppSelector(selectLanguage);
	const {data: products, isLoading} = useGetAllProductsQuery('');
	// normalize slug to a string and get first segment before '-'
	const slugStr = (Array.isArray(text) ? text[0] : text)?.split('-')[0] ?? '';
	const str = slugStr.toLowerCase();

	const searchResult = (products ?? []).filter((item: IProduct) => {
		if (!text) {
			return products;
		}
		return (
			item.slug === slugStr ||
			item.category?.toLowerCase() === str ||
			item.tags?.some((tag: string) => tag.toLowerCase().includes(str)) ||
			item.name?.toLowerCase().includes(str) ||
			item.b_name?.toLowerCase().includes(str) ||
			item.description?.toLowerCase().includes(str) ||
			item.b_description?.toLowerCase().includes(str)
		);
	});
	return (
		<div className="d-flex ">
			{/* Sidebar */}
			<div
				className={`bg-white text-white p-3 vh-100 position-fixed shadow-lg ${
					collapsed ? 'sidebar-collapsed d-block' : 'sidebar-expanded d-none'
				}`}
				id="sidebar"
				style={{
					width: '290px',
					transition: '0.3s',
					overflowY: 'scroll',
					scrollbarWidth: 'none',
					right: 0,
				}}
			>
				<button className="btn btn-sm btn-primary mb-3" onClick={() => setCollapsed(!collapsed)}>
					{collapsed ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="lucide lucide-circle-x-icon lucide-circle-x"
						>
							<circle cx="12" cy="12" r="10" />
							<path d="m15 9-6 6" />
							<path d="m9 9 6 6" />
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="lucide lucide-circle-x-icon lucide-circle-x"
						>
							<circle cx="12" cy="12" r="10" />
							<path d="m15 9-6 6" />
							<path d="m9 9 6 6" />
						</svg>
					)}
				</button>

				{collapsed && (
					<>
						<h4 className="text-black text-center">
							{text === 'hair-care-products'
								? language === 'en'
									? 'Hair Care Products'
									: 'হেয়ার কেয়ার পণ্য'
								: text === 'skin-care-products'
								? language === 'en'
									? 'Skin Care Products'
									: 'স্কিন কেয়ার পণ্য'
								: text === ''
								? language === 'en'
									? 'All Products'
									: 'সমস্ত পণ্য'
								: null}
						</h4>
						<ul className="list-unstyled" style={{paddingBottom: '100px'}}>
							{isLoading ? (
								<SkeletonTheme baseColor="#e6e6e6ae" highlightColor="#f5f5f5cb">
									<Skeleton height={24} count={5} style={{marginBottom: 12}} />
								</SkeletonTheme>
							) : searchResult.length === 0 ? (
								<p>{language === 'en' ? 'No products found.' : 'কোন পণ্য পাওয়া যায়নি।'}</p>
							) : (
								searchResult.map((item: IProduct) => (
									<li key={item.id}>
										<Link href={`/shop/${item.slug}`} className="">
											{language === 'en' ? item.name : item.b_name}
										</Link>
									</li>
								))
							)}
						</ul>
					</>
				)}
			</div>

			{/* Page content */}
		</div>
	);
};

export default Sidebar;
