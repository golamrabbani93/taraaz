'use client';

import Link from 'next/link';
import {useCart} from '../header/CartContext';

export default function BottomNav() {
	const {cartItems} = useCart();

	const activeItems = cartItems.filter((item) => item.active);

	return (
		<nav className="bottomNav">
			<Link href="/" className="navItem">
				<i className={`fa fa-home icon`}></i>
				<span className="label">Home</span>
			</Link>

			<a href="/cart" className="navItem" style={{position: 'relative'}}>
				<span className="cartBadge">{activeItems.length || 0}</span>
				<div className="relative">
					<i className={`fas fa-shopping-cart icon d-block`}></i>
					<span className="label">Cart</span>
				</div>
			</a>
			<Link href="/account" className="navItem">
				<i className={`fas fa-user icon`}></i>
				<span className="label">Account</span>
			</Link>

			{/* <Link target="_blank" href="#" className="navItem">
				<img style={{width: '18px'}} src="/assets/images/imo.png" alt="imo" />

				<span className="label">IMO</span>
			</Link> */}
			<Link target="_blank" href="#" className="navItem">
				<i className={`fa-brands fa-whatsapp icon`} style={{fontSize: '18px'}}></i>
				<span className="label">WhatsApp</span>
			</Link>
		</nav>
	);
}
