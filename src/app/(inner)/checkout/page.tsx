import CheckOutMain from './CheckOutMain';
import HeaderFive from '@/components/header/HeaderFive';
import FooterThree from '@/components/footer/FooterThree';
import BottomNav from '@/components/BottomNav/BottomNav';
import BottomCategory from '@/components/bottom-category/BottomCategory';
import DeskCategory from '@/components/bottom-category/DeskCategory';

export default function Home() {
	return (
		<>
			<div className="demo-one">
				<HeaderFive />
				<BottomCategory />
				<DeskCategory />
				<CheckOutMain />
				<BottomNav />
				<FooterThree />
			</div>
		</>
	);
}
