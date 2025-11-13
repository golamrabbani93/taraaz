import Invoice from '@/components/invoice/Invoice';
import HeaderFive from '@/components/header/HeaderFive';
import FooterThree from '@/components/footer/FooterThree';
import BottomNav from '@/components/BottomNav/BottomNav';
import BottomCategory from '@/components/bottom-category/BottomCategory';
import DeskCategory from '@/components/bottom-category/DeskCategory';

export default async function InvoicePage({params}: {params: Promise<{id: string}>}) {
	const {id} = await params;
	return (
		<div>
			<HeaderFive />
			<BottomCategory />
			<DeskCategory />
			<Invoice id={id} />
			<BottomNav />
			<FooterThree />
		</div>
	);
}
