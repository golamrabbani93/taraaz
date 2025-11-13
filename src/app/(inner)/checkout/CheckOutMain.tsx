'use client';
import React, {useEffect, useState} from 'react';
import {useCart} from '@/components/header/CartContext';
import {useAppSelector} from '@/redux/hooks';
import {selectUser} from '@/redux/features/user/userSlice';
import {useGetMyProfileQuery, useUpdateMyProfileMutation} from '@/redux/features/user/userApi';
import ZForm from '@/components/form/ZForm';
import ZInput from '@/components/form/ZInput';
import {FieldValues} from 'react-hook-form';
import {toast} from 'react-toastify';
import {catchAsync} from '@/utils/catchAsync';
import MainLoader from '@/components/Loader/MainLoader/MainLoader';
import Link from 'next/link';
import {zodResolver} from '@hookform/resolvers/zod';
import {checkoutSchema, checkoutSchemaBangla} from '@/schemas/checkout.schema';
import {TUser} from '@/types/user.types';
import {useCreateOrderMutation} from '@/redux/features/order/orderApi';
import SuccessModal from './SuccessModal';
import {selectLanguage} from '@/redux/features/language/languageSlice';

export default function CheckOutMain() {
	const currentUser = useAppSelector(selectUser);
	const language = useAppSelector(selectLanguage);
	const {data: userData, isLoading} = useGetMyProfileQuery(currentUser?.id && currentUser?.id);
	const [updateProfile, {isLoading: isUpdating}] = useUpdateMyProfileMutation();
	const [DEFAULT_SHIPPING_COST, setShippingCost] = useState<number | null>(null);
	const [onlinePaymentSelected, setOnlinePaymentSelected] = useState(false);
	const [optionalUserData, setOptionalUserData] = useState<Partial<TUser>>({});
	const [redirecting, setRedirecting] = useState(false);
	//add order api
	const [createOrder, {isLoading: isCreatingOrder}] = useCreateOrderMutation();
	useEffect(() => {
		// get localstorage delivery option
		const storedValue = localStorage.getItem('deliveryOption');
		setShippingCost(Number(storedValue));
	}, []);

	const {cartItems} = useCart();

	const handleInputChange = (data: FieldValues) => {
		// If user is logged in, update their profile
		if (currentUser?.id) {
			catchAsync(async () => {
				await updateProfile({
					id: userData?.id,
					password_hash: userData?.password_hash,
					name: data.name,
					email: data.email,
					phone: data.phone,
					address: data.address,
				}).unwrap();
			});
		} else {
			// For guest users, we can generate a random number ID or use a timestamp
			const randomId = Date.now();
			setOptionalUserData({...data, id: randomId});
			toast.success(
				language === 'en'
					? 'Details saved for this session.'
					: 'এই সেশনটির জন্য বিবরণ সংরক্ষিত হয়েছে।',
			);
		}
	};
	const checkIfPlaceOrderShouldBeDisabled = () => {
		if (currentUser?.id) {
			// Logged-in user flow
			if (
				!userData?.id ||
				!userData?.name ||
				!userData?.email ||
				!userData?.phone ||
				!userData?.address
			) {
				toast.error(
					language === 'en'
						? 'Please fill in your details to place the order.'
						: 'অর্ডার দিতে আপনার বিবরণ পূরণ করুন।',
				);
				return true;
			}
		} else {
			// Guest user flow
			if (
				!optionalUserData?.id ||
				!optionalUserData?.name ||
				!optionalUserData?.email ||
				!optionalUserData?.phone ||
				!optionalUserData?.address
			) {
				toast.error(
					language === 'en'
						? 'Please fill in your details to place the order.'
						: 'অর্ডার দিতে আপনার বিবরণ পূরণ করুন।',
				);
				return true;
			}
		}
		return false; // all good
	};

	const handlePlaceOrder = () => {
		const isDisabled = checkIfPlaceOrderShouldBeDisabled();
		if (isDisabled) return;

		if (onlinePaymentSelected) {
			handlePayment();
		} else {
			caseOnDelivery();
		}
	};
	const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
	const shippingCost = DEFAULT_SHIPPING_COST || 0;
	const total = subtotal + shippingCost;

	const handlePayment = async () => {
		setRedirecting(true);
		try {
			// Decide source of customer data
			const customer = currentUser?.id ? userData : optionalUserData;

			if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
				toast.error(
					language === 'en'
						? 'Please fill in all billing details before placing the order.'
						: 'অর্ডার দিতে সমস্ত বিলিং বিবরণ পূরণ করুন।',
				);
				return;
			}

			const res = await fetch('/api/payment/', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					amount: total,
					currency: 'BDT',
					name: customer.name,
					email: customer.email,
					phone: customer.phone,
					address: customer.address,
					id: customer.id,
					items_data: cartItems.map((item) => ({
						product_id: item.id,
						quantity: item.quantity,
						price: item.price,
					})),
					provider: DEFAULT_SHIPPING_COST === 60 ? 'Inside Dhaka' : 'Outside Dhaka',
				}),
			});

			const data = await res.json();
			if (data.GatewayPageURL) {
				window.location.href = data.GatewayPageURL; // redirect to SSLCommerz checkout
			} else {
				console.error('Payment initiation failed', data);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setRedirecting(false);
		}
	};

	const caseOnDelivery = async () => {
		const modalOpen = document.getElementById('open-modal');
		const customer = currentUser?.id ? userData : optionalUserData;
		const data = {
			user_id: customer.id,
			customer_email: customer.email,
			customer_name: customer.name,
			total_amount: total,
			customer_phone: customer.phone,
			delivery_address: customer.address,
			items_data: cartItems.map((item) => ({
				product_id: item.id,
				quantity: item.quantity,
				price: item.price,
			})),
			order_status: 'pending',
			payment_method: 'cod',
			provider: DEFAULT_SHIPPING_COST === 60 ? 'Inside Dhaka' : 'Outside Dhaka',
		};
		if (currentUser?.id) {
			// Logged-in user
			await createOrder(data);
			toast.success(
				language === 'en'
					? 'Order placed successfully! Please prepare the payment upon delivery.'
					: 'অর্ডার সফলভাবে দেওয়া হয়েছে! অনুগ্রহ করে ডেলিভারির সময় পেমেন্ট প্রস্তুত করুন।',
			);
			localStorage.removeItem('cart');
			setTimeout(() => {
				modalOpen?.click();
			}, 1000);
		} else {
			// Guest user
			await createOrder(data);
			toast.success(
				language === 'en'
					? 'Order placed successfully! Please prepare the payment upon delivery.'
					: 'অর্ডার সফলভাবে দেওয়া হয়েছে! অনুগ্রহ করে ডেলিভারির সময় পেমেন্ট প্রস্তুত করুন।',
			);
			localStorage.removeItem('cart');
			setTimeout(() => {
				modalOpen?.click();
			}, 1000);
		}
	};
	if (isLoading) return <MainLoader />;
	return (
		<>
			<div className="checkout-area rts-section-gap">
				<div className="container">
					<div className="row">
						{/* Create Account */}
						{!currentUser?.id && (
							<div className="col-lg-12">
								<div className="create-account mb--30">
									{language === 'en' ? "Don't Have an account? " : 'একটি অ্যাকাউন্ট নেই? '}
									<Link href="/register" className="text-decoration-underline">
										{language === 'en' ? 'Register Now' : 'এখনই নিবন্ধন করুন'}
									</Link>
								</div>
							</div>
						)}
						{/* Left: Billing Details */}
						<div className="col-lg-8 pr--40 order-1 order-xl-1">
							{/* Billing Form */}
							<div className="rts-billing-details-area">
								<h3 className="title">{language === 'en' ? 'Billing Details' : 'বিলিং বিবরণ'}</h3>
								<ZForm
									onSubmit={handleInputChange}
									defaultValues={currentUser?.id ? userData : optionalUserData}
									resolver={zodResolver(language === 'en' ? checkoutSchema : checkoutSchemaBangla)}
								>
									<div className="single-input">
										<label>{language === 'en' ? 'Your Name' : 'আপনার নাম'}</label>
										<ZInput name="name" type="text" label="Your Name" />
									</div>

									<div className="single-input">
										<label>{language === 'en' ? 'Email' : 'ইমেইল'}</label>
										<ZInput name="email" type="email" label="Your Email" />
									</div>
									<div className="single-input">
										<label>{language === 'en' ? 'Phone' : 'ফোন'}</label>
										<ZInput name="phone" type="tel" label="Your Phone" />
									</div>
									<div className="single-input">
										<label>{language === 'en' ? 'Address' : 'ঠিকানা'}</label>
										<ZInput name="address" type="text" label="Your Address" />
									</div>
									<button type="submit" className="rts-btn btn-primary mb-5 mb-md-0">
										{isUpdating
											? language === 'en'
												? 'Wait Updating...'
												: 'আপডেট হচ্ছে...'
											: language === 'en'
											? 'Save Details'
											: 'বিবরণ সংরক্ষণ করুন'}
									</button>
								</ZForm>
							</div>
						</div>

						{/* Right: Order Summary */}
						<div className="col-lg-4 order-2 order-xl-2">
							<h3 className="title-checkout">Your Order</h3>
							<div className="right-card-sidebar-checkout">
								<div className="top-wrapper">
									<div className="product">{language === 'en' ? 'Products' : 'পণ্য'}</div>
									<div className="price">{language === 'en' ? 'Price' : 'মূল্য'}</div>
								</div>

								{cartItems.length === 0 ? (
									<p>{language === 'en' ? 'Your cart is empty.' : 'আপনার কার্ট খালি।'}</p>
								) : (
									cartItems.map((item) => (
										<div className="single-shop-list" key={item.id}>
											<div className="left-area">
												<img
													src={item.image}
													alt={item.title}
													style={{
														borderRadius: '8px',
														objectFit: 'cover',
														width: '50px',
														height: '50px',
													}}
												/>
												<span className="title">
													{item.title} × {item.quantity}
												</span>
											</div>
											<span className="price " style={{width: '80px', textAlign: 'right'}}>
												{item.price * item.quantity} ৳
											</span>
										</div>
									))
								)}

								<div className="single-shop-list">
									<div className="left-area">
										<span>{language === 'en' ? 'Subtotal' : 'সাবটোটাল'}</span>
									</div>
									<span className="price">{subtotal + ' ৳'}</span>
								</div>

								<div className="single-shop-list">
									<div className="left-area">
										<span>{language === 'en' ? 'Shipping' : 'শিপিং'}</span>
									</div>
									<span className="price">{shippingCost} ৳</span>
								</div>

								<div className="single-shop-list">
									<div className="left-area">
										<span style={{fontWeight: 600, color: '#2C3C28'}}>
											{language === 'en' ? 'Total Price:' : 'মোট মূল্য:'}
										</span>
									</div>
									<span className="price" style={{color: '#629D23'}}>
										{total} ৳
									</span>
								</div>

								{/* Payment methods */}
								<div className="cottom-cart-right-area">
									<ul>
										<li onClick={() => setOnlinePaymentSelected(false)}>
											<input
												type="radio"
												id="cod"
												name="payment"
												checked={!onlinePaymentSelected}
												onChange={() => setOnlinePaymentSelected(false)}
											/>
											<label htmlFor="cod">
												{language === 'en' ? 'Cash On Delivery' : 'ক্যাশ অন ডেলিভারি'}
											</label>
										</li>
										{/* <li onClick={() => setOnlinePaymentSelected(true)}>
											<input
												type="radio"
												id="online"
												name="payment"
												checked={onlinePaymentSelected}
												onChange={() => setOnlinePaymentSelected(true)}
											/>
											<label htmlFor="online">
												{language === 'en' ? 'Online Payment' : 'অনলাইন পেমেন্ট'}
											</label>
										</li> */}
									</ul>

									{onlinePaymentSelected ? (
										<button
											type="submit"
											className="rts-btn btn-primary"
											onClick={handlePlaceOrder}
										>
											{redirecting && redirecting
												? language === 'en'
													? 'Placing Order...'
													: 'অর্ডার দেওয়া হচ্ছে...'
												: language === 'en'
												? 'Place Order'
												: 'অর্ডার দিন'}
										</button>
									) : (
										<button
											onClick={() => handlePlaceOrder()}
											type="submit"
											className="rts-btn btn-primary"
										>
											{isCreatingOrder && isCreatingOrder
												? language === 'en'
													? 'Placing Order...'
													: 'অর্ডার দেওয়া হচ্ছে...'
												: language === 'en'
												? 'Place Order'
												: 'অর্ডার দিন'}
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<SuccessModal />
		</>
	);
}
