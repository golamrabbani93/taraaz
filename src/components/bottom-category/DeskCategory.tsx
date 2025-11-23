'use client';

import {selectLanguage} from '@/redux/features/language/languageSlice';
import {useAppSelector} from '@/redux/hooks';
import Link from 'next/link';
import Sidebar from '../Sidebar/Sidebar';
import {useState} from 'react';

const DeskCategory = () => {
	const language = useAppSelector(selectLanguage);

	const [collapsed, setCollapsed] = useState<boolean>(false);
	const [text, setText] = useState<string>('');
	return (
		<div className="desktop-category-wrapper">
			<div className="container">
				<div className="d-flex align-items-center justify-content-center gap-5">
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
						{language === 'en' ? "Designer's Choice" : 'স্কিন কেয়ার পণ্য'}
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
						{language === 'en' ? 'Pakisthani Wear' : 'সমস্ত পণ্য'}
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
					<Link
						className="d-flex align-items-center"
						href="#"
						target="_self"
						// onClick={() => {
						// 	setCollapsed(true);
						// 	setText('');
						// }}
					>
						{language === 'en' ? 'Indian Wear' : 'সমস্ত পণ্য'}
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
							className="lucide lucide-chevron-down-icon lucide-chevron-down ms-2"
						>
							<path d="m6 9 6 6 6-6" />
						</svg> */}
					</Link>
				</div>
			</div>
			<Sidebar collapsed={collapsed} setCollapsed={setCollapsed} text={text} />
		</div>
	);
};

export default DeskCategory;
