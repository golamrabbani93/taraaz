'use client';
import {useGetAllBottomBannersQuery} from '@/redux/features/bottomBanner/bottomBannerApi';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';

const HomePageAd = ({data}: {data: any[]}) => {
	return (
		<div className="container  rounded-lg overflow-hidden p-xl-0">
			<Image
				src={data?.[0]?.image}
				alt={data?.[0]?.name || 'Home Page Ad'}
				layout="responsive"
				width={1200}
				height={600}
				style={{borderRadius: '10px'}}
			/>
		</div>
	);
};

export default HomePageAd;
