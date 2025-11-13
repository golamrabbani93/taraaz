import CardSkeleton from '../CardSkeleton';

const BestPickSkeleton = ({title}: {title?: string}) => {
	return (
		<div className="popular-product-col-7-area rts-section-gapBottom container">
			<div className="container cover-card-main-over-white ">
				<div className="row  p-xl-0">
					<div className="col-lg-12  p-xl-0">
						<div className="cover-card-main-over-1">
							<div className="container add-shadow  p-xl-0">
								<div className="row  p-xl-0">
									<div className="col-lg-12  p-xl-0 ">
										<div className="title-area-between">
											<h2 className="title-left m-0 mb-2 ms-lg-4">{title}</h2>
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-lg-12  p-xl-0">
										<div>
											<div className="row  p-xl-0">
												{Array.from({length: 12}, (_, i) => i + 1).map((i) => (
													<div className="col-lg-2 col-md-4 col-6 " key={i}>
														<div className="">
															<CardSkeleton />
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

export default BestPickSkeleton;
