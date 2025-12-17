'use client';
import {useState, useEffect} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';

interface MenuItem {
	title: string;
	icon: string;
	children?: {title: string; href: string}[];
	href?: string;
}

const menuItems: MenuItem[] = [
	{
		title: 'Dashboard',
		icon: 'fas fa-tachometer-alt',
		href: '/dashboard',
	},
	{
		title: 'Orders',
		icon: 'fas fa-shopping-cart',
		href: '/dashboard/order',
	},
	{
		title: 'Product',
		icon: 'fab fa-product-hunt',
		children: [
			{title: 'Product List', href: '/dashboard/product-list'},
			{title: 'Add Product', href: '/dashboard/add-product'},
			{title: 'Product Management', href: '/dashboard/pos'},
		],
	},
	{
		title: 'Users',
		icon: 'far fa-user',
		href: '/dashboard/user-list',
	},
	{
		title: 'Messages',
		icon: 'far fa-envelope',
		href: '/dashboard/message',
	},

	{
		title: 'Banners',
		icon: 'fas fa-photo-video',
		children: [
			{title: 'Banner List', href: '/dashboard/banner'},
			{title: 'Add Banner', href: '/dashboard/add-banner'},
		],
	},
	{
		title: 'Bottom Banners',
		icon: 'fas fa-photo-video',
		children: [
			{title: 'Banner List', href: '/dashboard/bottom-banner'},
			{title: 'Add Banner', href: '/dashboard/add-bottom-banner'},
		],
	},
	{
		title: 'Videos',
		icon: 'fas fa-video',
		children: [
			{title: 'Video List', href: '/dashboard/video'},
			{title: 'Add Video', href: '/dashboard/create-video'},
		],
	},
	{
		title: 'Blogs',
		icon: 'fas fa-blog',
		children: [
			{title: 'Blog List', href: '/dashboard/blog'},
			{title: 'Add Blog', href: '/dashboard/add-blog'},
		],
	},
	{
		title: 'Company Contact',
		icon: 'fas fa-address-book',
		children: [
			{title: 'Company Contact', href: '/dashboard/company-contact'},
			{title: 'Add Company Contact', href: '/dashboard/add-company-contact'},
		],
	},
	{
		title: 'Product Category',
		icon: 'fas fa-barcode',
		children: [
			{title: 'Category List', href: '/dashboard/category-list'},
			{title: 'Add Category', href: '/dashboard/add-category'},
		],
	},
	{
		title: 'Home Page Title',
		icon: 'fas fa-heading',
		children: [
			{title: 'Title List', href: '/dashboard/title-list'},
			{title: 'Add Title', href: '/dashboard/add-title'},
		],
	},
	{
		title: 'Change Password',
		icon: 'fas fa-key',
		href: '/dashboard/change-password',
	},
];

const SidebarMenu = () => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const pathname = usePathname();

	useEffect(() => {
		// Find the index of the menu item that has a child matching the current path
		const activeIndex = menuItems.findIndex((item) => {
			// Check if current path matches a dropdown child
			if (item.children?.some((child) => pathname === child.href)) {
				return true;
			}
			// Check if current path matches a single menu item
			if (item.href && pathname === item.href) {
				return true;
			}
			return false;
		});

		if (activeIndex !== -1) {
			setOpenIndex(activeIndex);
		}
	}, [pathname]);

	const handleToggle = (index: number) => {
		setOpenIndex((prev) => (prev === index ? null : index));
	};

	return (
		<ul className="rts-side-nav-area-left menu-active-parent">
			{menuItems.map((item, index) => {
				const hasSubmenu = !!item.children?.length;
				const isOpen = openIndex === index;
				const isActiveSingle = item.href && pathname === item.href;
				const childActive = hasSubmenu && item.children!.some((c) => pathname === c.href);
				const parentActive = isActiveSingle || childActive;

				return (
					<li className="single-menu-item" key={index}>
						{hasSubmenu ? (
							<>
								<Link
									href="#"
									className={`with-plus ${parentActive ? 'active-parent' : ''}`}
									onClick={(e) => {
										e.preventDefault();
										handleToggle(index);
									}}
									style={parentActive && !isOpen ? {background: '#b4842d', color: '#fff'} : {}}
								>
									<i className={item.icon}></i>
									<p style={parentActive && !isOpen ? {color: '#fff'} : {}}>{item.title}</p>
								</Link>

								<ul className={`submenu mm-collapse parent-nav ${isOpen ? 'mm-show' : ''}`}>
									{item.children!.map((sub, subIndex) => {
										const isActive = pathname === sub.href;
										return (
											<li key={subIndex}>
												<Link
													href={sub.href}
													className={`mobile-menu-link ${isActive ? 'active' : ''}`}
													style={isActive ? {background: '#b4842d', color: '#fff'} : {}}
												>
													{sub.title}
												</Link>
											</li>
										);
									})}
								</ul>
							</>
						) : (
							<Link
								href={item.href || '#'}
								className={`${isActiveSingle ? 'active' : ''}`}
								style={isActiveSingle ? {background: '#b4842d', color: '#fff'} : {}}
							>
								<i className={item.icon}></i>
								<p style={isActiveSingle ? {color: '#fff'} : {}}>{item.title}</p>
							</Link>
						)}
					</li>
				);
			})}
		</ul>
	);
};

export default SidebarMenu;
