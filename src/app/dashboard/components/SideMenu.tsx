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
		icon: 'far fa-game-board',
		href: '/dashboard',
		children: [{title: 'Dashboard', href: '/dashboard'}],
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
		title: 'Order',
		icon: 'far fa-box',
		children: [{title: 'Order', href: '/dashboard/order'}],
	},

	{
		title: 'Messages',
		icon: 'far fa-envelope',
		children: [{title: 'All Messages', href: '/dashboard/message'}],
	},

	{
		title: 'Users',
		icon: 'far fa-user',
		children: [{title: 'User List', href: '/dashboard/user-list'}],
	},

	{
		title: 'FAQ',
		icon: 'far fa-user',
		children: [
			{
				title: 'FAQ List',
				href: '/dashboard/faq-list',
			},
			{title: 'Add FAQ', href: '/dashboard/add-faq'},
		],
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
		icon: 'fas fa-address-book',
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
];

const SidebarMenu = () => {
	const [openIndex, setOpenIndex] = useState<number | null>(0); // 0 means Dashboard open by default
	const pathname = usePathname();

	useEffect(() => {
		// Find the index of the menu item that has a child matching the current path
		const activeIndex = menuItems.findIndex((item) => {
			return item.children?.some((child) => {
				return pathname === child.href || (child.title === 'dashboard' && pathname === '/index');
			});
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

				return (
					<li className="single-menu-item" key={index}>
						{hasSubmenu ? (
							<Link
								href="#"
								className={`with-plus ${isOpen ? 'active' : ''}`}
								onClick={(e) => {
									e.preventDefault();
									handleToggle(index);
								}}
							>
								<i className={item.icon}></i>
								<p>{item.title}</p>
							</Link>
						) : (
							<Link href={item.href || '#'}>
								<p>{item.title}</p>
							</Link>
						)}

						{hasSubmenu && (
							<ul className={`submenu mm-collapse parent-nav ${isOpen ? 'mm-show' : ''}`}>
								{item.children!.map((sub, subIndex) => {
									const isActive =
										pathname === sub.href || (sub.title === 'Main Demo' && pathname === '/index');
									return (
										<li key={subIndex}>
											<Link
												href={sub.href}
												className={`mobile-menu-link ${isActive ? 'active' : ''}`}
											>
												{sub.title}
											</Link>
										</li>
									);
								})}
							</ul>
						)}
					</li>
				);
			})}
		</ul>
	);
};

export default SidebarMenu;
