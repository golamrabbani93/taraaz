import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function CardSkeleton() {
	return (
		<>
			<div className="image-and-action-area-wrapper">
				<div className="thumbnail-preview">
					<Skeleton className=" w-full h-40 rounded-md" style={{height: '150px', width: '100%'}} />
				</div>

				<div className="action-share-option">
					<span className="single-action openuptip message-show-action">
						<div className=" w-6 h-6 rounded-full" />
					</span>
					<span className="single-action openuptip cta-quickview product-details-popup-btn ms-1">
						<div className=" w-6 h-6 rounded-full" />
					</span>
				</div>
			</div>
		</>
	);
}
