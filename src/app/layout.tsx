import type {Metadata} from 'next';
import {Geist, Geist_Mono} from 'next/font/google';
import './globals.css';
import '../../public/assets/css/bootstrap.min.css';
import '../../public/assets/css/plugins.css';
import '../../public/assets/css/style.css';

import {CartProvider} from '../components/header/CartContext';
import {WishlistProvider} from '../components/header/WishlistContext';

import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import {ThemeProvider} from '@/components/header/ThemeContext';

import Providers from '@/redux/Providers';
import VisitorCount from '@/components/VisitorCount/VisitorCount';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'ZafranshopBD',
	description: 'Bangladesh No. 1 Online Hair Oil Shop',
	icons: {
		icon: [
			{
				url: 'favicon.ico',
				type: 'image/x-icon',
			},
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable}`}
				suppressHydrationWarning={true}
			>
				<Providers>
					<ThemeProvider>
						<WishlistProvider>
							<CartProvider>
								<VisitorCount />
								{children}

								<ToastContainer position="top-right" autoClose={3000} />
							</CartProvider>
						</WishlistProvider>
					</ThemeProvider>
				</Providers>
			</body>
		</html>
	);
}
