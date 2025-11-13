import {CartProvider} from '@/components/header/CartContext';
import {WishlistProvider} from '@/components/header/WishlistContext';
import {ToastContainer, toast} from 'react-toastify';
import {ThemeProvider} from '@/components/header/ThemeContext';
import HeaderFive from '@/components/header/HeaderFive';
import BannerFive from '@/components/banner/BannerFive';

import FooterThree from '@/components/footer/FooterThree';

import BestSellingWrap from '@/components/product/BestSellingWrap';
import ShortService from '@/components/service/ShortService';
import BackToTop from '@/components/common/BackToTop';
import FeatureCard from '@/components/FeatureCard/FeatureCard';
import BestPickForYou from '@/components/product/BestPickForYou';
import BestVideos from '@/components/product/BestVideos';
import HomePageAd from '@/components/banner/HomePageAd';
import BottomNav from '@/components/BottomNav/BottomNav';
import {
	getProductsSSR,
	prefetchBanners,
	prefetchBottomBanners,
	prefetchVideos,
	prefetchWebsiteTitles,
} from '@/lib/serverPrefetch';
import BottomCategory from '@/components/bottom-category/BottomCategory';
import DeskCategory from '@/components/bottom-category/DeskCategory';
export default async function Home() {
	const banner = await prefetchBanners();
	const bottomBanner = await prefetchBottomBanners();
	const video = await prefetchVideos();
	const title = await prefetchWebsiteTitles();
	const bannerState = banner?.baseApi?.queries?.['getAllBanners("")']?.data ?? [];
	const bottomBannerState = bottomBanner?.baseApi?.queries?.['getAllBottomBanners("")']?.data ?? [];
	const videoState = video?.baseApi?.queries?.['getAllVideos("")']?.data ?? [];
	const titleState = title?.baseApi?.queries?.['getAllWebsiteTitles("")']?.data ?? [];
	const productData = await getProductsSSR();
	return (
		<ThemeProvider>
			<WishlistProvider>
				<CartProvider>
					<div className="index-five">
						<ToastContainer position="top-right" autoClose={3000} />
						<HeaderFive />
						<BottomCategory />
						<DeskCategory />
						<BannerFive data={bannerState} />
						<FeatureCard />
						<HomePageAd data={Array.isArray(bottomBannerState) ? bottomBannerState : []} />
						<BestPickForYou
							data={productData}
							title={Array.isArray(titleState) ? titleState : []}
						/>
						<BestVideos
							data={Array.isArray(videoState) ? videoState : []}
							title={Array.isArray(titleState) ? titleState : []}
						/>
						{/* <FeatureCategory /> */}
						{/* <BestDiscount /> */}

						<BestSellingWrap
							head={true}
							data={productData}
							title={Array.isArray(titleState) ? titleState : []}
						/>
						{/* <RecentlyAddedTwo /> */}
						{/* <BlogFive /> */}
						<ShortService />
						<FooterThree />
						<BackToTop />
						{/* <BottomNav /> */}
						<BottomNav />
					</div>
				</CartProvider>
			</WishlistProvider>
		</ThemeProvider>
	);
}
