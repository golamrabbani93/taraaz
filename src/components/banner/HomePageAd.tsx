'use client';
import {useGetAllBottomBannersQuery} from '@/redux/features/bottomBanner/bottomBannerApi';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';

interface HomePageAdProps {
	data: {
		image: string;
		name?: string;
	} | null;
}

const HomePageAd = ({data}: HomePageAdProps) => {
	return (
		<div className="container  rounded-lg overflow-hidden p-xl-0">
			<Image
				src={data?.image || '/assets/images/banner/homepage-ad.jpg'}
				alt={data?.name || 'Home Page Ad'}
				layout="responsive"
				width={1200}
				height={600}
				style={{borderRadius: '10px'}}
			/>
		</div>
	);
};

export default HomePageAd;
