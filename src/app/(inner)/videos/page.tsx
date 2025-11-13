'use client';
import ShortService from '@/components/service/ShortService';
import HeaderFive from '@/components/header/HeaderFive';
import FooterThree from '@/components/footer/FooterThree';
import {useAppSelector} from '@/redux/hooks';
import {selectLanguage} from '@/redux/features/language/languageSlice';
import BottomNav from '@/components/BottomNav/BottomNav';

import BestPickSkeleton from '@/components/Loader/Skeleton/BestPickSkeleton/BestPickSkeleton';
import BottomCategory from '@/components/bottom-category/BottomCategory';
import DeskCategory from '@/components/bottom-category/DeskCategory';
import {useGetAllVideosQuery} from '@/redux/features/video/videoApi';
import Videos from './Videos/Videos';
export default function Home() {
	const language = useAppSelector(selectLanguage);
	const {data: products, isLoading} = useGetAllVideosQuery('', {
		refetchOnMountOrArgChange: true,
	});
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
									<h1 className="title">{language === 'en' ? 'All Videos' : 'সকল ভিডিও'}</h1>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* rts contact main wrapper end */}

				{isLoading ? <BestPickSkeleton /> : <Videos data={products} />}
			</>
			<BottomNav />
			<ShortService />
			<FooterThree />
		</div>
	);
}
