'use client';

import BottomNav from '@/components/BottomNav/BottomNav';
import {selectLanguage} from '@/redux/features/language/languageSlice';
import {useAppSelector} from '@/redux/hooks';

export default function FailedPage() {
	const language = useAppSelector(selectLanguage);
	return (
		<>
			<div className="container text-center mt-5 conformation">
				<div className="card shadow-lg p-4 border-danger">
					<h1 className="text-danger">
						{language === 'en' ? '❌ Payment Failed' : '❌ পেমেন্ট ব্যর্থ'}
					</h1>
					<p className="mt-3">
						{language === 'en'
							? 'Unfortunately, your transaction could not be completed. Please try again.'
							: 'দুঃখিত, আপনার লেনদেন সম্পন্ন করা যায়নি। দয়া করে আবার চেষ্টা করুন।'}
					</p>
					<a href="/" className="btn btn-danger mt-3">
						{language === 'en' ? 'Try Again' : 'আবার চেষ্টা করুন'}
					</a>
				</div>
			</div>
		</>
	);
}
