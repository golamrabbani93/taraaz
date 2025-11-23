'use client';

import Link from 'next/link';
import SingleCard from './SingleCard';
import {useAppSelector} from '@/redux/hooks';
import {selectLanguage} from '@/redux/features/language/languageSlice';

const FeatureCard = () => {
	const language = useAppSelector(selectLanguage);
	const features = [
		{
			imgSrc: '/assets/images/feature-card/whatsapp.png', // top-up icon
			title: language === 'en' ? 'Order via WhatsApp' : 'হোয়াটসঅ্যাপে অর্ডার করুন',
			description:
				language === 'en' ? 'Shop smarter & get instant support on WhatsApp' : 'স্মার্ট শপিং করুন ',
		},

		{
			imgSrc: '/assets/images/feature-card/free.jpg', // truck / free shipping icon
			title: language === 'en' ? 'Fast Shipping' : 'দ্রুত শিপিং',
			description: language === 'en' ? 'Fast & Reliable Delivery' : 'দ্রুত ও নির্ভরযোগ্য ডেলিভারি',
		},
		{
			imgSrc: '/assets/images/feature-card/brand.png', // LazMall logo or similar
			title: language === 'en' ? 'Taraaz Brands' : 'তারাজ ব্র্যান্ডস',
			description: language === 'en' ? '100% Authentic Brands' : '১০০% খাঁটি ব্র্যান্ড',
		},
	];

	return (
		<div className="container my-4 d-none d-lg-block p-xl-0">
			<div className="row">
				{features.map((feature, index) => (
					<div key={index} className="col-lg-4 mb-3">
						{feature.title === 'Order via WhatsApp' ? (
							<Link className="d-flex" href="#" target="_blank">
								<SingleCard
									key={index}
									imgSrc={feature.imgSrc}
									title={feature.title}
									description={feature.description}
								/>
							</Link>
						) : (
							<SingleCard
								key={index}
								imgSrc={feature.imgSrc}
								title={feature.title}
								description={feature.description}
							/>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default FeatureCard;
