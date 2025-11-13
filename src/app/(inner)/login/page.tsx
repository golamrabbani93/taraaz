'use client';

import ShortService from '@/components/service/ShortService';

import HeaderFive from '@/components/header/HeaderFive';
import Link from 'next/link';
import FooterThree from '@/components/footer/FooterThree';
import ZForm from '@/components/form/ZForm';
import ZInput from '@/components/form/ZInput';
import {useUserLoginMutation} from '@/redux/features/auth/authApi';
import {useRouter} from 'next/navigation';
import {FieldValues} from 'react-hook-form';
import {catchAsync} from '@/utils/catchAsync';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {setUser} from '@/redux/features/user/userSlice';
import {setToken} from '@/services/token/getToken';
import {selectLanguage} from '@/redux/features/language/languageSlice';
import BottomNav from '@/components/BottomNav/BottomNav';
import BottomCategory from '@/components/bottom-category/BottomCategory';
import DeskCategory from '@/components/bottom-category/DeskCategory';

export default function Home() {
	const [loginUser, {isLoading}] = useUserLoginMutation();
	const language = useAppSelector(selectLanguage);
	const router = useRouter();
	const dispatch = useAppDispatch();
	const handleSubmit = async (data: FieldValues) => {
		catchAsync(async () => {
			const result = await loginUser(data);

			if (result?.data) {
				const token = await setToken(result?.data);
				dispatch(setUser({...result?.data, token}));
				//only navigate when url no redirect query
				const urlParams = new URLSearchParams(window.location.search);
				const redirectPath = urlParams.get('redirect');
				if (redirectPath) {
					router.push(redirectPath);
				} else {
					if (result?.data?.role === 'admin') {
						router.push('/dashboard');
					} else {
						router.push('/account');
					}
				}
			}
		});
	};
	return (
		<div className="demo-one ">
			<HeaderFive />
			<BottomCategory />
			<DeskCategory />
			<div className="overlay-item">
				{/* rts register area start */}
				<div className="rts-register-area rts-section-gap ">
					<div className="container">
						<div className="row">
							<div className="col-lg-12">
								<div className="registration-wrapper-1">
									<div className="logo-area mb--0">
										<img className="mb--10" src="/assets/images/logo/1.png" alt="logo" />
									</div>
									<h3 className="title">
										{language === 'en' ? 'Login Into Your Account' : 'আপনার অ্যাকাউন্টে লগইন করুন'}
									</h3>
									<div className="registration-form">
										<ZForm onSubmit={handleSubmit}>
											<div className="input-wrapper">
												<label htmlFor="name">{language === 'en' ? 'Email*' : 'ইমেইল*'}</label>
												<ZInput
													type="text"
													label={language === 'en' ? 'Enter Email' : 'ইমেইল লিখুন'}
													name="email"
												/>
											</div>

											<div className="input-wrapper">
												<label htmlFor="email">
													{language === 'en' ? 'Password*' : 'পাসওয়ার্ড*'}
												</label>
												<ZInput
													type="password"
													label={language === 'en' ? 'Enter Password' : 'পাসওয়ার্ড লিখুন'}
													name="password"
												/>
											</div>

											<button className="rts-btn btn-primary" disabled={isLoading} type="submit">
												{isLoading
													? language === 'en'
														? 'Logging...'
														: 'লগইন হচ্ছে...'
													: language === 'en'
													? 'Login Now'
													: 'লগইন করুন'}
											</button>
										</ZForm>
										<div className="another-way-to-registration">
											{/* <div className="registradion-top-text">
												<span>Or Register With</span>
											</div>
											<div className="login-with-brand">
												<a href="#" className="single">
													<img src="assets/images/form/google.svg" alt="login" />
												</a>
												<a href="#" className="single">
													<img src="assets/images/form/facebook.svg" alt="login" />
												</a>
											</div> */}
											<p>
												{language === 'en' ? "Don't have an account?" : 'অ্যাকাউন্ট নেই?'}{' '}
												<Link href="/register">
													{language === 'en' ? 'Register' : 'নিবন্ধন করুন'}
												</Link>
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* rts register area end */}
			</div>
			<BottomNav />
			<ShortService />
			<FooterThree />
		</div>
	);
}
