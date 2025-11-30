'use client';
import React, {useState, useEffect, EventHandler} from 'react';
import {useCart} from '@/components/header/CartContext';
import {toast} from 'react-toastify';
import {useAppSelector} from '@/redux/hooks';
import {selectLanguage} from '@/redux/features/language/languageSlice';

const CartMain = () => {
	const {cartItems, removeFromCart, updateItemQuantity} = useCart();
	const language = useAppSelector(selectLanguage);
	const [coupon, setCoupon] = useState('');
	const [discount, setDiscount] = useState(0);
	const [couponMessage, setCouponMessage] = useState('');
	const [subtotal, setSubtotal] = useState(0);
	const [selectedOption, setSelectedOption] = useState<number | null>(null);

	// ✅ Load from localStorage only on client
	useEffect(() => {
		const storedOption = localStorage.getItem('deliveryOption');
		if (storedOption) {
			setSelectedOption(Number(storedOption));
		} else {
			// default
			setSelectedOption(70);
			localStorage.setItem('deliveryOption', '70');
		}
	}, []);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = Number(event.target.value);
		setSelectedOption(value);
		localStorage.setItem('deliveryOption', value.toString());
	};
	useEffect(() => {
		const total = cartItems.reduce((acc, item) => {
			const price = item.price;
			const quantity = item.quantity || 1;
			return acc + (isNaN(price) ? 0 : price * quantity);
		}, 0);
		setSubtotal(total);
	}, [cartItems]);

	const applyCoupon = (e: React.FormEvent) => {
		e.preventDefault();
		if (coupon === '12345') {
			setDiscount(0.25);
			setCouponMessage('Coupon applied -25% successfully');
			localStorage.setItem('coupon', coupon);
			localStorage.setItem('discount', '0.25');
		} else {
			setDiscount(0);
			setCouponMessage('Coupon code is incorrect');
			localStorage.removeItem('coupon');
			localStorage.removeItem('discount');
		}
	};

	const clearCart = () => {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('cartItems');
			localStorage.removeItem('coupon');
			localStorage.removeItem('discount');
		}
		setCoupon('');
		setDiscount(0);
		setCouponMessage('');
		cartItems.forEach((item) => removeFromCart(item.id));
	};

	const finalTotal = subtotal - subtotal * discount + (selectedOption ?? 60);

	return (
		<div className="rts-cart-area rts-section-gap bg_light-1">
			<div className="container">
				<div className="row g-5">
					{/* Cart Items */}
					<div className="col-xl-9 col-12 order-2 order-1">
						<div className="rts-cart-list-area">
							<div className="single-cart-area-list head">
								<div className="product-main">
									<p>{language === 'en' ? 'Products' : 'পণ্য'}</p>
								</div>
								<div className="price">
									<p>{language === 'en' ? 'Price' : 'মূল্য'}</p>
								</div>
								<div className="quantity">
									<p>{language === 'en' ? 'Quantity' : 'পরিমাণ'}</p>
								</div>

								<div className="quantity">
									<p>{language === 'en' ? 'Size' : 'আকার'}</p>
								</div>
								<div className="subtotal">
									<p>{language === 'en' ? 'SubTotal' : 'সাবটোটাল'}</p>
								</div>
							</div>

							{cartItems.map((item, i) => (
								<div className="single-cart-area-list main item-parent" key={i}>
									<div className="product-main-cart">
										<div
											className="close section-activation"
											onClick={() => removeFromCart(item.id, item.size ? item.size : undefined)}
										>
											<i className="fa-regular fa-x" />
										</div>
										<div className="thumbnail">
											<img src={item.image} alt="shop" />
										</div>
										<div className="information">
											<h6 className="title">{language === 'en' ? item.title : item.b_name}</h6>
										</div>
									</div>
									<div className="price">
										<p>{item.price} ৳</p>
									</div>
									<div className="quantity">
										<div className="quantity-edit">
											<input type="text" className="input" value={item.quantity} readOnly />
											<div className="button-wrapper-action">
												<button
													className="button minus"
													onClick={() =>
														item.quantity > 1 &&
														updateItemQuantity(
															item.id,
															item.quantity - 1,
															item.size ? item.size : undefined,
														)
													}
												>
													<i className="fa-regular fa-chevron-down" />
												</button>
												<button
													className="button plus"
													onClick={() =>
														updateItemQuantity(
															item.id,
															item.quantity + 1,
															item.size ? item.size : undefined,
														)
													}
												>
													<i className="fa-regular fa-chevron-up" />
												</button>
											</div>
										</div>
									</div>
									<div className="quantity">
										<p className="ms-3">{item.size ? item.size : '---'}</p>
									</div>
									<div className="subtotal ms-1">
										<p>{item.price * item.quantity} ৳</p>
									</div>
								</div>
							))}

							{/* Coupon + Clear */}
							<div className="bottom-cupon-code-cart-area">
								{/* <form onSubmit={applyCoupon}>
									<input
										type="text"
										placeholder="Coupon Code"
										value={coupon}
										onChange={(e) => {
											setCoupon(e.target.value);
											setCouponMessage('');
										}}
									/>
									<button type="submit" className="rts-btn btn-primary">
										Apply Coupon
									</button>
									{couponMessage && (
										<p style={{color: coupon === '12345' ? 'green' : 'red', marginTop: '8px'}}>
											{couponMessage}
										</p>
									)}
								</form> */}
								<button onClick={clearCart} className="rts-btn btn-primary mr--50">
									{language === 'en' ? 'Clear Cart' : 'কার্ট পরিষ্কার করুন'}
								</button>
							</div>
						</div>
					</div>

					{/* Summary Area */}
					<div className="col-xl-3 col-12 order-1 order-2">
						<div className="cart-total-area-start-right">
							<h5 className="title">Cart Totals</h5>
							<div className="subtotal">
								<span>{language === 'en' ? 'Subtotal' : 'সাবটোটাল'}</span>
								<h6 className="price">{subtotal} ৳</h6>
							</div>
							<div className="shipping">
								<span>{language === 'en' ? 'Shipping' : 'শিপিং'}</span>
								<ul>
									<li>
										<input
											type="radio"
											id="s-option"
											name="selector"
											value={70}
											checked={selectedOption === 70}
											onChange={handleChange}
										/>
										<label htmlFor="s-option">
											{language === 'en' ? 'Inside Dhaka-70৳' : 'ঢাকার ভিতরে-70৳'}
										</label>
									</li>
									<li>
										<input
											type="radio"
											id="t-option"
											name="selector"
											value={120}
											checked={selectedOption === 120}
											onChange={handleChange}
										/>
										<label htmlFor="t-option">
											{language === 'en' ? 'Outside Dhaka-120৳' : 'ঢাকার বাইরে-120৳'}
										</label>
									</li>
								</ul>
							</div>
							<div className="bottom">
								<div className="wrapper">
									<span>{language === 'en' ? 'Total' : 'মোট'}</span>
									<h6 className="price">{finalTotal} ৳</h6>
								</div>
								<div className="button-area">
									{!cartItems.length ? (
										<button
											className="rts-btn btn-primary w-100"
											onClick={() => toast.error('Your cart is empty!')}
										>
											{language === 'en' ? 'Proceed to Checkout' : 'চেকআউট করুন'}
										</button>
									) : (
										<a href={`/checkout`}>
											<button className="rts-btn btn-primary w-100">
												{language === 'en' ? 'Proceed to Checkout' : 'চেকআউট করুন'}
											</button>
										</a>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartMain;
