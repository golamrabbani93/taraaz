interface FeatureCardProps {
	imgSrc: string;
	title: string;
	description: string;
}

const SingleCard = ({imgSrc, title, description}: FeatureCardProps) => {
	return (
		// <div className="col-md-4 col-sm-6 col-12 mb-3">
		<div className="card h-100 shadow-lg border-0 rounded-5">
			<div className="card-body d-flex align-items-center">
				<div className="ms-2">
					<h6 className="fs-2 fw-bold mb-1">{title}</h6>
					<p className="text-muted mb-0">{description}</p>
				</div>
				<img
					src={imgSrc}
					alt={title}
					className="ms-auto"
					style={{width: '120px', height: '120px', objectFit: 'contain'}}
				/>
			</div>
		</div>
		// </div>
	);
};

export default SingleCard;
