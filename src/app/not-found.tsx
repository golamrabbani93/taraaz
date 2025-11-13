import BottomCategory from '@/components/bottom-category/BottomCategory';
import DeskCategory from '@/components/bottom-category/DeskCategory';
import BottomNav from '@/components/BottomNav/BottomNav';
import FooterThree from '@/components/footer/FooterThree';
import HeaderFive from '@/components/header/HeaderFive';
import ShortService from '@/components/service/ShortService';
import Link from 'next/link';

export default function Custom404() {
	return (
		<div className="demo-one">
			<HeaderFive />
			<BottomCategory />
			<DeskCategory />
			<div className="error-area-main-wrapper rts-section-gap2">
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<div className="error-main-wrapper">
								<div className="thumbnail">
									<img src="/assets/images/contact/01.png" alt="error" />
								</div>
								<div className="content-main">
									<h2 className="title">This Page Can’t Be Found</h2>
									<p>
										Sorry, we couldn't find the page you where looking for. We suggest that you
										return to homepage.
									</p>
									<Link href="/" className="rts-btn btn-primary">
										Back To Homepage
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<BottomNav />
			<ShortService />
			<FooterThree />
		</div>
	);
}
