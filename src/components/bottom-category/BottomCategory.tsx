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
						href="#"
						target="_self"
						// onClick={() => {
						// 	setCollapsed(true);
						// 	setText('hair-care-products');
						// }}
					>
						{language === 'en' ? 'Taraaz Fashion' : 'হেয়ার কেয়ার পণ্য'}
					</Link>

					<Link
						className=""
						href="#"
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
						href="#"
						target="_self"
						// onClick={() => {
						// 	setCollapsed(true);
						// 	setText('');
						// }}
					>
						{language === 'en' ? 'Saree' : 'সমস্ত পণ্য'}
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
							className="lucide lucide-menu-icon lucide-menu"
						>
							<path d="M4 5h16" />
							<path d="M4 12h16" />
							<path d="M4 19h16" />
						</svg>*/}
					</Link>
				</div>
			</div>
			<Sidebar collapsed={collapsed} setCollapsed={setCollapsed} text={text} />
		</>
	);
};

export default BottomCategory;
