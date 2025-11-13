'use client';
import ShortService from '@/components/service/ShortService';
import HeaderFive from '@/components/header/HeaderFive';
import FooterThree from '@/components/footer/FooterThree';
import {useAppSelector} from '@/redux/hooks';
import {selectLanguage} from '@/redux/features/language/languageSlice';
import FAQ from '@/components/FAQ/FAQ';
import BottomNav from '@/components/BottomNav/BottomNav';
import BottomCategory from '@/components/bottom-category/BottomCategory';
import DeskCategory from '@/components/bottom-category/DeskCategory';

export default function Home() {
	const language = useAppSelector(selectLanguage);

	return (
		<div className="demo-one">
			<HeaderFive />
			<BottomCategory />
			<DeskCategory />
			<>
				{/* rts contact main wrapper */}
				<div className="rts-contact-main-wrapper-banner bg_image">
					<div className="container">
						<div className="row">
							<div className="col-lg-12">
								<div className="contact-banner-content">
									<h1 className="title">
										{language === 'en' ? 'Frequently Asked Questions' : 'সাধারণ জিজ্ঞাসা'}
									</h1>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* rts contact main wrapper end */}

				<div className="rts-map-contact-area rts-section-gap2">
					<FAQ />
				</div>
			</>
			<BottomNav />
			<ShortService />
			<FooterThree />
		</div>
	);
}
