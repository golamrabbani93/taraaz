'use client';
import React, {useEffect, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Autoplay} from 'swiper/modules';
import WeeklyBestSellingMain from '@/components/product-main/WeeklyBestSellingMain';
import {useGetAllProductsQuery} from '@/redux/features/product/productApi';
import {IProduct} from '@/types/product.types';
import {useAppSelector} from '@/redux/hooks';
import {selectLanguage} from '@/redux/features/language/languageSlice';

function FeatureProduct({type}: {type?: string | undefined}) {
	const {data: products} = useGetAllProductsQuery(undefined);
	const [displayProducts, setDisplayProducts] = useState<any[]>([]);
	const language = useAppSelector(selectLanguage);
	useEffect(() => {
		let filtered = type
			? products.filter((product: IProduct) => product.type === type)
			: [...products];
		let result = [...filtered];
		// Add random products until we have at least 8
		while (result.length < 8 && products.length > 0) {
			const randomProduct = products[Math.floor(Math.random() * products.length)];
			if (!result.includes(randomProduct)) {
				result.push(randomProduct);
			}
		}
		setDisplayProducts(result);
	}, [type]);

	return (
		<div>
			{/* rts grocery feature area start */}
			<div className="rts-grocery-feature-area rts-section-gap">
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<div className="title-area-between">
								<h2 className="title-left">
									{language === 'en' ? 'Related Product' : 'সম্পর্কিত পণ্য'}
								</h2>
								<div className="next-prev-swiper-wrapper">
									<div className="swiper-button-prev">
										<i className="fa-regular fa-chevron-left" />
									</div>
									<div className="swiper-button-next">
										<i className="fa-regular fa-chevron-right" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<div className="category-area-main-wrapper-one">
								<Swiper
									modules={[Navigation, Autoplay]}
									scrollbar={{hide: true}}
									autoplay={{delay: 3000, disableOnInteraction: false}}
									loop={true}
									navigation={{nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev'}}
									className="mySwiper-category-1"
									breakpoints={{
										0: {slidesPerView: 2, spaceBetween: 30},
										320: {slidesPerView: 2, spaceBetween: 30},
										480: {slidesPerView: 2, spaceBetween: 30},
										640: {slidesPerView: 3, spaceBetween: 30},
										840: {slidesPerView: 4, spaceBetween: 30},
										1140: {slidesPerView: 6, spaceBetween: 10},
									}}
								>
									{displayProducts.map((post) => (
										<SwiperSlide key={post.id}>
											<div className="single-shopping-card-one overflow-hidden">
												<WeeklyBestSellingMain product={post} />
											</div>
										</SwiperSlide>
									))}
								</Swiper>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* rts grocery feature area end */}
		</div>
	);
}

export default FeatureProduct;
