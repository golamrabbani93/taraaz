import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
	baseUrl: process.env.NEXT_PUBLIC_API_URL,
	prepareHeaders: async (headers, {getState}) => {
		const token = process.env.NEXT_PUBLIC_TOKEN;
		if (token) {
			headers.set('Authorization', `Token ${token}`);
		}
		return headers;
	},
});

export const baseApi = createApi({
	reducerPath: 'baseApi',
	baseQuery,
	tagTypes: [
		'auth',
		'user',
		'order',
		'product',
		'message',
		'banner',
		'BottomBanners',
		'video',
		'blog',
		'companyContact',
		'websiteTitle',
		'faq',
		'category',
	],
	endpoints: (builder) => ({}),
});
