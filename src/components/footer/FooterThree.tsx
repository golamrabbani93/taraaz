'use client';
import {useGetAllCompanyContactsQuery} from '@/redux/features/companyContact/companyContact';
import {selectLanguage} from '@/redux/features/language/languageSlice';
import {useAppSelector} from '@/redux/hooks';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import {toast} from 'react-toastify';
import LanguageSelector from '../header/LanguageDropdown';
import Link from 'next/link';

function FooterThree() {
	const {data: companyContact, isLoading} = useGetAllCompanyContactsQuery('');
	const language = useAppSelector(selectLanguage);
	return (
		<div>
			<div className="rts-footer-area pt--80 bg_blue-footer footer-padding">
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<div className="footer-main-content-wrapper pb--70">
								{/* single footer area wrapper */}
								<div className="single-footer-wized">
									<h3 className="footer-title animated fadeIn">
										{language === 'en' ? 'Company Contact' : 'কোম্পানি যোগাযোগ'}
									</h3>
									<div className="call-area">
										<div className="icon">
											<i className="fa-solid fa-phone-rotary" />
										</div>
										<div className="info">
											<span>
												{language === 'en'
													? 'Have Question? Call Us 24/7'
													: 'প্রশ্ন আছে? আমাদের কল করুন 24/7'}
											</span>
											<a href="#" className="number">
												{isLoading
													? 'Loading...'
													: language === 'en'
													? companyContact[1]?.phone
													: companyContact[1]?.b_phone || '01905050505'}
											</a>
										</div>
									</div>
									<div className="opening-hour">
										<div className="single">
											{isLoading ? (
												<Skeleton className="w-full h-4 rounded-md d-block" />
											) : (
												<p style={{width: '80%'}}>
													{language === 'en'
														? companyContact[1]?.address
														: companyContact[1]?.b_address || 'Loading...'}
												</p>
											)}
										</div>
										<div className="single">
											{isLoading ? (
												<Skeleton className="w-full h-4 rounded-md d-block bg-white" />
											) : (
												<p> Email: {companyContact[1]?.email || 'Loading...'}</p>
											)}
										</div>
									</div>
								</div>

								{/* single footer area wrapper */}
								<div className="single-footer-wized">
									<h3 className="footer-title animated fadeIn">
										{language === 'en' ? 'Pages' : 'পৃষ্ঠা'}
									</h3>
									<div className="footer-nav">
										<ul>
											<li>
												<Link href="/login">{language === 'en' ? 'Login' : 'লগইন'}</Link>
											</li>
											<li>
												<Link href="/register">{language === 'en' ? 'Register' : 'রেজিস্টার'}</Link>
											</li>
											<li>
												<Link href="/faq">{language === 'en' ? 'FAQ' : 'প্রশ্নোত্তর'}</Link>
											</li>
											<li>
												<Link href="#">{language === 'en' ? 'Blogs' : 'ব্লগ'}</Link>
											</li>
											<li>
												<Link href="/contact">{language === 'en' ? 'Contact Us' : 'যোগাযোগ'}</Link>
											</li>
										</ul>
									</div>
								</div>

								<div className="single-footer-wized">
									<h3 className="footer-title animated fadeIn">
										{language === 'en' ? 'Useful Links' : 'লিঙ্ক'}
									</h3>
									<div className="footer-nav">
										<ul>
											<li>
												<a href="/cart">{language === 'en' ? 'Cart' : 'কার্ট'}</a>
											</li>
											<li>
												<a href="/wishlist">{language === 'en' ? 'Wishlist' : 'ইচ্ছা তালিকা'}</a>
											</li>
											<li style={{marginLeft: '-14px'}}>
												<LanguageSelector />
											</li>
										</ul>
									</div>
								</div>
								{/* single footer area wrapper */}
								{/* single footer area wrapper */}
								<div className="single-footer-wized">
									<h3 className="footer-title animated fadeIn">
										{language === 'en' ? 'Help Line' : 'হেল্প লাইন'}
									</h3>
									<p className="disc-news-letter">
										{language === 'en'
											? 'If Any Question Call our 24/7 Help Line'
											: 'যদি কোন প্রশ্ন থাকে আমাদের 24/7 হেল্প লাইন কল করুন'}{' '}
										<br />
										{language === 'en' ? (
											<>
												Help Line Number:{' '}
												<Link
													href={'https://api.whatsapp.com/send?phone=8801999302970&app_absent=0'}
												>
													+8801999302970
												</Link>
											</>
										) : (
											<>
												হেল্প লাইন নম্বর:{' '}
												<Link
													href={'https://api.whatsapp.com/send?phone=8801999302970&app_absent=0'}
												>
													+8801999302970
												</Link>
											</>
										)}
									</p>
									{/* <form
										className="footersubscribe-form"
										onSubmit={(e) => {
											e.preventDefault();
											toast.success('Subscribed Successfully');
											(e.target as HTMLFormElement).reset();
										}}
									>
										<input
											required
											type="email"
											placeholder={language === 'en' ? 'Enter your email' : 'আপনার ইমেইল লিখুন'}
											className="text-white"
										/>
										<button className="rts-btn btn-primary">
											{language === 'en' ? 'Subscribe' : 'সাবস্ক্রাইব করুন'}
										</button>
									</form> */}
									{/* <p className="dsic">
										{language === 'en'
											? 'I would like to receive news and special offers'
											: 'আমি খবর এবং বিশেষ অফার পেতে চাই'}
									</p> */}
								</div>
								{/* single footer area wrapper */}
							</div>
							<div className="social-and-payment-area-wrapper">
								<div className="social-one-wrapper">
									<span>
										{language === 'en'
											? 'Tap the icon for direct contact.'
											: 'আইকনে ট্যাপ করুন সরাসরি যোগাযোগের জন্য।'}
									</span>
									<ul>
										<li>
											<a
												href={companyContact && !isLoading ? companyContact[1]?.instagram : '#'}
												target="_blank"
											>
												<i className="fa-brands fa-instagram" />
											</a>
										</li>
										<li>
											<a href="https://twitter.com/zafran_hair" target="_blank">
												<i className="fa-brands fa-twitter" />
											</a>
										</li>
										<li>
											<a
												href={companyContact && !isLoading ? companyContact[1]?.youtube : '#'}
												target="_blank"
											>
												<i className="fa-brands fa-youtube" />
											</a>
										</li>
										<li>
											<a
												href={companyContact && !isLoading ? companyContact[1]?.facebook : '#'}
												target="_blank"
											>
												<i className="fa-brands fa-whatsapp" />
											</a>
										</li>
										<li>
											<a
												href={companyContact && !isLoading ? companyContact[1]?.linkedin : '#'}
												target="_blank"
											>
												<i className="fa-brands fa-pinterest" />
											</a>
										</li>
									</ul>
								</div>
								<div className="payment-access">
									<span>Copyright © 2025 ZafranShopBD </span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default FooterThree;
