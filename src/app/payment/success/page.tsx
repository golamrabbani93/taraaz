'use client';

import {selectLanguage} from '@/redux/features/language/languageSlice';
import {useAppSelector} from '@/redux/hooks';
import Link from 'next/link';
import {useEffect} from 'react';
import Lottie from 'lottie-react'; // Import Lottie for React
import flowerAnimation from './Confetti.json'; // Replace with your Lottie JSON file path (e.g., a blooming flower or floating petals)

const fullScreenAnimationStyle: React.CSSProperties = {
	position: 'fixed',
	top: 0,
	left: 0,
	width: '100vw',
	height: '100vh',
	zIndex: -1, // Behind the page content
	pointerEvents: 'none', // Prevent interaction
};

const page = () => {
	const language = useAppSelector(selectLanguage);
	const clearCart = () => {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('cart');
		}
	};
	useEffect(() => {
		clearCart();
	}, []);

	return (
		<>
			{/* Full-Screen Flower Animation Background */}
			<div style={fullScreenAnimationStyle}>
				<Lottie
					animationData={flowerAnimation}
					loop={true} // Loop for continuous effect
					autoplay={true}
					style={{width: '100%', height: '100%'}}
				/>
			</div>

			<div className="container text-center mt-5 conformation">
				<div className="card shadow-lg p-4 border-success">
					<h1 className="text-success">
						{language === 'en' ? '🎉 Payment Successful!' : '🎉 পেমেন্ট সফল!'}
					</h1>

					<p className="mt-3">
						{language === 'en'
							? 'Thank you for your payment. Your transaction was completed successfully.'
							: 'আপনার পেমেন্টের জন্য ধন্যবাদ। আপনার লেনদেন সফলভাবে সম্পন্ন হয়েছে।'}
					</p>
					<Link href="/" className="btn btn-success mt-3">
						{language === 'en' ? 'Go Back Home' : 'ফিরে যান'}
					</Link>
				</div>
			</div>
		</>
	);
};

export default page;
