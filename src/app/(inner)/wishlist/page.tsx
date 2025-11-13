'use client';

import ShortService from '@/components/service/ShortService';
import CartMain from './CartMain';
import HeaderFive from '@/components/header/HeaderFive';
import FooterThree from '@/components/footer/FooterThree';
import BottomNav from '@/components/BottomNav/BottomNav';
import BottomCategory from '@/components/bottom-category/BottomCategory';
import DeskCategory from '@/components/bottom-category/DeskCategory';

export default function Home() {
	return (
		<div className="demo-one wishlist-page">
			<HeaderFive />
			<BottomCategory />
			<DeskCategory />
			<>
				<div className="section-seperator bg_light-1">
					<div className="container">
						<hr className="section-seperator" />
					</div>
				</div>
			</>

			<CartMain />
			<BottomNav />
			<ShortService />
			<FooterThree />
		</div>
	);
}
