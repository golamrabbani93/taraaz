'use client';
import WeeklyBestSellingMain from '@/components/product-main/WeeklyBestSellingMain';
import {IProduct} from '@/types/product.types';
import {useAppSelector} from '@/redux/hooks';
import {selectLanguage} from '@/redux/features/language/languageSlice';
import Link from 'next/link';
const WeeklyBestSelling = ({
	head,
	data,
	title,
}: {
	head?: boolean;
	data?: IProduct[];
	title?: any[];
}) => {
	const language = useAppSelector(selectLanguage);

	// Filter first pinned products then all products
	const pinnedProducts = Array.isArray(data) ? data.filter((product) => product.pin) : [];
	const allProducts = Array.isArray(data) ? data : [];
	// Combine pinned products first, then the rest, avoiding duplicates
	const combinedProducts = [
		...pinnedProducts,
		...allProducts.filter((product) => !pinnedProducts.includes(product)),
	];
	return (
		<div className="popular-product-col-7-area rts-section-gapBottom container pt-5 mb-4 mb-lg-0 pe-xl-0">
			<div className="container cover-card-main-over-white ">
				<div className="row">
					<div className="col-lg-12  p-xl-0">
						<div className="cover-card-main-over-1">
							<div className="container add-shadow p-xl-0">
								<div className="row">
									<div className="col-lg-12 p-xl-0">
										<div className="title-area-between">
											<h2 className={`title-left m-0 mb-4 ${head ? '' : 'd-none'}`}>
												{language === 'en' ? title?.[2]?.title : title?.[2]?.b_title}
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
									<div className="col-lg-12 p-xl-0">
										<div className="row ">
											{combinedProducts?.map((product: IProduct, index: number) => (
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
	);
};

export default WeeklyBestSelling;
