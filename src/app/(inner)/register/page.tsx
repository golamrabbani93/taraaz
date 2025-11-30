'use client';
import ShortService from '@/components/service/ShortService';
import FooterOne from '@/components/footer/FooterThree';
import HeaderFive from '@/components/header/HeaderFive';
import Link from 'next/link';
import ZForm from '@/components/form/ZForm';
import ZInput from '@/components/form/ZInput';
import {FieldValues} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {registerBanglaSchema, registerSchema} from '@/schemas/register.schema';
import {catchAsync} from '@/utils/catchAsync';
import {useUserRegisterMutation} from '@/redux/features/auth/authApi';
import hashPassword from '@/utils/hashPassword';
import {toast} from 'react-toastify';
import {useRouter} from 'next/navigation';
import {setToken} from '@/services/token/getToken';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {setUser} from '@/redux/features/user/userSlice';
import {selectLanguage} from '@/redux/features/language/languageSlice';
import BottomNav from '@/components/BottomNav/BottomNav';
import BottomCategory from '@/components/bottom-category/BottomCategory';
import DeskCategory from '@/components/bottom-category/DeskCategory';
export default function Home() {
	const [registerUser, {isLoading}] = useUserRegisterMutation();
	const router = useRouter();
	const dispatch = useAppDispatch();
	const language = useAppSelector(selectLanguage);
	const handleSubmit = async (data: FieldValues) => {
		catchAsync(async () => {
			const hashedPassword = await hashPassword(data.password);
			const result = await registerUser({...data, password_hash: hashedPassword});
			if (result?.data?.id) {
				toast.success('Registration Successful');
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
						router.push('/');
					}
				}
			} else {
				toast.error('Registration Failed');
			}
		});
	};

	return (
		<div className="demo-one">
			<HeaderFive />
			<BottomCategory />
			<DeskCategory />
			<div className="overlay-item">
				{/* rts register area start */}
				<div className="rts-register-area rts-section-gap">
					<div className="container">
						<div className="row">
							<div className="col-lg-12">
								<div className="registration-wrapper-1">
									<div className="logo-area mb--0">
										<img className="mb--10" src="/assets/images/logo/tz-main-logo.png" alt="logo" />
									</div>
									<h3 className="title">
										{language === 'en' ? 'Register Your Account' : 'আপনার অ্যাকাউন্টে নিবন্ধন করুন'}
									</h3>
									<div className="registration-form">
										<ZForm
											onSubmit={handleSubmit}
											resolver={zodResolver(
												language === 'en' ? registerSchema : registerBanglaSchema,
											)}
										>
											<div className="input-wrapper">
												<label htmlFor="name">
													{language === 'en' ? 'Name' : 'নাম'}
													<span className="text-danger">*</span>
												</label>
												<ZInput
													type="text"
													label={language === 'en' ? 'Enter Name' : 'নাম লিখুন'}
													name="name"
												/>
											</div>
											<div className="input-wrapper">
												<label htmlFor="name">
													{language === 'en' ? 'Email' : 'ইমেইল'}
													<span className="text-danger">*</span>
												</label>
												<ZInput
													type="text"
													label={language === 'en' ? 'Enter Email' : 'ইমেইল লিখুন'}
													name="email"
												/>
											</div>
											<div className="input-wrapper">
												<label htmlFor="phone">
													{language === 'en' ? 'Phone' : 'ফোন'}
													<span className="text-danger">*</span>
												</label>
												<ZInput
													type="text"
													label={language === 'en' ? 'Enter Phone' : 'ফোন নম্বর লিখুন'}
													name="phone"
												/>
											</div>

											<div className="input-wrapper">
												<label htmlFor="password">
													{language === 'en' ? 'Password' : 'পাসওয়ার্ড'}
													<span className="text-danger">*</span>
												</label>
												<ZInput
													type="password"
													label={language === 'en' ? 'Enter Password' : 'পাসওয়ার্ড লিখুন'}
													name="password"
												/>
											</div>

											<button type="submit" className="rts-btn btn-primary" disabled={isLoading}>
												{isLoading
													? language === 'en'
														? 'Registering...'
														: 'নিবন্ধন হচ্ছে...'
													: language === 'en'
													? 'Register Account'
													: 'অ্যাকাউন্ট নিবন্ধন করুন'}
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
												{language === 'en'
													? 'Already Have Account?'
													: 'আপনার কি ইতিমধ্যে অ্যাকাউন্ট আছে?'}{' '}
												<Link href="/login">{language === 'en' ? 'Login' : 'লগইন'}</Link>
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
			<FooterOne />
		</div>
	);
}
