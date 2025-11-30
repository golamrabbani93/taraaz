'use client';
import WeeklyBestSellingMain from '@/components/product-main/WeeklyBestSellingMain';
import {useGetAllProductsQuery} from '@/redux/features/product/productApi';

import BestPickSkeleton from '../Loader/Skeleton/BestPickSkeleton/BestPickSkeleton';
import {useGetAllWebsiteTitlesQuery} from '@/redux/features/companyTitle/companyTitle';
import {useAppSelector} from '@/redux/hooks';
import {selectLanguage} from '@/redux/features/language/languageSlice';
import {IProduct} from '@/types/product.types';
import Link from 'next/link';
interface BestPickForYouProps {
	data: IProduct[];
	title: any[];
}

const BestPickForYou = ({data, title}: BestPickForYouProps) => {
	const language = useAppSelector(selectLanguage);
	const hairProducts = Array.isArray(data) ? data.filter((product) => product.pin) : [];

	return (
		<div className="popular-product-col-7-area rts-section-gapBottom container pt-5 pe-xl-0">
			<div className="container cover-card-main-over-white">
				<div className="row">
					<div className="col-lg-12  p-xl-0">
						<div className="cover-card-main-over-1">
							<div className="container add-shadow p-xl-0">
								<div className="row">
									<div className="col-lg-12  p-xl-0">
										<div className="title-area-between">
											<h2 className="title-left m-0 mb-4">
												{language === 'en' ? title?.[0]?.title : title?.[0]?.b_title}
												<Link
													href="/shop"
													className=" d-block text-decoration-underline me-lg-3"
													style={{fontSize: '13px'}}
												>
													{language === 'en' ? 'See All Products' : 'সব প্রোডাক্ট দেখুন'}
												</Link>
											</h2>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-lg-12">
										<div>
											<div className="row">
												{hairProducts?.map((product, index) => (
													<div className="col-xl-3 col-lg-3 col-md-4 col-6 mb-3" key={index}>
														<div className="single-shopping-card-one m-0 mb-4">
															<WeeklyBestSellingMain product={product} />
														</div>
													</div>
												))}
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

export default BestPickForYou;
