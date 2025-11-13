'use client';

import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Autoplay} from 'swiper/modules';
import {useGetAllBannersQuery} from '@/redux/features/banner/bannerApi';
import BannerSkeleton from './BannerSkeleton';
import Image from 'next/image';
import {relative} from 'path';
function BannerFive({data}: {data: any}) {
	// const {data: allBanners, isLoading} = useGetAllBannersQuery('');
	// const allBanners = data || [];

	const bannerSliders =
		data && Array.isArray(data)
			? data.map((banner: {image: string | null}) => ({
					img: banner.image ?? '/assets/images/banner/slider/2.png',
			  }))
			: [{img: '/assets/images/banner/slider/1.png'}, {img: '/assets/images/banner/slider/2.png'}];
	if (!bannerSliders || bannerSliders.length === 0) {
		return <BannerSkeleton />;
	}

	return (
		<div>
			<>
				{/* rts banner areaas tart */}
				<div className="rts-banner-area ">
					<div className="container p-xl-0">
						<div className="row  g-sm-4">
							<div className="col-lg-10">
								<div className="overflow-hidden">
									<Swiper
										modules={[Autoplay]}
										loop
										autoplay={{
											delay: 2000,
											disableOnInteraction: false,
										}}
										speed={1000}
										style={{position: 'relative', zIndex: '-1'}}
									>
										{bannerSliders?.map((slider: {img: string}, index: number) => (
											<SwiperSlide key={index}>
												<div
													className="banner-left-five-area-start bg_image"
													// style={{backgroundImage: `url(${slider?.img})`}}
												>
													<Image
														src={slider?.img}
														alt={`Banner Image ${index + 1}`}
														width={1200}
														height={600}
														quality={100}
														priority={true}
													/>
												</div>
											</SwiperSlide>
										))}
									</Swiper>
								</div>
							</div>
							<div className="col-lg-2">
								<div className="banner-five-right-content bg_image">
									<video autoPlay loop muted playsInline className="video-bg">
										<source src="/assets/images/banner/bg.mp4" type="video/mp4" />
									</video>
									{/* <div className="content-area">
										<a href="#" className="rts-btn btn-primary">
											Weekend Discount
										</a>
										<h3 className="title">
											Strawberry Water Drinks
											<span>Flavors Awesome</span>
										</h3>
										<a href="/shop" className="shop-now-goshop-btn">
											<span className="text">Shop Now</span>
											<div className="plus-icon">
												<i className="fa-sharp fa-regular fa-plus" />
											</div>
											<div className="plus-icon">
												<i className="fa-sharp fa-regular fa-plus" />
											</div>
										</a>
									</div> */}
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* rts banner areaas end */}
			</>
		</div>
	);
}

export default BannerFive;
