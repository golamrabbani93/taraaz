import {baseApi} from '@/redux/baseApi';
import {toast} from 'react-toastify';

export const bannerManagementApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getAllBanners: builder.query({
			query: () => ({
				url: `tarazBanner`,
				method: 'GET',
			}),
			providesTags: ['banner'],
			transformResponse: (response) => response,
		}),
		deleteBanner: builder.mutation({
			query: (id) => ({
				url: `tarazBanner/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['banner'],
			transformResponse: (response) => {
				toast.success('Banner deleted successfully');
				return response;
			},
		}),
		createBanner: builder.mutation({
			query: (data) => ({
				url: `tarazBanner/new`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['banner'],
			transformResponse: (response) => {
				if (response) {
					toast.success('Banner created successfully');
					return response;
				}
			},
		}),
	}),
});

export const {useGetAllBannersQuery, useDeleteBannerMutation, useCreateBannerMutation} =
	bannerManagementApi;
