'use client';

import Link from 'next/link';
import {useCart} from '../header/CartContext';
import {useGetSingleCompanyContactQuery} from '@/redux/features/companyContact/companyContact';
import {usePathname} from 'next/navigation';

export default function BottomNav() {
	const {cartItems} = useCart();
	const {data: companyContact} = useGetSingleCompanyContactQuery('1');
	const activeItems = cartItems.filter((item) => item.active);
	const pathname = usePathname();
	return (
		<nav className="bottomNav">
			<Link href="/" className="navItem" style={pathname === '/' ? {color: '#b4842d'} : {}}>
				<i className={`fa fa-home icon`} style={pathname === '/' ? {color: '#b4842d'} : {}}></i>
				<span className="label">Home</span>
			</Link>
			<Link
				href="/shop"
				className="navItem"
				style={pathname.includes('/shop') ? {color: '#b4842d'} : {}}
			>
				<i
					className={`fas fa-store icon`}
					style={pathname.includes('/shop') ? {color: '#b4842d'} : {}}
				></i>
				<span className="label">Shop</span>
			</Link>
			<a
				href="/cart"
				className="navItem"
				style={{position: 'relative', color: pathname === '/cart' ? '#b4842d' : ''}}
			>
				<span className="cartBadge">{activeItems.length || 0}</span>
				<div className="relative">
					<i
						className={`fas fa-shopping-cart icon d-block`}
						style={pathname === '/cart' ? {color: '#b4842d'} : {}}
					></i>
					<span className="label">Cart</span>
				</div>
			</a>

			<Link
				href="/account"
				className="navItem"
				style={pathname.includes('/account') ? {color: '#b4842d'} : {}}
			>
				<i className={`fas fa-user icon`}></i>
				<span className="label">Account</span>
			</Link>

			{/* <Link target="_blank" href="#" className="navItem">
				<img style={{width: '18px'}} src="/assets/images/imo.png" alt="imo" />

				<span className="label">IMO</span>
			</Link> */}
			<Link target="_blank" href={companyContact?.whatsapp || ''} className="navItem">
				<i className={`fa-brands fa-whatsapp icon`} style={{fontSize: '18px'}}></i>
				<span className="label">WhatsApp</span>
			</Link>
		</nav>
	);
}
