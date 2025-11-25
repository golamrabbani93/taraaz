'use client';
import {useGetSingleCompanyContactQuery} from '@/redux/features/companyContact/companyContact';
import {selectLanguage} from '@/redux/features/language/languageSlice';
import {useAppSelector} from '@/redux/hooks';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import {toast} from 'react-toastify';
import LanguageSelector from '../header/LanguageDropdown';
import Link from 'next/link';

function FooterThree() {
	const {data: companyContact, isLoading} = useGetSingleCompanyContactQuery('1');
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
											<Link href={companyContact?.whatsapp || '#'} className="number text-white">
												{isLoading
													? 'Loading...'
													: language === 'en'
													? companyContact?.phone
													: companyContact?.b_phone || 'Loading...'}
											</Link>
										</div>
									</div>
									<div className="opening-hour">
										<div className="single">
											{isLoading ? (
												<Skeleton className="w-full h-4 rounded-md d-block" />
											) : (
												<p style={{width: '80%'}}>
													{language === 'en'
														? companyContact?.address
														: companyContact?.b_address || 'Loading...'}
												</p>
											)}
										</div>
										<div className="single">
											{isLoading ? (
												<Skeleton className="w-full h-4 rounded-md d-block bg-white" />
											) : (
												<p> Email: {companyContact?.email || 'Loading...'}</p>
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
											{/* <li>
												<Link href="/faq">{language === 'en' ? 'FAQ' : 'প্রশ্নোত্তর'}</Link>
											</li> */}
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
											<li>
												<Link href="/shop">{language === 'en' ? 'Products' : 'পণ্য'}</Link>
											</li>
											<li>
												<Link href="/videos">{language === 'en' ? 'Videos' : 'ভিডিও'}</Link>
											</li>
											{/* <li style={{marginLeft: '-14px'}}>
												<LanguageSelector />
											</li> */}
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
												<Link href={companyContact?.whatsapp || '#'}>
													<u> {companyContact?.phone || 'Loading...'}</u>
												</Link>
											</>
										) : (
											<>
												হেল্প লাইন নম্বর:{' '}
												<Link href={companyContact?.whatsapp || '#'}>
													<u> {companyContact?.b_phone || 'Loading...'}</u>
												</Link>
											</>
										)}
									</p>
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
										{companyContact && !isLoading && companyContact?.whatsapp.length > 0 && (
											<li>
												<Link
													href={companyContact && !isLoading ? companyContact?.whatsapp : '#'}
													target="_blank"
												>
													<i className="fa-brands fa-whatsapp" />
												</Link>
											</li>
										)}

										{companyContact && !isLoading && companyContact?.instagram.length > 0 && (
											<li>
												<Link
													href={companyContact && !isLoading ? companyContact?.instagram : '#'}
													target="_blank"
												>
													<i className="fa-brands fa-instagram" />
												</Link>
											</li>
										)}
										{/* */}
										{companyContact && !isLoading && companyContact?.youtube.length > 0 && (
											<li>
												<Link
													href={companyContact && !isLoading ? companyContact?.youtube : '#'}
													target="_blank"
												>
													<i className="fa-brands fa-youtube" />
												</Link>
											</li>
										)}
										{companyContact && !isLoading && companyContact?.facebook.length > 0 && (
											<li>
												<Link
													href={companyContact && !isLoading ? companyContact?.facebook : '#'}
													target="_blank"
												>
													<i className="fa-brands fa-facebook" />
												</Link>
											</li>
										)}
										{companyContact && !isLoading && companyContact?.tiktok.length > 0 && (
											<li>
												<Link
													href={companyContact && !isLoading ? companyContact?.tiktok : '#'}
													target="_blank"
												>
													<i className="fa-brands fa-tiktok" />
												</Link>
											</li>
										)}
										{companyContact && !isLoading && companyContact?.imo.length > 0 && (
											<li>
												<Link
													href={companyContact && !isLoading ? companyContact?.imo : '#'}
													target="_blank"
												>
													<i className="fas fa-envelope"></i>
												</Link>
											</li>
										)}
									</ul>
								</div>
								<div className="payment-access">
									<span>Copyright © 2025 Taraaz | All rights reserved.</span>
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
