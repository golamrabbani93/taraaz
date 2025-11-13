import {baseApi} from '@/redux/baseApi';
import {toast} from 'react-toastify';

export const bottomBannerManagementApi = baseApi.injectEndpoints({
	endpoints: (builder) => ({
		getAllBottomBanners: builder.query({
			query: () => ({
				url: `tarazBottomBanner`,
				method: 'GET',
			}),
			providesTags: ['BottomBanners'],
			transformResponse: (response) => response,
		}),
		deleteBottomBanner: builder.mutation({
			query: (id) => ({
				url: `tarazBottomBanner/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['BottomBanners'],
			transformResponse: (response) => {
				toast.success('Banner deleted successfully');
				return response;
			},
		}),
		createBottomBanner: builder.mutation({
			query: (data) => ({
				url: `tarazBottomBanner/new`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: ['BottomBanners'],
			transformResponse: (response) => {
				if (response) {
					toast.success('Banner created successfully');
					return response;
				}
			},
		}),
	}),
});

export const {
	useGetAllBottomBannersQuery,
	useDeleteBottomBannerMutation,
	useCreateBottomBannerMutation,
} = bottomBannerManagementApi;
