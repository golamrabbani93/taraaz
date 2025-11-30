import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
	images: {
		unoptimized: false,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'fitback.shop',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
			},
			{
				protocol: 'https',
				hostname: 'res.cloudinary.com',
			},
			{
				protocol: 'https',
				hostname: 'images.unsplash.com',
			},
			{
				protocol: 'https',
				hostname: 'taraz.qwikbistro.shop',
			},
		],
	},
};

export default nextConfig;
