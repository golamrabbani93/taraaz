'use client';

import {selectLanguage} from '@/redux/features/language/languageSlice';
import {useAppSelector} from '@/redux/hooks';
import Link from 'next/link';
import Sidebar from '../Sidebar/Sidebar';
import {useState} from 'react';

const BottomCategory = () => {
	const language = useAppSelector(selectLanguage);
	const [collapsed, setCollapsed] = useState(false);
	const [text, setText] = useState<string>('');
	return (
		<>
			<div className="container custom-category-wrapper">
				<div className="d-flex justify-content-around align-items-center custom-category">
					<Link
						className=""
						href="/shop?category=taraaz-fusion"
						target="_self"
						// onClick={() => {
						// 	setCollapsed(true);
						// 	setText('hair-care-products');
						// }}
					>
						{language === 'en' ? 'Taraaz Fusion' : 'হেয়ার কেয়ার পণ্য'}
					</Link>

					<Link
						className=""
						href="/shop?category=indian-wear"
						target="_self"
						// onClick={() => {
						// 	setCollapsed(true);
						// 	setText('skin-care-products');
						// }}
					>
						{language === 'en' ? 'Indian Wear' : 'স্কিন কেয়ার পণ্য'}
					</Link>
					<Link
						className="d-flex align-items-center"
						href="/shop?category=pakistani-wear"
						target="_self"
						// onClick={() => {
						// 	setCollapsed(true);
						// 	setText('');
						// }}
					>
						{language === 'en' ? 'Pakistani Wear' : 'সমস্ত পণ্য'}
						{/* <svg
							xmlns="http://www.w3.org/2000/svg"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="lucide lucide-chevron-down-icon lucide-chevron-down ms-2"
						>
							<path d="m6 9 6 6 6-6" />
						</svg> */}
					</Link>
				</div>
			</div>
			<Sidebar collapsed={collapsed} setCollapsed={setCollapsed} text={text} />
		</>
	);
};

export default BottomCategory;
