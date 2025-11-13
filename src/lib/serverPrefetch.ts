// make prefecth for banners
import {store} from '@/redux/store';
import {bannerManagementApi} from '@/redux/features/banner/bannerApi';
import {productManagementApi} from '@/redux/features/product/productApi';
import {bottomBannerManagementApi} from '@/redux/features/bottomBanner/bottomBannerApi';
import {websiteTitleManagementApi} from '@/redux/features/companyTitle/companyTitle';
import {videoManagementApi} from '@/redux/features/video/videoApi';

export async function prefetchBanners() {
	// Create a new store instance
	const dispatch = store.dispatch;
	await dispatch(bannerManagementApi.endpoints.getAllBanners.initiate('', {forceRefetch: true}));
	return store.getState(); // the state will contain the banners
}

// make prefecth for products

export async function prefetchProducts() {
	// Create a new store instance
	const dispatch = store.dispatch;
	await dispatch(productManagementApi.endpoints.getAllProducts.initiate('', {forceRefetch: true}));
	return store.getState(); // the state will contain the products
}

//make bottom banner prefecth
export async function prefetchBottomBanners() {
	// Create a new store instance
	const dispatch = store.dispatch;
	await dispatch(
		bottomBannerManagementApi.endpoints.getAllBottomBanners.initiate('', {
			forceRefetch: true,
		}),
	);
	return store.getState(); // the state will contain the banners
}

//make title prefecth
export async function prefetchWebsiteTitles() {
	// Create a new store instance
	const dispatch = store.dispatch;
	await dispatch(
		websiteTitleManagementApi.endpoints.getAllWebsiteTitles.initiate('', {
			forceRefetch: true,
		}),
	);
	return store.getState(); // the state will contain the website titles
}

// make video prefecth

export async function prefetchVideos() {
	// Create a new store instance
	const dispatch = store.dispatch;
	await dispatch(videoManagementApi.endpoints.getAllVideos.initiate('', {forceRefetch: true}));
	return store.getState(); // the state will contain the videos
}

//use next js fetch for prefetch products
export async function getProductsSSR() {
	const res = await fetch(`https://taraz.qwikbistro.shop/tarazProduct/`, {
		cache: 'no-store', // Disable caching for SSR
		next: {revalidate: 0}, // Ensure no revalidation
	});
	return res.json();
}
