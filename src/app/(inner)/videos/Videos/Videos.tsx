'use client';
import {IProduct} from '@/types/product.types';
import {useAppSelector} from '@/redux/hooks';
import {selectLanguage} from '@/redux/features/language/languageSlice';
import VideoCard from '../../../../components/product/VideoCard';
import {IVideo} from '@/types/video.types';
const Videos = ({data}: {data?: IVideo[]}) => {
	const pinVideos = data?.filter((video) => video.pin === true);

	const language = useAppSelector(selectLanguage);
	return (
		<div className="popular-product-col-7-area rts-section-gapBottom container pt-5 mb-4 mb-lg-0 pe-xl-0">
			<div className="container cover-card-main-over-white ">
				<div className="row">
					<div className="col-lg-12  p-xl-0">
						<div className="cover-card-main-over-1">
							<div className="container add-shadow p-xl-0">
								<div className="row">
									<div className="col-lg-12 p-xl-0"></div>
								</div>
								<div className="row">
									<div className="col-lg-12 p-xl-0">
										<div className="row ">
											<h2 className={`title-left m-0 mb-4`}>Pin Videos</h2>
											{pinVideos?.map((product: IVideo, index: number) => (
												<div className="col-xl-2 col-lg-3 col-md-4 col-6 p-xl-0 gap-2" key={index}>
													<div className=" m-0 mb-4">
														<VideoCard video={product} />
													</div>
												</div>
											))}
										</div>
										<div className="row ">
											<h2 className={`title-left m-0 mb-4`}>All Videos</h2>
											{data?.map((product: IVideo, index: number) => (
												<div className="col-xl-2 col-lg-3 col-md-4 col-6 p-xl-0 gap-2" key={index}>
													<div className=" m-0 mb-4">
														<VideoCard video={product} />
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

export default Videos;
