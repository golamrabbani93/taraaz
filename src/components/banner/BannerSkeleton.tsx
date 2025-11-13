import React from 'react';
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type Props = {
	// optional: allow overriding heights for responsiveness
	bigHeight?: number | string;
	smallHeight?: number | string;
};

const BannerSkeleton: React.FC<Props> = ({bigHeight = 420, smallHeight = 420}) => {
	return (
		<SkeletonTheme baseColor="#e6e6e6" highlightColor="#f5f5f5">
			<div className="rts-banner-area d-none d-md-block">
				<div className="container p-xl-0">
					<div className="row g-sm-4">
						{/* Left large banner (col-lg-10) */}
						<div className="col-lg-10">
							<div className="overflow-hidden">
								<div
									className="banner-left-five-area-start bg_image"
									style={{borderRadius: 8, overflow: 'hidden'}}
								>
									{/* Use a large skeleton that approximates the slider image */}
									{/* <Skeleton width="965" height={bigHeight} /> */}
									{/* Overlay area skeletons (button) */}
									<div
										style={{
											position: 'relative',
											top: -60,
											display: 'flex',
											gap: 12,
											// padding: '0 24px',
										}}
									>
										<div>
											<Skeleton height={940} width={965} />
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Right small banner (col-lg-2) */}
						<div className="col-lg-2">
							<div
								className="banner-five-right-content bg_image"
								style={{borderRadius: 8, overflow: 'hidden'}}
							>
								<Skeleton width="100%" height={smallHeight} />
								{/* content placeholders */}
								<div style={{padding: 12}}>
									<Skeleton height={24} width="70%" />
									<div style={{marginTop: 8}}>
										<Skeleton height={16} width="90%" />
										<Skeleton height={16} width="60%" style={{marginTop: 6}} />
									</div>
									<div style={{marginTop: 12}}>
										<Skeleton height={36} width="100%" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</SkeletonTheme>
	);
};

export default BannerSkeleton;
