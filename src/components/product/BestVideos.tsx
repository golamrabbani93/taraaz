'use client';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Autoplay} from 'swiper/modules';
import VideoCard from './VideoCard';
import {useGetAllVideosQuery} from '@/redux/features/video/videoApi';
import BestPickSkeleton from '../Loader/Skeleton/BestPickSkeleton/BestPickSkeleton';
import {IVideo} from '@/types/video.types';
import {useAppSelector} from '@/redux/hooks';
import {selectLanguage} from '@/redux/features/language/languageSlice';

const BestVideos = ({data, title}: {data: IVideo[]; title: any[]}) => {
	const language = useAppSelector(selectLanguage);

	return (
		<div className="popular-product-col-7-area rts-section-gapBottom container pt-5 pe-xl-0 ">
			<div className="container cover-card-main-over-white ">
				<div className="row">
					<div className="col-lg-12  p-xl-0">
						<div className="cover-card-main-over-1">
							<div className="container add-shadow p-xl-0">
								<div className="row">
									<div className="col-lg-12 p-xl-0">
										<div className="title-area-between">
											<h2 className="title-left m-0 mb-lg-4">
												{language === 'en' ? title?.[1]?.title : title?.[1]?.b_title}
											</h2>
											<div className="next-prev-swiper-wrapper pt-4">
												<div className="swiper-button-prev border border-1">
													<i className="fa-regular fa-chevron-left" />
												</div>
												<div className="swiper-button-next border border-1">
													<i className="fa-regular fa-chevron-right" />
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="row overflow-hidden me-0">
									<div className="col-lg-12 p-xl-0">
										<div>
											<div className="row   mb-4 mb-lg-0">
												<Swiper
													modules={[Navigation, Autoplay]}
													scrollbar={{hide: true}}
													loop={true}
													navigation={{
														nextEl: '.swiper-button-next',
														prevEl: '.swiper-button-prev',
													}}
													className="mySwiper-category-1"
													breakpoints={{
														0: {slidesPerView: 1, spaceBetween: 30},
														320: {slidesPerView: 1, spaceBetween: 30},
														480: {slidesPerView: 2, spaceBetween: 30},
														640: {slidesPerView: 3, spaceBetween: 30},
														840: {slidesPerView: 4, spaceBetween: 30},
													}}
												>
													{data.map((post: IVideo, index: number) => (
														<SwiperSlide key={index}>
															<div className="single-video-card-one">
																<VideoCard video={post} />
															</div>
														</SwiperSlide>
													))}
												</Swiper>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BestVideos;
